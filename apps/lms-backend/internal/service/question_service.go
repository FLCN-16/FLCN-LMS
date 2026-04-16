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

// QuestionService handles question business logic
type QuestionService struct {
	questionRepo       *repository.QuestionRepository
	testSeriesRepo     *repository.TestSeriesRepository
	questionOptionRepo *repository.QuestionOptionRepository
}

// NewQuestionService creates a new question service instance
// Parameters:
//   - questionRepo: Question repository for database operations
//   - testSeriesRepo: Test series repository for database operations
//   - questionOptionRepo: Question option repository for database operations
//
// Returns:
//   - *QuestionService: New question service instance
func NewQuestionService(
	questionRepo *repository.QuestionRepository,
	testSeriesRepo *repository.TestSeriesRepository,
	questionOptionRepo *repository.QuestionOptionRepository,
) *QuestionService {
	return &QuestionService{
		questionRepo:       questionRepo,
		testSeriesRepo:     testSeriesRepo,
		questionOptionRepo: questionOptionRepo,
	}
}

// OptionRequest represents a question option in request
type OptionRequest struct {
	OptionText string `json:"option_text" binding:"required,min=1"`
	IsCorrect  bool   `json:"is_correct"`
	OrderIndex int    `json:"order_index" binding:"min=0"`
}

// CreateQuestionRequest represents a question creation request
type CreateQuestionRequest struct {
	TestSeriesID    uuid.UUID       `json:"test_series_id" binding:"required"`
	QuestionText    string          `json:"question_text" binding:"required,min=5"`
	QuestionType    string          `json:"question_type" binding:"required,oneof=multiple_choice short_answer essay true_false"`
	DifficultyLevel string          `json:"difficulty_level" binding:"required,oneof=easy medium hard"`
	Marks           float64         `json:"marks" binding:"required,min=0"`
	OrderIndex      int             `json:"order_index" binding:"min=0"`
	Options         []OptionRequest `json:"options" binding:"required_if=QuestionType multiple_choice"`
}

// UpdateQuestionRequest represents a question update request
type UpdateQuestionRequest struct {
	QuestionText    string          `json:"question_text" binding:"omitempty,min=5"`
	QuestionType    string          `json:"question_type" binding:"omitempty,oneof=multiple_choice short_answer essay true_false"`
	DifficultyLevel string          `json:"difficulty_level" binding:"omitempty,oneof=easy medium hard"`
	Marks           *float64        `json:"marks" binding:"omitempty,min=0"`
	OrderIndex      *int            `json:"order_index" binding:"omitempty,min=0"`
	Options         []OptionRequest `json:"options"`
}

// QuestionOptionResponse represents a question option in responses
type QuestionOptionResponse struct {
	ID         uuid.UUID `json:"id"`
	QuestionID uuid.UUID `json:"question_id"`
	OptionText string    `json:"option_text"`
	IsCorrect  bool      `json:"is_correct"`
	OrderIndex int       `json:"order_index"`
}

// QuestionResponse represents a question in API responses
type QuestionResponse struct {
	ID              uuid.UUID                `json:"id"`
	TestSeriesID    uuid.UUID                `json:"test_series_id"`
	QuestionText    string                   `json:"question_text"`
	QuestionType    string                   `json:"question_type"`
	DifficultyLevel string                   `json:"difficulty_level"`
	Marks           float64                  `json:"marks"`
	OrderIndex      int                      `json:"order_index"`
	CreatedAt       time.Time                `json:"created_at"`
	UpdatedAt       time.Time                `json:"updated_at"`
	Options         []QuestionOptionResponse `json:"options,omitempty"`
}

// QuestionValidationError represents validation errors for a question
type QuestionValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// ValidateQuestionResponse represents the result of question validation
type ValidateQuestionResponse struct {
	IsValid bool                      `json:"is_valid"`
	Errors  []QuestionValidationError `json:"errors,omitempty"`
}

