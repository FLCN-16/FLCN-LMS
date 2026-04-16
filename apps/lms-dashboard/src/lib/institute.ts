export function getInstituteSlug(): string {
  // 1. Check for environment variable (development override)
  const envSlug = import.meta.env.VITE_INSTITUTE_SLUG
  if (envSlug) {
    return envSlug
  }

  // 2. Extract from subdomain: [institute].flcn.app
  const hostname = window.location.hostname
  const parts = hostname.split(".")

  // If there's a subdomain and it's not 'www' or 'api'
  if (parts.length >= 3) {
    const subdomain = parts[0]
    if (!["www", "api", "admin", "dashboard"].includes(subdomain.toLowerCase())) {
      return subdomain
    }
  }

  // Fallback for local development if VITE_INSTITUTE_SLUG is missing
  return "dev-institute"
}
