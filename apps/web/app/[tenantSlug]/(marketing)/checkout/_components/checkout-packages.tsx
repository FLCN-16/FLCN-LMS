"use client"

import { Swiper, SwiperSlide } from "swiper/react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import CoursePackage from "@/components/course/package"

const checkoutPackages = [
  {
    title: "Platinum",
    price: 12000,
    validityMonths: 24,
    features: [
      { title: "Live Lectures by 2 Set of Faculties", isIncluded: true },
      { title: "Access to all lectures", isIncluded: false },
    ],
  },
  {
    title: "Gold",
    price: 8000,
    validityMonths: 12,
    features: [
      { title: "Live Lectures by 2 Set of Faculties", isIncluded: true },
      { title: "Access to all lectures", isIncluded: false },
    ],
  },
  {
    title: "Silver",
    price: 5000,
    validityMonths: 6,
    features: [
      { title: "Live Lectures by 2 Set of Faculties", isIncluded: true },
      { title: "Access to all lectures", isIncluded: false },
    ],
  },
]

function CheckoutPackages() {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h3>Course Packages</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Swiper slidesPerView={2.4} spaceBetween={16}>
          {checkoutPackages.map((pkg) => (
            <SwiperSlide key={pkg.title}>
              <CoursePackage {...pkg} />
            </SwiperSlide>
          ))}
        </Swiper>
      </CardContent>
    </Card>
  )
}

export default CheckoutPackages
