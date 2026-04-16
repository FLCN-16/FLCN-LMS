package service

import (
	"errors"
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
)

// CertificateService handles certificate business logic
type CertificateService struct {
	certificateRepo *repository.CertificateRepository
	userRepo        *repository.UserRepository
	courseRepo      *repository.CourseRepository
	testSeriesRepo  *repository.TestSeriesRepository
	attemptRepo     *repository.AttemptRepository
	enrollmentRepo  *repository.EnrollmentRepository
}

// NewCertificateService creates a new certificate service instance
// Parameters:
//   - certificateRepo: Certificate repository for database operations
//   - userRepo: User repository for database operations
//   - courseRepo: Course repository for database operations
//   - testSeriesRepo: TestSeries repository for database operations
//   - attemptRepo: Attempt repository for database operations
//   - enrollmentRepo: Enrollment repository for database operations
//
// Returns:
//   - *CertificateService: New certificate service instance
func NewCertificateService(
	certificateRepo *repository.CertificateRepository,
	userRepo *repository.UserRepository,
	courseRepo *repository.CourseRepository,
	testSeriesRepo *repository.TestSeriesRepository,
	attemptRepo *repository.AttemptRepository,
	enrollmentRepo *repository.EnrollmentRepository,
) *CertificateService {
	return &CertificateService{
		certificateRepo: certificateRepo,
		userRepo:        userRepo,
		courseRepo:      courseRepo,
		testSeriesRepo:  testSeriesRepo,
		attemptRepo:     attemptRepo,
		enrollmentRepo:  enrollmentRepo,
	}
}

// IssueCertificateRequest represents a certificate issuance request
type IssueCertificateRequest struct {
	StudentID    uuid.UUID  `json:"student_id" binding:"required"`
	CourseID     *uuid.UUID `json:"course_id"`
	TestSeriesID *uuid.UUID `json:"test_series_id"`
	ExpiresAt    *time.Time `json:"expires_at"`
}

// CertificateResponse represents a certificate in API responses
type CertificateResponse struct {
	ID                uuid.UUID  `json:"id"`
	StudentID         uuid.UUID  `json:"student_id"`
	StudentName       string     `json:"student_name"`
	StudentEmail      string     `json:"student_email"`
	CourseID          *uuid.UUID `json:"course_id"`
	CourseName        string     `json:"course_name,omitempty"`
	TestSeriesID      *uuid.UUID `json:"test_series_id"`
	TestSeriesName    string     `json:"test_series_name,omitempty"`
	CertificateNumber string     `json:"certificate_number"`
	IssuedAt          time.Time  `json:"issued_at"`
	ExpiresAt         *time.Time `json:"expires_at"`
	IsExpired         bool       `json:"is_expired"`
	VerificationURL   string     `json:"verification_url"`
}

// CertificateListResponse represents a certificate in list responses
type CertificateListResponse struct {
	ID                uuid.UUID  `json:"id"`
	StudentName       string     `json:"student_name"`
	CertificateNumber string     `json:"certificate_number"`
	Title             string     `json:"title"` // Course or Test title
	IssuedAt          time.Time  `json:"issued_at"`
	ExpiresAt         *time.Time `json:"expires_at"`
	IsExpired         bool       `json:"is_expired"`
}

// VerificationResponse represents certificate verification result
type VerificationResponse struct {
	Valid             bool       `json:"valid"`
	CertificateNumber string     `json:"certificate_number"`
	StudentName       string     `json:"student_name"`
	Title             string     `json:"title"`
	IssuedAt          time.Time  `json:"issued_at"`
	ExpiresAt         *time.Time `json:"expires_at"`
	Message           string     `json:"message"`
}

// EligibilityCheckResponse represents certificate eligibility check result
type EligibilityCheckResponse struct {
	Eligible bool    `json:"eligible"`
	Score    float64 `json:"score"`
	Required int     `json:"required_percentage"`
	Message  string  `json:"message"`
}

