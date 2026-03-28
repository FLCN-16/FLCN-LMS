import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

function TestimonialCard() {
  return (
    <Card className="rounded-md">
      <CardHeader className="flex items-center gap-x-3">
        <Avatar size="xl">
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>Felipe M.</CardTitle>
          <CardDescription>Learner since 2018</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        To be able to take courses at my own pace and rhythm has been an amazing
        experience. I can learn whenever it fits my schedule and mood.
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
