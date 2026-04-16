interface CourseNotesPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseNotesPage({ params }: CourseNotesPageProps) {
  const { courseSlug } = await params
  return <div>Course Notes: {courseSlug}</div>
}

export default CourseNotesPage
