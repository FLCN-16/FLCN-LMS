"use client"

import { FreeMode, Mousewheel } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import dynamic from "next/dynamic"

import { Heading } from "@flcn-lms/ui/components/typography"
import { type CoursePackage } from "@/fetchers/marketing"

const CoursePackageCard = dynamic(() => import("@/components/course/package"))

interface CoursePackagesProps {
  packages: CoursePackage[]
}

function CoursePackages({ packages }: CoursePackagesProps) {
  if (!packages || packages.length === 0) return null

  return (
    <section id="course-packages">
      <div className="container flex flex-col gap-y-8">
        <Heading variant="h2">Choose Your Package</Heading>

        <Swiper
          className="w-full"
          modules={[Mousewheel, FreeMode]}
          slidesPerView={2.6}
          spaceBetween={16}
          mousewheel={{ forceToAxis: true }}
          freeMode
        >
          {packages.map((pkg) => (
            <SwiperSlide key={pkg.id}>
              <CoursePackageCard
                title={pkg.name}
                price={`₹${pkg.price.toLocaleString("en-IN")}`}
                validityMonths={Math.round(pkg.validity_days / 30)}
                features={pkg.features.map((f) => ({
                  title: f.title,
                  isIncluded: f.is_included,
                }))}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CoursePackages
