// Featured projects (Work tab + /api/portfolio for the Android app).
export interface ProjectPreviewCard {
    title: string;
    caption: string;
    badge?: string;
    type: "interface" | "architecture";
    metrics?: string[];
}

export interface ProjectItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    liveUrl?: string;
    githubUrl: string;
    tech: string[];
    previews: ProjectPreviewCard[];
}

export const PROJECTS: ProjectItem[] = [
    {
        id: "boozeblues",
        title: "Boozeblues E-Commerce",
        subtitle: "Storefront & checkout engine",
        description:
            "High-performance modern beverage storefront with React Server Components (RSC), real-time cart mutations, streaming SSR, and sub-second Largest Contentful Paint (LCP 0.9s).",
        liveUrl: "https://boozeblues.vercel.app",
        githubUrl: "https://github.com/SutharShantanu/boozeblues",
        tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "TanStack Query"],
        previews: [
            {
                title: "Curated Storefront UI",
                caption: "Fluid product catalog with sub-second LCP and edge-cached catalog assets",
                badge: "LCP 0.9s",
                type: "interface",
                metrics: ["RSC Streaming", "Instant Cart", "Zero-CLS"],
            },
            {
                title: "Checkout & Inventory Engine",
                caption: "Optimistic UI mutations, atomic stock validation, and Stripe integration",
                badge: "99.9% Uptime",
                type: "architecture",
                metrics: ["TanStack Query", "Zod Validation", "Edge Middleware"],
            },
        ],
    },
    {
        id: "geekycart",
        title: "Geekycart Tech Store",
        subtitle: "Full-stack MERN application",
        description:
            "Electronics marketplace featuring multi-tiered category filtering, Redux Toolkit cart synchronization, JWT session authorization, and compound-indexed MongoDB queries.",
        liveUrl: "https://geekycart.vercel.app",
        githubUrl: "https://github.com/SutharShantanu/geekycart",
        tech: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB"],
        previews: [
            {
                title: "Interactive Catalog Grid",
                caption: "Multi-parameter facet search, price sliders, and real-time stock levels",
                badge: "MERN Stack",
                type: "interface",
                metrics: ["Redux Toolkit", "Compound Indexes", "JWT Auth"],
            },
            {
                title: "Scalable API & Cache Pipeline",
                caption: "RESTful architecture with token refreshes and optimized aggregation pipelines",
                badge: "40ms API",
                type: "architecture",
                metrics: ["Express Routing", "Mongo Aggregations", "Bcrypt Hashing"],
            },
        ],
    },
];
