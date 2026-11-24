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
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
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
    var reload by remember { mutableIntStateOf(0) }

    val currentUrl = if (isLocal) LocalUrl else HostedUrl

    Column(Modifier.fillMaxSize()) {
        Column(Modifier.padding(horizontal = 16.dp, vertical = 6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("Preview", style = MaterialTheme.typography.titleLarge)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = !isLocal,
                    onClick = { if (isLocal) { isLocal = false; reload++ } },
                    label = { Text("Vercel (Live)") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
                FilterChip(
                    selected = isLocal,
                    onClick = { if (!isLocal) { isLocal = true; reload++ } },
                    label = { Text("Local Dev (Port 3002)") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
            }
            Supporting(
                if (isLocal) "Live Next.js dev server on port 3002. Local visibility edits appear immediately."
                else "Live Vercel production deployment ($HostedDomain). Visibility edits take effect after pushing to main."
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                TextButton(onClick = { reload++ }) { Text("Reload") }
                Link("Open in browser", currentUrl)
            }
            if (loadError.isNotBlank()) Supporting(loadError)
        }
        if (loading) LinearProgressIndicator(Modifier.fillMaxWidth())
        key(reload, isLocal) {
            AndroidView(
                modifier = Modifier.fillMaxWidth().weight(1f),
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.allowFileAccess = false
                        settings.allowContentAccess = false
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
                            }

                            override fun onPageFinished(view: WebView, url: String) {
                                loading = false
                            }

                            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                                if (request.isForMainFrame) {
                                    loading = false
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
                        loadUrl(currentUrl)
                    }
                },
                onRelease = { webView ->
                    webView.stopLoading()
                    webView.destroy()
                }
            )
        }
    }
}
