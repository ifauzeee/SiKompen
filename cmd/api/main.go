package main

import (
	"log"
	"os"
	"sikompen-backend/internal/handlers"
	"sikompen-backend/internal/middleware"
	"sikompen-backend/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found or error loading it")
	}

	dbURL := os.Getenv("DATABASE_URL_GO")
	if dbURL == "" {
		dbURL = "sikompen.db"
	}

	db := repository.InitDB(dbURL)

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	authHandler := handlers.NewAuthHandler(db)
	jobHandler := handlers.NewJobHandler(db)
	appHandler := handlers.NewApplicationHandler(db)
	adminHandler := handlers.NewAdminHandler(db)
	paymentHandler := handlers.NewPaymentHandler(db)
	userHandler := handlers.NewUserHandler(db)
	statsHandler := handlers.NewStatsHandler(db)

	api := r.Group("/api")
	{
		api.POST("/login", authHandler.Login)

		// Protected routes
		auth := api.Group("/")
		auth.Use(middleware.AuthMiddleware())
		{
			auth.GET("/me", authHandler.GetMe)
			auth.GET("/dashboard/stats", statsHandler.GetDashboardData)

			// Jobs
			auth.GET("/jobs", jobHandler.GetJobs)
			auth.POST("/jobs", middleware.AdminOnly(), jobHandler.CreateJob)
			auth.PUT("/jobs/:id", middleware.AdminOnly(), jobHandler.UpdateJob)
			auth.DELETE("/jobs/:id", middleware.AdminOnly(), jobHandler.DeleteJob)
			auth.PATCH("/jobs/:id/status", middleware.AdminOnly(), jobHandler.ToggleStatus)

			// Applications
			auth.POST("/jobs/:jobId/apply", appHandler.ApplyForJob)
			auth.GET("/applications", appHandler.GetByStatus)
			auth.PATCH("/applications/:id/status", appHandler.UpdateStatus)
			auth.POST("/applications/:id/proof", appHandler.SubmitProof)

			// Payments
			auth.POST("/payments", paymentHandler.CreatePayment)
			auth.PATCH("/payments/:id/verify", paymentHandler.VerifyPayment)
			auth.GET("/finance/stats", statsHandler.GetFinanceData)

			// Admin
			admin := auth.Group("/admin")
			admin.Use(middleware.AdminOnly())
			{
				admin.GET("/stats", userHandler.GetStats)
				admin.GET("/users", userHandler.GetUsers)
				admin.POST("/users", userHandler.CreateUser)
				admin.DELETE("/users/:id", userHandler.DeleteUser)
				admin.PATCH("/users/:id/hours", adminHandler.UpdateStudentHours)
				admin.GET("/logs", adminHandler.GetActivityLogs)
				admin.GET("/settings", adminHandler.GetSystemSettings)
				admin.PATCH("/settings/:key", adminHandler.UpdateSystemSetting)
				admin.POST("/students/import", adminHandler.ImportStudents)
				admin.GET("/students/export", adminHandler.GetStudentsForExport)
			}
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
