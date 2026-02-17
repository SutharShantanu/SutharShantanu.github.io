import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

interface SendMailOptions {
    from: string
    to: string | string[]
    subject: string
    html: string
    replyTo?: string
}

export async function sendMail(options: SendMailOptions) {
    const info = await transporter.sendMail({
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
    })

    return { id: info.messageId }
}
