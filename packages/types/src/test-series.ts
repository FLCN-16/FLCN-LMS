export type CourseStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
export type LessonType = "VIDEO" | "LIVE" | "PDF" | "QUIZ" | "DPP" | "TEXT"

export type TestType =
  | "FULL_LENGTH"
  | "SECTIONAL"
  | "CHAPTER_WISE"
  | "DPP"
  | "PREVIOUS_YEAR"

export type ResultMode = "INSTANT" | "AFTER_END_DATE" | "MANUAL"

export interface CourseModuleLessonAttachment {
  name: string
  url: string
}

export interface CourseLesson {
  id: string
  moduleId: string
  slug: string
  title: string
  type: LessonType
  videoUrl?: string
  videoDurationSecs?: number
  pdfUrl?: string
  textContent?: string
  liveSessionId?: string
  isFree: boolean
  order: number
  thumbnailUrl?: string
  attachments?: CourseModuleLessonAttachment[]
  createdAt: string
}

export interface CourseModule {
  id: string
  courseId: string
  slug: string
  title: string
  description?: string
  order: number
  isFree: boolean
  lessons?: CourseLesson[]
}

export interface CourseEnrollment {
  id: string
  courseId: string
  userId: string
  enrolledAt: string
  expiresAt?: string
  paymentId?: string
  progressPercent: number
}

export interface LessonProgress {
  id: string
  enrollmentId: string
  lessonId: string
  isCompleted: boolean
  watchedSecs: number
  completedAt?: string
  updatedAt: string
}

export interface CourseMetadata {
  id: string
  instituteId?: string
  categoryId: string
  instructorId: string
  slug: string
  title: string
  description?: string
  thumbnailUrl?: string
  trailerUrl?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  seoImageUrl?: string
  status: CourseStatus
  isPaid: boolean
  price?: number
  discountPrice?: number
  validityDays?: number
  highlights?: string[]
  totalStudents: number
  totalLessons: number
  rating: number
  createdAt: string
  updatedAt: string
  modules?: CourseModule[]
}

export interface TestSeries {
  id: string
  instituteId?: string
  slug: string
  title: string
  description?: string
  examType: string
  thumbnail?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  seoImageUrl?: string
  isPaid: boolean
  price?: number
  totalTests: number
  testCount?: number // alias for totalTests for UI consistency
  totalQuestions?: number
  category?: string
  validTill?: string
  isPublished: boolean
  createdBy?: string
  createdAt: string
}

export interface TestSection {
  id: string
  testId: string
  title: string
  description?: string
  order: number
  totalQuestions: number
  maxAttemptable?: number
  durationMins?: number
}

export interface Test {
  id: string
  testSeriesId: string
  slug: string
  title: string
  description?: string
  testType: TestType
  durationMins: number
  totalMarks: number
  totalQuestions: number
  instructions?: string
  scheduledAt?: string
  endsAt?: string
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  showResultAfter: ResultMode
  attemptLimit: number
  isPublished: boolean
  order: number
  createdAt: string
  sections?: TestSection[]
}

export interface TestSeriesEnrollment {
  id: string
  testSeriesId: string
  userId: string
  enrolledAt: string
  expiresAt?: string
  paymentId?: string
}

export interface CreateTestSeriesPayload {
  slug: string
  title: string
  description?: string
  examType: string
  isPaid?: boolean
  price?: number
  validTill?: string
  thumbnail?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  seoImageUrl?: string
}

export interface CreateTestSectionPayload {
  title: string
  description?: string
  order: number
  totalQuestions: number
  maxAttemptable?: number
  durationMins?: number
  questionIds?: string[]
}

export interface CreateTestPayload {
  slug: string
  title: string
  description?: string
  testType: TestType
  durationMins: number
  totalMarks: number
  totalQuestions: number
  order: number
  instructions?: string
  scheduledAt?: string
  endsAt?: string
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  attemptLimit?: number
  showResultAfter?: ResultMode
  sections?: CreateTestSectionPayload[]
}
