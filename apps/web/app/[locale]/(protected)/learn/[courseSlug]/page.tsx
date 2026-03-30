interface CourseConsumptionPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseConsumptionPage({ params }: CourseConsumptionPageProps) {
  const { courseSlug } = await params

  return <div className="flex flex-col"></div>
}

export default CourseConsumptionPage
