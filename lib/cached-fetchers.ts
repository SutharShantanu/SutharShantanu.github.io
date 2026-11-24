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
import { GitHubActivityDay, GitHubActivityEvent, GitHubUser } from "@/components/sections/types/social.types";

// ─── Default Fallback Data ───────────────────────────────────

// Fallback mirrors the public LinkedIn profile (used when RAPIDAPI_* env vars are absent).
// Keep in sync with linkedin.com/in/shantanu-suthar.
export const DEFAULT_LINKEDIN_PROFILE = {
    full_name: "Shantanu Suthar",
    headline: "SDE @WhizHack | Next.js & TypeScript | Scalable UI/UX Solutions | MERN Stack | Tailwind CSS",
    location: "Gurugram, Haryana, India",
    company: "WhizHack Technologies",
    job_title: "Software Engineer",
    linkedin_url: "https://linkedin.com/in/shantanu-suthar",
    follower_count: 514,
    connection_count: 514,
    is_verified: true,
    languages: [
        { name: "English", proficiency: "Professional" },
        { name: "Hindi", proficiency: "Native" },
    ],
    current_job_duration: "",
    current_company_join_year: 2025,
    current_company_join_month: 8,
    profile_status: { joined_date: "July 2020" },
    certifications: [
        { name: "TypeScript Variables and Data Types", authority: "Coursera Project Network", issued: "Jun 2025", url: "" },
        { name: "JavaScript (Basic) Certificate", authority: "HackerRank", issued: "Jun 2023", url: "" },
        { name: "Full Stack Web Development", authority: "Masai", issued: "May 2023", url: "" },
        { name: "Basics of Web Development", authority: "Masai", issued: "Jul 2022", url: "" },
        { name: "Responsive Web Design", authority: "freeCodeCamp", issued: "Dec 2021", url: "" },
        { name: "HTML5", authority: "Udemy", issued: "Dec 2021", url: "" },
    ],
    experiences: [
        {
            title: "Software Engineer",
            company: "WhizHack Technologies",
            location: "Gurugram, Haryana, India",
            start_year: 2025, start_month: 8, end_year: "", end_month: "",
            is_current: true,
            description: "",
        },
        {
            title: "Associate Frontend Developer",
            company: "Infyni",
            location: "Gurugram, Haryana, India",
            start_year: 2023, start_month: 10, end_year: 2025, end_month: 8,
            is_current: false,
            description:
                "Built an internal HR portal with modular React + TypeScript components, advanced filter tables and modal workflows.\nIntegrated NextAuth.js session-based access control and protected routes.\nStreamlined build pipelines, resolved client-facing production issues and improved SEO benchmarks.",
        },
        {
            title: "Front End Developer",
            company: "Branding Pioneers",
            location: "Gurugram, Haryana, India",
            start_year: 2023, start_month: 8, end_year: 2023, end_month: 10,
            is_current: false,
            description:
                "Engineered responsive, high-conversion landing pages with Tailwind CSS.\nImplemented structured metadata, OpenGraph tags and Google Analytics event funnels.",
        },
        {
            title: "Internship Trainee",
            company: "Masai",
            location: "Bengaluru, Karnataka, India",
            start_year: 2022, start_month: 7, end_year: 2023, end_month: 6,
            is_current: false,
            description:
                "1,000+ hours of full-stack engineering (MERN, DSA, clean code).\nLed sprint planning and Git feature-branch workflows on full-stack capstone projects.",
        },
    ],
    recommendations_received: [
        {
            username: "ishan-bhatia-a",
            name: "Ishan Bhatia",
            profile_url: "https://linkedin.com/in/ishan-bhatia-a",
            text: "Shantanu consistently demonstrated strong technical expertise, problem-solving abilities, and a keen eye for detail. One of his greatest strengths is his ability to complete projects efficiently and on time, without compromising on quality. … Any team would be fortunate to have him.",
        },
        {
            username: "sudhanshu-singh-",
            name: "Sudhanshu Singh",
            profile_url: "https://linkedin.com/in/sudhanshu-singh-",
            text: "…he is one of the most dependable and skilled frontend developers I’ve worked with. … The result? A 30% increase in lead conversions and a much lower bounce rate.",
        },
        {
            username: "ayushbhatia",
            name: "Ayush Bhatia",
            profile_url: "https://linkedin.com/in/ayushbhatia",
            text: "He took the time to understand my vision and delivered a beautiful, user-friendly, and responsive website that exceeded my expectations. … The project was completed ahead of schedule without compromising on quality.",
        },
    ],
};

export const DEFAULT_CONTRIBUTIONS: { total: Record<string, number>; contributions: GitHubActivityDay[] } = {
    total: { "2024": 72, "2025": 76, "2026": 147 },
    contributions: [],
};

// ─── GitHub ──────────────────────────────────────────────────
// Fetchers THROW on failure: unstable_cache never stores an error, so a single bad
// response can't blank the page for an hour. safeFetch (api-cache.ts) then serves the
// last good result, falling back to the committed snapshot (scripts/snapshot-github.mjs).

const ghHeaders = (accept = "application/vnd.github+json") => ({
    Accept: accept,
    ...(process.env.NEXT_GITHUB_TOKEN && { Authorization: `Bearer ${process.env.NEXT_GITHUB_TOKEN}` }),
});

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), ...init });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json() as Promise<T>;
}

export const getGithubRepos = createCachedFetcher(
    async (username: string) => {
        const data = await getJson<GitHubRepo[]>(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
            headers: ghHeaders("application/vnd.github.mercy-preview+json"),
        });
        if (!Array.isArray(data) || !data.length) throw new Error("no repos");
        return data;
    },
    ["github-repos-v2"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubUser = createCachedFetcher(
    (username: string) => getJson<GitHubUser>(`https://api.github.com/users/${username}`, { headers: ghHeaders() }),
    ["github-user"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubContributions = createCachedFetcher(
    async (username: string) => {
        const data = await getJson<typeof DEFAULT_CONTRIBUTIONS>(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (!data?.contributions?.length) throw new Error("empty contributions");
        return data;
    },
    ["github-contributions"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubActivity = createCachedFetcher(
    async (username: string) => {
        const data = await getJson<GitHubActivityEvent[]>(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers: ghHeaders() });
        if (!Array.isArray(data) || !data.length) throw new Error("no events");
        return data;
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
