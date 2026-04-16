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

// AttemptService handles test attempt business logic
type AttemptService struct {
	attemptRepo        *repository.AttemptRepository
	testSeriesRepo     *repository.TestSeriesRepository
	userRepo           *repository.UserRepository
	attemptAnswerRepo  *repository.AttemptAnswerRepository
	certificateRepo    *repository.CertificateRepository
	questionRepo       *repository.QuestionRepository
	questionOptionRepo *repository.QuestionOptionRepository
}

// NewAttemptService creates a new attempt service instance
// Parameters:
//   - attemptRepo: Attempt repository for database operations
//   - testSeriesRepo: TestSeries repository for database operations
//   - userRepo: User repository for database operations
//   - attemptAnswerRepo: AttemptAnswer repository for database operations
//   - certificateRepo: Certificate repository for database operations
//   - questionRepo: Question repository for database operations
//   - questionOptionRepo: QuestionOption repository for database operations
//
// Returns:
//   - *AttemptService: New attempt service instance
func NewAttemptService(
	attemptRepo *repository.AttemptRepository,
	testSeriesRepo *repository.TestSeriesRepository,
	userRepo *repository.UserRepository,
	attemptAnswerRepo *repository.AttemptAnswerRepository,
	certificateRepo *repository.CertificateRepository,
	questionRepo *repository.QuestionRepository,
	questionOptionRepo *repository.QuestionOptionRepository,
) *AttemptService {
	return &AttemptService{
		attemptRepo:        attemptRepo,
		testSeriesRepo:     testSeriesRepo,
		userRepo:           userRepo,
		attemptAnswerRepo:  attemptAnswerRepo,
		certificateRepo:    certificateRepo,
		questionRepo:       questionRepo,
		questionOptionRepo: questionOptionRepo,
	}
}

// StartAttemptRequest represents a request to start a test attempt
type StartAttemptRequest struct {
	TestSeriesID uuid.UUID `json:"test_series_id" binding:"required"`
	StudentID    uuid.UUID `json:"student_id" binding:"required"`
}

// SubmitAttemptRequest represents a request to submit test answers
type SubmitAttemptRequest struct {
	AttemptID uuid.UUID          `json:"attempt_id" binding:"required"`
	Answers   []AnswerSubmission `json:"answers" binding:"required"`
}

// AnswerSubmission represents a single answer submission
type AnswerSubmission struct {
	QuestionID       uuid.UUID  `json:"question_id" binding:"required"`
	SelectedOptionID *uuid.UUID `json:"selected_option_id"`
	WrittenAnswer    string     `json:"written_answer"`
}

// AttemptResponse represents an attempt in API responses
type AttemptResponse struct {
	ID               uuid.UUID               `json:"id"`
	TestSeriesID     uuid.UUID               `json:"test_series_id"`
	StudentID        uuid.UUID               `json:"student_id"`
	StartedAt        time.Time               `json:"started_at"`
	SubmittedAt      *time.Time              `json:"submitted_at"`
	TotalMarks       int                     `json:"total_marks"`
	ObtainedMarks    int                     `json:"obtained_marks"`
	Percentage       float64                 `json:"percentage"`
	Status           string                  `json:"status"`
	TimeSpentSeconds int                     `json:"time_spent_seconds"`
	TestSeries       *TestSeriesResponse     `json:"test_series,omitempty"`
	Student          *UserResponse           `json:"student,omitempty"`
	Answers          []AttemptAnswerResponse `json:"answers,omitempty"`
}

// AttemptAnswerResponse represents an answer response
type AttemptAnswerResponse struct {
	ID               uuid.UUID  `json:"id"`
	QuestionID       uuid.UUID  `json:"question_id"`
	SelectedOptionID *uuid.UUID `json:"selected_option_id"`
	WrittenAnswer    string     `json:"written_answer"`
	MarksObtained    int        `json:"marks_obtained"`
	IsCorrect        bool       `json:"is_correct"`
}

