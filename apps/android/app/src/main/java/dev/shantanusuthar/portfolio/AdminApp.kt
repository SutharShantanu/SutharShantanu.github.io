@file:OptIn(ExperimentalMaterial3ExpressiveApi::class)

package dev.shantanusuthar.portfolio

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.PullToRefreshDefaults
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.listSaver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.saveable.rememberSaveableStateHolder
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.first
import org.json.JSONObject

internal enum class AdminPage(val label: String, val icon: ImageVector) {
    Sections("Sections", Icons.Default.Home),
    Environment("Env", Icons.Default.Email),
    Git("Git", Icons.AutoMirrored.Filled.List),
    Vercel("Vercel", Icons.Default.Build),
    Preview("Preview", Icons.Default.Info),
    Settings("Settings", Icons.Default.Settings)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun AdminApp(state: AdminState) {
    val workspace = state.workspace
    var page by rememberSaveable { mutableStateOf(AdminPage.Sections) }
    val screens = rememberSaveableStateHolder()
    val tabs = remember { AdminPage.entries.filter { it != AdminPage.Settings } }
    BackHandler(workspace != null && page != AdminPage.Sections) { page = AdminPage.Sections }

    // Routine outcomes ("saved", "workflow started") are transient snackbars, not inline boxes.
    val snackbar = remember { SnackbarHostState() }
    LaunchedEffect(state.message) {
        if (workspace != null && state.message.isNotBlank()) {
            snackbar.currentSnackbarData?.dismiss()
            snackbar.showSnackbar(state.message, withDismissAction = true)
        }
    }
    // Badges: uncommitted paths and failed CI runs need attention on the Git tab.
    val changed = workspace?.optJSONArray("changes")?.length() ?: 0
    val failedRuns = state.delivery?.records("runs")?.count { it.optString("conclusion") in setOf("failure", "timed_out") } ?: 0
    val badgeFor: (AdminPage) -> Int = { if (it == AdminPage.Git) changed + failedRuns else 0 }

    BoxWithConstraints {
        val wide = maxWidth >= 720.dp
        Row {
            if (wide && workspace != null) {
                NavigationRail(
                    containerColor = MaterialTheme.colorScheme.surface,
                ) {
                    tabs.forEach { item ->
                        NavigationRailItem(
                            colors = NavigationRailItemDefaults.colors(
                                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                                selectedIconColor = MaterialTheme.colorScheme.onPrimaryContainer,
                                selectedTextColor = MaterialTheme.colorScheme.primary
                            ),
                            selected = page == item,
                            onClick = { page = item },
                            icon = { NavIcon(item, badgeFor(item)) },
                            label = { Text(item.label) }
                        )
                    }
                }
            }
            Scaffold(
                modifier = Modifier.weight(1f),
                containerColor = MaterialTheme.colorScheme.background,
                snackbarHost = { SnackbarHost(snackbar) },
                topBar = {
                    if (workspace != null) {
                        TopAppBar(
                            title = {
                                Text(
                                    "Portfolio Admin",
                                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                                )
                            },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = MaterialTheme.colorScheme.surface,
                                titleContentColor = MaterialTheme.colorScheme.onSurface,
                            ),
                            actions = {
                                FilledTonalIconButton(
                                    onClick = state::refresh,
                                    enabled = !state.busy,
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Icon(Icons.Default.Refresh, contentDescription = "Refresh checkout")
                                }
                                Spacer(Modifier.width(8.dp))
                                FilledTonalIconButton(
                                    onClick = { page = AdminPage.Settings },
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Icon(Icons.Default.Settings, contentDescription = "Settings")
                                }
                                Spacer(Modifier.width(8.dp))
                            }
                        )
                    }
                },
                bottomBar = {
                    if (!wide && workspace != null) {
                        FloatingNavBar(
                            selected = page,
                            onSelect = { page = it },
                            badgeFor = badgeFor,
                            items = tabs
                        )
                    }
                }
            ) { insets ->
                Column(Modifier.fillMaxSize().padding(insets).consumeWindowInsets(insets).imePadding()) {
                    // Wavy indicator: Expressive progress for "the bridge is working" without blocking content.
                    AnimatedVisibility(state.busy && workspace != null) {
                        LinearWavyProgressIndicator(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp))
                    }
                    val motion = MaterialTheme.motionScheme
                    // Signed out <-> workspace, and tab <-> tab: content rises in with the expressive spring.
                    AnimatedContent(
                        targetState = if (workspace == null) null else page,
                        transitionSpec = {
                            (fadeIn(motion.defaultEffectsSpec()) +
                                slideInVertically(motion.defaultSpatialSpec()) { it / 16 }) togetherWith
                                fadeOut(motion.fastEffectsSpec())
                        },
                        label = "page"
                    ) { current ->
                        when (current) {
                            null -> PortfolioScreen { Pairing(state) }
                            AdminPage.Preview -> HostedPreview()
                            else -> screens.SaveableStateProvider(current.name) {
                                Refreshable(state, current) {
                                    PortfolioScreen {
                                        val data = state.workspace ?: return@PortfolioScreen
                                        when (current) {
                                            AdminPage.Sections -> Sections(data, state)
                                            AdminPage.Environment -> Environment(data, state)
                                            AdminPage.Git -> Git(data, state)
                                            AdminPage.Vercel -> Vercel(state)
                                            AdminPage.Settings -> Settings(state)
                                            AdminPage.Preview -> Unit
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    LaunchedEffect(workspace != null, page) {
        if (workspace != null && page in listOf(AdminPage.Vercel, AdminPage.Settings)) {
            snapshotFlow { state.busy }.first { !it }
            if (page == AdminPage.Vercel && state.delivery == null) state.loadDelivery()
            if (page == AdminPage.Settings) state.loadConnections()
        }
    }
}

@Composable
private fun toggleTint() = ToggleButtonDefaults.colors(
    checkedContainerColor = selectedTint(),
    checkedContentColor = MaterialTheme.colorScheme.primary
)

@Composable
private fun NavIcon(page: AdminPage, badge: Int) {
    if (badge > 0) {
        BadgedBox(badge = { Badge { Text(if (badge > 99) "99+" else badge.toString()) } }) {
            Icon(page.icon, contentDescription = "${page.label}, $badge need attention")
        }
    } else {
        Icon(page.icon, contentDescription = null)
    }
}

/** Pull down to reload the current page's data; the indicator is the Expressive morphing loader. */
@Composable
private fun Refreshable(state: AdminState, page: AdminPage, content: @Composable () -> Unit) {
    val pull = rememberPullToRefreshState()
    PullToRefreshBox(
        isRefreshing = state.busy,
        onRefresh = {
            when (page) {
                AdminPage.Vercel -> state.loadDelivery()
                AdminPage.Settings -> state.loadConnections()
                else -> state.refresh()
            }
        },
        state = pull,
        indicator = {
            PullToRefreshDefaults.LoadingIndicator(
                state = pull,
                isRefreshing = state.busy,
                modifier = Modifier.align(Alignment.TopCenter)
            )
        }
    ) { content() }
}

@Composable
private fun Pairing(state: AdminState) {
    val uriHandler = LocalUriHandler.current
    val clipboard = LocalClipboardManager.current
    val signIn = state.signIn
    // Expressive shape as the brand moment of this screen
    Surface(
        modifier = Modifier.size(88.dp),
        shape = MaterialShapes.Cookie9Sided.toShape(),
        color = MaterialTheme.colorScheme.primaryContainer,
        contentColor = MaterialTheme.colorScheme.onPrimaryContainer
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(36.dp))
        }
    }
    Heading("Portfolio Admin", page = true)
    Supporting("Authenticate with your Google or GitHub account to manage sections, environment secrets, and deployments.")
    if (signIn == null) {
        if (state.busy) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ContainedLoadingIndicator(Modifier.size(48.dp))
                Supporting("Connecting to the host bridge…")
            }
        } else {
            Column(
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Sign in with Google Button (Material 3 Expressive FilledTonal)
                FilledTonalButton(
                    onClick = { state.startSignIn(AuthProvider.Google) },
                    shapes = ButtonDefaults.shapes(),
                    modifier = Modifier.fillMaxWidth().heightIn(min = 54.dp),
                    colors = ButtonDefaults.filledTonalButtonColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                        contentColor = MaterialTheme.colorScheme.onSurface
                    ),
                    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 14.dp)
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_google_logo),
                        contentDescription = "Google Logo",
                        modifier = Modifier.size(22.dp),
                        tint = Color.Unspecified
                    )
                    Spacer(Modifier.width(14.dp))
                    Text(
                        "Sign in with Google",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                }

                // Sign in with GitHub Button (Material 3 Expressive Filled Primary)
                Button(
                    onClick = { state.startSignIn(AuthProvider.GitHub) },
                    shapes = ButtonDefaults.shapes(),
                    modifier = Modifier.fillMaxWidth().heightIn(min = 54.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary
                    ),
                    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 14.dp)
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_github_logo),
                        contentDescription = "GitHub Logo",
                        modifier = Modifier.size(22.dp),
                        tint = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(Modifier.width(14.dp))
                    Text(
                        "Sign in with GitHub",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                }
            }
        }
    }
    val motion = MaterialTheme.motionScheme
    AnimatedVisibility(
        visible = signIn != null,
        enter = fadeIn(motion.defaultEffectsSpec()) + scaleIn(motion.defaultSpatialSpec(), initialScale = 0.85f)
    ) {
        val current = signIn ?: return@AnimatedVisibility
        Group {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Icon(
                    painter = painterResource(id = current.provider.iconRes),
                    contentDescription = null,
                    modifier = Modifier.size(22.dp),
                    tint = if (current.provider == AuthProvider.Google) Color.Unspecified else MaterialTheme.colorScheme.primary
                )
                Text("Enter this code on ${current.provider.displayName}", style = MaterialTheme.typography.titleMedium)
            }
            Surface(color = MaterialTheme.colorScheme.primaryContainer, shape = MaterialTheme.shapes.extraLarge) {
                Text(
                    current.userCode,
                    style = MaterialTheme.typography.displayMedium,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.fillMaxWidth().padding(vertical = 20.dp, horizontal = 24.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite }
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                Button(shapes = ButtonDefaults.shapes(), onClick = {
                    clipboard.setText(AnnotatedString(current.userCode))
                    uriHandler.openUri(current.verificationUri)
                }) { Text("Copy code & open ${current.provider.displayName}") }
                TextButton(onClick = state::cancelSignIn) { Text("Cancel") }
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                LoadingIndicator(Modifier.size(40.dp))
                Supporting("Waiting for approval. This screen continues on its own.")
            }
        }
    }
    if (state.message.isNotBlank()) Feedback(state.message)
}

@Composable
private fun Feedback(message: String) {
    Surface(color = MaterialTheme.colorScheme.secondaryContainer, shape = MaterialTheme.shapes.large) {
        Text(
            message,
            Modifier.fillMaxWidth().padding(14.dp).semantics { liveRegion = LiveRegionMode.Polite }
        )
    }
}

@Composable
private fun Sections(workspace: JSONObject, state: AdminState) {
    val sections = workspace.records("sections")
    val revision = workspace.getString("revision")
    val original = remember(revision) { sections.associate { it.getString("id") to it.getBoolean("visible") } }
    var hidden by rememberSaveable(
        revision,
        stateSaver = listSaver<List<String>, String>(save = { it }, restore = { it })
    ) { mutableStateOf(original.filterValues { !it }.keys.toList()) }
    val draft = original.mapValues { (id, _) -> id !in hidden }
    val count = draft.values.count { it }
    Heading("Site sections", page = true)
    Surface(shape = MaterialTheme.shapes.extraLarge, color = MaterialTheme.colorScheme.primaryContainer) {
        Column(Modifier.fillMaxWidth().padding(24.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            AnimatedContent(targetState = count, label = "visibleCount") { n ->
                Text("$n of ${sections.size} visible", style = MaterialTheme.typography.headlineSmall)
            }
            Text("Changes take effect on the public site after deployment.")
        }
    }
    Group {
        sections.forEach { section ->
            val id = section.getString("id")
            val visible = draft[id] == true
            Row(
                Modifier.fillMaxWidth().heightIn(min = 56.dp)
                    .toggleable(value = visible, enabled = !state.busy, role = Role.Switch) {
                        hidden = if (it) hidden - id else hidden + id
                    },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(Modifier.weight(1f)) {
                    Text(section.getString("label"), style = MaterialTheme.typography.titleMedium)
                    Supporting(if (visible) "Visible" else "Hidden")
                }
                Switch(checked = visible, onCheckedChange = null, enabled = !state.busy)
            }
        }
    }
    if (count == 0) Supporting("Keep at least one section visible.")
    val dirty = draft != original
    AnimatedVisibility(dirty) { StatusPill("Unsaved changes", Tone.Pending) }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Button(
            enabled = dirty && count > 0 && !state.busy,
            shapes = ButtonDefaults.shapes(),
            onClick = { state.saveSections(revision, draft) }
        ) {
            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
            Text("Save visibility")
        }
        if (dirty) OutlinedButton(onClick = { hidden = original.filterValues { !it }.keys.toList() }, enabled = !state.busy) {
            Text("Discard")
        }
    }
}

@Composable
private fun Environment(workspace: JSONObject, state: AdminState) {
    var selected by remember { mutableStateOf<String?>(null) }
    var value by remember { mutableStateOf("") }
    Heading("Environment", page = true)
    Supporting("Local checkout · .env.local")
    Supporting("Restart the local site after updating its environment.")
    Group {
        workspace.records("environment").forEach { item ->
            val name = item.getString("name")
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(name, fontFamily = FontFamily.Monospace)
                    if (item.optBoolean("configured")) StatusPill("Configured", Tone.Positive) else StatusPill("Unset locally", Tone.Neutral)
                }
                FilledTonalButton(onClick = { selected = name }, enabled = !state.busy, shapes = ButtonDefaults.shapes()) { Text("Set") }
            }
        }
    }
    selected?.let { name ->
        val close = { selected = null; value = "" }
        AlertDialog(
            onDismissRequest = { if (!state.busy) close() },
            title = { Text(name) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Supporting("Save a new value to the local checkout.")
                    OutlinedTextField(
                        value = value,
                        onValueChange = { value = it.take(4096) },
                        label = { Text("New value") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        enabled = !state.busy
                    )
                    if (state.message.isNotBlank()) Feedback(state.message)
                }
            },
            confirmButton = {
                Button(onClick = { state.saveEnvironment(name, value, close) }, enabled = value.isNotBlank() && !state.busy) {
                    Text("Save value")
                }
            },
            dismissButton = { TextButton(onClick = close, enabled = !state.busy) { Text("Cancel") } }
        )
    }
}

