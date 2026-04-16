package repository

import (
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LiveSessionParticipantRepository handles all database operations for live session participants
type LiveSessionParticipantRepository struct {
	db *gorm.DB
}

// NewLiveSessionParticipantRepository creates a new participant repository instance
func NewLiveSessionParticipantRepository(db *gorm.DB) *LiveSessionParticipantRepository {
	return &LiveSessionParticipantRepository{db: db}
}

// Create saves a new participant to a live session
func (lspr *LiveSessionParticipantRepository) Create(participant *models.LiveSessionParticipant) error {
	if participant.ID == uuid.Nil {
		participant.ID = uuid.New()
	}
	if err := lspr.db.Create(participant).Error; err != nil {
		return fmt.Errorf("failed to create session participant: %w", err)
	}
	return nil
}

// GetByID retrieves a participant by ID
func (lspr *LiveSessionParticipantRepository) GetByID(id uuid.UUID) (*models.LiveSessionParticipant, error) {
	var participant models.LiveSessionParticipant
	if err := lspr.db.First(&participant, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("participant not found")
		}
		return nil, fmt.Errorf("failed to fetch participant: %w", err)
	}
	return &participant, nil
}

// GetBySessionID retrieves all participants in a session
func (lspr *LiveSessionParticipantRepository) GetBySessionID(sessionID uuid.UUID) ([]models.LiveSessionParticipant, error) {
	var participants []models.LiveSessionParticipant
	if err := lspr.db.Where("session_id = ?", sessionID).Find(&participants).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch participants: %w", err)
	}
	return participants, nil
}

// Delete removes a participant from a session
func (lspr *LiveSessionParticipantRepository) Delete(id uuid.UUID) error {
	if err := lspr.db.Delete(&models.LiveSessionParticipant{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete participant: %w", err)
	}
	return nil
}

// DeleteBySessionAndUser removes a specific user from a session
func (lspr *LiveSessionParticipantRepository) DeleteBySessionAndUser(sessionID, userID uuid.UUID) error {
	if err := lspr.db.Delete(&models.LiveSessionParticipant{}, "session_id = ? AND user_id = ?", sessionID, userID).Error; err != nil {
		return fmt.Errorf("failed to remove participant: %w", err)
	}
	return nil
}

// GetParticipantCount returns the count of participants in a session
func (lspr *LiveSessionParticipantRepository) GetParticipantCount(sessionID uuid.UUID) (int64, error) {
	var count int64
	if err := lspr.db.Model(&models.LiveSessionParticipant{}).
		Where("session_id = ?", sessionID).
		Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count participants: %w", err)
	}
	return count, nil
}

// GetBySessionAndUser retrieves a specific participant record
func (lspr *LiveSessionParticipantRepository) GetBySessionAndUser(sessionID, userID uuid.UUID) (*models.LiveSessionParticipant, error) {
	var participant models.LiveSessionParticipant
	if err := lspr.db.Where("session_id = ? AND user_id = ?", sessionID, userID).First(&participant).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch participant: %w", err)
	}
	return &participant, nil
}

// Update updates a participant record
func (lspr *LiveSessionParticipantRepository) Update(participant *models.LiveSessionParticipant) error {
	if err := lspr.db.Save(participant).Error; err != nil {
		return fmt.Errorf("failed to update participant: %w", err)
	}
	return nil
}
