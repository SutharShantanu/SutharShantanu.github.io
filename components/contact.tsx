"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContactForm } from "./hooks/useContact";
import { Button, Card, Description, FieldError, Input, Label, ListBox, Select, Spinner, TextArea, TextField, toast } from "@heroui/react";
import { Bento, IconSwap, SpinningText, Tile, useShake } from "./ui/motion";

import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail } from "@/components/icons";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "./sections/constants/social.constant";

const SUBJECTS = [
    { id: "general", label: "General inquiry" },
    { id: "proposal", label: "Project proposal" },
    { id: "feedback", label: "Feedback" },
    { id: "other", label: "Other" },
] as const;

// ASCII envelope + a tiny shell session; decorative (aria-hidden), drawn line by line.
const ASCII = String.raw`  ____________________
 |\                  /|
 | \    say hello   / |
 |  \______________/  |
 |____________________|`;
const SESSION = [
    ["$", "whoami"],
    ["", "shantanu · software engineer"],
    ["$", "cat status.txt"],
    ["", "open to roles, freelance & good ideas"],
] as const;

/** Live local time in Gurugram (rendered after mount to avoid a hydration mismatch). */
function useLocalTime() {
    const [time, setTime] = useState<string | null>(null);
    useEffect(() => {
        const fmt = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
        const tick = () => setTime(fmt());
        const first = setTimeout(tick, 0);
        const id = setInterval(tick, 30_000);
        return () => {
            clearTimeout(first);
            clearInterval(id);
        };
    }, []);
    return time;
}

function Terminal() {
    const lines = [...ASCII.split("\n").map((l) => ["", l] as const), ["", ""] as const, ...SESSION];
    return (
        <div aria-hidden="true" className="flex-1 overflow-hidden rounded-2xl border border-separator bg-foreground/[0.04] p-4 font-mono text-[11px] leading-relaxed text-muted sm:text-xs">
            <div className="mb-3 flex gap-1.5">
                <span className="size-2.5 rounded-full bg-danger/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
            </div>
            <motion.pre
                className="whitespace-pre"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.07 }}
            >
                {lines.map(([prompt, text], i) => (
                    <motion.span
                        key={i}
                        className="block min-h-[1.6em]"
                        variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
                    >
                        {prompt && <span className="text-success">{prompt} </span>}
                        <span className={prompt ? "text-foreground" : ""}>{text}</span>
                    </motion.span>
                ))}
                <motion.span
                    className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-foreground/70"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                />
            </motion.pre>
        </div>
    );
}

