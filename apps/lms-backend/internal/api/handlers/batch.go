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

// BatchHandler handles all batch-related HTTP requests
type BatchHandler struct {
	batchService *service.BatchService
}

// NewBatchHandler creates a new batch handler instance
func NewBatchHandler(batchService *service.BatchService) *BatchHandler {
	return &BatchHandler{
		batchService: batchService,
	}
}

// ListBatches godoc
// @Summary List all batches
// @Description Retrieve paginated list of all batches
// @Tags Batches
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of batches per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /batches [get]
func (bh *BatchHandler) ListBatches(c *gin.Context) {
	log.Println("[Batch Handler] Listing all batches")

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

	batches, total, err := bh.batchService.ListBatches(page, limit)
	if err != nil {
		log.Printf("[Batch Handler] Failed to list batches: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  batches,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetBatch godoc
// @Summary Get batch by ID
// @Description Retrieve a specific batch by ID
// @Tags Batches
// @Accept json
// @Produce json
// @Param id path string true "Batch ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /batches/{id} [get]
func (bh *BatchHandler) GetBatch(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Batch Handler] Invalid batch ID: %v", err)
		response.BadRequest(c, "Invalid batch ID")
		return
	}

	batch, err := bh.batchService.GetBatch(id)
	if err != nil {
		log.Printf("[Batch Handler] Failed to get batch: %v", err)
		response.NotFound(c, "Batch not found")
		return
	}

	response.Success(c, http.StatusOK, batch)
}

// ListBatchesByInstructor godoc
// @Summary List batches by instructor
// @Description Retrieve batches created by a specific instructor
// @Tags Batches
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of batches per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /instructors/{instructorId}/batches [get]
func (bh *BatchHandler) ListBatchesByInstructor(c *gin.Context) {
	instructorIDStr := c.Param("instructorId")
	instructorID, err := uuid.Parse(instructorIDStr)
	if err != nil {
		log.Printf("[Batch Handler] Invalid instructor ID: %v", err)
		response.BadRequest(c, "Invalid instructor ID")
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

	batches, total, err := bh.batchService.ListBatchesByInstructor(instructorID, page, limit)
	if err != nil {
		log.Printf("[Batch Handler] Failed to list batches: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  batches,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateBatch godoc
// @Summary Create a new batch
// @Description Create a new batch (faculty/admin only)
// @Tags Batches
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateBatchRequest true "Batch creation request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /batches [post]
func (bh *BatchHandler) CreateBatch(c *gin.Context) {
	log.Println("[Batch Handler] Creating new batch")

	var req service.CreateBatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Batch Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	batch, err := bh.batchService.CreateBatch(&req)
	if err != nil {
		log.Printf("[Batch Handler] Failed to create batch: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, batch)
}

// UpdateBatch godoc
// @Summary Update a batch
// @Description Update an existing batch (faculty/admin only)
// @Tags Batches
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Batch ID"
// @Param request body service.UpdateBatchRequest true "Batch update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /batches/{id} [patch]
func (bh *BatchHandler) UpdateBatch(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Batch Handler] Invalid batch ID: %v", err)
		response.BadRequest(c, "Invalid batch ID")
		return
	}

	var req service.UpdateBatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Batch Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	batch, err := bh.batchService.UpdateBatch(id, &req)
	if err != nil {
		log.Printf("[Batch Handler] Failed to update batch: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, batch)
}

// DeleteBatch godoc
// @Summary Delete a batch
// @Description Delete a batch (faculty/admin only)
// @Tags Batches
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Batch ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /batches/{id} [delete]
func (bh *BatchHandler) DeleteBatch(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Batch Handler] Invalid batch ID: %v", err)
		response.BadRequest(c, "Invalid batch ID")
		return
	}

	if err := bh.batchService.DeleteBatch(id); err != nil {
		log.Printf("[Batch Handler] Failed to delete batch: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// EnrollStudent godoc
// @Summary Enroll student in batch
// @Description Add a student to a batch (faculty/admin only)
// @Tags Batches
// @Security Bearer
// @Accept json
// @Produce json
// @Param batchId path string true "Batch ID"
// @Param request body service.EnrollStudentRequest true "Student enrollment request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /batches/{batchId}/enroll [post]
func (bh *BatchHandler) EnrollStudent(c *gin.Context) {
	batchIDStr := c.Param("batchId")
	batchID, err := uuid.Parse(batchIDStr)
	if err != nil {
		log.Printf("[Batch Handler] Invalid batch ID: %v", err)
		response.BadRequest(c, "Invalid batch ID")
		return
	}

	var req service.EnrollStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Batch Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	if err := bh.batchService.EnrollStudent(batchID, req.StudentID); err != nil {
		log.Printf("[Batch Handler] Failed to enroll student: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{"message": "Student enrolled successfully"})
}

// ListBatchStudents godoc
// @Summary List batch students
// @Description Retrieve students enrolled in a batch
// @Tags Batches
// @Accept json
// @Produce json
// @Param batchId path string true "Batch ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of students per page (default 20)" default(20)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /batches/{batchId}/students [get]
func (bh *BatchHandler) ListBatchStudents(c *gin.Context) {
	batchIDStr := c.Param("batchId")
	batchID, err := uuid.Parse(batchIDStr)
	if err != nil {
		log.Printf("[Batch Handler] Invalid batch ID: %v", err)
		response.BadRequest(c, "Invalid batch ID")
		return
	}

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

	students, total, err := bh.batchService.ListBatchStudents(batchID, page, limit)
	if err != nil {
		log.Printf("[Batch Handler] Failed to list batch students: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  students,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}
