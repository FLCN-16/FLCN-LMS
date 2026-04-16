package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// QuestionRepository handles all database operations for questions
type QuestionRepository struct {
	db *gorm.DB
}

// NewQuestionRepository creates a new question repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *QuestionRepository: New question repository
func NewQuestionRepository(db *gorm.DB) *QuestionRepository {
	return &QuestionRepository{db: db}
}

// Create saves a new question to the database
// Parameters:
//   - question: The question model to create
//
// Returns:
//   - error: Error if creation fails
func (qr *QuestionRepository) Create(question *models.Question) error {
	if question.ID == uuid.Nil {
		question.ID = uuid.New()
	}
	if err := qr.db.Create(question).Error; err != nil {
		return fmt.Errorf("failed to create question: %w", err)
	}
	return nil
}

// GetByID retrieves a question by its UUID
// Parameters:
//   - id: The question's UUID
//
// Returns:
//   - *models.Question: The question if found
//   - error: Error if question not found or query fails
func (qr *QuestionRepository) GetByID(id uuid.UUID) (*models.Question, error) {
	var question models.Question
	if err := qr.db.First(&question, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("question not found")
		}
		return nil, fmt.Errorf("failed to fetch question: %w", err)
	}
	return &question, nil
}

// GetAll retrieves all questions with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []models.Question: Slice of questions
//   - int64: Total count of questions
//   - error: Error if query fails
func (qr *QuestionRepository) GetAll(page, limit int) ([]models.Question, int64, error) {
	var questions []models.Question
	var total int64

	// Get total count
	if err := qr.db.Model(&models.Question{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count questions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := qr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&questions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch questions: %w", err)
	}

	return questions, total, nil
}

// Update updates an existing question's information
// Parameters:
//   - question: The question model with updated values
//
// Returns:
//   - error: Error if update fails
func (qr *QuestionRepository) Update(question *models.Question) error {
	if err := qr.db.Save(question).Error; err != nil {
		return fmt.Errorf("failed to update question: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a question
// Parameters:
//   - id: The question's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"question_text": "Updated Question"})
//
// Returns:
//   - error: Error if update fails
func (qr *QuestionRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := qr.db.Model(&models.Question{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update question: %w", err)
	}
	return nil
}

// Delete removes a question from the database
// Parameters:
//   - id: The question's UUID
//
// Returns:
//   - error: Error if deletion fails
func (qr *QuestionRepository) Delete(id uuid.UUID) error {
	if err := qr.db.Delete(&models.Question{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete question: %w", err)
	}
	return nil
}

// GetByTestSeriesID retrieves all questions for a specific test series with pagination
// Parameters:
//   - testSeriesID: The test series' UUID
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []models.Question: Slice of questions
//   - int64: Total count of questions for the test series
//   - error: Error if query fails
func (qr *QuestionRepository) GetByTestSeriesID(testSeriesID uuid.UUID, page, limit int) ([]models.Question, int64, error) {
	var questions []models.Question
	var total int64

	// Get total count for test series
	if err := qr.db.Model(&models.Question{}).Where("test_series_id = ?", testSeriesID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count questions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := qr.db.Where("test_series_id = ?", testSeriesID).Offset(offset).Limit(limit).Order("sequence_number ASC").Find(&questions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch questions by test series: %w", err)
	}

	return questions, total, nil
}

// GetQuestionCount returns the total number of questions
// Returns:
//   - int64: Total count of questions
//   - error: Error if query fails
func (qr *QuestionRepository) GetQuestionCount() (int64, error) {
	var count int64
	if err := qr.db.Model(&models.Question{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count questions: %w", err)
	}
	return count, nil
}

// GetQuestionCountByTestSeries returns the total number of questions in a test series
// Parameters:
//   - testSeriesID: The test series' UUID
//
// Returns:
//   - int64: Total count of questions in the test series
//   - error: Error if query fails
func (qr *QuestionRepository) GetQuestionCountByTestSeries(testSeriesID uuid.UUID) (int64, error) {
	var count int64
	if err := qr.db.Model(&models.Question{}).Where("test_series_id = ?", testSeriesID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count questions: %w", err)
	}
	return count, nil
}

// Search searches for questions by question text or description
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []models.Question: Slice of matching questions
//   - int64: Total count of matching questions
//   - error: Error if query fails
func (qr *QuestionRepository) Search(query string, page, limit int) ([]models.Question, int64, error) {
	var questions []models.Question
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := qr.db.Model(&models.Question{}).Where(
		qr.db.Where("question_text ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count questions: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := qr.db.Where(
		qr.db.Where("question_text ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("created_at DESC").Find(&questions).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search questions: %w", err)
	}

	return questions, total, nil
}

// GetNextQuestionOrder returns the next sequence number for a question in a test series
// Parameters:
//   - testSeriesID: The test series' UUID
//
// Returns:
//   - int: Next sequence number
//   - error: Error if query fails
func (qr *QuestionRepository) GetNextQuestionOrder(testSeriesID uuid.UUID) (int, error) {
	var maxOrder int
	if err := qr.db.Model(&models.Question{}).Where("test_series_id = ?", testSeriesID).
		Select("COALESCE(MAX(sequence_number), 0)").
		Row().
		Scan(&maxOrder); err != nil {
		return 0, fmt.Errorf("failed to get next question order: %w", err)
	}
	return maxOrder + 1, nil
}
