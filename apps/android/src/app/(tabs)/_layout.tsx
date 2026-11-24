import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import type { ComponentProps, JSX } from "react";
import type { ColorValue } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color }: { name: IoniconName; color: ColorValue }): JSX.Element {
  // RN 0.88's `ColorValue` also admits `null` and processed numbers, which Ionicons rejects.
  const iconColor = color === null || typeof color === "number" ? undefined : color;
  return <Ionicons name={name} size={22} color={iconColor} />;
}

const TABS: { name: string; title: string; icon: IoniconName }[] = [
  { name: "index", title: "Home", icon: "grid-outline" },
  { name: "work", title: "Work", icon: "folder-open-outline" },
  { name: "experience", title: "Experience", icon: "briefcase-outline" },
  { name: "skills", title: "Skills", icon: "sparkles-outline" },
  { name: "contact", title: "Contact", icon: "mail-outline" },
];

export default function TabsLayout(): JSX.Element {
  const [bg, fg, muted, border] = useThemeColor(["background", "foreground", "muted", "separator"]);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: fg,
        tabBarInactiveTintColor: muted,
        tabBarStyle: { backgroundColor: bg, borderTopColor: border },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title, tabBarIcon: ({ color }) => <TabIcon name={t.icon} color={color} /> }} />
      ))}
    </Tabs>
  );
}
