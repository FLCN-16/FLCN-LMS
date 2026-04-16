const cache = new Map();
const TTL = 60_000;
export async function resolveDomain(host) {
    const hit = cache.get(host);
    if (hit && Date.now() - hit.ts < TTL)
        return hit.slug;
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/api/tenants/domain?domain=${host}`, { next: { revalidate: 60 } });
        if (!res.ok)
            return null;
        const { slug } = await res.json();
        cache.set(host, { slug, ts: Date.now() });
        return slug;
    }
    catch {
        return null;
    }
}
