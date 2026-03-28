import { Heading } from "@workspace/ui/components/typography"

import TestimonialCard from "@/components/card/testimonial"

async function CourseDetailTestimonials() {
  return (
    <section id="course-detail-testimonials">
      <div className="container space-y-8">
        <Heading variant="h2">What our community thinks</Heading>

        <div className="grid grid-cols-4 gap-x-4">
          <TestimonialCard />
          <TestimonialCard />
          <TestimonialCard />
          <TestimonialCard />
        </div>
      </div>
    </section>
  )
}

export default CourseDetailTestimonials
