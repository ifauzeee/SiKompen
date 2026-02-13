package handlers

import (
	"encoding/json"
	"net/http"
	"sikompen-backend/internal/models"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/utils"
	"time"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	Repos *repository.Repositories
}

func NewStatsHandler(repos *repository.Repositories) *StatsHandler {
	return &StatsHandler{Repos: repos}
}

func (h *StatsHandler) GetDashboardData(c *gin.Context) {
	userId, _ := c.Get("userId")
	role, _ := c.Get("role")

	uid := userId.(uint)
	user, err := h.Repos.User.GetByID(uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if role == "ADMIN" {
		var stats map[string]interface{}
		cacheKey := "stats:admin_global"

		if cached, err := utils.GetCache(cacheKey); err == nil {
			if json.Unmarshal([]byte(cached), &stats) == nil {
				topDebtors, _ := h.Repos.User.GetAll(map[string]interface{}{
					"role":            "MAHASISWA",
					"total_hours > ?": 0,
				})

				c.JSON(http.StatusOK, gin.H{
					"role":       "ADMIN",
					"user":       user,
					"adminStats": stats,
					"topDebtors": topDebtors,
					"from_cache": true,
				})
				return
			}
		}

		stats, err := h.Repos.User.GetGlobalStats()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
			return
		}

		if statsJson, err := json.Marshal(stats); err == nil {
			utils.SetCache(cacheKey, string(statsJson), 10*time.Minute)
		}

		topDebtors, _ := h.Repos.User.GetAll(map[string]interface{}{
			"role":            "MAHASISWA",
			"total_hours > ?": 0,
		})

		c.JSON(http.StatusOK, gin.H{
			"role":       "ADMIN",
			"user":       user,
			"adminStats": stats,
			"topDebtors": topDebtors,
		})
		return
	}

	if role == "PENGAWAS" {

		c.JSON(http.StatusOK, gin.H{
			"role": "PENGAWAS",
			"user": user,
			"supervisorStats": gin.H{
				"myJobs":             0,
				"pendingValidations": 0,
				"verifyingCount":     0,
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
	var totalIncome, pendingIncome float64
	var totalDebtors int64

	h.Repos.User.DB().Model(&models.Payment{}).Where("status = ?", "APPROVED").Select("COALESCE(SUM(amount), 0)").Scan(&totalIncome)
	h.Repos.User.DB().Model(&models.Payment{}).Where("status = ?", "PENDING").Select("COALESCE(SUM(amount), 0)").Scan(&pendingIncome)
	h.Repos.User.DB().Model(&models.User{}).Where("role = ? AND total_hours > 0", "MAHASISWA").Count(&totalDebtors)

	var totalOutstandingHours int64
	h.Repos.User.DB().Model(&models.User{}).Where("role = ?", "MAHASISWA").Select("COALESCE(SUM(total_hours), 0)").Scan(&totalOutstandingHours)

	payments, _ := h.Repos.Payment.GetAll(map[string]interface{}{"status": "PENDING"})
	history, _ := h.Repos.Payment.GetAll(nil)
	debtors, _ := h.Repos.User.GetAll(map[string]interface{}{"role": "MAHASISWA", "total_hours": "> 0"})

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"totalIncome":           totalIncome,
			"pendingIncome":         pendingIncome,
			"totalDebtors":          totalDebtors,
			"totalOutstandingHours": totalOutstandingHours,
		},
		"payments": payments,
		"history":  history,
		"debtors":  debtors,
	})
}
