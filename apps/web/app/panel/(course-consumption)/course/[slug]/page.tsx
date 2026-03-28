import { AspectRatio } from "@workspace/ui/components/aspect-ratio"

import PlayerComponent from "@/components/player"

interface CourseConsumptionPageProps {
  params: Promise<{ slug: string }>
}

async function CourseConsumptionPage({ params }: CourseConsumptionPageProps) {
  const { slug } = await params

  return (
    <div className="flex flex-col">
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-gray-200">
        <PlayerComponent src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4" />
      </AspectRatio>
    </div>
  )
}

export default CourseConsumptionPage
