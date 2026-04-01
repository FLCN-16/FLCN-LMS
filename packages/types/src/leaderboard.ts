export interface LeaderboardEntry {
  id: string
  testId: string
  userId: string
  rank: number
  marksObtained: number
  percentile: number
  timeTakenSecs: number
  updatedAt: string
}

export interface TenantBranding {
  primaryColor: string
  primaryTextColor: string
  secondaryColor: string
  secondaryTextColor: string
}

export interface TenantMetaConfig {
  title: string
  description: string
  keywords: string[]
}

export interface TenantConfig {
  id: string
  name: string
  locale: string
  domain: string
  isActive: boolean
  logoUrl: string
  branding?: TenantBranding
  seo?: TenantMetaConfig
}

export interface TenantSummary {
  id: string
  slug: string
  name: string
  logoUrl?: string
  customDomain?: string
  isActive: boolean
  createdAt?: string
}
