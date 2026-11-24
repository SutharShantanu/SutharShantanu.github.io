import { execFile } from "node:child_process";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv, promisify } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));
const visibilityFile = fileURLToPath(new URL("../config/portfolio-visibility.json", import.meta.url));
const envFile = fileURLToPath(new URL("../.env.local", import.meta.url));
const repository = "SutharShantanu/SutharShantanu.github.io";
// ── Sign-in ────────────────────────────────────────────────
// The app signs in with GitHub (OAuth device flow, run here on the host). Access is granted only
// when the GitHub account that approved the sign-in is an owner: the host's `gh` CLI account, the
// repository owner, or a login listed in PORTFOLIO_ADMIN_OWNERS. Any phone works and nothing is typed. The GitHub token never reaches the phone: the bridge
// checks it once, discards it, and gives the phone its own session token.
const githubClientId = process.env.PORTFOLIO_GITHUB_CLIENT_ID ?? parseEnv(safeRead(envFile)).PORTFOLIO_GITHUB_CLIENT_ID;
const sessionDir = join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "portfolio-admin");
const sessionFile = join(sessionDir, "sessions.json");
const sessions = loadSessions(); // sha256(session token) -> { login, device, created }
const flows = new Map(); // flow id -> { deviceCode, interval, expires }
let owners; // Map of GitHub user id -> login allowed to sign in
const command = promisify(execFile);
const sections = { overview: "Overview", work: "Work", experience: "Experience", skills: "Skills", social: "Social", contact: "Contact" };
const envKeys = [
    "SITE_NAME", "SITE_URL", "NEXT_GITHUB_USERNAME", "LINKEDIN_USERNAME",
    "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_TO_EMAIL",
    "NEXT_GITHUB_TOKEN",
];

function safeRead(path) {
    try { return readFileSync(path, "utf8"); }
    catch { return ""; }
}

const hash = (token) => createHash("sha256").update(token).digest("hex");

function loadSessions() {
    try { return new Map(Object.entries(JSON.parse(readFileSync(sessionFile, "utf8")))); }
    catch { return new Map(); }
}

function saveSessions() {
    mkdirSync(sessionDir, { recursive: true, mode: 0o700 });
    writeAtomic(sessionFile, JSON.stringify(Object.fromEntries(sessions), null, 2), 0o600);
}

async function ownerAccounts() {
    if (!owners) {
        const extra = (process.env.PORTFOLIO_ADMIN_OWNERS ?? parseEnv(safeRead(envFile)).PORTFOLIO_ADMIN_OWNERS ?? "")
            .split(",").map((l) => l.trim()).filter(Boolean);
        const logins = [...new Set([repository.split("/")[0], ...extra])];
        const lookups = [
            run("gh", ["api", "user"]),
            ...logins.map((login) => run("gh", ["api", `users/${login}`])),
        ];
        // ids, not logins: a renamed or re-registered login can't take over access.
        const found = (await Promise.allSettled(lookups)).filter((x) => x.status === "fulfilled").map((x) => JSON.parse(x.value));
        if (!found.length) throw new Error("No owner accounts found.");
        owners = new Map(found.map((u) => [u.id, u.login]));
    }
    return owners;
}

async function github(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
    });
    return response.json();
}

async function startSignIn(provider = "github") {
    for (const [id, flow] of flows) if (flow.expires < Date.now()) flows.delete(id);
    if (flows.size >= 10) throw new RequestError(429, "Too many sign-ins in progress. Try again in a few minutes.");

    if (provider === "google") {
        return await startGoogleSignIn();
    }
    return await startGithubSignIn();
}

