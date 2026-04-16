package handlers

import (
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// TestSeriesHandler handles all test series-related HTTP requests
type TestSeriesHandler struct {
	testSeriesService *service.TestSeriesService
	userService       *service.UserService
}

// NewTestSeriesHandler creates a new test series handler instance
// Parameters:
//   - testSeriesService: TestSeries service for business logic
//   - userService: User service for authorization checks
//
// Returns:
//   - *TestSeriesHandler: New test series handler instance
func NewTestSeriesHandler(testSeriesService *service.TestSeriesService, userService *service.UserService) *TestSeriesHandler {
	return &TestSeriesHandler{
		testSeriesService: testSeriesService,
		userService:       userService,
	}
}

// ListTestSeries godoc
// @Summary List all tests
// @Description Retrieve paginated list of test series with optional filters
// @Tags Test Series
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of tests per page (default 10)" default(10)
// @Param status query string false "Filter by status (draft, published)"
// @Success 200 {object} response.Response{data=[]service.TestSeriesListResponse}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series [get]
func (tsh *TestSeriesHandler) ListTestSeries(c *gin.Context) {
	log.Println("[Test Series Handler] Listing all test series")

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

	// Call service to list test series
	testSeries, total, err := tsh.testSeriesService.ListTestSeries(page, limit)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to list test series: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  testSeries,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateTestSeries godoc
// @Summary Create a new test series
// @Description Create a new test/quiz (faculty/admin only)
// @Tags Test Series
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateTestSeriesRequest true "Test series creation request"
// @Success 201 {object} response.Response{data=service.TestSeriesResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 409 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series [post]
func (tsh *TestSeriesHandler) CreateTestSeries(c *gin.Context) {
	log.Println("[Test Series Handler] Creating new test series")

	// Get authenticated user ID

	var req service.CreateTestSeriesRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Call service to create test series
	testSeries, err := tsh.testSeriesService.CreateTestSeries(&req)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to create test series: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, testSeries)
}

// GetTestSeries godoc
// @Summary Get test series details
// @Description Retrieve detailed information about a specific test series
// @Tags Test Series
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Success 200 {object} response.Response{data=service.TestSeriesResponse}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id} [get]
func (tsh *TestSeriesHandler) GetTestSeries(c *gin.Context) {
	testSeriesID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	log.Printf("[Test Series Handler] Getting test series: %s", id)

	// Call service to get test series
	testSeries, err := tsh.testSeriesService.GetTestSeries(id)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to get test series: %v", err)
		response.NotFound(c, "Test series not found")
		return
	}

	response.Success(c, http.StatusOK, testSeries)
}

// GetTestSeriesBySlug godoc
// @Summary Get test series by slug
// @Description Retrieve test series details using slug
// @Tags Test Series
// @Accept json
// @Produce json
// @Param slug path string true "Test series slug"
// @Success 200 {object} response.Response{data=service.TestSeriesResponse}
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/slug/{slug} [get]
func (tsh *TestSeriesHandler) GetTestSeriesBySlug(c *gin.Context) {
	slug := c.Param("slug")

	if slug == "" {
		response.BadRequest(c, "Test series slug is required")
		return
	}

	log.Printf("[Test Series Handler] Getting test series by slug: %s", slug)

	// Call service to get test series
	testSeries, err := tsh.testSeriesService.GetTestSeriesBySlug(slug)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to get test series: %v", err)
		response.NotFound(c, "Test series not found")
		return
	}

	response.Success(c, http.StatusOK, testSeries)
}

// UpdateTestSeries godoc
// @Summary Update test series details
// @Description Update an existing test series (faculty/admin only)
// @Tags Test Series
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Param request body service.UpdateTestSeriesRequest true "Test series update request"
// @Success 200 {object} response.Response{data=service.TestSeriesResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id} [patch]
func (tsh *TestSeriesHandler) UpdateTestSeries(c *gin.Context) {
	testSeriesID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	var req service.UpdateTestSeriesRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	log.Printf("[Test Series Handler] Updating test series: %s", id)

	// Call service to update test series
	testSeries, err := tsh.testSeriesService.UpdateTestSeries(id, &req)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to update test series: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, testSeries)
}

// DeleteTestSeries godoc
// @Summary Delete a test series
// @Description Delete an existing test series (admin only)
// @Tags Test Series
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id} [delete]
func (tsh *TestSeriesHandler) DeleteTestSeries(c *gin.Context) {
	testSeriesID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	log.Printf("[Test Series Handler] Deleting test series: %s", id)

	// Call service to delete test series
	if err := tsh.testSeriesService.DeleteTestSeries(id); err != nil {
		log.Printf("[Test Series Handler] Failed to delete test series: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "Test series deleted successfully",
	})
}