// CreateQuestion creates a new question
// Parameters:
//   - req: Question creation request
//
// Returns:
//   - *QuestionResponse: Created question details
//   - error: Error if creation fails
func (qs *QuestionService) CreateQuestion(req *CreateQuestionRequest) (*QuestionResponse, error) {
	log.Println("[Question Service] Creating new question")

	// Validate input
	if req.TestSeriesID == uuid.Nil || req.QuestionText == "" {
		return nil, errors.New("test_series_id and question_text are required")
	}

	// Verify test series exists
	_, err := qs.testSeriesRepo.GetByID(req.TestSeriesID)
	if err != nil {
		log.Printf("[Question Service] Test series not found: %v", err)
		return nil, fmt.Errorf("test series not found: %w", err)
	}

	// Validate question type specific requirements
	if req.QuestionType == "multiple_choice" && (len(req.Options) < 2) {
		return nil, errors.New("multiple choice questions must have at least 2 options")
	}

	// Check that at least one option is correct for multiple choice
	if req.QuestionType == "multiple_choice" {
		hasCorrectOption := false
		for _, opt := range req.Options {
			if opt.IsCorrect {
				hasCorrectOption = true
				break
			}
		}
		if !hasCorrectOption {
			return nil, errors.New("multiple choice questions must have at least one correct option")
		}
	}

	// Create question
	question := &models.Question{
		ID:              uuid.New(),
		TestSeriesID:    req.TestSeriesID,
		QuestionText:    req.QuestionText,
		QuestionType:    req.QuestionType,
		DifficultyLevel: req.DifficultyLevel,
		Marks:           int(req.Marks),
		OrderIndex:      req.OrderIndex,
	}

	if err := qs.questionRepo.Create(question); err != nil {
		log.Printf("[Question Service] Failed to create question: %v", err)
		return nil, fmt.Errorf("failed to create question: %w", err)
	}

	// Create options if provided
	for _, optReq := range req.Options {
		option := &models.QuestionOption{
			ID:         uuid.New(),
			QuestionID: question.ID,
			OptionText: optReq.OptionText,
			IsCorrect:  optReq.IsCorrect,
			OrderIndex: optReq.OrderIndex,
		}
		if err := qs.questionOptionRepo.Create(option); err != nil {
			log.Printf("[Question Service] Failed to create question option: %v", err)
			return nil, fmt.Errorf("failed to create question option: %w", err)
		}
	}

	log.Printf("[Question Service] Question created successfully: %s", question.ID)
	return qs.getQuestionWithOptions(question.ID)
}

// GetQuestion retrieves a question by ID
// Parameters:
//   - id: Question UUID
//
// Returns:
//   - *QuestionResponse: Question details
//   - error: Error if question not found
func (qs *QuestionService) GetQuestion(id uuid.UUID) (*QuestionResponse, error) {
	question, err := qs.questionRepo.GetByID(id)
	if err != nil {
		log.Printf("[Question Service] Failed to get question %s: %v", id, err)
		return nil, err
	}
	_ = question // Mark as used
	return qs.getQuestionWithOptions(id)
}

// ListQuestions retrieves paginated list of questions
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []QuestionResponse: List of questions
//   - int64: Total count of questions
//   - error: Error if query fails
func (qs *QuestionService) ListQuestions(page, limit int) ([]QuestionResponse, int64, error) {
	questions, total, err := qs.questionRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Question Service] Failed to list questions: %v", err)
		return nil, 0, err
	}

	var responses []QuestionResponse
	for _, question := range questions {
		if resp, err := qs.getQuestionWithOptions(question.ID); err == nil {
			responses = append(responses, *resp)
		}
	}

	return responses, total, nil
}

// GetQuestionsByTestSeries retrieves all questions for a specific test series
// Parameters:
//   - testSeriesID: Test series UUID
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []QuestionResponse: List of questions
//   - int64: Total count of questions
//   - error: Error if query fails
func (qs *QuestionService) GetQuestionsByTestSeries(testSeriesID uuid.UUID, page, limit int) ([]QuestionResponse, int64, error) {
	questions, total, err := qs.questionRepo.GetByTestSeriesID(testSeriesID, page, limit)
	if err != nil {
		log.Printf("[Question Service] Failed to get questions for test series: %v", err)
		return nil, 0, err
	}

	var responses []QuestionResponse
	for _, question := range questions {
		if resp, err := qs.getQuestionWithOptions(question.ID); err == nil {
			responses = append(responses, *resp)
		}
	}

	return responses, total, nil
}

