import Link from "next/link";
import { Button } from "@flcn-lms/ui/components/button";
function CtaBannerSection() {
    return (<section className="bg-gradient-to-b from-primary/5 to-background py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join 10,000+ learners already building their future on FLCN LMS.
            Your first step starts today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>);
}
export default CtaBannerSection;
