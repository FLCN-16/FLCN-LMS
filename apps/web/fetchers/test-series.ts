import { TestSeries } from "@flcn-lms/types/test-series"

import { fetcher } from "@/lib/fetcher"

export async function getTestSeries() {
  const response = await fetcher("/api/v1/test-series", {
    next: { tags: ["test-series"], revalidate: 3600 },
  })

  return response as TestSeries[]
}

export async function getTestSeriesDetail(seriesId: string) {
  const response = await fetcher(`/api/v1/test-series/${seriesId}`, {
    next: {
      tags: [`test-series:${seriesId}`],
      revalidate: 3600,
    },
  })

  return response as TestSeries
}
