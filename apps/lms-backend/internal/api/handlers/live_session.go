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

// LiveSessionHandler handles all live session-related HTTP requests
type LiveSessionHandler struct {
	liveSessionService *service.LiveSessionService
	userService        *service.UserService
}

// NewLiveSessionHandler creates a new live session handler instance
// Parameters:
//   - liveSessionService: Live session service for business logic
//   - userService: User service for authorization checks
//
// Returns:
//   - *LiveSessionHandler: New live session handler instance
func NewLiveSessionHandler(liveSessionService *service.LiveSessionService, userService *service.UserService) *LiveSessionHandler {
	return &LiveSessionHandler{
		liveSessionService: liveSessionService,
		userService:        userService,
	}
}

// ListSessions godoc
// @Summary List live sessions
// @Description Retrieve paginated list of live sessions with optional filters
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of sessions per page (default 10)" default(10)
// @Param status query string false "Filter by status (scheduled, active, completed, cancelled)"
// @Success 200 {object} response.Response{data=[]service.SessionResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions [get]
func (lsh *LiveSessionHandler) ListSessions(c *gin.Context) {
	log.Println("[Live Session Handler] Listing live sessions")

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

	// Call service to list sessions
	sessions, total, err := lsh.liveSessionService.ListSessions(page, limit)
	if err != nil {
		log.Printf("[Live Session Handler] Failed to list sessions: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  sessions,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateSession godoc
// @Summary Create a new live session
// @Description Create a new live session (faculty/admin only)
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateSessionRequest true "Session creation request"
// @Success 201 {object} response.Response{data=service.SessionResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions [post]
func (lsh *LiveSessionHandler) CreateSession(c *gin.Context) {
	log.Println("[Live Session Handler] Creating new live session")

	userID, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "User ID not found in context")
		return
	}

	var req service.CreateSessionRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Set instructor ID from context
	req.InstructorID = userID.(uuid.UUID)

	// Call service to create session
	session, err := lsh.liveSessionService.CreateSession(&req)
	if err != nil {
		log.Printf("[Live Session Handler] Failed to create session: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, gin.H{
		"data":    session,
		"message": "Live session created successfully",
	})
}

// GetSession godoc
// @Summary Get live session details
// @Description Retrieve details of a specific live session
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Session ID (UUID)"
// @Success 200 {object} response.Response{data=service.SessionResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions/{id} [get]
func (lsh *LiveSessionHandler) GetSession(c *gin.Context) {
	sessionIDStr := c.Param("id")
	log.Printf("[Live Session Handler] Getting session: %s", sessionIDStr)

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid session ID format")
		return
	}

	// Call service to get session
	session, err := lsh.liveSessionService.GetSession(sessionID)
	if err != nil {
		log.Printf("[Live Session Handler] Failed to get session: %v", err)
		response.NotFound(c, "Session not found")
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data": session,
	})
}

// UpdateSession godoc
// @Summary Update live session
// @Description Update live session details (faculty/admin only, creator only)
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Session ID (UUID)"
// @Param request body service.UpdateSessionRequest true "Session update request"
// @Success 200 {object} response.Response{data=service.SessionResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions/{id} [patch]
func (lsh *LiveSessionHandler) UpdateSession(c *gin.Context) {
	sessionIDStr := c.Param("id")
	userID, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "User ID not found in context")
		return
	}

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid session ID format")
		return
	}

	log.Printf("[Live Session Handler] Updating session: %s", sessionIDStr)

	var req service.UpdateSessionRequest

	// Parse request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Verify ownership
	existingSession, err := lsh.liveSessionService.GetSession(sessionID)
	if err != nil {
		response.NotFound(c, "Session not found")
		return
	}

	if existingSession.InstructorID != userID.(uuid.UUID) {
		response.Forbidden(c, "You can only update your own sessions")
		return
	}

	// Call service to update session
	updatedSession, err := lsh.liveSessionService.UpdateSession(sessionID, &req)
	if err != nil {
		log.Printf("[Live Session Handler] Failed to update session: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":    updatedSession,
		"message": "Live session updated successfully",
	})
}

// CancelSession godoc
// @Summary Cancel live session
// @Description Cancel a scheduled live session (faculty/admin only, creator only)
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Session ID (UUID)"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions/{id} [delete]
func (lsh *LiveSessionHandler) CancelSession(c *gin.Context) {
	sessionIDStr := c.Param("id")
	userID, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "User ID not found in context")
		return
	}

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid session ID format")
		return
	}

	log.Printf("[Live Session Handler] Cancelling session: %s", sessionIDStr)

	// Verify ownership
	existingSession, err := lsh.liveSessionService.GetSession(sessionID)
	if err != nil {
		response.NotFound(c, "Session not found")
		return
	}

	if existingSession.InstructorID != userID.(uuid.UUID) {
		response.Forbidden(c, "You can only cancel your own sessions")
		return
	}

	// Call service to cancel session
	_, err = lsh.liveSessionService.CancelSession(sessionID)
	if err != nil {
		log.Printf("[Live Session Handler] Failed to cancel session: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "Live session cancelled successfully",
	})
}

// JoinSession godoc
// @Summary Join a live session
// @Description Join an active live session
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Session ID (UUID)"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 409 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions/{id}/join [post]
func (lsh *LiveSessionHandler) JoinSession(c *gin.Context) {
	sessionIDStr := c.Param("id")
	userID, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "User ID not found in context")
		return
	}

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid session ID format")
		return
	}

	log.Printf("[Live Session Handler] User %s joining session: %s", userID, sessionIDStr)

	// Call service to join session
	_, err = lsh.liveSessionService.JoinSession(sessionID, userID.(uuid.UUID))
	if err != nil {
		log.Printf("[Live Session Handler] Failed to join session: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "Successfully joined live session",
	})
}

// GetToken godoc
// @Summary Get LiveKit token
// @Description Get LiveKit token for joining live session with video/audio
// @Tags Live Sessions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Session ID (UUID)"
// @Success 200 {object} response.Response{data=map[string]string}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /live-sessions/{id}/token [get]
func (lsh *LiveSessionHandler) GetToken(c *gin.Context) {
	sessionIDStr := c.Param("id")
	userID, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "User ID not found in context")
		return
	}

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid session ID format")
		return
	}

	log.Printf("[Live Session Handler] Getting LiveKit token for session: %s", sessionIDStr)

	// Call service to generate token
	token, err := lsh.liveSessionService.GenerateLiveKitToken(sessionID, userID.(uuid.UUID))
	if err != nil {
		log.Printf("[Live Session Handler] Failed to generate token: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"token": token,
	})
}
