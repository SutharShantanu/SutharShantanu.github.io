package dev.shantanusuthar.portfolio

import android.app.Application
import android.content.Context
import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import java.io.File
import java.io.IOException
import java.net.ConnectException
import java.net.HttpURLConnection
import java.net.SocketTimeoutException
import java.net.URI
import java.net.URLEncoder
import java.net.UnknownHostException
import java.security.KeyStore
import java.time.Instant
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.net.ssl.SSLException
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import org.json.JSONArray
import org.json.JSONObject

private const val GITHUB_CLIENT_ID = "Ov23liLeiWseS3EVEDTg"
private const val GITHUB_DEVICE_URL = "https://github.com/login/device/code"
private const val GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
private const val VERCEL_CLIENT_ID = "cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp"
private const val VERCEL_DEVICE_URL = "https://api.vercel.com/login/oauth/device-authorization"
private const val VERCEL_TOKEN_URL = "https://api.vercel.com/login/oauth/token"
private const val REPO_OWNER = "SutharShantanu"
private const val REPO = "SutharShantanu/SutharShantanu.github.io"
private const val GH = "https://api.github.com/repos/$REPO"
private const val VISIBILITY_PATH = "config/portfolio-visibility.json"
private const val VERCEL_PROJECT = "prj_VJmZSqnuthpX7jZ8YpBBVRNhEevR"
private const val VERCEL_TEAM = "team_ApPVOEKwfY4plv9XlEaa2pFN"
private const val VERCEL_ENV = "https://api.vercel.com/v10/projects/$VERCEL_PROJECT/env?teamId=$VERCEL_TEAM"

/**
 * Standalone admin: talks to GitHub and Vercel over HTTPS from the phone. No host bridge, no USB.
 * Tokens are sealed with an Android Keystore AES-GCM key and kept in no-backup storage.
 */
internal class AdminState(application: Application) : AndroidViewModel(application) {
    private class DeviceAuthState(
        val pendingFile: File,
        val setSignIn: (SignIn?) -> Unit,
        val setStarting: (Boolean) -> Unit,
    ) {
        var job: Job? = null
        var generation = 0
        var lastPollAt = 0L
        var pollIntervalMs = 5_000L
        var lastTransientError = false
        val pollNow = Channel<Unit>(Channel.CONFLATED)
    }

    private data class DeviceFlowSpec(
        val serviceLabel: String,
        val authUrl: String,
        val tokenUrl: String,
        val clientId: String,
        val scope: String,
        val preferCompleteUri: Boolean = false,
    )

    private val prefs = application.getSharedPreferences("portfolio_admin_prefs", Context.MODE_PRIVATE)
    private val sessionFile = application.noBackupFilesDir.resolve("portfolio-admin-session")
    private val githubFlow = DeviceAuthState(
        pendingFile = application.noBackupFilesDir.resolve("portfolio-admin-sign-in"),
        setSignIn = { signIn = it },
        setStarting = { busy = it },
    )
    private val vercelFlow = DeviceAuthState(
        pendingFile = application.noBackupFilesDir.resolve("portfolio-admin-vercel-sign-in"),
        setSignIn = { vercelSignIn = it },
        setStarting = { vercelConnecting = it },
    )
    private val vercelMutex = Mutex()
    private var github = ""
    private var vercel = ""
    private var vercelRefresh = ""
    private var vercelExpiresAt = 0L
    private var hiddenEnvKeys = emptySet<String>()

    var signIn by mutableStateOf<SignIn?>(null)
        private set
    var vercelSignIn by mutableStateOf<SignIn?>(null)
        private set
    var vercelConnecting by mutableStateOf(false)
        private set
    var signedIn by mutableStateOf(false)
        private set
    var account by mutableStateOf("")
        private set
    var workspace by mutableStateOf<WorkspaceState?>(null)
        private set
    var delivery by mutableStateOf<DeliveryState?>(null)
        private set
    var connections by mutableStateOf<List<ServiceConnection>?>(null)
        private set
    var busy by mutableStateOf(false)
        private set
    var feedback by mutableStateOf<UiFeedback?>(null)
        private set
    var themeMode by mutableStateOf(ThemeMode.fromKey(prefs.getString("theme_mode", ThemeMode.System.key)))
        private set

    fun clearFeedback() {
        feedback = null
    }

    fun selectThemeMode(mode: ThemeMode) {
        themeMode = mode
        prefs.edit().putString("theme_mode", mode.key).apply()
    }

