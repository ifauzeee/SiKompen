package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sikompen-backend/internal/models"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AdminHandler struct {
	AdminRepo repository.AdminRepository
	UserRepo  repository.UserRepository
}

func NewAdminHandler(adminRepo repository.AdminRepository, userRepo repository.UserRepository) *AdminHandler {
	return &AdminHandler{AdminRepo: adminRepo, UserRepo: userRepo}
}

type UpdateHoursRequest struct {
	NewHours int    `json:"newHours" binding:"required"`
	Reason   string `json:"reason" binding:"required"`
}

func (h *AdminHandler) UpdateStudentHours(c *gin.Context) {
	studentIdStr := c.Param("id")
	studentId, _ := strconv.ParseUint(studentIdStr, 10, 32)

	var req UpdateHoursRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminId, _ := c.Get("userId")

	student, err := h.UserRepo.GetByID(uint(studentId))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student not found"})
		return
	}

	oldHours := student.TotalHours
	student.TotalHours = req.NewHours
	if student.TotalHours < 0 {
		student.TotalHours = 0
	}

	if err := h.UserRepo.Update(student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to update student"})
		return
	}

	err = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
		UserID:     utils.PtrUint(adminId.(uint)),
		Action:     "UPDATE_STUDENT_HOURS",
		TargetType: "USER",
		TargetID:   utils.PtrUint(uint(studentId)),
		Details:    utils.PtrString(fmt.Sprintf("Hours updated from %d to %d. Reason: %s", oldHours, req.NewHours, req.Reason)),
		CreatedAt:  time.Now(),
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *AdminHandler) GetActivityLogs(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "50")
	limit, _ := strconv.Atoi(limitStr)

	logs, err := h.AdminRepo.GetActivityLogs(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

func (h *AdminHandler) GetSystemSettings(c *gin.Context) {
	settings, err := h.AdminRepo.GetSystemSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch settings"})
		return
	}
	c.JSON(http.StatusOK, settings)
}

type UpdateSettingRequest struct {
	Value string `json:"value" binding:"required"`
}

func (h *AdminHandler) UpdateSystemSetting(c *gin.Context) {
	key := c.Param("key")
	var req UpdateSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminId, _ := c.Get("userId")

	setting, err := h.AdminRepo.GetSystemSettingByKey(key)
	if err != nil {
		setting = &models.SystemSettings{
			Key:       key,
			Value:     req.Value,
			UpdatedAt: time.Now(),
		}
	} else {
		setting.Value = req.Value
		setting.UpdatedAt = time.Now()
	}

	if err := h.AdminRepo.UpdateSystemSetting(setting); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update setting"})
		return
	}

	_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
		UserID:     utils.PtrUint(adminId.(uint)),
		Action:     "UPDATE_SETTING",
		TargetType: "SETTING",
		TargetID:   utils.PtrUint(setting.ID),
		Details:    utils.PtrString(fmt.Sprintf("Key: %s, Value: %s", setting.Key, setting.Value)),
		CreatedAt:  time.Now(),
	})

	c.JSON(http.StatusOK, gin.H{"success": true})
}

type StudentImport struct {
	NIM   string `json:"nim" binding:"required"`
	Name  string `json:"name" binding:"required"`
	Prodi string `json:"prodi"`
	Kelas string `json:"kelas"`
}

func (h *AdminHandler) ImportStudents(c *gin.Context) {
	var students []StudentImport
	if err := c.ShouldBindJSON(&students); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminId, _ := c.Get("userId")

	var successCount, skipCount, errorCount int

	for _, s := range students {
		if s.NIM == "" || s.Name == "" {
			skipCount++
			continue
		}

		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(s.NIM), bcrypt.DefaultCost)

		user := models.User{
			Username:   s.NIM,
			NIM:        &s.NIM,
			Name:       &s.Name,
			Prodi:      &s.Prodi,
			Kelas:      &s.Kelas,
			Password:   string(hashedPassword),
			Role:       "MAHASISWA",
			TotalHours: 0,
		}

		if err := h.UserRepo.Create(&user); err != nil {
			skipCount++
		} else {
			successCount++
		}
	}

	details, _ := json.Marshal(map[string]interface{}{
		"successCount": successCount,
		"skipCount":    skipCount,
		"errorCount":   errorCount,
	})

	_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
		UserID:     utils.PtrUint(adminId.(uint)),
		Action:     "IMPORT_STUDENTS",
		TargetType: "USER",
		Details:    utils.PtrString(string(details)),
		CreatedAt:  time.Now(),
	})

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"successCount": successCount,
		"skipCount":    skipCount,
		"errorCount":   errorCount,
	})
}

func (h *AdminHandler) GetStudentsForExport(c *gin.Context) {
	prodi := c.Query("prodi")
	kelas := c.Query("kelas")
	hasDebt := c.Query("hasDebt") == "true"

	filters := map[string]interface{}{
		"role": "MAHASISWA",
	}
	if prodi != "" {
		filters["prodi"] = prodi
	}
	if kelas != "" {
		filters["kelas"] = kelas
	}

	students, err := h.UserRepo.GetAll(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch students"})
		return
	}

	result := []struct {
		NIM        string `json:"nim"`
		Name       string `json:"name"`
		Prodi      string `json:"prodi"`
		Kelas      string `json:"kelas"`
		TotalHours int    `json:"totalHours"`
	}{}

	for _, s := range students {
		if hasDebt && s.TotalHours <= 0 {
			continue
		}
		result = append(result, struct {
			NIM        string `json:"nim"`
			Name       string `json:"name"`
			Prodi      string `json:"prodi"`
			Kelas      string `json:"kelas"`
			TotalHours int    `json:"totalHours"`
		}{
			NIM:        *s.NIM,
			Name:       *s.Name,
			Prodi:      *s.Prodi,
			Kelas:      *s.Kelas,
			TotalHours: s.TotalHours,
		})
	}

	c.JSON(http.StatusOK, result)
}
