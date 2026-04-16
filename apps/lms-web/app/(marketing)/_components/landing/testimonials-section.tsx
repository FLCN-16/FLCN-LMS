import TestimonialCard from "@/components/card/testimonial"

const TESTIMONIALS = [
  {
    name: "Felipe M.",
    role: "Learner since 2018",
    initials: "FM",
    quote:
      "This learning platform has transformed how I approach online education. The courses are well-structured and the instructors are incredibly knowledgeable. Highly recommend!",
  },
  {
    name: "Adaeze O.",
    role: "Software Engineer",
    initials: "AO",
    quote:
      "I landed my first dev job after completing the web development bootcamp. The project-based approach and practice tests made all the difference in my preparation.",
  },
  {
    name: "Kwame B.",
    role: "Data Analyst",
    initials: "KB",
    quote:
      "The practice tests and certification kept me motivated throughout. I went from zero to job-ready in just four months. Worth every penny.",
  },
]

function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-2 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              What Our Learners Say
            </h2>
            <p className="text-muted-foreground">
              Real results from real people who started exactly where you are.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
