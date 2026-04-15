import NotFoundError from "@/errors/not-found-error"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function fetcher(url: string, config: RequestInit = {}) {
  // Convert relative URLs to absolute URLs
  const absoluteUrl = url.startsWith("http") ? url : `${API_BASE}${url}`

  const request = await fetch(absoluteUrl, config)

  if (request.status === 404) throw new NotFoundError("Request Failed!")

  const response = await request.json()

  return response
}
