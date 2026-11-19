import { safeFetch } from "./api-cache";
import {
    DEFAULT_CONTRIBUTIONS,
    DEFAULT_GITHUB_REPOS,
    DEFAULT_GITHUB_USER,
    DEFAULT_LINKEDIN_PROFILE,
    getGithubActivity,
    getGithubContributions,
    getGithubRepos,
    getGithubUser,
    getLinkedInProfile,
    getLinkedInRecommendations,
} from "./cached-fetchers";
import type { GitHubRepo } from "@/components/sections/types/projects.types";
import type { GitHubActivityDay, GitHubActivityEvent, GitHubUser } from "@/components/sections/types/social.types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface Role {
    title: string;
    company: string;
    location: string;
    start: string;
    end: string;
    duration: string;
    isCurrent: boolean;
    highlights: string[];
}

export interface RepoItem {
    id: number;
    name: string;
    description: string;
    url: string;
    homepage: string | null;
    language: string | null;
    stars: number;
    forks: number;
    updatedAt: string;
    topics: string[];
}

export interface PortfolioData {
    profile: {
        name: string;
        headline: string;
        location: string;
        jobTitle: string;
        company: string;
        followers: number;
        connections: number;
        joined: string;
        linkedinUrl: string;
        experienceYears: number;
    };
    roles: Role[];
    certifications: { name: string; authority: string; issued: string; url: string }[];
    recommendations: { text: string; username: string; profileUrl: string }[];
    github: {
        login: string;
        bio: string;
        url: string;
        publicRepos: number;
        followers: number;
        following: number;
        gists: number;
        joined: string;
        totalStars: number;
        languages: { name: string; count: number }[];
        contributions: GitHubActivityDay[];
        contributionTotal: number;
        activity: { id: string; type: string; repo: string; createdAt: string }[];
    };
    repos: RepoItem[];
}

interface RawExperience {
    title?: string;
    company?: string;
    location?: string;
    start_year?: number;
    start_month?: number;
    end_year?: number | string;
    end_month?: number | string;
    is_current?: boolean;
    description?: string;
}

const monthsBetween = (fromY: number, fromM: number, toY: number, toM: number) => (toY - fromY) * 12 + (toM - fromM);

