import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon } from "@hugeicons/core-free-icons"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

function CourseDetailBreadcrumb() {
  return (
    <Breadcrumb className="bg-transparent py-2">
      <BreadcrumbList className="container">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <HugeiconsIcon icon={Home01Icon} size={16} />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/courses/neet">NEET</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/courses/neet/class-11">Class 11</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default CourseDetailBreadcrumb
