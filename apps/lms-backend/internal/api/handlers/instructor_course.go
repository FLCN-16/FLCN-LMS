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

// InstructorCourseHandler handles instructor-specific course operations with ownership verification
type InstructorCourseHandler struct {
	courseService *service.CourseService
	userService   *service.UserService
}

// NewInstructorCourseHandler creates a new instructor course handler instance
// Parameters:
//   - courseService: Course service for business logic
//   - userService: User service for authorization checks
//
// Returns:
//   - *InstructorCourseHandler: New instructor course handler instance
func NewInstructorCourseHandler(courseService *service.CourseService, userService *service.UserService) *InstructorCourseHandler {
	return &InstructorCourseHandler{
		courseService: courseService,
		userService:   userService,
	}
}

// ListInstructorCourses godoc
// @Summary List instructor's courses
// @Description Retrieve paginated list of courses for a specific instructor (verified by ownership)
// @Tags Instructor Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor UUID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of courses per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.CourseListResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /instructors/{instructorId}/courses [get]
func (ich *InstructorCourseHandler) ListInstructorCourses(c *gin.Context) {
	instructorID := c.Param("instructorId")

	// Parse UUID
	id, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	// Get authenticated user
	userID, err := middleware.GetUserID(c)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get user ID: %v", err)
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Check if user is trying to access their own courses or is admin
	role, exists := c.Get("role")
	if !exists {
		response.Forbidden(c, "Unable to verify user role")
		return
	}

	roleStr, ok := role.(string)
	if !ok || (roleStr != "admin" && userID != id) {
		log.Printf("[Instructor Course Handler] User %s attempted to access courses for instructor %s", userID, id)
		response.Forbidden(c, "You can only view your own courses")
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

	log.Printf("[Instructor Course Handler] Listing courses for instructor: %s (requested by %s)", id, userID)

	// Call service to list instructor courses
	courses, total, err := ich.courseService.ListInstructorCourses(id, page, limit)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to list instructor courses: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  courses,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetInstructorCourse godoc
// @Summary Get instructor's course for editing
// @Description Retrieve a course owned by the instructor with full details for editing
// @Tags Instructor Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor UUID"
// @Param courseId path string true "Course UUID"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /instructors/{instructorId}/courses/{courseId} [get]
func (ich *InstructorCourseHandler) GetInstructorCourse(c *gin.Context) {
	instructorID := c.Param("instructorId")
	courseID := c.Param("courseId")

	// Parse UUIDs
	iid, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	cid, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	// Get authenticated user
	userID, err := middleware.GetUserID(c)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get user ID: %v", err)
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Check if user is trying to access their own course or is admin
	role, exists := c.Get("role")
	if !exists {
		response.Forbidden(c, "Unable to verify user role")
		return
	}

	roleStr, ok := role.(string)
	if !ok || (roleStr != "admin" && userID != iid) {
		log.Printf("[Instructor Course Handler] User %s attempted to access course %s owned by instructor %s", userID, cid, iid)
		response.Forbidden(c, "You can only view your own courses")
		return
	}

	log.Printf("[Instructor Course Handler] Getting course %s for instructor %s", cid, iid)

	// Get course
	course, err := ich.courseService.GetCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	// Verify course belongs to instructor
	if course.InstructorID != iid {
		log.Printf("[Instructor Course Handler] Course %s does not belong to instructor %s", cid, iid)
		response.Forbidden(c, "This course does not belong to the specified instructor")
		return
	}

	response.Success(c, http.StatusOK, course)
}

// UpdateInstructorCourse godoc
// @Summary Update instructor's course
// @Description Update a course owned by the instructor
// @Tags Instructor Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor UUID"
// @Param courseId path string true "Course UUID"
// @Param request body service.UpdateCourseRequest true "Course update request"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /instructors/{instructorId}/courses/{courseId} [patch]
func (ich *InstructorCourseHandler) UpdateInstructorCourse(c *gin.Context) {
	instructorID := c.Param("instructorId")
	courseID := c.Param("courseId")

	// Parse UUIDs
	iid, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	cid, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	// Get authenticated user
	userID, err := middleware.GetUserID(c)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get user ID: %v", err)
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Check if user is trying to update their own course or is admin
	role, exists := c.Get("role")
	if !exists {
		response.Forbidden(c, "Unable to verify user role")
		return
	}

	roleStr, ok := role.(string)
	if !ok || (roleStr != "admin" && userID != iid) {
		log.Printf("[Instructor Course Handler] User %s attempted to update course %s owned by instructor %s", userID, cid, iid)
		response.Forbidden(c, "You can only update your own courses")
		return
	}

	// Verify course exists and belongs to instructor
	course, err := ich.courseService.GetCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	if course.InstructorID != iid {
		log.Printf("[Instructor Course Handler] Course %s does not belong to instructor %s", cid, iid)
		response.Forbidden(c, "This course does not belong to the specified instructor")
		return
	}

	var req service.UpdateCourseRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	log.Printf("[Instructor Course Handler] Updating course %s for instructor %s", cid, iid)

	// Call service to update course
	updatedCourse, err := ich.courseService.UpdateCourse(cid, &req)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to update course: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, updatedCourse)
}

// DeleteInstructorCourse godoc
// @Summary Delete instructor's course
// @Description Delete a course owned by the instructor
// @Tags Instructor Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor UUID"
// @Param courseId path string true "Course UUID"
// @Success 204 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /instructors/{instructorId}/courses/{courseId} [delete]
func (ich *InstructorCourseHandler) DeleteInstructorCourse(c *gin.Context) {
	instructorID := c.Param("instructorId")
	courseID := c.Param("courseId")

	// Parse UUIDs
	iid, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	cid, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	// Get authenticated user
	userID, err := middleware.GetUserID(c)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get user ID: %v", err)
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Check if user is trying to delete their own course or is admin
	role, exists := c.Get("role")
	if !exists {
		response.Forbidden(c, "Unable to verify user role")
		return
	}

	roleStr, ok := role.(string)
	if !ok || (roleStr != "admin" && userID != iid) {
		log.Printf("[Instructor Course Handler] User %s attempted to delete course %s owned by instructor %s", userID, cid, iid)
		response.Forbidden(c, "You can only delete your own courses")
		return
	}

	// Verify course exists and belongs to instructor
	course, err := ich.courseService.GetCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	if course.InstructorID != iid {
		log.Printf("[Instructor Course Handler] Course %s does not belong to instructor %s", cid, iid)
		response.Forbidden(c, "This course does not belong to the specified instructor")
		return
	}

	log.Printf("[Instructor Course Handler] Deleting course %s for instructor %s", cid, iid)

	if err := ich.courseService.DeleteCourse(cid); err != nil {
		log.Printf("[Instructor Course Handler] Failed to delete course: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// PublishInstructorCourse godoc
// @Summary Publish instructor's course
// @Description Publish a course owned by the instructor
// @Tags Instructor Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor UUID"
// @Param courseId path string true "Course UUID"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /instructors/{instructorId}/courses/{courseId}/publish [post]
func (ich *InstructorCourseHandler) PublishInstructorCourse(c *gin.Context) {
	instructorID := c.Param("instructorId")
	courseID := c.Param("courseId")

	// Parse UUIDs
	iid, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	cid, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	// Get authenticated user
	userID, err := middleware.GetUserID(c)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get user ID: %v", err)
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Check if user is trying to publish their own course or is admin
	role, exists := c.Get("role")
	if !exists {
		response.Forbidden(c, "Unable to verify user role")
		return
	}

	roleStr, ok := role.(string)
	if !ok || (roleStr != "admin" && userID != iid) {
		log.Printf("[Instructor Course Handler] User %s attempted to publish course %s owned by instructor %s", userID, cid, iid)
		response.Forbidden(c, "You can only publish your own courses")
		return
	}

	// Verify course exists and belongs to instructor
	course, err := ich.courseService.GetCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	if course.InstructorID != iid {
		log.Printf("[Instructor Course Handler] Course %s does not belong to instructor %s", cid, iid)
		response.Forbidden(c, "This course does not belong to the specified instructor")
		return
	}

	log.Printf("[Instructor Course Handler] Publishing course %s for instructor %s", cid, iid)

	publishedCourse, err := ich.courseService.PublishCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to publish course: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, publishedCourse)
}

// ArchiveInstructorCourse godoc
// @Summary Archive instructor's course
// @Description Archive a course owned by the instructor
// @Tags Instructor Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param instructorId path string true "Instructor UUID"
// @Param courseId path string true "Course UUID"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /instructors/{instructorId}/courses/{courseId}/archive [post]
func (ich *InstructorCourseHandler) ArchiveInstructorCourse(c *gin.Context) {
	instructorID := c.Param("instructorId")
	courseID := c.Param("courseId")

	// Parse UUIDs
	iid, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	cid, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	// Get authenticated user
	userID, err := middleware.GetUserID(c)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get user ID: %v", err)
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Check if user is trying to archive their own course or is admin
	role, exists := c.Get("role")
	if !exists {
		response.Forbidden(c, "Unable to verify user role")
		return
	}

	roleStr, ok := role.(string)
	if !ok || (roleStr != "admin" && userID != iid) {
		log.Printf("[Instructor Course Handler] User %s attempted to archive course %s owned by instructor %s", userID, cid, iid)
		response.Forbidden(c, "You can only archive your own courses")
		return
	}

	// Verify course exists and belongs to instructor
	course, err := ich.courseService.GetCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	if course.InstructorID != iid {
		log.Printf("[Instructor Course Handler] Course %s does not belong to instructor %s", cid, iid)
		response.Forbidden(c, "This course does not belong to the specified instructor")
		return
	}

	log.Printf("[Instructor Course Handler] Archiving course %s for instructor %s", cid, iid)

	archivedCourse, err := ich.courseService.ArchiveCourse(cid)
	if err != nil {
		log.Printf("[Instructor Course Handler] Failed to archive course: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, archivedCourse)
}
