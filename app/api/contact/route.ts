import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { rateLimiter } from "@/lib/rate-limiter"
import { detectSpam } from "@/lib/spam-detector"
import { getClientIP, createFingerprint } from "@/lib/ip-utils"

const contactFormSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    subject: z.string().min(5).max(100),
    message: z.string().min(10).max(1000),
    // Honeypot fields - should be empty
    website: z.string().optional(),
    phone: z.string().optional(),
    // Timestamp for form submission time validation
    formStartTime: z.number().optional(),
})

export async function POST(request: NextRequest) {
    try {
        // Get client information
        const clientIP = getClientIP(request)
        const fingerprint = createFingerprint(request)


        // Rate limiting check
        const rateLimitResult = rateLimiter.isAllowed(fingerprint)
        if (!rateLimitResult.allowed) {
            const remainingTime = rateLimiter.getRemainingTime(fingerprint)
            return NextResponse.json(
                {
                    error: "Too many requests",
                    message: `Please wait ${Math.ceil(remainingTime / 60)} minutes before submitting again.`,
                    retryAfter: remainingTime,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": remainingTime.toString(),
                    },
                },
            )
        }

        // Parse request body
        let body
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
        }

        // Validate the request body
        let validatedData
        try {
            validatedData = contactFormSchema.parse(body)
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        error: "Invalid form data",
                        details: validationError.errors,
                    },
                    { status: 400 },
                )
            }
            return NextResponse.json({ error: "Validation failed" }, { status: 400 })
        }

        // Honeypot validation
        if (validatedData.website || validatedData.phone) {
            // Return success to not reveal the honeypot
            return NextResponse.json(
                {
                    message: "Thank you for your message. We'll get back to you soon.",
                },
                { status: 200 },
            )
        }

        // Form timing validation (prevent too fast submissions)
        if (validatedData.formStartTime) {
            const submissionTime = Date.now()
            const timeTaken = submissionTime - validatedData.formStartTime

            // If form was submitted in less than 3 seconds, it's likely a bot
            if (timeTaken < 3000) {

                // Return success to not reveal the detection
                return NextResponse.json(
                    {
                        message: "Thank you for your message. We'll get back to you soon.",
                    },
                    { status: 200 },
                )
            }
        }

        // Spam detection
        const spamCheck = detectSpam({
            name: validatedData.name,
            email: validatedData.email,
            subject: validatedData.subject,
            message: validatedData.message,
        })

        if (spamCheck.isSpam) {
            // Return a generic success message to not reveal spam detection
            return NextResponse.json(
                {
                    message: "Thank you for your message. We'll review it and get back to you soon.",
                },
                { status: 200 },
            )
        }

        // Check if Resend API key is available
        if (!process.env.RESEND_API_KEY) {

            // Simulate email sending for development
            await new Promise((resolve) => setTimeout(resolve, 1000))

            return NextResponse.json(
                {
                    message: "Email sent successfully (simulated)",
                    id: `sim_${Date.now()}`,
                },
                { status: 200 },
            )
        }

        // Send email with Resend
        try {
            const { Resend } = await import("resend")
            const resend = new Resend(process.env.RESEND_API_KEY)

            // Get email configuration from environment variables
            const fromEmail = process.env.CONTACT_FROM_EMAIL || "Contact Form <onboarding@resend.dev>"
            const toEmail = process.env.CONTACT_TO_EMAIL || "shantanusut2000@gmail.com"
            const siteName = process.env.SITE_NAME || "Portfolio Website"

            // Send email to you
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: [toEmail],
                subject: `${siteName} Contact: ${validatedData.subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Message</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">From ${siteName}</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <!-- Contact Details -->
              <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px;">Contact Information</h2>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #475569; min-width: 80px;">Name:</span>
                    <span style="color: #1e293b;">${validatedData.name}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #475569; min-width: 80px;">Email:</span>
                    <a href="mailto:${validatedData.email}" style="color: #667eea; text-decoration: none;">${validatedData.email}</a>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #475569; min-width: 80px;">Subject:</span>
                    <span style="color: #1e293b;">${validatedData.subject}</span>
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div style="background-color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
                <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Message</h2>
                <div style="color: #475569; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${validatedData.message}</div>
              </div>

              <!-- Quick Actions -->
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">Quick Actions</p>
                <a href="mailto:${validatedData.email}?subject=Re: ${validatedData.subject}"
                   style="display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 0 8px;">
                  Reply via Email
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                📧 Sent from ${siteName} contact form<br>
                🕒 ${new Date().toLocaleString()}<br>
                🌐 IP: ${clientIP} | Spam Score: ${spamCheck.score}/100
              </p>
            </div>
          </div>
        `,
                replyTo: validatedData.email,
            })

            if (error) {
                console.log("Resend error:", error)
                return NextResponse.json(
                    {
                        error: "Failed to send email",
                        details: error.message,
                    },
                    { status: 500 },
                )
            }


            return NextResponse.json(
                {
                    message: "Message sent successfully! I'll get back to you soon.",
                    id: data?.id,
                },
                { status: 200 },
            )
        } catch (resendError) {
            console.log("Resend integration error:", resendError)
            return NextResponse.json(
                {
                    error: "Email service temporarily unavailable",
                    message: "Please try again in a few minutes or contact me directly.",
                },
                { status: 500 },
            )
        }
    } catch (error) {
        console.log("Unexpected error in contact API:", error)
        return NextResponse.json(
            {
                error: "Internal server error",
                message: "Something went wrong. Please try again later.",
            },
            { status: 500 },
        )
    }
}
