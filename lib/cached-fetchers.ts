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

// ─── GitHub ──────────────────────────────────────────────────

export const getGithubRepos = createCachedFetcher(
    async (username: string) => {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos`,
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
            throw new Error(`GitHub repos API returned ${res.status}`);
        }
        return res.json();
    },
    ["github-repos"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubUser = createCachedFetcher(
    async (username: string) => {
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
            throw new Error(`GitHub user API returned ${res.status}`);
        }
        return res.json();
    },
    ["github-user"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubContributions = createCachedFetcher(
    async (username: string) => {
        const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (!res.ok) {
            throw new Error(`GitHub contributions API returned ${res.status}`);
        }
        return res.json();
    },
    ["github-contributions"],
    { revalidate: 3600, tags: ["github"] }
);

export const getGithubActivity = createCachedFetcher(
    async (username: string) => {
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
            throw new Error(`GitHub activity API returned ${res.status}`);
        }
        return res.json();
    },
    ["github-activity"],
    { revalidate: 1800, tags: ["github"] }
);

// ─── LinkedIn (RapidAPI) ─────────────────────────────────────
// revalidate: false → never auto-expire. Bust manually via
// revalidateTag("linkedin") or the /api/revalidate endpoint.

export const getLinkedInProfile = createCachedFetcher(
    async (linkedinUsername: string) => {
        const encodedUrl = encodeURIComponent(
            `https://www.linkedin.com/in/${linkedinUsername}/`
        );
        const res = await fetch(
            `https://${process.env.RAPIDAPI_HOST}/enrich-lead?linkedin_url=${encodedUrl}&include_skills=false&include_certifications=true&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=false&include_organizations=true&include_profile_status=true&include_company_public_url=true`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
                    "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
                },
            }
        );
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(
                `LinkedIn profile API returned ${res.status}: ${errorText}`
            );
        }
        return res.json();
    },
    ["linkedin-profile"],
    { revalidate: false, tags: ["linkedin"] }
);

export const getLinkedInRecommendations = createCachedFetcher(
    async (linkedinUsername: string) => {
        const encodedUrl = encodeURIComponent(
            `https://www.linkedin.com/in/${linkedinUsername}/`
        );
        const res = await fetch(
            `https://fresh-linkedin-profile-data.p.rapidapi.com/get-recommendations-received?linkedin_url=${encodedUrl}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
                    "x-rapidapi-host":
                        "fresh-linkedin-profile-data.p.rapidapi.com",
                },
            }
        );
        if (!res.ok) {
            throw new Error(
                `LinkedIn recommendations API returned ${res.status}`
            );
        }
        return res.json();
    },
    ["linkedin-recommendations"],
    { revalidate: false, tags: ["linkedin"] }
);
