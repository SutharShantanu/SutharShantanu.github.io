"use client";

import React, { useState } from "react";
import { useContactForm } from "./hooks/useContact";
import { TextField, Label, Input, TextArea, FieldError, Button, Spinner } from "@heroui/react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { FluidReveal } from "./ui/fluid-reveal";
import { toast } from "sonner";

export default function Contact() {
    const { form, onSubmit, isSubmitting } = useContactForm();
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("shantanusut2000@gmail.com");
        setCopied(true);
        toast.success("Email copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <FluidReveal id="contact" aria-labelledby="contact-heading" className="scroll-mt-12">
            <h2
                id="contact-heading"
                className="relative text-foreground text-[15px] font-medium leading-6 mb-4"
            >
                <span
                    aria-hidden="true"
                    className="sm:absolute sm:top-0 sm:right-[calc(100%+12px)] text-muted font-normal tabular-nums mr-2 sm:mr-0 inline-block"
                >
                    6
                </span>
                Get in touch
            </h2>

            <div className="grid gap-6 text-[15px]">
                <p className="text-muted leading-relaxed">
                    Whether you have an upcoming project, frontend engineering opportunity, or simply want to connect, feel free to dispatch a note below or reach out directly.
                </p>

                {/* Direct email quick action using HeroUI v3 Button */}
                <div className="flex items-center gap-3 py-1">
                    <Button
                        variant="secondary"
                        size="sm"
                        onPress={handleCopyEmail}
                        className="font-mono text-xs flex items-center gap-2"
                        aria-label="Copy email address"
                    >
                        {copied ? (
                            <>
                                <Check className="size-3.5 text-success" />
                                <span>Copied to clipboard</span>
                            </>
                        ) : (
                            <>
                                <Copy className="size-3.5 text-muted" />
                                <span>shantanusut2000@gmail.com</span>
                            </>
                        )}
                    </Button>
                    <a
                        href="mailto:shantanusut2000@gmail.com"
                        className="text-muted hover:text-foreground transition-colors"
                        title="Open email client"
                        aria-label="Open default mail client"
                    >
                        <ArrowUpRight className="size-4" />
                    </a>
                </div>

                {/* Form built with native HeroUI v3 Field & Form components (no customization) */}
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 pt-1"
                    aria-label="Contact form"
                >
                    {/* Honeypot */}
                    <div style={{ display: "none" }} aria-hidden="true">
                        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                        <input type="text" name="phone" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <TextField
                            isRequired
                            isInvalid={!!form.formState.errors.name}
                            className="w-full"
                        >
                            <Label className="text-xs text-muted mb-1">Your Name</Label>
                            <Input
                                {...form.register("name")}
                                placeholder="Jane Doe"
                                required
                            />
                            {form.formState.errors.name && (
                                <FieldError className="text-xs text-danger mt-1">
                                    {form.formState.errors.name.message}
                                </FieldError>
                            )}
                        </TextField>

                        {/* Email Field */}
                        <TextField
                            isRequired
                            type="email"
                            isInvalid={!!form.formState.errors.email}
                            className="w-full"
                        >
                            <Label className="text-xs text-muted mb-1">Email Address</Label>
                            <Input
                                {...form.register("email")}
                                type="email"
                                placeholder="jane@company.com"
                                required
                            />
                            {form.formState.errors.email && (
                                <FieldError className="text-xs text-danger mt-1">
                                    {form.formState.errors.email.message}
                                </FieldError>
                            )}
                        </TextField>
                    </div>

                    {/* Hidden subject default */}
                    <input type="hidden" {...form.register("subject")} value="general" />

                    {/* Message Field */}
                    <TextField
                        isRequired
                        isInvalid={!!form.formState.errors.message}
                        className="w-full"
                    >
                        <Label className="text-xs text-muted mb-1">Message</Label>
                        <TextArea
                            {...form.register("message")}
                            placeholder="Write your note, inquiry, or project scope..."
                            rows={4}
                            required
                        />
                        {form.formState.errors.message && (
                            <FieldError className="text-xs text-danger mt-1">
                                {form.formState.errors.message.message}
                            </FieldError>
                        )}
                    </TextField>

                    {/* Submit Button using standard HeroUI v3 Button with isPending */}
                    <div className="pt-1">
                        <Button
                            type="submit"
                            variant="primary"
                            isPending={isSubmitting}
                            className="rounded-full px-5"
                        >
                            {({ isPending }) => (
                                <div className="flex items-center gap-1.5">
                                    {isPending && <Spinner size="sm" color="current" />}
                                    <span>{isPending ? "Sending..." : "Send message"}</span>
                                    {!isPending && <ArrowUpRight className="size-3.5" />}
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </FluidReveal>
    );
}
