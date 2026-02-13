package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sikompen-backend/internal/models"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCreateJob_Success(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "admin", "admin123", "ADMIN")

	handler := NewJobHandler(db)
	r := setupRouter()
	r.POST("/api/jobs", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", "ADMIN")
	}, handler.CreateJob)

	body, _ := json.Marshal(JobRequest{
		Title:       "Clean Library",
		Description: "Help clean the library shelves",
		Hours:       2,
		Quota:       5,
	})

	req, _ := http.NewRequest("POST", "/api/jobs", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected status 201, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["title"] != "Clean Library" {
		t.Errorf("expected title 'Clean Library', got '%v'", resp["title"])
	}
}

func TestGetJobs_Success(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "admin", "admin123", "ADMIN")

	db.Create(&models.Job{Title: "Job 1", Description: "Desc 1", Hours: 1, Quota: 1, CreatedByID: &user.ID})
	db.Create(&models.Job{Title: "Job 2", Description: "Desc 2", Hours: 2, Quota: 3, CreatedByID: &user.ID})

	handler := NewJobHandler(db)
	r := setupRouter()
	r.GET("/api/jobs", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", "ADMIN")
	}, handler.GetJobs)

	req, _ := http.NewRequest("GET", "/api/jobs", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var jobs []map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &jobs)
	if len(jobs) != 2 {
		t.Errorf("expected 2 jobs, got %d", len(jobs))
	}
}

func TestDeleteJob_Success(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "admin", "admin123", "ADMIN")

	job := models.Job{Title: "Delete Me", Description: "Desc", Hours: 1, Quota: 1, CreatedByID: &user.ID}
	db.Create(&job)

	handler := NewJobHandler(db)
	r := setupRouter()
	r.DELETE("/api/jobs/:id", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", "ADMIN")
	}, handler.DeleteJob)

	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/api/jobs/%d", job.ID), nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestToggleStatus_Success(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "admin", "admin123", "ADMIN")

	job := models.Job{Title: "Toggle Me", Description: "Desc", Hours: 1, Quota: 1, Status: "OPEN", CreatedByID: &user.ID}
	db.Create(&job)

	handler := NewJobHandler(db)
	r := setupRouter()
	r.PATCH("/api/jobs/:id/status", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", "ADMIN")
	}, handler.ToggleStatus)

	req, _ := http.NewRequest("PATCH", fmt.Sprintf("/api/jobs/%d/status", job.ID), nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["status"] != "CLOSED" {
		t.Errorf("expected status 'CLOSED', got '%v'", resp["status"])
	}
}
