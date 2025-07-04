/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    reactStrictMode: false,
    images: {
        unoptimized: true,

        domains: [
            "avatars.githubusercontent.com",
            "images.unsplash.com",
            "cdn-icons-png.flaticon.com",
            "seeklogo.com",
            "img.icons8.com",
            "cdn-1.webcatalog.io",
            "images.g2crowd.com",
            "images.crunchbase.com",
            "github.githubassets.com",
            "infyni-prod-upgrade.s3.amazonaws.com",
            "masai-website-images.s3.ap-south-1.amazonaws.com",
            "github-readme-streak-stats.herokuapp.com",
            "user-images.githubusercontent.com",
            "raw.githubusercontent.com",
            "github.com",
            "github-production-user-asset-6210df.s3.amazonaws.com",
            "storytale-public2.b-cdn.net",
        ],
    },
};

export default nextConfig;
