import { Heading } from "@flcn-lms/ui/components/typography"

import TestimonialCard from "@/components/card/testimonial"

function CourseDetailTestimonials() {
  return (
    <section id="course-detail-testimonials">
      <div className="container space-y-8">
        <Heading variant="h2">What Students Say</Heading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
