import { fetcher } from "@/lib/fetcher"

// Types
export interface OrderItem {
  course_id?: string
  test_series_id?: string
  quantity: number
  price: number
}

export interface CreateOrderRequest {
  items: OrderItem[]
  coupon_code?: string
  user_id: string
}

export interface OrderResponse {
  id: string
  user_id: string
  status: string
  subtotal: number
  discount: number
  total: number
  coupon_id?: string
  items: Array<{
    id: string
    course_id?: string
    test_series_id?: string
    price: number
    quantity: number
  }>
  created_at: string
  updated_at: string
}

export interface CouponValidationRequest {
  code: string
  order_value: number
}

export interface CouponValidationResponse {
  coupon_id: string
  code: string
  discount_type: string
  discount_value: number
  discount: number
  final_price: number
  message: string
}

// Create a new order
export async function createOrder(
  req: CreateOrderRequest
): Promise<OrderResponse> {
  const response = await fetcher<OrderResponse>(
    "/api/v1/orders",
    {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  return response
}

// Get user's orders
export async function getUserOrders(): Promise<OrderResponse[]> {
  const response = await fetcher<OrderResponse[]>(
    "/api/v1/my/orders",
    { next: { tags: ["user-orders"], revalidate: 300 } }
  )
  return response
}

// Get order by ID
export async function getOrder(id: string): Promise<OrderResponse> {
  const response = await fetcher<OrderResponse>(
    `/api/v1/orders/${id}`,
    { next: { tags: [`order:${id}`], revalidate: 300 } }
  )
  return response
}

// Validate coupon code
export async function validateCoupon(
  req: CouponValidationRequest
): Promise<CouponValidationResponse> {
  const response = await fetcher<CouponValidationResponse>(
    "/api/v1/coupons/validate",
    {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  return response
}
