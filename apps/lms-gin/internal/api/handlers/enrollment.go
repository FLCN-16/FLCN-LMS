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

// EnrollmentHandler handles all course enrollment-related HTTP requests
type EnrollmentHandler struct {
	enrollmentService *service.EnrollmentService
}

// NewEnrollmentHandler creates a new enrollment handler instance
// Parameters:
//   - enrollmentService: Enrollment service for business logic
//
// Returns:
//   - *EnrollmentHandler: New enrollment handler instance
func NewEnrollmentHandler(enrollmentService *service.EnrollmentService) *EnrollmentHandler {
	return &EnrollmentHandler{
		enrollmentService: enrollmentService,
	}
}

// ListEnrollments godoc
// @Summary List student enrollments
// @Description Get paginated list of courses enrolled by authenticated student
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of enrollments per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.EnrollmentResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments [get]
func (eh *EnrollmentHandler) ListEnrollments(c *gin.Context) {
	log.Println("[Enrollment Handler] Listing student enrollments")

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

	// Call service to list enrollments
	enrollments, total, err := eh.enrollmentService.ListStudentEnrollments(userID, page, limit)
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to list enrollments: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  enrollments,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// EnrollStudent godoc
// @Summary Enroll in a course
// @Description Enroll authenticated student in a course
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.EnrollmentRequest true "Enrollment request"
// @Success 201 {object} response.Response{data=service.EnrollmentResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 409 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/enroll [post]
func (eh *EnrollmentHandler) EnrollStudent(c *gin.Context) {
	log.Println("[Enrollment Handler] Enrolling student in course")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req service.EnrollmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Set student ID to authenticated user
	req.StudentID = userID

	// Call service to enroll student
	enrollment, err := eh.enrollmentService.EnrollStudent(&req)
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to enroll student: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, enrollment)
}

// Unenroll godoc
// @Summary Unenroll from a course
// @Description Remove authenticated student enrollment from a course
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param course_id path string true "Course UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/{course_id} [delete]
func (eh *EnrollmentHandler) Unenroll(c *gin.Context) {
	courseID := c.Param("course_id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Enrollment Handler] Unenrolling student from course: %s", id)

	// Get authenticated user ID
	if _, err := middleware.GetUserID(c); err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to unenroll student
	if err := eh.enrollmentService.UnenrollStudent(id); err != nil {
		log.Printf("[Enrollment Handler] Failed to unenroll student: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "Student unenrolled successfully",
	})
}

// GetAdminEnrollments godoc
// @Summary Get course enrollments (admin)
// @Description Get paginated list of all enrollments for a course (admin/instructor only)
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param course_id path string true "Course UUID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of enrollments per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.EnrollmentResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/course/{course_id} [get]
func (eh *EnrollmentHandler) GetAdminEnrollments(c *gin.Context) {
	courseID := c.Param("course_id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Enrollment Handler] Getting enrollments for course: %s", id)

	// Get authenticated user ID
	if _, err := middleware.GetUserID(c); err != nil {
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

	// Call service to get course enrollments
	enrollments, total, err := eh.enrollmentService.ListCourseEnrollments(id, page, limit)
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to get course enrollments: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"course_id": id,
		"data":      enrollments,
		"total":     total,
		"page":      page,
		"limit":     limit,
	})
}

// GetEnrollment godoc
// @Summary Get enrollment details
// @Description Retrieve detailed information about a specific enrollment
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Enrollment UUID"
// @Success 200 {object} response.Response{data=service.EnrollmentResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/{id} [get]
func (eh *EnrollmentHandler) GetEnrollment(c *gin.Context) {
	enrollmentID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(enrollmentID)
	if err != nil {
		response.BadRequest(c, "Invalid enrollment ID format")
		return
	}

	log.Printf("[Enrollment Handler] Getting enrollment: %s", id)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to get enrollment
	enrollment, err := eh.enrollmentService.GetEnrollment(id)
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to get enrollment: %v", err)
		response.NotFound(c, "Enrollment not found")
		return
	}

	// Verify ownership or admin access
	if enrollment.StudentID != userID {
		// TODO: Check if user is admin/instructor
		response.Unauthorized(c, "You can only view your own enrollments")
		return
	}

	response.Success(c, http.StatusOK, enrollment)
}

// UpdateProgress godoc
// @Summary Update enrollment progress
// @Description Update progress percentage for an enrollment
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Enrollment UUID"
// @Param request body map[string]float64 true "Progress update request"
// @Success 200 {object} response.Response{data=service.EnrollmentResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/{id}/progress [patch]
func (eh *EnrollmentHandler) UpdateProgress(c *gin.Context) {
	enrollmentID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(enrollmentID)
	if err != nil {
		response.BadRequest(c, "Invalid enrollment ID format")
		return
	}

	var req map[string]float64
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	progress, ok := req["progress"]
	if !ok {
		response.BadRequest(c, "Progress field is required")
		return
	}

	if progress < 0 || progress > 100 {
		response.BadRequest(c, "Progress must be between 0 and 100")
		return
	}

	log.Printf("[Enrollment Handler] Updating enrollment progress: %s", id)

	// Get authenticated user ID
	if _, err := middleware.GetUserID(c); err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to update progress
	enrollment, err := eh.enrollmentService.UpdateProgress(id, &service.UpdateEnrollmentProgressRequest{ProgressPercentage: progress})
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to update progress: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, enrollment)
}

// CompleteEnrollment godoc
// @Summary Mark enrollment as completed
// @Description Mark an enrollment as completed
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Enrollment UUID"
// @Success 200 {object} response.Response{data=service.EnrollmentResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/{id}/complete [post]
func (eh *EnrollmentHandler) CompleteEnrollment(c *gin.Context) {
	enrollmentID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(enrollmentID)
	if err != nil {
		response.BadRequest(c, "Invalid enrollment ID format")
		return
	}

	log.Printf("[Enrollment Handler] Completing enrollment: %s", id)

	// Call service to complete enrollment
	enrollment, err := eh.enrollmentService.CompleteEnrollment(id)
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to complete enrollment: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, enrollment)
}

// GetEnrollmentStats godoc
// @Summary Get enrollment statistics
// @Description Get statistics for course enrollments (admin/instructor only)
// @Tags Enrollments
// @Security Bearer
// @Accept json
// @Produce json
// @Param course_id path string true "Course UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /enrollments/course/{course_id}/stats [get]
func (eh *EnrollmentHandler) GetEnrollmentStats(c *gin.Context) {
	courseID := c.Param("course_id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Enrollment Handler] Getting enrollment statistics for course: %s", id)

	// Get authenticated user ID
	if _, err := middleware.GetUserID(c); err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to get enrollment statistics
	stats, err := eh.enrollmentService.GetEnrollmentStats(id)
	if err != nil {
		log.Printf("[Enrollment Handler] Failed to get enrollment statistics: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, stats)
}
