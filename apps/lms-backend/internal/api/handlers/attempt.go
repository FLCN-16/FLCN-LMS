package handlers

import (
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/middleware"
	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AttemptHandler handles all test attempt-related HTTP requests
type AttemptHandler struct {
	attemptService *service.AttemptService
}

// NewAttemptHandler creates a new attempt handler instance
// Parameters:
//   - attemptService: Attempt service for business logic
//
// Returns:
//   - *AttemptHandler: New attempt handler instance
func NewAttemptHandler(attemptService *service.AttemptService) *AttemptHandler {
	return &AttemptHandler{
		attemptService: attemptService,
	}
}

// ListAttempts godoc
// @Summary List student attempts
// @Description Retrieve paginated list of test attempts for authenticated student
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of attempts per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.AttemptListResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts [get]
func (ah *AttemptHandler) ListAttempts(c *gin.Context) {
	log.Println("[Attempt Handler] Listing attempts for student")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Parse pagination parameters
	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	// Call service to list attempts
	attempts, total, err := ah.attemptService.ListAttempts(userID, page, limit)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to list attempts: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  attempts,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// StartAttempt godoc
// @Summary Start a new test attempt
// @Description Begin a new test attempt for authenticated student
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.StartAttemptRequest true "Start attempt request"
// @Success 201 {object} response.Response{data=service.AttemptResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/start [post]
func (ah *AttemptHandler) StartAttempt(c *gin.Context) {
	log.Println("[Attempt Handler] Starting new attempt")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req service.StartAttemptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Set student ID from authenticated user
	req.StudentID = userID

	// Call service to start attempt
	attempt, err := ah.attemptService.StartAttempt(&req)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to start attempt: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, attempt)
}

// GetAttempt godoc
// @Summary Get attempt details
// @Description Retrieve details of a specific test attempt
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Attempt UUID"
// @Success 200 {object} response.Response{data=service.AttemptResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/{id} [get]
func (ah *AttemptHandler) GetAttempt(c *gin.Context) {
	attemptID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(attemptID)
	if err != nil {
		response.BadRequest(c, "Invalid attempt ID format")
		return
	}

	log.Printf("[Attempt Handler] Getting attempt: %s", id)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to get attempt
	attempt, err := ah.attemptService.GetAttempt(id)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to get attempt: %v", err)
		response.NotFound(c, "Attempt not found")
		return
	}

	// Verify ownership - user can only view their own attempts
	if attempt.StudentID != userID {
		response.Unauthorized(c, "You can only view your own attempts")
		return
	}

	response.Success(c, http.StatusOK, attempt)
}

// SubmitAttempt godoc
// @Summary Submit test answers
// @Description Submit answers for a test attempt
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.SubmitAttemptRequest true "Submit attempt request"
// @Success 200 {object} response.Response{data=service.AttemptResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/submit [post]
func (ah *AttemptHandler) SubmitAttempt(c *gin.Context) {
	log.Println("[Attempt Handler] Submitting attempt")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req service.SubmitAttemptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Verify user owns this attempt
	attempt, err := ah.attemptService.GetAttempt(req.AttemptID)
	if err != nil {
		response.NotFound(c, "Attempt not found")
		return
	}

	if attempt.StudentID != userID {
		response.Unauthorized(c, "You can only submit your own attempts")
		return
	}

	// Call service to submit attempt
	submittedAttempt, err := ah.attemptService.SubmitAttempt(&req)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to submit attempt: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, submittedAttempt)
}