    fun restoreSession() {
        if (github.isNotEmpty() || signIn != null || githubFlow.job?.isActive == true) return
        viewModelScope.launch {
            val saved = withContext(Dispatchers.IO) {
                runCatching { JSONObject(Vault.open(sessionFile.readBytes())) }.getOrNull()
            }
            if (saved == null) {
                forgetSession() // missing, or an old unencrypted file
                resumeDeviceAuth(githubFlow, GITHUB_SPEC, ::completeGitHubSignIn) {
                    github.isEmpty() && githubFlow.job?.isActive != true
                }
                return@launch
            }
            github = saved.optString("github")
            vercel = saved.optString("vercel")
            vercelRefresh = saved.optString("vercelRefresh")
            vercelExpiresAt = saved.optLong("vercelExpiresAt", 0L)
            account = saved.optString("account")
            hiddenEnvKeys = saved.optJSONArray("hiddenEnvKeys")
                ?.let { arr -> (0 until arr.length()).mapNotNull { arr.optString(it).ifBlank { null } }.toSet() }
                ?: emptySet()
            signedIn = github.isNotEmpty()
            if (github.isNotEmpty()) {
                refresh()
                if (vercel.isEmpty()) {
                    resumeDeviceAuth(vercelFlow, VERCEL_SPEC, ::completeVercelSignIn) {
                        vercel.isEmpty() && vercelFlow.job?.isActive != true
                    }
                }
            }
        }
    }

    fun onForeground() {
        if (github.isEmpty()) {
            if (signIn == null && githubFlow.job?.isActive != true) restoreSession()
            else nudgeDeviceAuth(githubFlow, signIn != null)
        } else {
            nudgeDeviceAuth(vercelFlow, vercelSignIn != null)
        }
    }

    /** GitHub OAuth device flow (RFC 8628) straight against github.com. */
    fun startSignIn() {
        if (busy) return
        startDeviceAuth(githubFlow, GITHUB_SPEC, ::completeGitHubSignIn)
    }

    /** Vercel OAuth device flow (RFC 8628; supports Continue with GitHub or Google on vercel.com). */
    fun startVercelSignIn() {
        if (busy || vercelConnecting || github.isEmpty()) return
        startDeviceAuth(vercelFlow, VERCEL_SPEC, ::completeVercelSignIn)
    }

    fun cancelSignIn() = cancelDeviceAuth(githubFlow)

    fun cancelVercelSignIn() = cancelDeviceAuth(vercelFlow)

    private fun startDeviceAuth(
        flowState: DeviceAuthState,
        spec: DeviceFlowSpec,
        onToken: suspend (JSONObject) -> Boolean,
    ) {
        if (flowState.job?.isActive == true) return
        feedback = null
        flowState.setStarting(true)
        val generation = ++flowState.generation
        flowState.job = viewModelScope.launch {
            runDeviceFlow(flowState, spec, generation, immediateFirstPoll = false, onToken = onToken) {
                val start = form(
                    spec.authUrl,
                    mapOf("client_id" to spec.clientId, "scope" to spec.scope),
                )
                if (!start.has("device_code")) {
                    val detail = start.optString("error_description").ifBlank { "${spec.serviceLabel} refused the sign-in request." }
                    throw AdminError(detail, status = 400, github = spec.serviceLabel == "GitHub")
                }
                start.put("expires_at", System.currentTimeMillis() + start.optLong("expires_in", 900) * 1000)
                // Kept so polling resumes if Android recreates the app while the browser is open.
                withContext(Dispatchers.IO) { flowState.pendingFile.writeBytes(Vault.seal(start.toString())) }
                start
            }
        }
    }

    private suspend fun resumeDeviceAuth(
        flowState: DeviceAuthState,
        spec: DeviceFlowSpec,
        onToken: suspend (JSONObject) -> Boolean,
        shouldStart: () -> Boolean,
    ) {
        val pending = withContext(Dispatchers.IO) {
            runCatching { JSONObject(Vault.open(flowState.pendingFile.readBytes())) }.getOrNull()
        } ?: return
        if (!shouldStart()) return
        val generation = ++flowState.generation
        flowState.job = viewModelScope.launch {
            runDeviceFlow(flowState, spec, generation, immediateFirstPoll = true, onToken = onToken) { pending }
        }
    }

    private fun nudgeDeviceAuth(flowState: DeviceAuthState, active: Boolean) {
        if (active && (flowState.lastTransientError || System.currentTimeMillis() - flowState.lastPollAt >= flowState.pollIntervalMs)) {
            flowState.pollNow.trySend(Unit)
        }
    }