// AttemptListResponse represents an attempt in list responses
type AttemptListResponse struct {
	ID            uuid.UUID  `json:"id"`
	TestSeriesID  uuid.UUID  `json:"test_series_id"`
	TestTitle     string     `json:"test_title"`
	StudentID     uuid.UUID  `json:"student_id"`
	StartedAt     time.Time  `json:"started_at"`
	SubmittedAt   *time.Time `json:"submitted_at"`
	ObtainedMarks int        `json:"obtained_marks"`
	Percentage    float64    `json:"percentage"`
	Status        string     `json:"status"`
}

// StartAttempt creates a new test attempt for a student
// Parameters:
//   - req: Start attempt request
//
// Returns:
//   - *AttemptResponse: Created attempt details
//   - error: Error if attempt creation fails
func (as *AttemptService) StartAttempt(req *StartAttemptRequest) (*AttemptResponse, error) {
	log.Printf("[Attempt Service] Starting attempt for test: %s, student: %s", req.TestSeriesID, req.StudentID)

	// Verify test series exists and is published
	testSeries, err := as.testSeriesRepo.GetByID(req.TestSeriesID)
	if err != nil {
		log.Printf("[Attempt Service] Test series not found: %v", err)
		return nil, fmt.Errorf("test series not found: %w", err)
	}

	if !testSeries.IsPublished {
		return nil, errors.New("test series is not published")
	}

	// Verify student exists
	student, err := as.userRepo.GetByID(req.StudentID)
	if err != nil {
		log.Printf("[Attempt Service] Student not found: %v", err)
		return nil, fmt.Errorf("student not found: %w", err)
	}

	if student.Role != models.RoleStudent {
		return nil, errors.New("only students can attempt tests")
	}

	// Create new attempt
	attempt := &models.Attempt{
		ID:           uuid.New(),
		TestSeriesID: req.TestSeriesID,
		StudentID:    req.StudentID,
		StartedAt:    time.Now(),
		Status:       "in-progress",
		TotalMarks:   testSeries.TotalQuestions,
	}

	if err := as.attemptRepo.Create(attempt); err != nil {
		log.Printf("[Attempt Service] Failed to create attempt: %v", err)
		return nil, fmt.Errorf("failed to create attempt: %w", err)
	}

	log.Printf("[Attempt Service] Attempt created successfully: %s", attempt.ID)
	return as.attemptToResponse(attempt, true), nil
}

// SubmitAttempt submits answers for a test attempt
// Parameters:
//   - req: Submit attempt request
//
// Returns:
//   - *AttemptResponse: Submitted attempt details with evaluation results
//   - error: Error if submission fails
func (as *AttemptService) SubmitAttempt(req *SubmitAttemptRequest) (*AttemptResponse, error) {
	log.Printf("[Attempt Service] Submitting attempt: %s", req.AttemptID)

	// Get attempt
	attempt, err := as.attemptRepo.GetByID(req.AttemptID)
	if err != nil {
		log.Printf("[Attempt Service] Attempt not found: %v", err)
		return nil, fmt.Errorf("attempt not found: %w", err)
	}

	if attempt.Status != "in-progress" {
		return nil, errors.New("attempt is not in progress")
	}

	// Process answers
	for _, answer := range req.Answers {
		attemptAnswer := &models.AttemptAnswer{
			ID:               uuid.New(),
			AttemptID:        req.AttemptID,
			QuestionID:       answer.QuestionID,
			SelectedOptionID: answer.SelectedOptionID,
			WrittenAnswer:    answer.WrittenAnswer,
		}

		if err := as.attemptAnswerRepo.Create(attemptAnswer); err != nil {
			log.Printf("[Attempt Service] Failed to save answer: %v", err)
			return nil, fmt.Errorf("failed to save answer: %w", err)
		}
	}

	// Evaluate attempt
	now := time.Now()
	attempt.SubmittedAt = &now
	attempt.TimeSpentSeconds = int(now.Sub(attempt.StartedAt).Seconds())

	if err := as.EvaluateAttempt(req.AttemptID); err != nil {
		log.Printf("[Attempt Service] Failed to evaluate attempt: %v", err)
		return nil, fmt.Errorf("failed to evaluate attempt: %w", err)
	}

	// Get updated attempt
	updatedAttempt, err := as.attemptRepo.GetByID(req.AttemptID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch updated attempt: %w", err)
	}

	log.Printf("[Attempt Service] Attempt submitted successfully: %s", req.AttemptID)
	return as.attemptToResponse(updatedAttempt, true), nil
}

