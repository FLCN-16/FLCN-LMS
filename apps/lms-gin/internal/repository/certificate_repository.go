package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CertificateRepository handles all database operations for certificates
type CertificateRepository struct {
	db *gorm.DB
}

// NewCertificateRepository creates a new certificate repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *CertificateRepository: New certificate repository
func NewCertificateRepository(db *gorm.DB) *CertificateRepository {
	return &CertificateRepository{db: db}
}

// Create saves a new certificate to the database
// Parameters:
//   - certificate: The certificate model to create
//
// Returns:
//   - error: Error if creation fails
func (cr *CertificateRepository) Create(certificate *models.Certificate) error {
	if certificate.ID == uuid.Nil {
		certificate.ID = uuid.New()
	}
	if err := cr.db.Create(certificate).Error; err != nil {
		return fmt.Errorf("failed to create certificate: %w", err)
	}
	return nil
}

// GetByID retrieves a certificate by its UUID
// Parameters:
//   - id: The certificate's UUID
//
// Returns:
//   - *models.Certificate: The certificate if found
//   - error: Error if certificate not found or query fails
func (cr *CertificateRepository) GetByID(id uuid.UUID) (*models.Certificate, error) {
	var certificate models.Certificate
	if err := cr.db.First(&certificate, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("certificate not found")
		}
		return nil, fmt.Errorf("failed to fetch certificate: %w", err)
	}
	return &certificate, nil
}

