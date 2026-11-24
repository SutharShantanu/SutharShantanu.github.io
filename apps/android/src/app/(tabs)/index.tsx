import { Avatar, Button, Card, Chip, PressableFeedback, Separator, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";
import { Icon, type IconName, open, Screen, SectionTitle, Stat } from "@/components/ui";
import type { Activity } from "@/lib/types";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

const ACTIVITY_ICON: Record<Activity["kind"], IconName> = {
  push: "git-commit-outline",
  pr: "git-pull-request-outline",
  issue: "alert-circle-outline",
  create: "add-circle-outline",
  star: "star-outline",
  fork: "git-branch-outline",
  release: "rocket-outline",
  other: "logo-github",
};

export default function Home(): JSX.Element {
  return (
    <Screen title="Hi, I'm Shantanu" subtitle="Software Engineer · portfolio">
      {({ profile, github, roles, recommendations }) => {
        const current = roles.find((r) => r.isCurrent) ?? roles[0];
        const maxYear = Math.max(1, ...Object.values(github.yearTotals));
        return (
          <>
            <Card>
              <View className="flex-row items-center gap-3">
                <Avatar size="lg">
                  <Avatar.Image source={{ uri: github.avatar }} />
                  <Avatar.Fallback>SS</Avatar.Fallback>
                </Avatar>
                <View className="flex-1">
                  <Typography.Heading type="h4">{profile.name}</Typography.Heading>
                  <Typography.Paragraph type="body-sm" color="muted">
                    {profile.jobTitle} at {profile.company}
                  </Typography.Paragraph>
                  <View className="mt-1 flex-row items-center gap-1">
                    <Icon name="location-outline" size={12} color="muted" />
                    <Typography.Paragraph type="body-xs" color="muted">{profile.location}</Typography.Paragraph>
                  </View>
                </View>
              </View>
              <Typography.Paragraph type="body-sm" className="mt-3">
                Building scalable, fluid web apps with Next.js &amp; TypeScript, with a focus on performant, accessible and visually polished interfaces.
              </Typography.Paragraph>
              <View className="mt-4 flex-row gap-2">
                <Button size="sm" className="flex-1" onPress={() => open(github.url)}>
                  <Button.Label>GitHub</Button.Label>
                </Button>
                <Button size="sm" variant="secondary" className="flex-1" onPress={() => open(profile.linkedinUrl)}>
                  <Button.Label>LinkedIn</Button.Label>
                </Button>
              </View>
            </Card>

            <View className="flex-row flex-wrap gap-3">
              <Stat value={`${profile.experienceYears}+ yrs`} label="Experience" icon="briefcase-outline" />
              <Stat value={github.publicRepos} label="Public repos" icon="folder-outline" />
              <Stat value={github.contributionTotal} label="Contributions" icon="git-commit-outline" />
              <Stat value={profile.followers} label="LinkedIn followers" icon="people-outline" />
            </View>

            {current ? (
              <Card>
                <View className="flex-row items-center justify-between">
                  <Typography.Paragraph type="body-xs" color="muted">Currently</Typography.Paragraph>
                  <Chip size="sm" color="success" variant="soft">
                    <Chip.Label>{current.duration}</Chip.Label>
                  </Chip>
                </View>
                <Typography.Heading type="h5" className="mt-1">{current.title}</Typography.Heading>
                <Typography.Paragraph type="body-sm" color="muted">
                  {current.company} · since {current.start}
                </Typography.Paragraph>
              </Card>
            ) : null}

            <SectionTitle title="Contributions by year" note={`${github.contributionTotal} on GitHub`} />
            <Card>
              {Object.entries(github.yearTotals)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([year, n]) => (
                  <View key={year} className="flex-row items-center gap-3 py-1.5">
                    <Typography.Paragraph type="body-sm" className="w-12">{year}</Typography.Paragraph>
                    <View className="h-2.5 flex-1 overflow-hidden rounded-full bg-default">
                      <View className="h-full rounded-full bg-foreground" style={{ width: `${(n / maxYear) * 100}%` }} />
                    </View>
                    <Typography.Paragraph type="body-xs" color="muted" className="w-10 text-right">{n}</Typography.Paragraph>
                  </View>
                ))}
            </Card>

            <SectionTitle title="Recent activity" note="What I've been shipping lately" />
            {github.activity.slice(0, 3).map((a) => (
              <PressableFeedback key={a.id} onPress={() => open(a.url)}>
                <Card>
                  <View className="flex-row items-start gap-3">
                    <View className="size-8 items-center justify-center rounded-xl bg-default">
                      <Icon name={ACTIVITY_ICON[a.kind]} size={16} />
                    </View>
                    <View className="flex-1 gap-0.5">
                      <View className="flex-row items-center justify-between gap-2">
                        <Typography.Paragraph type="body-sm" className="flex-1 font-semibold" numberOfLines={1}>
                          {a.repo.split("/").pop()}
                        </Typography.Paragraph>
                        <Typography.Paragraph type="body-xs" color="muted">{a.ago}</Typography.Paragraph>
                      </View>
                      <Typography.Paragraph type="body-xs" color="muted">{a.title}</Typography.Paragraph>
                      {a.commits.slice(0, 2).map((c) => (
                        <Typography.Paragraph key={c.sha} type="body-xs" numberOfLines={1}>
                          {c.sha} · {c.message}
                        </Typography.Paragraph>
                      ))}
                    </View>
                  </View>
                </Card>
              </PressableFeedback>
            ))}

            <SectionTitle title="Recommendations" note="From LinkedIn" />
            {recommendations.map((r) => (
              <Card key={r.username}>
                <Icon name="chatbubble-ellipses-outline" size={18} color="muted" />
                <Typography.Paragraph className="mt-2 italic">“{r.text}”</Typography.Paragraph>
                <Separator className="my-3" />
                <View className="flex-row items-center gap-3">
                  <Avatar size="sm">
                    <Avatar.Fallback>{initials(r.name)}</Avatar.Fallback>
                  </Avatar>
                  <View>
                    <Typography.Paragraph type="body-sm" className="font-semibold">{r.name}</Typography.Paragraph>
                    <Typography.Paragraph type="body-xs" color="muted">Recommendation on LinkedIn</Typography.Paragraph>
                  </View>
                </View>
              </Card>
            ))}
          </>
        );
      }}
    </Screen>
  );
}
