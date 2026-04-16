import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@flcn-lms/ui/components/badge";
import { Button } from "@flcn-lms/ui/components/button";
import { Card } from "@flcn-lms/ui/components/card";
import { getTestSeriesDetail } from "@/fetchers/test-series";
export async function generateMetadata({ params, }) {
    const { slug } = await params;
    return {
        title: "Test Series Details",
        description: "View detailed information about this test series",
        openGraph: {
            title: "Test Series Details",
            description: "View detailed information about this test series",
        },
    };
}
export default async function TestSeriesDetailPage({ params, }) {
    const { slug } = await params;
    try {
        const testSeries = await getTestSeriesDetail(slug);
        if (!testSeries) {
            notFound();
        }
        return (<div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
          <div className="relative z-10 container flex flex-col items-start justify-between py-12 lg:flex-row">
            <div className="max-w-2xl">
              {testSeries.category && (<Badge className="mb-4" variant="secondary">
                  {testSeries.category}
                </Badge>)}
              <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                {testSeries.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {testSeries.description}
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="font-semibold text-foreground">
                    {testSeries.testCount || 0}
                  </span>
                  <span className="ml-1 text-muted-foreground">Tests</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {testSeries.totalQuestions || 0}
                  </span>
                  <span className="ml-1 text-muted-foreground">Questions</span>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="h-fit w-full max-w-sm p-6 lg:mt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      ₹{testSeries.price || 0}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    One-time payment
                  </p>
                </div>

                <div className="space-y-2 border-y py-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tests</span>
                    <span className="font-semibold">
                      {testSeries.testCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">
                      {testSeries.totalQuestions || 0}
                    </span>
                  </div>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href={`/test-series/${slug}/enroll`}>Enroll Now</Link>
                </Button>
                <Button className="w-full" variant="outline" size="lg" asChild>
                  <Link href="/test-series">Browse All Tests</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Content Section */}
        <section className="container py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {/* Overview */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Overview</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {testSeries.description}
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What's Included</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">✓</span>
                    <span className="text-muted-foreground">
                      {testSeries.testCount || 0} comprehensive tests
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">✓</span>
                    <span className="text-muted-foreground">
                      {testSeries.totalQuestions || 0} practice questions
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">✓</span>
                    <span className="text-muted-foreground">
                      Detailed performance analytics
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">✓</span>
                    <span className="text-muted-foreground">
                      Lifetime access to all materials
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-bold">Test Series Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tests</span>
                    <span className="font-semibold">
                      {testSeries.testCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">
                      {testSeries.totalQuestions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold">
                      {testSeries.category || "General"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">
                      ₹{testSeries.price || 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Button className="w-full" size="lg" asChild>
                <Link href={`/test-series/${slug}/enroll`}>Enroll Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>);
    }
    catch (error) {
        console.error("Error fetching test series:", error);
        notFound();
    }
}
