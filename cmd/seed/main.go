package main

import (
	"fmt"
	"log"
	"sikompen-backend/internal/models"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	dbName := "sikompen.db"
	fmt.Printf("Seeding %s...\n", dbName)

	db, err := gorm.Open(sqlite.Open(dbName), &gorm.Config{})
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
	)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	username := "admin"
	password := "password123"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	name := "Super Admin"

	admin := models.User{
		Username:       username,
		Password:       string(hashedPassword),
		Role:           "ADMIN",
		Name:           &name,
		IsLibraryClear: true,
		IsAdminClear:   true,
	}

	var existing models.User
	if err := db.Where("username = ?", username).First(&existing).Error; err == nil {
		fmt.Println("User 'admin' already exists.")
	} else {
		if err := db.Create(&admin).Error; err != nil {
			log.Fatalf("failed to create admin user: %v", err)
		}
		fmt.Printf("Created default user: %s / %s\n", username, password)
	}

	studentUsername := "mahasiswa"
	studentPassword := "password123"
	hashedStudentPassword, _ := bcrypt.GenerateFromPassword([]byte(studentPassword), bcrypt.DefaultCost)
	studentName := "Test Student"
	nim := "1234567890"

	student := models.User{
		Username:       studentUsername,
		Password:       string(hashedStudentPassword),
		Role:           "MAHASISWA",
		Name:           &studentName,
		NIM:            &nim,
		IsLibraryClear: true,
		IsAdminClear:   true,
	}

	if err := db.Where("username = ?", studentUsername).First(&existing).Error; err == nil {
		fmt.Println("User 'mahasiswa' already exists.")
	} else {
		if err := db.Create(&student).Error; err != nil {
			log.Fatalf("failed to create student user: %v", err)
		}
		fmt.Printf("Created default user: %s / %s\n", studentUsername, studentPassword)
	}
}
