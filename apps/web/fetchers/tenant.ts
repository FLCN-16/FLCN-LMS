import { fetcher } from "@/lib/fetcher"

import { TenantConfig } from "@flcn-lms/types/tenant"

export async function getTenantConfig(
  tenantSlug: string
): Promise<TenantConfig> {
  const response = await fetcher(`/api/tenants/${tenantSlug}/config`, {
    next: { tags: [`tenant:${tenantSlug}-config`], revalidate: 3600 },
  })

  return response
}
