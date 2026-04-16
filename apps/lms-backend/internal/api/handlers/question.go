package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// QuestionHandler handles all question-related HTTP requests
type QuestionHandler struct {
	questionService *service.QuestionService
}

// NewQuestionHandler creates a new question handler instance
func NewQuestionHandler(questionService *service.QuestionService) *QuestionHandler {
	return &QuestionHandler{
		questionService: questionService,
	}
}

// ListQuestions godoc
// @Summary List all questions
// @Description Retrieve paginated list of all questions
// @Tags Questions
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of questions per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /questions [get]
func (qh *QuestionHandler) ListQuestions(c *gin.Context) {
	log.Println("[Question Handler] Listing all questions")

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

	questions, total, err := qh.questionService.ListQuestions(page, limit)
	if err != nil {
		log.Printf("[Question Handler] Failed to list questions: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  questions,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetQuestion godoc
// @Summary Get question by ID
// @Description Retrieve a specific question by ID with its options
// @Tags Questions
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /questions/{id} [get]
func (qh *QuestionHandler) GetQuestion(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Question Handler] Invalid question ID: %v", err)
		response.BadRequest(c, "Invalid question ID")
		return
	}

	question, err := qh.questionService.GetQuestion(id)
	if err != nil {
		log.Printf("[Question Handler] Failed to get question: %v", err)
		response.NotFound(c, "Question not found")
		return
	}

	response.Success(c, http.StatusOK, question)
}

// GetQuestionsByTestSeries godoc
// @Summary Get questions for a test series
// @Description Retrieve paginated list of questions for a specific test series
// @Tags Questions
// @Accept json
// @Produce json
// @Param testSeriesId path string true "Test Series ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of questions per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /test-series/{testSeriesId}/questions [get]
func (qh *QuestionHandler) GetQuestionsByTestSeries(c *gin.Context) {
	testSeriesIDStr := c.Param("testSeriesId")
	testSeriesID, err := uuid.Parse(testSeriesIDStr)
	if err != nil {
		log.Printf("[Question Handler] Invalid test series ID: %v", err)
		response.BadRequest(c, "Invalid test series ID")
		return
	}

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

	questions, total, err := qh.questionService.GetQuestionsByTestSeries(testSeriesID, page, limit)
	if err != nil {
		log.Printf("[Question Handler] Failed to get questions for test series: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  questions,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateQuestion godoc
// @Summary Create a new question
// @Description Create a new question with options for a test series (faculty/admin only)
// @Tags Questions
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateQuestionRequest true "Question creation request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 409 {object} response.Response
// @Router /questions [post]
func (qh *QuestionHandler) CreateQuestion(c *gin.Context) {
	log.Println("[Question Handler] Creating new question")

	var req service.CreateQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Question Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	question, err := qh.questionService.CreateQuestion(&req)
	if err != nil {
		log.Printf("[Question Handler] Failed to create question: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, question)
}

// UpdateQuestion godoc
// @Summary Update a question
// @Description Update an existing question (faculty/admin only)
// @Tags Questions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Param request body service.UpdateQuestionRequest true "Question update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /questions/{id} [patch]
func (qh *QuestionHandler) UpdateQuestion(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Question Handler] Invalid question ID: %v", err)
		response.BadRequest(c, "Invalid question ID")
		return
	}

	var req service.UpdateQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Question Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	question, err := qh.questionService.UpdateQuestion(id, &req)
	if err != nil {
		log.Printf("[Question Handler] Failed to update question: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, question)
}

// DeleteQuestion godoc
// @Summary Delete a question
// @Description Delete a question and all its options (faculty/admin only)
// @Tags Questions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /questions/{id} [delete]
func (qh *QuestionHandler) DeleteQuestion(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Question Handler] Invalid question ID: %v", err)
		response.BadRequest(c, "Invalid question ID")
		return
	}

	if err := qh.questionService.DeleteQuestion(id); err != nil {
		log.Printf("[Question Handler] Failed to delete question: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// UpdateQuestionOptions godoc
// @Summary Update question options
// @Description Update the options for a multiple choice question
// @Tags Questions
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Param request body service.UpdateQuestionRequest true "Options update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /questions/{id}/options [patch]
func (qh *QuestionHandler) UpdateQuestionOptions(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Question Handler] Invalid question ID: %v", err)
		response.BadRequest(c, "Invalid question ID")
		return
	}

	var req struct {
		Options []service.OptionRequest `json:"options" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Question Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	// Update question with new options
	updateReq := service.UpdateQuestionRequest{
		Options: req.Options,
	}

	question, err := qh.questionService.UpdateQuestion(id, &updateReq)
	if err != nil {
		log.Printf("[Question Handler] Failed to update question options: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, question)
}

// ValidateQuestion godoc
// @Summary Validate a question
// @Description Validate if a question has proper structure (at least one correct option for MCQ, etc.)
// @Tags Questions
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /questions/{id}/validate [get]
func (qh *QuestionHandler) ValidateQuestion(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Question Handler] Invalid question ID: %v", err)
		response.BadRequest(c, "Invalid question ID")
		return
	}

	question, err := qh.questionService.GetQuestion(id)
	if err != nil {
		log.Printf("[Question Handler] Failed to get question: %v", err)
		response.NotFound(c, "Question not found")
		return
	}

	response.Success(c, http.StatusOK, question)
}

// BulkCreateQuestions godoc
// @Summary Create multiple questions
// @Description Create multiple questions at once (faculty/admin only)
// @Tags Questions
// @Security Bearer
// @Accept json
// @Produce json
// @Param requests body []service.CreateQuestionRequest true "Array of question creation requests"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /questions/bulk [post]
func (qh *QuestionHandler) BulkCreateQuestions(c *gin.Context) {
	log.Println("[Question Handler] Bulk creating questions")

	var requests []service.CreateQuestionRequest
	if err := c.ShouldBindJSON(&requests); err != nil {
		log.Printf("[Question Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	if len(requests) == 0 {
		response.BadRequest(c, "At least one question is required")
		return
	}

	var questions []interface{}
	for i, req := range requests {
		question, err := qh.questionService.CreateQuestion(&req)
		if err != nil {
			log.Printf("[Question Handler] Failed to create question %d: %v", i, err)
			response.BadRequest(c, fmt.Sprintf("Failed to create question %d: %v", i, err.Error()))
			return
		}
		questions = append(questions, question)
	}

	response.Success(c, http.StatusCreated, gin.H{
		"data":  questions,
		"count": len(questions),
	})
}
