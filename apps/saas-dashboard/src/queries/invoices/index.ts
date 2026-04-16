import { createMutation, createQuery } from "react-query-kit"
import fetch from "@/lib/fetch"

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: string
  paidAt?: string
  issuedAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceInput {
  customerId: string
  amount: number
  currency: string
  dueDate?: string
  items?: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
}

export interface UpdateInvoiceInput {
  status?: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate?: string
}

export interface InvoiceStats {
  total: number
  paid: number
  overdue: number
  pending: number
  totalAmount: number
}

// Query: Get all invoices
export const useInvoices = createQuery<Invoice[]>({
  queryKey: ["invoices"],
  fetcher: async () => {
    const response = await fetch.get<Invoice[]>("/v1/invoices")
    return response.data
  },
})

// Query: Get single invoice
export const useInvoice = createQuery<Invoice, { id: string }>({
  queryKey: ["invoices", "detail"],
  fetcher: async ({ id }) => {
    const response = await fetch.get<Invoice>(`/v1/invoices/${id}`)
    return response.data
  },
})

// Query: Get invoice stats
export const useInvoiceStats = createQuery<InvoiceStats>({
  queryKey: ["invoices", "stats"],
  fetcher: async () => {
    const response = await fetch.get<InvoiceStats>("/v1/invoices/stats")
    return response.data
  },
})

// Mutation: Create invoice
export const useCreateInvoice = createMutation({
  mutationFn: async (data: CreateInvoiceInput) => {
    const response = await fetch.post<Invoice>("/v1/invoices", data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["invoices"] }
  },
})

// Mutation: Update invoice
export const useUpdateInvoice = createMutation({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string
    data: UpdateInvoiceInput
  }) => {
    const response = await fetch.patch<Invoice>(`/v1/invoices/${id}`, data)
    return response.data
  },
  onSuccess: () => {
    return { id: ["invoices"] }
  },
})

// Mutation: Mark invoice as paid
export const useMarkInvoicePaid = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.post<Invoice>(
      `/v1/invoices/${id}/mark-paid`,
      {}
    )
    return response.data
  },
  onSuccess: () => {
    return { id: ["invoices"] }
  },
})

// Mutation: Cancel invoice
export const useCancelInvoice = createMutation({
  mutationFn: async (id: string) => {
    const response = await fetch.delete<Invoice>(`/v1/invoices/${id}/cancel`)
    return response.data
  },
  onSuccess: () => {
    return { id: ["invoices"] }
  },
})
