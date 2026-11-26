package dev.shantanusuthar.portfolio

import android.util.Base64
import androidx.compose.runtime.Immutable
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import org.json.JSONArray
import org.json.JSONObject

/** An OAuth device flow in progress: the [userCode] to approve at [verificationUri]. */
@Immutable
internal data class SignIn(val userCode: String, val verificationUri: String)

/** Feedback message surfaced either inline (pairing/dialogs) or via Snackbar. */
@Immutable
internal data class UiFeedback(val text: String, val isError: Boolean = true)

@Immutable
internal data class SectionItem(val id: String, val label: String, val visible: Boolean)

@Immutable
internal data class CommitItem(
    val hash: String,
    val subject: String,
    val author: String,
    val date: String,
    val url: String,
)

@Immutable
internal data class EnvVarItem(
    val name: String,
    val configured: Boolean,
    val envId: String? = null,
    val targets: List<String> = emptyList(),
    val type: String = "encrypted",
    val isCustom: Boolean = false,
)

@Immutable
internal data class WorkspaceState(
    val revision: String,
    val branch: String,
    val sections: List<SectionItem>,
    val commits: List<CommitItem>,
    val vercelLinked: Boolean,
    val environment: List<EnvVarItem>,
)

@Immutable
internal data class WorkflowRunItem(
    val id: String,
    val displayTitle: String,
    val status: String,
    val conclusion: String,
    val workflowName: String,
    val headBranch: String,
    val url: String,
    val createdAt: String,
)

@Immutable
internal data class DeploymentItem(
    val ref: String,
    val createdAt: String,
    val status: String,
    val url: String,
    val vercelId: String? = null,
    val isLive: Boolean = false,
    val canRollback: Boolean = false,
)

@Immutable
internal data class DeploymentTrack(
    val environment: String,
    val records: List<DeploymentItem>,
    val error: String = "",
)

@Immutable
internal data class DeliveryState(
    val runs: List<WorkflowRunItem>,
    val tracks: List<DeploymentTrack>,
    val runsError: String = "",
    val vercelPaused: Boolean? = null,
)

@Immutable
internal data class ServiceConnection(
    val name: String,
    val status: String,
    val detail: String,
    val url: String,
    val connected: Boolean,
)

internal enum class ThemeMode(val key: String, val label: String) {
    System("system", "System"),
    Light("light", "Light"),
    Dark("dark", "Dark"),
    ;

    companion object {
        fun fromKey(key: String?): ThemeMode = entries.firstOrNull { it.key == key } ?: System
    }
}

internal object AdminRegistry {
    val sections: Map<String, String> = linkedMapOf(
        "overview" to "Overview",
        "work" to "Work",
        "experience" to "Experience",
        "skills" to "Skills",
        "social" to "Social",
        "contact" to "Contact",
    )

    val envKeys: List<String> = listOf(
        "SITE_NAME",
        "SITE_URL",
        "NEXT_GITHUB_USERNAME",
        "LINKEDIN_USERNAME",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASSWORD",
        "CONTACT_TO_EMAIL",
        "NEXT_GITHUB_TOKEN",
    )

    val extraEnvSuggestions: List<String> = listOf(
        "RAPIDAPI_HOST",
        "RAPIDAPI_KEY",
        "REVALIDATION_SECRET",
    )

    // Non-secret public defaults matching committed portfolio fallbacks.
    val defaultEnvValues: Map<String, String> = mapOf(
        "SITE_NAME" to "Shantanu Suthar Portfolio",
        "SITE_URL" to "https://shantanusuthar.vercel.app",
        "NEXT_GITHUB_USERNAME" to "SutharShantanu",
        "LINKEDIN_USERNAME" to "shantanu-suthar",
        "SMTP_HOST" to "smtp.gmail.com",
        "SMTP_PORT" to "465",
        "SMTP_USER" to "shantanusut2000@gmail.com",
        "CONTACT_TO_EMAIL" to "shantanusut2000@gmail.com",
    )

