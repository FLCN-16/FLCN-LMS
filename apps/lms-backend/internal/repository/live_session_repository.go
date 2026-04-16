package repository

import (
	"errors"
	"fmt"
	"time"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LiveSessionRepository handles all database operations for live sessions
type LiveSessionRepository struct {
	db *gorm.DB
}

// NewLiveSessionRepository creates a new live session repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *LiveSessionRepository: New live session repository
func NewLiveSessionRepository(db *gorm.DB) *LiveSessionRepository {
	return &LiveSessionRepository{db: db}
}

// Create saves a new live session to the database
// Parameters:
//   - liveSession: The live session model to create
//
// Returns:
//   - error: Error if creation fails
func (lsr *LiveSessionRepository) Create(liveSession *models.LiveSession) error {
	if liveSession.ID == uuid.Nil {
		liveSession.ID = uuid.New()
	}
	if err := lsr.db.Create(liveSession).Error; err != nil {
		return fmt.Errorf("failed to create live session: %w", err)
	}
	return nil
}

// GetByID retrieves a live session by its UUID
// Parameters:
//   - id: The live session's UUID
//
// Returns:
//   - *models.LiveSession: The live session if found
//   - error: Error if live session not found or query fails
func (lsr *LiveSessionRepository) GetByID(id uuid.UUID) (*models.LiveSession, error) {
	var liveSession models.LiveSession
	if err := lsr.db.First(&liveSession, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("live session not found")
		}
		return nil, fmt.Errorf("failed to fetch live session: %w", err)
	}
	return &liveSession, nil
}