export default function Contact() {
    const time = useLocalTime();
    const { form, onSubmit, isSubmitting } = useContactForm();
    const [copied, setCopied] = useState(false);
    const { errors } = form.formState;
    const subject = form.watch("subject");
    const messageLength = form.watch("message")?.length ?? 0;
    const [formRef, shake] = useShake<HTMLFormElement>();

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(EMAIL);
        setCopied(true);
        toast.success("Email copied to clipboard");
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Bento className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <Tile lift={false}>
            <Card className="relative h-full">
                {/* Spinning "say hello" badge (Magic UI Spinning Text, framer-motion) */}
                <div className="pointer-events-none absolute top-3 right-3 hidden size-20 place-items-center sm:grid" aria-hidden="true">
                    <SpinningText text="say hello • let's build • " radius={4.4} className="font-mono text-[9px] tracking-wider text-muted uppercase" />
                    <span className="absolute grid size-9 place-items-center rounded-full bg-default">
                        <Mail className="size-4 text-foreground" />
                    </span>
                </div>
                <Card.Header className="sm:pr-24">
                    <Card.Title className="text-2xl">
                        Let&apos;s <span className="inline-block -rotate-2 font-hand font-semibold text-[1.3em] leading-none">connect</span>
                    </Card.Title>
                    <Card.Description>
                        Upcoming project, frontend role, or just want to connect? Send a note or reach out directly.
                    </Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-1 flex-col gap-4">
                    <Terminal />
                    <div className="flex flex-row flex-wrap items-center gap-2">
                        <Button variant="secondary" size="sm" className="max-w-full min-w-0" onPress={handleCopyEmail} aria-label={copied ? "Email address copied" : "Copy email address"}>
                            <IconSwap swapKey={copied ? "copied" : "idle"} className="inline-flex items-center">
                                {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                            </IconSwap>
                            <span className="truncate">{EMAIL}</span>
                        </Button>
                        <Button isIconOnly variant="ghost" size="sm" aria-label="Open default mail client" onPress={() => (window.location.href = `mailto:${EMAIL}`)}>
                            <ArrowUpRight className="size-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-separator pt-3 text-xs text-muted">
                        <span className="font-mono">Gurugram, IN{time && ` · ${time} IST`}</span>
                        <span className="flex gap-1">
                            <Button isIconOnly variant="ghost" size="sm" aria-label="GitHub profile" onPress={() => window.open(GITHUB_URL, "_blank", "noopener,noreferrer")}>
                                <Github className="size-4" />
                            </Button>
                            <Button isIconOnly variant="ghost" size="sm" aria-label="LinkedIn profile" onPress={() => window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer")}>
                                <Linkedin className="size-4" />
                            </Button>
                        </span>
                    </div>
                </Card.Content>
            </Card>
            </Tile>

            <Tile lift={false}>
            <Card className="h-full">
                <Card.Content>
                    <form ref={formRef} noValidate onSubmit={form.handleSubmit(onSubmit, shake)} className="grid gap-4" aria-label="Contact form">
                        {/* Anti-bot Honeypots (Offscreen traps for automated bots) */}
                        <div className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0 pointer-events-none overflow-hidden select-none" aria-hidden="true" tabIndex={-1}>
                            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                            <input type="text" name="phone" tabIndex={-1} autoComplete="off" defaultValue="" />
                            <input type="text" name="companyFax" tabIndex={-1} autoComplete="off" defaultValue="" />
                            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField isRequired isInvalid={!!errors.name}>
                                <Label>Your name</Label>
                                <Input {...form.register("name")} placeholder="Jane Doe" />
                                <FieldError>{errors.name?.message}</FieldError>
                            </TextField>

                            <TextField isRequired type="email" isInvalid={!!errors.email}>
                                <Label>Email address</Label>
                                <Input {...form.register("email")} type="email" placeholder="jane@company.com" />
                                <FieldError>{errors.email?.message}</FieldError>
                            </TextField>
                        </div>

                        <Select
                            isRequired
                            isInvalid={!!errors.subject}
                            placeholder="Choose a subject"
                            value={subject ?? null}
                            onChange={(v) => form.setValue("subject", v as (typeof SUBJECTS)[number]["id"], { shouldValidate: true })}
                        >
                            <Label>Subject</Label>
                            <Select.Trigger>
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {SUBJECTS.map((s) => (
                                        <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                                            {s.label}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                            <FieldError>{errors.subject?.message}</FieldError>
                        </Select>

                        <TextField isRequired isInvalid={!!errors.message}>
                            <Label>Message</Label>
                            <TextArea {...form.register("message")} placeholder="Write your note, inquiry, or project scope..." rows={5} />
                            <Description className="tabular-nums">{messageLength}/1000 characters</Description>
                            <FieldError>{errors.message?.message}</FieldError>
                        </TextField>

                        <div>
                            <Button type="submit" variant="primary" isPending={isSubmitting}>
                                {({ isPending }) => (
                                    <IconSwap swapKey={isPending ? "sending" : "idle"}>
                                        {isPending ? <Spinner size="sm" color="current" /> : <ArrowUpRight className="size-3.5" />}
                                        {isPending ? "Sending…" : "Send message"}
                                    </IconSwap>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card.Content>
            </Card>
            </Tile>
        </Bento>
    );
}