// UpdateQuestion updates an existing question
// Parameters:
//   - id: Question UUID
//   - req: Update request with partial question data
//
// Returns:
//   - *QuestionResponse: Updated question details
//   - error: Error if update fails
func (qs *QuestionService) UpdateQuestion(id uuid.UUID, req *UpdateQuestionRequest) (*QuestionResponse, error) {
	log.Printf("[Question Service] Updating question: %s", id)

	// Get existing question
	question, err := qs.questionRepo.GetByID(id)
	if err != nil {
		log.Printf("[Question Service] Failed to get question %s: %v", id, err)
		return nil, err
	}

	// Update fields if provided
	if req.QuestionText != "" {
		question.QuestionText = req.QuestionText
	}
	if req.QuestionType != "" {
		question.QuestionType = req.QuestionType
	}
	if req.DifficultyLevel != "" {
		question.DifficultyLevel = req.DifficultyLevel
	}
	if req.Marks != nil {
		question.Marks = int(*req.Marks)
	}
	if req.OrderIndex != nil {
		question.OrderIndex = *req.OrderIndex
	}

	if err := qs.questionRepo.Update(question); err != nil {
		log.Printf("[Question Service] Failed to update question: %v", err)
		return nil, fmt.Errorf("failed to update question: %w", err)
	}

	// Update options if provided
	if len(req.Options) > 0 {
		// Delete existing options
		// Note: This assumes you have a method to delete options by question ID
		// If not, you may need to implement this differently

		// Add new options
		for _, optReq := range req.Options {
			option := &models.QuestionOption{
				ID:         uuid.New(),
				QuestionID: question.ID,
				OptionText: optReq.OptionText,
				IsCorrect:  optReq.IsCorrect,
				OrderIndex: optReq.OrderIndex,
			}
			if err := qs.questionOptionRepo.Create(option); err != nil {
				log.Printf("[Question Service] Failed to create question option: %v", err)
				return nil, fmt.Errorf("failed to create question option: %w", err)
			}
		}
	}

	log.Printf("[Question Service] Question updated successfully: %s", id)
	return qs.getQuestionWithOptions(id)
}

// DeleteQuestion deletes a question
// Parameters:
//   - id: Question UUID
//
// Returns:
//   - error: Error if deletion fails
func (qs *QuestionService) DeleteQuestion(id uuid.UUID) error {
	log.Printf("[Question Service] Deleting question: %s", id)

	// Verify question exists
	_, err := qs.questionRepo.GetByID(id)
	if err != nil {
		log.Printf("[Question Service] Failed to get question %s: %v", id, err)
		return err
	}

	if err := qs.questionRepo.Delete(id); err != nil {
		log.Printf("[Question Service] Failed to delete question: %v", err)
		return fmt.Errorf("failed to delete question: %w", err)
	}

	log.Printf("[Question Service] Question deleted successfully: %s", id)
	return nil
}

// SearchQuestions searches for questions by question text
// Parameters:
//   - query: Search query
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []QuestionResponse: List of matching questions
//   - int64: Total count of matching questions
//   - error: Error if query fails
func (qs *QuestionService) SearchQuestions(query string, page, limit int) ([]QuestionResponse, int64, error) {
	questions, total, err := qs.questionRepo.Search(query, page, limit)
	if err != nil {
		log.Printf("[Question Service] Failed to search questions: %v", err)
		return nil, 0, err
	}

	var responses []QuestionResponse
	for _, question := range questions {
		if resp, err := qs.getQuestionWithOptions(question.ID); err == nil {
			responses = append(responses, *resp)
		}
	}

	return responses, total, nil
}

