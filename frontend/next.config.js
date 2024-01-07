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
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'web',
      },
      {
        protocol: 'https',
        hostname: 'mirai-select.onrender.com'
      }
    ],
  },
}