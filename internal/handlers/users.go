package handlers

import (
	"net/http"
	"sikompen-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{DB: db}
}

type CreateUserRequest struct {
	Name       string `json:"name" binding:"required"`
	Username   string `json:"username" binding:"required"`
	Password   string `json:"password" binding:"required,min=6"`
	Role       string `json:"role" binding:"required,oneof=MAHASISWA ADMIN KEUANGAN PENGAWAS"`
	NIM        string `json:"nim"`
	Prodi      string `json:"prodi"`
	Kelas      string `json:"kelas"`
	TotalHours int    `json:"totalHours"`
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.User
	if err := h.DB.Where("username = ?", req.Username).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	user := models.User{
		Name:           &req.Name,
		Username:       req.Username,
		Password:       string(hashedPassword),
		Role:           req.Role,
		NIM:            &req.NIM,
		Prodi:          &req.Prodi,
		Kelas:          &req.Kelas,
		TotalHours:     req.TotalHours,
		IsLibraryClear: true,
		IsAdminClear:   true,
	}

	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	var users []models.User
	if err := h.DB.Order("role asc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)
	uid := uint(id)

	sessionUserId, _ := c.Get("userId")
	if sessionUserId.(uint) == uid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete your own account"})
		return
	}

	if err := h.DB.Delete(&models.User{}, uid).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *UserHandler) GetStats(c *gin.Context) {
	var userCount, jobCount, appCount, paymentCount int64
	h.DB.Model(&models.User{}).Count(&userCount)
	h.DB.Model(&models.Job{}).Count(&jobCount)
	h.DB.Model(&models.JobApplication{}).Count(&appCount)
	h.DB.Model(&models.Payment{}).Count(&paymentCount)

	var totalDebt int64
	h.DB.Model(&models.User{}).Select("sum(total_hours)").Scan(&totalDebt)

	c.JSON(http.StatusOK, gin.H{
		"users":        userCount,
		"jobs":         jobCount,
		"applications": appCount,
		"payments":     paymentCount,
		"totalDebt":    totalDebt,
	})
}
