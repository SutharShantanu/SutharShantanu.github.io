"use client";

import { Card } from "@heroui/react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PortfolioData } from "@/lib/portfolio-data";

export default function LanguageChart({ languages }: { languages: PortfolioData["github"]["languages"] }) {
    return (
        <Card className="h-full">
            <Card.Header>
                <Card.Title>Repos by language</Card.Title>
                <Card.Description>Public GitHub repositories</Card.Description>
            </Card.Header>
            <Card.Content>
                <div className="h-36 text-foreground" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={144}>
                        <BarChart accessibilityLayer={false} data={languages} margin={{ top: 8, right: 0, bottom: 0, left: -24 }}>
                            <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.08} />
                            <XAxis dataKey="name" interval={0} tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                            <Tooltip
                                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                                contentStyle={{
                                    background: "var(--overlay)",
                                    border: "none",
                                    borderRadius: 12,
                                    boxShadow: "var(--overlay-shadow)",
                                    color: "var(--overlay-foreground)",
                                    fontSize: 12,
                                }}
                                labelStyle={{ color: "var(--overlay-foreground)", fontWeight: 600 }}
                                itemStyle={{ color: "var(--overlay-foreground)" }}
                                formatter={(value) => [value, "Repos"]}
                            />
                            <Bar dataKey="count" isAnimationActive={false} fill="currentColor" fillOpacity={0.55} radius={[4, 4, 0, 0]} maxBarSize={22} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <table className="sr-only">
                    <caption>Public repositories by language</caption>
                    <tbody>
                        {languages.map((l) => (
                            <tr key={l.name}>
                                <th scope="row">{l.name}</th>
                                <td>{l.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card.Content>
        </Card>
    );
}