    private suspend fun runDeviceFlow(
        flowState: DeviceAuthState,
        spec: DeviceFlowSpec,
        generation: Int,
        immediateFirstPoll: Boolean,
        onToken: suspend (JSONObject) -> Boolean,
        begin: suspend () -> JSONObject,
    ) {
        var handedOff = false
        try {
            val flow = begin()
            currentCoroutineContext().ensureActive()
            if (generation != flowState.generation) return
            var interval = flow.optLong("interval", 5).coerceAtLeast(5)
            flowState.pollIntervalMs = interval * 1000
            flowState.lastPollAt = if (immediateFirstPoll) 0L else System.currentTimeMillis()
            flowState.lastTransientError = false
            flowState.setStarting(false)
            val uri = if (spec.preferCompleteUri) {
                flow.optString("verification_uri_complete").ifBlank { flow.getString("verification_uri") }
            } else {
                flow.getString("verification_uri")
            }
            flowState.setSignIn(SignIn(flow.getString("user_code"), uri))
            var pollImmediately = immediateFirstPoll
            while (System.currentTimeMillis() < flow.optLong("expires_at", Long.MAX_VALUE)) {
                while (flowState.pollNow.tryReceive().isSuccess) Unit
                if (!pollImmediately) {
                    withTimeoutOrNull(flowState.pollIntervalMs) { flowState.pollNow.receive() }
                }
                pollImmediately = false
                currentCoroutineContext().ensureActive()
                if (generation != flowState.generation) return
                flowState.lastPollAt = System.currentTimeMillis()
                val poll = try {
                    form(
                        spec.tokenUrl,
                        mapOf(
                            "client_id" to spec.clientId,
                            "device_code" to flow.getString("device_code"),
                            "grant_type" to "urn:ietf:params:oauth:grant-type:device_code",
                        ),
                    )
                } catch (error: Exception) {
                    if (error is CancellationException) throw error
                    if (error is AdminError && error.status !in 500..599 && error.status != 429) throw error
                    flowState.lastTransientError = true
                    if (generation == flowState.generation) {
                        feedback = UiFeedback("Waiting for connection to finish ${spec.serviceLabel} sign-in…", isError = true)
                    }
                    continue
                }
                flowState.lastTransientError = false
                if (generation == flowState.generation && feedback?.text?.startsWith("Waiting for connection") == true) {
                    feedback = null
                }
                when (poll.optString("error")) {
                    "" -> {
                        currentCoroutineContext().ensureActive()
                        if (generation != flowState.generation) return
                        handedOff = onToken(poll)
                        clearPending(flowState, generation)
                        flowState.setSignIn(null)
                        return
                    }
                    "authorization_pending" -> Unit
                    "slow_down" -> {
                        interval = poll.optLong("interval", interval + 5).coerceAtLeast(interval + 5)
                        flowState.pollIntervalMs = interval * 1000
                    }
                    else -> throw AdminError(
                        poll.optString("error_description").ifBlank { "${spec.serviceLabel} sign-in cancelled or expired." },
                        status = 400,
                        github = spec.serviceLabel == "GitHub",
                    )
                }
            }
            throw AdminError("The ${spec.serviceLabel} code expired. Start again.", status = 410, github = spec.serviceLabel == "GitHub")
        } catch (cancelled: CancellationException) {
            throw cancelled
        } catch (error: Exception) {
            if (generation == flowState.generation) {
                feedback = UiFeedback(describeError(error, "${spec.serviceLabel} sign-in failed. Check your connection."), isError = true)
                clearPending(flowState, generation)
            }
        } finally {
            if (!handedOff && generation == flowState.generation) {
                flowState.setSignIn(null)
                flowState.setStarting(false)
            }
        }
    }

    private suspend fun completeGitHubSignIn(poll: JSONObject): Boolean {
        val token = poll.getString("access_token")
        val login = JSONObject(callWithRetry("GET", "https://api.github.com/user", token)).getString("login")
        if (!login.equals(REPO_OWNER, ignoreCase = true)) {
            throw AdminError("Signed in as @$login, but only @$REPO_OWNER can manage this portfolio.", status = 403, github = true)
        }
        github = token
        account = "@$login"
        signedIn = true
        saveSession()
        signIn = null
        refresh()
        return true
    }

    private suspend fun completeVercelSignIn(poll: JSONObject): Boolean {
        val token = poll.getString("access_token")
        val refreshToken = poll.optString("refresh_token")
        val expiresIn = poll.optLong("expires_in", 0L)
        val expiresAt = if (expiresIn > 0L) System.currentTimeMillis() + expiresIn * 1000L else 0L
        try {
            callWithRetry("GET", VERCEL_ENV, token)
        } catch (error: AdminError) {
            if (error.status in setOf(401, 403)) {
                throw AdminError("This Vercel account doesn’t have access to the portfolio project.", status = error.status, github = false)
            }
            throw error
        }
        delivery = null
        vercel = token
        vercelRefresh = refreshToken
        vercelExpiresAt = expiresAt
        saveSession()
        val shouldRefreshConnections = connections != null
        vercelSignIn = null
        perform {
            workspace = fetchState()
            if (shouldRefreshConnections) connections = fetchConnections()
            feedback = UiFeedback("Vercel connected.", isError = false)
        }
        return true
    }

