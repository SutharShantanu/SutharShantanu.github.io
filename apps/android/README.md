# Portfolio Admin for Android

Manage the portfolio checkout with Kotlin, Jetpack Compose, and Material 3 Expressive.

The app requires Android 17 (API 37). With an Android 17 device or emulator connected, install the debug app from `apps/android` using JDK 17 or later and Android SDK 37.

```sh
./gradlew :app:installDebug
```

From the website repository root, start the loopback bridge with Node.js 20.12 or newer. `--connect` forwards port 4317 to the connected device over ADB and opens the app.

```sh
node scripts/portfolio-admin.mjs --connect
```

### Sign-in (no pairing key)

The app signs in with GitHub using the OAuth device flow, run by the bridge. Tap **Sign in with GitHub**, then enter the shown code on github.com (from any browser) and approve. The bridge grants access only when the approving account is an owner:

- the GitHub CLI account on the host (`gh auth status`)
- the repository owner (`SutharShantanu`)
- any login in `PORTFOLIO_ADMIN_OWNERS` (comma-separated)

Owners are matched by GitHub user ID. The GitHub token stays on the host and is discarded after the check. The phone gets its own session token, stored in the app's no-backup directory. The host stores only SHA-256 hashes of sessions, in `~/.config/portfolio-admin/sessions.json`. Sessions survive bridge restarts. **Settings → Sign out of this device** revokes the session on the host.

One-time setup: create a GitHub OAuth App at https://github.com/settings/applications/new. Any homepage and callback URL work, for example the portfolio URL. Tick **Enable Device Flow**, then add its client ID to the checkout's `.env.local`. The client ID isn't secret, and no client secret is needed.

```sh
PORTFOLIO_GITHUB_CLIENT_ID=Ov23li...
```

The bridge uses `adb` from `ANDROID_HOME`, `ANDROID_SDK_ROOT`, or PATH. Set `ANDROID_SERIAL` if multiple devices are connected.

- **Sections** saves public navigation and panel visibility to `config/portfolio-visibility.json`. Keep at least one section visible. Commit and deploy the configuration to publish changes.
- **Env** sets supported values in the checkout’s ignored `.env.local` file. Current values are never returned by the bridge. Restart the local site to apply them.
- **Git** shows local branch status and recent commits. Under **CI runs**, it also shows GitHub Actions and GitHub Pages deployment history. You can retry eligible workflows or dispatch GitHub Pages from remote `main` after confirming.
- **Vercel** shows Production and Preview deployments reported to GitHub. The bridge uses the host’s GitHub CLI session for both tabs. Run `gh auth status` on the host to check it.
- **Preview** opens the public Vercel production URL in the app, with reload and an external browser link.
- **Settings** shows the host bridge, GitHub CLI account, and Vercel CLI account and project link. The bridge uses `vercel` from its PATH by default. Set `PORTFOLIO_VERCEL_CLI` to the executable path if it is installed elsewhere.

The TypeScript Expo project is documented in [README.expo.md](README.expo.md).
