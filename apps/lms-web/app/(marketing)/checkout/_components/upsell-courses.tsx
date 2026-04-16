"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

import { Card, CardContent, CardHeader, CardTitle } from "@flcn-lms/ui/components/card"
import { Text } from "@flcn-lms/ui/components/typography"

import { useCart } from "@/lib/cart-store"
import UpsellCourseCard from "./upsell-course-card"
import type { MarketingCourseList } from "@/fetchers/marketing"

interface UpsellCoursesProps {
  courses: MarketingCourseList[]
}

function UpsellCourses({ courses }: UpsellCoursesProps) {
  const { addItem, items } = useCart()
  const [addedCourses, setAddedCourses] = useState<Set<string>>(new Set())

  if (!courses || courses.length === 0) {
    return null
  }

  const handleAddCourse = (courseId: string, title: string, price: number, imageUrl: string) => {
    addItem({
      id: courseId,
      type: "course",
      title: title,
      price: price,
      quantity: 1,
      imageUrl: imageUrl,
    })
    setAddedCourses((prev) => new Set(prev).add(courseId))
  }

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h3>Recommended Courses</h3>
        </CardTitle>
        <Text className="text-sm text-muted-foreground mt-2">
          Enhance your learning with these popular courses
        </Text>
      </CardHeader>
      <CardContent>
        <Swiper
          slidesPerView={2.6}
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 12 },
            640: { slidesPerView: 1.8, spaceBetween: 16 },
            1024: { slidesPerView: 2.6, spaceBetween: 16 },
          }}
        >
          {courses.map((course) => {
            const isAdded = addedCourses.has(course.id)

            return (
              <SwiperSlide key={course.id} className="h-auto">
                <UpsellCourseCard
                  id={course.id}
                  title={course.title}
                  slug={course.slug}
                  price={course.price}
                  imageUrl={course.thumbnail_url}
                  level={course.level}
                  totalEnrolled={course.total_enrolled}
                  averageRating={course.average_rating}
                  reviewCount={course.review_count}
                  isFeatured={course.is_featured}
                  isAdded={isAdded}
                  onAdd={handleAddCourse}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </CardContent>
    </Card>
  )
}

export default UpsellCourses
