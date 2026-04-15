import CourseCard from "@/components/card/course"

async function CoursesPage() {
  return (
    <main className="container flex flex-col gap-8 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Explore Courses</h1>
        <p className="text-lg text-muted-foreground">
          Browse our collection of courses from top instructors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CourseCard
          id="fsdff"
          title="Financial Markets"
          slug="financial-markets"
          price={9999}
          discountPrice={999}
          imageUrl="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop"
        />
        <CourseCard
          id="sdffsfs"
          title="Financial Markets"
          slug="financial-markets"
          price={9999}
          discountPrice={999}
          imageUrl="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop"
        />
        <CourseCard
          id="sdffsfs2"
          title="Financial Markets"
          slug="financial-markets"
          price={9999}
          discountPrice={999}
          imageUrl="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop"
        />
        <CourseCard
          id="vcvdc"
          title="Financial Markets"
          slug="financial-markets"
          price={9999}
          discountPrice={999}
          imageUrl="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/a1/4a6819ac4e443a9b9c2a737c42f461/Financial-Markets-2017---Square.jpg?auto=format%2C%20compress%2C%20enhance&dpr=2&w=320&h=180&q=50&fit=crop"
        />
      </div>
    </main>
  )
}

export default CoursesPage
