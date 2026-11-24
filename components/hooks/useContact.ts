"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@heroui/react";

// Subjects available in the contact form
const allowedSubjects = ["general", "proposal", "feedback", "other"] as const;

const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(50, { message: "Name must not exceed 50 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    subject: z.enum(allowedSubjects, {
        message: "Please select a valid subject.",
    }),
    message: z
        .string()
        .min(10, { message: "Message must be at least 10 characters." })
        .max(1000, { message: "Message must not exceed 1000 characters." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function useContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStartTime, setFormStartTime] = useState(() => Date.now());

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            subject: undefined,
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormData, event?: React.BaseSyntheticEvent) => {
        setIsSubmitting(true);

        try {
            // Find form element to extract stealth honeypot fields
            const formEl =
                (event?.currentTarget instanceof HTMLFormElement ? event.currentTarget : null) ||
                (event?.target instanceof HTMLFormElement ? event.target : null) ||
                (typeof document !== "undefined"
                    ? document.querySelector<HTMLFormElement>("form[aria-label='Contact form']")
                    : null);

            const getHoneypotValue = (name: string): string => {
                if (!formEl) return "";
                const element = formEl.elements.namedItem(name);
                if (element instanceof HTMLInputElement) {
                    return element.value.trim();
                }
                return "";
            };

            const submissionData = {
                ...data,
                formStartTime,
                website: getHoneypotValue("website"),
                phone: getHoneypotValue("phone"),
                companyFax: getHoneypotValue("companyFax"),
                _gotcha: getHoneypotValue("_gotcha"),
            };

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json().catch(() => null);

            // Handle non-200 responses with dedicated toast styles according to status
            if (!response.ok) {
                if (response.status === 429) {
                    // Rate limit triggered (IP or Email limit)
                    toast.warning("Rate limit exceeded", {
                        description:
                            result?.message ||
                            "You have submitted multiple requests recently. Please wait before trying again.",
                    });
                    return;
                }

                if (response.status === 413) {
                    // Message too large
                    toast.danger("Message too large", {
                        description: result?.message || "Please shorten your message and try again.",
                    });
                    return;
                }

                if (response.status === 400) {
                    // Validation failure
                    toast.danger("Validation error", {
                        description:
                            result?.message || "Please double-check the form fields and try again.",
                    });
                    return;
                }

                // 500 / 503 / others
                toast.danger("Delivery failed", {
                    description:
                        result?.message ||
                        "Unable to send your message right now. Please try reaching out directly via email.",
                });
                return;
            }

            // Status 200 OK: Check confirmation email status
            if (result?.simulated) {
                toast.info("Message sent (Simulation)", {
                    description:
                        "Development environment: Email sending and confirmation receipt were simulated.",
                });
            } else if (result?.confirmationSent) {
                toast.success("Message sent successfully!", {
                    description: `A confirmation email has been sent to ${data.email}. I'll get back to you soon.`,
                });
            } else {
                toast.success("Message received!", {
                    description:
                        result?.message || "Thank you for reaching out. I'll get back to you shortly.",
                });
            }

            // Reset form and refresh form start time
            form.reset();
            setFormStartTime(Date.now());
        } catch (error) {
            console.error("Form submission network error:", error);

            toast.danger("Network error", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to connect to the server. Please check your internet connection.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        onSubmit,
        isSubmitting,
        formSchema: contactFormSchema,
    };
}
