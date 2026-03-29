export type QuestionType = 'MCQ' | 'MSQ' | 'INTEGER' | 'SUBJECTIVE'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface QuestionOption {
  id: string
  questionId?: string
  content: string
  isCorrect: boolean
  order: number
  imageUrl?: string
}

export interface Question {
  id: string
  tenantId?: string
  type: QuestionType
  subject: string
  topic: string
  subtopic?: string
  difficulty: Difficulty
  content: string
  explanation?: string
  imageUrl?: string
  positiveMarks: number
  negativeMarks: number
  correctInteger?: number
  createdBy?: string
  isApproved: boolean
  createdAt: string
  options: QuestionOption[]
}

export interface CreateQuestionPayload {
  type: QuestionType
  subject: string
  topic: string
  subtopic?: string
  difficulty: Difficulty
  content: string
  explanation?: string
  imageUrl?: string
  positiveMarks?: number
  negativeMarks?: number
  correctInteger?: number
  options: Omit<QuestionOption, 'id' | 'questionId'>[]
}
