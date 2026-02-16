import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "seeklogo.com" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "cdn-1.webcatalog.io" },
      { protocol: "https", hostname: "images.g2crowd.com" },
      { protocol: "https", hostname: "images.crunchbase.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
};

export default nextConfig;
