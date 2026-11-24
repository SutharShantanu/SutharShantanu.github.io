import { Button, Card, Chip, Input, Typography } from "heroui-native";
import { useMemo, useState, type JSX } from "react";
import { View } from "react-native";
import { Icon, open, Screen, SectionTitle } from "@/components/ui";
import type { Project, Repo } from "@/lib/types";

const PAGE = 6;

function RepoCard({ repo }: { repo: Repo }): JSX.Element {
  return (
    <Card>
      <Card.Body className="gap-1">
        <Card.Title numberOfLines={1}>{repo.name}</Card.Title>
        <Card.Description numberOfLines={2}>{repo.description || "No description provided."}</Card.Description>
      </Card.Body>
      <View className="mt-2 flex-row flex-wrap items-center gap-3">
        {repo.language ? (
          <Chip size="sm" variant="secondary">
            <Chip.Label>{repo.language}</Chip.Label>
          </Chip>
        ) : null}
        <View className="flex-row items-center gap-1">
          <Icon name="star-outline" size={12} color="muted" />
          <Typography.Paragraph type="body-xs" color="muted">{repo.stars}</Typography.Paragraph>
        </View>
        <Typography.Paragraph type="body-xs" color="muted">
          Pushed {new Date(repo.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </Typography.Paragraph>
      </View>
      <Card.Footer className="mt-3 flex-row gap-2">
        {repo.homepage ? (
          <Button size="sm" onPress={() => open(repo.homepage!)}>
            <Button.Label>Live</Button.Label>
          </Button>
        ) : null}
        <Button size="sm" variant="secondary" onPress={() => open(repo.url)}>
          <Button.Label>Code</Button.Label>
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default function Work(): JSX.Element {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  return (
    <Screen title="Work" subtitle="Featured projects and live GitHub repos">
      {({ projects, repos }) => (
        <WorkBody projects={projects} repos={repos} query={query} setQuery={setQuery} shown={shown} setShown={setShown} />
      )}
    </Screen>
  );
}

function WorkBody({
  projects,
  repos,
  query,
  setQuery,
  shown,
  setShown,
}: {
  projects: Project[];
  repos: Repo[];
  query: string;
  setQuery: (q: string) => void;
  shown: number;
  setShown: (n: number) => void;
}): JSX.Element {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? repos.filter((r) => `${r.name} ${r.description} ${r.language ?? ""}`.toLowerCase().includes(q)) : repos;
  }, [repos, query]);

  return (
    <>
      {projects.map((p, i) => (
        <Card key={p.id}>
          <View className="flex-row items-start gap-3">
            <Typography.Heading type="h3" color="muted">{String(i + 1).padStart(2, "0")}</Typography.Heading>
            <View className="flex-1">
              <Typography.Heading type="h5">{p.title}</Typography.Heading>
              <Typography.Paragraph type="body-sm" color="muted" className="italic">{p.subtitle}</Typography.Paragraph>
            </View>
          </View>
          <Typography.Paragraph type="body-sm" color="muted" className="mt-3">{p.description}</Typography.Paragraph>
          <View className="mt-3 gap-2">
            {p.previews.map((pv) => (
              <Card key={pv.title} variant="secondary" className="p-3">
                <View className="flex-row items-start justify-between gap-2">
                  <Typography.Paragraph type="body-sm" className="flex-1 font-semibold">{pv.title}</Typography.Paragraph>
                  {pv.badge ? (
                    <Chip size="sm" color="success" variant="soft">
                      <Chip.Label>{pv.badge}</Chip.Label>
                    </Chip>
                  ) : null}
                </View>
                <Typography.Paragraph type="body-xs" color="muted" className="mt-1">{pv.caption}</Typography.Paragraph>
              </Card>
            ))}
          </View>
          <View className="mt-3 flex-row flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <Chip key={t} size="sm" variant="secondary">
                <Chip.Label>{t}</Chip.Label>
              </Chip>
            ))}
          </View>
          <View className="mt-4 flex-row gap-2">
            {p.liveUrl ? (
              <Button size="sm" className="flex-1" onPress={() => open(p.liveUrl!)}>
                <Button.Label>Live demo</Button.Label>
              </Button>
            ) : null}
            <Button size="sm" variant="secondary" className="flex-1" onPress={() => open(p.githubUrl)}>
              <Button.Label>Source</Button.Label>
            </Button>
          </View>
        </Card>
      ))}

      <SectionTitle title="All repositories" note={`${repos.length} repos, latest pushes first`} />
      <Input placeholder="Search repositories…" value={query} onChangeText={setQuery} autoCapitalize="none" />
      {filtered.slice(0, shown).map((r) => (
        <RepoCard key={r.id} repo={r} />
      ))}
      {filtered.length === 0 ? <Typography.Paragraph color="muted">No repositories match.</Typography.Paragraph> : null}
      {filtered.length > shown ? (
        <Button variant="outline" onPress={() => setShown(shown + PAGE)}>
          <Button.Label>Show more ({filtered.length - shown} left)</Button.Label>
        </Button>
      ) : null}
    </>
  );
}
