package repository

import (
	"sikompen-backend/internal/models"

	"gorm.io/gorm"
)

type GormUserRepository struct {
	db *gorm.DB
}

func NewGormUserRepository(db *gorm.DB) *GormUserRepository {
	return &GormUserRepository{db: db}
}

func (r *GormUserRepository) DB() *gorm.DB {
	return r.db
}

func (r *GormUserRepository) GetByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *GormUserRepository) GetByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.db.Where("username = ?", username).First(&user).Error
	return &user, err
}

func (r *GormUserRepository) GetAll(filters map[string]interface{}) ([]models.User, error) {
	var users []models.User
	query := r.db.Model(&models.User{})
	for k, v := range filters {
		query = query.Where(k, v)
	}
	err := query.Find(&users).Error
	return users, err
}

func (r *GormUserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *GormUserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *GormUserRepository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *GormUserRepository) GetStats() (map[string]interface{}, error) {
	var totalStudents, totalDebt, totalCleared int64
	r.db.Model(&models.User{}).Where("role = ?", "MAHASISWA").Count(&totalStudents)
	r.db.Model(&models.User{}).Where("role = ? AND total_hours > 0", "MAHASISWA").Count(&totalDebt)
	r.db.Model(&models.User{}).Where("role = ? AND total_hours = 0", "MAHASISWA").Count(&totalCleared)

	return map[string]interface{}{
		"totalStudents": totalStudents,
		"totalDebt":     totalDebt,
		"totalCleared":  totalCleared,
	}, nil
}

func (r *GormUserRepository) GetGlobalStats() (map[string]interface{}, error) {
	var totalStudents, activeJobs, pendingValidations int64
	var totalIncome float64

	r.db.Model(&models.User{}).Where("role = ?", "MAHASISWA").Count(&totalStudents)
	r.db.Model(&models.Job{}).Where("status = ?", "OPEN").Count(&activeJobs)
	r.db.Model(&models.JobApplication{}).Where("status = ?", "PENDING").Count(&pendingValidations)

	r.db.Model(&models.Payment{}).Where("status = ?", "APPROVED").Select("COALESCE(SUM(amount), 0)").Scan(&totalIncome)

	return map[string]interface{}{
		"totalStudents":      totalStudents,
		"activeJobs":         activeJobs,
		"pendingValidations": pendingValidations,
		"totalIncome":        totalIncome,
	}, nil
}

type GormJobRepository struct {
	db *gorm.DB
}

func NewGormJobRepository(db *gorm.DB) *GormJobRepository {
	return &GormJobRepository{db: db}
}

func (r *GormJobRepository) DB() *gorm.DB {
	return r.db
}

func (r *GormJobRepository) GetByID(id uint) (*models.Job, error) {
	var job models.Job
	err := r.db.Preload("CreatedBy").First(&job, id).Error
	return &job, err
}

func (r *GormJobRepository) GetAll(filters map[string]interface{}) ([]models.Job, error) {
	var jobs []models.Job
	query := r.db.Preload("CreatedBy")
	for k, v := range filters {
		query = query.Where(k, v)
	}
	err := query.Order("created_at desc").Find(&jobs).Error
	return jobs, err
}

func (r *GormJobRepository) Create(job *models.Job) error {
	return r.db.Create(job).Error
}

func (r *GormJobRepository) Update(job *models.Job) error {
	return r.db.Save(job).Error
}

func (r *GormJobRepository) Delete(id uint) error {
	return r.db.Delete(&models.Job{}, id).Error
}

func (r *GormJobRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&models.Job{}).Where("id = ?", id).Update("status", status).Error
}

func (r *GormJobRepository) GetCountByCreatedByID(userId uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Job{}).Where("created_by_id = ?", userId).Count(&count).Error
	return count, err
}

type GormApplicationRepository struct {
	db *gorm.DB
}

func NewGormApplicationRepository(db *gorm.DB) *GormApplicationRepository {
	return &GormApplicationRepository{db: db}
}

func (r *GormApplicationRepository) DB() *gorm.DB {
	return r.db
}

func (r *GormApplicationRepository) GetByID(id uint) (*models.JobApplication, error) {
	var app models.JobApplication
	err := r.db.Preload("User").Preload("Job").First(&app, id).Error
	return &app, err
}

func (r *GormApplicationRepository) GetByStatus(status string, pengawasID *uint) ([]models.JobApplication, error) {
	var apps []models.JobApplication
	query := r.db.Preload("User").Preload("Job").Where("status = ?", status)
	if pengawasID != nil {
		query = query.Joins("JOIN jobs ON jobs.id = job_applications.job_id").Where("jobs.created_by_id = ?", *pengawasID)
	}
	err := query.Order("applied_at desc").Find(&apps).Error
	return apps, err
}

func (r *GormApplicationRepository) GetAll(filters map[string]interface{}) ([]models.JobApplication, error) {
	var apps []models.JobApplication
	query := r.db.Model(&models.JobApplication{})
	for k, v := range filters {
		query = query.Where(k, v)
	}
	err := query.Find(&apps).Error
	return apps, err
}

