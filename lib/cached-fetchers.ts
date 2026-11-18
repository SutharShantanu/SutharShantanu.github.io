/**
 * Pre-configured cached fetchers for all external API calls.
 *
 * LinkedIn APIs: revalidate: false (never auto-expire, bust manually)
 * GitHub APIs: revalidate: 3600 (1 hour) or 1800 (30 min)
 *
 * Tags:
 * - "github" — for all GitHub API calls
 * - "linkedin" — for all LinkedIn/RapidAPI calls
 *
 * Use `revalidateTag("linkedin")` or `revalidateTag("github")` for on-demand invalidation.
 */

import { createCachedFetcher } from "./api-cache";
import { GitHubRepo } from "@/components/sections/types/projects.types";
import { GitHubActivityDay, GitHubUser } from "@/components/sections/types/social.types";

// ─── Default Fallback Data ───────────────────────────────────

export const DEFAULT_LINKEDIN_PROFILE = {
    full_name: "Shantanu Suthar",
    headline: "Frontend Developer | React · Next.js · TypeScript",
    location: "Gurugram, India",
    company: "Infyni",
    job_title: "Associate Frontend Developer",
    linkedin_url: "https://linkedin.com/in/shantanu-suthar",
    follower_count: 500,
    connection_count: 500,
    is_verified: true,
    languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Hindi", proficiency: "Native" },
    ],
    current_job_duration: "1 yr+",
    current_company_join_year: 2023,
    current_company_join_month: 10,
    certifications: [
        {
            name: "Full Stack Web Development",
            authority: "Masai School",
            issued: "May 2023",
            url: "https://linkedin.com/in/shantanu-suthar",
        },
        {
            name: "React & Next.js Development",
            authority: "Self-Paced / Projects",
            issued: "2024",
            url: "https://linkedin.com/in/shantanu-suthar",
        },
    ],
    experiences: [],
    recommendations_received: [],
};

export const DEFAULT_GITHUB_USER: GitHubUser = {
    login: "SutharShantanu",
    id: 110021464,
    node_id: "U_kgDOBo7LWA",
    avatar_url: "https://avatars.githubusercontent.com/u/110021464?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/SutharShantanu",
    html_url: "https://github.com/SutharShantanu",
    followers_url: "https://api.github.com/users/SutharShantanu/followers",
    following_url: "https://api.github.com/users/SutharShantanu/following{/other_user}",
    gists_url: "https://api.github.com/users/SutharShantanu/gists{/gist_id}",
    starred_url: "https://api.github.com/users/SutharShantanu/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/SutharShantanu/subscriptions",
    organizations_url: "https://api.github.com/users/SutharShantanu/orgs",
    repos_url: "https://api.github.com/users/SutharShantanu/repos",
    events_url: "https://api.github.com/users/SutharShantanu/events{/privacy}",
    received_events_url: "https://api.github.com/users/SutharShantanu/received_events",
    type: "User",
    site_admin: false,
    name: "Shantanu Suthar",
    company: "Infyni",
    blog: "https://sutharshantanu.github.io",
    location: "Gurugram, India",
    email: null,
    hireable: true,
    bio: "Frontend Developer crafting interactive and user-friendly web experiences with React, Next.js & TypeScript.",
    public_repos: 28,
    public_gists: 0,
    followers: 48,
    following: 52,
    created_at: "2022-06-01T00:00:00Z",
    updated_at: new Date().toISOString(),
};

export const DEFAULT_GITHUB_REPOS: GitHubRepo[] = [
    {
        id: 783238895,
        name: "SutharShantanu.github.io",
        html_url: "https://github.com/SutharShantanu/SutharShantanu.github.io",
        description: "Interactive personal developer portfolio built with Next.js, HeroUI, Tailwind CSS, and Framer Motion featuring dynamic GitHub data integrations.",
        homepage: "https://shantanusuthar.vercel.app",
        language: "TypeScript",
        stargazers_count: 12,
        forks_count: 3,
        open_issues_count: 0,
        updated_at: "2026-11-13T12:00:00Z",
        size: 3200,
        license: { name: "MIT" },
        topics: ["portfolio", "nextjs", "tailwindcss", "typescript"],
    },
    {
        id: 750192834,
        name: "Boozeblues",
        html_url: "https://github.com/SutharShantanu/Boozeblues",
        description: "A modern e-commerce platform designed to streamline online beverage purchasing with real-time cart updates and secure checkout flows.",
        homepage: "https://boozeblues.vercel.app",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 1,
        open_issues_count: 0,
        updated_at: "2025-10-15T12:00:00Z",
        size: 1200,
        license: { name: "MIT" },
        topics: ["nextjs", "react", "typescript", "tailwind"],
    },
    {
        id: 742189201,
        name: "Geekycart",
        html_url: "https://github.com/SutharShantanu/Geekycart",
        description: "Full-featured consumer electronics e-commerce web application inspired by Best Buy with category navigation, product filters, and cart management.",
        homepage: "https://geekycart.vercel.app",
        language: "JavaScript",
        stargazers_count: 8,
        forks_count: 2,
        open_issues_count: 0,
        updated_at: "2025-08-20T12:00:00Z",
        size: 2400,
        license: { name: "MIT" },
        topics: ["react", "redux", "javascript", "ecommerce"],
    },
];

