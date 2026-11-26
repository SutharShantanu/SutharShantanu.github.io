package dev.shantanusuthar.portfolio

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * Downtify-inspired Material 3 Expressive theme for Shantanu's Portfolio.
 * Features dark-first luxury tones, electric emerald primary accent,
 * expressive spring motion, and true AMOLED black support.
 */
val PortfolioDarkColors = darkColorScheme(
    primary = Color(0xFF1AD05C),
    onPrimary = Color(0xFF04140A),
    primaryContainer = Color(0xFF0F3F24),
    onPrimaryContainer = Color(0xFF9DF2B8),
    inversePrimary = Color(0xFF006D32),
    secondary = Color(0xFFB4CCBB),
    onSecondary = Color(0xFF1F352A),
    secondaryContainer = Color(0xFF243A2D),
    onSecondaryContainer = Color(0xFFCDEBD6),
    tertiary = Color(0xFF64FFDA),
    onTertiary = Color(0xFF00382E),
    tertiaryContainer = Color(0xFF005143),
    onTertiaryContainer = Color(0xFF85FFE0),
    background = Color(0xFF0B0C0E),
    onBackground = Color(0xFFE6E8E7),
    surface = Color(0xFF0B0C0E),
    onSurface = Color(0xFFE6E8E7),
    surfaceVariant = Color(0xFF282A2E),
    onSurfaceVariant = Color(0xFFA7ACAA),
    surfaceTint = Color(0xFF1AD05C),
    inverseSurface = Color(0xFFE6E8E7),
    inverseOnSurface = Color(0xFF1E2023),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6),
    outline = Color(0xFF6E7471),
    outlineVariant = Color(0xFF34373A),
    scrim = Color(0xFF000000),
    surfaceBright = Color(0xFF2E3134),
    surfaceDim = Color(0xFF0B0C0E),
    surfaceContainerLowest = Color(0xFF08090A),
    surfaceContainerLow = Color(0xFF121416),
    surfaceContainer = Color(0xFF17191C),
    surfaceContainerHigh = Color(0xFF1E2023),
    surfaceContainerHighest = Color(0xFF282A2E),
)

val PortfolioLightColors = lightColorScheme(
    primary = Color(0xFF006D32),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFF7EF8A6),
    onPrimaryContainer = Color(0xFF00210C),
    inversePrimary = Color(0xFF1AD05C),
    secondary = Color(0xFF4E6354),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFCFE9D6),
    onSecondaryContainer = Color(0xFF0B2014),
    tertiary = Color(0xFF006A58),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFF66FBDB),
    onTertiaryContainer = Color(0xFF00201A),
    background = Color(0xFFF8FAF8),
    onBackground = Color(0xFF141715),
    surface = Color(0xFFF8FAF8),
    onSurface = Color(0xFF141715),
    surfaceVariant = Color(0xFFE0E3E1),
    onSurfaceVariant = Color(0xFF4A504C),
    surfaceTint = Color(0xFF006D32),
    inverseSurface = Color(0xFF2D312E),
    inverseOnSurface = Color(0xFFEFF1EF),
    error = Color(0xFFBA1A1A),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFFFDAD6),
    onErrorContainer = Color(0xFF410002),
    outline = Color(0xFF7A807C),
    outlineVariant = Color(0xFFC3C8C4),
    scrim = Color(0xFF000000),
    surfaceBright = Color(0xFFF8FAF8),
    surfaceDim = Color(0xFFD8DBD9),
    surfaceContainerLowest = Color(0xFFFFFFFF),
    surfaceContainerLow = Color(0xFFF2F4F2),
    surfaceContainer = Color(0xFFEDF0EE),
    surfaceContainerHigh = Color(0xFFE6E9E7),
    surfaceContainerHighest = Color(0xFFE0E3E1),
)

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
val PortfolioShapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(20.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

object PortfolioTokens {
    val SectionShape = RoundedCornerShape(24.dp)
}

fun ColorScheme.amoled(): ColorScheme = copy(
    background = Color.Black,
    surface = Color.Black,
    surfaceDim = Color.Black,
    surfaceContainerLowest = Color.Black,
    surfaceContainerLow = surfaceContainerLow.towardsBlack(0.35f),
    surfaceContainer = surfaceContainer.towardsBlack(0.25f),
    surfaceContainerHigh = surfaceContainerHigh.towardsBlack(0.18f),
    surfaceContainerHighest = surfaceContainerHighest.towardsBlack(0.10f),
)

private fun Color.towardsBlack(fraction: Float) = lerp(this, Color.Black, fraction)

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun PortfolioTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val context = LocalContext.current
    val colors = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> PortfolioDarkColors.amoled()
        else -> PortfolioLightColors
    }

    val type = Typography()
    val typography = type.copy(
        displaySmall = type.displaySmall.copy(fontWeight = FontWeight.Bold),
        headlineMedium = type.headlineMedium.copy(fontWeight = FontWeight.Bold),
        headlineSmall = type.headlineSmall.copy(fontWeight = FontWeight.SemiBold),
        titleLarge = type.titleLarge.copy(fontWeight = FontWeight.SemiBold),
        titleMedium = type.titleMedium.copy(fontWeight = FontWeight.SemiBold),
        labelLarge = type.labelLarge.copy(fontWeight = FontWeight.Medium),
    )

    MaterialExpressiveTheme(
        colorScheme = colors,
        motionScheme = MotionScheme.expressive(),
        shapes = PortfolioShapes,
        typography = typography,
        content = content
    )
}
