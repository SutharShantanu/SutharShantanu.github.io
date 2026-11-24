@file:OptIn(ExperimentalMaterial3ExpressiveApi::class)

package dev.shantanusuthar.portfolio

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

@Composable
internal fun PortfolioScreen(content: @Composable ColumnScope.() -> Unit) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) {
        Column(
            Modifier.widthIn(max = 760.dp).fillMaxWidth().verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp).padding(top = 24.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = content
        )
    }
}

@Composable
internal fun Heading(title: String, page: Boolean = false) {
    Text(
        title,
        style = if (page) MaterialTheme.typography.displaySmall else MaterialTheme.typography.headlineSmall,
        modifier = Modifier.semantics { heading() }.padding(top = if (page) 0.dp else 12.dp)
    )
}

@Composable
internal fun Group(content: @Composable ColumnScope.() -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surfaceContainer,
        shape = PortfolioTokens.SectionShape,
        tonalElevation = 2.dp
    ) {
        Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp), content = content)
    }
}

/** Selected-state tint used app-wide: primary at 20% with primary content (light, not a solid fill). */
@Composable
internal fun selectedTint() = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)

internal enum class Tone { Positive, Negative, Pending, Neutral }

/**
 * Read-only status label (not a chip: it isn't selectable or actionable).
 * Always icon + text, so status never depends on color alone.
 */
@Composable
internal fun StatusPill(text: String, tone: Tone) {
    val scheme = MaterialTheme.colorScheme
    val (container, content, icon) = when (tone) {
        Tone.Positive -> Triple(scheme.tertiaryContainer, scheme.onTertiaryContainer, Icons.Default.CheckCircle)
        Tone.Negative -> Triple(scheme.errorContainer, scheme.onErrorContainer, Icons.Default.Warning)
        Tone.Pending -> Triple(scheme.secondaryContainer, scheme.onSecondaryContainer, null)
        Tone.Neutral -> Triple(scheme.surfaceContainerHighest, scheme.onSurfaceVariant, Icons.Default.Info)
    }
    Surface(color = container, contentColor = content, shape = CircleShape) {
        Row(
            Modifier.padding(start = 8.dp, end = 12.dp, top = 4.dp, bottom = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            if (icon != null) PillIcon(icon) else LoadingIndicator(Modifier.size(18.dp), color = content)
            Text(text, style = MaterialTheme.typography.labelLarge)
        }
    }
}

@Composable
private fun PillIcon(icon: ImageVector) = Icon(icon, contentDescription = null, modifier = Modifier.size(16.dp))

/** Map GitHub/Vercel run and deployment states to a tone. */
internal fun toneOf(state: String): Tone = when (state.lowercase()) {
    "success", "ready", "active", "completed", "connected", "configured" -> Tone.Positive
    "failure", "error", "timed_out", "cancelled", "failed", "inactive" -> Tone.Negative
    "in_progress", "queued", "pending", "waiting", "building", "requested" -> Tone.Pending
    else -> Tone.Neutral
}

@Composable
internal fun Supporting(text: String) {
    if (text.isNotBlank()) {
        Text(text, color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
internal fun Link(label: String, url: String) {
    val uri = LocalUriHandler.current
    var failed by rememberSaveable(url) { mutableStateOf(false) }
    val target = url
    if (target.startsWith("https://")) {
        TextButton(onClick = {
            try {
                uri.openUri(target)
                failed = false
            } catch (_: IllegalArgumentException) {
                failed = true
            } catch (_: android.content.ActivityNotFoundException) {
                failed = true
            }
        }) { Text(label) }
        if (failed) Supporting("No app could open this link.")
    }
}

