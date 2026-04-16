// Cookie names use 'flcn-lms.' prefix
export const COOKIES = {
  AUTH_TOKEN: "flcn-lms.auth-token",
  LOCALE: "flcn-lms.locale",
  TENANT: "flcn-lms.tenant-slug",
} as const

export type CookieName = (typeof COOKIES)[keyof typeof COOKIES]
