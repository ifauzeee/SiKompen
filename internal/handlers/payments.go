package handlers

import (
	"fmt"
	"net/http"
	"sikompen-backend/internal/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PaymentHandler struct {
	DB *gorm.DB
}

func NewPaymentHandler(db *gorm.DB) *PaymentHandler {
	return &PaymentHandler{DB: db}
}

type CreatePaymentRequest struct {
	UserID          uint    `json:"userId" binding:"required"`
	Amount          float64 `json:"amount" binding:"required,gt=0"`
	HoursEquivalent int     `json:"hoursEquivalent" binding:"required,gte=0"`
	ProofURL        string  `json:"proofUrl" binding:"required,url"`
	Note            string  `json:"note"`
}

func (h *PaymentHandler) CreatePayment(c *gin.Context) {
	var req CreatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sessionUserId, _ := c.Get("userId")
	sessionRole, _ := c.Get("role")

	if sessionUserId.(uint) != req.UserID && sessionRole != "ADMIN" && sessionRole != "KEUANGAN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to create payment for another user"})
		return
	}

	payment := models.Payment{
		UserID:          req.UserID,
		Amount:          req.Amount,
		HoursEquivalent: req.HoursEquivalent,
		ProofURL:        &req.ProofURL,
		Note:            &req.Note,
		Status:          "PENDING",
		CreatedAt:       time.Now(),
	}

	if err := h.DB.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	h.DB.Create(&models.ActivityLog{
		UserID:     ptrUint(sessionUserId.(uint)),
		Action:     "CREATE_PAYMENT",
		TargetType: "PAYMENT",
		Details:    ptrString(fmt.Sprintf("Payment of Rp %.2f for User %d", req.Amount, req.UserID)),
		CreatedAt:  time.Now(),
	})

	c.JSON(http.StatusCreated, payment)
}

type VerifyPaymentRequest struct {
	Status string `json:"status" binding:"required"`
}

func (h *PaymentHandler) VerifyPayment(c *gin.Context) {
	paymentIdStr := c.Param("id")
	paymentId, _ := strconv.ParseUint(paymentIdStr, 10, 32)

	var req VerifyPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sessionUserId, _ := c.Get("userId")
	sessionRole, _ := c.Get("role")

	if sessionRole != "ADMIN" && sessionRole != "KEUANGAN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access Denied: Requires KEUANGAN or ADMIN role"})
		return
	}

	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var payment models.Payment
		if err := tx.Preload("User").First(&payment, uint(paymentId)).Error; err != nil {
			return fmt.Errorf("payment not found")
		}

		switch req.Status {
		case "APPROVED":
			newHours := payment.User.TotalHours - payment.HoursEquivalent
			if newHours < 0 {
				newHours = 0
			}

			if err := tx.Model(&payment.User).Update("total_hours", newHours).Error; err != nil {
				return err
			}

			payment.Status = "APPROVED"
			if err := tx.Save(&payment).Error; err != nil {
				return err
			}

			tx.Create(&models.ActivityLog{
				UserID:     ptrUint(sessionUserId.(uint)),
				Action:     "PAYMENT_APPROVED",
				TargetType: "PAYMENT",
				TargetID:   ptrUint(uint(paymentId)),
				Details:    ptrString(fmt.Sprintf("Approved. Paid off %d hours.", payment.HoursEquivalent)),
				CreatedAt:  time.Now(),
			})

		case "REJECTED":
			payment.Status = "REJECTED"
			if err := tx.Save(&payment).Error; err != nil {
				return err
			}

			tx.Create(&models.ActivityLog{
				UserID:     ptrUint(sessionUserId.(uint)),
				Action:     "PAYMENT_REJECTED",
				TargetType: "PAYMENT",
				TargetID:   ptrUint(uint(paymentId)),
				Details:    ptrString("Rejected payment proof."),
				CreatedAt:  time.Now(),
			})
		default:
			return fmt.Errorf("invalid status")
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
