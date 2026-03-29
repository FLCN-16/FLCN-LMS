interface CourseTestPageProps {
  params: Promise<{ slug: string }>
}

async function CourseTestPage({ params }: CourseTestPageProps) {
  const { slug } = await params

  return <div>Test {slug}</div>
}

export default CourseTestPage
