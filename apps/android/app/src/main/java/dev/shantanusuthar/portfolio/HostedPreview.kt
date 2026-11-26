package dev.shantanusuthar.portfolio

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Bitmap
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearWavyProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView

private const val HostedUrl = "https://shantanusuthar.vercel.app"
private const val HostedDomain = "shantanusuthar.vercel.app"
private const val LocalUrl = "http://127.0.0.1:3002"
private const val LocalDomain = "127.0.0.1"

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@SuppressLint("SetJavaScriptEnabled")
@Composable
internal fun HostedPreview() {
    var isLocal by rememberSaveable { mutableStateOf(false) }
    var loading by remember { mutableStateOf(true) }
    var loadError by remember { mutableStateOf("") }
    var canGoBack by remember { mutableStateOf(false) }
    var reload by remember { mutableIntStateOf(0) }
    var webViewRef by remember { mutableStateOf<WebView?>(null) }

    val currentUrl = if (isLocal) LocalUrl else HostedUrl

    BackHandler(enabled = canGoBack) {
        webViewRef?.goBack()
    }

    Column(Modifier.fillMaxSize()) {
        Column(Modifier.padding(horizontal = 16.dp, vertical = 6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Preview", style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
                RefreshIconButton(onClick = { reload++ }, enabled = true, description = "Reload preview")
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val chipColors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = selectedTint(),
                    selectedLabelColor = MaterialTheme.colorScheme.primary,
                    selectedLeadingIconColor = MaterialTheme.colorScheme.primary
                )
                FilterChip(
                    selected = !isLocal,
                    onClick = { if (isLocal) { isLocal = false; reload++ } },
                    label = { Text("Vercel (Live)") },
                    colors = chipColors,
                    leadingIcon = if (!isLocal) {
                        { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(FilterChipDefaults.IconSize)) }
                    } else null
                )
                FilterChip(
                    selected = isLocal,
                    onClick = { if (!isLocal) { isLocal = true; reload++ } },
                    label = { Text("Local Dev (Port 3002)") },
                    colors = chipColors,
                    leadingIcon = if (isLocal) {
                        { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(FilterChipDefaults.IconSize)) }
                    } else null
                )
            }
            Supporting(
                if (isLocal) "Live Next.js dev server on port 3002. Local visibility edits appear immediately."
                else "Live Vercel production deployment ($HostedDomain). Visibility edits take effect after pushing to main."
            )
            Link("Open in browser", currentUrl)
            if (loadError.isNotBlank()) FeedbackBanner(loadError)
        }
        AnimatedVisibility(loading) {
            LinearWavyProgressIndicator(Modifier.fillMaxWidth())
        }
        key(reload, isLocal) {
            AndroidView(
                modifier = Modifier.fillMaxWidth().weight(1f),
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.allowFileAccess = false
                        settings.allowContentAccess = false
                        settings.safeBrowsingEnabled = true
                        webViewClient = object : WebViewClient() {
                            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                                if (!request.isForMainFrame) return false
                                val target = request.url
                                val host = target.host.orEmpty()
                                if ((target.scheme == "https" || target.scheme == "http") &&
                                    (host == HostedDomain || host == LocalDomain || host == "localhost")
                                ) {
                                    return false
                                }
                                if (request.hasGesture() && (target.scheme == "https" || target.scheme == "mailto")) {
                                    try {
                                        context.startActivity(Intent(Intent.ACTION_VIEW, target))
                                    } catch (_: ActivityNotFoundException) {
                                        loadError = "No app can open this link."
                                    }
                                }
                                return true
                            }

                            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                                loadError = ""
                                loading = true
                                canGoBack = view.canGoBack()
                            }

                            override fun onPageFinished(view: WebView, url: String) {
                                loading = false
                                canGoBack = view.canGoBack()
                            }

                            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                                if (request.isForMainFrame) {
                                    loading = false
                                    canGoBack = view.canGoBack()
                                    loadError = if (isLocal) {
                                        "Couldn’t reach local dev server at 127.0.0.1:3002. Ensure dev server is running and ADB port forwarding is active."
                                    } else {
                                        "Couldn’t load the hosted site. Check your connection and reload."
                                    }
                                }
                            }

                            override fun onReceivedHttpError(view: WebView, request: WebResourceRequest, response: WebResourceResponse) {
                                if (request.isForMainFrame) {
                                    loading = false
                                    loadError = "The site returned HTTP ${response.statusCode}."
                                }
                            }
                        }
                        webViewRef = this
                        loadUrl(currentUrl)
                    }
                },
                onRelease = { webView ->
                    if (webViewRef === webView) {
                        webViewRef = null
                        canGoBack = false
                    }
                    webView.stopLoading()
                    webView.destroy()
                }
            )
        }
    }
}