// EvaluateAttempt evaluates and calculates scores for an attempt
// Parameters:
//   - attemptID: UUID of the attempt to evaluate
//
// Returns:
//   - error: Error if evaluation fails
func (as *AttemptService) EvaluateAttempt(attemptID uuid.UUID) error {
	log.Printf("[Attempt Service] Evaluating attempt: %s", attemptID)

	// Get attempt
	attempt, err := as.attemptRepo.GetByID(attemptID)
	if err != nil {
		return fmt.Errorf("attempt not found: %w", err)
	}

	// Get all answers for this attempt
	answers, err := as.attemptAnswerRepo.GetByAttemptID(attemptID)
	if err != nil {
		return fmt.Errorf("failed to fetch answers: %w", err)
	}

	// Evaluate each answer
	totalMarks := 0
	obtainedMarks := 0

	for _, answer := range answers {
		// Get question details
		question, err := as.questionRepo.GetByID(answer.QuestionID)
		if err != nil {
			log.Printf("[Attempt Service] Question not found: %v", err)
			continue
		}

		totalMarks += question.Marks

		// Check if answer is correct
		isCorrect := false
		marksObtained := 0

		if answer.SelectedOptionID != nil {
			// Get option details
			option, err := as.questionOptionRepo.GetByID(*answer.SelectedOptionID)
			if err == nil {
				isCorrect = option.IsCorrect
				if isCorrect {
					marksObtained = question.Marks
					obtainedMarks += marksObtained
				}
			}
		}

		// Update answer with evaluation
		answer.IsCorrect = isCorrect
		answer.MarksObtained = marksObtained

		if err := as.attemptAnswerRepo.Update(&answer); err != nil {
			log.Printf("[Attempt Service] Failed to update answer evaluation: %v", err)
		}
	}

	// Calculate percentage
	percentage := 0.0
	if totalMarks > 0 {
		percentage = (float64(obtainedMarks) / float64(totalMarks)) * 100
	}

	// Update attempt with scores
	attempt.ObtainedMarks = obtainedMarks
	attempt.TotalMarks = totalMarks
	attempt.Percentage = percentage
	attempt.Status = "completed"
	now := time.Now()
	attempt.SubmittedAt = &now

	if err := as.attemptRepo.Update(attempt); err != nil {
		return fmt.Errorf("failed to update attempt scores: %w", err)
	}

	// Check if student passed and issue certificate if applicable
	testSeries, err := as.testSeriesRepo.GetByID(attempt.TestSeriesID)
	if err == nil && percentage >= float64(testSeries.PassingPercentage) {
		if err := as.issueCertificateForAttempt(attempt, testSeries); err != nil {
			log.Printf("[Attempt Service] Warning: Failed to issue certificate: %v", err)
		}
	}

	log.Printf("[Attempt Service] Attempt evaluated successfully. Score: %d/%d (%.2f%%)", obtainedMarks, totalMarks, percentage)
	return nil
}

// GetAttempt retrieves an attempt by ID
// Parameters:
//   - id: Attempt UUID
//
// Returns:
//   - *AttemptResponse: Attempt details
//   - error: Error if attempt not found
func (as *AttemptService) GetAttempt(id uuid.UUID) (*AttemptResponse, error) {
	attempt, err := as.attemptRepo.GetByID(id)
	if err != nil {
		log.Printf("[Attempt Service] Failed to get attempt %s: %v", id, err)
		return nil, err
	}
	return as.attemptToResponse(attempt, true), nil
}

