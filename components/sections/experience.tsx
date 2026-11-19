"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, Avatar, Card, Chip } from "@heroui/react";
import { Award, ChevronDown, MapPin } from "lucide-react";
import { Bento, Tile } from "../ui/motion";
import type { PortfolioData } from "@/lib/portfolio-data";

export default function Experience({
    roles,
    certifications,
}: {
    roles: PortfolioData["roles"];
    certifications: PortfolioData["certifications"];
}) {
    return (
        <div className="grid gap-8">
            <Card>
                <Card.Header>
                    <Card.Title>Experience</Card.Title>
                    <Card.Description className="font-serif text-base italic">Synced with LinkedIn</Card.Description>
                </Card.Header>
                <Card.Content>
                    <ol className="relative grid gap-6">
                        {/* Timeline rail draws itself in */}
                        <motion.span
                            aria-hidden="true"
                            className="absolute top-2 bottom-2 left-[15px] w-px origin-top bg-separator"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {roles.map((role, i) => (
                            <motion.li
                                key={`${role.company}-${role.start}`}
                                className="relative flex gap-4"
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260, damping: 26 }}
                            >
                                <Avatar size="sm" className="z-1 shrink-0 ring-4 ring-[var(--glass-shell)]">
                                    <Avatar.Fallback>{role.company.slice(0, 2)}</Avatar.Fallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-base font-semibold text-foreground">{role.title}</h3>
                                        {role.isCurrent ? (
                                            <Chip size="sm" variant="soft" color="success">
                                                Current role
                                            </Chip>
                                        ) : null}
                                    </div>
                                    <p className="text-sm text-foreground">{role.company}</p>
                                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted">
                                        <span>
                                            {role.start} – {role.end}
                                        </span>
                                        <span>· {role.duration}</span>
                                        {role.location && (
                                            <span className="inline-flex items-center gap-1">
                                                · <MapPin className="size-3" />
                                                {role.location}
                                            </span>
                                        )}
                                    </p>

                                    {role.highlights.length > 0 && (
                                        <Accordion className="mt-2">
                                            <Accordion.Item id="h">
                                                <Accordion.Heading>
                                                    <Accordion.Trigger className="px-0 text-sm text-muted">
                                                        Key achievements &amp; responsibilities
                                                        <Accordion.Indicator>
                                                            <ChevronDown />
                                                        </Accordion.Indicator>
                                                    </Accordion.Trigger>
                                                </Accordion.Heading>
                                                <Accordion.Panel>
                                                    <Accordion.Body className="px-0">
                                                        <ul className="grid list-disc gap-1.5 pl-4 text-sm leading-relaxed text-muted">
                                                            {role.highlights.map((h) => (
                                                                <li key={h}>{h}</li>
                                                            ))}
                                                        </ul>
                                                    </Accordion.Body>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        </Accordion>
                                    )}
                                </div>
                            </motion.li>
                        ))}
                    </ol>
                </Card.Content>
            </Card>

            {certifications.length > 0 && (
                <section aria-labelledby="certs-heading" className="grid gap-4">
                    <div>
                        <h2 id="certs-heading" className="text-lg font-semibold text-foreground">
                            Certifications
                        </h2>
                        <p className="font-serif text-base text-muted italic">Continuous learning, verified</p>
                    </div>
                    <Bento className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {certifications.map((c) => {
                            const body = (
                                <Card className="h-full">
                                    <Card.Header className="flex flex-row items-start gap-3">
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-default">
                                            <Award className="size-5 text-foreground" />
                                        </span>
                                        <div className="min-w-0">
                                            <Card.Title className="text-sm">{c.name}</Card.Title>
                                            <Card.Description>{c.authority}</Card.Description>
                                        </div>
                                    </Card.Header>
                                    <Card.Content>
                                        <span className="font-mono text-xs text-muted">Issued {c.issued}</span>
                                    </Card.Content>
                                </Card>
                            );
                            return (
                                <Tile key={`${c.name}-${c.issued}`}>
                                    {c.url ? (
                                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-focus">
                                            {body}
                                        </a>
                                    ) : (
                                        body
                                    )}
                                </Tile>
                            );
                        })}
                    </Bento>
                </section>
            )}
        </div>
    );
}
