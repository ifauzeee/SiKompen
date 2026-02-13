package repository

import (
	"log"
	"sikompen-backend/internal/models"
	"strings"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(dbURL string) *gorm.DB {
	var dialector gorm.Dialector
	if strings.Contains(dbURL, "postgres") || strings.Contains(dbURL, "postgresql") {
		dialector = postgres.Open(dbURL)
	} else {
		dialector = sqlite.Open(dbURL)
	}

	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.Job{},
		&models.JobApplication{},
		&models.ClearanceRequest{},
		&models.ActivityLog{},
		&models.SystemSettings{},
		&models.Payment{},
		&models.Notification{},
	)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	Seed(db)

	return db
}

func Seed(db *gorm.DB) {
	var admin models.User
	if err := db.Where("username = ?", "admin").First(&admin).Error; err != nil {
		log.Println("Seeding default admin user...")
		hashedPassword, _ := passwordHash("admin")
		admin = models.User{
			Username: "admin",
			Role:     "ADMIN",
			Password: hashedPassword,
		}
		if err := db.Create(&admin).Error; err != nil {
			log.Printf("Failed to seed admin user: %v", err)
		}

		var setting models.SystemSettings
		if err := db.Where("key = ?", "APP_NAME").First(&setting).Error; err != nil {
			db.Create(&models.SystemSettings{Key: "APP_NAME", Value: "SiKompen"})
		}
	}
}

func passwordHash(pwd string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	return string(hash), err
}

type Repositories struct {
	User         UserRepository
	Job          JobRepository
	Application  ApplicationRepository
	Payment      PaymentRepository
	Admin        AdminRepository
	Notification NotificationRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		User:         NewGormUserRepository(db),
		Job:          NewGormJobRepository(db),
		Application:  NewGormApplicationRepository(db),
		Payment:      NewGormPaymentRepository(db),
		Admin:        NewGormAdminRepository(db),
		Notification: NewGormNotificationRepository(db),
	}
}
