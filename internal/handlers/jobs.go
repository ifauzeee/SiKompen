package handlers

import (
	"encoding/json"
	"net/http"
	"sikompen-backend/internal/models"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type JobHandler struct {
	JobRepo repository.JobRepository
	AppRepo repository.ApplicationRepository
}

func NewJobHandler(jobRepo repository.JobRepository, appRepo repository.ApplicationRepository) *JobHandler {
	return &JobHandler{JobRepo: jobRepo, AppRepo: appRepo}
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

	if err := h.JobRepo.Create(&job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job"})
		return
	}

	utils.DeleteCache("jobs:all")
	utils.DeleteCache("stats:admin_global")
	c.JSON(http.StatusCreated, job)
}

func (h *JobHandler) GetJobs(c *gin.Context) {
	cacheKey := "jobs:all"
	if cached, err := utils.GetCache(cacheKey); err == nil {
		var jobs []models.Job
		if json.Unmarshal([]byte(cached), &jobs) == nil {
			c.JSON(http.StatusOK, gin.H{
				"jobs":       jobs,
				"from_cache": true,
			})
			return
		}
	}

	jobs, err := h.JobRepo.GetAll(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
		return
	}

	if jobsJson, err := json.Marshal(jobs); err == nil {
		utils.SetCache(cacheKey, string(jobsJson), 5*time.Minute)
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

	job, err := h.JobRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	count, _ := h.AppRepo.GetCountByJobID(uint(id))
	if count > 0 && job.Hours != req.Hours {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot change hours when applications exist"})
		return
	}

	job.Title = req.Title
	job.Description = req.Description
	job.Hours = req.Hours
	job.Quota = req.Quota

	if err := h.JobRepo.Update(job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update job"})
		return
	}

	utils.DeleteCache("jobs:all")
	utils.DeleteCache("stats:admin_global")
	c.JSON(http.StatusOK, job)
}

func (h *JobHandler) DeleteJob(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	err = h.JobRepo.Delete(uint(id))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete job"})
		return
	}

	utils.DeleteCache("jobs:all")
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *JobHandler) ToggleStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	job, err := h.JobRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	if job.Status == "OPEN" {
		job.Status = "CLOSED"
	} else {
		job.Status = "OPEN"
	}

	if err := h.JobRepo.Update(job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle status"})
		return
	}

	utils.DeleteCache("jobs:all")
	utils.DeleteCache("stats:admin_global")
	c.JSON(http.StatusOK, gin.H{"status": job.Status})
}
