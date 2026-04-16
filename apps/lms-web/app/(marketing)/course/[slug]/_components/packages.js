"use client";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import dynamic from "next/dynamic";
import { Heading } from "@flcn-lms/ui/components/typography";
const CoursePackage = dynamic(() => import("@/components/course/package"));
const coursePackages = [
    {
        title: "Platinum",
        price: 12000,
        validityMonths: 24,
        features: [
            { title: "Live Lectures by 2 Set of Faculties", isIncluded: true },
            { title: "Access to all lectures", isIncluded: true },
            { title: "Doubt clearing sessions", isIncluded: true },
            { title: "Study materials included", isIncluded: true },
        ],
    },
    {
        title: "Gold",
        price: 8000,
        validityMonths: 12,
        features: [
            { title: "Live Lectures by 2 Set of Faculties", isIncluded: true },
            { title: "Access to all lectures", isIncluded: true },
            { title: "Doubt clearing sessions", isIncluded: false },
            { title: "Study materials included", isIncluded: true },
        ],
    },
    {
        title: "Silver",
        price: 5000,
        validityMonths: 6,
        features: [
            { title: "Live Lectures by 2 Set of Faculties", isIncluded: true },
            { title: "Access to all lectures", isIncluded: false },
            { title: "Doubt clearing sessions", isIncluded: false },
            { title: "Study materials included", isIncluded: false },
        ],
    },
];
function CoursePackages() {
    return (<section id="course-packages">
      <div className="container flex flex-col gap-y-8">
        <Heading variant="h2">Choose Your Package</Heading>

        <Swiper className="w-full" modules={[Mousewheel, FreeMode]} slidesPerView={2.6} spaceBetween={16} mousewheel={{ forceToAxis: true }} freeMode>
          {coursePackages.map((coursePackage) => (<SwiperSlide key={coursePackage.title}>
              <CoursePackage {...coursePackage}/>
            </SwiperSlide>))}
        </Swiper>
      </div>
    </section>);
}
export default CoursePackages;
