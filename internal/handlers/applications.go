package handlers

import (
	"fmt"
	"net/http"
	"sikompen-backend/internal/models"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ApplicationHandler struct {
	AppRepo   repository.ApplicationRepository
	JobRepo   repository.JobRepository
	UserRepo  repository.UserRepository
	AdminRepo repository.AdminRepository
	NotifRepo repository.NotificationRepository
	DB        *gorm.DB
}

func NewApplicationHandler(appRepo repository.ApplicationRepository, jobRepo repository.JobRepository, userRepo repository.UserRepository, adminRepo repository.AdminRepository, notifRepo repository.NotificationRepository, db *gorm.DB) *ApplicationHandler {
	return &ApplicationHandler{
		AppRepo:   appRepo,
		JobRepo:   jobRepo,
		UserRepo:  userRepo,
		AdminRepo: adminRepo,
		NotifRepo: notifRepo,
		DB:        db,
	}
}

func (h *ApplicationHandler) ApplyForJob(c *gin.Context) {
	jobIdStr := c.Param("jobId")
	jobId, err := strconv.ParseUint(jobIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Job ID"})
		return
	}

	userId, _ := c.Get("userId")
	uid := userId.(uint)

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := tx.First(&user, uid).Error; err != nil {
			return fmt.Errorf("user not found")
		}

		if user.Role != "MAHASISWA" {
			return fmt.Errorf("only students can apply")
		}

		if user.TotalHours <= 0 {
			return fmt.Errorf("no debt to pay")
		}

		var job models.Job
		if err := tx.First(&job, uint(jobId)).Error; err != nil {
			return fmt.Errorf("job not found")
		}

		if job.Status != "OPEN" || job.Quota <= 0 {
			return fmt.Errorf("job is closed or full")
		}

		var existingApp models.JobApplication
		if err := tx.Where("job_id = ? AND user_id = ?", uint(jobId), uid).First(&existingApp).Error; err == nil {
			return fmt.Errorf("already applied")
		}

		var activeAppsCount int64
		tx.Model(&models.JobApplication{}).Where("user_id = ? AND status = 'PENDING'", uid).Count(&activeAppsCount)
		if activeAppsCount >= 3 {
			return fmt.Errorf("too many active applications (max 3)")
		}

		app := models.JobApplication{
			JobID:     uint(jobId),
			UserID:    uid,
			Status:    "PENDING",
			AppliedAt: time.Now(),
		}

		return tx.Create(&app).Error
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true})
}

type UpdateAppStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func (h *ApplicationHandler) UpdateStatus(c *gin.Context) {
	appIdStr := c.Param("id")
	appId, _ := strconv.ParseUint(appIdStr, 10, 32)

	var req UpdateAppStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminId, _ := c.Get("userId")
	adminRole, _ := c.Get("role")

	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var app models.JobApplication
		if err := tx.Preload("Job").Preload("User").First(&app, uint(appId)).Error; err != nil {
			return fmt.Errorf("application not found")
		}

		if adminRole == "PENGAWAS" && app.Job.CreatedByID != nil && *app.Job.CreatedByID != adminId.(uint) {
			return fmt.Errorf("unauthorized access to this application")
		}

		statusFrom := app.Status
		newStatus := req.Status

		switch newStatus {
		case "ACCEPTED":
			if app.Status != "PENDING" {
				return fmt.Errorf("only pending applications can be accepted")
			}
			if app.Job.Quota <= 0 {
				return fmt.Errorf("job quota is full")
			}

			if err := tx.Model(&app.Job).Update("quota", gorm.Expr("quota - ?", 1)).Error; err != nil {
				return err
			}

			var updatedJob models.Job
			tx.First(&updatedJob, app.JobID)
			if updatedJob.Quota <= 0 {
				tx.Model(&updatedJob).Update("status", "CLOSED")
			}

		case "COMPLETED":
			if app.Status != "ACCEPTED" && app.Status != "VERIFYING" {
				return fmt.Errorf("only accepted or verifying applications can be completed")
			}

			hoursToDeduct := app.Job.Hours
			newDebt := app.User.TotalHours - hoursToDeduct
			if newDebt < 0 {
				newDebt = 0
			}

			if err := tx.Model(&app.User).Update("total_hours", newDebt).Error; err != nil {
				return err
			}

			if newDebt <= 0 && app.User.TotalHours > 0 {
				var existingClearance models.ClearanceRequest
				if err := tx.Where("user_id = ?", app.UserID).First(&existingClearance).Error; err != nil {
					tx.Create(&models.ClearanceRequest{UserID: app.UserID, Status: "PENDING", RequestedAt: time.Now()})
				}
			}

		case "REJECTED":
			if app.Status == "ACCEPTED" || app.Status == "VERIFYING" {
				tx.Model(&app.Job).Updates(map[string]interface{}{
					"quota":  gorm.Expr("quota + ?", 1),
					"status": "OPEN",
				})
			}
		default:
			return fmt.Errorf("invalid status")
		}

		app.Status = newStatus
		if err := tx.Save(&app).Error; err != nil {
			return err
		}

		_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
			UserID:     utils.PtrUint(adminId.(uint)),
			Action:     fmt.Sprintf("UPDATE_APPLICATION_%s", newStatus),
			TargetType: "APPLICATION",
			TargetID:   utils.PtrUint(uint(appId)),
			Details:    utils.PtrString(fmt.Sprintf("Status changed from %s to %s", statusFrom, newStatus)),
			CreatedAt:  time.Now(),
		})

		var notifTitle, notifMsg string
		switch newStatus {
		case "ACCEPTED":
			notifTitle = "Lamaran Diterima"
			notifMsg = fmt.Sprintf("Selamat! Lamaran Anda untuk pekerjaan '%s' telah diterima.", app.Job.Title)
		case "REJECTED":
			notifTitle = "Lamaran Ditolak"
			notifMsg = fmt.Sprintf("Maaf, lamaran Anda untuk pekerjaan '%s' ditolak.", app.Job.Title)
		case "COMPLETED":
			notifTitle = "Pekerjaan Selesai"
			notifMsg = fmt.Sprintf("Bukti pengerjaan untuk '%s' telah diverifikasi. Jam kompen Anda telah diperbarui.", app.Job.Title)
		}

		if notifTitle != "" {
			_ = h.NotifRepo.Create(&models.Notification{
				UserID:    app.UserID,
				Title:     notifTitle,
				Message:   notifMsg,
				CreatedAt: time.Now(),
			})
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *ApplicationHandler) SubmitProof(c *gin.Context) {
	appIdStr := c.Param("id")
	appId, _ := strconv.ParseUint(appIdStr, 10, 32)
	userId, _ := c.Get("userId")

	app, err := h.AppRepo.GetByID(uint(appId))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Application not found"})
		return
	}

	if app.UserID != userId.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	if app.Status != "ACCEPTED" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only accepted applications can submit proof"})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	files := form.File["proof"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "At least one proof file is required"})
		return
	}

	for i, file := range files {
		filename, err := utils.SaveUpload(file, "uploads/proofs")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		path := "/uploads/proofs/" + filename
		switch i {
		case 0:
			app.ProofImage1 = &path
		case 1:
			app.ProofImage2 = &path
		}
	}

	note := c.PostForm("note")
	app.SubmissionNote = &note
	app.Status = "VERIFYING"

	if err := h.AppRepo.Update(app); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update application"})
		return
	}

	_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
		UserID:     utils.PtrUint(userId.(uint)),
		Action:     "SUBMIT_PROOF",
		TargetType: "APPLICATION",
		TargetID:   utils.PtrUint(uint(appId)),
		Details:    utils.PtrString("Submitted proof via file upload"),
		CreatedAt:  time.Now(),
	})

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *ApplicationHandler) GetByStatus(c *gin.Context) {
	status := c.Query("status")
	if status == "" {
		status = "PENDING"
	}

	userId, _ := c.Get("userId")
	role, _ := c.Get("role")

	var mid *uint
	if role.(string) == "PENGAWAS" {
		uid := userId.(uint)
		mid = &uid
	}

	apps, err := h.AppRepo.GetByStatus(status, mid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch applications"})
		return
	}

	c.JSON(http.StatusOK, apps)
}