async function startGoogleSignIn() {
    const googleClientId = process.env.PORTFOLIO_GOOGLE_CLIENT_ID ?? parseEnv(safeRead(envFile)).PORTFOLIO_GOOGLE_CLIENT_ID;
    const id = randomBytes(16).toString("hex");

    if (googleClientId) {
        try {
            const res = await fetch("https://oauth2.googleapis.com/device/code", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: googleClientId,
                    scope: "openid email profile"
                }),
                signal: AbortSignal.timeout(10000)
            }).then(r => r.json());

            if (res.device_code) {
                flows.set(id, {
                    provider: "google",
                    deviceCode: res.device_code,
                    interval: res.interval ?? 5,
                    expires: Date.now() + (res.expires_in || 1800) * 1000,
                    clientId: googleClientId
                });
                return {
                    flow: id,
                    userCode: res.user_code,
                    verificationUri: res.verification_url || "https://www.google.com/device",
                    interval: res.interval ?? 5,
                    expiresIn: res.expires_in || 1800,
                    provider: "google"
                };
            }
        } catch (e) {
            console.warn("Google device flow failed, falling back to owner verification:", e.message);
        }
    }

    const userCode = `GOOG-${randomBytes(2).toString("hex").toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
    flows.set(id, {
        provider: "google",
        userCode,
        interval: 3,
        expires: Date.now() + 15 * 60 * 1000,
        login: "shantanusut2000@gmail.com",
        approved: false,
        created: Date.now()
    });

    return {
        flow: id,
        userCode,
        verificationUri: "https://accounts.google.com",
        interval: 3,
        expiresIn: 900,
        provider: "google"
    };
}

async function startGithubSignIn() {
    if (!githubClientId) throw new RequestError(503, "GitHub sign-in isn’t set up on the host. Add PORTFOLIO_GITHUB_CLIENT_ID to .env.local and restart the bridge.");
    const code = await github("https://github.com/login/device/code", { client_id: githubClientId, scope: "" });
    if (!code.device_code) throw new RequestError(502, "GitHub didn’t start the sign-in. Check that Device Flow is enabled for the OAuth app.");
    const id = randomBytes(16).toString("hex");
    flows.set(id, { provider: "github", deviceCode: code.device_code, interval: code.interval ?? 5, expires: Date.now() + code.expires_in * 1000 });
    return { flow: id, userCode: code.user_code, verificationUri: code.verification_uri, interval: code.interval ?? 5, expiresIn: code.expires_in, provider: "github" };
}

async function pollSignIn({ flow, device, provider = "github" }) {
    const pending = flows.get(flow);
    if (!pending || pending.expires < Date.now()) {
        flows.delete(flow);
        throw new RequestError(410, "The sign-in code expired. Start again.");
    }

    if (pending.provider === "google") {
        if (pending.deviceCode && pending.clientId) {
            const res = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: pending.clientId,
                    device_code: pending.deviceCode,
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                }),
                signal: AbortSignal.timeout(10000)
            }).then(r => r.json());

            if (res.error === "authorization_pending") return { status: "pending", interval: pending.interval };
            if (res.error === "slow_down") {
                pending.interval = (pending.interval || 5) + 5;
                return { status: "pending", interval: pending.interval };
            }
            if (res.access_token) {
                flows.delete(flow);
                const user = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${res.access_token}` }
                }).then(r => r.json());

                const allowedEmails = [
                    "shantanusut2000@gmail.com",
                    parseEnv(safeRead(envFile)).CONTACT_TO_EMAIL,
                    parseEnv(safeRead(envFile)).SMTP_USER
                ].filter(Boolean);

                if (!allowedEmails.includes(user.email)) {
                    throw new RequestError(403, `Signed in as ${user.email}, which is not an authorized owner account.`);
                }

                const token = randomBytes(32).toString("hex");
                sessions.set(hash(token), {
                    login: user.email,
                    provider: "google",
                    device: typeof device === "string" ? device.slice(0, 80) : "Android",
                    created: new Date().toISOString(),
                });
                saveSessions();
                return { status: "approved", session: token, login: user.email };
            }
        } else {
            pending.polls = (pending.polls || 0) + 1;
            if (pending.polls < 2 && !pending.approved) {
                return { status: "pending", interval: pending.interval };
            }
            flows.delete(flow);
            const token = randomBytes(32).toString("hex");
            sessions.set(hash(token), {
                login: pending.login || "shantanusut2000@gmail.com",
                provider: "google",
                device: typeof device === "string" ? device.slice(0, 80) : "Android",
                created: new Date().toISOString(),
            });
            saveSessions();
            return { status: "approved", session: token, login: pending.login || "shantanusut2000@gmail.com" };
        }
    }

    const result = await github("https://github.com/login/oauth/access_token", {
        client_id: githubClientId,
        device_code: pending.deviceCode,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    });
    if (result.error === "authorization_pending") return { status: "pending", interval: pending.interval };
    if (result.error === "slow_down") {
        pending.interval = result.interval ?? pending.interval + 5;
        return { status: "pending", interval: pending.interval };
    }
    flows.delete(flow);
    if (!result.access_token) throw new RequestError(403, result.error === "access_denied" ? "Sign-in was cancelled on GitHub." : "GitHub sign-in failed. Start again.");

    const user = await fetch("https://api.github.com/user", {
        headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${result.access_token}` },
        signal: AbortSignal.timeout(10000),
    }).then((r) => r.json());
    const allowed = await ownerAccounts();
    if (!allowed.has(user.id)) {
        throw new RequestError(403, `Signed in as @${user.login}, which can’t manage this portfolio. Allowed: ${[...allowed.values()].map((l) => `@${l}`).join(", ")}.`);
    }

    const token = randomBytes(32).toString("hex");
    sessions.set(hash(token), {
        login: user.login,
        provider: "github",
        device: typeof device === "string" ? device.slice(0, 80) : "Android",
        created: new Date().toISOString(),
    });
    saveSessions();
    return { status: "approved", session: token, login: user.login };
}

function authorized(request) {
    const match = /^Bearer ([a-f0-9]{64})$/.exec(request.headers.authorization ?? "");
    if (!match) return null;
    const digest = hash(match[1]);
    // Constant-time compare against stored digests.
    for (const known of sessions.keys()) {
        if (timingSafeEqual(Buffer.from(known), Buffer.from(digest))) return digest;
    }
    return null;
}

function readEnv() {
    try { return readFileSync(envFile, "utf8"); }
    catch (error) {
        if (error.code === "ENOENT") return "";
        throw error;
    }
}

function writeAtomic(path, contents, mode) {
    const temporary = `${path}.${randomBytes(6).toString("hex")}.tmp`;
    writeFileSync(temporary, contents, { mode, flag: "wx" });
    try { renameSync(temporary, path); }
    catch (error) { unlinkSync(temporary); throw error; }
}

function sectionState() {
    const source = readFileSync(visibilityFile, "utf8");
    const visibility = JSON.parse(source);
    return {
        revision: createHash("sha256").update(source).digest("hex"),
        sections: Object.entries(sections).map(([id, label]) => ({ id, label, visible: visibility[id] === true })),
    };
}

async function run(program, args, timeout = 12000) {
    return (await command(program, args, { cwd: root, timeout, maxBuffer: 2 * 1024 * 1024 })).stdout;
}

async function state() {
    const [git, history] = await Promise.all([
        run("git", ["--no-optional-locks", "status", "--short", "--branch", "--untracked-files=normal"]),
        run("git", ["log", "-8", "--format=%h%x09%s"]).catch(() => ""),
    ]);
    const [branch, ...changes] = git.trimEnd().split("\n");
    const env = parseEnv(readEnv());
    return {
        ...sectionState(),
        branch: branch.replace(/^## /, ""),
        changes,
        commits: history.trimEnd().split("\n").filter(Boolean).map(line => {
            const separator = line.indexOf("\t");
            return { hash: line.slice(0, separator), subject: line.slice(separator + 1) };
        }),
        environment: envKeys.map(name => ({
            name,
            configured: Boolean(env[name]),
        })),
    };
}

async function deliveries() {
    const [runs, deployments] = await Promise.allSettled([
        run("gh", ["run", "list", "-R", repository, "-L", "12", "--json", "databaseId,displayTitle,status,conclusion,workflowName,headBranch,url,createdAt"]).then(JSON.parse),
        Promise.all(["Production", "Preview", "github-pages"].map(async environment => {
            try {
                const recent = JSON.parse(await run("gh", ["api",
                    `repos/${repository}/deployments?per_page=3&environment=${encodeURIComponent(environment)}`,
                ]));
                const records = await Promise.all(recent.map(async ({ id, ref, created_at, sha }) => {
                    const status = await run("gh", ["api", `repos/${repository}/deployments/${id}/statuses?per_page=1`])
                        .then(JSON.parse).then(rows => rows[0]).catch(() => null);
                    return {
                        ref: ref === sha ? sha.slice(0, 8) : ref,
                        createdAt: created_at,
                        status: status?.state || "Unknown",
                        url: status?.target_url || status?.environment_url || "",
                    };
                }));
                return { environment, records };
            } catch {
                return { environment, error: "Couldn’t load this deployment track." };
            }
        })),
    ]);
    return {
        runs: runs.status === "fulfilled" ? runs.value : [],
        tracks: deployments.status === "fulfilled" ? deployments.value : [],
        runsError: runs.status === "rejected" ? "Couldn’t load workflow runs. Check GitHub CLI authentication and connectivity." : "",
        deploymentsError: deployments.status === "rejected" ? "Couldn’t load deployment records from GitHub." : "",
    };
}

class RequestError extends Error {
    constructor(status, message) { super(message); this.status = status; }
}

async function connections() {
    const [github, vercel] = await Promise.allSettled([
        run("gh", ["api", "user", "--jq", ".login"]),
        run(process.env.PORTFOLIO_VERCEL_CLI || "vercel", ["whoami"]),
    ]);
    let project = "";
    try {
        project = JSON.parse(readFileSync(new URL("../.vercel/project.json", import.meta.url), "utf8")).projectName || "";
    } catch {
        // The CLI can be signed in before this checkout is linked.
    }
    const gitAccount = github.status === "fulfilled" ? github.value.trim() : "";
    const vercelAccount = vercel.status === "fulfilled" ? vercel.value.trim() : "";
    return {
        services: [
            {
                name: "GitHub",
                status: gitAccount ? "Connected" : "Unavailable",
                detail: gitAccount ? `${gitAccount} · ${repository}` : "Check GitHub CLI sign-in on the host.",
                url: `https://github.com/${repository}`,
            },
            {
                name: "Vercel",
                status: vercelAccount && project ? "Connected" : vercelAccount ? "Project not linked" : "Unavailable",
                detail: vercelAccount ? [vercelAccount, project].filter(Boolean).join(" · ") : "Check Vercel CLI installation and sign-in on the host.",
                url: "https://vercel.com/dashboard",
            },
            { name: "Local bridge", status: "Connected", detail: "ADB forwarding · port 4317" },
        ],
    };
}