@Composable
private fun Git(workspace: JSONObject, state: AdminState) {
    var showCi by rememberSaveable { mutableStateOf(false) }
    Heading("Git", page = true)
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(ButtonGroupDefaults.ConnectedSpaceBetween)) {
        ToggleButton(
            checked = !showCi,
            onCheckedChange = { showCi = false },
            shapes = ButtonGroupDefaults.connectedLeadingButtonShapes(),
            colors = toggleTint(),
            modifier = Modifier.weight(1f).semantics { role = Role.RadioButton }
        ) { Text("Status") }
        ToggleButton(
            checked = showCi,
            onCheckedChange = { showCi = true },
            shapes = ButtonGroupDefaults.connectedTrailingButtonShapes(),
            colors = toggleTint(),
            modifier = Modifier.weight(1f).semantics { role = Role.RadioButton }
        ) { Text("CI runs") }
    }
    if (showCi) GitHubActions(state) else GitStatus(workspace, state)
}

@Composable
private fun GitStatus(workspace: JSONObject, state: AdminState) {
    Heading("Git status")
    Group {
        Text(workspace.getString("branch"), style = MaterialTheme.typography.titleLarge)
        val changes = workspace.getJSONArray("changes")
        if (changes.length() == 0) StatusPill("Working tree clean", Tone.Positive)
        else StatusPill("${changes.length()} changed paths", Tone.Pending)
    }
    Row {
        FilledTonalButton(onClick = state::refresh, enabled = !state.busy, shapes = ButtonDefaults.shapes()) { Text("Refresh Git status") }
    }
    val commits = workspace.records("commits")
    if (commits.isNotEmpty()) {
        var showHistory by rememberSaveable { mutableStateOf(false) }
        TextButton(onClick = { showHistory = !showHistory }) {
            Text(if (showHistory) "Hide recent commits" else "Show recent commits")
        }
        if (showHistory) Group {
            commits.forEach { commit ->
                Text(commit.getString("subject"), style = MaterialTheme.typography.titleSmall)
                Text(commit.getString("hash"), fontFamily = FontFamily.Monospace)
            }
        }
    }
    val changes = workspace.getJSONArray("changes")
    if (changes.length() > 0) {
        Group {
            for (index in 0 until changes.length()) {
                Text(changes.getString(index), fontFamily = FontFamily.Monospace)
            }
        }
    }
}

