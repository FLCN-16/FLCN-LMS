import { Heading } from "@flcn-lms/ui/components/typography";
import TestimonialCard from "@/components/card/testimonial";
function CourseDetailTestimonials() {
    return (<section id="course-detail-testimonials">
      <div className="container space-y-8">
        <Heading variant="h2">What Students Say</Heading>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TestimonialCard name="Alex R." role="Enrolled student" initials="AR" quote="This course exceeded my expectations. The material is well-paced and the instructor explains complex concepts clearly."/>
          <TestimonialCard name="Maria S." role="Enrolled student" initials="MS" quote="I loved the hands-on projects. They really helped me apply what I learned and build a portfolio."/>
          <TestimonialCard name="James K." role="Enrolled student" initials="JK" quote="Great value for money. I completed the course in three weeks and felt job-ready immediately after."/>
          <TestimonialCard name="Priya N." role="Enrolled student" initials="PN" quote="The live sessions were a game changer. Being able to ask questions in real time made a huge difference."/>
        </div>
      </div>
    </section>);
}
export default CourseDetailTestimonials;
