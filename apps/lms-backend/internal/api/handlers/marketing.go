package handlers

import (
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// MarketingHandler handles public storefront API requests that require no authentication.
// All endpoints under /api/v1/marketing/* are served by this handler.
type MarketingHandler struct {
	courseService     *service.CourseService
	testSeriesService *service.TestSeriesService
	userService       *service.UserService
	moduleService     *service.ModuleService
	lessonService     *service.LessonService
	packageService    *service.CoursePackageService
	db                *gorm.DB
}

// NewMarketingHandler creates a new MarketingHandler.
func NewMarketingHandler(
	courseService *service.CourseService,
	testSeriesService *service.TestSeriesService,
	userService *service.UserService,
	moduleService *service.ModuleService,
	lessonService *service.LessonService,
	packageService *service.CoursePackageService,
	db *gorm.DB,
) *MarketingHandler {
	return &MarketingHandler{
		courseService:     courseService,
		testSeriesService: testSeriesService,
		userService:       userService,
		moduleService:     moduleService,
		lessonService:     lessonService,
		packageService:    packageService,
		db:                db,
	}
}

// ListCourses returns a paginated list of published courses.
// GET /api/v1/marketing/courses
// Query params: page (default 1), limit (default 12, max 100), search
func (mh *MarketingHandler) ListCourses(c *gin.Context) {
	page, limit := marketingParsePagination(c)
	search := c.Query("search")

	if search != "" {
		courses, _, err := mh.courseService.SearchCourses(search, page, limit)
		if err != nil {
			log.Printf("[Marketing] Failed to search courses: %v", err)
			response.InternalServerError(c, "Failed to search courses")
			return
		}
		// Filter to published only since SearchCourses returns all statuses
		var published []service.CourseListResponse
		for _, course := range courses {
			if course.Status == "published" {
				published = append(published, course)
			}
		}
		if published == nil {
			published = []service.CourseListResponse{}
		}
		response.SuccessPaginated(c, http.StatusOK, published, response.Pagination{
			Page:       page,
			Limit:      limit,
			Total:      int64(len(published)),
			TotalPages: 1,
		})
		return
	}

	courses, total, err := mh.courseService.ListPublishedCourses(page, limit)
	if err != nil {
		log.Printf("[Marketing] Failed to list courses: %v", err)
		response.InternalServerError(c, "Failed to retrieve courses")
		return
	}
	if courses == nil {
		courses = []service.CourseListResponse{}
	}

	totalPages := total / int64(limit)
	if total%int64(limit) != 0 {
		totalPages++
	}

	response.SuccessPaginated(c, http.StatusOK, courses, response.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

// GetFeaturedCourses returns featured published courses for the homepage.
// GET /api/v1/marketing/courses/featured
// Query params: limit (default 6, max 20)
func (mh *MarketingHandler) GetFeaturedCourses(c *gin.Context) {
	limit := 6
	if l := c.Query("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 && n <= 20 {
			limit = n
		}
	}

	// Fetch a larger batch of published courses to find featured ones
	courses, _, err := mh.courseService.ListPublishedCourses(1, 100)
	if err != nil {
		log.Printf("[Marketing] Failed to get featured courses: %v", err)
		response.InternalServerError(c, "Failed to retrieve featured courses")
		return
	}

	var featured []service.CourseListResponse
	for _, course := range courses {
		if course.IsFeatured {
			featured = append(featured, course)
			if len(featured) >= limit {
				break
			}
		}
	}
	if featured == nil {
		featured = []service.CourseListResponse{}
	}

	response.Success(c, http.StatusOK, featured)
}

// MarketingCourseDetail is the enriched course response for the public storefront,
// including instructor profile, bundle children, and parent info.
type MarketingCourseDetail struct {
	*service.CourseResponse
	Instructor   *PublicInstructorResponse   `json:"instructor,omitempty"`
	Children     []service.CourseListResponse `json:"children,omitempty"`
	ParentCourse *service.CourseListResponse  `json:"parent_course,omitempty"`
}

// GetCourse returns a single published course by slug or ID, enriched with instructor info.
// GET /api/v1/marketing/courses/:slug
func (mh *MarketingHandler) GetCourse(c *gin.Context) {
	param := c.Param("slug")
	if param == "" {
		response.BadRequest(c, "Course slug or ID is required")
		return
	}

	var course *service.CourseResponse
	var err error

	// Try to parse as UUID first
	if courseID, parseErr := uuid.Parse(param); parseErr == nil {
		course, err = mh.courseService.GetCourse(courseID)
	} else {
		course, err = mh.courseService.GetCourseBySlug(param)
	}

	if err != nil {
		log.Printf("[Marketing] Course not found: %s - %v", param, err)
		response.NotFound(c, "Course not found")
		return
	}

	if course.Status != "published" {
		response.NotFound(c, "Course not found")
		return
	}

	detail := &MarketingCourseDetail{CourseResponse: course}

	// Enrich with instructor profile
	if instructor, iErr := mh.userService.GetUserByID(course.InstructorID); iErr == nil {
		detail.Instructor = &PublicInstructorResponse{
			ID:                instructor.ID,
			FirstName:         instructor.FirstName,
			LastName:          instructor.LastName,
			ProfilePictureURL: instructor.ProfilePictureURL,
			Role:              instructor.Role,
		}
	}

	// If this is a bundle, attach published child courses
	if course.IsBundle {
		children, cErr := mh.db.Raw(
			`SELECT id, title, slug, description, thumbnail_url, price, status, is_featured,
			        parent_course_id, is_bundle, created_at
			 FROM courses
			 WHERE parent_course_id = ? AND status = 'published'
			 ORDER BY created_at ASC`,
			course.ID,
		).Rows()
		if cErr == nil {
			defer children.Close()
			var childList []service.CourseListResponse
			for children.Next() {
				var c service.CourseListResponse
				if scanErr := mh.db.ScanRows(children, &c); scanErr == nil {
					childList = append(childList, c)
				}
			}
			detail.Children = childList
		}
	}

	// If this is a child course, attach a lightweight parent reference
	if course.ParentCourseID != nil {
		var parentTitle, parentSlug string
		mh.db.Raw(`SELECT title, slug FROM courses WHERE id = ?`, *course.ParentCourseID).
			Row().Scan(&parentTitle, &parentSlug)
		if parentSlug != "" {
			detail.ParentCourse = &service.CourseListResponse{
				ID:    *course.ParentCourseID,
				Title: parentTitle,
				Slug:  parentSlug,
			}
		}
	}

	response.Success(c, http.StatusOK, detail)
}

// CurriculumLesson is the public-safe shape for a lesson in the curriculum preview.
type CurriculumLesson struct {
	ID              uuid.UUID `json:"id"`
	Title           string    `json:"title"`
	DurationSeconds int       `json:"duration_seconds"`
	OrderIndex      int       `json:"order_index"`
	IsPublished     bool      `json:"is_published"`
}

// CurriculumModule is a course module with its lesson summaries.
type CurriculumModule struct {
	ID          uuid.UUID          `json:"id"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	OrderIndex  int                `json:"order_index"`
	LessonCount int                `json:"lesson_count"`
	Lessons     []CurriculumLesson `json:"lessons"`
}

// GetCourseCurriculum returns the public curriculum (modules + lesson titles) for a published course.
// Content URLs are intentionally omitted.
// GET /api/v1/marketing/courses/:slug/curriculum
func (mh *MarketingHandler) GetCourseCurriculum(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		response.BadRequest(c, "Course slug is required")
		return
	}

	course, err := mh.courseService.GetCourseBySlug(slug)
	if err != nil || course.Status != "published" {
		response.NotFound(c, "Course not found")
		return
	}

	modules, _, err := mh.moduleService.GetModulesByCourse(course.ID, 1, 100)
	if err != nil {
		log.Printf("[Marketing] Failed to get modules for course %s: %v", course.ID, err)
		response.InternalServerError(c, "Failed to retrieve curriculum")
		return
	}

	curriculum := make([]CurriculumModule, 0, len(modules))
	for _, mod := range modules {
		lessons, _, err := mh.lessonService.GetLessonsByModule(mod.ID, 1, 100)
		if err != nil {
			lessons = nil
		}

		pubLessons := make([]CurriculumLesson, 0, len(lessons))
		for _, l := range lessons {
			pubLessons = append(pubLessons, CurriculumLesson{
				ID:              l.ID,
				Title:           l.Title,
				DurationSeconds: l.DurationSeconds,
				OrderIndex:      l.OrderIndex,
				IsPublished:     l.IsPublished,
			})
		}

		curriculum = append(curriculum, CurriculumModule{
			ID:          mod.ID,
			Title:       mod.Title,
			Description: mod.Description,
			OrderIndex:  mod.OrderIndex,
			LessonCount: len(pubLessons),
			Lessons:     pubLessons,
		})
	}

	response.Success(c, http.StatusOK, curriculum)
}

// GetRelatedCourses returns up to 6 published courses related to a given course slug,
// matched first by category then by instructor.
// GET /api/v1/marketing/courses/:slug/related
func (mh *MarketingHandler) GetRelatedCourses(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		response.BadRequest(c, "Course slug is required")
		return
	}

	// Fetch base course from DB to access CategoryID
	var baseCourse models.Course
	if err := mh.db.Where("slug = ? AND status = ?", slug, "published").First(&baseCourse).Error; err != nil {
		response.NotFound(c, "Course not found")
		return
	}

	var related []models.Course

	// 1. Same category
	if baseCourse.CategoryID != nil {
		mh.db.Preload("Instructor").Where("category_id = ? AND status = ? AND id != ?", baseCourse.CategoryID, "published", baseCourse.ID).
			Order("created_at DESC").Limit(6).Find(&related)
	}

	// 2. Supplement with same instructor if not enough
	if len(related) < 3 {
		seenIDs := map[uuid.UUID]bool{baseCourse.ID: true}
		for _, c := range related {
			seenIDs[c.ID] = true
		}

		var byInstructor []models.Course
		mh.db.Preload("Instructor").Where("instructor_id = ? AND status = ? AND id != ?", baseCourse.InstructorID, "published", baseCourse.ID).
			Order("created_at DESC").Limit(6).Find(&byInstructor)

		for _, c := range byInstructor {
			if !seenIDs[c.ID] {
				related = append(related, c)
				seenIDs[c.ID] = true
			}
			if len(related) >= 6 {
				break
			}
		}
	}

	// Cap at 6
	if len(related) > 6 {
		related = related[:6]
	}

	result := make([]service.CourseListResponse, 0, len(related))
	for _, c := range related {
		result = append(result, service.CourseToListResponse(&c))
	}

	response.Success(c, http.StatusOK, result)
}

// ListTestSeries returns a paginated list of published test series.
// GET /api/v1/marketing/test-series
// Query params: page (default 1), limit (default 12, max 100), search
func (mh *MarketingHandler) ListTestSeries(c *gin.Context) {
	page, limit := marketingParsePagination(c)
	search := c.Query("search")

	if search != "" {
		series, _, err := mh.testSeriesService.SearchTestSeries(search, page, limit)
		if err != nil {
			log.Printf("[Marketing] Failed to search test series: %v", err)
			response.InternalServerError(c, "Failed to search test series")
			return
		}
		// Filter to published only
		var published []service.TestSeriesListResponse
		for _, s := range series {
			if s.IsPublished {
				published = append(published, s)
			}
		}
		if published == nil {
			published = []service.TestSeriesListResponse{}
		}
		response.SuccessPaginated(c, http.StatusOK, published, response.Pagination{
			Page:       page,
			Limit:      limit,
			Total:      int64(len(published)),
			TotalPages: 1,
		})
		return
	}

	series, total, err := mh.testSeriesService.ListPublishedTestSeries(page, limit)
	if err != nil {
		log.Printf("[Marketing] Failed to list test series: %v", err)
		response.InternalServerError(c, "Failed to retrieve test series")
		return
	}
	if series == nil {
		series = []service.TestSeriesListResponse{}
	}

	totalPages := total / int64(limit)
	if total%int64(limit) != 0 {
		totalPages++
	}

	response.SuccessPaginated(c, http.StatusOK, series, response.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

// GetTestSeries returns a single published test series by slug.
// GET /api/v1/marketing/test-series/:slug
func (mh *MarketingHandler) GetTestSeries(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		response.BadRequest(c, "Test series slug is required")
		return
	}

	series, err := mh.testSeriesService.GetTestSeriesBySlug(slug)
	if err != nil {
		log.Printf("[Marketing] Test series not found: %s - %v", slug, err)
		response.NotFound(c, "Test series not found")
		return
	}

	if !series.IsPublished {
		response.NotFound(c, "Test series not found")
		return
	}

	response.Success(c, http.StatusOK, series)
}

// CategoryResponse is the public response shape for a course category.
type CategoryResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description *string   `json:"description,omitempty"`
	ThumbnailURL *string  `json:"thumbnail_url,omitempty"`
	CourseCount int64     `json:"course_count"`
}

// ListCategories returns active course categories with their published course counts.
// GET /api/v1/marketing/categories
func (mh *MarketingHandler) ListCategories(c *gin.Context) {
	var categories []models.Category
	if err := mh.db.
		Where("is_active = ?", true).
		Order("order_index ASC, name ASC").
		Find(&categories).Error; err != nil {
		log.Printf("[Marketing] Failed to list categories: %v", err)
		response.InternalServerError(c, "Failed to retrieve categories")
		return
	}

	result := make([]CategoryResponse, 0, len(categories))
	for _, cat := range categories {
		var count int64
		mh.db.Model(&models.Course{}).
			Where("category_id = ? AND status = ?", cat.ID, "published").
			Count(&count)
		result = append(result, CategoryResponse{
			ID:           cat.ID,
			Name:         cat.Name,
			Slug:         cat.Slug,
			Description:  cat.Description,
			ThumbnailURL: cat.ThumbnailURL,
			CourseCount:  count,
		})
	}

	response.Success(c, http.StatusOK, result)
}

// PublicInstructorResponse is the public-safe shape for an instructor profile.
type PublicInstructorResponse struct {
	ID                uuid.UUID `json:"id"`
	FirstName         string    `json:"first_name"`
	LastName          string    `json:"last_name"`
	ProfilePictureURL string    `json:"profile_picture_url,omitempty"`
	Role              string    `json:"role"`
}

// ListInstructors returns a paginated list of faculty instructors.
// GET /api/v1/marketing/instructors
// Query params: page (default 1), limit (default 12, max 100)
func (mh *MarketingHandler) ListInstructors(c *gin.Context) {
	page, limit := marketingParsePagination(c)

	instructors, total, err := mh.userService.ListUsersByRole("faculty", page, limit)
	if err != nil {
		log.Printf("[Marketing] Failed to list instructors: %v", err)
		response.InternalServerError(c, "Failed to retrieve instructors")
		return
	}

	// Map to public-safe response (omit email, phone, profile picture is not in list response)
	public := make([]PublicInstructorResponse, 0, len(instructors))
	for _, u := range instructors {
		public = append(public, PublicInstructorResponse{
			ID:        u.ID,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Role:      u.Role,
		})
	}

	totalPages := total / int64(limit)
	if total%int64(limit) != 0 {
		totalPages++
	}

	response.SuccessPaginated(c, http.StatusOK, public, response.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	})
}

// GetInstructor returns a public instructor profile with their published courses.
// GET /api/v1/marketing/instructors/:id
func (mh *MarketingHandler) GetInstructor(c *gin.Context) {
	idStr := c.Param("id")
	instructorID, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid instructor ID format")
		return
	}

	instructor, err := mh.userService.GetUserByID(instructorID)
	if err != nil {
		response.NotFound(c, "Instructor not found")
		return
	}

	if instructor.Role != "faculty" && instructor.Role != "admin" {
		response.NotFound(c, "Instructor not found")
		return
	}

	courses, total, err := mh.courseService.ListInstructorCourses(instructorID, 1, 20)
	if err != nil {
		log.Printf("[Marketing] Failed to get instructor courses for %s: %v", instructorID, err)
		courses = []service.CourseListResponse{}
		total = 0
	}
	if courses == nil {
		courses = []service.CourseListResponse{}
	}

	profile := PublicInstructorResponse{
		ID:                instructor.ID,
		FirstName:         instructor.FirstName,
		LastName:          instructor.LastName,
		ProfilePictureURL: instructor.ProfilePictureURL,
		Role:              instructor.Role,
	}

	response.Success(c, http.StatusOK, gin.H{
		"instructor":   profile,
		"courses":      courses,
		"course_count": total,
	})
}

// MarketingStats holds public-facing site statistics.
type MarketingStats struct {
	PublishedCourses    int64 `json:"published_courses"`
	PublishedTestSeries int64 `json:"published_test_series"`
	Students            int64 `json:"students"`
	Instructors         int64 `json:"instructors"`
}

// GetStats returns public site-wide summary statistics.
// GET /api/v1/marketing/stats
func (mh *MarketingHandler) GetStats(c *gin.Context) {
	var publishedCourses int64
	mh.db.Model(&models.Course{}).Where("status = ?", "published").Count(&publishedCourses)

	var publishedTests int64
	mh.db.Model(&models.TestSeries{}).Where("is_published = ?", true).Count(&publishedTests)

	var students int64
	mh.db.Model(&models.User{}).Where("role = ? AND is_active = ?", "student", true).Count(&students)

	var instructors int64
	mh.db.Model(&models.User{}).Where("role = ? AND is_active = ?", "faculty", true).Count(&instructors)

	response.Success(c, http.StatusOK, MarketingStats{
		PublishedCourses:    publishedCourses,
		PublishedTestSeries: publishedTests,
		Students:            students,
		Instructors:         instructors,
	})
}

// GetCoursePackages returns active pricing packages for a course by slug or ID.
// GET /api/v1/marketing/courses/:slug/packages
func (mh *MarketingHandler) GetCoursePackages(c *gin.Context) {
	param := c.Param("slug")

	var packages []service.CoursePackageResponse
	var err error

	// Try to parse as UUID first
	if courseID, parseErr := uuid.Parse(param); parseErr == nil {
		packages, err = mh.packageService.GetPackagesByCourseID(courseID, true)
	} else {
		packages, err = mh.packageService.GetPackagesByCourseSlug(param)
	}

	if err != nil {
		log.Printf("[Marketing] Failed to get packages for course %s: %v", param, err)
		response.InternalServerError(c, "Failed to retrieve course packages")
		return
	}

	response.Success(c, http.StatusOK, packages)
}

// marketingParsePagination extracts page/limit from query params with safe defaults.
func marketingParsePagination(c *gin.Context) (int, int) {
	page := 1
	if p := c.Query("page"); p != "" {
		if n, err := strconv.Atoi(p); err == nil && n > 0 {
			page = n
		}
	}

	limit := 12
	if l := c.Query("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}

	return page, limit
}