private data class WorkflowAction(val action: String, val runId: String?, val title: String, val details: String)

@Composable
private fun GitHubActions(state: AdminState) {
    var pending by remember { mutableStateOf<WorkflowAction?>(null) }
    LaunchedEffect(Unit) {
        if (state.delivery == null) {
            snapshotFlow { state.busy }.first { !it }
            if (state.delivery == null) state.loadDelivery()
        }
    }
    FilledTonalButton(onClick = state::loadDelivery, enabled = !state.busy, shapes = ButtonDefaults.shapes()) { Text("Refresh CI runs") }
    val data = state.delivery ?: return
    Button(enabled = !state.busy, shapes = ButtonDefaults.shapes(), onClick = {
        pending = WorkflowAction(
            "deploy-pages", null, "Deploy GitHub Pages?",
            "This starts the Pages workflow from the remote main branch and can publish the site."
        )
    }) { Text("Deploy GitHub Pages") }
    WorkflowRuns(data, enabled = !state.busy) { run ->
        pending = WorkflowAction(
            "retry", run.getString("databaseId"), "Retry workflow?",
            "GitHub will rerun ${run.getString("workflowName")} at the original commit."
        )
    }
    DeploymentTracks(data, setOf("github-pages"), "GitHub Pages deployment history")
    pending?.let { action ->
        AlertDialog(
            onDismissRequest = { if (!state.busy) pending = null },
            title = { Text(action.title) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(action.details)
                    if (state.message.isNotBlank()) Feedback(state.message)
                }
            },
            confirmButton = {
                Button(enabled = !state.busy, onClick = {
                    state.workflowAction(action.action, action.runId) { pending = null }
                }) { Text(if (action.runId == null) "Start deploy" else "Retry run") }
            },
            dismissButton = {
                TextButton(enabled = !state.busy, onClick = { pending = null }) { Text("Cancel") }
            }
        )
    }
}