    private suspend fun clearPending(flowState: DeviceAuthState, generation: Int) {
        withContext(Dispatchers.IO) {
            if (generation == flowState.generation) flowState.pendingFile.delete()
        }
    }

    private fun cancelDeviceAuth(flowState: DeviceAuthState) {
        val generation = ++flowState.generation
        flowState.job?.cancel()
        flowState.job = null
        flowState.setSignIn(null)
        flowState.setStarting(false)
        if (feedback?.text?.startsWith("Waiting for connection") == true) feedback = null
        viewModelScope.launch { clearPending(flowState, generation) }
    }

    fun disconnectVercel() = perform {
        cancelDeviceAuth(vercelFlow)
        clearVercelAuth()
        workspace = fetchState()
        connections = fetchConnections()
        feedback = UiFeedback("Vercel disconnected.", isError = false)
    }

    fun disconnect() = perform {
        cancelDeviceAuth(githubFlow)
        cancelDeviceAuth(vercelFlow)
        forgetSession()
        github = ""
        vercel = ""
        vercelRefresh = ""
        vercelExpiresAt = 0L
        hiddenEnvKeys = emptySet()
        account = ""
        signedIn = false
        workspace = null
        delivery = null
        connections = null
    }

    fun refresh() = perform { workspace = fetchState() }

    fun loadDelivery() = perform { delivery = fetchDelivery() }

    fun loadConnections() = perform { connections = fetchConnections() }

    fun setHostingPaused(paused: Boolean, onAccepted: () -> Unit) = perform {
        val project = fetchVercelProject()
        val current = project.opt("paused") as? Boolean
            ?: throw AdminError("Vercel could not confirm the hosting status. Refresh and try again.")
        if (current != paused) {
            val action = if (paused) "pause" else "unpause"
            vercelCall("POST", "https://api.vercel.com/v1/projects/$VERCEL_PROJECT/$action?teamId=$VERCEL_TEAM")
        }
        onAccepted()
        delivery = delivery?.copy(vercelPaused = paused)
        feedback = UiFeedback(
            if (paused) "Vercel production hosting paused." else "Hosting resumed. It may take a few minutes for the site to respond.",
            isError = false,
        )
        delivery = fetchDelivery()
    }

    private suspend fun fetchConnections(): List<ServiceConnection> {
        val vercelUser = if (vercel.isEmpty()) "" else runCatching {
            JSONObject(vercelCall("GET", "https://api.vercel.com/v2/user")).getJSONObject("user").optString("username")
        }.getOrDefault("")
        return listOf(
            ServiceConnection(
                name = "GitHub",
                status = "Connected",
                detail = "$account · $REPO",
                url = "https://github.com/$REPO",
                connected = true,
            ),
            ServiceConnection(
                name = "Vercel",
                status = when {
                    vercelUser.isNotEmpty() -> "Connected"
                    vercel.isNotEmpty() -> "Token rejected"
                    else -> "Not linked"
                },
                detail = when {
                    vercelUser.isNotEmpty() -> "$vercelUser · portfolio"
                    vercel.isNotEmpty() -> "Reconnect Vercel using GitHub or Google."
                    else -> "Turn on the switch to sign in with GitHub or Google."
                },
                url = "https://vercel.com/dashboard",
                connected = vercel.isNotEmpty(),
            ),
        )
    }

    fun rollbackDeployment(item: DeploymentItem, onAccepted: () -> Unit) = perform {
        val id = item.vercelId ?: throw AdminError("Choose a previous Vercel production deployment.")
        val existing = delivery?.tracks?.find { it.environment == "Production" }?.records.orEmpty()
        val project = fetchVercelProject()
        val current = project.optJSONObject("targets")?.optJSONObject("production")?.optString("id")
        val eligible = existing.any { it.vercelId == id && it.canRollback } &&
            existing.any { it.isLive && it.vercelId == current } &&
            fetchVercelTrack("Production", project).records.any { it.vercelId == id && it.canRollback }
        if (!eligible) {
            delivery = fetchDelivery()
            throw AdminError("Production changed. Refresh and choose a rollback target again.")
        }
        vercelCall("POST", "https://api.vercel.com/v1/projects/$VERCEL_PROJECT/rollback/${URLEncoder.encode(id, "UTF-8")}?teamId=$VERCEL_TEAM", JSONObject())
        onAccepted()
        feedback = UiFeedback("Vercel accepted the production rollback request.", isError = false)
        delivery = fetchDelivery()
    }

