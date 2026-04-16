import Link from "next/link";
import { Button } from "@flcn-lms/ui/components/button";
import CourseCard from "@/components/card/course";
const COURSES = [
    {
        id: "1",
        title: "Complete Web Development Bootcamp",
        slug: "web-dev-bootcamp",
        price: 9999,
        discountPrice: 4999,
        imageUrl: "https://placehold.co/320x180/18181b/ffffff?text=Web+Dev",
    },
    {
        id: "2",
        title: "Data Science with Python",
        slug: "data-science-python",
        price: 8999,
        discountPrice: 3999,
        imageUrl: "https://placehold.co/320x180/18181b/ffffff?text=Data+Science",
    },
    {
        id: "3",
        title: "UI/UX Design Fundamentals",
        slug: "ui-ux-design",
        price: 7999,
        discountPrice: 2999,
        imageUrl: "https://placehold.co/320x180/18181b/ffffff?text=UI%2FUX",
    },
    {
        id: "4",
        title: "Financial Markets Mastery",
        slug: "financial-markets",
        price: 9999,
        discountPrice: 999,
        imageUrl: "https://placehold.co/320x180/18181b/ffffff?text=Finance",
    },
];
function FeaturedCoursesSection() {
    return (<section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 space-y-2 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Popular Courses
            </h2>
            <p className="text-muted-foreground">
              Learn from the best instructors in their fields
            </p>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((course) => (<CourseCard key={course.id} {...course}/>))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>);
}
export default FeaturedCoursesSection;
