import CourseCard from "@/components/card/course"

export default function CourseRelatedSection() {
  const relatedCourses = [
    {
      id: "1",
      title: "Advanced Topics",
      slug: "advanced-topics",
      price: 9900,
      discountPrice: 7999,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=640&h=360&fit=crop",
    },
    {
      id: "2",
      title: "Related Skills Development",
      slug: "related-skills",
      price: 7900,
      discountPrice: 5999,
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&h=360&fit=crop",
    },
    {
      id: "3",
      title: "Specialization Path",
      slug: "specialization-path",
      price: 12900,
      discountPrice: 9999,
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Related Courses</h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Continue your learning journey with these related courses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedCourses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            slug={course.slug}
            price={course.price}
            discountPrice={course.discountPrice}
            imageUrl={course.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}