    fun workflowAction(action: String, runId: String?, onAccepted: () -> Unit) = perform {
        val outcome = if (action == "deploy-pages") {
            call("POST", "$GH/actions/workflows/nextjs.yml/dispatches", github, JSONObject().put("ref", "main"))
            "GitHub accepted the Pages deploy request."
        } else {
            val id = runId?.takeIf { it.matches(Regex("\\d{1,18}")) } ?: throw AdminError("Choose a supported workflow action.")
            val run = JSONObject(call("GET", "$GH/actions/runs/$id", github))
            if (run.optString("status") != "completed" || run.optString("conclusion") !in AdminRegistry.retryableConclusions) {
                throw AdminError("This run is no longer eligible for retry. Refresh delivery.")
            }
            call("POST", "$GH/actions/runs/$id/rerun", github)
            "GitHub accepted the workflow retry."
        }
        onAccepted()
        delivery = fetchDelivery()
        feedback = UiFeedback(outcome, isError = false)
    }

    /** Commits the visibility file to main; the push triggers the Vercel deploy. */
    fun saveSections(revision: String, changes: Map<String, Boolean>) = perform {
        if (AdminRegistry.sections.keys.any { changes[it] == null } || changes.values.none { it }) {
            throw AdminError("Keep at least one section visible.")
        }
        val ordered = JSONObject()
        AdminRegistry.sections.keys.forEach { ordered.put(it, changes.getValue(it)) }
        val content = ordered.toString(2) + "\n"
        try {
            call("PUT", "$GH/contents/$VISIBILITY_PATH", github, JSONObject()
                .put("message", "chore(sections): update visibility from mobile admin")
                .put("content", Base64.encodeToString(content.toByteArray(), Base64.NO_WRAP))
                .put("sha", revision)
                .put("branch", "main"))
        } catch (error: AdminError) {
            if (error.status == 409) throw AdminError("Section settings changed on GitHub. Refresh before saving.")
            throw error
        }
        workspace = fetchState()
        feedback = UiFeedback("Committed to main. Vercel will redeploy the site.", isError = false)
    }

    fun saveVercelToken(token: String) = perform {
        val trimmed = token.trim()
        call("GET", VERCEL_ENV, trimmed)
        cancelDeviceAuth(vercelFlow)
        delivery = null
        vercel = trimmed
        vercelRefresh = ""
        vercelExpiresAt = 0L
        saveSession()
        val shouldRefreshConnections = connections != null
        workspace = fetchState()
        if (shouldRefreshConnections) connections = fetchConnections()
        feedback = UiFeedback("Vercel linked.", isError = false)
    }

    /** Upserts a production env var on Vercel; it applies from the next deployment. */
    fun saveEnvironment(name: String, value: String, onSaved: () -> Unit) = perform {
        val key = name.trim()
        if (!key.matches(Regex("[A-Za-z_][A-Za-z0-9_]{0,127}"))) {
            throw AdminError("Use letters, numbers, and underscores (starting with a letter or underscore).")
        }
        if (value.isBlank() || value.length > 4096) throw AdminError("Enter a nonempty value.")
        vercelCall("POST", "$VERCEL_ENV&upsert=true", JSONObject()
            .put("key", key).put("value", value).put("type", "encrypted")
            .put("target", JSONArray().put("production")))
        if (key in hiddenEnvKeys) {
            hiddenEnvKeys = hiddenEnvKeys - key
            saveSession()
        }
        workspace = fetchState()
        onSaved()
        feedback = UiFeedback("$key saved on Vercel. Redeploy production to apply it.", isError = false)
    }

    suspend fun fetchEnvValue(item: EnvVarItem): Result<String?> {
        val envId = item.envId ?: return Result.success(null)
        if (item.type == "sensitive") return Result.success(null)
        return try {
            val url = "https://api.vercel.com/v1/projects/$VERCEL_PROJECT/env/${URLEncoder.encode(envId, "UTF-8")}?teamId=$VERCEL_TEAM"
            val json = JSONObject(vercelCall("GET", url))
            Result.success(json.optString("value").ifEmpty { null })
        } catch (cancelled: CancellationException) {
            throw cancelled
        } catch (error: Exception) {
            Result.failure(IOException(describeError(error, "Couldn’t load the existing value from Vercel."), error))
        }
    }

    fun deleteEnvironment(item: EnvVarItem, onDeleted: () -> Unit) = perform {
        val envId = item.envId
        if (envId == null) {
            if (item.name !in hiddenEnvKeys) {
                hiddenEnvKeys = hiddenEnvKeys + item.name
                saveSession()
            }
            workspace = workspace?.let { current ->
                current.copy(environment = current.environment.filterNot { it.name == item.name })
            }
            onDeleted()
            feedback = UiFeedback("${item.name} removed from list. Use + to add it back.", isError = false)
            return@perform
        }
        val encodedId = URLEncoder.encode(envId, "UTF-8")
        val remaining = item.targets.filter { it != "production" }
        if (remaining.isNotEmpty()) {
            vercelCall(
                "PATCH",
                "https://api.vercel.com/v10/projects/$VERCEL_PROJECT/env/$encodedId?teamId=$VERCEL_TEAM",
                JSONObject().put("target", JSONArray(remaining)),
            )
        } else {
            vercelCall(
                "DELETE",
                "https://api.vercel.com/v10/projects/$VERCEL_PROJECT/env/$encodedId?teamId=$VERCEL_TEAM",
            )
        }
        workspace = fetchState()
        onDeleted()
        feedback = UiFeedback("${item.name} removed from Vercel. Redeploy production to apply it.", isError = false)
    }