export function formatDuration(months: number) {
    const m = Math.max(1, months);
    const y = Math.floor(m / 12);
    const r = m % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, r && `${r} mo${r > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

export function toRole(e: RawExperience, now = new Date()): Role {
    const sy = Number(e.start_year) || now.getFullYear();
    const sm = Number(e.start_month) || 1;
    const current = Boolean(e.is_current) || !e.end_year;
    const ey = current ? now.getFullYear() : Number(e.end_year);
    const em = current ? now.getMonth() + 1 : Number(e.end_month) || 12;
    return {
        title: e.title ?? "",
        company: e.company ?? "",
        location: e.location ?? "",
        start: `${MONTHS[sm - 1]} ${sy}`,
        end: current ? "Present" : `${MONTHS[em - 1]} ${ey}`,
        duration: formatDuration(monthsBetween(sy, sm, ey, em)),
        isCurrent: current,
        highlights: (e.description ?? "")
            .split(/\n+/)
            .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
            .filter(Boolean),
    };
}

const usernameFromUrl = (url = "") => url.replace(/\/+$/, "").split("/").pop() ?? "";

export async function getPortfolioData(githubUsername: string, linkedinUsername: string): Promise<PortfolioData> {
    const [linkedinRaw, recsRaw, ghUser, repos, contributions, activity] = await Promise.all([
        safeFetch(() => getLinkedInProfile(linkedinUsername), { data: DEFAULT_LINKEDIN_PROFILE }, "LinkedIn profile"),
        safeFetch(() => getLinkedInRecommendations(linkedinUsername), { data: [] }, "LinkedIn recommendations"),
        safeFetch(() => getGithubUser(githubUsername), DEFAULT_GITHUB_USER, "GitHub user"),
        safeFetch(() => getGithubRepos(githubUsername), DEFAULT_GITHUB_REPOS, "GitHub repos"),
        safeFetch(() => getGithubContributions(githubUsername), DEFAULT_CONTRIBUTIONS, "GitHub contributions"),
        safeFetch(() => getGithubActivity(githubUsername), [], "GitHub activity"),
    ]);

    // ── LinkedIn ────────────────────────────────────────────
    const li = { ...DEFAULT_LINKEDIN_PROFILE, ...((linkedinRaw as { data?: object })?.data ?? {}) } as typeof DEFAULT_LINKEDIN_PROFILE & {
        experiences?: RawExperience[];
    };
    const now = new Date();
    const rawExperiences: RawExperience[] = li.experiences?.length ? li.experiences : DEFAULT_LINKEDIN_PROFILE.experiences;
    const roles = rawExperiences.map((e) => toRole(e, now));
    const current = roles.find((r) => r.isCurrent) ?? roles[0];

    const earliest = rawExperiences.reduce(
        (min, e) => Math.min(min, (Number(e.start_year) || now.getFullYear()) * 12 + (Number(e.start_month) || 1)),
        Infinity
    );
    const experienceYears = Math.floor((now.getFullYear() * 12 + now.getMonth() + 1 - earliest) / 12);

    const apiRecs = ((recsRaw as { data?: { text?: string; profile_url?: string }[] })?.data ?? []).filter((r) => r?.text);
    const recSource: { text?: string; profile_url?: string; username?: string }[] = apiRecs.length
        ? apiRecs
        : (li.recommendations_received ?? []);
    const recommendations = recSource.map((r) => ({
        text: r.text ?? "",
        profileUrl: r.profile_url ?? "",
        username: r.username || usernameFromUrl(r.profile_url),
    }));

    // ── GitHub ──────────────────────────────────────────────
    const user = (ghUser ?? DEFAULT_GITHUB_USER) as GitHubUser;
    const repoList: GitHubRepo[] = Array.isArray(repos) && repos.length ? repos : DEFAULT_GITHUB_REPOS;

    const langCounts = new Map<string, number>();
    for (const r of repoList) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
    // ponytail: top 6 languages only; add an "Other" bucket if totals ever matter
    const languages = [...langCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);

    const today = now.toISOString().slice(0, 10);
    const contrib = contributions as typeof DEFAULT_CONTRIBUTIONS;
    const days = (contrib?.contributions ?? []).filter((d) => d.date <= today);
    const totals = contrib?.total ?? {};

    const events = (Array.isArray(activity) ? activity : []) as GitHubActivityEvent[];
    const joinedAt = user.created_at ? new Date(user.created_at) : null;

    return {
        profile: {
            name: li.full_name,
            headline: li.headline,
            location: li.location,
            jobTitle: current?.title || li.job_title,
            company: current?.company || li.company,
            followers: li.follower_count,
            connections: li.connection_count,
            joined: (li as { profile_status?: { joined_date?: string } }).profile_status?.joined_date ?? "",
            linkedinUrl: li.linkedin_url,
            experienceYears,
        },
        roles,
        certifications: li.certifications ?? [],
        recommendations,
        github: {
            login: user.login,
            bio: user.bio ?? "",
            url: `https://github.com/${user.login}`,
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            gists: user.public_gists,
            joined: joinedAt ? `${MONTHS[joinedAt.getMonth()]} ${joinedAt.getFullYear()}` : "",
            totalStars: repoList.reduce((s, r) => s + (r.stargazers_count || 0), 0),
            languages,
            contributions: days.slice(-26 * 7),
            contributionTotal: Object.values(totals).reduce((a, b) => a + Number(b || 0), 0),
            activity: events.slice(0, 6).map((e) => ({
                id: e.id,
                type: e.type.replace(/Event$/, ""),
                repo: e.repo?.name ?? "",
                createdAt: e.created_at,
            })),
        },
        repos: repoList.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? "",
            url: r.html_url,
            homepage: r.homepage || null,
            language: r.language,
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            updatedAt: r.updated_at,
            topics: r.topics ?? [],
        })),
    };
}
