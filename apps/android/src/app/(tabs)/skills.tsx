import { Card, Chip, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";
import { BrandLogo } from "@/components/brand-logo";
import { Screen } from "@/components/ui";
import { absolute } from "@/lib/api";

const NOTES: Record<string, string> = {
  Frontend: "Interfaces, design systems & motion",
  Backend: "APIs & data",
  Deployment: "Shipping & hosting",
  Tools: "Daily drivers",
  AI: "Agents & assistants I build with",
};

export default function Skills(): JSX.Element {
  return (
    <Screen title="Skills" subtitle="Tools I use across the stack">
      {({ skills }) => {
        const categories = [...new Set(skills.map((s) => s.category))];
        return categories.map((cat) => {
          const items = skills.filter((s) => s.category === cat);
          return (
            <Card key={cat}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Card.Title>{cat}</Card.Title>
                  <Card.Description>{NOTES[cat] ?? ""}</Card.Description>
                </View>
                <Chip size="sm" variant="soft">
                  <Chip.Label>{items.length}</Chip.Label>
                </Chip>
              </View>
              <View className="mt-3 flex-row flex-wrap gap-2">
                {items.map((s) => (
                  <View key={s.title} className="w-[31%] items-center gap-2 rounded-2xl bg-default px-1 py-3">
                    {/* Brand logos: the website's local theSVG files, fetched over HTTP. */}
                    <View className="size-11 items-center justify-center overflow-hidden rounded-xl bg-white">
                      <BrandLogo uri={absolute(s.icon)} />
                    </View>
                    <Typography.Paragraph type="body-xs" className="text-center font-medium" numberOfLines={1}>
                      {s.title}
                    </Typography.Paragraph>
                  </View>
                ))}
              </View>
            </Card>
          );
        });
      }}
    </Screen>
  );
}
