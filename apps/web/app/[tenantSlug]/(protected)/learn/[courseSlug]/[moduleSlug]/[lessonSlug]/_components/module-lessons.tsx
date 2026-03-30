"use client"

import { Swiper, SwiperSlide } from "swiper/react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@flcn-lms/ui/components/card"
import CourseResource from "@/components/card/course-resource"

function CourseModuleLessons() {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Module Content</CardTitle>
      </CardHeader>

      <CardContent>
        <CourseResource />
      </CardContent>
    </Card>
  )
}

export default CourseModuleLessons
