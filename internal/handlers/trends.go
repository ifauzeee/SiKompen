package handlers

import (
	"net/http"
	"sikompen-backend/internal/repository"
	"time"

	"github.com/gin-gonic/gin"
)

type TrendHandler struct {
	Repos *repository.Repositories
}

func NewTrendHandler(repos *repository.Repositories) *TrendHandler {
	return &TrendHandler{Repos: repos}
}

type MonthlyTrend struct {
	Month string `json:"month"`
	Hours int    `json:"hours"`
}

func (h *TrendHandler) GetCompensationTrend(c *gin.Context) {
	var trends []MonthlyTrend

	for i := 5; i >= 0; i-- {
		t := time.Now().AddDate(0, -i, 0)
		monthStart := time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.Local)
		monthEnd := monthStart.AddDate(0, 1, 0)

		var totalHours int64
		h.Repos.User.DB().Table("job_applications").
			Joins("join jobs on jobs.id = job_applications.job_id").
			Where("job_applications.status = ?", "COMPLETED").
			Where("job_applications.applied_at >= ? AND job_applications.applied_at < ?", monthStart, monthEnd).
			Select("COALESCE(SUM(jobs.hours), 0)").
			Scan(&totalHours)

		trends = append(trends, MonthlyTrend{
			Month: monthStart.Format("Jan"),
			Hours: int(totalHours),
		})
	}

	c.JSON(http.StatusOK, trends)
}
