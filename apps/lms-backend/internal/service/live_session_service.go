package service

import (
	"errors"
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
)

// LiveSessionService handles live session business logic
type LiveSessionService struct {
	liveSessionRepo     *repository.LiveSessionRepository
	userRepo            *repository.UserRepository
	liveSessionPartRepo *repository.LiveSessionParticipantRepository
}

// NewLiveSessionService creates a new live session service instance
// Parameters:
//   - liveSessionRepo: LiveSession repository for database operations
//   - userRepo: User repository for database operations
//   - liveSessionPartRepo: LiveSessionParticipant repository for database operations
//
// Returns:
//   - *LiveSessionService: New live session service instance
func NewLiveSessionService(
	liveSessionRepo *repository.LiveSessionRepository,
	userRepo *repository.UserRepository,
	liveSessionPartRepo *repository.LiveSessionParticipantRepository,
) *LiveSessionService {
	return &LiveSessionService{
		liveSessionRepo:     liveSessionRepo,
		userRepo:            userRepo,
		liveSessionPartRepo: liveSessionPartRepo,
	}
}

// CreateSessionRequest represents a live session creation request
type CreateSessionRequest struct {
	Title          string    `json:"title" binding:"required,min=1,max=255"`
	Description    string    `json:"description" binding:"required,min=1"`
	InstructorID   uuid.UUID `json:"instructor_id" binding:"required"`
	ScheduledStart time.Time `json:"scheduled_start" binding:"required"`
	ScheduledEnd   time.Time `json:"scheduled_end" binding:"required"`
}

// UpdateSessionRequest represents a live session update request
type UpdateSessionRequest struct {
	Title          string     `json:"title" binding:"omitempty,min=1,max=255"`
	Description    string     `json:"description" binding:"omitempty,min=1"`
	ScheduledStart *time.Time `json:"scheduled_start" binding:"omitempty"`
	ScheduledEnd   *time.Time `json:"scheduled_end" binding:"omitempty"`
	Status         string     `json:"status" binding:"omitempty,oneof=scheduled live ended cancelled"`
}

// SessionResponse represents a live session in API responses
type SessionResponse struct {
	ID               uuid.UUID  `json:"id"`
	Title            string     `json:"title"`
	Description      string     `json:"description"`
	InstructorID     uuid.UUID  `json:"instructor_id"`
	InstructorName   string     `json:"instructor_name"`
	ScheduledStart   time.Time  `json:"scheduled_start"`
	ScheduledEnd     time.Time  `json:"scheduled_end"`
	ActualStart      *time.Time `json:"actual_start"`
	ActualEnd        *time.Time `json:"actual_end"`
	LiveKitRoomName  string     `json:"livekit_room_name"`
	Status           string     `json:"status"`
	ParticipantCount int        `json:"participant_count"`
	CreatedAt        time.Time  `json:"created_at"`
}

// SessionListResponse represents a live session in list responses
type SessionListResponse struct {
	ID               uuid.UUID `json:"id"`
	Title            string    `json:"title"`
	InstructorName   string    `json:"instructor_name"`
	ScheduledStart   time.Time `json:"scheduled_start"`
	ScheduledEnd     time.Time `json:"scheduled_end"`
	Status           string    `json:"status"`
	ParticipantCount int       `json:"participant_count"`
	CreatedAt        time.Time `json:"created_at"`
}

// JoinSessionRequest represents a request to join a live session
type JoinSessionRequest struct {
	SessionID uuid.UUID `json:"session_id" binding:"required"`
	UserID    uuid.UUID `json:"user_id" binding:"required"`
}

// SessionTokenResponse represents LiveKit token response
type SessionTokenResponse struct {
	Token    string `json:"token"`
	RoomName string `json:"room_name"`
	URL      string `json:"url"`
}

