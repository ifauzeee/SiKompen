package handlers

import (
	"net/http"
	"sikompen-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type JobHandler struct {
	DB *gorm.DB
}

func NewJobHandler(db *gorm.DB) *JobHandler {
	return &JobHandler{DB: db}
}

type JobRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Hours       int    `json:"hours" binding:"required"`
	Quota       int    `json:"quota" binding:"required"`
}

func (h *JobHandler) CreateJob(c *gin.Context) {
	var req JobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId, _ := c.Get("userId")
	uid := userId.(uint)

	job := models.Job{
		Title:       req.Title,
		Description: req.Description,
		Hours:       req.Hours,
		Quota:       req.Quota,
		Category:    "UMUM",
		Status:      "OPEN",
		CreatedByID: &uid,
	}

	if err := h.DB.Create(&job).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job"})
		return
	}

	c.JSON(http.StatusCreated, job)
}

func (h *JobHandler) GetJobs(c *gin.Context) {
	var jobs []models.Job
	if err := h.DB.Preload("CreatedBy").Find(&jobs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func (h *JobHandler) UpdateJob(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req JobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var job models.Job
	if err := h.DB.First(&job, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	var count int64
	h.DB.Model(&models.JobApplication{}).Where("job_id = ?", id).Count(&count)
	if count > 0 && job.Hours != req.Hours {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot change hours when applications exist"})
		return
	}

	job.Title = req.Title
	job.Description = req.Description
	job.Hours = req.Hours
	job.Quota = req.Quota

	if err := h.DB.Save(&job).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update job"})
		return
	}

	c.JSON(http.StatusOK, job)
}

func (h *JobHandler) DeleteJob(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("job_id = ?", uint(id)).Delete(&models.JobApplication{}).Error; err != nil {
			return err
		}
		if err := tx.Delete(&models.Job{}, uint(id)).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *JobHandler) ToggleStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var job models.Job
	if err := h.DB.First(&job, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	if job.Status == "OPEN" {
		job.Status = "CLOSED"
	} else {
		job.Status = "OPEN"
	}

	if err := h.DB.Save(&job).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": job.Status})
}
