import fetch from "@/lib/fetch"

export interface InstituteStats {
  counts: {
    students: number
    instructor: number
    courses: number
    activeSessions: number
  }
  todaySessions: number
  recentEnrollments: any[]
}

export async function getInstituteStats(instituteSlug: string) {
  const response = await fetch.get<InstituteStats>(`/${instituteSlug}/stats`)
  return response.data
}
