interface CourseNotesPageProps {
  params: Promise<{ slug: string }>
}

async function CourseNotesPage({ params }: CourseNotesPageProps) {
  const { slug } = await params
  return <div>Course Notes: {slug}</div>
}

export default CourseNotesPage
