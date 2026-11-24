import { Accordion, Avatar, Card, Chip, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";
import { Icon, open, Screen, SectionTitle } from "@/components/ui";
import { absolute } from "@/lib/api";

export default function Experience(): JSX.Element {
  return (
    <Screen title="Experience" subtitle="Synced with LinkedIn">
      {({ roles, certifications }) => (
        <>
          {roles.map((r) => (
            <Card key={`${r.company}-${r.start}`}>
              <View className="flex-row items-start gap-3">
                <Avatar size="sm">
                  <Avatar.Fallback>{r.company.slice(0, 2)}</Avatar.Fallback>
                </Avatar>
                <View className="flex-1">
                  <View className="flex-row items-start justify-between gap-2">
                    <Typography.Heading type="h6" className="flex-1">{r.title}</Typography.Heading>
                    {r.isCurrent ? (
                      <Chip size="sm" color="success" variant="soft">
                        <Chip.Label>Current</Chip.Label>
                      </Chip>
                    ) : null}
                  </View>
                  <Typography.Paragraph type="body-sm">{r.company}</Typography.Paragraph>
                  <Typography.Paragraph type="body-xs" color="muted">
                    {r.start} – {r.end} · {r.duration}
                  </Typography.Paragraph>
                  <Typography.Paragraph type="body-xs" color="muted">{r.location}</Typography.Paragraph>
                </View>
              </View>
              {r.highlights.length ? (
                <Accordion selectionMode="single" className="mt-2">
                  <Accordion.Item value="h">
                    <Accordion.Trigger>
                      <Typography.Paragraph type="body-sm" color="muted">Key achievements</Typography.Paragraph>
                      <Accordion.Indicator />
                    </Accordion.Trigger>
                    <Accordion.Content>
                      {r.highlights.map((h) => (
                        <View key={h} className="flex-row gap-2 py-1">
                          <Typography.Paragraph type="body-sm" color="muted">•</Typography.Paragraph>
                          <Typography.Paragraph type="body-sm" className="flex-1">{h}</Typography.Paragraph>
                        </View>
                      ))}
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              ) : null}
            </Card>
          ))}

          <SectionTitle title="Certifications" note="Continuous learning, verified" />
          {certifications.map((c) => {
            const link = c.preview ? absolute(c.preview) : c.url;
            return (
              <Card key={`${c.name}-${c.issued}`} onTouchEnd={link ? () => open(link) : undefined}>
                <View className="flex-row items-center gap-3">
                  <View className="size-10 items-center justify-center rounded-xl bg-default">
                    <Icon name="ribbon-outline" />
                  </View>
                  <View className="flex-1">
                    <Typography.Paragraph type="body-sm" className="font-semibold">{c.name}</Typography.Paragraph>
                    <Typography.Paragraph type="body-xs" color="muted">
                      {c.authority} · Issued {c.issued}
                    </Typography.Paragraph>
                  </View>
                  {link ? <Icon name="open-outline" size={16} color="muted" /> : null}
                </View>
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}
