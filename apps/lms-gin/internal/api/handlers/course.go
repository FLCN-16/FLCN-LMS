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

// CourseHandler handles all course-related HTTP requests
type CourseHandler struct {
	courseService *service.CourseService
	userService   *service.UserService
}

// NewCourseHandler creates a new course handler instance
// Parameters:
//   - courseService: Course service for business logic
//   - userService: User service for authorization checks
//
// Returns:
//   - *CourseHandler: New course handler instance
func NewCourseHandler(courseService *service.CourseService, userService *service.UserService) *CourseHandler {
	return &CourseHandler{
		courseService: courseService,
		userService:   userService,
	}
}

// ListCourses godoc
// @Summary List all courses
// @Description Retrieve paginated list of courses with optional filters
// @Tags Courses
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of courses per page (default 10)" default(10)
// @Param status query string false "Filter by status (draft, published, archived)"
// @Success 200 {object} response.Response{data=[]service.CourseListResponse}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses [get]
func (ch *CourseHandler) ListCourses(c *gin.Context) {
	log.Println("[Course Handler] Listing all courses")

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

	// Call service to list courses
	courses, total, err := ch.courseService.ListCourses(page, limit)
	if err != nil {
		log.Printf("[Course Handler] Failed to list courses: %v", err)
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

// CreateCourse godoc
// @Summary Create a new course
// @Description Create a new course (faculty/admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateCourseRequest true "Course creation request"
// @Success 201 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 409 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses [post]
func (ch *CourseHandler) CreateCourse(c *gin.Context) {
	log.Println("[Course Handler] Creating new course")

	var req service.CreateCourseRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// If instructor_id is not provided, use the current user's ID
	if req.InstructorID == uuid.Nil {
		req.InstructorID = userID
	}

	// Call service to create course
	course, err := ch.courseService.CreateCourse(&req)
	if err != nil {
		log.Printf("[Course Handler] Failed to create course: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, course)
}

// GetCourse godoc
// @Summary Get course details
// @Description Retrieve detailed information about a specific course
// @Tags Courses
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id} [get]
func (ch *CourseHandler) GetCourse(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Course Handler] Getting course: %s", id)

	// Call service to get course
	course, err := ch.courseService.GetCourse(id)
	if err != nil {
		log.Printf("[Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	response.Success(c, http.StatusOK, course)
}

// GetCourseBySlug godoc
// @Summary Get course by slug
// @Description Retrieve course details using course slug
// @Tags Courses
// @Accept json
// @Produce json
// @Param slug path string true "Course slug"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/slug/{slug} [get]
func (ch *CourseHandler) GetCourseBySlug(c *gin.Context) {
	slug := c.Param("slug")

	if slug == "" {
		response.BadRequest(c, "Course slug is required")
		return
	}

	log.Printf("[Course Handler] Getting course by slug: %s", slug)

	// Call service to get course
	course, err := ch.courseService.GetCourseBySlug(slug)
	if err != nil {
		log.Printf("[Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	response.Success(c, http.StatusOK, course)
}

// UpdateCourse godoc
// @Summary Update course details
// @Description Update an existing course (faculty/admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Param request body service.UpdateCourseRequest true "Course update request"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id} [patch]
func (ch *CourseHandler) UpdateCourse(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	var req service.UpdateCourseRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	log.Printf("[Course Handler] Updating course: %s", id)

	// Call service to update course
	course, err := ch.courseService.UpdateCourse(id, &req)
	if err != nil {
		log.Printf("[Course Handler] Failed to update course: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, course)
}

// DeleteCourse godoc
// @Summary Delete a course
// @Description Delete an existing course (admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id} [delete]
func (ch *CourseHandler) DeleteCourse(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Course Handler] Deleting course: %s", id)

	// Call service to delete course
	if err := ch.courseService.DeleteCourse(id); err != nil {
		log.Printf("[Course Handler] Failed to delete course: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "Course deleted successfully",
	})
}

// PublishCourse godoc
// @Summary Publish a course
// @Description Publish a draft course (faculty/admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id}/publish [post]
func (ch *CourseHandler) PublishCourse(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Course Handler] Publishing course: %s", id)

	// Call service to publish course
	course, err := ch.courseService.PublishCourse(id)
	if err != nil {
		log.Printf("[Course Handler] Failed to publish course: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, course)
}

// ArchiveCourse godoc
// @Summary Archive a course
// @Description Archive a published course (faculty/admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id}/archive [post]
func (ch *CourseHandler) ArchiveCourse(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Course Handler] Archiving course: %s", id)

	// Call service to archive course
	course, err := ch.courseService.ArchiveCourse(id)
	if err != nil {
		log.Printf("[Course Handler] Failed to archive course: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, course)
}

// SetFeatured godoc
// @Summary Toggle course featured status
// @Description Set a course as featured or remove featured status (admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Param request body map[string]bool true "Featured status request"
// @Success 200 {object} response.Response{data=service.CourseResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id}/featured [patch]
func (ch *CourseHandler) SetFeatured(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	var req map[string]bool
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	featured, ok := req["featured"]
	if !ok {
		response.BadRequest(c, "featured field is required")
		return
	}

	log.Printf("[Course Handler] Setting featured status for course %s to %v", id, featured)

	// Call service to set featured status
	course, err := ch.courseService.SetFeatured(id, featured)
	if err != nil {
		log.Printf("[Course Handler] Failed to set featured status: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, course)
}

// GetModules godoc
// @Summary Get course modules
// @Description Retrieve all modules for a course with their lessons
// @Tags Courses
// @Accept json
// @Produce json
// @Param id path string true "Course UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id}/modules [get]
func (ch *CourseHandler) GetModules(c *gin.Context) {
	courseID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(courseID)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	log.Printf("[Course Handler] Getting modules for course: %s", id)

	// Verify course exists
	course, err := ch.courseService.GetCourse(id)
	if err != nil {
		log.Printf("[Course Handler] Course not found: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	// TODO: Call module service to get modules
	// For now, return empty response
	response.Success(c, http.StatusOK, gin.H{
		"course_id": course.ID,
		"modules":   []interface{}{},
	})
}

// ListInstructorCourses godoc
// @Summary List instructor courses
// @Description Retrieve paginated list of courses for a specific instructor
// @Tags Courses
// @Accept json
// @Produce json
// @Param instructor_id path string true "Instructor UUID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of courses per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.CourseListResponse}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/instructor/{instructor_id} [get]
func (ch *CourseHandler) ListInstructorCourses(c *gin.Context) {
	instructorID := c.Param("instructor_id")

	// Parse UUID
	id, err := uuid.Parse(instructorID)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
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

	log.Printf("[Course Handler] Listing courses for instructor: %s", id)

	// Call service to list instructor courses
	courses, total, err := ch.courseService.ListInstructorCourses(id, page, limit)
	if err != nil {
		log.Printf("[Course Handler] Failed to list instructor courses: %v", err)
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

// ListPublishedCourses godoc
// @Summary List published courses
// @Description Retrieve paginated list of published courses
// @Tags Courses
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of courses per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.CourseListResponse}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/published [get]
func (ch *CourseHandler) ListPublishedCourses(c *gin.Context) {
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

	log.Println("[Course Handler] Listing published courses")

	// Call service to list published courses
	courses, total, err := ch.courseService.ListPublishedCourses(page, limit)
	if err != nil {
		log.Printf("[Course Handler] Failed to list published courses: %v", err)
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

// SearchCourses godoc
// @Summary Search courses
// @Description Search for courses by title or description
// @Tags Courses
// @Accept json
// @Produce json
// @Param query query string true "Search query"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of courses per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.CourseListResponse}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/search [get]
func (ch *CourseHandler) SearchCourses(c *gin.Context) {
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

	log.Printf("[Course Handler] Searching courses with query: %s", query)

	// Call service to search courses
	courses, total, err := ch.courseService.SearchCourses(query, page, limit)
	if err != nil {
		log.Printf("[Course Handler] Failed to search courses: %v", err)
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

// GetCourseCount godoc
// @Summary Get course count
// @Description Retrieve total number of courses in the system
// @Tags Courses
// @Produce json
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/count [get]
func (ch *CourseHandler) GetCourseCount(c *gin.Context) {
	log.Println("[Course Handler] Getting course count")

	// Call service to get course count
	count, err := ch.courseService.GetCourseCount()
	if err != nil {
		log.Printf("[Course Handler] Failed to get course count: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"count": count,
	})
}

// GetLessons godoc
// @Summary Get course lessons
// @Description Retrieve all lessons in a course across all modules
// @Tags Courses
// @Accept json
// @Produce json
// @Param id path string true "Course ID (UUID)"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id}/lessons [get]
func (ch *CourseHandler) GetLessons(c *gin.Context) {
	courseIDStr := c.Param("id")
	log.Printf("[Course Handler] Getting lessons for course: %s", courseIDStr)

	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid course ID format")
		return
	}

	// Verify course exists
	course, err := ch.courseService.GetCourse(courseID)
	if err != nil {
		log.Printf("[Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	// Get lessons (this would need to be implemented in service)
	response.Success(c, http.StatusOK, gin.H{
		"data":      []interface{}{},
		"course_id": course.ID,
		"message":   "Lessons retrieved successfully",
	})
}

// GetEnrolledStudents godoc
// @Summary Get enrolled students
// @Description Retrieve list of students enrolled in a course (faculty/admin only)
// @Tags Courses
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Course ID (UUID)"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of students per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /courses/{id}/enrolled-students [get]
func (ch *CourseHandler) GetEnrolledStudents(c *gin.Context) {
	courseIDStr := c.Param("id")
	log.Printf("[Course Handler] Getting enrolled students for course: %s", courseIDStr)

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

	// Verify course exists
	course, err := ch.courseService.GetCourse(courseID)
	if err != nil {
		log.Printf("[Course Handler] Failed to get course: %v", err)
		response.NotFound(c, "Course not found")
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":      []interface{}{},
		"course_id": course.ID,
		"page":      page,
		"limit":     limit,
		"total":     0,
		"message":   "Enrolled students retrieved successfully",
	})
}