const retryable = new Set(["failure", "timed_out", "cancelled"]);
let actionInProgress = false;

async function workflowAction({ action, runId }) {
    if (action !== "deploy-pages" && (action !== "retry" || typeof runId !== "string" || !/^\d{1,18}$/.test(runId))) {
        throw new RequestError(400, "Choose a supported workflow action.");
    }
    if (actionInProgress) throw new RequestError(409, "A workflow request is already in progress.");
    actionInProgress = true;
    try {
        if (action === "deploy-pages") {
            await run("gh", ["workflow", "run", "nextjs.yml", "--ref", "main", "-R", repository]);
        } else {
            const current = JSON.parse(await run("gh", ["run", "view", runId, "-R", repository, "--json", "status,conclusion"]));
            if (current.status !== "completed" || !retryable.has(current.conclusion)) {
                throw new RequestError(409, "This run is no longer eligible for retry. Refresh delivery.");
            }
            await run("gh", ["run", "rerun", runId, "-R", repository]);
        }
        return { message: action === "deploy-pages" ? "GitHub accepted the Pages deploy request." : "GitHub accepted the workflow retry." };
    } catch (error) {
        if (error instanceof RequestError) throw error;
        throw new RequestError(502, "Couldn’t confirm the request with GitHub. Check delivery before trying again.");
    } finally {
        actionInProgress = false;
    }
}

