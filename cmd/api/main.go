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
	repos := repository.NewRepositories(db)

	r := gin.Default()

	r.Use(gin.Recovery())
	r.Static("/uploads", "./uploads")

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

	authHandler := handlers.NewAuthHandler(repos.User)
	jobHandler := handlers.NewJobHandler(repos.Job, repos.Application)
	appRepo := repos.Application
	appHandler := handlers.NewApplicationHandler(appRepo, repos.Job, repos.User, repos.Admin, repos.Notification, db)
	adminHandler := handlers.NewAdminHandler(repos.Admin, repos.User)
	paymentHandler := handlers.NewPaymentHandler(repos.Payment, repos.User, repos.Admin, repos.Notification, db)
	userHandler := handlers.NewUserHandler(repos.User)
	statsHandler := handlers.NewStatsHandler(repos)
	notifHandler := handlers.NewNotificationHandler(repos.Notification)

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

			auth.PATCH("/payments/:id/verify", paymentHandler.VerifyPayment)
			auth.GET("/finance/stats", statsHandler.GetFinanceData)

			auth.GET("/notifications", notifHandler.GetMyNotifications)
			auth.PATCH("/notifications/:id/read", notifHandler.MarkAsRead)
			auth.PATCH("/notifications/read-all", notifHandler.MarkAllAsRead)

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
