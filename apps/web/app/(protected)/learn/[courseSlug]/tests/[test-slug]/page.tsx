interface CourseTestPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseTestPage({ params }: CourseTestPageProps) {
  const { courseSlug } = await params

  return <div>Test {courseSlug}</div>
}

export default CourseTestPage
