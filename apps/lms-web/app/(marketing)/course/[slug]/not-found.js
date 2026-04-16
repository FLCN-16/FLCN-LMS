import Link from "next/link";
import { Button } from "@flcn-lms/ui/components/button";
function CourseNotFound() {
    return (<div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Course Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Sorry, the course you're looking for doesn't exist.
          </p>
        </div>
        <Button asChild>
          <Link href="/courses">Browse All Courses</Link>
        </Button>
      </div>
    </div>);
}
export default CourseNotFound;
