package dev.shantanusuthar.portfolio

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.DisposableEffect
import androidx.core.graphics.drawable.toDrawable
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class MainActivity : ComponentActivity() {
    private val admin by viewModels<AdminState>()

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        super.onCreate(savedInstanceState)

        // Handoff to app as soon as initialized.
        splash.setKeepOnScreenCondition { false }

        setContent {
            val systemDark = isSystemInDarkTheme()
            val darkTheme = when (admin.themeMode) {
                ThemeMode.System -> systemDark
                ThemeMode.Light -> false
                ThemeMode.Dark -> true
            }
            DisposableEffect(darkTheme) {
                val bars = if (darkTheme) {
                    SystemBarStyle.dark(android.graphics.Color.TRANSPARENT)
                } else {
                    SystemBarStyle.light(android.graphics.Color.TRANSPARENT, android.graphics.Color.TRANSPARENT)
                }
                enableEdgeToEdge(statusBarStyle = bars, navigationBarStyle = bars)
                window.setBackgroundDrawable(
                    (if (darkTheme) android.graphics.Color.BLACK else 0xFFF8FAF8.toInt()).toDrawable()
                )
                onDispose {}
            }

            PortfolioTheme(
                darkTheme = darkTheme,
            ) {
                AdminApp(admin)
            }
        }
        admin.restoreSession()
    }

    override fun onResume() {
        super.onResume()
        admin.onForeground()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (intent.action == Intent.ACTION_MAIN) admin.onForeground()
    }
}