// GetAll retrieves all certificates with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of certificates
//   - int64: Total count of certificates
//   - error: Error if query fails
func (cr *CertificateRepository) GetAll(page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count
	if err := cr.db.Model(&models.Certificate{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch certificates: %w", err)
	}

	return certificates, total, nil
}

// Update updates an existing certificate's information
// Parameters:
//   - certificate: The certificate model with updated values
//
// Returns:
//   - error: Error if update fails
func (cr *CertificateRepository) Update(certificate *models.Certificate) error {
	if err := cr.db.Save(certificate).Error; err != nil {
		return fmt.Errorf("failed to update certificate: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a certificate
// Parameters:
//   - id: The certificate's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"status": "issued"})
//
// Returns:
//   - error: Error if update fails
func (cr *CertificateRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := cr.db.Model(&models.Certificate{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update certificate: %w", err)
	}
	return nil
}

// Delete removes a certificate from the database
// Parameters:
//   - id: The certificate's UUID
//
// Returns:
//   - error: Error if deletion fails
func (cr *CertificateRepository) Delete(id uuid.UUID) error {
	if err := cr.db.Delete(&models.Certificate{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete certificate: %w", err)
	}
	return nil
}

// GetByStudentID retrieves all certificates for a specific student with pagination
// Parameters:
//   - studentID: The student's UUID
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of certificates
//   - int64: Total count of certificates for the student
//   - error: Error if query fails
func (cr *CertificateRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count for student
	if err := cr.db.Model(&models.Certificate{}).Where("student_id = ?", studentID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("student_id = ?", studentID).Offset(offset).Limit(limit).Order("issued_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch certificates by student: %w", err)
	}

	return certificates, total, nil
}

// GetByCourseID retrieves all certificates for a specific course with pagination
// Parameters:
//   - courseID: The course's UUID
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of certificates
//   - int64: Total count of certificates for the course
//   - error: Error if query fails
func (cr *CertificateRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count for course
	if err := cr.db.Model(&models.Certificate{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("issued_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch certificates by course: %w", err)
	}

	return certificates, total, nil
}

// GetCertificateCount returns the total number of certificates
// Returns:
//   - int64: Total count of certificates
//   - error: Error if query fails
func (cr *CertificateRepository) GetCertificateCount() (int64, error) {
	var count int64
	if err := cr.db.Model(&models.Certificate{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count certificates: %w", err)
	}
	return count, nil
}

// GetCertificateCountByCourse returns the total number of certificates issued for a specific course
// Parameters:
//   - courseID: The course's UUID
//
// Returns:
//   - int64: Total count of certificates for the course
//   - error: Error if query fails
func (cr *CertificateRepository) GetCertificateCountByCourse(courseID uuid.UUID) (int64, error) {
	var count int64
	if err := cr.db.Model(&models.Certificate{}).Where("course_id = ?", courseID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count certificates: %w", err)
	}
	return count, nil
}

// GetCertificateCountByStudent returns the total number of certificates earned by a student
// Parameters:
//   - studentID: The student's UUID
//
// Returns:
//   - int64: Total count of certificates for the student
//   - error: Error if query fails
func (cr *CertificateRepository) GetCertificateCountByStudent(studentID uuid.UUID) (int64, error) {
	var count int64
	if err := cr.db.Model(&models.Certificate{}).Where("student_id = ?", studentID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count certificates: %w", err)
	}
	return count, nil
}

// GetIssuedCertificates retrieves all issued certificates with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of issued certificates
//   - int64: Total count of issued certificates
//   - error: Error if query fails
func (cr *CertificateRepository) GetIssuedCertificates(page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count of issued certificates
	if err := cr.db.Model(&models.Certificate{}).Where("status = ?", "issued").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("status = ?", "issued").Offset(offset).Limit(limit).Order("issued_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch issued certificates: %w", err)
	}

	return certificates, total, nil
}

// GetPendingCertificates retrieves all pending certificates with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of pending certificates
//   - int64: Total count of pending certificates
//   - error: Error if query fails
func (cr *CertificateRepository) GetPendingCertificates(page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count of pending certificates
	if err := cr.db.Model(&models.Certificate{}).Where("status = ?", "pending").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("status = ?", "pending").Offset(offset).Limit(limit).Order("created_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch pending certificates: %w", err)
	}

	return certificates, total, nil
}

// GetByStatus retrieves all certificates with a specific status with pagination
// Parameters:
//   - status: The certificate status (e.g., "pending", "issued", "revoked")
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of certificates
//   - int64: Total count of certificates with that status
//   - error: Error if query fails
func (cr *CertificateRepository) GetByStatus(status string, page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count for status
	if err := cr.db.Model(&models.Certificate{}).Where("status = ?", status).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("status = ?", status).Offset(offset).Limit(limit).Order("issued_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch certificates by status: %w", err)
	}

	return certificates, total, nil
}

// Search searches for certificates by certificate number or student/course information
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of matching certificates
//   - int64: Total count of matching certificates
//   - error: Error if query fails
func (cr *CertificateRepository) Search(query string, page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query - searches by certificate number, student email, or course title via joins
	if err := cr.db.Model(&models.Certificate{}).
		Joins("LEFT JOIN users ON certificates.student_id = users.id").
		Joins("LEFT JOIN courses ON certificates.course_id = courses.id").
		Where(
			cr.db.Where("certificates.certificate_number ILIKE ?", searchPattern).
				Or("users.email ILIKE ?", searchPattern).
				Or("courses.title ILIKE ?", searchPattern),
		).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.
		Joins("LEFT JOIN users ON certificates.student_id = users.id").
		Joins("LEFT JOIN courses ON certificates.course_id = courses.id").
		Where(
			cr.db.Where("certificates.certificate_number ILIKE ?", searchPattern).
				Or("users.email ILIKE ?", searchPattern).
				Or("courses.title ILIKE ?", searchPattern),
		).
		Offset(offset).Limit(limit).Order("certificates.issued_at DESC").
		Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search certificates: %w", err)
	}

	return certificates, total, nil
}

// GetStudentCourseCertificate retrieves the certificate for a specific student and course combination
// Parameters:
//   - studentID: The student's UUID
//   - courseID: The course's UUID
//
// Returns:
//   - *models.Certificate: The certificate if found
//   - error: Error if certificate not found or query fails
func (cr *CertificateRepository) GetStudentCourseCertificate(studentID, courseID uuid.UUID) (*models.Certificate, error) {
	var certificate models.Certificate
	if err := cr.db.Where("student_id = ? AND course_id = ?", studentID, courseID).First(&certificate).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("certificate not found")
		}
		return nil, fmt.Errorf("failed to fetch certificate: %w", err)
	}
	return &certificate, nil
}

// CheckCertificateExists checks if a certificate exists for a student and course
// Parameters:
//   - studentID: The student's UUID
//   - courseID: The course's UUID
//
// Returns:
//   - bool: True if certificate exists
//   - error: Error if query fails
func (cr *CertificateRepository) CheckCertificateExists(studentID, courseID uuid.UUID) (bool, error) {
	var count int64
	if err := cr.db.Model(&models.Certificate{}).
		Where("student_id = ? AND course_id = ?", studentID, courseID).
		Count(&count).Error; err != nil {
		return false, fmt.Errorf("failed to check certificate: %w", err)
	}
	return count > 0, nil
}

// GetRecentCertificates retrieves the most recently issued certificates with pagination
// Parameters:
//   - days: Number of days to look back for recent certificates
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of recent certificates
//   - int64: Total count of recent certificates
//   - error: Error if query fails
func (cr *CertificateRepository) GetRecentCertificates(days int, page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count of certificates issued in the last N days
	if err := cr.db.Model(&models.Certificate{}).
		Where("issued_at >= NOW() - INTERVAL ? DAY", days).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("issued_at >= NOW() - INTERVAL ? DAY", days).
		Offset(offset).Limit(limit).Order("issued_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch recent certificates: %w", err)
	}

	return certificates, total, nil
}

// GetCertificatesByIssueDateRange retrieves certificates issued within a date range
// Parameters:
//   - startDate: Start date for the range
//   - endDate: End date for the range
//   - page: Page number (1-based)
//   - limit: Number of certificates per page
//
// Returns:
//   - []models.Certificate: Slice of certificates
//   - int64: Total count of certificates in the range
//   - error: Error if query fails
func (cr *CertificateRepository) GetCertificatesByIssueDateRange(startDate, endDate string, page, limit int) ([]models.Certificate, int64, error) {
	var certificates []models.Certificate
	var total int64

	// Get total count in range
	if err := cr.db.Model(&models.Certificate{}).
		Where("issued_at >= ? AND issued_at <= ?", startDate, endDate).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count certificates: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("issued_at >= ? AND issued_at <= ?", startDate, endDate).
		Offset(offset).Limit(limit).Order("issued_at DESC").Find(&certificates).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch certificates: %w", err)
	}

	return certificates, total, nil
}

