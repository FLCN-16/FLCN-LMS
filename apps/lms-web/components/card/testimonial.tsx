import { Avatar, AvatarFallback } from "@flcn-lms/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  initials: string
}

function TestimonialCard({ name, role, quote, initials }: TestimonialCardProps) {
  return (
    <Card className="rounded-md">
      <CardHeader className="flex items-center gap-x-3">
        <Avatar size="xl">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>{quote}</CardContent>
    </Card>
  )
}

export default TestimonialCard