@Composable
private fun WorkflowRuns(data: JSONObject, enabled: Boolean, retry: (JSONObject) -> Unit) {
    Heading("CI workflow runs")
    val runs = data.records("runs")
    val runError = data.optString("runsError")
    if (runError.isNotEmpty()) Feedback(runError)
    else if (runs.isEmpty()) Supporting("No workflow runs yet.")
    runs.forEach { run ->
        Group {
            val outcome = run.optString("conclusion").ifBlank { run.optString("status") }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(run.optString("workflowName"), style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                StatusPill(outcome.replace('_', ' ').replaceFirstChar { it.uppercase() }, toneOf(outcome))
            }
            Supporting(run.optString("displayTitle"))
            Supporting(run.optString("headBranch"))
            Supporting(run.optString("createdAt").replace('T', ' ').removeSuffix("Z") + " UTC")
            Link("Open workflow run", run.optString("url"))
            if (run.optString("status") == "completed" &&
                run.optString("conclusion") in setOf("failure", "timed_out", "cancelled") &&
                run.optLong("databaseId") > 0
            ) {
                OutlinedButton(enabled = enabled, onClick = { retry(run) }, shapes = ButtonDefaults.shapes()) { Text("Retry workflow") }
            }
        }
    }
}

@Composable
private fun Vercel(state: AdminState) {
    Heading("Vercel", page = true)
    var shown by rememberSaveable { mutableStateOf(listOf("Production", "Preview")) }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf("Production", "Preview").forEach { env ->
            val selected = env in shown
            FilterChip(
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = selectedTint(),
                    selectedLabelColor = MaterialTheme.colorScheme.primary,
                    selectedLeadingIconColor = MaterialTheme.colorScheme.primary
                ),
                selected = selected,
                onClick = { shown = if (selected) shown - env else shown + env },
                label = { Text(env) },
                leadingIcon = if (selected) {
                    { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(FilterChipDefaults.IconSize)) }
                } else null
            )
        }
    }
    FilledTonalButton(onClick = state::loadDelivery, enabled = !state.busy, shapes = ButtonDefaults.shapes()) {
        Text("Refresh deployments")
    }
    if (state.delivery == null && state.busy) LoadingIndicator(Modifier.size(48.dp))
    state.delivery?.let { DeploymentTracks(it, shown.toSet(), "Deployment history") }
}

