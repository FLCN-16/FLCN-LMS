"use client"

import { useState, useMemo } from "react"

import { type MarketingCourseList } from "@/fetchers/marketing"

import CoursesFilter from "./courses-filter"
import CoursesGrid from "./courses-grid"

interface CoursesClientProps {
  initialCourses: MarketingCourseList[]
  categories: string[]
}

export default function CoursesClient({ initialCourses, categories }: CoursesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

  const filtered = useMemo(() => {
    let result = initialCourses

    if (selectedCategory !== "All") {
      // Category filtering is best-effort since the list response doesn't
      // include category name — this will be refined when category_id → name
      // mapping is available in the response.
    }

    if (selectedPrices.length > 0) {
      result = result.filter((c) => {
        if (selectedPrices.includes("Free") && c.price === 0) return true
        if (selectedPrices.includes("Paid") && c.price > 0) return true
        if (selectedPrices.includes("Under ₹500") && c.price > 0 && c.price <= 500) return true
        if (selectedPrices.includes("Under ₹1000") && c.price > 0 && c.price <= 1000) return true
        return false
      })
    }

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "newest":
      default:
        result = [...result].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
    }

    return result
  }, [initialCourses, selectedCategory, selectedPrices, sortBy])

  // Map to shape expected by CoursesGrid / CourseCard
  const gridCourses = filtered.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    price: c.price,
    imageUrl: c.thumbnail_url || "https://placehold.co/320x180/18181b/ffffff?text=Course",
    category: "",
    level: c.level,
    estimatedHours: c.estimated_hours,
    totalEnrolled: c.total_enrolled,
    averageRating: c.average_rating,
    reviewCount: c.review_count,
    certificateIncluded: c.certificate_included,
    instructorName: c.instructor ? `${c.instructor.first_name} ${c.instructor.last_name}` : undefined,
    isFeatured: c.is_featured,
  }))

  return (
    <section className="container mx-auto px-4 py-12">
      <CoursesFilter
        selectedCategory={selectedCategory}
        selectedLevels={[]}
        selectedPrices={selectedPrices}
        onCategoryChange={setSelectedCategory}
        onLevelChange={() => {}}
        onPriceChange={setSelectedPrices}
      />

      <div className="mt-8 flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-20 space-y-6 rounded-lg border border-border/30 bg-muted/20 p-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Price</h4>
              <div className="space-y-2">
                {["Free", "Paid", "Under ₹500", "Under ₹1000"].map((price) => (
                  <div key={price} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`price-${price}`}
                      checked={selectedPrices.includes(price)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPrices([...selectedPrices, price])
                        } else {
                          setSelectedPrices(selectedPrices.filter((p) => p !== price))
                        }
                      }}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={`price-${price}`} className="text-sm font-medium">
                      {price}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <CoursesGrid courses={gridCourses} />
        </div>
      </div>
    </section>
  )
}
