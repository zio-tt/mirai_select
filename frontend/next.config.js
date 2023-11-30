// import { env } from "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
    ],
  },
}

const withVideos = require('next-videos')

module.exports = nextConfig
module.exports = withVideos()