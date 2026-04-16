"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"

import { Button } from "@flcn-lms/ui/components/button"
import { useCart, type CartItem } from "@/lib/cart-store"

interface AddToCartButtonProps {
  item: CartItem
  size?: "sm" | "default" | "lg" | "icon"
  variant?: "default" | "outline" | "ghost"
  className?: string
}

function AddToCartButton({
  item,
  size = "default",
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const [isAdded, setIsAdded] = useState(
    items.some((i) => i.id === item.id)
  )

  const handleAddToCart = () => {
    addItem(item)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (isAdded) {
    return (
      <Button
        size={size}
        variant="default"
        className={className}
        disabled
      >
        <Check className="mr-2 h-4 w-4" />
        Added to Cart
      </Button>
    )
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleAddToCart}
      className={className}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}

export default AddToCartButton