    private suspend fun fetchState(): WorkspaceState = coroutineScope {
        val file = async { JSONObject(call("GET", "$GH/contents/$VISIBILITY_PATH?ref=main", github)) }
        val commits = async { JSONArray(call("GET", "$GH/commits?sha=main&per_page=8", github)) }
        val env = async {
            if (vercel.isEmpty()) null
            else try {
                JSONObject(vercelCall("GET", VERCEL_ENV)).getJSONArray("envs")
            } catch (error: AdminError) {
                if (error.status in setOf(401, 403)) {
                    clearVercelAuth()
                    feedback = UiFeedback("Vercel authorization expired or lacks project access. Connect Vercel again in the Env tab.", isError = true)
                    null
                } else {
                    throw error
                }
            }
        }
        AdminFormatters.parseWorkspace(file.await(), commits.await(), env.await(), hiddenEnvKeys)
    }

    private suspend fun fetchVercelProject(): JSONObject = JSONObject(
        vercelCall("GET", "https://api.vercel.com/v9/projects/$VERCEL_PROJECT?teamId=$VERCEL_TEAM&rollbackInfo=true")
    )

    private suspend fun listVercelDeployments(target: String, filters: String): List<JSONObject> {
        val url = "https://api.vercel.com/v7/deployments?projectId=$VERCEL_PROJECT&teamId=$VERCEL_TEAM&target=$target&$filters"
        val deployments = JSONObject(vercelCall("GET", url)).getJSONArray("deployments")
        return (0 until deployments.length()).map { deployments.getJSONObject(it) }
            .filter { it.optString("projectId") == VERCEL_PROJECT }
    }

    private suspend fun fetchVercelTrack(environment: String, project: JSONObject?): DeploymentTrack {
        val production = environment == "Production"
        val recent = listVercelDeployments(environment.lowercase(), "limit=5")
        val current = if (production) project?.optJSONObject("targets")?.optJSONObject("production") else null
        val currentId = current?.optString("id").orEmpty()
        val aliasJob = project?.optJSONObject("lastAliasRequest")?.optString("jobStatus")
        // Vercel's candidate filter excludes staged builds that never served production traffic.
        val previous = if (currentId.isNotEmpty() && aliasJob !in setOf("in-progress", "pending")) {
            listVercelDeployments("production", "rollbackCandidate=true&state=READY&limit=2")
                .firstOrNull { it.optString("uid") != currentId && it.optBoolean("isRollbackCandidate", true) }
        } else null
        val previousId = previous?.getString("uid")
        // A series of failed builds can put the live and fallback versions outside the recent window.
        val deployments = (recent + listOfNotNull(current, previous))
            .distinctBy { it.optString("uid", it.optString("id")) }
            .sortedByDescending { it.optLong("createdAt") }
        val records = deployments.map { deployment ->
            val id = deployment.optString("uid", deployment.optString("id"))
            val status = deployment.optString("readyState")
            val sha = deployment.optJSONObject("meta")?.optString("githubCommitSha").orEmpty()
            val host = deployment.opt("url") as? String
            DeploymentItem(
                ref = sha.take(8).ifBlank { id },
                createdAt = AdminFormatters.formatTimestamp(Instant.ofEpochMilli(deployment.getLong("createdAt")).toString()),
                status = status,
                url = (deployment.opt("inspectorUrl") as? String) ?: host?.let { "https://$it" }.orEmpty(),
                vercelId = id,
                isLive = currentId.isNotEmpty() && id == currentId,
                canRollback = id == previousId && status == "READY",
            )
        }
        return DeploymentTrack(environment, records)
    }

    private suspend fun fetchGithubTrack(environment: String): DeploymentTrack = coroutineScope {
        val recent = JSONArray(call("GET", "$GH/deployments?per_page=3&environment=${URLEncoder.encode(environment, "UTF-8")}", github))
        val records = (0 until recent.length()).mapNotNull { recent.optJSONObject(it) }.map { deployment ->
            async {
                val status = runCatching {
                    JSONArray(call("GET", "$GH/deployments/${deployment.getLong("id")}/statuses?per_page=1", github)).optJSONObject(0)
                }.getOrNull()
                val sha = deployment.optString("sha")
                val ref = deployment.optString("ref").let { if (it == sha) sha.take(8) else it }
                DeploymentItem(
                    ref = ref,
                    createdAt = AdminFormatters.formatTimestamp(deployment.optString("created_at")),
                    status = status?.optString("state")?.ifEmpty { null } ?: "Unknown",
                    url = status?.optString("target_url")?.ifEmpty { null } ?: status?.optString("environment_url").orEmpty(),
                )
            }
        }.awaitAll()
        DeploymentTrack(environment = environment, records = records)
    }