// GetByStudentAndCourse retrieves a certificate for a specific student and course
func (cr *CertificateRepository) GetByStudentAndCourse(studentID, courseID uuid.UUID) (*models.Certificate, error) {
	var cert models.Certificate
	if err := cr.db.Where("student_id = ? AND course_id = ?", studentID, courseID).First(&cert).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Not found is not an error
		}
		return nil, fmt.Errorf("failed to fetch certificate: %w", err)
	}
	return &cert, nil
}

// GetByStudentAndTestSeries retrieves a certificate for a specific student and test series
func (cr *CertificateRepository) GetByStudentAndTestSeries(studentID, testSeriesID uuid.UUID) (*models.Certificate, error) {
	var cert models.Certificate
	if err := cr.db.Where("student_id = ? AND test_series_id = ?", studentID, testSeriesID).First(&cert).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Not found is not an error
		}
		return nil, fmt.Errorf("failed to fetch certificate: %w", err)
	}
	return &cert, nil
}

// GetByCertificateNumber retrieves a certificate by its certificate number (for verification)
func (cr *CertificateRepository) GetByCertificateNumber(certNumber string) (*models.Certificate, error) {
	var cert models.Certificate
	if err := cr.db.Where("certificate_number = ?", certNumber).First(&cert).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("certificate not found")
		}
		return nil, fmt.Errorf("failed to fetch certificate: %w", err)
	}
	return &cert, nil
}