func (r *GormApplicationRepository) Create(app *models.JobApplication) error {
	return r.db.Create(app).Error
}

func (r *GormApplicationRepository) Update(app *models.JobApplication) error {
	return r.db.Save(app).Error
}

func (r *GormApplicationRepository) GetActiveCountByUserID(userId uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.JobApplication{}).Where("user_id = ? AND (status = 'PENDING' OR status = 'ACCEPTED' OR status = 'VERIFYING')", userId).Count(&count).Error
	return count, err
}

func (r *GormApplicationRepository) GetCountByJobID(jobID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.JobApplication{}).Where("job_id = ?", jobID).Count(&count).Error
	return count, err
}

func (r *GormApplicationRepository) GetByJobIDAndUserID(jobId uint, userId uint) (*models.JobApplication, error) {
	var app models.JobApplication
	err := r.db.Where("job_id = ? AND user_id = ?", jobId, userId).First(&app).Error
	if err != nil {
		return nil, err
	}
	return &app, nil
}

type GormPaymentRepository struct {
	db *gorm.DB
}

func NewGormPaymentRepository(db *gorm.DB) *GormPaymentRepository {
	return &GormPaymentRepository{db: db}
}

func (r *GormPaymentRepository) DB() *gorm.DB {
	return r.db
}

func (r *GormPaymentRepository) Create(payment *models.Payment) error {
	return r.db.Create(payment).Error
}

func (r *GormPaymentRepository) GetByID(id uint) (*models.Payment, error) {
	var payment models.Payment
	err := r.db.Preload("User").First(&payment, id).Error
	return &payment, err
}

func (r *GormPaymentRepository) GetAll(filters map[string]interface{}) ([]models.Payment, error) {
	var payments []models.Payment
	query := r.db.Model(&models.Payment{})
	for k, v := range filters {
		query = query.Where(k, v)
	}
	err := query.Preload("User").Find(&payments).Error
	return payments, err
}

func (r *GormPaymentRepository) Update(payment *models.Payment) error {
	return r.db.Save(payment).Error
}

func (r *GormPaymentRepository) GetStats() (map[string]interface{}, error) {
	var totalIncome, pendingIncome float64
	r.db.Model(&models.Payment{}).Where("status = ?", "APPROVED").Select("COALESCE(sum(amount), 0)").Scan(&totalIncome)
	r.db.Model(&models.Payment{}).Where("status = ?", "PENDING").Select("COALESCE(sum(amount), 0)").Scan(&pendingIncome)

	return map[string]interface{}{
		"totalIncome":   totalIncome,
		"pendingIncome": pendingIncome,
	}, nil
}

type GormAdminRepository struct {
	db *gorm.DB
}

func NewGormAdminRepository(db *gorm.DB) *GormAdminRepository {
	return &GormAdminRepository{db: db}
}

func (r *GormAdminRepository) DB() *gorm.DB {
	return r.db
}

func (r *GormAdminRepository) GetActivityLogs(limit int) ([]models.ActivityLog, error) {
	var logs []models.ActivityLog
	err := r.db.Order("created_at desc").Limit(limit).Find(&logs).Error
	return logs, err
}

func (r *GormAdminRepository) CreateActivityLog(log *models.ActivityLog) error {
	return r.db.Create(log).Error
}

func (r *GormAdminRepository) GetSystemSettings() ([]models.SystemSettings, error) {
	var settings []models.SystemSettings
	err := r.db.Find(&settings).Error
	return settings, err
}

func (r *GormAdminRepository) GetSystemSettingByKey(key string) (*models.SystemSettings, error) {
	var setting models.SystemSettings
	err := r.db.Where("key = ?", key).First(&setting).Error
	return &setting, err
}

func (r *GormAdminRepository) UpdateSystemSetting(setting *models.SystemSettings) error {
	return r.db.Save(setting).Error
}

type GormNotificationRepository struct {
	db *gorm.DB
}

func NewGormNotificationRepository(db *gorm.DB) *GormNotificationRepository {
	return &GormNotificationRepository{db: db}
}

func (r *GormNotificationRepository) DB() *gorm.DB {
	return r.db
}

func (r *GormNotificationRepository) Create(notification *models.Notification) error {
	return r.db.Create(notification).Error
}

func (r *GormNotificationRepository) GetByUserID(userID uint, limit int) ([]models.Notification, error) {
	var notifications []models.Notification
	err := r.db.Where("user_id = ?", userID).Order("created_at desc").Limit(limit).Find(&notifications).Error
	return notifications, err
}

func (r *GormNotificationRepository) MarkAsRead(id uint) error {
	return r.db.Model(&models.Notification{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *GormNotificationRepository) MarkAllAsRead(userID uint) error {
	return r.db.Model(&models.Notification{}).Where("user_id = ?", userID).Update("is_read", true).Error
}
