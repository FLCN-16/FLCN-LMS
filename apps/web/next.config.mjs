/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
      },
      {
        hostname: "d3njjcbhbojbot.cloudfront.net",
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
    ]
  },
  transpilePackages: ["@flcn-lms/ui"],
}

export default nextConfig
