"use client"

import { Cancel01Icon, Filter as FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@flcn-lms/ui/components/badge"
import { Button } from "@flcn-lms/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@flcn-lms/ui/components/sheet"

const CATEGORIES = ["All", "Technology", "Finance", "Design", "Marketing", "Science", "Language"]

interface CoursesFilterProps {
  selectedCategory?: string
  selectedLevels?: string[]
  selectedPrices?: string[]
  onCategoryChange?: (category: string) => void
  onLevelChange?: (levels: string[]) => void
  onPriceChange?: (prices: string[]) => void
  onFilterChange?: (filters: any) => void
}

export default function CoursesFilter({
  selectedCategory = "All",
  selectedLevels = [],
  selectedPrices = [],
  onCategoryChange,
  onLevelChange,
  onPriceChange,
}: CoursesFilterProps) {
  const activeFilters = [
    selectedCategory !== "All" && { key: "category", label: selectedCategory },
    ...selectedLevels.map((level) => ({ key: `level-${level}`, label: level })),
    ...selectedPrices.map((price) => ({ key: `price-${price}`, label: price })),
  ].filter(Boolean) as Array<{ key: string; label: string }>

  const handleRemoveFilter = (key: string) => {
    if (key.startsWith("level-")) {
      const level = key.replace("level-", "")
      onLevelChange?.(selectedLevels.filter((l) => l !== level))
    } else if (key.startsWith("price-")) {
      const price = key.replace("price-", "")
      onPriceChange?.(selectedPrices.filter((p) => p !== price))
    } else if (key === "category") {
      onCategoryChange?.("All")
    }
  }

  return (
    <div className="space-y-6">
      {/* Category tabs - scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange?.(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-accent text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Active filters display + Mobile filter trigger */}
      <div className="flex flex-wrap items-center gap-3">
        {activeFilters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="flex items-center gap-2 pr-1"
          >
            {filter.label}
            <button
              onClick={() => handleRemoveFilter(filter.key)}
              className="ml-1 rounded hover:bg-black/10"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Mobile filter sheet trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 lg:hidden">
              <HugeiconsIcon icon={FilterIcon} className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <div className="mt-8 space-y-6">
              {/* Mobile: Sort */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Sort By</h4>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>Newest</option>
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                </select>
              </div>

              {/* Mobile: Level */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Level</h4>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`mobile-level-${level}`}
                        checked={selectedLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onLevelChange?.([...selectedLevels, level])
                          } else {
                            onLevelChange?.(selectedLevels.filter((l) => l !== level))
                          }
                        }}
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor={`mobile-level-${level}`} className="text-sm font-medium">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: Price */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Price</h4>
                <div className="space-y-2">
                  {["Free", "Paid", "Under ₹500", "Under ₹1000"].map((price) => (
                    <div key={price} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`mobile-price-${price}`}
                        checked={selectedPrices.includes(price)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onPriceChange?.([...selectedPrices, price])
                          } else {
                            onPriceChange?.(selectedPrices.filter((p) => p !== price))
                          }
                        }}
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor={`mobile-price-${price}`} className="text-sm font-medium">
                        {price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
