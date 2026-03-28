"use client"

import dynamic from "next/dynamic"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Mousewheel } from "swiper/modules"

import { Heading } from "@workspace/ui/components/typography"

const CoursePackage = dynamic(() => import("@/components/course/package"))

const coursePackages = [
  {
    title: "Platinum",
    price: 12000,
    validityMonths: 24,
    features: [
      {
        title: "Live Lectures by 2 Set of Faculties",
        description: "Watch live lectures by 2 set of faculties",
        isIncluded: true,
      },
      {
        title: "Access to all lectures",
        description: "Get access to all lectures",
        isIncluded: false,
      },
    ],
  },
  {
    title: "Gold",
    price: 8000,
    validityMonths: 12,
    features: [
      {
        title: "Live Lectures by 2 Set of Faculties",
        description: "Watch live lectures by 2 set of faculties",
        isIncluded: true,
      },
      {
        title: "Access to all lectures",
        description: "Get access to all lectures",
        isIncluded: false,
      },
    ],
  },
  {
    title: "Silver",
    price: 5000,
    validityMonths: 6,
    features: [
      {
        title: "Live Lectures by 2 Set of Faculties",
        description: "Watch live lectures by 2 set of faculties",
        isIncluded: true,
      },
      {
        title: "Access to all lectures",
        description: "Get access to all lectures",
        isIncluded: false,
      },
    ],
  },
]

function CoursePackages() {
  return (
    <section id="course-packages">
      <div className="container flex flex-col gap-y-8">
        <Heading variant="h2">Packages</Heading>

        <Swiper
          className="w-full"
          modules={[Mousewheel, FreeMode]}
          slidesPerView={2.6}
          spaceBetween={16}
          mousewheel={{ forceToAxis: true }}
          freeMode
        >
          {coursePackages.map((coursePackage) => (
            <SwiperSlide key={coursePackage.title}>
              <CoursePackage {...coursePackage} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CoursePackages
