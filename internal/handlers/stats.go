package handlers

import (
	"net/http"
	"sikompen-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StatsHandler struct {
	DB *gorm.DB
}

func NewStatsHandler(db *gorm.DB) *StatsHandler {
	return &StatsHandler{DB: db}
}

func (h *StatsHandler) GetDashboardData(c *gin.Context) {
	userId, _ := c.Get("userId")
	role, _ := c.Get("role")

	var user models.User
	if err := h.DB.Preload("Applications.Job").First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if role == "ADMIN" {
		var totalStudents int64
		h.DB.Model(&models.User{}).Where("role = ?", "MAHASISWA").Count(&totalStudents)

		var activeJobs int64
		h.DB.Model(&models.Job{}).Where("status = ?", "OPEN").Count(&activeJobs)

		var pendingValidations int64
		h.DB.Model(&models.JobApplication{}).Where("status = ?", "PENDING").Count(&pendingValidations)

		var totalIncome float64
		h.DB.Model(&models.Payment{}).Where("status = ?", "APPROVED").Select("sum(amount)").Scan(&totalIncome)

		var topDebtors []struct {
			Name       string  `json:"name"`
			NIM        *string `json:"nim"`
			TotalHours int     `json:"totalHours"`
		}
		h.DB.Model(&models.User{}).Where("role = ? AND total_hours > 0", "MAHASISWA").
			Order("total_hours desc").Limit(5).Scan(&topDebtors)

		c.JSON(http.StatusOK, gin.H{
			"role": "ADMIN",
			"user": user,
			"adminStats": gin.H{
				"totalStudents":      totalStudents,
				"activeJobs":         activeJobs,
				"pendingValidations": pendingValidations,
				"totalIncome":        totalIncome,
			},
			"topDebtors": topDebtors,
		})
		return
	}

	if role == "PENGAWAS" {
		var myJobs int64
		h.DB.Model(&models.Job{}).Where("created_by_id = ?", userId).Count(&myJobs)

		var pendingValidations int64
		h.DB.Model(&models.JobApplication{}).Joins("JOIN jobs ON jobs.id = job_applications.job_id").
			Where("job_applications.status = ? AND jobs.created_by_id = ?", "PENDING", userId).Count(&pendingValidations)

		var verifyingCount int64
		h.DB.Model(&models.JobApplication{}).Joins("JOIN jobs ON jobs.id = job_applications.job_id").
			Where("job_applications.status = ? AND jobs.created_by_id = ?", "VERIFYING", userId).Count(&verifyingCount)

		c.JSON(http.StatusOK, gin.H{
			"role": "PENGAWAS",
			"user": user,
			"supervisorStats": gin.H{
				"myJobs":             myJobs,
				"pendingValidations": pendingValidations,
				"verifyingCount":     verifyingCount,
			},
		})
		return
	}

	var completedHours int
	for _, app := range user.Applications {
		if app.Status == "COMPLETED" {
			completedHours += app.Job.Hours
		}
	}

	var activeJobsCount int
	var activeJobTitle string
	for _, app := range user.Applications {
		if app.Status == "ACCEPTED" || app.Status == "PENDING" {
			activeJobsCount++
			if activeJobTitle == "" {
				activeJobTitle = app.Job.Title
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"role": "MAHASISWA",
		"user": user,
		"stats": gin.H{
			"completedHours": completedHours,
			"activeJobs":     activeJobsCount,
			"activeJobTitle": activeJobTitle,
		},
	})
}

func (h *StatsHandler) GetFinanceData(c *gin.Context) {
	var totalIncome float64
	h.DB.Model(&models.Payment{}).Where("status = ?", "APPROVED").Select("COALESCE(sum(amount), 0)").Scan(&totalIncome)

	var pendingIncome float64
	h.DB.Model(&models.Payment{}).Where("status = ?", "PENDING").Select("COALESCE(sum(amount), 0)").Scan(&pendingIncome)

	var totalDebtors int64
	h.DB.Model(&models.User{}).Where("role = ? AND total_hours > 0", "MAHASISWA").Count(&totalDebtors)

	var totalOutstandingHours int
	h.DB.Model(&models.User{}).Where("role = ?", "MAHASISWA").Select("COALESCE(sum(total_hours), 0)").Scan(&totalOutstandingHours)

	var pendingPayments []models.Payment
	h.DB.Preload("User").Where("status = ?", "PENDING").Order("created_at desc").Find(&pendingPayments)

	var history []models.Payment
	h.DB.Preload("User").Where("status != ?", "PENDING").Order("updated_at desc").Limit(10).Find(&history)

	var debtors []models.User
	h.DB.Where("role = ? AND total_hours > 0", "MAHASISWA").Order("total_hours desc").Limit(10).Find(&debtors)

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"totalIncome":           totalIncome,
			"pendingIncome":         pendingIncome,
			"totalDebtors":          totalDebtors,
			"totalOutstandingHours": totalOutstandingHours,
		},
		"payments": pendingPayments,
		"history":  history,
		"debtors":  debtors,
	})
}
