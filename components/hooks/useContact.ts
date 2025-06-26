"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(50, {
            message: "Name must not exceed 50 characters.",
        }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    subject: z
        .string()
        .min(5, {
            message: "Subject must be at least 5 characters.",
        })
        .max(100, {
            message: "Subject must not exceed 100 characters.",
        }),
    message: z
        .string()
        .min(10, {
            message: "Message must be at least 10 characters.",
        })
        .max(1000, {
            message: "Message must not exceed 1000 characters.",
        }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export function useContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formStartTime] = useState(Date.now())

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)

        try {
            // Add spam protection data
            const submissionData = {
                ...data,
                formStartTime,
                // Honeypot fields (will be empty for legitimate users)
                website: "",
                phone: "",
            }

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            })

            // Check if response is ok first
            if (!response.ok) {
                if (response.status === 429) {
                    // Rate limited
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Too many requests. Please try again later.")
                }

                // Try to parse JSON error response
                let errorMessage = "Failed to send message"
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.error || errorMessage
                } catch {
                    // If JSON parsing fails, use status text
                    errorMessage = `Server error: ${response.status} ${response.statusText}`
                }
                throw new Error(errorMessage)
            }

            // Parse successful response
            await response.json()

            toast.success(
                "Message sent successfully! We'll get back to you within 24 hours. Check your email for confirmation."
            )

            form.reset()
        } catch (error) {
            console.error("Form submission error:", error)

            toast.error(
                error instanceof Error
                    ? `Failed to send message: ${error.message}`
                    : "Failed to send message. Please try again or contact us directly."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        form,
        onSubmit,
        isSubmitting,
        formSchema: contactFormSchema,
    }
}
