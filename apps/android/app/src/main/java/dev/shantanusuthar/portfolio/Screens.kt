@file:OptIn(ExperimentalMaterial3ExpressiveApi::class)

package dev.shantanusuthar.portfolio

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.AnimatedVisibilityScope
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun SectionHeader(
    title: String,
    page: Boolean = false,
    actions: @Composable RowScope.() -> Unit = {},
) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(top = if (page) 0.dp else 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Text(
            title,
            style = if (page) MaterialTheme.typography.displaySmall else MaterialTheme.typography.headlineSmall,
            modifier = Modifier.weight(1f).semantics { heading() }
        )
        actions()
    }
}

@Composable
internal fun dangerButtonColors() = ButtonDefaults.buttonColors(
    containerColor = MaterialTheme.colorScheme.error,
    contentColor = MaterialTheme.colorScheme.onError,
)

@Composable
internal fun dangerTonalButtonColors() = ButtonDefaults.filledTonalButtonColors(
    containerColor = MaterialTheme.colorScheme.errorContainer,
    contentColor = MaterialTheme.colorScheme.onErrorContainer,
)

@Composable
internal fun dangerOutlinedButtonColors() = ButtonDefaults.outlinedButtonColors(
    contentColor = MaterialTheme.colorScheme.error,
)

@Composable
internal fun ConfirmDangerDialog(
    title: String,
    text: String,
    confirmLabel: String,
    enabled: Boolean,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = { if (enabled) onDismiss() },
        title = { Text(title) },
        text = { Text(text) },
        confirmButton = {
            Button(
                onClick = onConfirm,
                enabled = enabled,
                shapes = ButtonDefaults.shapes(),
                colors = dangerButtonColors(),
            ) { Text(confirmLabel) }
        },
        dismissButton = {
            TextButton(onClick = onDismiss, enabled = enabled) { Text("Cancel") }
        },
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun ActionIconButton(
    icon: ImageVector,
    description: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    destructive: Boolean = false,
    onClick: () -> Unit,
) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberTooltipPositionProvider(TooltipAnchorPosition.Below),
        tooltip = { PlainTooltip { Text(description) } },
        state = rememberTooltipState(),
        modifier = modifier,
    ) {
        val colors = if (destructive) {
            IconButtonDefaults.filledTonalIconButtonColors(
                containerColor = MaterialTheme.colorScheme.errorContainer,
                contentColor = MaterialTheme.colorScheme.onErrorContainer,
            )
        } else {
            IconButtonDefaults.filledTonalIconButtonColors()
        }
        FilledTonalIconButton(
            onClick = onClick,
            enabled = enabled,
            shape = RoundedCornerShape(12.dp),
            colors = colors,
        ) {
            Icon(icon, contentDescription = description)
        }
    }
}

