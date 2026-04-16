import CourseCard from "@/components/card/course"

interface CoursesByCategoryPageParams {
  params: Promise<{ category: string }>
}

async function CoursesByCategoryPage({ params }: CoursesByCategoryPageParams) {
  const { category } = await params

  // Mock courses data - replace with actual data fetching
  const courses = [
    {
      id: "1",
      title: "Financial Markets",
      slug: "financial-markets",
      price: 9999,
      discountPrice: 999,
      imageUrl:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    },
    {
      id: "2",
      title: "Advanced Financial Planning",
      slug: "advanced-financial-planning",
      price: 12999,
      discountPrice: 1299,
      imageUrl:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop",
    },
  ]

  return (
    <main className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold capitalize">{category}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our collection of {category} courses
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </main>
  )
}

export default CoursesByCategoryPage