// IssueCertificate issues a certificate to a student
// Parameters:
//   - req: Certificate issuance request
//
// Returns:
//   - *CertificateResponse: Issued certificate details
//   - error: Error if issuance fails
func (cs *CertificateService) IssueCertificate(req *IssueCertificateRequest) (*CertificateResponse, error) {
	log.Printf("[Certificate Service] Issuing certificate for student: %s", req.StudentID)

	// Verify student exists
	student, err := cs.userRepo.GetByID(req.StudentID)
	if err != nil {
		log.Printf("[Certificate Service] Student not found: %v", err)
		return nil, fmt.Errorf("student not found: %w", err)
	}

	// Verify student role
	if student.Role != models.RoleStudent {
		return nil, errors.New("only students can receive certificates")
	}

	// Validate course or test series is specified
	if req.CourseID == nil && req.TestSeriesID == nil {
		return nil, errors.New("either course_id or test_series_id must be provided")
	}

	// If course certificate
	if req.CourseID != nil {
		course, err := cs.courseRepo.GetByID(*req.CourseID)
		if err != nil {
			log.Printf("[Certificate Service] Course not found: %v", err)
			return nil, fmt.Errorf("course not found: %w", err)
		}

		// Check if student is eligible for course certificate
		eligible, err := cs.checkCourseEligibility(req.StudentID, *req.CourseID)
		if err != nil || !eligible {
			return nil, errors.New("student is not eligible for this course certificate")
		}

		// Check if certificate already exists
		existing, _ := cs.certificateRepo.GetByStudentAndCourse(req.StudentID, *req.CourseID)
		if existing != nil {
			log.Printf("[Certificate Service] Certificate already exists for this course")
			return cs.certificateToResponse(existing), nil
		}

		// Create certificate
		certificate := &models.Certificate{
			ID:                uuid.New(),
			StudentID:         req.StudentID,
			CourseID:          req.CourseID,
			CertificateNumber: generateCertificateNumber(),
			IssuedAt:          time.Now(),
			ExpiresAt:         req.ExpiresAt,
		}

		if err := cs.certificateRepo.Create(certificate); err != nil {
			log.Printf("[Certificate Service] Failed to issue certificate: %v", err)
			return nil, fmt.Errorf("failed to issue certificate: %w", err)
		}

		log.Printf("[Certificate Service] Certificate issued successfully for course: %s", course.ID)
		return cs.certificateToResponse(certificate), nil
	}

	// If test series certificate
	if req.TestSeriesID != nil {
		testSeries, err := cs.testSeriesRepo.GetByID(*req.TestSeriesID)
		if err != nil {
			log.Printf("[Certificate Service] Test series not found: %v", err)
			return nil, fmt.Errorf("test series not found: %w", err)
		}

		// Check if student is eligible for test certificate
		eligible, err := cs.checkTestEligibility(req.StudentID, *req.TestSeriesID)
		if err != nil || !eligible {
			return nil, errors.New("student is not eligible for this test certificate")
		}

		// Check if certificate already exists
		existing, _ := cs.certificateRepo.GetByStudentAndTestSeries(req.StudentID, *req.TestSeriesID)
		if existing != nil {
			log.Printf("[Certificate Service] Certificate already exists for this test")
			return cs.certificateToResponse(existing), nil
		}

		// Create certificate
		certificate := &models.Certificate{
			ID:                uuid.New(),
			StudentID:         req.StudentID,
			TestSeriesID:      req.TestSeriesID,
			CertificateNumber: generateCertificateNumber(),
			IssuedAt:          time.Now(),
			ExpiresAt:         req.ExpiresAt,
		}

		if err := cs.certificateRepo.Create(certificate); err != nil {
			log.Printf("[Certificate Service] Failed to issue certificate: %v", err)
			return nil, fmt.Errorf("failed to issue certificate: %w", err)
		}

		log.Printf("[Certificate Service] Certificate issued successfully for test: %s", testSeries.ID)
		return cs.certificateToResponse(certificate), nil
	}

	return nil, errors.New("failed to issue certificate")
}

// GetCertificate retrieves a certificate by ID
// Parameters:
//   - id: Certificate UUID
//
// Returns:
//   - *CertificateResponse: Certificate details
//   - error: Error if certificate not found
func (cs *CertificateService) GetCertificate(id uuid.UUID) (*CertificateResponse, error) {
	certificate, err := cs.certificateRepo.GetByID(id)
	if err != nil {
		log.Printf("[Certificate Service] Failed to get certificate %s: %v", id, err)
		return nil, err
	}
	return cs.certificateToResponse(certificate), nil
}

// ListCertificates retrieves paginated list of certificates for a student
// Parameters:
//   - studentID: Student UUID
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []CertificateListResponse: List of certificates
//   - int64: Total count of certificates
//   - error: Error if query fails
func (cs *CertificateService) ListCertificates(studentID uuid.UUID, page, limit int) ([]CertificateListResponse, int64, error) {
	certificates, total, err := cs.certificateRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		log.Printf("[Certificate Service] Failed to list certificates: %v", err)
		return nil, 0, err
	}

	var responses []CertificateListResponse
	for _, cert := range certificates {
		title := ""
		if cert.CourseID != nil && *cert.CourseID != uuid.Nil {
			if course, err := cs.courseRepo.GetByID(*cert.CourseID); err == nil {
				title = course.Title
			}
		} else if cert.TestSeriesID != nil && *cert.TestSeriesID != uuid.Nil {
			if testSeries, err := cs.testSeriesRepo.GetByID(*cert.TestSeriesID); err == nil {
				title = testSeries.Title
			}
		}

		isExpired := false
		if cert.ExpiresAt != nil {
			isExpired = cert.ExpiresAt.Before(time.Now())
		}

		responses = append(responses, CertificateListResponse{
			ID:                cert.ID,
			StudentName:       cs.getStudentName(cert.StudentID),
			CertificateNumber: cert.CertificateNumber,
			Title:             title,
			IssuedAt:          cert.IssuedAt,
			ExpiresAt:         cert.ExpiresAt,
			IsExpired:         isExpired,
		})
	}

	return responses, total, nil
}

