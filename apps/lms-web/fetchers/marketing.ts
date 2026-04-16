import { fetcher } from "@/lib/fetcher"

// ---------------------------------------------------------------------------
// Response envelope types
// ---------------------------------------------------------------------------

interface ApiResponse<T> {
  success: boolean
  data: T
  code: number
  timestamp: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  pagination: Pagination
  code: number
  timestamp: string
}

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export interface MarketingCourseList {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string
  price: number
  status: string
  is_featured: boolean
  parent_course_id?: string
  is_bundle: boolean
  // Discovery & SEO
  level?: string
  language?: string
  estimated_hours?: number
  // Social proof
  total_enrolled?: number
  average_rating?: number
  review_count?: number
  // Content
  certificate_included?: boolean
  // Instructor
  instructor?: PublicInstructor
  created_at: string
}

export interface PublicInstructor {
  id: string
  first_name: string
  last_name: string
  profile_picture_url: string
  role: string
}

export interface CourseFAQItem {
  question: string
  answer: string
}

export interface MarketingCourseDetail {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string
  instructor_id: string
  max_students: number
  price: number
  status: string
  is_featured: boolean
  parent_course_id?: string
  is_bundle: boolean
  // Discovery & SEO
  short_description?: string
  language?: string
  level?: string
  tags?: string[]
  // Content metadata
  what_you_learn?: string[]
  requirements?: string[]
  target_audience?: string[]
  highlights?: string[]
  career_outcomes?: string[]
  companies?: string[]
  faq?: Array<{ question: string; answer: string }>
  estimated_hours?: number
  preview_video_url?: string
  certificate_included?: boolean
  last_content_updated_at?: string
  // Social proof
  total_enrolled?: number
  average_rating?: number
  review_count?: number
  created_at: string
  updated_at: string
  instructor?: PublicInstructor
  children?: MarketingCourseList[]
  parent_course?: Pick<MarketingCourseList, "id" | "title" | "slug">
}

export interface CurriculumLesson {
  id: string
  title: string
  duration_seconds: number
  order_index: number
  is_published: boolean
}

export interface CurriculumModule {
  id: string
  title: string
  description: string
  order_index: number
  lesson_count: number
  lessons: CurriculumLesson[]
}

export interface MarketingCategory {
  id: string
  name: string
  slug: string
  description?: string
  thumbnail_url?: string
  course_count: number
}

export interface TestSeriesSection {
  id: string
  test_series_id: string
  title: string
  description: string
  duration_minutes: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface MarketingTestSeriesList {
  id: string
  title: string
  slug: string
  description: string
  total_questions: number
  pricing_type: "free" | "paid"
  price: number
  passing_percentage: number
  is_published: boolean
  created_at: string
}

export interface MarketingTestSeriesDetail extends MarketingTestSeriesList {
  shuffle_questions: boolean
  show_correct_answers: boolean
  sections?: TestSeriesSection[]
  updated_at: string
}

export interface MarketingInstructorDetail {
  instructor: PublicInstructor
  courses: MarketingCourseList[]
  course_count: number
}

export interface MarketingStats {
  published_courses: number
  published_test_series: number
  students: number
  instructors: number
}

export interface PackageFeature {
  title: string
  is_included: boolean
}

export interface CoursePackage {
  id: string
  course_id: string
  name: string
  price: number
  original_price?: number
  validity_days: number
  features: PackageFeature[]
  is_active: boolean
  sort_order: number
}

export interface CoursesListResult {
  data: MarketingCourseList[]
  pagination: Pagination
}

export interface TestSeriesListResult {
  data: MarketingTestSeriesList[]
  pagination: Pagination
}

// ---------------------------------------------------------------------------
// Helper: extract `.data` from the backend response envelope
// ---------------------------------------------------------------------------

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data
}

