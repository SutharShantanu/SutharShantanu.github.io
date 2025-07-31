"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Updated subject field to accept only defined options
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
    const [formStartTime] = useState(Date.now());

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            subject: undefined, // Dropdown default (Select component handles placeholder)
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            const submissionData = {
                ...data,
                formStartTime,
                website: "",
                phone: "",
            };

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Too many requests. Please try again later.");
                }

                let errorMessage = "Failed to send message.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }

                throw new Error(errorMessage);
            }

            await response.json();

            toast.success("Message sent successfully! We'll get back to you shortly.");

            form.reset();
        } catch (error) {
            console.error("Form submission error:", error);

            toast.error(
                error instanceof Error
                    ? `Failed to send message: ${error.message}`
                    : "Failed to send message. Please try again later."
            );
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
