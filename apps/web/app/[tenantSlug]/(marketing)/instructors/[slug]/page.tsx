interface InstructorPageProps {
  params: Promise<{ slug: string }>
}

async function InstructorPage({ params }: InstructorPageProps) {
  const { slug } = await params

  return <div></div>
}

export default InstructorPage
