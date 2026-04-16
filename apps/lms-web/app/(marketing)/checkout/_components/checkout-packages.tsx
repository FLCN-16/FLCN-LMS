"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

import { Card, CardContent, CardHeader, CardTitle } from "@flcn-lms/ui/components/card"
import { Text } from "@flcn-lms/ui/components/typography"

import formatPrice from "@/lib/format-price"
import CoursePackage from "@/components/course/package"
import type { MarketingCourseDetail, CoursePackage as CoursePackageType } from "@/fetchers/marketing"

const swiperSlideStyle = `
  .checkout-packages-swiper .swiper-slide {
    display: flex;
    flex-direction: column;
  }

  .checkout-packages-swiper .swiper-slide > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`

interface CheckoutPackagesProps {
  course?: MarketingCourseDetail
  packages?: CoursePackageType[]
}

function CheckoutPackages({ course, packages = [] }: CheckoutPackagesProps) {

  const hasPackages = course && packages.length > 0

  if (hasPackages) {
    return (
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>
            <h3>{course.title} - Select Package</h3>
          </CardTitle>
          {course.short_description && (
            <Text className="text-sm text-muted-foreground mt-2">
              {course.short_description}
            </Text>
          )}
        </CardHeader>
        <CardContent>
          <style>{swiperSlideStyle}</style>
          <Swiper
            slidesPerView={2.6}
            spaceBetween={16}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 12 },
              640: { slidesPerView: 1.8, spaceBetween: 16 },
              1024: { slidesPerView: 2.6, spaceBetween: 16 },
            }}
            className="checkout-packages-swiper"
          >
            {packages.map((pkg) => {
              const validityMonths = Math.round(pkg.validity_days / 30)

              return (
                <SwiperSlide key={pkg.id}>
                  <div className="flex flex-col h-full">
                    <CoursePackage
                      title={pkg.name}
                      price={formatPrice(pkg.price)}
                      validityMonths={validityMonths}
                      features={pkg.features.map((f) => ({
                        title: f.title,
                        isIncluded: f.is_included,
                      }))}
                    />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </CardContent>
      </Card>
    )
  }

  return null
}

export default CheckoutPackages