// ListAttempts retrieves paginated list of attempts for a student
// Parameters:
//   - studentID: Student UUID
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []AttemptListResponse: List of attempts
//   - int64: Total count of attempts
//   - error: Error if query fails
func (as *AttemptService) ListAttempts(studentID uuid.UUID, page, limit int) ([]AttemptListResponse, int64, error) {
	attempts, total, err := as.attemptRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		log.Printf("[Attempt Service] Failed to list attempts: %v", err)
		return nil, 0, err
	}

	var responses []AttemptListResponse
	for _, attempt := range attempts {
		testSeries, _ := as.testSeriesRepo.GetByID(attempt.TestSeriesID)
		testTitle := ""
		if testSeries != nil {
			testTitle = testSeries.Title
		}

		responses = append(responses, AttemptListResponse{
			ID:            attempt.ID,
			TestSeriesID:  attempt.TestSeriesID,
			TestTitle:     testTitle,
			StudentID:     attempt.StudentID,
			StartedAt:     attempt.StartedAt,
			SubmittedAt:   attempt.SubmittedAt,
			ObtainedMarks: attempt.ObtainedMarks,
			Percentage:    attempt.Percentage,
			Status:        attempt.Status,
		})
	}

	return responses, total, nil
}

// ListAttemptsByTestSeries retrieves paginated list of attempts for a test series
// Parameters:
//   - testSeriesID: TestSeries UUID
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []AttemptListResponse: List of attempts
//   - int64: Total count of attempts
//   - error: Error if query fails
func (as *AttemptService) ListAttemptsByTestSeries(testSeriesID uuid.UUID, page, limit int) ([]AttemptListResponse, int64, error) {
	attempts, total, err := as.attemptRepo.GetByTestSeriesID(testSeriesID, page, limit)
	if err != nil {
		log.Printf("[Attempt Service] Failed to list attempts by test series: %v", err)
		return nil, 0, err
	}

	var responses []AttemptListResponse
	for _, attempt := range attempts {
		responses = append(responses, AttemptListResponse{
			ID:            attempt.ID,
			TestSeriesID:  attempt.TestSeriesID,
			StudentID:     attempt.StudentID,
			StartedAt:     attempt.StartedAt,
			SubmittedAt:   attempt.SubmittedAt,
			ObtainedMarks: attempt.ObtainedMarks,
			Percentage:    attempt.Percentage,
			Status:        attempt.Status,
		})
	}

	return responses, total, nil
}

// GetResults retrieves detailed results for a completed attempt
// Parameters:
//   - attemptID: Attempt UUID
//
// Returns:
//   - *AttemptResponse: Attempt with detailed results
//   - error: Error if attempt not found
func (as *AttemptService) GetResults(attemptID uuid.UUID) (*AttemptResponse, error) {
	log.Printf("[Attempt Service] Getting results for attempt: %s", attemptID)

	attempt, err := as.attemptRepo.GetByID(attemptID)
	if err != nil {
		log.Printf("[Attempt Service] Failed to get attempt %s: %v", attemptID, err)
		return nil, err
	}

	if attempt.Status != "completed" {
		return nil, errors.New("attempt is not completed yet")
	}

	return as.attemptToResponse(attempt, true), nil
}

