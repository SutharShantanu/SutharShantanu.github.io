@file:OptIn(ExperimentalMaterial3ExpressiveApi::class)

package dev.shantanusuthar.portfolio

import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ShortNavigationBarItem
import androidx.compose.material3.ShortNavigationBarItemDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Downtify-inspired floating pill navigation bar for mobile devices.
 * Floats cleanly above content with elevated surfaceContainer and pill shape.
 */
@Composable
internal fun FloatingNavBar(
    selected: AdminPage,
    onSelect: (AdminPage) -> Unit,
    badgeFor: (AdminPage) -> Int,
    items: List<AdminPage>,
    modifier: Modifier = Modifier,
) {
    Surface(
        shape = PortfolioTokens.FloatingNavBarShape,
        color = MaterialTheme.colorScheme.surfaceContainer,
        tonalElevation = 6.dp,
        shadowElevation = 8.dp,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
    ) {
        BoxWithConstraints {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(64.dp)
                    .selectableGroup(),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                items.forEach { item ->
                    val isSelected = item == selected
                    val badgeCount = badgeFor(item)
                    ShortNavigationBarItem(
                        selected = isSelected,
                        onClick = { onSelect(item) },
                        icon = {
                            if (badgeCount > 0) {
                                BadgedBox(badge = { Badge { Text(badgeCount.toString()) } }) {
                                    Icon(item.icon, contentDescription = null)
                                }
                            } else {
                                Icon(item.icon, contentDescription = null)
                            }
                        },
                        label = {
                            Text(
                                text = item.label,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                )
                            )
                        },
                        colors = ShortNavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            selectedIndicatorColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedTextColorTopIconPosition = MaterialTheme.colorScheme.primary,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
    }
}
