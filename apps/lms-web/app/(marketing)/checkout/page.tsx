import dynamic from "next/dynamic"

import { CartProvider } from "@/lib/cart-store"
import {
  getMarketingCourse,
  getMarketingCoursePackages,
  getMarketingCourses,
  type MarketingCourseDetail,
  type CoursePackage,
  type MarketingCourseList,
} from "@/fetchers/marketing"
import { getProfile } from "@/fetchers/user"

const UpsellCourses = dynamic(
  () => import("./_components/upsell-courses"),
  {
    loading: () => <div className="h-80 bg-muted/20 animate-pulse rounded-lg" />,
  }
)

const CheckoutPackages = dynamic(
  () => import("./_components/checkout-packages"),
  {
    loading: () => <div className="h-32 bg-muted/20 animate-pulse rounded-lg" />,
  }
)

const CheckoutTotals = dynamic(
  () => import("./_components/checkout-totals"),
  {
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />,
  }
)

const CheckoutUserDetails = dynamic(
  () => import("./_components/checkout-user-details"),
  {
    loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-lg" />,
  }
)

interface CheckoutPageProps {
  searchParams: Promise<{ courseId?: string }>
}

async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { courseId } = await searchParams
  let course: MarketingCourseDetail | null = null
  let packages: CoursePackage[] = []
  let upsellCourses: MarketingCourseList[] = []
  let isAuthenticated = false

  if (courseId) {
    try {
      course = await getMarketingCourse(courseId)
      packages = await getMarketingCoursePackages(courseId)
    } catch (error) {
      console.error("Failed to load course or packages:", error)
    }
  }

  // Fetch upselling courses (featured or all courses)
  try {
    const result = await getMarketingCourses({ limit: 6 })
    upsellCourses = result.data
  } catch (error) {
    console.error("Failed to load upselling courses:", error)
  }

  try {
    await getProfile()
    isAuthenticated = true
  } catch (error) {
    isAuthenticated = false
  }

  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <div className="container grid gap-8 px-4 py-12 md:grid-cols-3">
          {/* Left Column - Order Items */}
          <div className="space-y-6 md:col-span-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
              <p className="mt-2 text-muted-foreground">
                Review your items and complete your purchase
              </p>
            </div>

            {/* Checkout Sections */}
            <div className="space-y-6">
              <CheckoutUserDetails />
              {course && packages.length > 0 && (
                <CheckoutPackages course={course} packages={packages} />
              )}
              {upsellCourses.length > 0 && (
                <UpsellCourses courses={upsellCourses} />
              )}
            </div>
          </div>

          {/* Right Column - Summary & Totals */}
          <div>
            <div className="sticky top-6">
              <CheckoutTotals isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </main>
    </CartProvider>
  )
}

export default CheckoutPage
