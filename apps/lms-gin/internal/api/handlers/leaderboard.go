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

// LeaderboardHandler handles all leaderboard-related HTTP requests
type LeaderboardHandler struct {
	attemptService    *service.AttemptService
	enrollmentService *service.EnrollmentService
	userService       *service.UserService
}

// NewLeaderboardHandler creates a new leaderboard handler instance
// Parameters:
//   - attemptService: Attempt service for fetching test results
//   - enrollmentService: Enrollment service for course progress
//   - userService: User service for user information
//
// Returns:
//   - *LeaderboardHandler: New leaderboard handler instance
func NewLeaderboardHandler(
	attemptService *service.AttemptService,
	enrollmentService *service.EnrollmentService,
	userService *service.UserService,
) *LeaderboardHandler {
	return &LeaderboardHandler{
		attemptService:    attemptService,
		enrollmentService: enrollmentService,
		userService:       userService,
	}
}

// LeaderboardEntry represents a single entry in the leaderboard
type LeaderboardEntry struct {
	Rank         int     `json:"rank"`
	UserID       string  `json:"user_id"`
	UserName     string  `json:"user_name"`
	Email        string  `json:"email"`
	Score        float64 `json:"score"`
	Attempts     int     `json:"attempts,omitempty"`
	HighestScore float64 `json:"highest_score,omitempty"`
	AverageScore float64 `json:"average_score,omitempty"`
	CompletedAt  string  `json:"completed_at,omitempty"`
	Progress     float64 `json:"progress,omitempty"`
}

// GetGlobalLeaderboard godoc
// @Summary Get global leaderboard
// @Description Retrieve global leaderboard ranking all users by test scores and performance
// @Tags Leaderboard
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of entries per page (default 10)" default(10)
// @Param sort_by query string false "Sort by: highest_score, average_score, recent" default(highest_score)
// @Success 200 {object} response.Response{data=[]LeaderboardEntry}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /leaderboard [get]
func (lh *LeaderboardHandler) GetGlobalLeaderboard(c *gin.Context) {
	log.Println("[Leaderboard Handler] Fetching global leaderboard")

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

	sortBy := c.Query("sort_by")
	if sortBy == "" {
		sortBy = "highest_score"
	}

	// Call service to get global leaderboard
	entries, total, err := lh.attemptService.GetGlobalLeaderboard(page, limit, sortBy)
	if err != nil {
		log.Printf("[Leaderboard Handler] Failed to get global leaderboard: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  entries,
		"total": total,
		"page":  page,
		"limit": limit,
		"type":  "global",
	})
}

// GetCourseLeaderboard godoc
// @Summary Get course leaderboard
// @Description Retrieve leaderboard for a specific course showing student progress and completion
// @Tags Leaderboard
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course ID (UUID)"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of entries per page (default 10)" default(10)
// @Param sort_by query string false "Sort by: progress, completion_date, recent" default(progress)
// @Success 200 {object} response.Response{data=[]LeaderboardEntry}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /leaderboard/course/{id} [get]
func (lh *LeaderboardHandler) GetCourseLeaderboard(c *gin.Context) {
	courseIDStr := c.Param("id")
	log.Printf("[Leaderboard Handler] Fetching course leaderboard: %s", courseIDStr)

	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
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

	sortBy := c.Query("sort_by")
	if sortBy == "" {
		sortBy = "progress"
	}

	// Call service to get course leaderboard
	entries, total, err := lh.enrollmentService.GetCourseLeaderboard(courseID, page, limit, sortBy)
	if err != nil {
		log.Printf("[Leaderboard Handler] Failed to get course leaderboard: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":      entries,
		"total":     total,
		"page":      page,
		"limit":     limit,
		"type":      "course",
		"course_id": courseID,
	})
}

// GetTestLeaderboard godoc
// @Summary Get test leaderboard
// @Description Retrieve leaderboard for a specific test showing scores and rankings
// @Tags Leaderboard
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Test Series ID (UUID)"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of entries per page (default 10)" default(10)
// @Param sort_by query string false "Sort by: highest_score, average_score, recent" default(highest_score)
// @Success 200 {object} response.Response{data=[]LeaderboardEntry}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /leaderboard/test/{id} [get]
func (lh *LeaderboardHandler) GetTestLeaderboard(c *gin.Context) {
	testIDStr := c.Param("id")
	log.Printf("[Leaderboard Handler] Fetching test leaderboard: %s", testIDStr)

	testID, err := uuid.Parse(testIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid test ID format")
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

	sortBy := c.Query("sort_by")
	if sortBy == "" {
		sortBy = "highest_score"
	}

	// Call service to get test leaderboard
	entries, total, err := lh.attemptService.GetTestLeaderboard(testID, page, limit, sortBy)
	if err != nil {
		log.Printf("[Leaderboard Handler] Failed to get test leaderboard: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":    entries,
		"total":   total,
		"page":    page,
		"limit":   limit,
		"type":    "test",
		"test_id": testID,
	})
}