function unwrapPaginated<T>(
  response: PaginatedApiResponse<T>
): { data: T[]; pagination: Pagination } {
  return { data: response.data, pagination: response.pagination }
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

/**
 * List published courses with optional search, page and limit.
 * GET /api/v1/marketing/courses
 */
export async function getMarketingCourses(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<CoursesListResult> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set("page", String(params.page))
  if (params?.limit) qs.set("limit", String(params.limit))
  if (params?.search) qs.set("search", params.search)

  const response = await fetcher<PaginatedApiResponse<MarketingCourseList>>(
    `/api/v1/marketing/courses${qs.toString() ? `?${qs}` : ""}`,
    { next: { tags: ["marketing-courses"], revalidate: 3600 } }
  )
  return unwrapPaginated(response)
}

/**
 * Get featured courses for the homepage.
 * GET /api/v1/marketing/courses/featured
 */
export async function getFeaturedCourses(limit = 4): Promise<MarketingCourseList[]> {
  const response = await fetcher<ApiResponse<MarketingCourseList[]>>(
    `/api/v1/marketing/courses/featured?limit=${limit}`,
    { next: { tags: ["marketing-featured"], revalidate: 3600 } }
  )
  return unwrap(response)
}

/**
 * Get a single published course detail by slug.
 * GET /api/v1/marketing/courses/:slug
 */
export async function getMarketingCourse(
  slug: string
): Promise<MarketingCourseDetail> {
  const response = await fetcher<ApiResponse<MarketingCourseDetail>>(
    `/api/v1/marketing/courses/${slug}`,
    { next: { tags: [`marketing-course:${slug}`], revalidate: 3600 } }
  )
  return unwrap(response)
}

/**
 * Get the public curriculum (modules + lessons) for a course.
 * GET /api/v1/marketing/courses/:slug/curriculum
 */
export async function getCourseCurriculum(
  slug: string
): Promise<CurriculumModule[]> {
  const response = await fetcher<ApiResponse<CurriculumModule[]>>(
    `/api/v1/marketing/courses/${slug}/curriculum`,
    { next: { tags: [`marketing-curriculum:${slug}`], revalidate: 3600 } }
  )
  return unwrap(response) ?? []
}

/**
 * Get related published courses for a course slug.
 * GET /api/v1/marketing/courses/:slug/related
 */
export async function getRelatedCourses(
  slug: string
): Promise<MarketingCourseList[]> {
  const response = await fetcher<ApiResponse<MarketingCourseList[]>>(
    `/api/v1/marketing/courses/${slug}/related`,
    { next: { tags: [`marketing-related:${slug}`], revalidate: 3600 } }
  )
  return unwrap(response) ?? []
}

// ---------------------------------------------------------------------------
// Test Series
// ---------------------------------------------------------------------------

/**
 * List published test series with optional search, page and limit.
 * GET /api/v1/marketing/test-series
 */
export async function getMarketingTestSeries(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<TestSeriesListResult> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set("page", String(params.page))
  if (params?.limit) qs.set("limit", String(params.limit))
  if (params?.search) qs.set("search", params.search)

  const response = await fetcher<PaginatedApiResponse<MarketingTestSeriesList>>(
    `/api/v1/marketing/test-series${qs.toString() ? `?${qs}` : ""}`,
    { next: { tags: ["marketing-test-series"], revalidate: 3600 } }
  )
  return unwrapPaginated(response)
}

/**
 * Get a single published test series detail by slug.
 * GET /api/v1/marketing/test-series/:slug
 */
export async function getMarketingTestSeriesDetail(
  slug: string
): Promise<MarketingTestSeriesDetail> {
  const response = await fetcher<ApiResponse<MarketingTestSeriesDetail>>(
    `/api/v1/marketing/test-series/${slug}`,
    { next: { tags: [`marketing-test-series:${slug}`], revalidate: 3600 } }
  )
  return unwrap(response)
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/**
 * List active course categories with published course counts.
 * GET /api/v1/marketing/categories
 */
export async function getMarketingCategories(): Promise<MarketingCategory[]> {
  const response = await fetcher<ApiResponse<MarketingCategory[]>>(
    "/api/v1/marketing/categories",
    { next: { tags: ["marketing-categories"], revalidate: 7200 } }
  )
  return unwrap(response) ?? []
}

// ---------------------------------------------------------------------------
// Instructors
// ---------------------------------------------------------------------------

/**
 * List faculty instructors (paginated).
 * GET /api/v1/marketing/instructors
 */
export async function getMarketingInstructors(params?: {
  page?: number
  limit?: number
}): Promise<{ data: PublicInstructor[]; pagination: Pagination }> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set("page", String(params.page))
  if (params?.limit) qs.set("limit", String(params.limit))

  const response = await fetcher<PaginatedApiResponse<PublicInstructor>>(
    `/api/v1/marketing/instructors${qs.toString() ? `?${qs}` : ""}`,
    { next: { tags: ["marketing-instructors"], revalidate: 3600 } }
  )
  return unwrapPaginated(response)
}

/**
 * Get an instructor profile with their courses.
 * GET /api/v1/marketing/instructors/:id
 */
export async function getMarketingInstructor(
  id: string
): Promise<MarketingInstructorDetail> {
  const response = await fetcher<ApiResponse<MarketingInstructorDetail>>(
    `/api/v1/marketing/instructors/${id}`,
    { next: { tags: [`marketing-instructor:${id}`], revalidate: 3600 } }
  )
  return unwrap(response)
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/**
 * Get public site-wide statistics.
 * GET /api/v1/marketing/stats
 */
export async function getMarketingStats(): Promise<MarketingStats> {
  const response = await fetcher<ApiResponse<MarketingStats>>(
    "/api/v1/marketing/stats",
    { next: { tags: ["marketing-stats"], revalidate: 1800 } }
  )
  return unwrap(response)
}

// ---------------------------------------------------------------------------
// Course Packages
// ---------------------------------------------------------------------------

/**
 * Get active pricing packages for a course by slug.
 * GET /api/v1/marketing/courses/:slug/packages
 */
export async function getMarketingCoursePackages(
  slug: string
): Promise<CoursePackage[]> {
  const response = await fetcher<ApiResponse<CoursePackage[]>>(
    `/api/v1/marketing/courses/${slug}/packages`,
    { next: { tags: [`marketing-packages:${slug}`], revalidate: 3600 } }
  )
  return unwrap(response) ?? []
}
