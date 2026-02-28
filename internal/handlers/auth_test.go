package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"sikompen-backend/internal/models"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/services"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Job{},
		&models.JobApplication{},
		&models.ClearanceRequest{},
		&models.ActivityLog{},
		&models.SystemSettings{},
		&models.Payment{},
	); err != nil {
		t.Fatalf("failed to migrate test db: %v", err)
	}

	return db
}

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	return gin.New()
}

func seedTestUser(t *testing.T, db *gorm.DB, username, password, role string) models.User {
	t.Helper()
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	name := "Test User"
	user := models.User{
		Username: username,
		Password: string(hashed),
		Role:     role,
		Name:     &name,
	}
	if err := db.Create(&user).Error; err != nil {
		t.Fatalf("failed to seed test user: %v", err)
	}
	return user
}

func TestLogin_Success(t *testing.T) {
	db := setupTestDB(t)
	seedTestUser(t, db, "admin", "password123", "ADMIN")

	os.Setenv("JWT_SECRET", "test-secret")
	defer os.Unsetenv("JWT_SECRET")

	authService := services.NewAuthService(repository.NewGormUserRepository(db))
	handler := NewAuthHandler(authService)
	r := setupRouter()
	r.POST("/api/login", handler.Login)

	body, _ := json.Marshal(LoginRequest{Identifier: "admin", Password: "password123"})
	req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if _, ok := resp["token"]; !ok {
		t.Error("expected token in response")
	}

	user, ok := resp["user"].(map[string]interface{})
	if !ok {
		t.Fatal("expected user object in response")
	}
	if user["username"] != "admin" {
		t.Errorf("expected username 'admin', got '%v'", user["username"])
	}
}

func TestLogin_InvalidPassword(t *testing.T) {
	db := setupTestDB(t)
	seedTestUser(t, db, "admin", "password123", "ADMIN")

	authService := services.NewAuthService(repository.NewGormUserRepository(db))
	handler := NewAuthHandler(authService)
	r := setupRouter()
	r.POST("/api/login", handler.Login)

	body, _ := json.Marshal(LoginRequest{Identifier: "admin", Password: "wrong"})
	req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected status 401, got %d", w.Code)
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	db := setupTestDB(t)
	authService := services.NewAuthService(repository.NewGormUserRepository(db))
	handler := NewAuthHandler(authService)
	r := setupRouter()
	r.POST("/api/login", handler.Login)

	body, _ := json.Marshal(LoginRequest{Identifier: "nonexistent", Password: "pass"})
	req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected status 401, got %d", w.Code)
	}
}

func TestGetMe_Success(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "student", "pass123", "MAHASISWA")

	authService := services.NewAuthService(repository.NewGormUserRepository(db))
	handler := NewAuthHandler(authService)
	r := setupRouter()
	r.GET("/api/me", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", user.Role)
	}, handler.GetMe)

	req, _ := http.NewRequest("GET", "/api/me", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}
	if resp["username"] != "student" {
		t.Errorf("expected username 'student', got '%v'", resp["username"])
	}
}