// PublishTestSeries godoc
// @Summary Publish a test series
// @Description Publish a draft test series (faculty/admin only)
// @Tags Test Series
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Success 200 {object} response.Response{data=service.TestSeriesResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id}/publish [post]
func (tsh *TestSeriesHandler) PublishTestSeries(c *gin.Context) {
	testSeriesID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	log.Printf("[Test Series Handler] Publishing test series: %s", id)

	// Call service to publish test series
	testSeries, err := tsh.testSeriesService.PublishTestSeries(id)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to publish test series: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, testSeries)
}

// GetQuestions godoc
// @Summary Get test questions
// @Description Retrieve all questions for a test series with pagination
// @Tags Test Series
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of questions per page (default 20)" default(20)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id}/questions [get]
func (tsh *TestSeriesHandler) GetQuestions(c *gin.Context) {
	testSeriesID := c.Param("id")

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

	limit := 20
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	log.Printf("[Test Series Handler] Getting questions for test series: %s", id)

	// Verify test series exists
	testSeries, err := tsh.testSeriesService.GetTestSeries(id)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Test series not found: %v", err)
		response.NotFound(c, "Test series not found")
		return
	}

	// Call service to get questions
	questions, total, err := tsh.testSeriesService.GetQuestions(id, page, limit)
	if err != nil {
		log.Printf("[Test Series Handler] Failed to get questions: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"test_series_id":  testSeries.ID,
		"test_title":      testSeries.Title,
		"questions":       questions,
		"total_questions": total,
		"page":            page,
		"limit":           limit,
	})
}

// ListPublishedTestSeries godoc
// @Summary List published tests
// @Description Retrieve paginated list of published test series
// @Tags Test Series
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of tests per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.TestSeriesListResponse}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/published [get]
func (tsh *TestSeriesHandler) ListPublishedTestSeries(c *gin.Context) {
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

	log.Println("[Test Series Handler] Listing published test series")

	// Call service to list published test series
	testSeries, total, err := tsh.testSeriesService.ListPublishedTestSeries(page, limit)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to list published test series: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  testSeries,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// SearchTestSeries godoc
// @Summary Search test series
// @Description Search for test series by title or description
// @Tags Test Series
// @Accept json
// @Produce json
// @Param query query string true "Search query"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of tests per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.TestSeriesListResponse}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/search [get]
func (tsh *TestSeriesHandler) SearchTestSeries(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		response.BadRequest(c, "Search query is required")
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

	log.Printf("[Test Series Handler] Searching test series with query: %s", query)

	// Call service to search test series
	testSeries, total, err := tsh.testSeriesService.SearchTestSeries(query, page, limit)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Failed to search test series: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  testSeries,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetTestSeriesStats godoc
// @Summary Get test series statistics
// @Description Retrieve statistics for a test series (attempts, pass rate, etc.)
// @Tags Test Series
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id}/stats [get]
func (tsh *TestSeriesHandler) GetTestSeriesStats(c *gin.Context) {
	testSeriesID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	log.Printf("[Test Series Handler] Getting statistics for test series: %s", id)

	// Verify test series exists
	testSeries, err := tsh.testSeriesService.GetTestSeries(id)
	_ = testSeries
	if err != nil {
		log.Printf("[Test Series Handler] Test series not found: %v", err)
		response.NotFound(c, "Test series not found")
		return
	}

	// Call service to get statistics
	stats, err := tsh.testSeriesService.GetTestSeriesStats(id)
	if err != nil {
		log.Printf("[Test Series Handler] Failed to get statistics: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, stats)
}

// GetTestSeriesCount godoc
// @Summary Get test series count
// @Description Retrieve total number of test series in the system
// @Tags Test Series
// @Produce json
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/count [get]
func (tsh *TestSeriesHandler) GetTestSeriesCount(c *gin.Context) {
	log.Println("[Test Series Handler] Getting test series count")

	// Call service to get test series count
	count, err := tsh.testSeriesService.GetTestSeriesCount()
	if err != nil {
		log.Printf("[Test Series Handler] Failed to get test series count: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"count": count,
	})
}

// DuplicateTestSeries godoc
// @Summary Duplicate a test series
// @Description Create a copy of an existing test series with all its questions (faculty/admin only)
// @Tags Test Series
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Test Series UUID"
// @Param request body map[string]string true "Duplicate request with new title"
// @Success 201 {object} response.Response{data=service.TestSeriesResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /test-series/{id}/duplicate [post]
func (tsh *TestSeriesHandler) DuplicateTestSeries(c *gin.Context) {
	testSeriesID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(testSeriesID)
	if err != nil {
		response.BadRequest(c, "Invalid test series ID format")
		return
	}

	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	newTitle, ok := req["title"]
	if !ok || newTitle == "" {
		response.BadRequest(c, "New title is required")
		return
	}

	log.Printf("[Test Series Handler] Duplicating test series: %s", id)

	// Call service to duplicate test series
	newTestSeries, err := tsh.testSeriesService.DuplicateTestSeries(id, newTitle)
	if err != nil {
		log.Printf("[Test Series Handler] Failed to duplicate test series: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, newTestSeries)
}
