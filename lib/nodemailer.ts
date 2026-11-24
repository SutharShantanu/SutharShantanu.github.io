import nodemailer, { type Transporter } from "nodemailer"

export interface SendMailOptions {
    from: string
    to: string | string[]
    subject: string
    html: string
    replyTo?: string
}

export interface ContactNotificationPayload {
    name: string
    email: string
    subject: string
    message: string
    clientIP?: string
    spamScore?: number
}

let activeTransporter: Transporter | null = null

/**
 * Escape user input before interpolating into HTML templates.
 */
export const escapeHtml = (value: string): string =>
    value.replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c] || c
    )

/**
 * Gets or creates the nodemailer Transporter instance.
 * Lazily evaluates environment variables so test or runtime overrides work smoothly.
 */
export function getTransporter(): Transporter {
    if (activeTransporter) {
        return activeTransporter
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com"
    const port = Number(process.env.SMTP_PORT) || 465
    // Port 465 = implicit SSL/TLS; Port 587 = STARTTLS (secure must be false)
    const secure = port === 465

    activeTransporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    return activeTransporter
}

/**
 * Allows tests to supply a mock or custom transporter.
 */
export function setCustomTransporter(transporter: Transporter | null): void {
    activeTransporter = transporter
}

/**
 * Verifies that the SMTP credentials and host connection are functional.
 */
export async function verifyTransporter(): Promise<boolean> {
    const transporter = getTransporter()
    return await transporter.verify()
}

/**
 * Sends a generic mail via the active transporter.
 */
export async function sendMail(options: SendMailOptions): Promise<{ id: string }> {
    const transporter = getTransporter()
    const info = await transporter.sendMail({
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
    })

    return { id: info.messageId || `msg_${Date.now()}` }
}

/**
 * Generates the HTML for the notification email sent to Shantanu.
 */
export function renderNotificationEmail(data: {
    name: string
    email: string
    subject: string
    message: string
    siteName: string
    clientIP: string
    spamScore: number
    timestamp: string
}): string {
    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const safeSubject = escapeHtml(data.subject)
    const safeMessage = escapeHtml(data.message)
    const safeSiteName = escapeHtml(data.siteName)
    const mailtoEmail = encodeURIComponent(data.email)
    const mailtoSubject = encodeURIComponent(`Re: ${data.subject}`)

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Message</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 28px; text-align: left; border-bottom: 2px solid #3b82f6;">
      <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background-color: rgba(59, 130, 246, 0.2); color: #93c5fd; border-radius: 9999px; margin-bottom: 12px;">Contact Submission</span>
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">New message from ${safeName}</h1>
      <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 14px;">Origin: ${safeSiteName}</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      <!-- Details Card -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 80px; font-weight: 500;">From:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${mailtoEmail}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Topic:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${safeSubject}</td>
          </tr>
        </table>
      </div>

      <!-- Message -->
      <div style="margin-bottom: 28px;">
        <h2 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 10px 0;">Message Content</h2>
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-break: break-word;">${safeMessage}</div>
      </div>

      <!-- Quick Action -->
      <div style="text-align: center; margin-bottom: 12px;">
        <a href="mailto:${mailtoEmail}?subject=${mailtoSubject}"
           style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Reply to ${safeName} &rarr;
        </a>
      </div>
    </div>

    <!-- Security & Diagnostic Footer -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; font-size: 12px; color: #94a3b8; line-height: 1.5;">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>Sent: ${data.timestamp}</span>
        <span>IP: ${data.clientIP}</span>
        <span>Spam Score: ${data.spamScore}/100</span>
      </div>
    </div>
  </div>
</body>
</html>
`
}

/**
 * Generates the HTML for the confirmation receipt email sent to the sender.
 * Note: Deliberately avoids echoing user message text to prevent open-relay email reflection attacks.
 */
export function renderConfirmationEmail(data: {
    name: string
    subjectCategory: string
    siteName: string
    portfolioUrl?: string
}): string {
    const firstName = escapeHtml(data.name.trim().split(/\s+/)[0].slice(0, 30) || "there")
    const safeSiteName = escapeHtml(data.siteName)
    const safeTopic = escapeHtml(data.subjectCategory)
    const portfolioUrl = data.portfolioUrl || "https://shantanusuthar.vercel.app"

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received - Shantanu Suthar</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
    
    <!-- Top accent bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);"></div>

    <div style="padding: 32px 32px 24px 32px;">
      <div style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 8px;">
        Confirmation Receipt
      </div>
      <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
        Hi ${firstName}, thanks for reaching out!
      </h1>
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        Your message regarding <strong>"${safeTopic}"</strong> has been successfully received through the contact form on ${safeSiteName}.
      </p>
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        I read and review every message personally. I will get back to you at this email address as soon as possible, typically within 24 to 48 hours.
      </p>

      <div style="background-color: #f8fafc; border-left: 3px solid #3b82f6; border-radius: 4px 8px 8px 4px; padding: 14px 18px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
          <strong>Need to add anything?</strong> Simply reply directly to this email to continue our conversation.
        </p>
      </div>

      <div style="margin-bottom: 28px;">
        <a href="${portfolioUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Explore Portfolio &rarr;
        </a>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a;">Shantanu Suthar</p>
        <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">Software Engineer · Gurugram, India</p>
        <div style="margin-top: 10px; font-size: 13px;">
          <a href="https://github.com/SutharShantanu" style="color: #2563eb; text-decoration: none; margin-right: 14px;">GitHub</a>
          <a href="https://linkedin.com/in/shantanu-suthar" style="color: #2563eb; text-decoration: none;">LinkedIn</a>
        </div>
      </div>
    </div>

    <!-- Anti-abuse Notice -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
      You received this automated receipt because your email address was submitted into the contact form on ${safeSiteName}. If you did not make this request, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
`
}

/**
 * Handles sending both notification email and sender confirmation email.
 */
export async function sendContactEmails(payload: ContactNotificationPayload): Promise<{
    notificationSent: boolean
    notificationId?: string
    confirmationSent: boolean
    confirmationId?: string
    error?: string
}> {
    const fromEmail = process.env.SMTP_USER || "shantanusut2000@gmail.com"
    const toEmail = process.env.CONTACT_TO_EMAIL || "shantanusut2000@gmail.com"
    const siteName = process.env.SITE_NAME || "Shantanu Suthar Portfolio"
    const portfolioUrl = process.env.SITE_URL || "https://shantanusuthar.vercel.app"

    const notificationHtml = renderNotificationEmail({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        siteName,
        clientIP: payload.clientIP || "unknown",
        spamScore: payload.spamScore || 0,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    })

    const confirmationHtml = renderConfirmationEmail({
        name: payload.name,
        subjectCategory: payload.subject,
        siteName,
        portfolioUrl,
    })

    let notificationSent = false
    let notificationId: string | undefined
    let confirmationSent = false
    let confirmationId: string | undefined

    // 1. Send the notification to the website owner
    try {
        const result = await sendMail({
            from: `${siteName} <${fromEmail}>`,
            to: toEmail,
            subject: `Contact: [${payload.subject.replace(/[\r\n]+/g, " ")}] from ${payload.name}`,
            html: notificationHtml,
            replyTo: payload.email,
        })
        notificationSent = true
        notificationId = result.id
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.error("Failed to send notification email:", errorMsg)
        return {
            notificationSent: false,
            confirmationSent: false,
            error: errorMsg,
        }
    }

    // 2. Send the confirmation receipt to the sender
    try {
        const result = await sendMail({
            from: `${siteName} <${fromEmail}>`,
            to: payload.email,
            replyTo: toEmail,
            subject: `Thanks for reaching out! | ${siteName}`,
            html: confirmationHtml,
        })
        confirmationSent = true
        confirmationId = result.id
    } catch (receiptError) {
        // Notification succeeded, so do not fail the overall request if only the confirmation receipt bounces.
        console.warn(
            "Contact confirmation receipt could not be delivered to sender:",
            receiptError instanceof Error ? receiptError.message : receiptError
        )
    }

    return {
        notificationSent,
        notificationId,
        confirmationSent,
        confirmationId,
    }
}