// CreateSession creates a new live session
// Parameters:
//   - req: Session creation request
//
// Returns:
//   - *SessionResponse: Created session details
//   - error: Error if creation fails
func (lss *LiveSessionService) CreateSession(req *CreateSessionRequest) (*SessionResponse, error) {
	log.Println("[Live Session Service] Creating new live session:", req.Title)

	// Validate input
	if req.Title == "" || req.Description == "" {
		return nil, errors.New("title and description are required")
	}

	// Validate time range
	if req.ScheduledStart.After(req.ScheduledEnd) {
		return nil, errors.New("scheduled_start must be before scheduled_end")
	}

	if req.ScheduledStart.Before(time.Now()) {
		return nil, errors.New("scheduled_start cannot be in the past")
	}

	// Verify instructor exists
	instructor, err := lss.userRepo.GetByID(req.InstructorID)
	if err != nil {
		log.Printf("[Live Session Service] Instructor not found: %v", err)
		return nil, fmt.Errorf("instructor not found: %w", err)
	}

	// Verify instructor has faculty or admin role
	if instructor.Role != models.RoleFaculty && instructor.Role != models.RoleAdmin {
		return nil, errors.New("only faculty and admin users can create live sessions")
	}

	// Generate room name
	roomName := generateLiveKitRoomName(req.Title)

	// Create session
	session := &models.LiveSession{
		ID:              uuid.New(),
		Title:           req.Title,
		Description:     req.Description,
		InstructorID:    req.InstructorID,
		ScheduledStart:  req.ScheduledStart,
		ScheduledEnd:    req.ScheduledEnd,
		LiveKitRoomName: roomName,
		Status:          "scheduled",
	}

	if err := lss.liveSessionRepo.Create(session); err != nil {
		log.Printf("[Live Session Service] Failed to create live session: %v", err)
		return nil, fmt.Errorf("failed to create live session: %w", err)
	}

	log.Printf("[Live Session Service] Live session created successfully: %s", session.ID)
	return lss.sessionToResponse(session), nil
}

// GetSession retrieves a live session by ID
// Parameters:
//   - id: LiveSession UUID
//
// Returns:
//   - *SessionResponse: Session details
//   - error: Error if session not found
func (lss *LiveSessionService) GetSession(id uuid.UUID) (*SessionResponse, error) {
	session, err := lss.liveSessionRepo.GetByID(id)
	if err != nil {
		log.Printf("[Live Session Service] Failed to get live session %s: %v", id, err)
		return nil, err
	}
	return lss.sessionToResponse(session), nil
}

// ListSessions retrieves paginated list of live sessions
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of sessions per page
//
// Returns:
//   - []SessionListResponse: List of sessions
//   - int64: Total count of sessions
//   - error: Error if query fails
func (lss *LiveSessionService) ListSessions(page, limit int) ([]SessionListResponse, int64, error) {
	sessions, total, err := lss.liveSessionRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Live Session Service] Failed to list live sessions: %v", err)
		return nil, 0, err
	}

	var responses []SessionListResponse
	for _, session := range sessions {
		instructor, _ := lss.userRepo.GetByID(session.InstructorID)
		instructorName := ""
		if instructor != nil {
			instructorName = instructor.FirstName + " " + instructor.LastName
		}

		participantCount, _ := lss.liveSessionPartRepo.GetParticipantCount(session.ID)

		responses = append(responses, SessionListResponse{
			ID:               session.ID,
			Title:            session.Title,
			InstructorName:   instructorName,
			ScheduledStart:   session.ScheduledStart,
			ScheduledEnd:     session.ScheduledEnd,
			Status:           session.Status,
			ParticipantCount: int(participantCount),
			CreatedAt:        session.CreatedAt,
		})
	}

	return responses, total, nil
}

