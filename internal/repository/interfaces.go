package repository

import (
	"sikompen-backend/internal/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetByID(id uint) (*models.User, error)
	GetByUsername(username string) (*models.User, error)
	GetAll(filters map[string]interface{}) ([]models.User, error)
	Create(user *models.User) error
	Update(user *models.User) error
	Delete(id uint) error
	GetStats() (map[string]interface{}, error)
	GetGlobalStats() (map[string]interface{}, error)
	DB() *gorm.DB
}

type JobRepository interface {
	GetByID(id uint) (*models.Job, error)
	GetAll(filters map[string]interface{}) ([]models.Job, error)
	Create(job *models.Job) error
	Update(job *models.Job) error
	Delete(id uint) error
	UpdateStatus(id uint, status string) error
	GetCountByCreatedByID(userId uint) (int64, error)
	DB() *gorm.DB
}

type ApplicationRepository interface {
	GetByID(id uint) (*models.JobApplication, error)
	Create(app *models.JobApplication) error
	Update(app *models.JobApplication) error
	GetByStatus(status string, pengawasID *uint) ([]models.JobApplication, error)
	GetActiveCountByUserID(userId uint) (int64, error)
	GetCountByJobID(jobId uint) (int64, error)
	GetByJobIDAndUserID(jobID, userID uint) (*models.JobApplication, error)
	GetAll(filters map[string]interface{}) ([]models.JobApplication, error)
	DB() *gorm.DB
}

type NotificationRepository interface {
	Create(notification *models.Notification) error
	GetByUserID(userID uint, limit int) ([]models.Notification, error)
	MarkAsRead(id uint) error
	MarkAllAsRead(userID uint) error
	DB() *gorm.DB
}

type PaymentRepository interface {
	Create(payment *models.Payment) error
	GetByID(id uint) (*models.Payment, error)
	Update(payment *models.Payment) error
	GetStats() (map[string]interface{}, error)
	GetAll(filters map[string]interface{}) ([]models.Payment, error)
	DB() *gorm.DB
}

type AdminRepository interface {
	GetActivityLogs(limit int) ([]models.ActivityLog, error)
	CreateActivityLog(log *models.ActivityLog) error
	GetSystemSettings() ([]models.SystemSettings, error)
	GetSystemSettingByKey(key string) (*models.SystemSettings, error)
	UpdateSystemSetting(setting *models.SystemSettings) error
	DB() *gorm.DB
}
