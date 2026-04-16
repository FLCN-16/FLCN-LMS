"use client"

import { useState, useMemo } from "react"
import CoursesHeader from "./_components/courses-header"
import CoursesFilter from "./_components/courses-filter"
import CoursesGrid from "./_components/courses-grid"

interface Course {
  id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  imageUrl: string
  category: string
  level: string
  rating?: number
  students?: number
}

// Rich mock data with varied courses
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Advanced React & Next.js with Modern Web Development",
    slug: "advanced-react-nextjs",
    price: 4999,
    discountPrice: 2999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Technology",
    level: "Advanced",
    rating: 4.8,
    students: 12500,
  },
  {
    id: "2",
    title: "Python for Data Science & Machine Learning",
    slug: "python-data-science",
    price: 3999,
    discountPrice: 1999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Technology",
    level: "Intermediate",
    rating: 4.9,
    students: 28000,
  },
  {
    id: "3",
    title: "Financial Markets & Investment Analysis",
    slug: "financial-markets",
    price: 5999,
    discountPrice: 3999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Finance",
    level: "Intermediate",
    rating: 4.7,
    students: 8500,
  },
  {
    id: "4",
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design",
    price: 2999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Design",
    level: "Beginner",
    rating: 4.9,
    students: 15000,
  },
  {
    id: "5",
    title: "Digital Marketing Strategy & SEO",
    slug: "digital-marketing-seo",
    price: 2499,
    discountPrice: 999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Marketing",
    level: "Beginner",
    rating: 4.6,
    students: 22000,
  },
  {
    id: "6",
    title: "Biology & Human Physiology",
    slug: "biology-physiology",
    price: 0,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Science",
    level: "Beginner",
    rating: 4.5,
    students: 5000,
  },
  {
    id: "7",
    title: "Spanish Language Fundamentals",
    slug: "spanish-language",
    price: 1999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Language",
    level: "Beginner",
    rating: 4.8,
    students: 18000,
  },
  {
    id: "8",
    title: "Web Development Bootcamp",
    slug: "web-dev-bootcamp",
    price: 7999,
    discountPrice: 4999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Technology",
    level: "Beginner",
    rating: 4.9,
    students: 35000,
  },
  {
    id: "9",
    title: "Graphic Design & Branding",
    slug: "graphic-design-branding",
    price: 3499,
    discountPrice: 1999,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Design",
    level: "Intermediate",
    rating: 4.7,
    students: 9500,
  },
  {
    id: "10",
    title: "Cryptocurrency & Blockchain Basics",
    slug: "crypto-blockchain",
    price: 4499,
    imageUrl:
      "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    category: "Finance",
    level: "Advanced",
    rating: 4.6,
    students: 6000,
  },
]

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = MOCK_COURSES

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    // Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter((c) => selectedLevels.includes(c.level))
    }

    // Price filter
    if (selectedPrices.length > 0) {
      filtered = filtered.filter((c) => {
        if (selectedPrices.includes("Free") && c.price === 0) return true
        if (selectedPrices.includes("Paid") && c.price > 0) return true
        if (selectedPrices.includes("Under ₹500") && c.price > 0 && c.price <= 50000)
          return true
        if (selectedPrices.includes("Under ₹1000") && c.price > 0 && c.price <= 100000)
          return true
        return false
      })
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.students || 0) - (a.students || 0))
        break
      case "price-low":
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
        break
      case "price-high":
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // newest - keep original order
        break
    }

    return filtered
  }, [selectedCategory, selectedLevels, selectedPrices, sortBy])

  return (
    <main className="flex flex-col">
      <CoursesHeader />

      <section className="container mx-auto px-4 py-12">
        {/* Category tabs and active filters */}
        <CoursesFilter
          selectedCategory={selectedCategory}
          selectedLevels={selectedLevels}
          selectedPrices={selectedPrices}
          onCategoryChange={setSelectedCategory}
          onLevelChange={setSelectedLevels}
          onPriceChange={setSelectedPrices}
        />

        {/* Two-column layout: sidebar + grid */}
        <div className="mt-8 flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-20 space-y-6 rounded-lg border border-border/30 bg-muted/20 p-6">
              {/* Sort */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Level */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Level</h4>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`level-${level}`}
                        checked={selectedLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLevels([...selectedLevels, level])
                          } else {
                            setSelectedLevels(selectedLevels.filter((l) => l !== level))
                          }
                        }}
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor={`level-${level}`} className="text-sm font-medium">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
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

          {/* Grid component - displays filtered courses */}
          <div className="flex-1">
            <CoursesGrid courses={filteredCourses} />
          </div>
        </div>
      </section>
    </main>
  )
}
