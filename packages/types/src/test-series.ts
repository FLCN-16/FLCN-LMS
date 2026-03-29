export type TestType = 'FULL_LENGTH' | 'SECTIONAL' | 'CHAPTER_WISE' | 'DPP' | 'PREVIOUS_YEAR'
export type ResultMode = 'INSTANT' | 'AFTER_END_DATE' | 'MANUAL'

export interface TestSeries {
  id: string
  tenantId?: string
  slug: string
  title: string
  description?: string
  examType: string
  thumbnail?: string
  isPaid: boolean
  price?: number
  totalTests: number
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