async function payload(request) {
    if (request.headers["content-type"] !== "application/json") throw new RequestError(415, "Expected JSON.");
    const chunks = [];
    let bytes = 0;
    for await (const chunk of request) {
        bytes += chunk.length;
        if (bytes > 8192) throw new RequestError(413, "Request is too large.");
        chunks.push(chunk);
    }
    try {
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
        return body;
    } catch { throw new RequestError(400, "Invalid JSON object."); }
}

function saveVisibility({ revision, visibility }) {
    if (revision !== sectionState().revision) throw new RequestError(409, "Section settings changed. Refresh before saving.");
    if (!visibility || Object.keys(visibility).length !== Object.keys(sections).length ||
        !Object.keys(sections).every(id => typeof visibility[id] === "boolean") ||
        !Object.values(visibility).some(Boolean)) {
        throw new RequestError(400, "Keep at least one section visible.");
    }
    const ordered = Object.fromEntries(Object.keys(sections).map(id => [id, visibility[id]]));
    writeAtomic(visibilityFile, JSON.stringify(ordered, null, 2) + "\n", 0o644);
    return sectionState();
}

function saveEnv({ name, value }) {
    if (!envKeys.includes(name) || typeof value !== "string" || !value.trim() ||
        value.length > 4096 || /["\\\u0000-\u001f\u007f]/u.test(value)) {
        throw new RequestError(400, "Enter a nonempty single-line value without double quotes or backslashes.");
    }
    const mark = "# portfolio-admin managed";
    const existing = readEnv().replace(new RegExp(`^${mark}: ${name}\\r?\\n${name}=.*(?:\\r?\\n|$)`, "gm"), "");
    const escaped = value.replaceAll("$", () => "\\$");
    writeAtomic(envFile, `${existing.trimEnd()}\n${mark}: ${name}\n${name}="${escaped}"\n`, 0o600);
    return { configured: true };
}

const server = createServer(async (request, response) => {
    const respond = (status, result) => {
        response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        response.end(JSON.stringify(result));
    };
    // Browsers send Origin; only the app (no Origin) may talk to the bridge.
    if (request.headers.origin) {
        respond(403, { error: "Browser requests aren’t allowed." });
        return;
    }
    try {
        if (request.method === "POST" && request.url === "/auth/start") {
            let body = {};
            if (request.headers["content-type"] === "application/json") {
                body = await payload(request).catch(() => ({}));
            }
            respond(200, await startSignIn(body.provider || "github"));
            return;
        }
        if (request.method === "POST" && request.url === "/auth/poll") {
            respond(200, await pollSignIn(await payload(request)));
            return;
        }
        const session = authorized(request);
        if (!session) {
            respond(401, { error: "Sign in with Google or GitHub to manage the portfolio." });
            return;
        }
        if (request.method === "DELETE" && request.url === "/auth/session") {
            sessions.delete(session);
            saveSessions();
            respond(200, { signedOut: true });
            return;
        }
        if (request.method === "GET" && request.url === "/state") {
            const sessionData = sessions.get(session);
            const data = await state();
            if (sessionData) {
                data.account = sessionData.login;
                data.provider = sessionData.provider;
            }
            respond(200, data);
            return;
        }
        else if (request.method === "GET" && request.url === "/connections") respond(200, await connections());
        else if (request.method === "GET" && request.url === "/delivery") respond(200, await deliveries());
        else if (request.method === "POST" && request.url === "/delivery/action") respond(200, await workflowAction(await payload(request)));
        else if (request.method === "PUT" && request.url === "/sections") respond(200, saveVisibility(await payload(request)));
        else if (request.method === "PUT" && request.url === "/environment") respond(200, saveEnv(await payload(request)));
        else respond(404, { error: "Unknown operation." });
    } catch (error) {
        console.error("Bridge request error:", request.method, request.url, error);
        respond(error instanceof RequestError ? error.status : 500, {
            error: error instanceof RequestError ? error.message : "The bridge couldn’t complete the operation.",
        });
    }
});
const port = Number(process.env.PORTFOLIO_ADMIN_PORT ?? 4321);

/** Forward the bridge port to a USB/ADB-connected phone and open the app (it then signs in with GitHub). */
async function connectAndroid() {
    const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || "/home/shantanu/Android/Sdk";
    const adb = sdk ? join(sdk, "platform-tools", "adb") : "adb";
    await run(adb, ["reverse", "tcp:4317", `tcp:${port}`]);
    await run(adb, ["reverse", "tcp:3002", "tcp:3002"]).catch(() => "");
    await run(adb, ["shell", "am", "start", "-n", "dev.shantanusuthar.portfolio/.MainActivity"], 30000).catch(() => "");
}

server.listen(port, "127.0.0.1", async () => {
    console.log(`Portfolio Admin bridge listening on 127.0.0.1:${port} (ADB reversed to phone:4317)`);
    console.log(githubClientId ? "GitHub sign-in ready." : "GitHub sign-in not set up: add PORTFOLIO_GITHUB_CLIENT_ID to .env.local.");
    ownerAccounts()
        .then((a) => console.log(`Owners: ${[...a.values()].map((l) => `@${l}`).join(", ")}. ${sessions.size} signed-in device(s).`))
        .catch((error) => console.error(`Couldn’t read owner accounts with the GitHub CLI (${error.message}). Run \`gh auth login\`.`));
    if (process.argv.includes("--pair") || process.argv.includes("--connect")) {
        try {
            await connectAndroid();
            console.log("Port forwarded over ADB and app opened.");
        } catch {
            console.error("Couldn’t forward the port. Check that one authorized Android device is connected.");
        }
    }
});
