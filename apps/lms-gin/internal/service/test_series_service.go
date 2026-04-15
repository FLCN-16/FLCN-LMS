package service

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
)

// TestSeriesService handles test series business logic
type TestSeriesService struct {
	testSeriesRepo *repository.TestSeriesRepository
	questionRepo   *repository.QuestionRepository
}

// NewTestSeriesService creates a new test series service instance
// Parameters:
//   - testSeriesRepo: Test series repository for database operations
//   - questionRepo: Question repository for database operations
//
// Returns:
//   - *TestSeriesService: New test series service instance
func NewTestSeriesService(testSeriesRepo *repository.TestSeriesRepository, questionRepo *repository.QuestionRepository) *TestSeriesService {
	return &TestSeriesService{
		testSeriesRepo: testSeriesRepo,
		questionRepo:   questionRepo,
	}
}

// CreateTestSeriesRequest represents a test series creation request
type CreateTestSeriesRequest struct {
	Title              string  `json:"title" binding:"required,min=3,max=255"`
	Description        string  `json:"description" binding:"required,min=10"`
	DurationMinutes    int     `json:"duration_minutes" binding:"required,min=1"`
	PassingPercentage  float64 `json:"passing_percentage" binding:"required,min=0,max=100"`
	ShuffleQuestions   bool    `json:"shuffle_questions"`
	ShowCorrectAnswers bool    `json:"show_correct_answers"`
}

// UpdateTestSeriesRequest represents a test series update request
type UpdateTestSeriesRequest struct {
	Title              string   `json:"title" binding:"omitempty,min=3,max=255"`
	Description        string   `json:"description" binding:"omitempty,min=10"`
	DurationMinutes    *int     `json:"duration_minutes" binding:"omitempty,min=1"`
	PassingPercentage  *float64 `json:"passing_percentage" binding:"omitempty,min=0,max=100"`
	ShuffleQuestions   *bool    `json:"shuffle_questions"`
	ShowCorrectAnswers *bool    `json:"show_correct_answers"`
	IsPublished        *bool    `json:"is_published"`
}

