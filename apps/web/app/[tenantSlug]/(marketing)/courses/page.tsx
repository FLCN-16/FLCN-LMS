import { getTranslations } from "next-intl/server"

import CourseCard from "@/components/card/course"

async function CoursesPage() {
  const t = await getTranslations()

  return (
    <main className="container flex flex-col py-6">
      <div className="grid grid-cols-4 gap-4">
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
          id="sdffsfs"
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