export const DEFAULT_CONTRIBUTIONS: { total: Record<string, number>; contributions: GitHubActivityDay[] } = {
    total: { "2024": 72, "2025": 76, "2026": 147 },
    contributions: [],
};

// ─── GitHub ──────────────────────────────────────────────────

export const getGithubRepos = createCachedFetcher(
    async (username: string) => {
        try {
            const res = await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
                {
                    headers: {
                        Accept: "application/vnd.github.mercy-preview+json",
                        ...(process.env.NEXT_GITHUB_TOKEN && {
                            Authorization: `Bearer ${process.env.NEXT_GITHUB_TOKEN}`,
                        }),
                    },
                }
            );
            if (!res.ok) {
                return DEFAULT_GITHUB_REPOS;
            }
            const data = await res.json();
            return Array.isArray(data) && data.length > 0 ? data : DEFAULT_GITHUB_REPOS;
        } catch {
            return DEFAULT_GITHUB_REPOS;
        }
    },
    ["github-repos"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubUser = createCachedFetcher(
    async (username: string) => {
        try {
            const res = await fetch(
                `https://api.github.com/users/${username}`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        ...(process.env.NEXT_GITHUB_TOKEN && {
                            Authorization: `Bearer ${process.env.NEXT_GITHUB_TOKEN}`,
                        }),
                    },
                }
            );
            if (!res.ok) {
                return DEFAULT_GITHUB_USER;
            }
            return res.json();
        } catch {
            return DEFAULT_GITHUB_USER;
        }
    },
    ["github-user"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubContributions = createCachedFetcher(
    async (username: string) => {
        try {
            const res = await fetch(
                `https://github-contributions-api.jogruber.de/v4/${username}`,
                { signal: AbortSignal.timeout(5000) }
            );
            if (!res.ok) {
                return DEFAULT_CONTRIBUTIONS;
            }
            return res.json();
        } catch {
            return DEFAULT_CONTRIBUTIONS;
        }
    },
    ["github-contributions"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubActivity = createCachedFetcher(
    async (username: string) => {
        try {
            const res = await fetch(
                `https://api.github.com/users/${username}/events/public`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        ...(process.env.NEXT_GITHUB_TOKEN && {
                            Authorization: `Bearer ${process.env.NEXT_GITHUB_TOKEN}`,
                        }),
                    },
                }
            );
            if (!res.ok) {
                return [];
            }
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    },
    ["github-activity"],
    { revalidate: 1800, tags: ["github"] }
);

// ─── LinkedIn (RapidAPI) ─────────────────────────────────────
// revalidate: false → never auto-expire. Bust manually via
// revalidateTag("linkedin") or the /api/revalidate endpoint.

export const getLinkedInProfile = createCachedFetcher(
    async (linkedinUsername: string) => {
        if (!process.env.RAPIDAPI_HOST || !process.env.RAPIDAPI_KEY) {
            return { data: DEFAULT_LINKEDIN_PROFILE };
        }
        const encodedUrl = encodeURIComponent(
            `https://www.linkedin.com/in/${linkedinUsername}/`
        );
        try {
            const res = await fetch(
                `https://${process.env.RAPIDAPI_HOST}/enrich-lead?linkedin_url=${encodedUrl}&include_skills=false&include_certifications=true&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=false&include_organizations=true&include_profile_status=true&include_company_public_url=true`,
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
                    },
                }
            );
            if (!res.ok) {
                return { data: DEFAULT_LINKEDIN_PROFILE };
            }
            return res.json();
        } catch {
            return { data: DEFAULT_LINKEDIN_PROFILE };
        }
    },
    ["linkedin-profile"],
    { revalidate: false, tags: ["linkedin"] }
);

export const getLinkedInRecommendations = createCachedFetcher(
    async (linkedinUsername: string) => {
        if (!process.env.RAPIDAPI_KEY) {
            return { data: [] };
        }
        const encodedUrl = encodeURIComponent(
            `https://www.linkedin.com/in/${linkedinUsername}/`
        );
        try {
            const res = await fetch(
                `https://fresh-linkedin-profile-data.p.rapidapi.com/get-recommendations-received?linkedin_url=${encodedUrl}`,
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                        "x-rapidapi-host":
                            "fresh-linkedin-profile-data.p.rapidapi.com",
                    },
                }
            );
            if (!res.ok) {
                return { data: [] };
            }
            return res.json();
        } catch {
            return { data: [] };
        }
    },
    ["linkedin-recommendations"],
    { revalidate: false, tags: ["linkedin"] }
);