    private suspend fun fetchDelivery(): DeliveryState = coroutineScope {
        val runs = async {
            runCatching {
                val array = JSONObject(call("GET", "$GH/actions/runs?per_page=12", github)).getJSONArray("workflow_runs")
                AdminFormatters.parseWorkflowRuns(array)
            }
        }
        val linked = vercel.isNotEmpty()
        val project = async {
            if (linked) try {
                fetchVercelProject()
            } catch (error: IOException) {
                null
            } else null
        }
        val tracks = listOf("Production", "Preview", "github-pages").map { environment ->
            async {
                try {
                    if (linked && environment != "github-pages") fetchVercelTrack(environment, project.await())
                    else fetchGithubTrack(environment)
                } catch (cancelled: CancellationException) {
                    throw cancelled
                } catch (error: Exception) {
                    DeploymentTrack(environment, emptyList(), describeError(error, "Couldn’t load this deployment track."))
                }
            }
        }.awaitAll()
        val runList = runs.await()
        DeliveryState(
            runs = runList.getOrDefault(emptyList()),
            tracks = tracks,
            vercelPaused = project.await()?.opt("paused") as? Boolean,
            runsError = if (runList.isFailure) "Couldn’t load workflow runs from GitHub." else "",
        )
    }

    private suspend fun saveSession() = withContext(Dispatchers.IO) {
        val json = JSONObject()
            .put("github", github)
            .put("vercel", vercel)
            .put("vercelRefresh", vercelRefresh)
            .put("vercelExpiresAt", vercelExpiresAt)
            .put("account", account)
            .put("hiddenEnvKeys", JSONArray(hiddenEnvKeys.toList()))
        sessionFile.writeBytes(Vault.seal(json.toString()))
    }

    private suspend fun clearVercelAuth() {
        delivery = null
        vercel = ""
        vercelRefresh = ""
        vercelExpiresAt = 0L
        saveSession()
    }

    private suspend fun vercelCall(method: String, url: String, body: JSONObject? = null): String {
        if (vercelRefresh.isNotEmpty() && vercelExpiresAt > 0L && System.currentTimeMillis() >= vercelExpiresAt - 60_000L) {
            refreshVercelToken()
        }
        val tokenUsed = vercel
        if (tokenUsed.isEmpty()) throw AdminError("Vercel is not connected.", status = 401, github = false)
        return try {
            call(method, url, tokenUsed, body)
        } catch (error: AdminError) {
            if (error.status == 401 && vercelRefresh.isNotEmpty() && refreshVercelToken(expectedToken = tokenUsed)) {
                call(method, url, vercel, body)
            } else {
                throw error
            }
        }
    }

    private suspend fun refreshVercelToken(expectedToken: String? = null): Boolean = vercelMutex.withLock {
        if (expectedToken != null && vercel.isNotEmpty() && vercel != expectedToken) return true
        if (vercelRefresh.isEmpty()) return false
        val res = try {
            form(
                VERCEL_TOKEN_URL,
                mapOf(
                    "client_id" to VERCEL_CLIENT_ID,
                    "grant_type" to "refresh_token",
                    "refresh_token" to vercelRefresh,
                ),
            )
        } catch (error: Exception) {
            if (error is CancellationException) throw error
            if (error is AdminError && error.status in 400..499) {
                clearVercelAuth()
                return false
            }
            throw error
        }
        val token = res.optString("access_token")
        if (token.isBlank()) {
            clearVercelAuth()
            return false
        }
        vercel = token
        vercelRefresh = res.optString("refresh_token").ifBlank { vercelRefresh }
        val expiresIn = res.optLong("expires_in", 0L)
        vercelExpiresAt = if (expiresIn > 0L) System.currentTimeMillis() + expiresIn * 1000L else 0L
        saveSession()
        return true
    }

    private suspend fun forgetSession() {
        withContext(Dispatchers.IO) { sessionFile.delete() }
    }

