import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/user",
        destination: "/user/library",
        permanent: true,
      },
      {
        source: "/:locale/user",
        destination: "/:locale/user/library",
        permanent: true,
      },
    ]
  },
  transpilePackages: ["@flcn-lms/ui"],
}

export default withNextIntl(nextConfig)
