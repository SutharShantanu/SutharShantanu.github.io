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
import type { GitHubActivityEvent, GitHubUser } from "@/components/sections/types/social.types";

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

export interface ActivityItem {
    id: string;
    kind: "push" | "pr" | "issue" | "create" | "star" | "fork" | "release" | "other";
    repo: string;
    repoUrl: string;
    title: string;
    branch?: string;
    url: string;
    commits: { sha: string; message: string; url: string }[];
    commitCount?: number;
    ago: string;
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
        /** Every day since the first contribution year, compact: day i = start + i, value = count * 5 + level. */
        contributions: { start: string; days: number[] };
        yearTotals: Record<string, number>;
        contributionTotal: number;
        activity: ActivityItem[];
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
    // Full history (up to today) for the activity calendar's year filter, sorted so day i = start + i.
    const days = [...(contrib?.contributions ?? [])].filter((d) => d.date <= today).sort((x, y) => x.date.localeCompare(y.date));
    const totals = contrib?.total ?? {};

    const events = (Array.isArray(activity) ? activity : []) as GitHubActivityEvent[];
    const activityItems = await buildActivity(events, now);
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
            contributions: { start: days[0]?.date ?? today, days: days.map((d) => d.count * 5 + Math.min(4, Math.max(0, d.level))) },
            yearTotals: Object.fromEntries(Object.entries(totals).map(([y, n]) => [y, Number(n) || 0])),
            contributionTotal: Object.values(totals).reduce((a, b) => a + Number(b || 0), 0),
            activity: activityItems,
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

// ── Recent activity ─────────────────────────────────────────
// GitHub's public events no longer include commits on PushEvent (only ref/before/head),
// so consecutive pushes to the same repo+branch are grouped and enriched with one
// compare call each (cached 30 min alongside the other GitHub data).

const ZERO_SHA = /^0+$/;
const ghHeaders = {
    Accept: "application/vnd.github+json",
    ...(process.env.NEXT_GITHUB_TOKEN && { Authorization: `Bearer ${process.env.NEXT_GITHUB_TOKEN}` }),
};

export function timeAgo(iso: string, now = new Date()) {
    const s = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
    const steps: [number, string][] = [[60, "s"], [60, "m"], [24, "h"], [7, "d"], [4.35, "w"], [12, "mo"]];
    let v = s;
    for (const [size, unit] of steps) {
        if (v < size) return unit === "s" ? "just now" : `${Math.floor(v)}${unit} ago`;
        v /= size;
    }
    return `${Math.floor(v)}y ago`;
}

type RawPayload = {
    ref?: string;
    ref_type?: string;
    before?: string;
    head?: string;
    action?: string;
    pull_request?: { title?: string; number?: number; html_url?: string; merged?: boolean };
    issue?: { title?: string; number?: number; html_url?: string };
    release?: { tag_name?: string; name?: string; html_url?: string };
    forkee?: { full_name?: string; html_url?: string };
};

async function compareCommits(repo: string, before: string, head: string) {
    const url = ZERO_SHA.test(before)
        ? `https://api.github.com/repos/${repo}/commits/${head}`
        : `https://api.github.com/repos/${repo}/compare/${before}...${head}`;
    try {
        const res = await fetch(url, { headers: ghHeaders, next: { revalidate: 1800, tags: ["github"] } });
        if (!res.ok) return null;
        const data = await res.json();
        type C = { sha: string; html_url: string; commit: { message: string } };
        const list: C[] = data.commits ?? [data];
        return {
            total: (data.total_commits as number | undefined) ?? list.length,
            compareUrl: (data.html_url as string | undefined) ?? `https://github.com/${repo}/commit/${head}`,
            commits: list
                .slice(-3)
                .reverse()
                .map((c) => ({ sha: c.sha.slice(0, 7), message: c.commit.message.split("\n")[0], url: c.html_url })),
        };
    } catch {
        return null;
    }
}

async function buildActivity(events: GitHubActivityEvent[], now: Date): Promise<ActivityItem[]> {
    type Group = { e: GitHubActivityEvent; p: RawPayload; before?: string; pushes: number };
    const groups: Group[] = [];
    for (const e of events) {
        const p = (e.payload ?? {}) as unknown as RawPayload;
        const last = groups[groups.length - 1];
        // Events are newest-first: extend the group backwards to the oldest "before".
        if (e.type === "PushEvent" && last?.e.type === "PushEvent" && last.e.repo?.name === e.repo?.name && last.p.ref === p.ref) {
            last.before = p.before;
            last.pushes++;
            continue;
        }
        if (groups.length >= 6) break;
        groups.push({ e, p, before: p.before, pushes: 1 });
    }

    return Promise.all(
        groups.map(async ({ e, p, before }): Promise<ActivityItem> => {
            const repo = e.repo?.name ?? "";
            const repoUrl = `https://github.com/${repo}`;
            const base = { id: e.id, repo, repoUrl, ago: timeAgo(e.created_at, now), commits: [] as ActivityItem["commits"] };
            switch (e.type) {
                case "PushEvent": {
                    const branch = (p.ref ?? "").replace("refs/heads/", "");
                    const cmp = p.head && before ? await compareCommits(repo, before, p.head) : null;
                    const n = cmp?.total;
                    return {
                        ...base,
                        kind: "push",
                        branch,
                        title: n ? `Pushed ${n} commit${n === 1 ? "" : "s"}` : "Pushed commits",
                        url: cmp?.compareUrl ?? `${repoUrl}/tree/${branch}`,
                        commits: cmp?.commits ?? [],
                        commitCount: n,
                    };
                }
                case "PullRequestEvent":
                    return {
                        ...base,
                        kind: "pr",
                        title: `${p.pull_request?.merged ? "Merged" : (p.action ?? "Updated").replace(/^\w/, (c) => c.toUpperCase())} PR #${p.pull_request?.number}: ${p.pull_request?.title ?? ""}`,
                        url: p.pull_request?.html_url ?? repoUrl,
                    };
                case "IssuesEvent":
                    return {
                        ...base,
                        kind: "issue",
                        title: `${(p.action ?? "Updated").replace(/^\w/, (c) => c.toUpperCase())} issue #${p.issue?.number}: ${p.issue?.title ?? ""}`,
                        url: p.issue?.html_url ?? repoUrl,
                    };
                case "CreateEvent":
                    return {
                        ...base,
                        kind: "create",
                        branch: p.ref_type === "branch" ? p.ref : undefined,
                        title: p.ref_type === "repository" ? "Created repository" : `Created ${p.ref_type} ${p.ref ?? ""}`.trim(),
                        url: repoUrl,
                    };
                case "WatchEvent":
                    return { ...base, kind: "star", title: "Starred repository", url: repoUrl };
                case "ForkEvent":
                    return { ...base, kind: "fork", title: `Forked to ${p.forkee?.full_name ?? ""}`.trim(), url: p.forkee?.html_url ?? repoUrl };
                case "ReleaseEvent":
                    return { ...base, kind: "release", title: `Released ${p.release?.tag_name ?? p.release?.name ?? ""}`.trim(), url: p.release?.html_url ?? repoUrl };
                default:
                    return { ...base, kind: "other", title: e.type.replace(/Event$/, ""), url: repoUrl };
            }
        })
    );
}
