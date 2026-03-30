interface CourseTestsPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseTestsPage({ params }: CourseTestsPageProps) {
  const { courseSlug } = await params

  return <div>Course Tests: {courseSlug}</div>
}

export default CourseTestsPage