// GetAll retrieves all live sessions with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of live sessions
//   - int64: Total count of live sessions
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetAll(page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count
	if err := lsr.db.Model(&models.LiveSession{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch live sessions: %w", err)
	}

	return liveSessions, total, nil
}

// Update updates an existing live session's information
// Parameters:
//   - liveSession: The live session model with updated values
//
// Returns:
//   - error: Error if update fails
func (lsr *LiveSessionRepository) Update(liveSession *models.LiveSession) error {
	if err := lsr.db.Save(liveSession).Error; err != nil {
		return fmt.Errorf("failed to update live session: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a live session
// Parameters:
//   - id: The live session's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"status": "active"})
//
// Returns:
//   - error: Error if update fails
func (lsr *LiveSessionRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := lsr.db.Model(&models.LiveSession{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update live session: %w", err)
	}
	return nil
}

// Delete removes a live session from the database
// Parameters:
//   - id: The live session's UUID
//
// Returns:
//   - error: Error if deletion fails
func (lsr *LiveSessionRepository) Delete(id uuid.UUID) error {
	if err := lsr.db.Delete(&models.LiveSession{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete live session: %w", err)
	}
	return nil
}

// GetByInstructorID retrieves all live sessions for a specific instructor with pagination
// Parameters:
//   - instructorID: The instructor's UUID
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of live sessions
//   - int64: Total count of live sessions for the instructor
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetByInstructorID(instructorID uuid.UUID, page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count for instructor
	if err := lsr.db.Model(&models.LiveSession{}).Where("instructor_id = ?", instructorID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("instructor_id = ?", instructorID).Offset(offset).Limit(limit).Order("start_time DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch live sessions by instructor: %w", err)
	}

	return liveSessions, total, nil
}

// GetByStatus retrieves all live sessions with a specific status with pagination
// Parameters:
//   - status: The session status (e.g., "scheduled", "live", "ended", "cancelled")
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of live sessions
//   - int64: Total count of live sessions with that status
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetByStatus(status string, page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count for status
	if err := lsr.db.Model(&models.LiveSession{}).Where("status = ?", status).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("status = ?", status).Offset(offset).Limit(limit).Order("start_time DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch live sessions by status: %w", err)
	}

	return liveSessions, total, nil
}

// AddParticipant adds a participant to a live session
// Parameters:
//   - sessionID: The live session's UUID
//   - userID: The user's UUID to add as participant
//
// Returns:
//   - error: Error if operation fails
func (lsr *LiveSessionRepository) AddParticipant(sessionID, userID uuid.UUID) error {
	// Get the live session
	var liveSession models.LiveSession
	if err := lsr.db.First(&liveSession, "id = ?", sessionID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("live session not found")
		}
		return fmt.Errorf("failed to fetch live session: %w", err)
	}

	// Add participant ID to the session's participants list (assuming it's stored as JSON array or separate table)
	// This is a generic implementation - adjust based on your actual model structure
	if err := lsr.db.Model(&liveSession).Update("participant_count", gorm.Expr("participant_count + ?", 1)).Error; err != nil {
		return fmt.Errorf("failed to add participant: %w", err)
	}

	return nil
}

// RemoveParticipant removes a participant from a live session
// Parameters:
//   - sessionID: The live session's UUID
//   - userID: The user's UUID to remove from participants
//
// Returns:
//   - error: Error if operation fails
func (lsr *LiveSessionRepository) RemoveParticipant(sessionID, userID uuid.UUID) error {
	// Get the live session
	var liveSession models.LiveSession
	if err := lsr.db.First(&liveSession, "id = ?", sessionID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("live session not found")
		}
		return fmt.Errorf("failed to fetch live session: %w", err)
	}

	// Remove participant from the session
	if err := lsr.db.Model(&liveSession).Update("participant_count", gorm.Expr("participant_count - ?", 1)).Error; err != nil {
		return fmt.Errorf("failed to remove participant: %w", err)
	}

	return nil
}

// GetLiveSessionCount returns the total number of live sessions
// Returns:
//   - int64: Total count of live sessions
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetLiveSessionCount() (int64, error) {
	var count int64
	if err := lsr.db.Model(&models.LiveSession{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count live sessions: %w", err)
	}
	return count, nil
}

// GetUpcomingSessions retrieves all upcoming live sessions with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of upcoming sessions
//   - int64: Total count of upcoming sessions
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetUpcomingSessions(page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count of upcoming sessions
	if err := lsr.db.Model(&models.LiveSession{}).
		Where("start_time > NOW() AND status IN ?", []string{"scheduled", "live"}).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("start_time > NOW() AND status IN ?", []string{"scheduled", "live"}).
		Offset(offset).Limit(limit).Order("start_time ASC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch upcoming sessions: %w", err)
	}

	return liveSessions, total, nil
}

// GetActiveSessions retrieves all currently active live sessions with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of active sessions
//   - int64: Total count of active sessions
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetActiveSessions(page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count of active sessions
	if err := lsr.db.Model(&models.LiveSession{}).Where("status = ?", "live").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("status = ?", "live").Offset(offset).Limit(limit).Order("start_time DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch active sessions: %w", err)
	}

	return liveSessions, total, nil
}

// GetByCourseID retrieves all live sessions for a specific course with pagination
// Parameters:
//   - courseID: The course's UUID
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of live sessions
//   - int64: Total count of live sessions for the course
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count for course
	if err := lsr.db.Model(&models.LiveSession{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("start_time DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch live sessions by course: %w", err)
	}

	return liveSessions, total, nil
}

// Search searches for live sessions by title or description
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of matching live sessions
//   - int64: Total count of matching live sessions
//   - error: Error if query fails
func (lsr *LiveSessionRepository) Search(query string, page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := lsr.db.Model(&models.LiveSession{}).Where(
		lsr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where(
		lsr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("start_time DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search live sessions: %w", err)
	}

	return liveSessions, total, nil
}

// GetSessionsByDateRange retrieves live sessions within a date range
// Parameters:
//   - startTime: Start time of the range
//   - endTime: End time of the range
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of live sessions
//   - int64: Total count of live sessions in the range
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetSessionsByDateRange(startTime, endTime string, page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count in range
	if err := lsr.db.Model(&models.LiveSession{}).
		Where("start_time >= ? AND start_time <= ?", startTime, endTime).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("start_time >= ? AND start_time <= ?", startTime, endTime).
		Offset(offset).Limit(limit).Order("start_time ASC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch live sessions: %w", err)
	}

	return liveSessions, total, nil
}

// GetInstructorActiveSessions retrieves all active sessions for a specific instructor
// Parameters:
//   - instructorID: The instructor's UUID
//   - page: Page number (1-based)
//   - limit: Number of live sessions per page
//
// Returns:
//   - []models.LiveSession: Slice of active sessions
//   - int64: Total count of active sessions
//   - error: Error if query fails
func (lsr *LiveSessionRepository) GetInstructorActiveSessions(instructorID uuid.UUID, page, limit int) ([]models.LiveSession, int64, error) {
	var liveSessions []models.LiveSession
	var total int64

	// Get total count of active sessions for instructor
	if err := lsr.db.Model(&models.LiveSession{}).
		Where("instructor_id = ? AND status = ?", instructorID, "live").
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count live sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("instructor_id = ? AND status = ?", instructorID, "live").
		Offset(offset).Limit(limit).Order("start_time DESC").Find(&liveSessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch active sessions: %w", err)
	}

	return liveSessions, total, nil
}

// GetUpcoming retrieves upcoming live sessions (scheduled for future)
func (lsr *LiveSessionRepository) GetUpcoming(page, limit int) ([]models.LiveSession, int64, error) {
	var sessions []models.LiveSession
	var total int64

	now := time.Now()

	// Get total count
	if err := lsr.db.Model(&models.LiveSession{}).
		Where("scheduled_start > ?", now).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count upcoming sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("scheduled_start > ?", now).
		Offset(offset).Limit(limit).Order("scheduled_start ASC").Find(&sessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch upcoming sessions: %w", err)
	}

	return sessions, total, nil
}

// GetByInstructor retrieves all sessions created by an instructor
func (lsr *LiveSessionRepository) GetByInstructor(instructorID uuid.UUID, page, limit int) ([]models.LiveSession, int64, error) {
	var sessions []models.LiveSession
	var total int64

	// Get total count
	if err := lsr.db.Model(&models.LiveSession{}).
		Where("instructor_id = ?", instructorID).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count sessions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lsr.db.Where("instructor_id = ?", instructorID).
		Offset(offset).Limit(limit).Order("created_at DESC").Find(&sessions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch sessions: %w", err)
	}

	return sessions, total, nil
}
