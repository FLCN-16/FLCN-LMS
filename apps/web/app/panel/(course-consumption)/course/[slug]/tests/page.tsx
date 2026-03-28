interface CourseTestsPageProps {
  params: Promise<{ slug: string }>
}

async function CourseTestsPage({ params }: CourseTestsPageProps) {
  const { slug } = await params

  return <div>Course Tests: {slug}</div>
}

export default CourseTestsPage
