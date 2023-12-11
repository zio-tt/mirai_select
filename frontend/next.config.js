/**
 * @type {import('next').NextConfig}
 */

const withVideos = require('next-videos')

module.exports = {
  ...withVideos(),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
}