// ListAllCertificates retrieves paginated list of all certificates (admin view)
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []CertificateListResponse: List of certificates
//   - int64: Total count of certificates
//   - error: Error if query fails
func (cs *CertificateService) ListAllCertificates(page, limit int) ([]CertificateListResponse, int64, error) {
	certificates, total, err := cs.certificateRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Certificate Service] Failed to list all certificates: %v", err)
		return nil, 0, err
	}

	var responses []CertificateListResponse
	for _, cert := range certificates {
		title := ""
		if cert.CourseID != nil && *cert.CourseID != uuid.Nil {
			if course, err := cs.courseRepo.GetByID(*cert.CourseID); err == nil {
				title = course.Title
			}
		} else if cert.TestSeriesID != nil && *cert.TestSeriesID != uuid.Nil {
			if testSeries, err := cs.testSeriesRepo.GetByID(*cert.TestSeriesID); err == nil {
				title = testSeries.Title
			}
		}

		isExpired := false
		if cert.ExpiresAt != nil {
			isExpired = cert.ExpiresAt.Before(time.Now())
		}

		responses = append(responses, CertificateListResponse{
			ID:                cert.ID,
			StudentName:       cs.getStudentName(cert.StudentID),
			CertificateNumber: cert.CertificateNumber,
			Title:             title,
			IssuedAt:          cert.IssuedAt,
			ExpiresAt:         cert.ExpiresAt,
			IsExpired:         isExpired,
		})
	}

	return responses, total, nil
}

// VerifyCertificate verifies the authenticity of a certificate
// Parameters:
//   - certificateNumber: Certificate number string
//
// Returns:
//   - *VerificationResponse: Verification result
//   - error: Error if verification fails
func (cs *CertificateService) VerifyCertificate(certificateNumber string) (*VerificationResponse, error) {
	log.Printf("[Certificate Service] Verifying certificate: %s", certificateNumber)

	certificate, err := cs.certificateRepo.GetByCertificateNumber(certificateNumber)
	if err != nil {
		log.Printf("[Certificate Service] Certificate not found: %v", err)
		return &VerificationResponse{
			Valid:             false,
			CertificateNumber: certificateNumber,
			Message:           "Certificate not found",
		}, nil
	}

	// Check if expired
	isExpired := false
	if certificate.ExpiresAt != nil && certificate.ExpiresAt.Before(time.Now()) {
		isExpired = true
	}

	// Get student name
	student, _ := cs.userRepo.GetByID(certificate.StudentID)
	studentName := ""
	if student != nil {
		studentName = fmt.Sprintf("%s %s", student.FirstName, student.LastName)
	}

	// Get title
	title := ""
	if certificate.CourseID != nil && *certificate.CourseID != uuid.Nil {
		if course, err := cs.courseRepo.GetByID(*certificate.CourseID); err == nil {
			title = course.Title
		}
	} else if certificate.TestSeriesID != nil && *certificate.TestSeriesID != uuid.Nil {
		if testSeries, err := cs.testSeriesRepo.GetByID(*certificate.TestSeriesID); err == nil {
			title = testSeries.Title
		}
	}

	message := "Certificate is valid"
	if isExpired {
		message = "Certificate has expired"
	}

	return &VerificationResponse{
		Valid:             !isExpired,
		CertificateNumber: certificate.CertificateNumber,
		StudentName:       studentName,
		Title:             title,
		IssuedAt:          certificate.IssuedAt,
		ExpiresAt:         certificate.ExpiresAt,
		Message:           message,
	}, nil
}

