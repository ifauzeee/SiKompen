package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCreateUser_Success(t *testing.T) {
	db := setupTestDB(t)
	seedTestUser(t, db, "admin", "admin123", "ADMIN")

	handler := NewUserHandler(db)
	r := setupRouter()
	r.POST("/api/admin/users", func(c *gin.Context) {
		c.Set("userId", uint(1))
		c.Set("role", "ADMIN")
	}, handler.CreateUser)

	body, _ := json.Marshal(CreateUserRequest{
		Name:     "New Student",
		Username: "student1",
		Password: "password123",
		Role:     "MAHASISWA",
	})

	req, _ := http.NewRequest("POST", "/api/admin/users", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected status 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestCreateUser_DuplicateUsername(t *testing.T) {
	db := setupTestDB(t)
	seedTestUser(t, db, "existing", "pass123", "MAHASISWA")

	handler := NewUserHandler(db)
	r := setupRouter()
	r.POST("/api/admin/users", func(c *gin.Context) {
		c.Set("userId", uint(1))
		c.Set("role", "ADMIN")
	}, handler.CreateUser)

	body, _ := json.Marshal(CreateUserRequest{
		Name:     "Duplicate",
		Username: "existing",
		Password: "password123",
		Role:     "MAHASISWA",
	})

	req, _ := http.NewRequest("POST", "/api/admin/users", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", w.Code)
	}
}

func TestGetUsers_Success(t *testing.T) {
	db := setupTestDB(t)
	seedTestUser(t, db, "user1", "pass1", "ADMIN")
	seedTestUser(t, db, "user2", "pass2", "MAHASISWA")

	handler := NewUserHandler(db)
	r := setupRouter()
	r.GET("/api/admin/users", func(c *gin.Context) {
		c.Set("userId", uint(1))
		c.Set("role", "ADMIN")
	}, handler.GetUsers)

	req, _ := http.NewRequest("GET", "/api/admin/users", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var users []map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &users)
	if len(users) != 2 {
		t.Errorf("expected 2 users, got %d", len(users))
	}
}

func TestDeleteUser_CannotDeleteSelf(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "admin", "pass123", "ADMIN")

	handler := NewUserHandler(db)
	r := setupRouter()
	r.DELETE("/api/admin/users/:id", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", "ADMIN")
	}, handler.DeleteUser)

	req, _ := http.NewRequest("DELETE", "/api/admin/users/1", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d: %s", w.Code, w.Body.String())
	}
}

func TestChangePassword_Success(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "student", "oldpass123", "MAHASISWA")

	handler := NewUserHandler(db)
	r := setupRouter()
	r.PATCH("/api/users/password", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", user.Role)
	}, handler.ChangePassword)

	body, _ := json.Marshal(ChangePasswordRequest{
		CurrentPassword: "oldpass123",
		NewPassword:     "newpass456",
	})

	req, _ := http.NewRequest("PATCH", "/api/users/password", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestChangePassword_WrongCurrentPassword(t *testing.T) {
	db := setupTestDB(t)
	user := seedTestUser(t, db, "student", "oldpass123", "MAHASISWA")

	handler := NewUserHandler(db)
	r := setupRouter()
	r.PATCH("/api/users/password", func(c *gin.Context) {
		c.Set("userId", user.ID)
		c.Set("role", user.Role)
	}, handler.ChangePassword)

	body, _ := json.Marshal(ChangePasswordRequest{
		CurrentPassword: "wrongpass",
		NewPassword:     "newpass456",
	})

	req, _ := http.NewRequest("PATCH", "/api/users/password", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected status 401, got %d: %s", w.Code, w.Body.String())
	}
}