@Composable
internal fun RefreshIconButton(
    onClick: () -> Unit,
    enabled: Boolean,
    description: String,
) {
    ActionIconButton(
        icon = Icons.Default.Refresh,
        description = description,
        enabled = enabled,
        onClick = onClick,
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun ExpandToggleIconButton(
    expanded: Boolean,
    onToggle: () -> Unit,
    showDescription: String,
    hideDescription: String,
) {
    val label = if (expanded) hideDescription else showDescription
    val motion = MaterialTheme.motionScheme
    val rotation by animateFloatAsState(
        targetValue = if (expanded) 180f else 0f,
        animationSpec = motion.fastSpatialSpec(),
        label = "expandChevron",
    )
    TooltipBox(
        positionProvider = TooltipDefaults.rememberTooltipPositionProvider(TooltipAnchorPosition.Below),
        tooltip = { PlainTooltip { Text(label) } },
        state = rememberTooltipState(),
    ) {
        FilledTonalIconToggleButton(
            checked = expanded,
            onCheckedChange = { onToggle() },
            shapes = IconButtonDefaults.toggleableShapes(),
            colors = IconButtonDefaults.filledTonalIconToggleButtonColors(
                checkedContainerColor = selectedTint(),
                checkedContentColor = MaterialTheme.colorScheme.primary,
            ),
        ) {
            Icon(
                Icons.Default.KeyboardArrowDown,
                contentDescription = label,
                modifier = Modifier.graphicsLayer { rotationZ = rotation },
            )
        }
    }
}

@Composable
internal fun ExpressiveExpandable(
    visible: Boolean,
    modifier: Modifier = Modifier,
    content: @Composable AnimatedVisibilityScope.() -> Unit,
) {
    val motion = MaterialTheme.motionScheme
    AnimatedVisibility(
        visible = visible,
        modifier = modifier,
        enter = expandVertically(
            animationSpec = motion.defaultSpatialSpec(),
            expandFrom = Alignment.Top,
        ) + fadeIn(animationSpec = motion.defaultEffectsSpec()),
        exit = shrinkVertically(
            animationSpec = motion.fastSpatialSpec(),
            shrinkTowards = Alignment.Top,
        ) + fadeOut(animationSpec = motion.fastEffectsSpec()),
        content = content,
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

@Composable
internal fun FeedbackBanner(message: String, isError: Boolean = true) {
    Surface(
        color = if (isError) MaterialTheme.colorScheme.errorContainer else MaterialTheme.colorScheme.secondaryContainer,
        contentColor = if (isError) MaterialTheme.colorScheme.onErrorContainer else MaterialTheme.colorScheme.onSecondaryContainer,
        shape = MaterialTheme.shapes.large
    ) {
        Row(
            Modifier.fillMaxWidth().padding(14.dp).semantics { liveRegion = LiveRegionMode.Polite },
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                if (isError) Icons.Default.Warning else Icons.Default.Info,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
            Text(message, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

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

/**
 * Empty-state placeholder shown when a list or section has no content.
 * Uses a tonal surface with an icon, title, and optional description.
 */
@Composable
internal fun EmptyState(
    icon: ImageVector,
    title: String,
    description: String = "",
    action: (@Composable () -> Unit)? = null,
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surfaceContainerLow,
        shape = PortfolioTokens.SectionShape,
    ) {
        Column(
            Modifier.padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(36.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(title, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onSurface)
            if (description.isNotBlank()) {
                Text(
                    description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            action?.invoke()
        }
    }
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
    if (url.startsWith("https://")) {
        TextButton(onClick = {
            try {
                uri.openUri(url)
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

internal enum class ActionStyle { Filled, Tonal, Outlined, Text, Danger }

internal class GroupAction(
    val label: String,
    val onClick: () -> Unit,
    val style: ActionStyle = ActionStyle.Filled,
    val enabled: Boolean = true,
    val icon: ImageVector? = null,
)

/**
 * M3 Expressive standard button group: the pressed button widens while its neighbours give way.
 * Actions that do not fit collapse into the overflow menu.
 */
@Composable
internal fun ActionGroup(actions: List<GroupAction>, modifier: Modifier = Modifier) {
    ButtonGroup(
        overflowIndicator = { ButtonGroupDefaults.OverflowIndicator(it) },
        modifier = modifier,
    ) {
        actions.forEach { action ->
            customItem(
                buttonGroupContent = {
                    val interaction = remember { MutableInteractionSource() }
                    val itemModifier = Modifier.animateWidth(interaction)
                    val content: @Composable RowScope.() -> Unit = {
                        action.icon?.let {
                            Icon(it, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                        }
                        Text(action.label, maxLines = 1)
                    }
                    when (action.style) {
                        ActionStyle.Filled -> Button(onClick = action.onClick, modifier = itemModifier, enabled = action.enabled,
                            shapes = ButtonDefaults.shapes(), interactionSource = interaction, content = content)
                        ActionStyle.Tonal -> FilledTonalButton(onClick = action.onClick, modifier = itemModifier, enabled = action.enabled,
                            shapes = ButtonDefaults.shapes(), interactionSource = interaction, content = content)
                        ActionStyle.Danger -> FilledTonalButton(onClick = action.onClick, modifier = itemModifier, enabled = action.enabled,
                            shapes = ButtonDefaults.shapes(), colors = dangerTonalButtonColors(),
                            interactionSource = interaction, content = content)
                        ActionStyle.Outlined -> OutlinedButton(onClick = action.onClick, modifier = itemModifier, enabled = action.enabled,
                            shapes = ButtonDefaults.shapes(), interactionSource = interaction, content = content)
                        ActionStyle.Text -> TextButton(onClick = action.onClick, modifier = itemModifier, enabled = action.enabled,
                            shapes = ButtonDefaults.shapes(), interactionSource = interaction, content = content)
                    }
                },
                menuContent = { menu ->
                    DropdownMenuItem(
                        text = { Text(action.label) },
                        onClick = { action.onClick(); menu.dismiss() },
                        enabled = action.enabled,
                    )
                },
            )
        }
    }
}