// CheckEligibility checks if a student is eligible for a certificate
// Parameters:
//   - studentID: Student UUID
//   - courseID: Course UUID (optional)
//   - testSeriesID: TestSeries UUID (optional)
//
// Returns:
//   - *EligibilityCheckResponse: Eligibility check result
//   - error: Error if check fails
func (cs *CertificateService) CheckEligibility(studentID, courseID, testSeriesID uuid.UUID) (*EligibilityCheckResponse, error) {
	log.Printf("[Certificate Service] Checking certificate eligibility for student: %s", studentID)

	// Check course eligibility
	if courseID != uuid.Nil {
		eligible, err := cs.checkCourseEligibility(studentID, courseID)
		if err != nil {
			return nil, err
		}
		return &EligibilityCheckResponse{
			Eligible: eligible,
			Message:  "Student is eligible for course certificate",
		}, nil
	}

	// Check test eligibility
	if testSeriesID != uuid.Nil {
		eligible, score, err := cs.checkTestEligibilityWithScore(studentID, testSeriesID)
		if err != nil {
			return nil, err
		}

		testSeries, _ := cs.testSeriesRepo.GetByID(testSeriesID)
		message := "Student is eligible for test certificate"
		if !eligible {
			message = fmt.Sprintf("Student score is below passing percentage")
		}

		return &EligibilityCheckResponse{
			Eligible: eligible,
			Score:    score,
			Required: testSeries.PassingPercentage,
			Message:  message,
		}, nil
	}

	return nil, errors.New("course_id or test_series_id must be provided")
}

// Helper functions

// checkCourseEligibility checks if a student has completed a course
func (cs *CertificateService) checkCourseEligibility(studentID, courseID uuid.UUID) (bool, error) {
	// Check if student is enrolled in the course
	enrollment, err := cs.enrollmentRepo.GetByStudentAndCourse(studentID, courseID)
	if err != nil || enrollment == nil {
		return false, nil
	}

	// Check if course is completed (progress >= 100% or status = completed)
	return enrollment.ProgressPercentage >= 100 || enrollment.Status == "completed", nil
}

// checkTestEligibility checks if a student has passed a test
func (cs *CertificateService) checkTestEligibility(studentID, testSeriesID uuid.UUID) (bool, error) {
	eligible, _, err := cs.checkTestEligibilityWithScore(studentID, testSeriesID)
	return eligible, err
}

// checkTestEligibilityWithScore checks if a student has passed a test and returns the score
func (cs *CertificateService) checkTestEligibilityWithScore(studentID, testSeriesID uuid.UUID) (bool, float64, error) {
	// Get test series
	testSeries, err := cs.testSeriesRepo.GetByID(testSeriesID)
	if err != nil {
		return false, 0, fmt.Errorf("test series not found: %w", err)
	}

	// Get latest attempt by student
	attempt, err := cs.attemptRepo.GetLatestByStudentAndTestSeries(studentID, testSeriesID)
	if err != nil {
		return false, 0, nil // No attempt yet
	}

	// Check if passed
	passed := attempt.Percentage >= float64(testSeries.PassingPercentage)
	return passed, attempt.Percentage, nil
}

// certificateToResponse converts a Certificate model to a CertificateResponse
func (cs *CertificateService) certificateToResponse(cert *models.Certificate) *CertificateResponse {
	student, _ := cs.userRepo.GetByID(cert.StudentID)
	studentName := ""
	studentEmail := ""
	if student != nil {
		studentName = fmt.Sprintf("%s %s", student.FirstName, student.LastName)
		studentEmail = student.Email
	}

	courseName := ""
	if cert.CourseID != nil && *cert.CourseID != uuid.Nil {
		if course, err := cs.courseRepo.GetByID(*cert.CourseID); err == nil {
			courseName = course.Title
		}
	}

	testSeriesName := ""
	if cert.TestSeriesID != nil && *cert.TestSeriesID != uuid.Nil {
		if testSeries, err := cs.testSeriesRepo.GetByID(*cert.TestSeriesID); err == nil {
			testSeriesName = testSeries.Title
		}
	}

	isExpired := false
	if cert.ExpiresAt != nil {
		isExpired = cert.ExpiresAt.Before(time.Now())
	}

	verificationURL := fmt.Sprintf("/api/v1/certificates/verify/%s", cert.CertificateNumber)

	return &CertificateResponse{
		ID:                cert.ID,
		StudentID:         cert.StudentID,
		StudentName:       studentName,
		StudentEmail:      studentEmail,
		CourseID:          cert.CourseID,
		CourseName:        courseName,
		TestSeriesID:      cert.TestSeriesID,
		TestSeriesName:    testSeriesName,
		CertificateNumber: cert.CertificateNumber,
		IssuedAt:          cert.IssuedAt,
		ExpiresAt:         cert.ExpiresAt,
		IsExpired:         isExpired,
		VerificationURL:   verificationURL,
	}
}

// getStudentName retrieves the full name of a student
func (cs *CertificateService) getStudentName(studentID uuid.UUID) string {
	student, err := cs.userRepo.GetByID(studentID)
	if err != nil {
		return "Unknown"
	}
	return fmt.Sprintf("%s %s", student.FirstName, student.LastName)
}

// generateCertificateNumber generates a unique certificate number
func generateCertificateNumber() string {
	return fmt.Sprintf("CERT-%d-%s", time.Now().Unix(), uuid.New().String()[:8])
}
