// Refresh the committed GitHub fallback used when live APIs fail or rate-limit.
// Usage: node scripts/snapshot-github.mjs [username]   (set NEXT_GITHUB_TOKEN for higher limits)
import { writeFileSync } from "node:fs";

const user = process.argv[2] ?? "SutharShantanu";
const headers = { Accept: "application/vnd.github.mercy-preview+json", ...(process.env.NEXT_GITHUB_TOKEN && { Authorization: `Bearer ${process.env.NEXT_GITHUB_TOKEN}` }) };
const get = async (url, h = headers) => {
    const res = await fetch(url, { headers: h });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
};

const pick = (o, keys) => Object.fromEntries(keys.filter((k) => o?.[k] !== undefined).map((k) => [k, o[k]]));

const [profile, repos, contributions, events] = await Promise.all([
    get(`https://api.github.com/users/${user}`),
    get(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`),
    get(`https://github-contributions-api.jogruber.de/v4/${user}`, {}),
    get(`https://api.github.com/users/${user}/events/public?per_page=100`),
]);

const snapshot = {
    takenAt: new Date().toISOString(),
    // Keep only the fields lib/portfolio-data.ts reads, so the file stays small.
    user: pick(profile, ["login", "name", "avatar_url", "bio", "public_repos", "public_gists", "followers", "following", "created_at"]),
    repos: repos.map((r) => pick(r, ["id", "name", "description", "html_url", "homepage", "language", "stargazers_count", "forks_count", "updated_at", "pushed_at", "topics", "fork"])),
    contributions,
    events: events.map((e) => ({
        id: e.id,
        type: e.type,
        created_at: e.created_at,
        repo: { name: e.repo.name },
        payload: {
            ...pick(e.payload, ["ref", "ref_type", "before", "head", "action"]),
            pull_request: e.payload.pull_request && pick(e.payload.pull_request, ["title", "number", "html_url", "merged"]),
            issue: e.payload.issue && pick(e.payload.issue, ["title", "number", "html_url"]),
            release: e.payload.release && pick(e.payload.release, ["tag_name", "name", "html_url"]),
            forkee: e.payload.forkee && pick(e.payload.forkee, ["full_name", "html_url"]),
        },
    })),
};
writeFileSync(new URL("../lib/snapshots/github.json", import.meta.url), JSON.stringify(snapshot));
console.log(`snapshot: ${repos.length} repos, ${contributions.contributions.length} days, ${events.length} events`);
