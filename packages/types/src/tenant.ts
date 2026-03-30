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
