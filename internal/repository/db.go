package repository

import (
	"log"
	"sikompen-backend/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDB(dbURL string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Auto Migrate the schema
	err = db.AutoMigrate(
		&models.User{},
		&models.Job{},
		&models.JobApplication{},
		&models.ClearanceRequest{},
		&models.ActivityLog{},
		&models.SystemSettings{},
		&models.Payment{},
	)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	return db
}
