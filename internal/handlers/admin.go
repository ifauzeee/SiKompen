package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sikompen-backend/internal/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AdminHandler struct {
	DB *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{DB: db}
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

	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var student models.User
		if err := tx.First(&student, uint(studentId)).Error; err != nil {
			return fmt.Errorf("student not found")
		}

		oldHours := student.TotalHours
		student.TotalHours = req.NewHours
		if student.TotalHours < 0 {
			student.TotalHours = 0
		}

		if err := tx.Save(&student).Error; err != nil {
			return err
		}

		details, _ := json.Marshal(map[string]interface{}{
			"studentName": student.Name,
			"oldHours":    oldHours,
			"newHours":    student.TotalHours,
			"reason":      req.Reason,
		})

		tx.Create(&models.ActivityLog{
			UserID:     ptrUint(adminId.(uint)),
			Action:     "UPDATE_HOURS",
			TargetType: "USER",
			TargetID:   ptrUint(uint(studentId)),
			Details:    ptrString(string(details)),
			CreatedAt:  time.Now(),
		})

		return nil
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

	var logs []models.ActivityLog
	if err := h.DB.Order("created_at desc").Limit(limit).Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

func (h *AdminHandler) GetSystemSettings(c *gin.Context) {
	var settings []models.SystemSettings
	if err := h.DB.Find(&settings).Error; err != nil {
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

	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var setting models.SystemSettings
		err := tx.Where("key = ?", key).First(&setting).Error
		if err != nil {
			// Create new
			setting = models.SystemSettings{
				Key:       key,
				Value:     req.Value,
				UpdatedAt: time.Now(),
			}
			if err := tx.Create(&setting).Error; err != nil {
				return err
			}
		} else {
			// Update
			setting.Value = req.Value
			setting.UpdatedAt = time.Now()
			if err := tx.Save(&setting).Error; err != nil {
				return err
			}
		}

		details, _ := json.Marshal(map[string]interface{}{
			"key":   key,
			"value": req.Value,
		})

		tx.Create(&models.ActivityLog{
			UserID:     ptrUint(adminId.(uint)),
			Action:     "UPDATE_SETTINGS",
			TargetType: "SYSTEM",
			Details:    ptrString(string(details)),
			CreatedAt:  time.Now(),
		})

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

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

		// Hash default password (same as NIM)
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

		if err := h.DB.Create(&user).Error; err != nil {
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

	h.DB.Create(&models.ActivityLog{
		UserID:     ptrUint(adminId.(uint)),
		Action:     "IMPORT_STUDENTS",
		TargetType: "USER",
		Details:    ptrString(string(details)),
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

	query := h.DB.Model(&models.User{}).Where("role = ?", "MAHASISWA")

	if prodi != "" {
		query = query.Where("prodi = ?", prodi)
	}
	if kelas != "" {
		query = query.Where("kelas = ?", kelas)
	}
	if hasDebt {
		query = query.Where("total_hours > 0")
	}

	var students []struct {
		NIM        string `json:"nim"`
		Name       string `json:"name"`
		Prodi      string `json:"prodi"`
		Kelas      string `json:"kelas"`
		TotalHours int    `json:"totalHours"`
	}

	if err := query.Order("kelas asc, name asc").Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch students"})
		return
	}

	c.JSON(http.StatusOK, students)
}
