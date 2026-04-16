package seeds

import (
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedDatabase populates the database with sample data for testing and development
func SeedDatabase(db *gorm.DB) error {
	log.Println("[Seeder] Starting database seeding...")

	// Check if data already exists
	var userCount int64
	if err := db.Model(&models.User{}).Count(&userCount).Error; err != nil {
		return fmt.Errorf("failed to check existing users: %w", err)
	}

	if userCount > 0 {
		log.Println("[Seeder] Database already seeded, skipping...")
		return nil
	}

	// Seed users
	users, err := seedUsers(db)
	if err != nil {
		return fmt.Errorf("failed to seed users: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded %d users", len(users))

	// Seed courses
	courses, err := seedCourses(db, users)
	if err != nil {
		return fmt.Errorf("failed to seed courses: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded %d courses", len(courses))

	// Seed modules
	modules, err := seedModules(db, courses)
	if err != nil {
		return fmt.Errorf("failed to seed modules: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded %d modules", len(modules))

	// Seed lessons
	lessons, err := seedLessons(db, modules)
	if err != nil {
		return fmt.Errorf("failed to seed lessons: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded %d lessons", len(lessons))

	// Seed test series
	testSeries, err := seedTestSeries(db)
	if err != nil {
		return fmt.Errorf("failed to seed test series: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded %d test series", len(testSeries))

	// Seed questions and options
	_, err = seedQuestions(db, testSeries)
	if err != nil {
		return fmt.Errorf("failed to seed questions: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded questions and options")

	// Seed enrollments
	enrollments, err := seedEnrollments(db, courses, users)
	if err != nil {
		return fmt.Errorf("failed to seed enrollments: %w", err)
	}
	log.Printf("[Seeder] ✓ Seeded %d enrollments", len(enrollments))

	// Seed lesson progress
	err = seedLessonProgress(db, lessons, users)
	if err != nil {
		return fmt.Errorf("failed to seed lesson progress: %w", err)
	}
	log.Println("[Seeder] ✓ Seeded lesson progress")

	// Seed attempts
	_, err = seedAttempts(db, testSeries, users)
	if err != nil {
		return fmt.Errorf("failed to seed attempts: %w", err)
	}
	log.Println("[Seeder] ✓ Seeded attempts and attempt answers")

	// Seed certificates
	_, err = seedCertificates(db, courses, testSeries, users)
	if err != nil {
		return fmt.Errorf("failed to seed certificates: %w", err)
	}
	log.Println("[Seeder] ✓ Seeded certificates")

	// Seed live sessions
	_, err = seedLiveSessions(db, users)
	if err != nil {
		return fmt.Errorf("failed to seed live sessions: %w", err)
	}
	log.Println("[Seeder] ✓ Seeded live sessions")

	log.Println("[Seeder] ✓ Database seeding completed successfully")
	return nil
}

func hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func seedUsers(db *gorm.DB) ([]models.User, error) {
	users := []models.User{
		{
			ID:        uuid.New(),
			Email:     "admin@lms.local",
			FirstName: "Admin",
			LastName:  "User",
			Phone:     "+1-555-0001",
			Role:      models.RoleAdmin,
			IsActive:  true,
		},
		{
			ID:        uuid.New(),
			Email:     "instructor@lms.local",
			FirstName: "John",
			LastName:  "Instructor",
			Phone:     "+1-555-0002",
			Role:      models.RoleFaculty,
			IsActive:  true,
		},
		{
			ID:        uuid.New(),
			Email:     "instructor2@lms.local",
			FirstName: "Jane",
			LastName:  "Professor",
			Phone:     "+1-555-0003",
			Role:      models.RoleFaculty,
			IsActive:  true,
		},
		{
			ID:        uuid.New(),
			Email:     "student1@lms.local",
			FirstName: "Alice",
			LastName:  "Student",
			Phone:     "+1-555-0010",
			Role:      models.RoleStudent,
			IsActive:  true,
		},
		{
			ID:        uuid.New(),
			Email:     "student2@lms.local",
			FirstName: "Bob",
			LastName:  "Learner",
			Phone:     "+1-555-0011",
			Role:      models.RoleStudent,
			IsActive:  true,
		},
		{
			ID:        uuid.New(),
			Email:     "student3@lms.local",
			FirstName: "Carol",
			LastName:  "Scholar",
			Phone:     "+1-555-0012",
			Role:      models.RoleStudent,
			IsActive:  true,
		},
	}

	// Hash passwords
	for i := range users {
		hashedPwd, err := hashPassword("password123")
		if err != nil {
			return nil, err
		}
		users[i].PasswordHash = hashedPwd
		users[i].CreatedAt = time.Now()
		users[i].UpdatedAt = time.Now()
	}

	if err := db.Create(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func seedCourses(db *gorm.DB, users []models.User) ([]models.Course, error) {
	instructor1 := users[1] // John Instructor
	instructor2 := users[2] // Jane Professor

	courses := []models.Course{
		{
			ID:           uuid.New(),
			Title:        "Go Programming Fundamentals",
			Slug:         "go-programming-fundamentals",
			Description:  "Learn Go from basics to advanced concepts. This comprehensive course covers all aspects of Go programming language.",
			ThumbnailURL: "https://via.placeholder.com/400x300?text=Go+Programming",
			InstructorID: instructor1.ID,
			MaxStudents:  50,
			Price:        49.99,
			Status:       "published",
			IsFeatured:   true,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			Title:        "Web Development with React",
			Slug:         "web-development-with-react",
			Description:  "Master React and build modern, interactive web applications. Learn hooks, context, and state management.",
			ThumbnailURL: "https://via.placeholder.com/400x300?text=React",
			InstructorID: instructor2.ID,
			MaxStudents:  75,
			Price:        59.99,
			Status:       "published",
			IsFeatured:   true,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           uuid.New(),
			Title:        "Database Design & SQL",
			Slug:         "database-design-sql",
			Description:  "Deep dive into database design principles and SQL optimization. Understand normalization, indexing, and query performance.",
			ThumbnailURL: "https://via.placeholder.com/400x300?text=Databases",
			InstructorID: instructor1.ID,
			MaxStudents:  40,
			Price:        44.99,
			Status:       "published",
			IsFeatured:   false,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
	}

	if err := db.Create(&courses).Error; err != nil {
		return nil, err
	}

	return courses, nil
}

func seedModules(db *gorm.DB, courses []models.Course) ([]models.Module, error) {
	modules := []models.Module{
		// Go Programming Fundamentals
		{
			ID:          uuid.New(),
			CourseID:    courses[0].ID,
			Title:       "Getting Started with Go",
			Description: "Introduction to Go programming and setup",
			OrderIndex:  1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          uuid.New(),
			CourseID:    courses[0].ID,
			Title:       "Variables, Types, and Functions",
			Description: "Learn about variables, data types, and function definitions",
			OrderIndex:  2,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// React Web Development
		{
			ID:          uuid.New(),
			CourseID:    courses[1].ID,
			Title:       "React Basics",
			Description: "Understanding React components and JSX",
			OrderIndex:  1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          uuid.New(),
			CourseID:    courses[1].ID,
			Title:       "Hooks and State Management",
			Description: "Advanced React patterns with hooks",
			OrderIndex:  2,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// Database Design
		{
			ID:          uuid.New(),
			CourseID:    courses[2].ID,
			Title:       "Relational Database Concepts",
			Description: "Foundational database design principles",
			OrderIndex:  1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	if err := db.Create(&modules).Error; err != nil {
		return nil, err
	}

	return modules, nil
}

func seedLessons(db *gorm.DB, modules []models.Module) ([]models.Lesson, error) {
	lessons := []models.Lesson{
		// Module 1: Getting Started with Go
		{
			ID:              uuid.New(),
			ModuleID:        modules[0].ID,
			Title:           "Introduction to Go",
			Description:     "Learn the basics of Go and why it's great for backend development",
			ContentType:     "video",
			ContentURL:      "https://example.com/videos/go-intro.mp4",
			DurationSeconds: 1200,
			OrderIndex:      1,
			IsPublished:     true,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
		{
			ID:              uuid.New(),
			ModuleID:        modules[0].ID,
			Title:           "Installation and Setup",
			Description:     "Install Go and set up your development environment",
			ContentType:     "text",
			ContentURL:      "https://example.com/guides/go-setup.md",
			DurationSeconds: 900,
			OrderIndex:      2,
			IsPublished:     true,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
		// React Basics
		{
			ID:              uuid.New(),
			ModuleID:        modules[2].ID,
			Title:           "What is React?",
			Description:     "Understanding React components and JSX",
			ContentType:     "video",
			ContentURL:      "https://example.com/videos/react-intro.mp4",
			DurationSeconds: 1500,
			OrderIndex:      1,
			IsPublished:     true,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
	}

	if err := db.Create(&lessons).Error; err != nil {
		return nil, err
	}

	return lessons, nil
}

func seedTestSeries(db *gorm.DB) ([]models.TestSeries, error) {
	now := time.Now()

	testSeries := []models.TestSeries{
		{
			ID:                 uuid.New(),
			Title:              "Go Fundamentals Quiz",
			Slug:               "go-fundamentals-quiz",
			Description:        "Test your knowledge of Go basics",
			TotalQuestions:     10,
			DurationMinutes:    30,
			PassingPercentage:  70,
			ShuffleQuestions:   true,
			ShowCorrectAnswers: true,
			IsPublished:        true,
			CreatedAt:          now,
			UpdatedAt:          now,
		},
		{
			ID:                 uuid.New(),
			Title:              "React Concepts Assessment",
			Slug:               "react-concepts-assessment",
			Description:        "Assess your understanding of React",
			TotalQuestions:     15,
			DurationMinutes:    45,
			PassingPercentage:  75,
			ShuffleQuestions:   true,
			ShowCorrectAnswers: false,
			IsPublished:        true,
			CreatedAt:          now,
			UpdatedAt:          now,
		},
	}

	if err := db.Create(&testSeries).Error; err != nil {
		return nil, err
	}

	return testSeries, nil
}

func seedQuestions(db *gorm.DB, testSeries []models.TestSeries) ([]models.Question, error) {
	now := time.Now()

	questions := []models.Question{
		// Go Fundamentals Quiz
		{
			ID:              uuid.New(),
			TestSeriesID:    testSeries[0].ID,
			QuestionText:    "What is the correct way to declare a variable in Go?",
			QuestionType:    "multiple_choice",
			DifficultyLevel: "easy",
			Marks:           1,
			OrderIndex:      1,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			ID:              uuid.New(),
			TestSeriesID:    testSeries[0].ID,
			QuestionText:    "What is the zero value of a string in Go?",
			QuestionType:    "multiple_choice",
			DifficultyLevel: "easy",
			Marks:           1,
			OrderIndex:      2,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		// React Assessment
		{
			ID:              uuid.New(),
			TestSeriesID:    testSeries[1].ID,
			QuestionText:    "What is a React component?",
			QuestionType:    "multiple_choice",
			DifficultyLevel: "medium",
			Marks:           2,
			OrderIndex:      1,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
	}

	if err := db.Create(&questions).Error; err != nil {
		return nil, err
	}

	// Seed question options
	options := []models.QuestionOption{
		// Go Q1 Options
		{
			ID:         uuid.New(),
			QuestionID: questions[0].ID,
			OptionText: "var x int = 5",
			IsCorrect:  true,
			OrderIndex: 1,
			CreatedAt:  now,
		},
		{
			ID:         uuid.New(),
			QuestionID: questions[0].ID,
			OptionText: "int x = 5",
			IsCorrect:  false,
			OrderIndex: 2,
			CreatedAt:  now,
		},
		{
			ID:         uuid.New(),
			QuestionID: questions[0].ID,
			OptionText: "x: int = 5",
			IsCorrect:  false,
			OrderIndex: 3,
			CreatedAt:  now,
		},
		// Go Q2 Options
		{
			ID:         uuid.New(),
			QuestionID: questions[1].ID,
			OptionText: "\"\"",
			IsCorrect:  true,
			OrderIndex: 1,
			CreatedAt:  now,
		},
		{
			ID:         uuid.New(),
			QuestionID: questions[1].ID,
			OptionText: "nil",
			IsCorrect:  false,
			OrderIndex: 2,
			CreatedAt:  now,
		},
		// React Q1 Options
		{
			ID:         uuid.New(),
			QuestionID: questions[2].ID,
			OptionText: "A reusable UI element",
			IsCorrect:  true,
			OrderIndex: 1,
			CreatedAt:  now,
		},
		{
			ID:         uuid.New(),
			QuestionID: questions[2].ID,
			OptionText: "A CSS class",
			IsCorrect:  false,
			OrderIndex: 2,
			CreatedAt:  now,
		},
	}

	if err := db.Create(&options).Error; err != nil {
		return nil, err
	}

	return questions, nil
}

func seedEnrollments(db *gorm.DB, courses []models.Course, users []models.User) ([]models.Enrollment, error) {
	now := time.Now()

	// Get students (indices 3, 4, 5)
	students := users[3:]

	enrollments := []models.Enrollment{
		{
			ID:                 uuid.New(),
			CourseID:           courses[0].ID,
			StudentID:          students[0].ID,
			EnrolledAt:         now.Add(-30 * 24 * time.Hour),
			ProgressPercentage: 45,
			Status:             "active",
		},
		{
			ID:                 uuid.New(),
			CourseID:           courses[0].ID,
			StudentID:          students[1].ID,
			EnrolledAt:         now.Add(-20 * 24 * time.Hour),
			ProgressPercentage: 80,
			Status:             "active",
		},
		{
			ID:                 uuid.New(),
			CourseID:           courses[1].ID,
			StudentID:          students[0].ID,
			EnrolledAt:         now.Add(-10 * 24 * time.Hour),
			ProgressPercentage: 25,
			Status:             "active",
		},
		{
			ID:                 uuid.New(),
			CourseID:           courses[1].ID,
			StudentID:          students[2].ID,
			EnrolledAt:         now.Add(-15 * 24 * time.Hour),
			ProgressPercentage: 100,
			Status:             "completed",
			CompletedAt:        &now,
		},
	}

	if err := db.Create(&enrollments).Error; err != nil {
		return nil, err
	}

	return enrollments, nil
}

func seedLessonProgress(db *gorm.DB, lessons []models.Lesson, users []models.User) error {
	now := time.Now()
	students := users[3:]

	lessonProgress := []models.LessonProgress{
		{
			ID:               uuid.New(),
			LessonID:         lessons[0].ID,
			StudentID:        students[0].ID,
			WatchedAt:        now,
			WatchTimeSeconds: 1200,
			IsCompleted:      true,
		},
		{
			ID:               uuid.New(),
			LessonID:         lessons[0].ID,
			StudentID:        students[1].ID,
			WatchedAt:        now,
			WatchTimeSeconds: 600,
			IsCompleted:      false,
		},
	}

	return db.Create(&lessonProgress).Error
}

func seedAttempts(db *gorm.DB, testSeries []models.TestSeries, users []models.User) ([]models.Attempt, error) {
	now := time.Now()
	students := users[3:]

	attempts := []models.Attempt{
		{
			ID:               uuid.New(),
			TestSeriesID:     testSeries[0].ID,
			StudentID:        students[0].ID,
			StartedAt:        now.Add(-2 * time.Hour),
			SubmittedAt:      &now,
			TotalMarks:       10,
			ObtainedMarks:    8,
			Percentage:       80,
			Status:           "evaluated",
			TimeSpentSeconds: 900,
		},
		{
			ID:               uuid.New(),
			TestSeriesID:     testSeries[1].ID,
			StudentID:        students[1].ID,
			StartedAt:        now.Add(-1 * time.Hour),
			SubmittedAt:      &now,
			TotalMarks:       15,
			ObtainedMarks:    12,
			Percentage:       80,
			Status:           "evaluated",
			TimeSpentSeconds: 2400,
		},
	}

	if err := db.Create(&attempts).Error; err != nil {
		return nil, err
	}

	return attempts, nil
}

func seedCertificates(db *gorm.DB, courses []models.Course, testSeries []models.TestSeries, users []models.User) ([]models.Certificate, error) {
	now := time.Now()
	students := users[3:]

	certificates := []models.Certificate{
		{
			ID:                uuid.New(),
			CourseID:          &courses[1].ID,
			StudentID:         students[2].ID,
			CertificateNumber: "CERT-2024-001",
			IssuedAt:          now.Add(-1 * time.Hour),
		},
	}

	if err := db.Create(&certificates).Error; err != nil {
		return nil, err
	}

	return certificates, nil
}

func seedLiveSessions(db *gorm.DB, users []models.User) ([]models.LiveSession, error) {
	now := time.Now()
	instructor := users[1]

	sessions := []models.LiveSession{
		{
			ID:              uuid.New(),
			Title:           "Go Advanced Concepts",
			Description:     "Deep dive into Go's concurrency model and advanced patterns",
			InstructorID:    instructor.ID,
			ScheduledStart:  now.Add(24 * time.Hour),
			ScheduledEnd:    now.Add(26 * time.Hour),
			LiveKitRoomName: "go-advanced-001",
			Status:          "scheduled",
		},
		{
			ID:              uuid.New(),
			Title:           "React Performance Optimization",
			Description:     "Learn techniques to optimize React application performance",
			InstructorID:    users[2].ID,
			ScheduledStart:  now.Add(48 * time.Hour),
			ScheduledEnd:    now.Add(50 * time.Hour),
			LiveKitRoomName: "react-perf-001",
			Status:          "scheduled",
		},
	}

	if err := db.Create(&sessions).Error; err != nil {
		return nil, err
	}

	// Seed live session participants
	participants := []models.LiveSessionParticipant{
		{
			ID:        uuid.New(),
			SessionID: sessions[0].ID,
			UserID:    users[3].ID,
			JoinedAt:  now.Add(-1 * time.Hour),
		},
	}

	if err := db.Create(&participants).Error; err != nil {
		return nil, err
	}

	return sessions, nil
}