    private fun perform(operation: suspend () -> Unit) {
        if (busy) return
        busy = true
        feedback = null
        viewModelScope.launch {
            try {
                operation()
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (error: Exception) {
                if (error is AdminError && error.status == 401 && error.github) {
                    forgetSession()
                    github = ""; vercel = ""; vercelRefresh = ""; vercelExpiresAt = 0L; account = ""; signedIn = false; workspace = null
                    feedback = UiFeedback("GitHub sign-in expired. Sign in again.", isError = true)
                } else {
                    feedback = UiFeedback(describeError(error, "Request failed. Check your connection."), isError = true)
                }
            } finally {
                busy = false
            }
        }
    }

    private suspend fun form(url: String, params: Map<String, String>): JSONObject = withContext(Dispatchers.IO) {
        val body = params.entries.joinToString("&") { (k, v) -> "$k=${URLEncoder.encode(v, "UTF-8")}" }
        val text = request("POST", url, null, body, "application/x-www-form-urlencoded", allowError = true)
        val service = if (url.contains("vercel.com")) "Vercel" else "GitHub"
        runCatching { JSONObject(text) }.getOrElse {
            throw AdminError("$service returned an unexpected response.", status = 502, github = service == "GitHub")
        }
    }

    private suspend fun callWithRetry(method: String, url: String, token: String, body: JSONObject? = null): String {
        repeat(2) {
            try {
                return call(method, url, token, body)
            } catch (error: Exception) {
                if (error is CancellationException) throw error
                if (error is AdminError && error.status !in 500..599) throw error
                delay(1_000)
            }
        }
        return call(method, url, token, body)
    }

    private suspend fun call(method: String, url: String, token: String, body: JSONObject? = null): String =
        withContext(Dispatchers.IO) { request(method, url, token, body?.toString(), "application/json") }

    private fun request(method: String, url: String, token: String?, body: String?, type: String, allowError: Boolean = false): String {
        val connection = URI(url).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = method
            connection.connectTimeout = 10_000
            connection.readTimeout = 25_000
            connection.setRequestProperty("Accept", if (url.contains("api.github.com")) "application/vnd.github+json" else "application/json")
            connection.setRequestProperty("User-Agent", "PortfolioAdmin/${Build.VERSION.SDK_INT}")
            if (!token.isNullOrEmpty()) connection.setRequestProperty("Authorization", "Bearer $token")
            if (body != null) {
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", type)
                connection.outputStream.use { it.write(body.toByteArray()) }
            } else if (method == "POST") {
                connection.doOutput = true
                connection.setFixedLengthStreamingMode(0)
            }
            val status = connection.responseCode
            val ok = status in 200..299
            val text = (if (ok) connection.inputStream else connection.errorStream)?.bufferedReader()?.use { it.readText() }.orEmpty()
            if (ok || (allowError && status in 400..499)) return text.ifBlank { "{}" }
            val detail = runCatching {
                JSONObject(text).let {
                    it.optJSONObject("error")?.optString("message")?.ifBlank { null }
                        ?: it.optString("error_description").ifBlank { null }
                        ?: it.optString("message").ifBlank { null }
                }
            }.getOrNull().orEmpty()
            val service = if (url.contains("vercel.com")) "Vercel" else "GitHub"
            throw AdminError("$service returned HTTP $status${if (detail.isNotBlank()) ": $detail" else "."}", status, service == "GitHub")
        } finally {
            connection.disconnect()
        }
    }

    private fun describeError(error: Throwable, fallback: String): String = when (error) {
        is AdminError -> error.message?.ifBlank { null } ?: fallback
        is UnknownHostException, is ConnectException -> "Couldn’t reach the server. Check your internet connection and try again."
        is SocketTimeoutException -> "The request timed out. Check your connection and try again."
        is SSLException -> "Secure connection failed. Check your phone’s date, time, and network."
        else -> error.message?.ifBlank { null } ?: fallback
    }

    private class AdminError(message: String, val status: Int = 0, val github: Boolean = false) : IOException(message)

    private companion object {
        val GITHUB_SPEC = DeviceFlowSpec("GitHub", GITHUB_DEVICE_URL, GITHUB_TOKEN_URL, GITHUB_CLIENT_ID, "repo workflow")
        val VERCEL_SPEC = DeviceFlowSpec("Vercel", VERCEL_DEVICE_URL, VERCEL_TOKEN_URL, VERCEL_CLIENT_ID, "openid offline_access", preferCompleteUri = true)
    }
}

/** AES-GCM with a non-exportable Android Keystore key. Output is IV (12 bytes) + ciphertext. */
private object Vault {
    private const val ALIAS = "portfolio-admin-session"

    private fun key(): SecretKey {
        val store = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (store.getKey(ALIAS, null) as? SecretKey)?.let { return it }
        return KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore").apply {
            init(KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build())
        }.generateKey()
    }

    fun seal(text: String): ByteArray {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding").apply { init(Cipher.ENCRYPT_MODE, key()) }
        return cipher.iv + cipher.doFinal(text.toByteArray())
    }

    fun open(data: ByteArray): String {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, key(), GCMParameterSpec(128, data, 0, 12))
        return String(cipher.doFinal(data, 12, data.size - 12))
    }
}
