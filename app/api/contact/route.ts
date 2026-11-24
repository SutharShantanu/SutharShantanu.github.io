import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { rateLimiter, emailRateLimiter } from "@/lib/rate-limiter"
import { detectSpam } from "@/lib/spam-detector"
import { getClientIP, createFingerprint } from "@/lib/ip-utils"
import { sendContactEmails } from "@/lib/nodemailer"

const contactFormSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    subject: z.string().trim().min(3, "Subject is required").max(100, "Subject must not exceed 100 characters"),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must not exceed 2000 characters"),
    // Honeypot fields - expected to remain empty
    website: z.string().optional(),
    phone: z.string().optional(),
    companyFax: z.string().optional(),
    _gotcha: z.string().optional(),
    // Submission timing
    formStartTime: z.number().optional(),
})

const MAX_BODY_BYTES = 10_000

export async function POST(request: NextRequest) {
    try {
        // 1. Client IP and fingerprinting
        const clientIP = getClientIP(request)
        const fingerprint = createFingerprint(request)

        // 2. IP Rate limiting check (Sliding Window)
        const ipRateLimit = rateLimiter.check(fingerprint)
        if (!ipRateLimit.allowed) {
            const minutesLeft = Math.ceil(ipRateLimit.retryAfterSeconds / 60)
            return NextResponse.json(
                {
                    error: "Too many requests",
                    message: `Please wait ${minutesLeft} minute(s) before submitting again.`,
                    retryAfter: ipRateLimit.retryAfterSeconds,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": ipRateLimit.retryAfterSeconds.toString(),
                        "X-RateLimit-Limit": ipRateLimit.limit.toString(),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": Math.ceil(ipRateLimit.resetTime / 1000).toString(),
                    },
                }
            )
        }

        // 3. Body size check before parsing
        const contentLength = Number(request.headers.get("content-length") ?? 0)
        if (contentLength > MAX_BODY_BYTES) {
            return NextResponse.json(
                { error: "Payload too large", message: "Request payload exceeds allowed limit." },
                { status: 413 }
            )
        }

        // 4. Safe body JSON parsing
        let body: unknown
        try {
            const raw = await request.text()
            if (raw.length > MAX_BODY_BYTES) {
                return NextResponse.json(
                    { error: "Payload too large", message: "Request payload exceeds allowed limit." },
                    { status: 413 }
                )
            }
            body = JSON.parse(raw)
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON", message: "Invalid request payload format." },
                { status: 400 }
            )
        }

        // 5. Schema validation
        const parsed = contactFormSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid form data",
                    message: parsed.error.issues[0]?.message || "Validation failed",
                    details: parsed.error.issues,
                },
                { status: 400 }
            )
        }

        const data = parsed.data

        // 6. Recipient Email Rate Limiting (Prevents email bombing a single recipient inbox)
        const emailRateLimit = emailRateLimiter.check(data.email.toLowerCase())
        if (!emailRateLimit.allowed) {
            return NextResponse.json(
                {
                    error: "Too many requests",
                    message: "Too many submissions received for this email address. Please try again later.",
                    retryAfter: emailRateLimit.retryAfterSeconds,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": emailRateLimit.retryAfterSeconds.toString(),
                    },
                }
            )
        }

        // 7. Bot Honeypot Check
        // If any honeypot input is filled, return silent 200 so the bot believes it succeeded
        const hasHoneypot = Boolean(
            data.website?.trim() ||
            data.phone?.trim() ||
            data.companyFax?.trim() ||
            data._gotcha?.trim()
        )

        if (hasHoneypot) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Thank you for your message. We'll get back to you soon.",
                    confirmationSent: false,
                },
                { status: 200 }
            )
        }

        // 8. Bot Timing Check (Submitting too fast or tampered clock)
        if (data.formStartTime) {
            const now = Date.now()
            const timeTaken = now - data.formStartTime

            // If filled in less than 2.5 seconds or future timestamp (> 5s) or older than 24 hours
            if (timeTaken < 2500 || data.formStartTime > now + 5000 || timeTaken > 86_400_000) {
                return NextResponse.json(
                    {
                        success: true,
                        message: "Thank you for your message. We'll get back to you soon.",
                        confirmationSent: false,
                    },
                    { status: 200 }
                )
            }
        }

        // 9. Heuristic Spam Detection
        const spamCheck = detectSpam({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        })

        if (spamCheck.isSpam) {
            // Silently return success to avoid leaking spam detection criteria
            return NextResponse.json(
                {
                    success: true,
                    message: "Thank you for your message. We'll review it and get back to you soon.",
                    confirmationSent: false,
                },
                { status: 200 }
            )
        }

        // 10. Check SMTP Configuration
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            // Simulated mode for local development without credentials
            await new Promise((resolve) => setTimeout(resolve, 800))

            return NextResponse.json(
                {
                    success: true,
                    simulated: true,
                    confirmationSent: true,
                    message: "Message sent successfully (simulated mode). A confirmation email would be sent to your inbox in production.",
                    id: `sim_${Date.now()}`,
                },
                { status: 200 }
            )
        }

        // 11. Send Both Notification and Confirmation Emails
        const emailResult = await sendContactEmails({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            clientIP,
            spamScore: spamCheck.score,
        })

        if (!emailResult.notificationSent) {
            return NextResponse.json(
                {
                    error: "Email service temporarily unavailable",
                    message: "Unable to deliver your message at this time. Please try again shortly or contact me directly via email.",
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                simulated: false,
                confirmationSent: emailResult.confirmationSent,
                message: emailResult.confirmationSent
                    ? "Message sent successfully! A confirmation email has been sent to your inbox."
                    : "Message sent successfully to Shantanu! I'll get back to you soon.",
                id: emailResult.notificationId,
            },
            { status: 200 }
        )
    } catch (err) {
        console.error("Unexpected error in contact API:", err)
        return NextResponse.json(
            {
                error: "Internal server error",
                message: "An unexpected error occurred. Please try again later.",
            },
            { status: 500 }
        )
    }
}
