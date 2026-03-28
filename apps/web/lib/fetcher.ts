import NotFoundError from "@/errors/not-found-error"

export async function fetcher(url: string, config: RequestInit = {}) {
  const request = await fetch(url, config)

  if (request.status === 404) throw new NotFoundError("Request Failed!")

  const response = await request.json()

  return response
}
