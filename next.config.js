/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other configurations like reactStrictMode: true, etc. go here

  images: {
    // List all domains that host your images/thumbnails
    domains: [
      // Your Cloudinary domain for uploaded thumbnails
      "res.cloudinary.com",

      // Domains for externally linked portfolio content
      "vimeo.com",
      "youtube.com",
      "img.youtube.com", // Often required for YouTube thumbnail services
      "i.ytimg.com", // Another common YouTube thumbnail domain
      // Add any other domains like 'behance.net', 'dribbble.com', etc., if you use them for image previews.
    ],
  },
};

module.exports = nextConfig;