// ListUpcomingSessions retrieves paginated list of upcoming live sessions
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of sessions per page
//
// Returns:
//   - []SessionListResponse: List of upcoming sessions
//   - int64: Total count of upcoming sessions
//   - error: Error if query fails
func (lss *LiveSessionService) ListUpcomingSessions(page, limit int) ([]SessionListResponse, int64, error) {
	sessions, total, err := lss.liveSessionRepo.GetUpcoming(page, limit)
	if err != nil {
		log.Printf("[Live Session Service] Failed to list upcoming sessions: %v", err)
		return nil, 0, err
	}

	var responses []SessionListResponse
	for _, session := range sessions {
		instructor, _ := lss.userRepo.GetByID(session.InstructorID)
		instructorName := ""
		if instructor != nil {
			instructorName = instructor.FirstName + " " + instructor.LastName
		}

		participantCount, _ := lss.liveSessionPartRepo.GetParticipantCount(session.ID)

		responses = append(responses, SessionListResponse{
			ID:               session.ID,
			Title:            session.Title,
			InstructorName:   instructorName,
			ScheduledStart:   session.ScheduledStart,
			ScheduledEnd:     session.ScheduledEnd,
			Status:           session.Status,
			ParticipantCount: int(participantCount),
			CreatedAt:        session.CreatedAt,
		})
	}

	return responses, total, nil
}

// ListInstructorSessions retrieves paginated list of live sessions by instructor
// Parameters:
//   - instructorID: Instructor UUID
//   - page: Page number (1-based)
//   - limit: Number of sessions per page
//
// Returns:
//   - []SessionListResponse: List of instructor's sessions
//   - int64: Total count of instructor's sessions
//   - error: Error if query fails
func (lss *LiveSessionService) ListInstructorSessions(instructorID uuid.UUID, page, limit int) ([]SessionListResponse, int64, error) {
	sessions, total, err := lss.liveSessionRepo.GetByInstructor(instructorID, page, limit)
	if err != nil {
		log.Printf("[Live Session Service] Failed to list instructor sessions: %v", err)
		return nil, 0, err
	}

	var responses []SessionListResponse
	for _, session := range sessions {
		instructor, _ := lss.userRepo.GetByID(session.InstructorID)
		instructorName := ""
		if instructor != nil {
			instructorName = instructor.FirstName + " " + instructor.LastName
		}

		participantCount, _ := lss.liveSessionPartRepo.GetParticipantCount(session.ID)

		responses = append(responses, SessionListResponse{
			ID:               session.ID,
			Title:            session.Title,
			InstructorName:   instructorName,
			ScheduledStart:   session.ScheduledStart,
			ScheduledEnd:     session.ScheduledEnd,
			Status:           session.Status,
			ParticipantCount: int(participantCount),
			CreatedAt:        session.CreatedAt,
		})
	}

	return responses, total, nil
}

// UpdateSession updates an existing live session
// Parameters:
//   - id: LiveSession UUID
//   - req: Update request with partial session data
//
// Returns:
//   - *SessionResponse: Updated session details
//   - error: Error if update fails
func (lss *LiveSessionService) UpdateSession(id uuid.UUID, req *UpdateSessionRequest) (*SessionResponse, error) {
	log.Printf("[Live Session Service] Updating live session: %s", id)

	// Get existing session
	session, err := lss.liveSessionRepo.GetByID(id)
	if err != nil {
		log.Printf("[Live Session Service] Failed to get live session %s: %v", id, err)
		return nil, err
	}

	// Cannot update cancelled or ended sessions
	if session.Status == "cancelled" || session.Status == "ended" {
		return nil, fmt.Errorf("cannot update %s session", session.Status)
	}

	// Update fields if provided
	if req.Title != "" {
		session.Title = req.Title
	}
	if req.Description != "" {
		session.Description = req.Description
	}
	if req.ScheduledStart != nil {
		if req.ScheduledStart.Before(time.Now()) {
			return nil, errors.New("scheduled_start cannot be in the past")
		}
		session.ScheduledStart = *req.ScheduledStart
	}
	if req.ScheduledEnd != nil {
		session.ScheduledEnd = *req.ScheduledEnd
	}
	if req.Status != "" {
		session.Status = req.Status

		// Set actual start time if transitioning to live
		if req.Status == "live" && session.ActualStart == nil {
			now := time.Now()
			session.ActualStart = &now
		}

		// Set actual end time if transitioning to ended
		if req.Status == "ended" && session.ActualEnd == nil {
			now := time.Now()
			session.ActualEnd = &now
		}
	}

	if err := lss.liveSessionRepo.Update(session); err != nil {
		log.Printf("[Live Session Service] Failed to update live session: %v", err)
		return nil, fmt.Errorf("failed to update live session: %w", err)
	}

	log.Printf("[Live Session Service] Live session updated successfully: %s", id)
	return lss.sessionToResponse(session), nil
}

