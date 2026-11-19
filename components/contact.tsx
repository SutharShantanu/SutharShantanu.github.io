"use client";

import React, { useState } from "react";
import { useContactForm } from "./hooks/useContact";
import { Button, Card, Description, FieldError, Input, Label, ListBox, Select, Spinner, TextArea, TextField, toast } from "@heroui/react";
import { Bento, IconSwap, SpinningText, Tile, useShake } from "./ui/motion";

import { ArrowUpRight, Check, Copy, Mail } from "@/components/icons";
import { EMAIL } from "./sections/constants/social.constant";

const SUBJECTS = [
    { id: "general", label: "General inquiry" },
    { id: "proposal", label: "Project proposal" },
    { id: "feedback", label: "Feedback" },
    { id: "other", label: "Other" },
] as const;

export default function Contact() {
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
        <Bento className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <Tile lift={false}>
            <Card className="relative">
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
                <Card.Content className="flex flex-row flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" onPress={handleCopyEmail} aria-label={copied ? "Email address copied" : "Copy email address"}>
                        <IconSwap swapKey={copied ? "copied" : "idle"} className="inline-flex items-center">
                            {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                        </IconSwap>
                        {EMAIL}
                    </Button>
                    <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        aria-label="Open default mail client"
                        onPress={() => (window.location.href = `mailto:${EMAIL}`)}
                    >
                        <ArrowUpRight className="size-4" />
                    </Button>
                </Card.Content>
            </Card>
            </Tile>

            <Tile lift={false}>
            <Card>
                <Card.Content>
                    <form ref={formRef} noValidate onSubmit={form.handleSubmit(onSubmit, shake)} className="grid gap-4" aria-label="Contact form">
                        {/* Honeypot */}
                        <div style={{ display: "none" }} aria-hidden="true">
                            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                            <input type="text" name="phone" tabIndex={-1} autoComplete="off" />
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