@Composable
private fun DeploymentTracks(data: JSONObject, environments: Set<String>, title: String) {
    Heading(title)
    val deployError = data.optString("deploymentsError")
    if (deployError.isNotEmpty()) Feedback(deployError)
    data.records("tracks").filter { it.optString("environment") in environments }.forEach { track ->
        Group {
            val environment = track.getString("environment")
            Text(if (environment == "github-pages") "GitHub Pages" else environment, style = MaterialTheme.typography.titleMedium)
            val error = track.optString("error")
            val records = track.records("records")
            if (error.isNotEmpty()) Feedback(error)
            else if (records.isEmpty()) Supporting("No deployments recorded.")
            records.forEachIndexed { index, deployment ->
                if (index > 0) HorizontalDivider()
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatusPill(deployment.optString("status").lowercase().replaceFirstChar { it.uppercase() }, toneOf(deployment.optString("status")))
                    Text(deployment.optString("ref"), fontFamily = FontFamily.Monospace)
                }
                Supporting(deployment.optString("createdAt").replace('T', ' ').removeSuffix("Z") + " UTC")
                Link("Open deployment", deployment.optString("url"))
            }
        }
    }
}


@Composable
private fun Settings(state: AdminState) {
    Heading("Settings", page = true)
    Heading("Connected apps")
    state.connections?.records("services")?.forEach { service ->
        Group {
            Text(service.getString("name"), style = MaterialTheme.typography.titleLarge)
            StatusPill(service.getString("status"), toneOf(service.getString("status")))
            Supporting(service.getString("detail"))
            Link("Open ${service.getString("name")}", service.optString("url"))
        }
    }
    FilledTonalButton(onClick = state::loadConnections, enabled = !state.busy, shapes = ButtonDefaults.shapes()) {
        Text("Refresh connections")
    }
    HorizontalDivider(Modifier.padding(vertical = 8.dp))
    Heading("This device")
    if (state.account.isNotBlank()) {
        Group {
            Text("Signed in as", style = MaterialTheme.typography.titleSmall)
            Text(
                state.account,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
    Supporting("Signing out revokes this phone's session on the host. You can sign in again with Google or GitHub any time.")
    OutlinedButton(
        onClick = state::disconnect,
        enabled = !state.busy,
        shapes = ButtonDefaults.shapes(),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
    ) {
        Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
        Spacer(Modifier.size(ButtonDefaults.IconSpacing))
        Text("Sign out of this device")
    }
}
