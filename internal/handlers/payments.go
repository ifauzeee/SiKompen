package handlers

import (
	"fmt"
	"net/http"
	"sikompen-backend/internal/models"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/utils"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PaymentHandler struct {
	Repo      repository.PaymentRepository
	UserRepo  repository.UserRepository
	AdminRepo repository.AdminRepository
	NotifRepo repository.NotificationRepository
	DB        *gorm.DB
}

func NewPaymentHandler(repo repository.PaymentRepository, userRepo repository.UserRepository, adminRepo repository.AdminRepository, notifRepo repository.NotificationRepository, db *gorm.DB) *PaymentHandler {
	return &PaymentHandler{
		Repo:      repo,
		UserRepo:  userRepo,
		AdminRepo: adminRepo,
		NotifRepo: notifRepo,
		DB:        db,
	}
}

func (h *PaymentHandler) CreatePayment(c *gin.Context) {
	userId, _ := c.Get("userId")
	role, _ := c.Get("role")

	targetUserIdStr := c.PostForm("userId")
	targetUserId, _ := strconv.ParseUint(targetUserIdStr, 10, 32)

	if userId.(uint) != uint(targetUserId) && role != "ADMIN" && role != "KEUANGAN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to create payment for another user"})
		return
	}

	amountStr := c.PostForm("amount")
	amount, _ := strconv.ParseFloat(amountStr, 64)

	hoursStr := c.PostForm("hoursEquivalent")
	hours, _ := strconv.Atoi(hoursStr)

	file, err := c.FormFile("proof")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Proof file is required"})
		return
	}

	hashStr, err := utils.CalculateFileHash(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process proof file"})
		return
	}

	var count int64
	h.DB.Model(&models.Payment{}).Where("proof_hash = ?", hashStr).Count(&count)
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File bukti pembayaran ini sudah pernah digunakan. Dilarang menggunakan bukti berulang!"})
		return
	}

	filename, err := utils.SaveUpload(file, "uploads/payments")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save proof file"})
		return
	}
	proofPath := "/uploads/payments/" + filename

	note := c.PostForm("note")

	payment := models.Payment{
		UserID:          uint(targetUserId),
		Amount:          amount,
		HoursEquivalent: hours,
		ProofURL:        &proofPath,
		ProofHash:       &hashStr,
		Note:            &note,
		Status:          "PENDING",
		CreatedAt:       time.Now(),
	}

	if err := h.Repo.Create(&payment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
		UserID:     utils.PtrUint(userId.(uint)),
		Action:     "CREATE_PAYMENT",
		TargetType: "PAYMENT",
		Details:    utils.PtrString(fmt.Sprintf("Payment of Rp %.2f for User %d (File: %s)", amount, targetUserId, filename)),
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
		c.JSON(http.StatusBadRequest, gin.H{"errors": utils.FormatValidationError(err)})
		return
	}

	sessionUserId, _ := c.Get("userId")
	sessionRole, _ := c.Get("role")

	if sessionRole != "ADMIN" && sessionRole != "KEUANGAN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access Denied: Requires KEUANGAN or ADMIN role"})
		return
	}

	var payment *models.Payment
	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var err error
		payment, err = h.Repo.GetByID(uint(paymentId))
		if err != nil {
			return fmt.Errorf("payment not found")
		}

		var user models.User
		if err := tx.First(&user, payment.UserID).Error; err != nil {
			return fmt.Errorf("user not found for payment")
		}
		payment.User = user

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
			if err := tx.Save(payment).Error; err != nil {
				return err
			}

			_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
				UserID:     utils.PtrUint(sessionUserId.(uint)),
				Action:     "PAYMENT_APPROVED",
				TargetType: "PAYMENT",
				TargetID:   utils.PtrUint(uint(paymentId)),
				Details:    utils.PtrString(fmt.Sprintf("Approved. Paid off %d hours.", payment.HoursEquivalent)),
				CreatedAt:  time.Now(),
			})

		case "REJECTED":
			payment.Status = "REJECTED"
			if err := tx.Save(payment).Error; err != nil {
				return err
			}

			_ = h.AdminRepo.CreateActivityLog(&models.ActivityLog{
				UserID:     utils.PtrUint(sessionUserId.(uint)),
				Action:     "PAYMENT_REJECTED",
				TargetType: "PAYMENT",
				TargetID:   utils.PtrUint(uint(paymentId)),
				Details:    utils.PtrString("Rejected payment proof."),
				CreatedAt:  time.Now(),
			})
		default:
			return fmt.Errorf("invalid status")
		}

		var notifTitle, notifMsg string
		switch req.Status {
		case "APPROVED":
			notifTitle = "Pembayaran Disetujui"
			notifMsg = fmt.Sprintf("Pembayaran Anda sebesar Rp %.2f telah disetujui. Hutang jam berkurang %d jam.", payment.Amount, payment.HoursEquivalent)
		case "REJECTED":
			notifTitle = "Pembayaran Ditolak"
			notifMsg = fmt.Sprintf("Maaf, bukti pembayaran Anda sebesar Rp %.2f ditolak. Silahkan cek kembali bukti transfer Anda.", payment.Amount)
		}

		if notifTitle != "" {
			_ = h.NotifRepo.Create(&models.Notification{
				UserID:    payment.UserID,
				Title:     notifTitle,
				Message:   notifMsg,
				CreatedAt: time.Now(),
			})
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg := fmt.Sprintf("Pembayaran Anda senilai Rp%.0f telah %s.", payment.Amount, strings.ToLower(req.Status))
	utils.BroadcastEvent("PAYMENT_VERIFIED", msg, payment.UserID)

	c.JSON(http.StatusOK, gin.H{"success": true})
}
