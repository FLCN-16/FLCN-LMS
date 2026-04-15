export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactSubmissionResponse {
  id: string
  status: "sent" | "pending"
  receivedAt: string
}