// GetResults godoc
// @Summary Get attempt results
// @Description Retrieve detailed results and evaluation of a completed attempt
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Attempt UUID"
// @Success 200 {object} response.Response{data=service.AttemptResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/{id}/results [get]
func (ah *AttemptHandler) GetResults(c *gin.Context) {
	attemptID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(attemptID)
	if err != nil {
		response.BadRequest(c, "Invalid attempt ID format")
		return
	}

	log.Printf("[Attempt Handler] Getting results for attempt: %s", id)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to get attempt
	attempt, err := ah.attemptService.GetAttempt(id)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to get attempt: %v", err)
		response.NotFound(c, "Attempt not found")
		return
	}

	// Verify ownership
	if attempt.StudentID != userID {
		response.Unauthorized(c, "You can only view your own results")
		return
	}

	// Verify attempt is completed
	if attempt.Status != "completed" {
		response.BadRequest(c, "Attempt is not completed yet")
		return
	}

	// Call service to get results
	results, err := ah.attemptService.GetResults(id)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to get results: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, results)
}

// GetUserHistory godoc
// @Summary Get user attempt history
// @Description Retrieve all attempts by user for a specific test
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param test_series_id path string true "Test Series UUID"
// @Success 200 {object} response.Response{data=[]service.AttemptListResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/history/{test_series_id} [get]
func (ah *AttemptHandler) GetUserHistory(c *gin.Context) {
	testSeriesID := c.Param("test_series_id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	log.Printf("[Attempt Handler] Getting attempt history for test: %s", id)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to get attempt history
	history, err := ah.attemptService.GetUserAttemptHistory(userID, id, 1, 10)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to get attempt history: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"attempts": history,
		"count":    len(history),
	})
}

// ListTestAttempts godoc
// @Summary List all attempts for a test
// @Description Retrieve paginated list of all attempts for a test series (admin/instructor only)
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param test_series_id path string true "Test Series UUID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of attempts per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.AttemptListResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/test/{test_series_id} [get]
func (ah *AttemptHandler) ListTestAttempts(c *gin.Context) {
	testSeriesID := c.Param("test_series_id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	// Parse pagination parameters
	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	log.Printf("[Attempt Handler] Listing attempts for test series: %s", id)

	// Call service to list attempts for test
	attempts, total, err := ah.attemptService.ListAttemptsByTestSeries(id, page, limit)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to list test attempts: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  attempts,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetScore godoc
// @Summary Get attempt score
// @Description Retrieve score and percentage for a completed attempt
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Attempt UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/{id}/score [get]
func (ah *AttemptHandler) GetScore(c *gin.Context) {
	attemptID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(attemptID)
	if err != nil {
		response.BadRequest(c, "Invalid attempt ID format")
		return
	}

	log.Printf("[Attempt Handler] Getting score for attempt: %s", id)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user owns this attempt
	attempt, err := ah.attemptService.GetAttempt(id)
	if err != nil {
		response.NotFound(c, "Attempt not found")
		return
	}

	if attempt.StudentID != userID {
		response.Unauthorized(c, "You can only view your own scores")
		return
	}

	// Call service to calculate score
	obtained, total, percentage, err := ah.attemptService.CalculateScore(id)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to calculate score: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"obtained":     obtained,
		"total":        total,
		"percentage":   percentage,
		"status":       attempt.Status,
		"attempted_at": attempt.StartedAt,
		"submitted_at": attempt.SubmittedAt,
	})
}

// EvaluateAttempt godoc
// @Summary Evaluate an attempt
// @Description Manually evaluate and score an attempt (admin only)
// @Tags Attempts
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Attempt UUID"
// @Success 200 {object} response.Response{data=service.AttemptResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /attempts/{id}/evaluate [post]
func (ah *AttemptHandler) EvaluateAttempt(c *gin.Context) {
	attemptID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(attemptID)
	if err != nil {
		response.BadRequest(c, "Invalid attempt ID format")
		return
	}

	log.Printf("[Attempt Handler] Evaluating attempt: %s", id)

	// Call service to evaluate attempt
	err = ah.attemptService.EvaluateAttempt(id)
	if err != nil {
		log.Printf("[Attempt Handler] Failed to evaluate attempt: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	// Get updated attempt
	attempt, err := ah.attemptService.GetAttempt(id)
	if err != nil {
		response.InternalServerError(c, "Failed to retrieve evaluated attempt")
		return
	}

	response.Success(c, http.StatusOK, attempt)
}
