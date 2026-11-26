@file:OptIn(ExperimentalMaterial3ExpressiveApi::class)

package dev.shantanusuthar.portfolio

import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ShortNavigationBar
import androidx.compose.material3.ShortNavigationBarDefaults
import androidx.compose.material3.ShortNavigationBarItem
import androidx.compose.material3.ShortNavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** Docked Material 3 Expressive bottom navigation bar for compact screens. */
@Composable
internal fun BottomNavBar(
    selected: AdminPage,
    onSelect: (AdminPage) -> Unit,
    badgeFor: (AdminPage) -> Int,
    items: List<AdminPage>,
    modifier: Modifier = Modifier,
) {
    ShortNavigationBar(
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.surfaceContainer,
        windowInsets = ShortNavigationBarDefaults.windowInsets,
    ) {
        items.forEach { item ->
            val isSelected = item == selected
            val badgeCount = badgeFor(item)
            ShortNavigationBarItem(
                selected = isSelected,
                onClick = { onSelect(item) },
                modifier = if (badgeCount > 0) {
                    Modifier.semantics { contentDescription = "${item.label}, $badgeCount need attention" }
                } else {
                    Modifier
                },
                icon = {
                    if (badgeCount > 0) {
                        BadgedBox(badge = { Badge { Text(if (badgeCount > 99) "99+" else badgeCount.toString()) } }) {
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
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedIndicatorColor = selectedTint(),
                    selectedTextColorTopIconPosition = MaterialTheme.colorScheme.primary,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )
        }
    }
}
