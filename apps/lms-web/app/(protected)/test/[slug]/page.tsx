interface TestPageProps {
  params: Promise<{ slug: string }>
}

async function TestPage({ params }: TestPageProps) {
  const { slug } = await params

  return <div></div>
}

export default TestPage