// CalculateScore calculates the score for an attempt based on answers
// Parameters:
//   - attemptID: Attempt UUID
//
// Returns:
//   - int: Total obtained marks
//   - int: Total marks available
//   - float64: Percentage score
//   - error: Error if calculation fails
func (as *AttemptService) CalculateScore(attemptID uuid.UUID) (int, int, float64, error) {
	log.Printf("[Attempt Service] Calculating score for attempt: %s", attemptID)

	// Get attempt
	_, err := as.attemptRepo.GetByID(attemptID)
	if err != nil {
		return 0, 0, 0, fmt.Errorf("attempt not found: %w", err)
	}

	// Get all answers
	answers, err := as.attemptAnswerRepo.GetByAttemptID(attemptID)
	if err != nil {
		return 0, 0, 0, fmt.Errorf("failed to fetch answers: %w", err)
	}

	totalMarks := 0
	obtainedMarks := 0

	for _, answer := range answers {
		question, err := as.questionRepo.GetByID(answer.QuestionID)
		if err != nil {
			continue
		}

		totalMarks += question.Marks

		if answer.IsCorrect {
			obtainedMarks += answer.MarksObtained
		}
	}

	percentage := 0.0
	if totalMarks > 0 {
		percentage = (float64(obtainedMarks) / float64(totalMarks)) * 100
	}

	return obtainedMarks, totalMarks, percentage, nil
}

// GetUserAttemptHistory retrieves all attempts by a user for a test series
// Parameters:
//   - studentID: Student UUID
//   - testSeriesID: TestSeries UUID
//
// Returns:
//   - []AttemptListResponse: List of attempts
//   - error: Error if query fails
func (as *AttemptService) GetUserAttemptHistory(studentID, testSeriesID uuid.UUID, page, limit int) ([]AttemptListResponse, error) {
	attempts, _, err := as.attemptRepo.GetByStudentAndTestSeries(studentID, testSeriesID, page, limit)
	if err != nil {
		log.Printf("[Attempt Service] Failed to get attempt history: %v", err)
		return nil, err
	}

	var responses []AttemptListResponse
	for _, attempt := range attempts {
		responses = append(responses, AttemptListResponse{
			ID:            attempt.ID,
			TestSeriesID:  attempt.TestSeriesID,
			StudentID:     attempt.StudentID,
			StartedAt:     attempt.StartedAt,
			SubmittedAt:   attempt.SubmittedAt,
			ObtainedMarks: attempt.ObtainedMarks,
			Percentage:    attempt.Percentage,
			Status:        attempt.Status,
		})
	}

	return responses, nil
}

// issueCertificateForAttempt issues a certificate when a student passes a test
// Parameters:
//   - attempt: The completed attempt
//   - testSeries: The test series that was attempted
//
// Returns:
//   - error: Error if certificate issuance fails
func (as *AttemptService) issueCertificateForAttempt(attempt *models.Attempt, testSeries *models.TestSeries) error {
	log.Printf("[Attempt Service] Issuing certificate for attempt: %s", attempt.ID)

	// Check if certificate already exists
	existing, err := as.certificateRepo.GetByStudentAndTestSeries(attempt.StudentID, attempt.TestSeriesID)
	if err == nil && existing != nil {
		log.Printf("[Attempt Service] Certificate already exists for this test")
		return nil
	}

	// Generate certificate number
	certificateNumber := fmt.Sprintf("CERT-%s-%s-%d",
		attempt.StudentID.String()[:8],
		attempt.TestSeriesID.String()[:8],
		time.Now().Unix(),
	)

	certificate := &models.Certificate{
		ID:                uuid.New(),
		TestSeriesID:      &attempt.TestSeriesID,
		StudentID:         attempt.StudentID,
		CertificateNumber: certificateNumber,
		IssuedAt:          time.Now(),
	}

	if err := as.certificateRepo.Create(certificate); err != nil {
		log.Printf("[Attempt Service] Failed to issue certificate: %v", err)
		return fmt.Errorf("failed to issue certificate: %w", err)
	}

	log.Printf("[Attempt Service] Certificate issued successfully: %s", certificateNumber)
	return nil
}

// Helper functions

