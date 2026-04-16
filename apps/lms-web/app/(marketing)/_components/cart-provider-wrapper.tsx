import { ReactNode } from "react"
import { CartProvider } from "@/lib/cart-store"

interface CartProviderWrapperProps {
  children: ReactNode
}

export function CartProviderWrapper({ children }: CartProviderWrapperProps) {
  return <CartProvider>{children}</CartProvider>
}
