import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Badge } from "@flcn-lms/ui/components/badge"

// TODO: Replace with actual API call to fetch test series
async function getTestSeries(slug: string, tenantSlug: string) {
  // Example API call - update with your actual endpoint
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantSlug}/test-series/${slug}`,
  //   { revalidate: 3600 }
  // )
  // if (!response.ok) return null
  // return response.json()

  // Mock data for demonstration
  const mockData: Record<string, any> = {
    "mock-series": {
      id: "series-1",
      slug: "mock-series",
      title: "NEET Biology Master Series",
      description:
        "Comprehensive test series covering all chapters of NEET Biology with detailed solutions and expert analysis.",
      longDescription:
        "This advanced test series is designed to help students master NEET Biology. Each test is carefully crafted by expert educators to cover all important concepts and practice patterns from previous years.",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=400&fit=crop",
      category: "Medical Entrance",
      difficulty: "Advanced",
      totalTests: 15,
      estimatedHours: 45,
      price: 499,
      originalPrice: 799,
      enrolledCount: 1250,
      rating: 4.8,
      reviewCount: 342,
      features: [
        "15 comprehensive full-length tests",
        "Detailed chapter-wise solutions",
        "Performance analytics and insights",
        "Compare with peer performance",
        "Access to live doubt sessions",
        "Lifetime access to test series",
      ],
      tests: [
        {
          id: "test-1",
          title: "Full Length Test 1",
          duration: 180,
          questions: 90,
          status: "available",
        },
        {
          id: "test-2",
          title: "Full Length Test 2",
          duration: 180,
          questions: 90,
          status: "available",
        },
        {
          id: "test-3",
          title: "Full Length Test 3",
          duration: 180,
          questions: 90,
          status: "coming-soon",
        },
      ],
      instructors: [
        {
          id: "instructor-1",
          name: "Dr. Sarah Anderson",
          title: "NEET Biology Expert",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        },
      ],
    },
  }

  return mockData[slug] || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const testSeries = await getTestSeries(slug, "default")

  if (!testSeries) {
    return { title: "Test Series Not Found" }
  }

  return {
    title: testSeries.title,
    description: testSeries.description,
    openGraph: {
      title: testSeries.title,
      description: testSeries.description,
      images: [testSeries.image],
    },
  }
}

export default async function TestSeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string; tenantSlug: string }>
}) {
  const { slug, tenantSlug } = await params
  const testSeries = await getTestSeries(slug, tenantSlug)

  if (!testSeries) {
    notFound()
  }

  const discount = Math.round(
    ((testSeries.originalPrice - testSeries.price) / testSeries.originalPrice) *
      100
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        <div className="container relative z-10 flex items-center justify-between py-12">
          <div className="max-w-2xl">
            <Badge className="mb-4" variant="secondary">
              {testSeries.category}
            </Badge>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">
              {testSeries.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {testSeries.description}
            </p>

            {/* Rating and Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="font-semibold text-foreground">
                  {testSeries.rating}
                </span>
                <span className="ml-1 text-muted-foreground">
                  ({testSeries.reviewCount} reviews)
                </span>
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {testSeries.enrolledCount.toLocaleString()}
                </span>
                <span className="ml-1 text-muted-foreground">students enrolled</span>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <Card className="h-fit w-full max-w-sm p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">
                    ₹{testSeries.price}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{testSeries.originalPrice}
                  </span>
                  <Badge variant="destructive">{discount}% OFF</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Limited time offer
                </p>
              </div>

              <div className="space-y-2 border-y py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tests</span>
                  <span className="font-semibold">{testSeries.totalTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold">
                    ~{testSeries.estimatedHours} hours
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="outline">{testSeries.difficulty}</Badge>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Enroll Now
              </Button>
              <Button className="w-full" variant="outline">
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Long Description */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About This Series
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {testSeries.longDescription}
              </p>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What You'll Get
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {testSeries.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        ✓
                      </span>
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tests in Series */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tests in This Series
              </h2>
              <div className="space-y-3">
                {testSeries.tests.map((test: any, idx: number) => (
                  <Card key={test.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Test {idx + 1}: {test.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {test.duration} min • {test.questions} questions
                        </p>
                      </div>
                      {test.status === "available" ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/${tenantSlug}/test/${test.id}`}>
                            Attempt
                          </Link>
                        </Button>
                      ) : (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Instructors */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Expert Instructors
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {testSeries.instructors.map((instructor: any) => (
                  <Card key={instructor.id} className="p-6 text-center">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="mb-4 h-24 w-24 rounded-full object-cover mx-auto"
                    />
                    <h3 className="font-semibold text-foreground">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {instructor.title}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Sticky Card */}
            <Card className="sticky top-4 p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Quick Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tests</span>
                    <span className="font-semibold">{testSeries.totalTests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hours</span>
                    <span className="font-semibold">
                      ~{testSeries.estimatedHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-semibold">{testSeries.difficulty}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Enroll Now - ₹{testSeries.price}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                30-day money-back guarantee
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
