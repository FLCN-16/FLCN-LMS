import dynamic from "next/dynamic"

import CourseDetailBreadcrumb from "./_components/breadcumb"
import CourseDetailHeader from "./_components/header"

const CoursePackages = dynamic(() => import("./_components/packages"))
const CourseTestimonials = dynamic(() => import("./_components/testimonials"))
const CourseDetailSupport = dynamic(() => import("./_components/support"))

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  return (
    <main id="course-detail-page" className="flex min-h-screen flex-col pb-48">
      <CourseDetailBreadcrumb />

      <div className="flex flex-col gap-y-8">
        <CourseDetailHeader />
        <CoursePackages />
        <CourseTestimonials />
        <CourseDetailSupport />
      </div>
    </main>
  )
}

export default CoursePage
