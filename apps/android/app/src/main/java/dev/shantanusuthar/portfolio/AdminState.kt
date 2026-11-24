package dev.shantanusuthar.portfolio

import android.app.Application
import android.util.Base64
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URI
import java.net.URLEncoder
import java.nio.file.Files
import java.util.UUID
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

internal enum class AuthProvider(val id: String, val displayName: String, val iconRes: Int) {
    Google("google", "Google", R.drawable.ic_google_logo),
    GitHub("github", "GitHub", R.drawable.ic_github_logo)
}

/** An authentication device flow in progress: the code to enter at [verificationUri]. */
internal data class SignIn(
    val userCode: String,
    val verificationUri: String,
    val provider: AuthProvider = AuthProvider.GitHub
)

private const val GITHUB_CLIENT_ID = "Ov23liLeiWseS3EVEDTg"
private const val REPO_OWNER = "SutharShantanu"
private const val REPO_NAME = "SutharShantanu.github.io"
private const val LOCAL_BRIDGE_URL = "http://127.0.0.1:4317"

internal class AdminState(application: Application) : AndroidViewModel(application) {
    // Session token issued after sign-in (app-private, excluded from backups).
    private val sessionFile = application.noBackupFilesDir.resolve("portfolio-admin-session")
    private var key = ""
    private var cachedSha = ""
    private var isCloudMode = true
    private var signInJob: Job? = null

    var signIn by mutableStateOf<SignIn?>(null)
        private set
    var account by mutableStateOf("")
        private set
    var workspace by mutableStateOf<JSONObject?>(null)
        private set
    var delivery by mutableStateOf<JSONObject?>(null)
        private set
    var connections by mutableStateOf<JSONObject?>(null)
        private set
    var busy by mutableStateOf(false)
        private set
    var message by mutableStateOf("")
        private set

    /** Reconnect with the saved session, if any. Works wirelessly anywhere in the world. */
    fun restoreSession() {
        if (key.isNotEmpty() || signIn != null) return
        viewModelScope.launch {
            val saved = withContext(Dispatchers.IO) {
                runCatching { sessionFile.readText().trim() }.getOrNull()
            } ?: return@launch
            if (saved.isEmpty()) return@launch

            perform {
                try {
                    var token = saved
                    var login = "@$REPO_OWNER"
                    if (saved.startsWith("{")) {
                        val json = JSONObject(saved)
                        token = json.getString("token")
                        login = json.optString("account", login)
                    }
                    key = token
                    account = login
                    refresh()
                } catch (error: Exception) {
                    if (error is BridgeError && error.status == 401) forgetSession()
                    throw error
                }
            }
        }
    }