// ValidateQuestion validates a question structure
// Parameters:
//   - req: Question to validate
//
// Returns:
//   - *ValidateQuestionResponse: Validation result with any errors
func (qs *QuestionService) ValidateQuestion(req *CreateQuestionRequest) *ValidateQuestionResponse {
	log.Printf("[Question Service] Validating question")

	var errors []QuestionValidationError

	// Validate question text
	if req.QuestionText == "" {
		errors = append(errors, QuestionValidationError{
			Field:   "question_text",
			Message: "Question text is required",
		})
	} else if len(req.QuestionText) < 5 {
		errors = append(errors, QuestionValidationError{
			Field:   "question_text",
			Message: "Question text must be at least 5 characters",
		})
	}

	// Validate question type
	validTypes := []string{"multiple_choice", "short_answer", "essay", "true_false"}
	isValidType := false
	for _, t := range validTypes {
		if req.QuestionType == t {
			isValidType = true
			break
		}
	}
	if !isValidType {
		errors = append(errors, QuestionValidationError{
			Field:   "question_type",
			Message: fmt.Sprintf("Invalid question type: %s", req.QuestionType),
		})
	}

	// Validate difficulty level
	validDifficulties := []string{"easy", "medium", "hard"}
	isValidDifficulty := false
	for _, d := range validDifficulties {
		if req.DifficultyLevel == d {
			isValidDifficulty = true
			break
		}
	}
	if !isValidDifficulty {
		errors = append(errors, QuestionValidationError{
			Field:   "difficulty_level",
			Message: fmt.Sprintf("Invalid difficulty level: %s", req.DifficultyLevel),
		})
	}

	// Validate marks
	if req.Marks < 0 {
		errors = append(errors, QuestionValidationError{
			Field:   "marks",
			Message: "Marks cannot be negative",
		})
	}

	// Validate options for multiple choice questions
	if req.QuestionType == "multiple_choice" {
		if len(req.Options) < 2 {
			errors = append(errors, QuestionValidationError{
				Field:   "options",
				Message: "Multiple choice questions must have at least 2 options",
			})
		} else {
			hasCorrectOption := false
			for _, opt := range req.Options {
				if opt.IsCorrect {
					hasCorrectOption = true
					break
				}
			}
			if !hasCorrectOption {
				errors = append(errors, QuestionValidationError{
					Field:   "options",
					Message: "Multiple choice questions must have at least one correct option",
				})
			}
		}
	}

	return &ValidateQuestionResponse{
		IsValid: len(errors) == 0,
		Errors:  errors,
	}
}

// GetQuestionWithOptions retrieves a question with its options
// Parameters:
//   - id: Question UUID
//
// Returns:
//   - *QuestionResponse: Question with options
//   - error: Error if query fails
func (qs *QuestionService) GetQuestionWithOptions(id uuid.UUID) (*QuestionResponse, error) {
	return qs.getQuestionWithOptions(id)
}

// GetQuestionCount returns the total number of questions
// Returns:
//   - int64: Total count of questions
//   - error: Error if query fails
func (qs *QuestionService) GetQuestionCount() (int64, error) {
	count, err := qs.questionRepo.GetQuestionCount()
	if err != nil {
		log.Printf("[Question Service] Failed to get question count: %v", err)
		return 0, err
	}
	return count, nil
}

// GetQuestionCountByTestSeries returns the total number of questions in a test series
// Parameters:
//   - testSeriesID: Test series UUID
//
// Returns:
//   - int64: Total count of questions in the test series
//   - error: Error if query fails
func (qs *QuestionService) GetQuestionCountByTestSeries(testSeriesID uuid.UUID) (int64, error) {
	count, err := qs.questionRepo.GetQuestionCountByTestSeries(testSeriesID)
	if err != nil {
		log.Printf("[Question Service] Failed to get question count for test series: %v", err)
		return 0, err
	}
	return count, nil
}

// Helper functions

// getQuestionWithOptions retrieves a question with its options
func (qs *QuestionService) getQuestionWithOptions(id uuid.UUID) (*QuestionResponse, error) {
	question, err := qs.questionRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Get options - Note: This assumes the question model has options loaded
	// If not, you need to fetch them separately
	var optionResponses []QuestionOptionResponse
	if question.Options != nil {
		for _, opt := range question.Options {
			optionResponses = append(optionResponses, QuestionOptionResponse{
				ID:         opt.ID,
				QuestionID: opt.QuestionID,
				OptionText: opt.OptionText,
				IsCorrect:  opt.IsCorrect,
				OrderIndex: opt.OrderIndex,
			})
		}
	}

	return &QuestionResponse{
		ID:              question.ID,
		TestSeriesID:    question.TestSeriesID,
		QuestionText:    question.QuestionText,
		QuestionType:    question.QuestionType,
		DifficultyLevel: question.DifficultyLevel,
		Marks:           float64(question.Marks),
		OrderIndex:      question.OrderIndex,
		CreatedAt:       question.CreatedAt,
		UpdatedAt:       question.UpdatedAt,
		Options:         optionResponses,
	}, nil
}

// questionToResponse converts a Question model to a QuestionResponse (without options)
func questionToResponse(question *models.Question) *QuestionResponse {
	return &QuestionResponse{
		ID:              question.ID,
		TestSeriesID:    question.TestSeriesID,
		QuestionText:    question.QuestionText,
		QuestionType:    question.QuestionType,
		DifficultyLevel: question.DifficultyLevel,
		Marks:           float64(question.Marks),
		OrderIndex:      question.OrderIndex,
		CreatedAt:       question.CreatedAt,
		UpdatedAt:       question.UpdatedAt,
	}
}
