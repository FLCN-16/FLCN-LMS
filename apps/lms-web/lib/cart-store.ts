"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export interface CartItem {
  id: string
  type: "course" | "test_series"
  title: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartContextType {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCoupon: (code: string | null, discount: number) => void
  getSubtotal: () => number
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const getTotal = useCallback(() => {
    return Math.max(0, getSubtotal() - couponDiscount)
  }, [getSubtotal, couponDiscount])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode(null)
    setCouponDiscount(0)
  }, [])

  const setCoupon = useCallback((code: string | null, discount: number) => {
    setCouponCode(code)
    setCouponDiscount(discount)
  }, [])

  const value: CartContextType = {
    items,
    couponCode,
    couponDiscount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCoupon,
    getSubtotal,
    getTotal,
  }

  return React.createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
