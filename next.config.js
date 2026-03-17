const withPWA = require('next-pwa')({
  dest: 'public',
  // デザイン崩れ（古いキャッシュ/SW）が再発しやすいため、当面はSWを無効化
  disable: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