// CancelSession cancels a live session
// Parameters:
//   - id: LiveSession UUID
//
// Returns:
//   - *SessionResponse: Cancelled session details
//   - error: Error if cancellation fails
func (lss *LiveSessionService) CancelSession(id uuid.UUID) (*SessionResponse, error) {
	log.Printf("[Live Session Service] Cancelling live session: %s", id)

	// Get session
	session, err := lss.liveSessionRepo.GetByID(id)
	if err != nil {
		log.Printf("[Live Session Service] Failed to get live session %s: %v", id, err)
		return nil, err
	}

	// Cannot cancel if already live or ended
	if session.Status == "live" || session.Status == "ended" {
		return nil, fmt.Errorf("cannot cancel %s session", session.Status)
	}

	session.Status = "cancelled"
	now := time.Now()
	session.ActualEnd = &now

	if err := lss.liveSessionRepo.Update(session); err != nil {
		log.Printf("[Live Session Service] Failed to cancel live session: %v", err)
		return nil, fmt.Errorf("failed to cancel live session: %w", err)
	}

	log.Printf("[Live Session Service] Live session cancelled successfully: %s", id)
	return lss.sessionToResponse(session), nil
}

// JoinSession adds a user to a live session
// Parameters:
//   - sessionID: LiveSession UUID
//   - userID: User UUID
//
// Returns:
//   - *SessionResponse: Updated session details
//   - error: Error if joining fails
func (lss *LiveSessionService) JoinSession(sessionID, userID uuid.UUID) (*SessionResponse, error) {
	log.Printf("[Live Session Service] User %s joining session %s", userID, sessionID)

	// Verify session exists
	session, err := lss.liveSessionRepo.GetByID(sessionID)
	if err != nil {
		log.Printf("[Live Session Service] Session not found: %v", err)
		return nil, fmt.Errorf("session not found: %w", err)
	}

	// Verify user exists
	user, err := lss.userRepo.GetByID(userID)
	if err != nil {
		log.Printf("[Live Session Service] User not found: %v", err)
		return nil, fmt.Errorf("user not found: %w", err)
	}

	// Verify session is live or about to start
	if session.Status != "scheduled" && session.Status != "live" {
		return nil, fmt.Errorf("cannot join %s session", session.Status)
	}

	// Check if user is already a participant
	existing, _ := lss.liveSessionPartRepo.GetBySessionAndUser(sessionID, userID)
	if existing != nil {
		// Already joined, just return the session
		return lss.sessionToResponse(session), nil
	}

	// Create participant record
	participant := &models.LiveSessionParticipant{
		ID:        uuid.New(),
		SessionID: sessionID,
		UserID:    userID,
		JoinedAt:  time.Now(),
	}

	if err := lss.liveSessionPartRepo.Create(participant); err != nil {
		log.Printf("[Live Session Service] Failed to add participant: %v", err)
		return nil, fmt.Errorf("failed to join session: %w", err)
	}

	log.Printf("[Live Session Service] User %s joined session %s successfully", user.Email, sessionID)
	return lss.sessionToResponse(session), nil
}

// LeaveSession removes a user from a live session
// Parameters:
//   - sessionID: LiveSession UUID
//   - userID: User UUID
//
// Returns:
//   - error: Error if leaving fails
func (lss *LiveSessionService) LeaveSession(sessionID, userID uuid.UUID) error {
	log.Printf("[Live Session Service] User %s leaving session %s", userID, sessionID)

	// Get participant record
	participant, err := lss.liveSessionPartRepo.GetBySessionAndUser(sessionID, userID)
	if err != nil {
		log.Printf("[Live Session Service] Participant not found: %v", err)
		return fmt.Errorf("user is not a participant in this session: %w", err)
	}

	// Update left at time
	now := time.Now()
	participant.LeftAt = &now

	if err := lss.liveSessionPartRepo.Update(participant); err != nil {
		log.Printf("[Live Session Service] Failed to update participant: %v", err)
		return fmt.Errorf("failed to leave session: %w", err)
	}

	log.Printf("[Live Session Service] User %s left session %s", userID, sessionID)
	return nil
}

