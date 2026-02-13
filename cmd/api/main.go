package main

import (
	"log"
	"os"
	"sikompen-backend/internal/handlers"
	"sikompen-backend/internal/middleware"
	"sikompen-backend/internal/repository"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found or error loading it")
	}

	dbURL := os.Getenv("DATABASE_URL_GO")
	if dbURL == "" {
		dbURL = "sikompen.db"
	}

	db := repository.InitDB(dbURL)

	r := gin.Default()

	allowedOrigins := os.Getenv("CORS_ORIGIN")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}

	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")

		for _, allowed := range strings.Split(allowedOrigins, ",") {
			allowed = strings.TrimSpace(allowed)
			if origin == allowed {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}

		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
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

		auth := api.Group("/")
		auth.Use(middleware.AuthMiddleware())
		{
			auth.GET("/me", authHandler.GetMe)
			auth.GET("/dashboard/stats", statsHandler.GetDashboardData)

			auth.PATCH("/users/password", userHandler.ChangePassword)

			auth.GET("/jobs", jobHandler.GetJobs)
			auth.POST("/jobs", middleware.AdminOnly(), jobHandler.CreateJob)
			auth.PUT("/jobs/:id", middleware.AdminOnly(), jobHandler.UpdateJob)
			auth.DELETE("/jobs/:id", middleware.AdminOnly(), jobHandler.DeleteJob)
			auth.PATCH("/jobs/:id/status", middleware.AdminOnly(), jobHandler.ToggleStatus)

			auth.POST("/jobs/:jobId/apply", appHandler.ApplyForJob)
			auth.GET("/applications", appHandler.GetByStatus)
			auth.PATCH("/applications/:id/status", appHandler.UpdateStatus)
			auth.POST("/applications/:id/proof", appHandler.SubmitProof)

			auth.POST("/payments", paymentHandler.CreatePayment)
			auth.PATCH("/payments/:id/verify", paymentHandler.VerifyPayment)
			auth.GET("/finance/stats", statsHandler.GetFinanceData)

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
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
