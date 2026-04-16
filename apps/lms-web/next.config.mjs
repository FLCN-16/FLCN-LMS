/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
      },
      {
        hostname: "via.placeholder.com",
      },
      {
        hostname: "d3njjcbhbojbot.cloudfront.net",
      },
      {
        hostname: "images.unsplash.com",
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