// attemptToResponse converts an Attempt model to an AttemptResponse
func (as *AttemptService) attemptToResponse(attempt *models.Attempt, includeDetails bool) *AttemptResponse {
	var testSeriesResp *TestSeriesResponse
	var studentResp *UserResponse
	var answersResp []AttemptAnswerResponse

	if includeDetails {
		// Get test series details
		if testSeries, err := as.testSeriesRepo.GetByID(attempt.TestSeriesID); err == nil {
			testSeriesResp = &TestSeriesResponse{
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
			}
		}

		// Get student details
		if student, err := as.userRepo.GetByID(attempt.StudentID); err == nil {
			studentResp = &UserResponse{
				ID:                uuid.UUID{},
				Email:             student.Email,
				FirstName:         student.FirstName,
				LastName:          student.LastName,
				Phone:             student.Phone,
				ProfilePictureURL: student.ProfilePictureURL,
				Role:              string(student.Role),
				IsActive:          student.IsActive,
				CreatedAt:         student.CreatedAt,
			}
		}

		// Get answers
		if answers, err := as.attemptAnswerRepo.GetByAttemptID(attempt.ID); err == nil {
			for _, ans := range answers {
				answersResp = append(answersResp, AttemptAnswerResponse{
					ID:               ans.ID,
					QuestionID:       ans.QuestionID,
					SelectedOptionID: ans.SelectedOptionID,
					WrittenAnswer:    ans.WrittenAnswer,
					MarksObtained:    ans.MarksObtained,
					IsCorrect:        ans.IsCorrect,
				})
			}
		}
	}

	return &AttemptResponse{
		ID:               attempt.ID,
		TestSeriesID:     attempt.TestSeriesID,
		StudentID:        attempt.StudentID,
		StartedAt:        attempt.StartedAt,
		SubmittedAt:      attempt.SubmittedAt,
		TotalMarks:       attempt.TotalMarks,
		ObtainedMarks:    attempt.ObtainedMarks,
		Percentage:       attempt.Percentage,
		Status:           attempt.Status,
		TimeSpentSeconds: attempt.TimeSpentSeconds,
		TestSeries:       testSeriesResp,
		Student:          studentResp,
		Answers:          answersResp,
	}
}

// GetGlobalLeaderboard retrieves global leaderboard rankings by test scores
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of entries per page
//   - sortBy: Sort criterion (highest_score, average_score, recent)
//
// Returns:
//   - []map[string]interface{}: Leaderboard entries
//   - int64: Total count
//   - error: Error if query fails
func (as *AttemptService) GetGlobalLeaderboard(page, limit int, sortBy string) ([]map[string]interface{}, int64, error) {
	attempts, total, err := as.attemptRepo.GetAll(page, limit)
	if err != nil {
		return nil, 0, err
	}

	entries := make([]map[string]interface{}, 0)
	for rank, attempt := range attempts {
		entry := map[string]interface{}{
			"rank":           rank + 1,
			"student_id":     attempt.StudentID,
			"score":          attempt.Percentage,
			"obtained_marks": attempt.ObtainedMarks,
			"total_marks":    attempt.TotalMarks,
			"submitted_at":   attempt.SubmittedAt,
		}
		entries = append(entries, entry)
	}

	return entries, total, nil
}

// GetTestLeaderboard retrieves leaderboard rankings for a specific test
// Parameters:
//   - testSeriesID: Test series UUID
//   - page: Page number (1-based)
//   - limit: Number of entries per page
//   - sortBy: Sort criterion (highest_score, average_score, recent)
//
// Returns:
//   - []map[string]interface{}: Leaderboard entries
//   - int64: Total count
//   - error: Error if query fails
func (as *AttemptService) GetTestLeaderboard(testSeriesID uuid.UUID, page, limit int, sortBy string) ([]map[string]interface{}, int64, error) {
	attempts, total, err := as.attemptRepo.GetByTestSeriesID(testSeriesID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	entries := make([]map[string]interface{}, 0)
	for rank, attempt := range attempts {
		entry := map[string]interface{}{
			"rank":           rank + 1,
			"student_id":     attempt.StudentID,
			"score":          attempt.Percentage,
			"obtained_marks": attempt.ObtainedMarks,
			"total_marks":    attempt.TotalMarks,
			"submitted_at":   attempt.SubmittedAt,
		}
		entries = append(entries, entry)
	}

	return entries, total, nil
}
