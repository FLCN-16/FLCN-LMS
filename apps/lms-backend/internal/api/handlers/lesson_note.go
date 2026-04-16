package handlers

import (
	"log"
	"net/http"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// LessonNoteHandler handles lesson note HTTP requests
type LessonNoteHandler struct {
	noteService *service.LessonNoteService
}

// NewLessonNoteHandler creates a new LessonNoteHandler
func NewLessonNoteHandler(noteService *service.LessonNoteService) *LessonNoteHandler {
	return &LessonNoteHandler{noteService: noteService}
}

// GetLessonNotes returns the authenticated student's notes for a specific lesson
// GET /lessons/:id/notes
func (h *LessonNoteHandler) GetLessonNotes(c *gin.Context) {
	studentID, ok := studentUUIDFromContext(c)
	if !ok {
		return
	}

	lessonIDStr := c.Param("id")
	lessonID, err := uuid.Parse(lessonIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid lesson ID")
		return
	}

	notes, err := h.noteService.GetLessonNotes(lessonID, studentID)
	if err != nil {
		log.Printf("[NoteHandler] Failed to get lesson notes: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, notes)
}

// CreateNote creates a note for a lesson
// POST /lessons/:id/notes
func (h *LessonNoteHandler) CreateNote(c *gin.Context) {
	studentID, ok := studentUUIDFromContext(c)
	if !ok {
		return
	}

	lessonIDStr := c.Param("id")
	lessonID, err := uuid.Parse(lessonIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid lesson ID")
		return
	}

	var req service.CreateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	note, err := h.noteService.CreateNote(studentID, lessonID, &req)
	if err != nil {
		log.Printf("[NoteHandler] Failed to create note: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, note)
}

// GetMyNotes returns all notes for the authenticated student (across lessons)
// GET /my/notes
func (h *LessonNoteHandler) GetMyNotes(c *gin.Context) {
	studentID, ok := studentUUIDFromContext(c)
	if !ok {
		return
	}

	page, limit := parsePagination(c)

	notes, total, err := h.noteService.GetMyNotes(studentID, page, limit)
	if err != nil {
		log.Printf("[NoteHandler] Failed to get notes: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  notes,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// UpdateNote updates a note owned by the student
// PATCH /notes/:id
func (h *LessonNoteHandler) UpdateNote(c *gin.Context) {
	studentID, ok := studentUUIDFromContext(c)
	if !ok {
		return
	}

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid note ID")
		return
	}

	var req service.UpdateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	note, err := h.noteService.UpdateNote(noteID, studentID, &req)
	if err != nil {
		log.Printf("[NoteHandler] Failed to update note: %v", err)
		response.NotFound(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, note)
}

// DeleteNote deletes a note owned by the student
// DELETE /notes/:id
func (h *LessonNoteHandler) DeleteNote(c *gin.Context) {
	studentID, ok := studentUUIDFromContext(c)
	if !ok {
		return
	}

	noteIDStr := c.Param("id")
	noteID, err := uuid.Parse(noteIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid note ID")
		return
	}

	if err := h.noteService.DeleteNote(noteID, studentID); err != nil {
		log.Printf("[NoteHandler] Failed to delete note: %v", err)
		response.NotFound(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// studentUUIDFromContext extracts the authenticated student UUID from Gin context.
// Returns false and writes an error response if not found/invalid.
func studentUUIDFromContext(c *gin.Context) (uuid.UUID, bool) {
	raw, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return uuid.Nil, false
	}
	id, ok := raw.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return uuid.Nil, false
	}
	return id, true
}
