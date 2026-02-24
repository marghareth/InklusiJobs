/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co', 'images.unsplash.com'],
    dangerouslyAllowSVG: true, // optional if you want SVGs
  },
};

export default nextConfig;

