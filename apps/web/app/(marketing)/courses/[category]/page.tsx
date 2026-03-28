interface CourseByCategoryPageParams {
  params: Promise<{ category: string }>
}

async function CoursesByCategoryPage({ params }: CourseByCategoryPageParams) {
  const { category } = await params

  return <div>Courses by Category {category}</div>
}

export default CoursesByCategoryPage