    val retryableConclusions: Set<String> = setOf("failure", "timed_out", "cancelled")
}

internal object AdminFormatters {
    /** Formats an ISO-8601 UTC timestamp in the device's local timezone; returns raw text on parse failure. */
    fun formatTimestamp(iso: String, zone: ZoneId = ZoneId.systemDefault()): String {
        if (iso.isBlank()) return ""
        return runCatching {
            val formatter = DateTimeFormatter.ofPattern("MMM d, yyyy · HH:mm", Locale.getDefault())
            Instant.parse(iso).atZone(zone).format(formatter)
        }.getOrElse {
            iso.replace('T', ' ').removeSuffix("Z") + if (iso.endsWith("Z")) " UTC" else ""
        }
    }

    fun parseWorkspace(
        fileJson: JSONObject,
        commitsJson: JSONArray,
        envJson: JSONArray?,
        hiddenEnvKeys: Set<String> = emptySet(),
    ): WorkspaceState {
        val rawContent = String(Base64.decode(fileJson.getString("content"), Base64.DEFAULT))
        val visibility = JSONObject(rawContent)
        val productionItems = buildMap {
            envJson?.objects()?.forEach { item ->
                val targets = item.optJSONArray("target")?.strings().orEmpty()
                if ("production" in targets) {
                    val key = item.optString("key")
                    if (key.isNotBlank()) put(key, item)
                }
            }
        }
        val sections = AdminRegistry.sections.map { (id, label) ->
            SectionItem(id = id, label = label, visible = visibility.optBoolean(id, true))
        }
        val commits = commitsJson.objects().map { commit ->
            val inner = commit.optJSONObject("commit")
            val authorObj = inner?.optJSONObject("author")
            CommitItem(
                hash = commit.getString("sha").take(7),
                subject = inner?.optString("message").orEmpty().lineSequence().firstOrNull().orEmpty(),
                author = authorObj?.optString("name").orEmpty(),
                date = formatTimestamp(authorObj?.optString("date").orEmpty()),
                url = commit.optString("html_url"),
            )
        }
        fun envItem(key: String, isCustom: Boolean): EnvVarItem {
            val item = productionItems[key]
            return EnvVarItem(
                name = key,
                configured = envJson != null && item != null,
                envId = item?.optString("id")?.ifBlank { null },
                targets = item?.optJSONArray("target")?.strings().orEmpty(),
                type = item?.optString("type")?.ifBlank { "encrypted" } ?: "encrypted",
                isCustom = isCustom,
            )
        }
        val environment = AdminRegistry.envKeys
            .filter { key -> productionItems.containsKey(key) || key !in hiddenEnvKeys }
            .map { key -> envItem(key, isCustom = false) } +
            productionItems.keys
                .filter { it !in AdminRegistry.envKeys }
                .sorted()
                .map { key -> envItem(key, isCustom = true) }
        return WorkspaceState(
            revision = fileJson.getString("sha"),
            branch = "main",
            sections = sections,
            commits = commits,
            vercelLinked = envJson != null,
            environment = environment,
        )
    }

    fun parseWorkflowRuns(runsJson: JSONArray): List<WorkflowRunItem> = runsJson.objects().map { run ->
        WorkflowRunItem(
            id = run.getLong("id").toString(),
            displayTitle = run.optString("display_title"),
            status = run.optString("status"),
            conclusion = run.optString("conclusion"),
            workflowName = run.optString("name"),
            headBranch = run.optString("head_branch"),
            url = run.optString("html_url"),
            createdAt = formatTimestamp(run.optString("created_at")),
        )
    }
}

private fun JSONArray.objects(): List<JSONObject> = (0 until length()).mapNotNull(::optJSONObject)

private fun JSONArray.strings(): List<String> = (0 until length()).map(::optString)
