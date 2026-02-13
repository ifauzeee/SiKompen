package handlers

import (
	"net/http"
	"sikompen-backend/internal/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	Repo repository.NotificationRepository
}

func NewNotificationHandler(repo repository.NotificationRepository) *NotificationHandler {
	return &NotificationHandler{Repo: repo}
}

func (h *NotificationHandler) GetMyNotifications(c *gin.Context) {
	userId, _ := c.Get("userId")
	limitStr := c.DefaultQuery("limit", "20")
	limit, _ := strconv.Atoi(limitStr)

	notifications, err := h.Repo.GetByUserID(userId.(uint), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	if err := h.Repo.MarkAsRead(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	userId, _ := c.Get("userId")

	if err := h.Repo.MarkAllAsRead(userId.(uint)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark all as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
