package main

import (
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"sikompen-backend/internal/handlers"
	"sikompen-backend/internal/middleware"
	"sikompen-backend/internal/repository"
	"sikompen-backend/internal/services"
	"sikompen-backend/internal/utils"
)

func main() {
	_ = godotenv.Load()
	_ = godotenv.Load("../../.env")

	dbURL := os.Getenv("DATABASE_URL_GO")
	if dbURL == "" {
		dbURL = "sikompen.db"
	}

	utils.InitRedis()
	utils.InitSSE()

	db := repository.InitDB(dbURL)
	repos := repository.NewRepositories(db)

	authService := services.NewAuthService(repos.User)
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(repos.User)
	jobHandler := handlers.NewJobHandler(repos.Job, repos.Application)
	appHandler := handlers.NewApplicationHandler(repos.Application, repos.Job, repos.User, repos.Admin, repos.Notification, db)
	paymentHandler := handlers.NewPaymentHandler(repos.Payment, repos.User, repos.Admin, repos.Notification, db)
	adminHandler := handlers.NewAdminHandler(repos.Admin, repos.User)
	statsHandler := handlers.NewStatsHandler(repos)
	notifHandler := handlers.NewNotificationHandler(repos.Notification)
	trendHandler := handlers.NewTrendHandler(repos)

	r := gin.Default()

	allowedOrigins := os.Getenv("CORS_ORIGIN")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}

	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		for _, allowed := range strings.Split(allowedOrigins, ",") {
			if origin == strings.TrimSpace(allowed) {
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

	r.Static("/uploads", "./uploads")
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("/api")
	{
		api.POST("/login", authHandler.Login)
		api.GET("/events", utils.SSEHandler)

		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/me", authHandler.GetMe)
			protected.GET("/dashboard/stats", statsHandler.GetDashboardData)
			protected.GET("/dashboard/trends", trendHandler.GetCompensationTrend)
			protected.GET("/dashboard/finance", statsHandler.GetFinanceData)
			protected.PATCH("/users/password", userHandler.ChangePassword)

			protected.GET("/jobs", jobHandler.GetJobs)
			protected.POST("/jobs", middleware.AdminOnly(), jobHandler.CreateJob)
			protected.PUT("/jobs/:id", middleware.AdminOnly(), jobHandler.UpdateJob)
			protected.DELETE("/jobs/:id", middleware.AdminOnly(), jobHandler.DeleteJob)
			protected.PATCH("/jobs/:id/status", middleware.AdminOnly(), jobHandler.ToggleStatus)

			protected.POST("/jobs/:jobId/apply", appHandler.ApplyForJob)
			protected.GET("/applications", appHandler.GetByStatus)
			protected.PATCH("/applications/:id/status", appHandler.UpdateStatus)
			protected.POST("/applications/:id/proof", appHandler.SubmitProof)

			protected.POST("/payments", paymentHandler.CreatePayment)
			protected.PATCH("/payments/:id/verify", paymentHandler.VerifyPayment)

			protected.GET("/notifications", notifHandler.GetMyNotifications)
			protected.PATCH("/notifications/:id/read", notifHandler.MarkAsRead)
			protected.PATCH("/notifications/read-all", notifHandler.MarkAllAsRead)

			admin := protected.Group("/admin")
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
