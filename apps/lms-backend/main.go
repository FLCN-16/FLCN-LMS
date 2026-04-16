package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "flcn_lms_backend/docs"
	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/config"
	"flcn_lms_backend/internal/cron"
	"flcn_lms_backend/internal/database"
	"flcn_lms_backend/internal/license"
	"flcn_lms_backend/internal/repository"
	"flcn_lms_backend/internal/service"
	"flcn_lms_backend/internal/utils"
	"flcn_lms_backend/router"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @swagger 2.0
// @title LMS Backend API
// @version 1.0
// @description Learning Management System Backend API with Course, Test, and Student Management
// @contact.name API Support
// @contact.email support@example.com
// @license.name MIT
// @host localhost:8080
// @BasePath /api/v1
// @schemes http https
// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description "Add a JWT token to the header with ** Bearer &lt;JWT&gt; ** token to authorize"
func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Load configuration from environment
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database connection
	db, err := database.Init(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize JWT manager
	jwtManager := utils.NewJWTManager(cfg.JWTSecret, 24*time.Hour, 7*24*time.Hour)

	// ==========================================
	// Initialize Repositories
	// ==========================================
	log.Println("[Main] Initializing repositories...")
	userRepo := repository.NewUserRepository(db.DB)
	courseRepo := repository.NewCourseRepository(db.DB)
	moduleRepo := repository.NewModuleRepository(db.DB)
	lessonRepo := repository.NewLessonRepository(db.DB)
	testSeriesRepo := repository.NewTestSeriesRepository(db.DB)
	questionRepo := repository.NewQuestionRepository(db.DB)
	attemptRepo := repository.NewAttemptRepository(db.DB)
	enrollmentRepo := repository.NewEnrollmentRepository(db.DB)
	liveSessionRepo := repository.NewLiveSessionRepository(db.DB)
	certificateRepo := repository.NewCertificateRepository(db.DB)
	attemptAnswerRepo := repository.NewAttemptAnswerRepository(db.DB)
	questionOptionRepo := repository.NewQuestionOptionRepository(db.DB)
	lessonProgressRepo := repository.NewLessonProgressRepository(db.DB)
	liveSessionParticipantRepo := repository.NewLiveSessionParticipantRepository(db.DB)
	dppRepo := repository.NewDPPRepository(db.DB)
	announcementRepo := repository.NewAnnouncementRepository(db.DB)
	courseReviewRepo := repository.NewCourseReviewRepository(db.DB)
	log.Println("[Main] ✓ All repositories initialized")

	// ==========================================
	// Initialize Services
	// ==========================================
	log.Println("[Main] Initializing services...")
	userService := service.NewUserService(userRepo, jwtManager)
	courseService := service.NewCourseService(courseRepo, userRepo)
	moduleService := service.NewModuleService(moduleRepo, courseRepo)
	lessonService := service.NewLessonService(lessonRepo, moduleRepo, lessonProgressRepo)
	testSeriesService := service.NewTestSeriesService(testSeriesRepo, questionRepo)
	_ = service.NewQuestionService(questionRepo, testSeriesRepo, questionOptionRepo)
	enrollmentService := service.NewEnrollmentService(enrollmentRepo, courseRepo, userRepo)
	attemptService := service.NewAttemptService(attemptRepo, testSeriesRepo, userRepo, attemptAnswerRepo, certificateRepo, questionRepo, questionOptionRepo)
	liveSessionService := service.NewLiveSessionService(liveSessionRepo, userRepo, liveSessionParticipantRepo)
	certificateService := service.NewCertificateService(certificateRepo, userRepo, courseRepo, testSeriesRepo, attemptRepo, enrollmentRepo)
	dppService := service.NewDPPService(dppRepo)
	announcementService := service.NewAnnouncementService(announcementRepo)
	courseReviewService := service.NewCourseReviewService(courseReviewRepo)
	log.Println("[Main] ✓ All services initialized")

	// Initialize license client with timeout
	licenseClient := license.NewClient(cfg.LicenseAPIURL, 30*time.Second)

	// Initialize license service
	licenseService := service.NewLicenseService(db.DB, licenseClient, cfg.LicenseKey)

	// Load cached license from database on startup
	if err := licenseService.LoadCacheFromDatabase(); err != nil {
		log.Printf("[Main] Warning: Failed to load cached license: %v", err)
	}

	// Initialize certificate PDF generator
	pdfGenerator := service.NewCertificatePDFGenerator(cfg.AppName, "https://certificates.example.com")

	// ==========================================
	// Initialize Permission Service
	// ==========================================
	log.Println("[Main] Initializing permission service...")
	permissionService := service.NewPermissionService()
	log.Println("[Main] ✓ Permission service initialized")

	// ==========================================
	// Initialize Handlers
	// ==========================================
	log.Println("[Main] Initializing handlers...")
	authHandler := handlers.NewAuthHandler(userService)
	courseHandler := handlers.NewCourseHandler(courseService, userService)
	instructorCourseHandler := handlers.NewInstructorCourseHandler(courseService, userService)
	moduleHandler := handlers.NewModuleHandler(moduleService)
	lessonHandler := handlers.NewLessonHandler(lessonService)
	testSeriesHandler := handlers.NewTestSeriesHandler(testSeriesService, userService)
	attemptHandler := handlers.NewAttemptHandler(attemptService)
	userHandler := handlers.NewUserHandler(userService)
	enrollmentHandler := handlers.NewEnrollmentHandler(enrollmentService)
	liveSessionHandler := handlers.NewLiveSessionHandler(liveSessionService, userService)
	leaderboardHandler := handlers.NewLeaderboardHandler(attemptService, enrollmentService, userService)
	licenseHandler := handlers.NewLicenseHandler(licenseService)
	dppHandler := handlers.NewDPPHandler(dppService)
	announcementHandler := handlers.NewAnnouncementHandler(announcementService)
	courseReviewHandler := handlers.NewCourseReviewHandler(courseReviewService)
	certificateHandler := handlers.NewCertificateHandler(*certificateService, pdfGenerator)
	log.Println("[Main] ✓ All handlers initialized")

	// ==========================================
	// Initialize Permission Decorator
	// ==========================================
	log.Println("[Main] Initializing permission decorator...")
	permissionDecorator := decorators.NewPermissionDecorator(permissionService, cfg.JWTSecret)
	log.Println("[Main] ✓ Permission decorator initialized")

	// ==========================================
	// Initialize Background Jobs
	// ==========================================
	log.Println("[Main] Initializing background jobs...")

	// Initialize and start license verifier (background cron job)
	licenseVerifier := cron.NewLicenseVerifier(licenseService, cfg.LicenseVerifyInterval)
	if err := licenseVerifier.Start(); err != nil {
		log.Fatalf("[Main] Failed to start license verifier: %v", err)
	}
	log.Printf("[Main] ✓ License verification cron job started (interval: %v)", cfg.LicenseVerifyInterval)

	// ==========================================
	// Initialize Gin Router
	// ==========================================
	log.Println("[Main] Setting up Gin router...")

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Create Gin router
	r := gin.Default()

	// Global middleware
	r.Use(gin.Recovery())
	r.Use(func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Next()
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		if err := db.Health(); err != nil {
			c.JSON(503, gin.H{
				"success": false,
				"error":   "Database connection failed",
			})
			return
		}
		c.JSON(200, gin.H{
			"success": true,
			"message": "Server is healthy",
			"app":     cfg.AppName,
		})
	})

	// Swagger documentation endpoints - custom handlers to set correct content-type
	r.GET("/docs/", func(c *gin.Context) {
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.File("./docs/index.html")
	})

	r.GET("/docs/index.html", func(c *gin.Context) {
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.File("./docs/index.html")
	})

	// Serve swagger.json at root level for compatibility
	r.GET("/swagger.json", func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.File("./docs/swagger.json")
	})

	// Fallback for /swagger/* requests
	r.GET("/swagger/*filepath", func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.File("./docs/swagger.json")
	})

	// API v1 routes group
	v1 := r.Group("/api/v1")

	// Add JSON content-type middleware only to API routes
	v1.Use(func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Next()
	})

	// Initialize all routes using centralized route initializer
	router.InitializeAllRoutes(
		v1,
		authHandler,
		courseHandler,
		instructorCourseHandler,
		moduleHandler,
		lessonHandler,
		testSeriesHandler,
		attemptHandler,
		userHandler,
		enrollmentHandler,
		liveSessionHandler,
		leaderboardHandler,
		licenseHandler,
		dppHandler,
		announcementHandler,
		courseReviewHandler,
		certificateHandler,
		permissionDecorator,
		cfg.JWTSecret,
	)

	// 404 handler
	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{
			"success": false,
			"error":   "Endpoint not found",
		})
	})

	// ==========================================
	// Start Server
	// ==========================================
	log.Println("[Main] ✓ Gin router configured successfully")

	// Start server in goroutine
	go func() {
		addr := fmt.Sprintf(":%d", cfg.Port)
		log.Printf("[Main] Starting %s server on %s", cfg.AppName, addr)
		log.Printf("[Main] Swagger docs available at http://localhost%s/docs/index.html", addr)

		if err := r.Run(addr); err != nil {
			log.Fatalf("[Main] Failed to start server: %v", err)
		}
	}()

	// Wait for shutdown signal
	handleGracefulShutdown(licenseVerifier)
}

// handleGracefulShutdown handles OS signals for graceful shutdown
// Ensures background jobs are stopped cleanly before exit
//
// Parameters:
//   - licenseVerifier: License verifier cron job to stop
func handleGracefulShutdown(licenseVerifier *cron.LicenseVerifier) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Block until signal received
	<-sigChan

	log.Println("[Main] Received shutdown signal, initiating graceful shutdown...")

	// Stop license verifier
	if err := licenseVerifier.Stop(); err != nil {
		log.Printf("[Main] Error stopping license verifier: %v", err)
	}

	log.Println("[Main] Server shutdown complete")
	os.Exit(0)
}
