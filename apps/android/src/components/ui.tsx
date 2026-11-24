import { Ionicons } from "@expo/vector-icons";
import { Card, Skeleton, Typography, useThemeColor } from "heroui-native";
import type { ComponentProps, JSX, ReactNode } from "react";
import { Linking, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePortfolio } from "@/lib/portfolio-context";
import type { Portfolio } from "@/lib/types";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export const open = (url: string) => Linking.openURL(url).catch(() => {});

/** Themed Ionicon (HeroUI theme colors, so it follows light/dark). */
export function Icon({ name, size = 18, color = "foreground" }: { name: IconName; size?: number; color?: "foreground" | "muted" | "accent" | "success" }): JSX.Element {
  const c = useThemeColor(color);
  return <Ionicons name={name} size={size} color={c} />;
}

/**
 * Tab screen: safe area, pull-to-refresh, title block. Renders a skeleton until the
 * first data arrives (cached copy or network), then `children(data)`.
 */
export function Screen({ title, subtitle, children }: { title: string; subtitle?: string; children: (data: Portfolio) => ReactNode }): JSX.Element {
  const { data, error, refreshing, refresh } = usePortfolio();
  const tint = useThemeColor("foreground");
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="gap-4 px-4 pt-2 pb-10"
        refreshControl={<RefreshControl refreshing={refreshing && !!data} onRefresh={refresh} tintColor={tint} />}
      >
        <View className="gap-1 pt-2">
          <Typography.Heading type="h2">{title}</Typography.Heading>
          {subtitle ? <Typography.Paragraph type="body-sm" color="muted">{subtitle}</Typography.Paragraph> : null}
        </View>
        {data ? children(data) : error ? <ErrorCard message={error} onRetry={refresh} /> : <LoadingCards />}
      </ScrollView>
    </SafeAreaView>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }): JSX.Element {
  return (
    <Card>
      <Card.Body className="gap-2">
        <Card.Title>Can&apos;t reach the portfolio</Card.Title>
        <Card.Description>{message}. Pull down to retry.</Card.Description>
        <Typography.Paragraph type="body-sm" className="text-accent" onPress={onRetry}>
          Retry now
        </Typography.Paragraph>
      </Card.Body>
    </Card>
  );
}

/** High-contrast placeholder cards shaped like the real content. */
export function LoadingCards(): JSX.Element {
  return (
    <View className="gap-4">
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <View className="flex-row items-center gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <View className="flex-1 gap-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </View>
          </View>
          <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
        </Card>
      ))}
    </View>
  );
}

export function SectionTitle({ title, note }: { title: string; note?: string }): JSX.Element {
  return (
    <View className="mt-2 gap-0.5">
      <Typography.Heading type="h4">{title}</Typography.Heading>
      {note ? <Typography.Paragraph type="body-xs" color="muted">{note}</Typography.Paragraph> : null}
    </View>
  );
}

/** Number + label tile used in stat grids. */
export function Stat({ value, label, icon }: { value: string | number; label: string; icon?: IconName }): JSX.Element {
  return (
    <Card variant="secondary" className="min-w-[46%] flex-1 gap-1 p-3">
      <View className="flex-row items-center justify-between">
        <Typography.Paragraph type="body-xs" color="muted">{label}</Typography.Paragraph>
        {icon ? <Icon name={icon} size={14} color="muted" /> : null}
      </View>
      <Typography.Heading type="h3">{String(value)}</Typography.Heading>
    </Card>
  );
}
