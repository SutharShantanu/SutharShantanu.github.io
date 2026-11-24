import { createHash, randomBytes } from "node:crypto";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

const token = "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90";
const hash = createHash("sha256").update(token).digest("hex");

const configDir = join(homedir(), ".config", "portfolio-admin");
mkdirSync(configDir, { recursive: true });
const sessionFile = join(configDir, "sessions.json");
const sessions = {
    [hash]: {
        login: "SutharShantanu",
        device: "Nothing Phone A009P",
        created: Date.now(),
    },
};
writeFileSync(sessionFile, JSON.stringify(sessions, null, 2));
console.log("Wrote session on host:", hash);

const adb = "/home/shantanu/Android/Sdk/platform-tools/adb -s 00365767F005601";
execSync(`${adb} reverse tcp:4317 tcp:4317`);
console.log("Reversed port 4317 to phone");

// Inject session into phone
execSync(`${adb} shell "run-as dev.shantanusuthar.portfolio sh -c 'echo -n ${token} > no_backup/portfolio-admin-session'"` );
console.log("Injected session token into phone app storage");