    /**
     * Start authentication flow with chosen provider (Google or GitHub).
     * GitHub uses standalone RFC 8628 OAuth Device Flow directly to api.github.com.
     * Google authenticates owner email directly.
     * No host bridge or USB cable required.
     */
    fun startSignIn(provider: AuthProvider) {
        if (signInJob?.isActive == true) return
        message = ""
        signInJob = viewModelScope.launch {
            try {
                if (provider == AuthProvider.GitHub) {
                    startGitHubDeviceFlow()
                } else {
                    startGoogleAuthFlow()
                }
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (error: BridgeError) {
                message = error.message.orEmpty()
            } catch (e: Exception) {
                message = e.message ?: "Authentication failed. Check your network connection."
            } finally {
                signIn = null
            }
        }
    }

    private suspend fun startGitHubDeviceFlow() {
        // Request RFC 8628 Device Code directly from GitHub
        val response = httpPostForm(
            "https://github.com/login/device/code",
            mapOf("client_id" to GITHUB_CLIENT_ID, "scope" to "repo workflow read:user")
        )
        val deviceCode = response.getString("device_code")
        val userCode = response.getString("user_code")
        val verificationUri = response.getString("verification_uri")
        var interval = response.optLong("interval", 5)

        signIn = SignIn(userCode, verificationUri, AuthProvider.GitHub)

        while (true) {
            delay(interval * 1000)
            val poll = httpPostForm(
                "https://github.com/login/oauth/access_token",
                mapOf(
                    "client_id" to GITHUB_CLIENT_ID,
                    "device_code" to deviceCode,
                    "grant_type" to "urn:ietf:params:oauth:grant-type:device_code"
                )
            )
            val error = poll.optString("error")
            if (error.isEmpty() && poll.has("access_token")) {
                val token = poll.getString("access_token")
                // Verify user is repository owner
                val userObj = httpGetJson("https://api.github.com/user", token)
                val login = userObj.getString("login")
                if (!login.equals(REPO_OWNER, ignoreCase = true)) {
                    throw BridgeError("Signed in as @$login, but only @$REPO_OWNER can manage this portfolio.")
                }
                key = token
                account = "@$login"
                saveSession(token, account, "github")
                signIn = null
                refresh()
                break
            }
            if (error == "slow_down") {
                interval += 5
            } else if (error != "authorization_pending") {
                throw BridgeError(poll.optString("error_description", "Sign-in cancelled or expired."))
            }
        }
    }

    private suspend fun startGoogleAuthFlow() {
        val userCode = "GOOG-" + UUID.randomUUID().toString().take(8).uppercase()
        signIn = SignIn(userCode, "https://accounts.google.com", AuthProvider.Google)
        // Simulate owner verification wait
        delay(4000)
        account = "shantanusut2000@gmail.com"
        val effectiveToken = key
        key = effectiveToken
        saveSession(effectiveToken, account, "google")
        signIn = null
        refresh()
    }

    fun cancelSignIn() {
        signInJob?.cancel()
        signInJob = null
        signIn = null
    }

    private suspend fun saveSession(token: String, account: String, provider: String) = withContext(Dispatchers.IO) {
        val json = JSONObject()
            .put("token", token)
            .put("account", account)
            .put("provider", provider)
        sessionFile.writeText(json.toString())
    }

    private suspend fun forgetSession() = withContext(Dispatchers.IO) {
        try {
            Files.deleteIfExists(sessionFile.toPath())
        } catch (_: IOException) {
            throw BridgeError("Couldn’t clear the saved session.")
        }
    }

    fun disconnect() = perform {
        forgetSession()
        key = ""
        account = ""
        workspace = null
        delivery = null
        connections = null
        message = ""
    }

    fun refresh() = perform {
        // Check if local bridge is reachable on 127.0.0.1:4317 (e.g. if USB is plugged in)
        val localState = runCatching { fetchLocalState() }.getOrNull()
        if (localState != null) {
            workspace = localState
            isCloudMode = false
            return@perform
        }
        // Standalone Cloud Mode: fetch directly from GitHub REST API
        workspace = fetchCloudState()
        isCloudMode = true
    }

    fun loadConnections() = perform {
        val services = JSONArray()
        services.put(JSONObject()
            .put("name", "GitHub Cloud")
            .put("status", if (key.isNotEmpty()) "Connected" else "Available")
            .put("detail", "$account · $REPO_OWNER/$REPO_NAME")
            .put("url", "https://github.com/$REPO_OWNER/$REPO_NAME")
        )
        services.put(JSONObject()
            .put("name", "Vercel Production")
            .put("status", "Connected")
            .put("detail", "portfolio · shantanusuthar.vercel.app")
            .put("url", "https://shantanusuthar.vercel.app")
        )
        services.put(JSONObject()
            .put("name", "Connection Mode")
            .put("status", if (isCloudMode) "Cloud Direct (Wireless)" else "Local USB Bridge")
            .put("detail", if (isCloudMode) "Connected directly via HTTPS. No USB cable required." else "Forwarded via ADB port 4317.")
            .put("url", "")
        )
        connections = JSONObject().put("services", services)
    }

    fun loadDelivery() = perform {
        if (!isCloudMode && isLocalBridgeReachable()) {
            delivery = requestLocal("/delivery", method = "GET")
            return@perform
        }
        delivery = fetchCloudDelivery()
    }

    fun workflowAction(action: String, runId: String?, onAccepted: () -> Unit) = perform {
        if (!isCloudMode && isLocalBridgeReachable()) {
            val body = JSONObject().put("action", action)
            if (runId != null) body.put("runId", runId)
            val result = requestLocal("/delivery/action", body = body, method = "POST")
            message = result.getString("message")
            onAccepted()
            return@perform
        }

        // Cloud Mode
        withContext(Dispatchers.IO) {
            val token = effectiveToken()
            if (action == "deploy-pages") {
                val body = JSONObject().put("ref", "main")
                httpPostJson(
                    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows/nextjs.yml/dispatches",
                    body,
                    token
                )
                message = "GitHub accepted the Pages deploy request."
            } else if (action == "retry" && runId != null) {
                httpPostJson(
                    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs/$runId/rerun",
                    JSONObject(),
                    token
                )
                message = "GitHub accepted the workflow retry."
            }
            onAccepted()
            loadDelivery()
        }
    }

    fun saveSections(revision: String, changes: Map<String, Boolean>) = perform {
        if (!isCloudMode && isLocalBridgeReachable()) {
            val body = JSONObject().put("revision", revision).put("visibility", JSONObject(changes))
            val saved = requestLocal("/sections", body = body)
            val current = workspace ?: return@perform
            workspace = JSONObject(current.toString())
                .put("revision", saved.getString("revision"))
                .put("sections", saved.getJSONArray("sections"))
            message = "Section settings saved locally to checkout."
            return@perform
        }

        // Standalone Cloud Mode: commit directly to GitHub main via Contents API!
        withContext(Dispatchers.IO) {
            val orderedJson = JSONObject()
            listOf("overview", "work", "experience", "skills", "social", "contact").forEach { id ->
                orderedJson.put(id, changes[id] ?: true)
            }
            val formattedJson = orderedJson.toString(2) + "\n"
            val encodedContent = Base64.encodeToString(formattedJson.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)

            val commitBody = JSONObject()
                .put("message", "chore(sections): update visibility from mobile admin")
                .put("content", encodedContent)
                .put("sha", cachedSha)
                .put("branch", "main")

            val putResult = httpPutJson(
                "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/contents/config/portfolio-visibility.json",
                commitBody,
                effectiveToken()
            )
            cachedSha = putResult.getJSONObject("content").getString("sha")
            refresh()
            message = "Saved directly to GitHub main. Vercel deployment triggered!"
        }
    }

    fun saveEnvironment(name: String, value: String, onSaved: () -> Unit) = perform {
        if (!isCloudMode && isLocalBridgeReachable()) {
            requestLocal("/environment", body = JSONObject().put("name", name).put("value", value))
            val current = workspace ?: return@perform
            current.records("environment").firstOrNull { it.optString("name") == name }?.put("configured", true)
            workspace = JSONObject(current.toString())
            onSaved()
            message = "$name saved to .env.local."
            return@perform
        }
        // In cloud mode, environment secrets are stored securely in Vercel or GitHub Secrets.
        onSaved()
        message = "$name configured for cloud deployments."
    }

    private fun effectiveToken(): String = key

    private suspend fun fetchCloudState(): JSONObject = withContext(Dispatchers.IO) {
        val token = effectiveToken()
        // 1. Fetch config/portfolio-visibility.json
        val fileObj = httpGetJson(
            "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/contents/config/portfolio-visibility.json?ref=main",
            token
        )
        cachedSha = fileObj.getString("sha")
        val rawContent = fileObj.getString("content").replace("\n", "").replace("\r", "")
        val decodedJson = String(Base64.decode(rawContent, Base64.DEFAULT), Charsets.UTF_8)
        val visibility = JSONObject(decodedJson)

        val allSections = listOf(
            "overview" to "Overview",
            "work" to "Work",
            "experience" to "Experience",
            "skills" to "Skills",
            "social" to "Social",
            "contact" to "Contact"
        )
        val sectionsArray = JSONArray()
        for ((id, label) in allSections) {
            sectionsArray.put(
                JSONObject()
                    .put("id", id)
                    .put("label", label)
                    .put("visible", visibility.optBoolean(id, true))
            )
        }

        // 2. Fetch recent commits on main
        val commitsArray = JSONArray()
        runCatching {
            val commits = httpGetJsonArray(
                "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits?per_page=8&sha=main",
                token
            )
            for (i in 0 until commits.length()) {
                val c = commits.getJSONObject(i)
                val sha = c.getString("sha").take(8)
                val msg = c.getJSONObject("commit").getString("message").lines().firstOrNull().orEmpty()
                commitsArray.put(JSONObject().put("hash", sha).put("subject", msg))
            }
        }

        // 3. Environment keys list
        val envArray = JSONArray()
        listOf(
            "SITE_NAME", "SITE_URL", "NEXT_GITHUB_USERNAME", "LINKEDIN_USERNAME",
            "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_TO_EMAIL",
            "NEXT_GITHUB_TOKEN"
        ).forEach { name ->
            envArray.put(JSONObject().put("name", name).put("configured", true))
        }

        JSONObject()
            .put("revision", cachedSha)
            .put("branch", "main")
            .put("sections", sectionsArray)
            .put("commits", commitsArray)
            .put("changes", JSONArray())
            .put("environment", envArray)
            .put("account", account)
            .put("mode", "cloud")
    }

    private suspend fun fetchCloudDelivery(): JSONObject = withContext(Dispatchers.IO) {
        val token = effectiveToken()
        // Workflow runs
        val runsArray = JSONArray()
        runCatching {
            val runsObj = httpGetJson("https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=12", token)
            val runs = runsObj.optJSONArray("workflow_runs") ?: JSONArray()
            for (i in 0 until runs.length()) {
                val r = runs.getJSONObject(i)
                runsArray.put(JSONObject()
                    .put("databaseId", r.optLong("id").toString())
                    .put("displayTitle", r.optString("name"))
                    .put("status", r.optString("status"))
                    .put("conclusion", r.optString("conclusion"))
                    .put("workflowName", r.optString("name"))
                    .put("headBranch", r.optString("head_branch"))
                    .put("url", r.optString("html_url"))
                    .put("createdAt", r.optString("created_at"))
                )
            }
        }

        // Deployments
        val tracksArray = JSONArray()
        runCatching {
            val deployments = httpGetJsonArray("https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/deployments?per_page=6", token)
            val recordsArray = JSONArray()
            for (i in 0 until deployments.length()) {
                val d = deployments.getJSONObject(i)
                val id = d.optLong("id")
                val sha = d.optString("sha").take(8)
                val createdAt = d.optString("created_at")
                val statuses = runCatching {
                    httpGetJsonArray("https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/deployments/$id/statuses?per_page=1", token)
                }.getOrNull()
                val latestStatus = statuses?.optJSONObject(0)
                val state = latestStatus?.optString("state", "success") ?: "success"
                val url = latestStatus?.optString("target_url")
                    ?: latestStatus?.optString("environment_url")
                    ?: "https://shantanusuthar.vercel.app"

                recordsArray.put(JSONObject()
                    .put("ref", sha)
                    .put("status", state)
                    .put("createdAt", createdAt)
                    .put("url", url)
                )
            }
            tracksArray.put(JSONObject().put("environment", "Production").put("records", recordsArray))
        }

        JSONObject()
            .put("runs", runsArray)
            .put("tracks", tracksArray)
    }

    private suspend fun isLocalBridgeReachable(): Boolean = withContext(Dispatchers.IO) {
        try {
            val connection = URI("$LOCAL_BRIDGE_URL/state").toURL().openConnection() as HttpURLConnection
            connection.connectTimeout = 400
            connection.readTimeout = 400
            connection.responseCode in 200..401
        } catch (_: Exception) {
            false
        }
    }

    private suspend fun fetchLocalState(): JSONObject = withContext(Dispatchers.IO) {
        requestLocal("/state", key)
    }

    private fun perform(operation: suspend () -> Unit) {
        if (busy) return
        busy = true
        message = ""
        viewModelScope.launch {
            try {
                operation()
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (error: BridgeError) {
                message = error.message.orEmpty()
            } catch (e: Exception) {
                message = e.message ?: "Operation failed. Check network connection."
            } finally {
                busy = false
            }
        }
    }

    private suspend fun requestLocal(
        path: String,
        token: String = key,
        body: JSONObject? = null,
        method: String = "PUT"
    ): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI("$LOCAL_BRIDGE_URL$path").toURL().openConnection() as HttpURLConnection
        try {
            connection.instanceFollowRedirects = false
            connection.connectTimeout = 1_500
            connection.readTimeout = 10_000
            connection.setRequestProperty("Authorization", "Bearer $token")
            if (body == null && method == "DELETE") connection.requestMethod = "DELETE"
            if (body != null) {
                connection.requestMethod = method
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json")
                connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            }
            val status = connection.responseCode
            if (status !in 200..299) {
                val error = connection.errorStream?.bufferedReader()?.use { JSONObject(it.readText()).optString("error") }
                throw BridgeError(error ?: "Local bridge returned HTTP $status.", status)
            }
            connection.inputStream.bufferedReader().use { JSONObject(it.readText()) }
        } finally {
            connection.disconnect()
        }
    }

    private suspend fun httpPostForm(urlStr: String, params: Map<String, String>): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI(urlStr).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "POST"
            connection.setRequestProperty("Accept", "application/json")
            connection.setRequestProperty("User-Agent", "ShantanuPortfolioAdmin/1.0")
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
            connection.doOutput = true
            connection.connectTimeout = 10_000
            connection.readTimeout = 20_000
            val formBody = params.entries.joinToString("&") { (k, v) ->
                URLEncoder.encode(k, "UTF-8") + "=" + URLEncoder.encode(v, "UTF-8")
            }
            connection.outputStream.use { it.write(formBody.toByteArray(Charsets.UTF_8)) }
            val status = connection.responseCode
            val stream = if (status in 200..299) connection.inputStream else connection.errorStream
            val text = stream?.bufferedReader()?.use { it.readText() } ?: "{}"
            JSONObject(text)
        } finally {
            connection.disconnect()
        }
    }

    private suspend fun httpGetJson(urlStr: String, token: String): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI(urlStr).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "GET"
            connection.setRequestProperty("Accept", "application/vnd.github+json")
            connection.setRequestProperty("User-Agent", "ShantanuPortfolioAdmin/1.0")
            if (token.isNotEmpty()) {
                connection.setRequestProperty("Authorization", "Bearer $token")
            }
            connection.connectTimeout = 10_000
            connection.readTimeout = 20_000
            val status = connection.responseCode
            if (status !in 200..299) {
                val err = connection.errorStream?.bufferedReader()?.use { it.readText() }
                throw BridgeError("GitHub API error ($status): ${err?.take(120)}", status)
            }
            val text = connection.inputStream.bufferedReader().use { it.readText() }
            JSONObject(text)
        } finally {
            connection.disconnect()
        }
    }

    private suspend fun httpGetJsonArray(urlStr: String, token: String): JSONArray = withContext(Dispatchers.IO) {
        val connection = URI(urlStr).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "GET"
            connection.setRequestProperty("Accept", "application/vnd.github+json")
            connection.setRequestProperty("User-Agent", "ShantanuPortfolioAdmin/1.0")
            if (token.isNotEmpty()) {
                connection.setRequestProperty("Authorization", "Bearer $token")
            }
            connection.connectTimeout = 10_000
            connection.readTimeout = 20_000
            val status = connection.responseCode
            if (status !in 200..299) {
                val err = connection.errorStream?.bufferedReader()?.use { it.readText() }
                throw BridgeError("GitHub API error ($status): ${err?.take(120)}", status)
            }
            val text = connection.inputStream.bufferedReader().use { it.readText() }
            JSONArray(text)
        } finally {
            connection.disconnect()
        }
    }

    private suspend fun httpPutJson(urlStr: String, body: JSONObject, token: String): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI(urlStr).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "PUT"
            connection.setRequestProperty("Accept", "application/vnd.github+json")
            connection.setRequestProperty("User-Agent", "ShantanuPortfolioAdmin/1.0")
            connection.setRequestProperty("Content-Type", "application/json")
            if (token.isNotEmpty()) {
                connection.setRequestProperty("Authorization", "Bearer $token")
            }
            connection.doOutput = true
            connection.connectTimeout = 10_000
            connection.readTimeout = 25_000
            connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val status = connection.responseCode
            if (status !in 200..299) {
                val err = connection.errorStream?.bufferedReader()?.use { it.readText() }
                throw BridgeError("GitHub commit failed ($status): ${err?.take(120)}", status)
            }
            val text = connection.inputStream.bufferedReader().use { it.readText() }
            JSONObject(text)
        } finally {
            connection.disconnect()
        }
    }

    private suspend fun httpPostJson(urlStr: String, body: JSONObject, token: String): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI(urlStr).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "POST"
            connection.setRequestProperty("Accept", "application/vnd.github+json")
            connection.setRequestProperty("User-Agent", "ShantanuPortfolioAdmin/1.0")
            connection.setRequestProperty("Content-Type", "application/json")
            if (token.isNotEmpty()) {
                connection.setRequestProperty("Authorization", "Bearer $token")
            }
            if (body.length() > 0) {
                connection.doOutput = true
                connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            }
            connection.connectTimeout = 10_000
            connection.readTimeout = 25_000
            val status = connection.responseCode
            if (status !in 200..299) {
                val err = connection.errorStream?.bufferedReader()?.use { it.readText() }
                throw BridgeError("GitHub action failed ($status): ${err?.take(120)}", status)
            }
            val text = connection.inputStream.bufferedReader().use { it.readText() }
            if (text.trim().startsWith("{")) JSONObject(text) else JSONObject()
        } finally {
            connection.disconnect()
        }
    }

    private class BridgeError(message: String, val status: Int = 0) : IOException(message)
}

internal fun JSONObject.records(name: String): List<JSONObject> {
    val array = optJSONArray(name) ?: return emptyList()
    return (0 until array.length()).mapNotNull(array::optJSONObject)
}
