@file:OptIn(ExperimentalMaterial3ExpressiveApi::class)

package dev.shantanusuthar.portfolio

import android.content.ClipData
import android.os.Build
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.PullToRefreshDefaults
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.listSaver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.saveable.rememberSaveableStateHolder
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.platform.ClipEntry
import androidx.compose.ui.platform.Clipboard
import androidx.compose.ui.platform.LocalClipboard
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.platform.UriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

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
    var showCi by rememberSaveable { mutableStateOf(false) }
    var lastTab by rememberSaveable { mutableStateOf(AdminPage.Sections) }
    val selectPage: (AdminPage) -> Unit = { target ->
        if (target != AdminPage.Settings) lastTab = target
        page = target
    }
    val screens = rememberSaveableStateHolder()
    val tabs = remember { AdminPage.entries.filter { it != AdminPage.Settings } }
    BackHandler(workspace != null && page != AdminPage.Sections) {
        selectPage(if (page == AdminPage.Settings) lastTab else AdminPage.Sections)
    }

    val snackbar = remember { SnackbarHostState() }
    LaunchedEffect(state.feedback) {
        val current = state.feedback
        if (workspace != null && current != null && current.text.isNotBlank()) {
            snackbar.currentSnackbarData?.dismiss()
            snackbar.showSnackbar(current.text, withDismissAction = true)
        }
    }

    val failedRuns = state.delivery?.runs?.count { it.conclusion in setOf("failure", "timed_out") } ?: 0
    val badgeFor: (AdminPage) -> Int = { if (it == AdminPage.Git) failedRuns else 0 }
    val scrollBehavior = TopAppBarDefaults.pinnedScrollBehavior()
    LaunchedEffect(page, workspace != null) {
        scrollBehavior.state.contentOffset = 0f
        scrollBehavior.state.heightOffset = 0f
    }

    BoxWithConstraints {
        val wide = maxWidth >= 720.dp
        Row {
            if (wide && workspace != null) {
                NavigationRail(
                    containerColor = MaterialTheme.colorScheme.surface,
                    windowInsets = NavigationRailDefaults.windowInsets,
                ) {
                    Spacer(Modifier.height(8.dp))
                    tabs.forEach { item ->
                        NavigationRailItem(
                            colors = NavigationRailItemDefaults.colors(
                                indicatorColor = selectedTint(),
                                selectedIconColor = MaterialTheme.colorScheme.primary,
                                selectedTextColor = MaterialTheme.colorScheme.primary
                            ),
                            selected = page == item,
                            onClick = { selectPage(item) },
                            icon = { NavIcon(item, badgeFor(item)) },
                            label = { Text(item.label) }
                        )
                    }
                }
            }
            Scaffold(
                modifier = Modifier.weight(1f).nestedScroll(scrollBehavior.nestedScrollConnection),
                containerColor = MaterialTheme.colorScheme.background,
                snackbarHost = { SnackbarHost(snackbar) },
                topBar = {
                    if (workspace != null) {
                        TopAppBar(
                            scrollBehavior = scrollBehavior,
                            title = {
                                Text(
                                    "Portfolio Admin",
                                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                                )
                            },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = MaterialTheme.colorScheme.surface,
                                scrolledContainerColor = MaterialTheme.colorScheme.surfaceContainer,
                                titleContentColor = MaterialTheme.colorScheme.onSurface,
                            ),
                            actions = {
                                TooltipBox(
                                    positionProvider = TooltipDefaults.rememberTooltipPositionProvider(TooltipAnchorPosition.Below),
                                    tooltip = { PlainTooltip { Text("Settings") } },
                                    state = rememberTooltipState(),
                                    modifier = Modifier.padding(end = 8.dp),
                                ) {
                                    FilledTonalIconToggleButton(
                                        checked = page == AdminPage.Settings,
                                        onCheckedChange = { open -> selectPage(if (open) AdminPage.Settings else lastTab) },
                                    ) {
                                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                                    }
                                }
                            }
                        )
                    }
                },
                bottomBar = {
                    if (!wide && workspace != null) {
                        BottomNavBar(
                            selected = page,
                            onSelect = selectPage,
                            badgeFor = badgeFor,
                            items = tabs
                        )
                    }
                }
            ) { insets ->
                Column(Modifier.fillMaxSize().padding(insets).consumeWindowInsets(insets).imePadding()) {
                    AnimatedVisibility(state.busy && workspace != null) {
                        LinearWavyProgressIndicator(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp))
                    }
                    val motion = MaterialTheme.motionScheme
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
                                val refresh = when (current) {
                                    AdminPage.Settings -> state::loadConnections
                                    AdminPage.Vercel -> state::loadDelivery
                                    AdminPage.Git -> if (showCi) state::loadDelivery else state::refresh
                                    else -> state::refresh
                                }
                                Refreshable(state.busy, refresh) {
                                    PortfolioScreen {
                                        val data = state.workspace ?: return@PortfolioScreen
                                        when (current) {
                                            AdminPage.Sections -> Sections(data, state)
                                            AdminPage.Environment -> Environment(data, state)
                                            AdminPage.Git -> Git(data, state, showCi, { showCi = it }, refresh)
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

    LaunchedEffect(workspace != null, page, state.connections == null) {
        if (workspace != null && (page == AdminPage.Vercel || page == AdminPage.Settings)) {
            snapshotFlow { state.busy }.first { !it }
            if (page == AdminPage.Vercel && state.delivery == null) state.loadDelivery()
            if (page == AdminPage.Settings && state.connections == null) state.loadConnections()
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
private fun Refreshable(busy: Boolean, onRefresh: () -> Unit, content: @Composable () -> Unit) {
    val pull = rememberPullToRefreshState()
    PullToRefreshBox(
        isRefreshing = busy,
        onRefresh = onRefresh,
        state = pull,
        indicator = {
            PullToRefreshDefaults.LoadingIndicator(
                state = pull,
                isRefreshing = busy,
                modifier = Modifier.align(Alignment.TopCenter)
            )
        }
    ) { content() }
}

@Composable
private fun Pairing(state: AdminState) {
    val uriHandler = LocalUriHandler.current
    val clipboard = LocalClipboard.current
    val scope = rememberCoroutineScope()
    val signIn = state.signIn

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
    Supporting("Sign in with GitHub to manage sections, environment variables, and deployments. Works anywhere, no computer needed.")
    if (signIn == null) {
        if (state.busy) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ContainedLoadingIndicator(Modifier.size(48.dp))
                Supporting(if (state.signedIn) "Loading your portfolio…" else "Connecting to GitHub…")
            }
        } else if (state.signedIn) {
            Column(
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Supporting("Signed in as ${state.account}")
                ActionGroup(listOf(
                    GroupAction("Retry loading", state::refresh, icon = Icons.Default.Refresh),
                    GroupAction("Sign out", state::disconnect, ActionStyle.Danger),
                ))
            }
        } else {
            Column(
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = { state.startSignIn() },
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
                        contentDescription = null,
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
        DeviceCodeCard(
            title = "Enter this code on GitHub",
            iconRes = R.drawable.ic_github_logo,
            signIn = current,
            openLabel = "Copy code & open GitHub",
            onCancel = state::cancelSignIn,
            clipboard = clipboard,
            scope = scope,
            uriHandler = uriHandler
        )
    }
    state.feedback?.let { FeedbackBanner(it.text, isError = it.isError) }
}

@Composable
private fun DeviceCodeCard(
    title: String,
    iconRes: Int?,
    signIn: SignIn,
    openLabel: String,
    onCancel: () -> Unit,
    clipboard: Clipboard,
    scope: CoroutineScope,
    uriHandler: UriHandler
) {
    Group {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (iconRes != null) {
                Icon(
                    painter = painterResource(id = iconRes),
                    contentDescription = null,
                    modifier = Modifier.size(22.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            } else {
                Icon(
                    Icons.Default.Build,
                    contentDescription = null,
                    modifier = Modifier.size(22.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }
            Text(title, style = MaterialTheme.typography.titleMedium)
        }
        Surface(color = MaterialTheme.colorScheme.primaryContainer, shape = MaterialTheme.shapes.extraLarge) {
            Text(
                signIn.userCode,
                style = MaterialTheme.typography.displayMedium,
                fontFamily = FontFamily.Monospace,
                modifier = Modifier.fillMaxWidth().padding(vertical = 20.dp, horizontal = 24.dp)
                    .semantics { liveRegion = LiveRegionMode.Polite }
            )
        }
        ActionGroup(listOf(
            GroupAction(openLabel, {
                scope.launch {
                    clipboard.setClipEntry(ClipEntry(ClipData.newPlainText("Verification code", signIn.userCode)))
                }
                uriHandler.openUri(signIn.verificationUri)
            }),
            GroupAction("Cancel", onCancel, ActionStyle.Outlined),
        ))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            LoadingIndicator(Modifier.size(40.dp))
            Supporting("Waiting for approval. This screen continues on its own.")
        }
    }
}

@Composable
private fun SecretTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    enabled: Boolean,
    modifier: Modifier = Modifier,
    imeAction: ImeAction = ImeAction.Done,
    onDone: () -> Unit = {},
) {
    var revealed by remember { mutableStateOf(false) }
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        singleLine = true,
        visualTransformation = if (revealed) VisualTransformation.None else PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = imeAction),
        keyboardActions = KeyboardActions(onDone = { onDone() }),
        trailingIcon = {
            IconButton(onClick = { revealed = !revealed }) {
                Icon(
                    if (revealed) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                    contentDescription = if (revealed) "Hide value" else "Show value"
                )
            }
        },
        enabled = enabled,
        modifier = modifier
    )
}

@Composable
private fun Sections(workspace: WorkspaceState, state: AdminState) {
    val sections = workspace.sections
    val original = remember(workspace.revision) { sections.associate { it.id to it.visible } }
    var hidden by rememberSaveable(
        workspace.revision,
        stateSaver = listSaver<List<String>, String>(save = { it }, restore = { it })
    ) { mutableStateOf(original.filterValues { !it }.keys.toList()) }
    val draft = original.mapValues { (id, _) -> id !in hidden }
    val count = draft.values.count { it }
    val changedCount = draft.count { (id, vis) -> original[id] != vis }

    SectionHeader("Site sections", page = true) {
        RefreshIconButton(onClick = state::refresh, enabled = !state.busy, description = "Refresh sections")
    }
    Surface(shape = MaterialTheme.shapes.extraLarge, color = MaterialTheme.colorScheme.primaryContainer) {
        Column(Modifier.fillMaxWidth().padding(24.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            AnimatedContent(targetState = count, label = "visibleCount") { n ->
                Text("$n of ${sections.size} visible", style = MaterialTheme.typography.headlineSmall)
            }
            Text("Changes take effect on the public site after deployment.")
        }
    }
    if (sections.isEmpty()) EmptyState(
        Icons.Default.Inbox, "No sections found",
        "config/portfolio-visibility.json lists no sections. Refresh to check again."
    ) else Group {
        sections.forEachIndexed { index, section ->
            if (index > 0) HorizontalDivider()
            val visible = draft[section.id] == true
            Row(
                Modifier.fillMaxWidth().heightIn(min = 56.dp)
                    .toggleable(value = visible, enabled = !state.busy, role = Role.Switch) {
                        hidden = if (it) hidden - section.id else hidden + section.id
                    },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(Modifier.weight(1f)) {
                    Text(section.label, style = MaterialTheme.typography.titleMedium)
                    Supporting(if (visible) "Visible" else "Hidden")
                }
                Switch(checked = visible, onCheckedChange = null, enabled = !state.busy)
            }
        }
    }
    if (count == 0 && sections.isNotEmpty()) Supporting("Keep at least one section visible.")
    val dirty = draft != original
    AnimatedVisibility(dirty) {
        StatusPill(
            if (changedCount == 1) "1 unsaved change" else "$changedCount unsaved changes",
            Tone.Pending
        )
    }
    ActionGroup(buildList {
        add(GroupAction(
            "Save visibility", { state.saveSections(workspace.revision, draft) },
            enabled = dirty && count > 0 && !state.busy, icon = Icons.Default.Check,
        ))
        if (dirty) add(GroupAction(
            "Discard", { hidden = original.filterValues { !it }.keys.toList() },
            ActionStyle.Outlined, enabled = !state.busy,
        ))
    })
}

private val EnvKeyPattern = Regex("^[A-Za-z_][A-Za-z0-9_]{0,127}$")

@Composable
private fun Environment(workspace: WorkspaceState, state: AdminState) {
    var selected by remember { mutableStateOf<EnvVarItem?>(null) }
    var value by remember { mutableStateOf("") }
    var adding by remember { mutableStateOf(false) }
    var confirmRemove by remember { mutableStateOf<EnvVarItem?>(null) }
    SectionHeader("Environment", page = true) {
        RefreshIconButton(onClick = state::refresh, enabled = !state.busy, description = "Refresh environment variables")
    }
    Supporting("Vercel · production")
    if (!workspace.vercelLinked) {
        var token by remember { mutableStateOf("") }
        var showManual by rememberSaveable { mutableStateOf(false) }
        val uriHandler = LocalUriHandler.current
        val clipboard = LocalClipboard.current
        val scope = rememberCoroutineScope()
        val vercelSignIn = state.vercelSignIn
        if (vercelSignIn != null) {
            DeviceCodeCard(
                title = "Enter this code on Vercel",
                iconRes = null,
                signIn = vercelSignIn,
                openLabel = "Open Vercel",
                onCancel = state::cancelVercelSignIn,
                clipboard = clipboard,
                scope = scope,
                uriHandler = uriHandler
            )
            state.feedback?.let { FeedbackBanner(it.text, isError = it.isError) }
            return
        }
        Group {
            Text("Connect Vercel", style = MaterialTheme.typography.titleMedium)
            Supporting("Sign in on Vercel using your GitHub or Google account to manage encrypted production variables on this phone.")
            if (state.vercelConnecting) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ContainedLoadingIndicator(Modifier.size(40.dp))
                    Supporting("Connecting to Vercel…")
                }
            } else {
                Button(
                    onClick = state::startVercelSignIn,
                    enabled = !state.busy,
                    shapes = ButtonDefaults.shapes(),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Sign in with Vercel (GitHub / Google)")
                }
                Row(
                    modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("Or paste a Vercel token", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                    ExpandToggleIconButton(
                        expanded = showManual,
                        onToggle = { showManual = !showManual },
                        showDescription = "Show manual token entry",
                        hideDescription = "Hide manual token entry"
                    )
                }
                ExpressiveExpandable(showManual) {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        TextButton(onClick = { uriHandler.openUri("https://vercel.com/account/settings/tokens") }) {
                            Text("Create a Vercel token")
                        }
                        SecretTextField(
                            value = token,
                            onValueChange = { token = it.trim().take(200) },
                            label = "Vercel token",
                            enabled = !state.busy,
                            onDone = { if (token.isNotBlank() && !state.busy) state.saveVercelToken(token) },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Button(
                            onClick = { state.saveVercelToken(token) },
                            enabled = token.isNotBlank() && !state.busy,
                            shapes = ButtonDefaults.shapes()
                        ) {
                            Text("Link token")
                        }
                    }
                }
            }
        }
        return
    }
    val configuredCount = workspace.environment.count { it.configured }
    Surface(shape = MaterialTheme.shapes.extraLarge, color = MaterialTheme.colorScheme.primaryContainer) {
        Column(Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("$configuredCount of ${workspace.environment.size} configured", style = MaterialTheme.typography.titleLarge)
            Text("New values apply after the next production deployment.")
        }
    }
    SectionHeader("Variables") {
        ActionIconButton(
            icon = Icons.Default.Add,
            description = "Add variable",
            enabled = !state.busy,
            onClick = {
                state.clearFeedback()
                adding = true
            }
        )
    }
    if (workspace.environment.isEmpty()) EmptyState(
        Icons.Default.Inbox, "No variables yet",
        "Tap + to add the first production variable."
    ) else Group {
        workspace.environment.forEachIndexed { index, item ->
            if (index > 0) HorizontalDivider()
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(item.name, fontFamily = FontFamily.Monospace)
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (item.configured) StatusPill("Configured", Tone.Positive) else StatusPill("Not set", Tone.Neutral)
                        if (item.isCustom) StatusPill("Custom", Tone.Neutral)
                        if (item.type == "sensitive") StatusPill("Sensitive", Tone.Neutral)
                    }
                    val otherTargets = item.targets.filter { it != "production" }
                    if (otherTargets.isNotEmpty()) {
                        Supporting("Also in ${otherTargets.joinToString(", ")}")
                    }
                }
                ActionIconButton(
                    icon = Icons.Default.DeleteOutline,
                    description = "Remove ${item.name}",
                    enabled = !state.busy,
                    destructive = true,
                    onClick = {
                        state.clearFeedback()
                        confirmRemove = item
                    }
                )
                FilledTonalButton(
                    onClick = {
                        state.clearFeedback()
                        selected = item
                    },
                    enabled = !state.busy,
                    shapes = ButtonDefaults.shapes()
                ) { Text(if (item.configured) "Update" else "Set") }
            }
        }
    }
    selected?.let { item ->
        val close = { selected = null; value = "" }
        var loadingExisting by remember(item.name, item.envId) { mutableStateOf(item.envId != null && item.type != "sensitive") }
        var prefillNote by remember(item.name, item.envId) { mutableStateOf<String?>(null) }
        LaunchedEffect(item.name, item.envId) {
            if (item.envId != null) {
                if (item.type == "sensitive") {
                    value = ""
                    prefillNote = "This variable is marked sensitive on Vercel; its existing value cannot be read back."
                    loadingExisting = false
                } else {
                    loadingExisting = true
                    prefillNote = "Loading current value from Vercel…"
                    val result = state.fetchEnvValue(item)
                    result.onSuccess { existing ->
                        if (existing != null) {
                            value = existing
                            prefillNote = "Prefilled with current Vercel production value."
                        } else {
                            value = ""
                            prefillNote = "Existing value is write-only on Vercel. Enter a new value to replace it."
                        }
                    }.onFailure { err ->
                        value = ""
                        prefillNote = "Could not load current value (${err.message ?: "error"}). Enter a new value to replace it."
                    }
                    loadingExisting = false
                }
            } else {
                val defaultValue = AdminRegistry.defaultEnvValues[item.name]
                if (defaultValue != null) {
                    value = defaultValue
                    prefillNote = "Prefilled with the portfolio's public default. Edit before saving if needed."
                } else {
                    value = ""
                    prefillNote = "Saved as an encrypted production variable on Vercel."
                }
            }
        }
        AlertDialog(
            onDismissRequest = { if (!state.busy) close() },
            title = { Text(item.name, fontFamily = FontFamily.Monospace) },
            text = {
                Column(
                    modifier = Modifier.verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (loadingExisting) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            ContainedLoadingIndicator(Modifier.size(28.dp))
                            Supporting(prefillNote ?: "Loading current value from Vercel…")
                        }
                    } else {
                        Supporting(prefillNote ?: "Saved as an encrypted production variable on Vercel.")
                    }
                    SecretTextField(
                        value = value,
                        onValueChange = { value = it.take(4096) },
                        label = "Value",
                        enabled = !state.busy && !loadingExisting,
                        onDone = {
                            if (value.isNotBlank() && !state.busy && !loadingExisting) {
                                state.saveEnvironment(item.name, value, close)
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                    state.feedback?.takeIf { it.isError }?.let { FeedbackBanner(it.text, isError = true) }
                }
            },
            confirmButton = {
                Button(
                    onClick = { state.saveEnvironment(item.name, value, close) },
                    enabled = value.isNotBlank() && !state.busy && !loadingExisting,
                    shapes = ButtonDefaults.shapes()
                ) {
                    Text("Save value")
                }
            },
            dismissButton = {
                ActionGroup(listOf(
                    GroupAction("Remove", {
                        confirmRemove = item
                        close()
                    }, ActionStyle.Danger, enabled = !state.busy && !loadingExisting),
                    GroupAction("Cancel", close, ActionStyle.Text, enabled = !state.busy),
                ))
            }
        )
    }
    if (adding) {
        var customKey by remember { mutableStateOf("") }
        var customValue by remember { mutableStateOf("") }
        var lastAutoFill by remember { mutableStateOf("") }
        val existingByName = remember(workspace.environment) {
            workspace.environment.associateBy { it.name }
        }
        val suggestions = remember(existingByName) {
            (AdminRegistry.extraEnvSuggestions + AdminRegistry.envKeys)
                .distinct()
                .filter { name ->
                    val entry = existingByName[name]
                    entry == null || (!entry.configured && name in AdminRegistry.extraEnvSuggestions)
                }
        }
        val normalizedKey = customKey.trim().uppercase()
        val keyValid = normalizedKey.matches(EnvKeyPattern)
        val alreadyConfigured = existingByName[normalizedKey]?.configured == true
        val closeAdd = { adding = false }
        AlertDialog(
            onDismissRequest = { if (!state.busy) closeAdd() },
            title = { Text("Add variable") },
            text = {
                Column(
                    modifier = Modifier.verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Supporting("Saved as an encrypted production variable on Vercel.")
                    if (suggestions.isNotEmpty()) {
                        Text("Suggested variables", style = MaterialTheme.typography.labelLarge)
                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            suggestions.forEach { suggestion ->
                                FilterChip(
                                    selected = normalizedKey == suggestion,
                                    onClick = {
                                        customKey = suggestion
                                        val nextDefault = AdminRegistry.defaultEnvValues[suggestion].orEmpty()
                                        if (customValue.isBlank() || customValue == lastAutoFill) {
                                            customValue = nextDefault
                                            lastAutoFill = nextDefault
                                        }
                                    },
                                    enabled = !state.busy,
                                    label = { Text(suggestion, fontFamily = FontFamily.Monospace) }
                                )
                            }
                        }
                    }
                    OutlinedTextField(
                        value = customKey,
                        onValueChange = { input ->
                            customKey = input.replace(' ', '_').uppercase().take(128)
                        },
                        label = { Text("Variable name") },
                        singleLine = true,
                        enabled = !state.busy,
                        isError = customKey.isNotEmpty() && !keyValid,
                        supportingText = {
                            when {
                                customKey.isNotEmpty() && !keyValid -> Text("Start with A-Z or _; use A-Z, 0-9, and _.")
                                alreadyConfigured -> Text("Already configured — saving will overwrite its production value.")
                                else -> Text("Example: RAPIDAPI_KEY")
                            }
                        },
                        keyboardOptions = KeyboardOptions(
                            capitalization = KeyboardCapitalization.Characters,
                            imeAction = ImeAction.Next
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    SecretTextField(
                        value = customValue,
                        onValueChange = { customValue = it.take(4096) },
                        label = "Value",
                        enabled = !state.busy,
                        onDone = {
                            if (keyValid && customValue.isNotBlank() && !state.busy) {
                                state.saveEnvironment(normalizedKey, customValue, closeAdd)
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                    state.feedback?.takeIf { it.isError }?.let { FeedbackBanner(it.text, isError = true) }
                }
            },
            confirmButton = {
                Button(
                    onClick = { state.saveEnvironment(normalizedKey, customValue, closeAdd) },
                    enabled = keyValid && customValue.isNotBlank() && !state.busy,
                    shapes = ButtonDefaults.shapes()
                ) {
                    Text("Save variable")
                }
            },
            dismissButton = {
                TextButton(onClick = closeAdd, enabled = !state.busy) { Text("Cancel") }
            }
        )
    }
    confirmRemove?.let { target ->
        val otherTargets = target.targets.filter { it != "production" }
        val detail = when {
            target.envId == null ->
                "Removes ${target.name} from this list. No variable is stored on Vercel, and you can add it again with +."
            otherTargets.isNotEmpty() ->
                "Removes ${target.name} from Vercel production while keeping ${otherTargets.joinToString(", ")}."
            else ->
                "Deletes ${target.name} from Vercel production. Existing deployments keep using it until you redeploy."
        }
        ConfirmDangerDialog(
            title = "Remove ${target.name}?",
            text = detail,
            confirmLabel = "Remove",
            enabled = !state.busy,
            onConfirm = {
                confirmRemove = null
                state.deleteEnvironment(target) {}
            },
            onDismiss = { confirmRemove = null }
        )
    }
}

@Composable
private fun Git(
    workspace: WorkspaceState,
    state: AdminState,
    showCi: Boolean,
    onShowCi: (Boolean) -> Unit,
    onRefresh: () -> Unit,
) {
    SectionHeader("Git", page = true) {
        RefreshIconButton(
            onClick = onRefresh,
            enabled = !state.busy,
            description = if (showCi) "Refresh CI runs" else "Refresh Git status",
        )
    }
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(ButtonGroupDefaults.ConnectedSpaceBetween)) {
        ToggleButton(
            checked = !showCi,
            onCheckedChange = { onShowCi(false) },
            shapes = ButtonGroupDefaults.connectedLeadingButtonShapes(),
            colors = toggleTint(),
            modifier = Modifier.weight(1f).semantics { role = Role.RadioButton }
        ) { Text("Status") }
        ToggleButton(
            checked = showCi,
            onCheckedChange = { onShowCi(true) },
            shapes = ButtonGroupDefaults.connectedTrailingButtonShapes(),
            colors = toggleTint(),
            modifier = Modifier.weight(1f).semantics { role = Role.RadioButton }
        ) { Text("CI runs") }
    }
    if (showCi) GitHubActions(state) else GitStatus(workspace)
}

@Composable
private fun GitStatus(workspace: WorkspaceState) {
    Heading("Git status")
    Group {
        Text(workspace.branch, style = MaterialTheme.typography.titleLarge)
        StatusPill("Synced with GitHub", Tone.Positive)
    }
    val commits = workspace.commits
    if (commits.isEmpty()) EmptyState(Icons.AutoMirrored.Filled.List, "No commits yet", "Commits on main appear here.")
    else {
        var showHistory by rememberSaveable { mutableStateOf(false) }
        Group {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(MaterialTheme.shapes.large)
                    .clickable { showHistory = !showHistory }
                    .padding(vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(
                        "Recent commits (${commits.size})",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Supporting("Latest: ${commits.first().subject}")
                }
                ExpandToggleIconButton(
                    expanded = showHistory,
                    onToggle = { showHistory = !showHistory },
                    showDescription = "Show recent commits",
                    hideDescription = "Hide recent commits"
                )
            }
            ExpressiveExpandable(showHistory) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    commits.forEachIndexed { index, commit ->
                        if (index > 0) {
                            HorizontalDivider()
                            Text(commit.subject, style = MaterialTheme.typography.titleSmall)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(commit.hash, fontFamily = FontFamily.Monospace)
                            if (commit.date.isNotBlank()) Supporting(commit.date)
                        }
                        if (commit.url.startsWith("https://")) Link("Open commit", commit.url)
                    }
                }
            }
        }
    }
}

/** Placeholder while optional data loads, or after it failed to load. */
@Composable
private fun LoadState(busy: Boolean, title: String, onRetry: () -> Unit) {
    if (busy) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            LoadingIndicator(Modifier.size(48.dp))
            Supporting("Loading…")
        }
    } else {
        EmptyState(Icons.Default.CloudOff, title, "Check your connection and try again.") {
            FilledTonalButton(onClick = onRetry, shapes = ButtonDefaults.shapes()) { Text("Try again") }
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
    val data = state.delivery ?: return LoadState(state.busy, "Couldn’t load CI runs", state::loadDelivery)
    Button(enabled = !state.busy, shapes = ButtonDefaults.shapes(), onClick = {
        state.clearFeedback()
        pending = WorkflowAction(
            "deploy-pages", null, "Deploy GitHub Pages?",
            "This starts the Pages workflow from the remote main branch and can publish the site."
        )
    }) { Text("Deploy GitHub Pages") }
    WorkflowRuns(data, enabled = !state.busy) { run ->
        state.clearFeedback()
        pending = WorkflowAction(
            "retry", run.id, "Retry workflow?",
            "GitHub will rerun ${run.workflowName} at the original commit."
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
                    state.feedback?.takeIf { it.isError }?.let { FeedbackBanner(it.text, isError = true) }
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
private fun WorkflowRuns(
    data: DeliveryState,
    enabled: Boolean,
    retry: (WorkflowRunItem) -> Unit,
) {
    Heading("CI workflow runs")
    if (data.runsError.isNotEmpty()) FeedbackBanner(data.runsError, isError = true)
    else if (data.runs.isEmpty()) Supporting("No workflow runs yet.")
    data.runs.forEach { run ->
        Group {
            val outcome = run.conclusion.ifBlank { run.status }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(run.workflowName, style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                StatusPill(outcome.replace('_', ' ').replaceFirstChar { it.uppercase() }, toneOf(outcome))
            }
            if (run.displayTitle.isNotBlank() && run.displayTitle != run.workflowName) {
                Supporting(run.displayTitle)
            }
            Supporting(listOf(run.headBranch, run.createdAt).filter { it.isNotBlank() }.joinToString(" · "))
            Link("Open workflow run", run.url)
            if (run.status == "completed" &&
                run.conclusion in AdminRegistry.retryableConclusions &&
                run.id.toLongOrNull() != null
            ) {
                OutlinedButton(enabled = enabled, onClick = { retry(run) }, shapes = ButtonDefaults.shapes()) { Text("Retry workflow") }
            }
        }
    }
}

@Composable
private fun Vercel(state: AdminState) {
    Heading("Vercel", page = true)
    val delivery = state.delivery
    if (delivery != null) HostingStatus(delivery.vercelPaused, state)
    var shown by rememberSaveable { mutableStateOf(listOf("Production", "Preview")) }
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(ButtonGroupDefaults.ConnectedSpaceBetween)) {
            val envs = listOf("Production", "Preview")
            envs.forEachIndexed { index, env ->
                val selected = env in shown
                ToggleButton(
                    checked = selected,
                    onCheckedChange = { shown = if (selected) shown - env else shown + env },
                    shapes = if (index == 0) ButtonGroupDefaults.connectedLeadingButtonShapes()
                    else ButtonGroupDefaults.connectedTrailingButtonShapes(),
                    colors = toggleTint(),
                ) {
                    if (selected) {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(ToggleButtonDefaults.IconSize))
                        Spacer(Modifier.size(ToggleButtonDefaults.IconSpacing))
                    }
                    Text(env)
                }
            }
        }
        Spacer(Modifier.weight(1f))
        RefreshIconButton(onClick = state::loadDelivery, enabled = !state.busy, description = "Refresh deployments")
    }
    if (delivery == null) LoadState(state.busy, "Couldn’t load deployments", state::loadDelivery)
    if (shown.isEmpty()) Supporting("Select at least one environment above.")
    else if (delivery != null) {
        var rollbackId by rememberSaveable { mutableStateOf<String?>(null) }
        DeploymentTracks(delivery, shown.toSet(), "Deployment history") { deployment ->
            if (deployment.canRollback) {
                OutlinedButton(
                    enabled = !state.busy,
                    onClick = {
                        state.clearFeedback()
                        rollbackId = deployment.vercelId
                    },
                    shapes = ButtonDefaults.shapes()
                ) { Text("Roll back to this deployment") }
            }
        }
        val target = delivery.tracks.firstOrNull { it.environment == "Production" }?.records
            ?.firstOrNull { it.canRollback && it.vercelId != null && it.vercelId == rollbackId }
        if (target != null) {
            val targetLabel = listOf(target.ref, target.createdAt).filter(String::isNotBlank).joinToString(" · ")
            DeploymentConfirmation(
                title = "Roll back production?",
                details = "Production will use $targetLabel. To let future pushes go live automatically again, promote a deployment in Vercel.",
                action = "Roll back",
                destructive = true,
                state = state,
                onConfirm = { state.rollbackDeployment(target) { rollbackId = null } },
                onDismiss = { rollbackId = null }
            )
        }
    }
}

@Composable
private fun HostingStatus(paused: Boolean?, state: AdminState) {
    var confirming by rememberSaveable(paused) { mutableStateOf(false) }
    Group {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Production hosting", style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
            when (paused) {
                true -> StatusPill("Offline", Tone.Negative)
                false -> StatusPill("Enabled", Tone.Positive)
                null -> StatusPill("Unknown", Tone.Neutral)
            }
        }
        if (paused == null) {
            Supporting("Check your Vercel connection in Settings and refresh deployments.")
        } else {
            OutlinedButton(
                enabled = !state.busy,
                onClick = {
                    state.clearFeedback()
                    confirming = true
                },
                colors = if (paused) ButtonDefaults.outlinedButtonColors() else dangerOutlinedButtonColors(),
                shapes = ButtonDefaults.shapes()
            ) { Text(if (paused) "Resume hosting" else "Pause hosting") }
        }
    }
    if (confirming && paused != null) {
        DeploymentConfirmation(
            title = if (paused) "Resume production hosting?" else "Pause production hosting?",
            details = if (paused) {
                "Vercel will resume serving this project's production deployment. It can take a few minutes for the site to become available."
            } else {
                "Visitors to this project's production site will see a service unavailable page until you resume hosting."
            },
            action = if (paused) "Resume hosting" else "Pause hosting",
            destructive = !paused,
            state = state,
            onConfirm = { state.setHostingPaused(!paused) { confirming = false } },
            onDismiss = { confirming = false }
        )
    }
}

@Composable
private fun DeploymentConfirmation(
    title: String,
    details: String,
    action: String,
    destructive: Boolean,
    state: AdminState,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = { if (!state.busy) onDismiss() },
        title = { Text(title) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(details)
                state.feedback?.takeIf { it.isError }?.let { FeedbackBanner(it.text) }
            }
        },
        confirmButton = {
            Button(
                onClick = onConfirm,
                enabled = !state.busy,
                colors = if (destructive) dangerButtonColors() else ButtonDefaults.buttonColors(),
                shapes = ButtonDefaults.shapes(),
            ) { Text(action) }
        },
        dismissButton = {
            TextButton(onClick = onDismiss, enabled = !state.busy) { Text("Cancel") }
        },
    )
}

@Composable
private fun DeploymentTracks(
    data: DeliveryState,
    environments: Set<String>,
    title: String,
    actions: @Composable (DeploymentItem) -> Unit = {},
) {
    Heading(title)
    val tracks = data.tracks.filter { it.environment in environments }
    if (tracks.isEmpty()) EmptyState(Icons.Default.Inbox, "No deployments yet", "Deployments reported to GitHub appear here.")
    tracks.forEach { track ->
        Group {
            Text(if (track.environment == "github-pages") "GitHub Pages" else track.environment, style = MaterialTheme.typography.titleMedium)
            if (track.error.isNotEmpty()) FeedbackBanner(track.error, isError = true)
            else if (track.records.isEmpty()) Supporting("No deployments recorded.")
            track.records.forEachIndexed { index, deployment ->
                if (index > 0) HorizontalDivider()
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    if (deployment.isLive) {
                        StatusPill(if (data.vercelPaused == false) "Live in production" else "Production target", Tone.Positive)
                    } else {
                        val label = deployment.status.lowercase().replace('_', ' ').replaceFirstChar { it.uppercase() }
                        StatusPill(label, toneOf(deployment.status))
                    }
                    Text(deployment.ref, modifier = Modifier.align(Alignment.CenterVertically), fontFamily = FontFamily.Monospace)
                }
                Supporting(deployment.createdAt)
                Link("Open deployment", deployment.url)
                actions(deployment)
            }
        }
    }
}

@Composable
private fun Settings(state: AdminState) {
    var confirmSignOut by remember { mutableStateOf(false) }
    var confirmDisconnectVercel by remember { mutableStateOf(false) }
    val uriHandler = LocalUriHandler.current
    val clipboard = LocalClipboard.current
    val scope = rememberCoroutineScope()
    Heading("Settings", page = true)
    SectionHeader("Connected apps") {
        RefreshIconButton(onClick = state::loadConnections, enabled = !state.busy, description = "Refresh connections")
    }
    if (state.connections == null) LoadState(state.busy, "Couldn’t load connections", state::loadConnections)
    else if (state.connections?.isEmpty() == true) EmptyState(Icons.Default.Inbox, "No connected apps")
    state.connections?.forEach { service ->
        val isVercel = service.name == "Vercel"
        val pendingVercel = isVercel && (state.vercelConnecting || state.vercelSignIn != null)
        val isConnected = if (isVercel) service.connected || pendingVercel else true
        val switchEnabled = !state.busy && !(isVercel && state.vercelConnecting)
        val onToggle: (Boolean) -> Unit = { connect ->
            if (isVercel) {
                when {
                    connect -> {
                        state.clearFeedback()
                        state.startVercelSignIn()
                    }
                    state.vercelSignIn != null -> state.cancelVercelSignIn()
                    else -> confirmDisconnectVercel = true
                }
            } else if (!connect) {
                confirmSignOut = true
            }
        }
        Group {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 56.dp)
                    .clip(MaterialTheme.shapes.large)
                    .toggleable(
                        value = isConnected,
                        enabled = switchEnabled,
                        role = Role.Switch,
                        onValueChange = onToggle
                    )
                    .padding(vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(service.name, style = MaterialTheme.typography.titleLarge)
                    if (pendingVercel) {
                        StatusPill("Connecting", Tone.Pending)
                    } else {
                        StatusPill(service.status, toneOf(service.status))
                    }
                }
                Switch(checked = isConnected, onCheckedChange = null, enabled = switchEnabled)
            }
            Supporting(service.detail)
            if (isVercel && state.vercelConnecting) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ContainedLoadingIndicator(Modifier.size(36.dp))
                    Supporting("Starting Vercel sign-in…")
                }
            }
            Link("Open ${service.name}", service.url)
        }
        if (isVercel) {
            state.vercelSignIn?.let { currentSignIn ->
                DeviceCodeCard(
                    title = "Enter this code on Vercel",
                    iconRes = null,
                    signIn = currentSignIn,
                    openLabel = "Open Vercel",
                    onCancel = state::cancelVercelSignIn,
                    clipboard = clipboard,
                    scope = scope,
                    uriHandler = uriHandler
                )
            }
        }
    }
    HorizontalDivider(Modifier.padding(vertical = 8.dp))
    Heading("Appearance")
    Group {
        Text("Theme", style = MaterialTheme.typography.titleMedium)
        Supporting(
            when (state.themeMode) {
                ThemeMode.System -> "Follows your device theme"
                ThemeMode.Light -> "Always light"
                ThemeMode.Dark -> "Always dark"
            }
        )
        val modes = ThemeMode.entries
        Row(
            Modifier.fillMaxWidth().selectableGroup(),
            horizontalArrangement = Arrangement.spacedBy(ButtonGroupDefaults.ConnectedSpaceBetween)
        ) {
            modes.forEachIndexed { index, mode ->
                val shapes = when (index) {
                    0 -> ButtonGroupDefaults.connectedLeadingButtonShapes()
                    modes.lastIndex -> ButtonGroupDefaults.connectedTrailingButtonShapes()
                    else -> ButtonGroupDefaults.connectedMiddleButtonShapes()
                }
                ToggleButton(
                    checked = state.themeMode == mode,
                    onCheckedChange = { if (it) state.selectThemeMode(mode) },
                    shapes = shapes,
                    colors = toggleTint(),
                    modifier = Modifier.weight(1f).semantics { role = Role.RadioButton }
                ) { Text(mode.label) }
            }
        }
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
    Supporting("Signing out deletes the GitHub and Vercel tokens from this phone. Revoke the app at github.com/settings/applications if the phone is lost.")
    OutlinedButton(
        onClick = { confirmSignOut = true },
        enabled = !state.busy,
        shapes = ButtonDefaults.shapes(),
        border = BorderStroke(
            width = 1.dp,
            color = MaterialTheme.colorScheme.error.copy(alpha = if (!state.busy) 0.55f else 0.12f)
        ),
        colors = dangerOutlinedButtonColors()
    ) {
        Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
        Spacer(Modifier.size(ButtonDefaults.IconSpacing))
        Text("Sign out of this device")
    }
    if (confirmDisconnectVercel) {
        ConfirmDangerDialog(
            title = "Disconnect Vercel?",
            text = "Removes the Vercel connection from this phone. Environment variables on Vercel are not changed.",
            confirmLabel = "Disconnect",
            enabled = !state.busy,
            onConfirm = {
                confirmDisconnectVercel = false
                state.disconnectVercel()
            },
            onDismiss = { confirmDisconnectVercel = false }
        )
    }
    if (confirmSignOut) {
        ConfirmDangerDialog(
            title = "Sign out of this device?",
            text = "This deletes the stored GitHub and Vercel tokens from this phone.",
            confirmLabel = "Sign out",
            enabled = !state.busy,
            onConfirm = {
                confirmSignOut = false
                state.disconnect()
            },
            onDismiss = { confirmSignOut = false }
        )
    }
}
