/**
 * Panel fetchers — authenticated student endpoints.
 * All functions here require a valid JWT in the Authorization header.
 * Used in the /panel/* routes of lms-web.
 */

import { fetcher } from "@/lib/fetcher"

// ---------------------------------------------------------------------------
// Envelope types
// ---------------------------------------------------------------------------

interface ApiResponse<T> {
  success: boolean
  data: T
  code: number
  timestamp: string
}

interface PaginatedData<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

function unwrap<T>(res: ApiResponse<T>): T {
  return res.data
}

// ---------------------------------------------------------------------------
// Lesson Notes
// ---------------------------------------------------------------------------

export interface LessonNote {
  id: string
  student_id: string
  lesson_id: string
  content: string
  /** Seconds from video start — null for general (non-timestamped) notes */
  timestamp_seconds: number | null
  created_at: string
  updated_at: string
}

export interface CreateNoteInput {
  content: string
  timestamp_seconds?: number
}

export interface UpdateNoteInput {
  content?: string
  timestamp_seconds?: number
}

/**
 * Get all notes for the authenticated student on a specific lesson.
 * Results are sorted by timestamp then creation time.
 * GET /api/v1/lessons/:lessonId/notes
 */
export async function getLessonNotes(
  lessonId: string,
  token: string
): Promise<LessonNote[]> {
  const res = await fetcher<ApiResponse<LessonNote[]>>(
    `/api/v1/lessons/${lessonId}/notes`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
  return unwrap(res) ?? []
}

/**
 * Create a note for a lesson.
 * POST /api/v1/lessons/:lessonId/notes
 */
export async function createLessonNote(
  lessonId: string,
  input: CreateNoteInput,
  token: string
): Promise<LessonNote> {
  const res = await fetcher<ApiResponse<LessonNote>>(
    `/api/v1/lessons/${lessonId}/notes`,
    {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )
  return unwrap(res)
}

/**
 * Get all notes for the authenticated student across all lessons.
 * GET /api/v1/my/notes
 */
export async function getMyNotes(
  token: string,
  page = 1,
  limit = 20
): Promise<PaginatedData<LessonNote>> {
  const res = await fetcher<ApiResponse<PaginatedData<LessonNote>>>(
    `/api/v1/my/notes?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
  return unwrap(res)
}

/**
 * Update a note's content or timestamp.
 * PATCH /api/v1/notes/:noteId
 */
export async function updateLessonNote(
  noteId: string,
  input: UpdateNoteInput,
  token: string
): Promise<LessonNote> {
  const res = await fetcher<ApiResponse<LessonNote>>(
    `/api/v1/notes/${noteId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )
  return unwrap(res)
}

/**
 * Delete a note.
 * DELETE /api/v1/notes/:noteId
 */
export async function deleteLessonNote(
  noteId: string,
  token: string
): Promise<void> {
  await fetcher<unknown>(
    `/api/v1/notes/${noteId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
}

// ---------------------------------------------------------------------------
// Purchase History
// ---------------------------------------------------------------------------

export interface OrderSummary {
  id: string
  course_id: string
  package_id?: string
  original_price: number
  discount_amount: number
  final_amount: number
  status: string
  payment_provider?: string
  paid_at?: string
  created_at: string
  course?: { id: string; title: string; slug: string; thumbnail_url: string }
  package?: { id: string; name: string; validity_days: number }
}

/**
 * Get the authenticated student's order history.
 * GET /api/v1/my/orders
 */
export async function getMyOrders(
  token: string,
  page = 1,
  limit = 10
): Promise<PaginatedData<OrderSummary>> {
  const res = await fetcher<ApiResponse<PaginatedData<OrderSummary>>>(
    `/api/v1/my/orders?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
  return unwrap(res)
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export interface SubscriptionSummary {
  id: string
  student_id: string
  course_id: string
  package_id?: string
  order_id: string
  status: "active" | "expired" | "cancelled"
  starts_at: string
  expires_at?: string
  course?: { id: string; title: string; slug: string; thumbnail_url: string }
  package?: { id: string; name: string; validity_days: number }
}

/**
 * Get the authenticated student's subscriptions.
 * GET /api/v1/my/subscriptions
 */
export async function getMySubscriptions(
  token: string,
  page = 1,
  limit = 10
): Promise<PaginatedData<SubscriptionSummary>> {
  const res = await fetcher<ApiResponse<PaginatedData<SubscriptionSummary>>>(
    `/api/v1/my/subscriptions?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
  return unwrap(res)
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export interface InvoiceLineItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface InvoiceSummary {
  id: string
  invoice_number: string
  student_id: string
  order_id: string
  line_items: InvoiceLineItem[]
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  status: string
  issued_at: string
}

/**
 * Get the authenticated student's invoices.
 * GET /api/v1/my/invoices
 */
export async function getMyInvoices(
  token: string,
  page = 1,
  limit = 10
): Promise<PaginatedData<InvoiceSummary>> {
  const res = await fetcher<ApiResponse<PaginatedData<InvoiceSummary>>>(
    `/api/v1/my/invoices?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  )
  return unwrap(res)
}
