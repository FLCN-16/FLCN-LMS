import { type Metadata } from "next"
import { type OpenGraph } from "next/dist/lib/metadata/types/opengraph-types"

import logoImg from "@/public/logo.svg"
import logoIconImg from "@/public/logo-icon.svg"

// ✅ Union type is simpler and idiomatic for a binary config value
type ColorMode = "light" | "dark"

export const siteConfig = {
  name: "FLCN LMS",
  title: "FLCN LMS – Multi",
  description:
    "Isomorphic is the ultimate React TypeScript Admin Template. Streamline your admin dashboard development with a feature-rich, responsive, and highly customizable solution.",
  url: "https://isomorphic-furyroad.vercel.app",
  ogImage:
    "https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/itemdep/isobanner.png",
  logo: logoImg,
  icon: logoIconImg,
  mode: "light" as ColorMode,
  locale: "en_US",
  authors: [{ name: "RedQ Team", url: "https://redq.io" }],
} as const

// ✅ Options object pattern: readable, extensible, order-independent
interface MetaObjectOptions {
  title?: string
  description?: string
  openGraph?: OpenGraph
  noIndex?: boolean
  canonicalUrl?: string
}

const metaObject = ({
  title,
  description = siteConfig.description,
  openGraph,
  noIndex = false,
  canonicalUrl,
}: MetaObjectOptions = {}): Metadata => {
  // ✅ Single source of truth for the formatted title
  const formattedTitle = title
    ? `${title} - ${siteConfig.name}`
    : siteConfig.title

  if (description) {
    description = description.replace("[SITE_NAME]", siteConfig.name)
  }

  return {
    title: formattedTitle,
    description,
    authors: siteConfig.authors,

    // ✅ Canonical URL support for SEO
    ...(canonicalUrl && {
      alternates: { canonical: canonicalUrl },
    }),

    // ✅ robots respects the noIndex flag
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    openGraph: openGraph ?? {
      title: formattedTitle, // ✅ Bug fix: was `title` (undefined) when no title given
      description,
      url: siteConfig.url,
      siteName: siteConfig.name, // ✅ Fix: consistent name across all OG fields
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: siteConfig.locale,
      type: "website",
    },

    // ✅ Twitter/X card metadata (often omitted but important for shares)
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [siteConfig.ogImage],
    },
  }
}

export default metaObject