// TestSeriesResponse represents a test series in API responses
type TestSeriesResponse struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Slug               string    `json:"slug"`
	Description        string    `json:"description"`
	TotalQuestions     int       `json:"total_questions"`
	DurationMinutes    int       `json:"duration_minutes"`
	PassingPercentage  float64   `json:"passing_percentage"`
	ShuffleQuestions   bool      `json:"shuffle_questions"`
	ShowCorrectAnswers bool      `json:"show_correct_answers"`
	IsPublished        bool      `json:"is_published"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// TestSeriesListResponse represents test series list item
type TestSeriesListResponse struct {
	ID                uuid.UUID `json:"id"`
	Title             string    `json:"title"`
	Slug              string    `json:"slug"`
	Description       string    `json:"description"`
	TotalQuestions    int       `json:"total_questions"`
	DurationMinutes   int       `json:"duration_minutes"`
	PassingPercentage float64   `json:"passing_percentage"`
	IsPublished       bool      `json:"is_published"`
	CreatedAt         time.Time `json:"created_at"`
}

// CreateTestSeries creates a new test series
// Parameters:
//   - req: Test series creation request
//
// Returns:
//   - *TestSeriesResponse: Created test series details
//   - error: Error if creation fails
func (tss *TestSeriesService) CreateTestSeries(req *CreateTestSeriesRequest) (*TestSeriesResponse, error) {
	log.Println("[Test Series Service] Creating new test series:", req.Title)

	// Validate input
	if req.Title == "" || req.Description == "" {
		return nil, errors.New("title and description are required")
	}

	if req.PassingPercentage < 0 || req.PassingPercentage > 100 {
		return nil, errors.New("passing_percentage must be between 0 and 100")
	}

	// Generate slug from title
	testSlug := slug.Make(req.Title)

	// Create test series
	testSeries := &models.TestSeries{
		ID:                 uuid.New(),
		Title:              req.Title,
		Slug:               testSlug,
		Description:        req.Description,
		TotalQuestions:     0, // Will be updated when questions are added
		DurationMinutes:    req.DurationMinutes,
		PassingPercentage:  int(req.PassingPercentage),
		ShuffleQuestions:   req.ShuffleQuestions,
		ShowCorrectAnswers: req.ShowCorrectAnswers,
		IsPublished:        false,
	}

	if err := tss.testSeriesRepo.Create(testSeries); err != nil {
		log.Printf("[Test Series Service] Failed to create test series: %v", err)
		return nil, fmt.Errorf("failed to create test series: %w", err)
	}

	log.Printf("[Test Series Service] Test series created successfully: %s", testSeries.ID)
	return testSeriesToResponse(testSeries), nil
}

// GetTestSeries retrieves a test series by ID
// Parameters:
//   - id: Test series UUID
//
// Returns:
//   - *TestSeriesResponse: Test series details
//   - error: Error if test series not found
func (tss *TestSeriesService) GetTestSeries(id uuid.UUID) (*TestSeriesResponse, error) {
	testSeries, err := tss.testSeriesRepo.GetByID(id)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series %s: %v", id, err)
		return nil, err
	}
	return testSeriesToResponse(testSeries), nil
}

// GetTestSeriesBySlug retrieves a test series by slug
// Parameters:
//   - slug: Test series slug
//
// Returns:
//   - *TestSeriesResponse: Test series details
//   - error: Error if test series not found
func (tss *TestSeriesService) GetTestSeriesBySlug(testSlug string) (*TestSeriesResponse, error) {
	testSeries, err := tss.testSeriesRepo.GetBySlug(testSlug)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series by slug %s: %v", testSlug, err)
		return nil, err
	}
	return testSeriesToResponse(testSeries), nil
}

// ListTestSeries retrieves paginated list of test series
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []TestSeriesListResponse: List of test series
//   - int64: Total count of test series
//   - error: Error if query fails
func (tss *TestSeriesService) ListTestSeries(page, limit int) ([]TestSeriesListResponse, int64, error) {
	testSeriesList, total, err := tss.testSeriesRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Test Series Service] Failed to list test series: %v", err)
		return nil, 0, err
	}

	var responses []TestSeriesListResponse
	for _, ts := range testSeriesList {
		responses = append(responses, TestSeriesListResponse{
			ID:                ts.ID,
			Title:             ts.Title,
			Slug:              ts.Slug,
			Description:       ts.Description,
			TotalQuestions:    ts.TotalQuestions,
			DurationMinutes:   ts.DurationMinutes,
			PassingPercentage: float64(ts.PassingPercentage),
			IsPublished:       ts.IsPublished,
			CreatedAt:         ts.CreatedAt,
		})
	}

	return responses, total, nil
}

// ListPublishedTestSeries retrieves paginated list of published test series
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []TestSeriesListResponse: List of published test series
//   - int64: Total count of published test series
//   - error: Error if query fails
func (tss *TestSeriesService) ListPublishedTestSeries(page, limit int) ([]TestSeriesListResponse, int64, error) {
	testSeriesList, total, err := tss.testSeriesRepo.GetPublishedTestSeries(page, limit)
	if err != nil {
		log.Printf("[Test Series Service] Failed to list published test series: %v", err)
		return nil, 0, err
	}

	var responses []TestSeriesListResponse
	for _, ts := range testSeriesList {
		responses = append(responses, TestSeriesListResponse{
			ID:                ts.ID,
			Title:             ts.Title,
			Slug:              ts.Slug,
			Description:       ts.Description,
			TotalQuestions:    ts.TotalQuestions,
			DurationMinutes:   ts.DurationMinutes,
			PassingPercentage: float64(ts.PassingPercentage),
			IsPublished:       ts.IsPublished,
			CreatedAt:         ts.CreatedAt,
		})
	}

	return responses, total, nil
}

// UpdateTestSeries updates an existing test series
// Parameters:
//   - id: Test series UUID
//   - req: Update request with partial test series data
//
// Returns:
//   - *TestSeriesResponse: Updated test series details
//   - error: Error if update fails
func (tss *TestSeriesService) UpdateTestSeries(id uuid.UUID, req *UpdateTestSeriesRequest) (*TestSeriesResponse, error) {
	log.Printf("[Test Series Service] Updating test series: %s", id)

	// Get existing test series
	testSeries, err := tss.testSeriesRepo.GetByID(id)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series %s: %v", id, err)
		return nil, err
	}

	// Update fields if provided
	if req.Title != "" {
		testSeries.Title = req.Title
		testSeries.Slug = slug.Make(req.Title)
	}
	if req.Description != "" {
		testSeries.Description = req.Description
	}
	if req.DurationMinutes != nil {
		testSeries.DurationMinutes = *req.DurationMinutes
	}
	if req.PassingPercentage != nil {
		if *req.PassingPercentage < 0 || *req.PassingPercentage > 100 {
			return nil, errors.New("passing_percentage must be between 0 and 100")
		}
		testSeries.PassingPercentage = int(*req.PassingPercentage)
	}
	if req.ShuffleQuestions != nil {
		testSeries.ShuffleQuestions = *req.ShuffleQuestions
	}
	if req.ShowCorrectAnswers != nil {
		testSeries.ShowCorrectAnswers = *req.ShowCorrectAnswers
	}
	if req.IsPublished != nil {
		testSeries.IsPublished = *req.IsPublished
	}

	if err := tss.testSeriesRepo.Update(testSeries); err != nil {
		log.Printf("[Test Series Service] Failed to update test series: %v", err)
		return nil, fmt.Errorf("failed to update test series: %w", err)
	}

	log.Printf("[Test Series Service] Test series updated successfully: %s", id)
	return testSeriesToResponse(testSeries), nil
}

// DeleteTestSeries deletes a test series
// Parameters:
//   - id: Test series UUID
//
// Returns:
//   - error: Error if deletion fails
func (tss *TestSeriesService) DeleteTestSeries(id uuid.UUID) error {
	log.Printf("[Test Series Service] Deleting test series: %s", id)

	// Verify test series exists
	_, err := tss.testSeriesRepo.GetByID(id)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series %s: %v", id, err)
		return err
	}

	if err := tss.testSeriesRepo.Delete(id); err != nil {
		log.Printf("[Test Series Service] Failed to delete test series: %v", err)
		return fmt.Errorf("failed to delete test series: %w", err)
	}

	log.Printf("[Test Series Service] Test series deleted successfully: %s", id)
	return nil
}

// GetTestQuestions retrieves all questions for a test series
// Parameters:
//   - testSeriesID: Test series UUID
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []QuestionResponse: List of questions
//   - int64: Total count of questions
//   - error: Error if query fails
func (tss *TestSeriesService) GetTestQuestions(testSeriesID uuid.UUID, page, limit int) ([]QuestionResponse, int64, error) {
	questions, total, err := tss.questionRepo.GetByTestSeriesID(testSeriesID, page, limit)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test questions: %v", err)
		return nil, 0, err
	}

	var responses []QuestionResponse
	for _, q := range questions {
		responses = append(responses, *questionToResponse(&q))
	}

	return responses, total, nil
}

// ShuffleQuestions shuffles the questions for a test series
// Parameters:
//   - testSeriesID: Test series UUID
//
// Returns:
//   - []QuestionResponse: Shuffled list of questions
//   - error: Error if operation fails
func (tss *TestSeriesService) ShuffleQuestions(testSeriesID uuid.UUID) ([]QuestionResponse, error) {
	log.Printf("[Test Series Service] Shuffling questions for test series: %s", testSeriesID)

	// Get all questions without pagination
	questions, _, err := tss.questionRepo.GetByTestSeriesID(testSeriesID, 1, 1000)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get questions: %v", err)
		return nil, fmt.Errorf("failed to get questions: %w", err)
	}

	// Shuffle questions using Fisher-Yates algorithm
	rand.Seed(time.Now().UnixNano())
	for i := len(questions) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		questions[i], questions[j] = questions[j], questions[i]
	}

	var responses []QuestionResponse
	for _, q := range questions {
		responses = append(responses, *questionToResponse(&q))
	}

	log.Printf("[Test Series Service] Questions shuffled successfully: %s", testSeriesID)
	return responses, nil
}

// PublishTestSeries publishes a test series
// Parameters:
//   - id: Test series UUID
//
// Returns:
//   - *TestSeriesResponse: Published test series details
//   - error: Error if publishing fails
func (tss *TestSeriesService) PublishTestSeries(id uuid.UUID) (*TestSeriesResponse, error) {
	log.Printf("[Test Series Service] Publishing test series: %s", id)

	// Get test series
	testSeries, err := tss.testSeriesRepo.GetByID(id)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series: %v", err)
		return nil, err
	}

	// Check if test series has at least one question
	questionCount, err := tss.questionRepo.GetQuestionCountByTestSeries(id)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get question count: %v", err)
		return nil, err
	}

	if questionCount == 0 {
		return nil, errors.New("test series must have at least one question to be published")
	}

	// Update published status
	testSeries.IsPublished = true

	if err := tss.testSeriesRepo.Update(testSeries); err != nil {
		log.Printf("[Test Series Service] Failed to publish test series: %v", err)
		return nil, fmt.Errorf("failed to publish test series: %w", err)
	}

	log.Printf("[Test Series Service] Test series published successfully: %s", id)
	return testSeriesToResponse(testSeries), nil
}

// UnpublishTestSeries unpublishes a test series
// Parameters:
//   - id: Test series UUID
//
// Returns:
//   - *TestSeriesResponse: Unpublished test series details
//   - error: Error if unpublishing fails
func (tss *TestSeriesService) UnpublishTestSeries(id uuid.UUID) (*TestSeriesResponse, error) {
	log.Printf("[Test Series Service] Unpublishing test series: %s", id)

	// Get test series
	testSeries, err := tss.testSeriesRepo.GetByID(id)
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series: %v", err)
		return nil, err
	}

	// Update published status
	testSeries.IsPublished = false

	if err := tss.testSeriesRepo.Update(testSeries); err != nil {
		log.Printf("[Test Series Service] Failed to unpublish test series: %v", err)
		return nil, fmt.Errorf("failed to unpublish test series: %w", err)
	}

	log.Printf("[Test Series Service] Test series unpublished successfully: %s", id)
	return testSeriesToResponse(testSeries), nil
}

// SearchTestSeries searches for test series by title or description
// Parameters:
//   - query: Search query
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []TestSeriesListResponse: List of matching test series
//   - int64: Total count of matching test series
//   - error: Error if query fails
func (tss *TestSeriesService) SearchTestSeries(query string, page, limit int) ([]TestSeriesListResponse, int64, error) {
	testSeriesList, total, err := tss.testSeriesRepo.Search(query, page, limit)
	if err != nil {
		log.Printf("[Test Series Service] Failed to search test series: %v", err)
		return nil, 0, err
	}

	var responses []TestSeriesListResponse
	for _, ts := range testSeriesList {
		responses = append(responses, TestSeriesListResponse{
			ID:                ts.ID,
			Title:             ts.Title,
			Slug:              ts.Slug,
			Description:       ts.Description,
			TotalQuestions:    ts.TotalQuestions,
			DurationMinutes:   ts.DurationMinutes,
			PassingPercentage: float64(ts.PassingPercentage),
			IsPublished:       ts.IsPublished,
			CreatedAt:         ts.CreatedAt,
		})
	}

	return responses, total, nil
}

// GetTestSeriesCount returns the total number of test series
// Returns:
//   - int64: Total count of test series
//   - error: Error if query fails
func (tss *TestSeriesService) GetTestSeriesCount() (int64, error) {
	count, err := tss.testSeriesRepo.GetTestSeriesCount()
	if err != nil {
		log.Printf("[Test Series Service] Failed to get test series count: %v", err)
		return 0, err
	}
	return count, nil
}

// Helper functions

// testSeriesToResponse converts a TestSeries model to a TestSeriesResponse
func testSeriesToResponse(testSeries *models.TestSeries) *TestSeriesResponse {
	return &TestSeriesResponse{
		ID:                 testSeries.ID,
		Title:              testSeries.Title,
		Slug:               testSeries.Slug,
		Description:        testSeries.Description,
		TotalQuestions:     testSeries.TotalQuestions,
		DurationMinutes:    testSeries.DurationMinutes,
		PassingPercentage:  float64(testSeries.PassingPercentage),
		ShuffleQuestions:   testSeries.ShuffleQuestions,
		ShowCorrectAnswers: testSeries.ShowCorrectAnswers,
		IsPublished:        testSeries.IsPublished,
		CreatedAt:          testSeries.CreatedAt,
		UpdatedAt:          testSeries.UpdatedAt,
	}
}

// GetQuestions retrieves all questions for a test series
// Parameters:
//   - testSeriesID: Test series UUID
//   - page: Page number (1-based)
//   - limit: Number of questions per page
//
// Returns:
//   - []QuestionResponse: List of questions
//   - int64: Total count
//   - error: Error if query fails
func (tss *TestSeriesService) GetQuestions(testSeriesID uuid.UUID, page, limit int) ([]map[string]interface{}, int64, error) {
	questions, total, err := tss.questionRepo.GetByTestSeriesID(testSeriesID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	result := make([]map[string]interface{}, 0)
	for _, q := range questions {
		result = append(result, map[string]interface{}{
			"id":               q.ID,
			"question_text":    q.QuestionText,
			"question_type":    q.QuestionType,
			"difficulty_level": q.DifficultyLevel,
			"marks":            q.Marks,
			"order_index":      q.OrderIndex,
		})
	}

	return result, total, nil
}

// GetTestSeriesStats retrieves statistics for a test series
// Parameters:
//   - testSeriesID: Test series UUID
//
// Returns:
//   - map[string]interface{}: Statistics
//   - error: Error if query fails
func (tss *TestSeriesService) GetTestSeriesStats(testSeriesID uuid.UUID) (map[string]interface{}, error) {
	ts, err := tss.testSeriesRepo.GetByID(testSeriesID)
	if err != nil {
		return nil, err
	}

	stats := map[string]interface{}{
		"id":                   ts.ID,
		"title":                ts.Title,
		"total_questions":      ts.TotalQuestions,
		"duration_minutes":     ts.DurationMinutes,
		"passing_percentage":   float64(ts.PassingPercentage),
		"is_published":         ts.IsPublished,
		"shuffle_questions":    ts.ShuffleQuestions,
		"show_correct_answers": ts.ShowCorrectAnswers,
	}

	return stats, nil
}

// DuplicateTestSeries creates a copy of an existing test series
// Parameters:
//   - sourceID: Source test series UUID
//   - newTitle: Title for the duplicated series
//
// Returns:
//   - *TestSeriesResponse: New test series
//   - error: Error if duplication fails
func (tss *TestSeriesService) DuplicateTestSeries(sourceID uuid.UUID, newTitle string) (*TestSeriesResponse, error) {
	source, err := tss.testSeriesRepo.GetByID(sourceID)
	if err != nil {
		return nil, err
	}

	newID := uuid.New()
	duplicate := &models.TestSeries{
		ID:                 newID,
		Title:              newTitle,
		Slug:               slug.Make(newTitle),
		Description:        source.Description,
		TotalQuestions:     source.TotalQuestions,
		DurationMinutes:    source.DurationMinutes,
		PassingPercentage:  source.PassingPercentage,
		ShuffleQuestions:   source.ShuffleQuestions,
		ShowCorrectAnswers: source.ShowCorrectAnswers,
		IsPublished:        false,
	}

	if err := tss.testSeriesRepo.Create(duplicate); err != nil {
		return nil, err
	}

	return testSeriesToResponse(duplicate), nil
}
