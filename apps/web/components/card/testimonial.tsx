import { Avatar, AvatarFallback } from "@flcn-lms/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

function TestimonialCard() {
  return (
    <Card className="rounded-md">
      <CardHeader className="flex items-center gap-x-3">
        <Avatar size="xl">
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>Felipe M.</CardTitle>
          <CardDescription>A learner since 2018</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        This learning platform has transformed how I approach online education.
        The courses are well-structured and the instructors are incredibly
        knowledgeable. Highly recommend!
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
