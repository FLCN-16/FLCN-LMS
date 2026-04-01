import { useQuery } from "@tanstack/react-query"

import { getInstituteStats } from "@/lib/api/stats"

export function useInstituteStats(instituteSlug: string) {
  return useQuery({
    queryKey: ["institute", instituteSlug, "stats"],
    queryFn: () => getInstituteStats(instituteSlug),
    enabled: !!instituteSlug,
  })
}
