import { fetcher } from "@/lib/fetcher"

export async function getCourseDetail(slug: string) {
  const response = await fetcher(`/course/${slug}`)

  return response
}