// GenerateLiveKitToken generates a LiveKit token for a user to join a session
// Parameters:
//   - sessionID: LiveSession UUID
//   - userID: User UUID
//
// Returns:
//   - *SessionTokenResponse: Token and room details
//   - error: Error if token generation fails
func (lss *LiveSessionService) GenerateLiveKitToken(sessionID, userID uuid.UUID) (*SessionTokenResponse, error) {
	log.Printf("[Live Session Service] Generating LiveKit token for user %s in session %s", userID, sessionID)

	// Get session
	session, err := lss.liveSessionRepo.GetByID(sessionID)
	if err != nil {
		log.Printf("[Live Session Service] Session not found: %v", err)
		return nil, fmt.Errorf("session not found: %w", err)
	}

	// Get user
	user, err := lss.userRepo.GetByID(userID)
	if err != nil {
		log.Printf("[Live Session Service] User not found: %v", err)
		return nil, fmt.Errorf("user not found: %w", err)
	}

	// TODO: Generate LiveKit token using LiveKit SDK
	// For now, return a placeholder response
	token := fmt.Sprintf("token_%s_%s", session.ID.String()[:8], user.ID.String()[:8])

	response := &SessionTokenResponse{
		Token:    token,
		RoomName: session.LiveKitRoomName,
		URL:      fmt.Sprintf("wss://livekit.example.com?token=%s", token),
	}

	log.Printf("[Live Session Service] LiveKit token generated successfully for session %s", sessionID)
	return response, nil
}

// GetSessionParticipants retrieves list of participants in a session
// Parameters:
//   - sessionID: LiveSession UUID
//
// Returns:
//   - []UserResponse: List of participants
//   - error: Error if query fails
func (lss *LiveSessionService) GetSessionParticipants(sessionID uuid.UUID) ([]UserResponse, error) {
	participants, err := lss.liveSessionPartRepo.GetBySessionID(sessionID)
	if err != nil {
		log.Printf("[Live Session Service] Failed to get participants: %v", err)
		return nil, err
	}

	var responses []UserResponse
	for _, participant := range participants {
		if participant.LeftAt == nil { // Only include active participants
			user, err := lss.userRepo.GetByID(participant.UserID)
			if err == nil {
				responses = append(responses, UserResponse{
					ID:                user.ID,
					Email:             user.Email,
					FirstName:         user.FirstName,
					LastName:          user.LastName,
					Phone:             user.Phone,
					ProfilePictureURL: user.ProfilePictureURL,
					Role:              string(user.Role),
					IsActive:          user.IsActive,
					CreatedAt:         user.CreatedAt,
				})
			}
		}
	}

	return responses, nil
}

// Helper functions

// sessionToResponse converts a LiveSession model to a SessionResponse
func (lss *LiveSessionService) sessionToResponse(session *models.LiveSession) *SessionResponse {
	instructor, _ := lss.userRepo.GetByID(session.InstructorID)
	instructorName := ""
	if instructor != nil {
		instructorName = instructor.FirstName + " " + instructor.LastName
	}

	participantCount, _ := lss.liveSessionPartRepo.GetParticipantCount(session.ID)

	return &SessionResponse{
		ID:               session.ID,
		Title:            session.Title,
		Description:      session.Description,
		InstructorID:     session.InstructorID,
		InstructorName:   instructorName,
		ScheduledStart:   session.ScheduledStart,
		ScheduledEnd:     session.ScheduledEnd,
		ActualStart:      session.ActualStart,
		ActualEnd:        session.ActualEnd,
		LiveKitRoomName:  session.LiveKitRoomName,
		Status:           session.Status,
		ParticipantCount: int(participantCount),
		CreatedAt:        session.CreatedAt,
	}
}

// generateLiveKitRoomName generates a unique LiveKit room name
func generateLiveKitRoomName(title string) string {
	return "room_" + slug.Make(title) + "_" + uuid.New().String()[:8]
}
