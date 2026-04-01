import { getTranslations } from "next-intl/server"

import { Heading } from "@flcn-lms/ui/components/typography"

import TestimonialCard from "@/components/card/testimonial"

async function CourseDetailTestimonials() {
  const t = await getTranslations("course.testimonials")

  return (
    <section id="course-detail-testimonials">
      <div className="container space-y-8">
        <Heading variant="h2">{t("sectionTitle")}</Heading>

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
