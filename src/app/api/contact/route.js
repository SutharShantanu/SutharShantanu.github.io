import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req) {
    const gmail_user = process.env.NEXT_PUBLIC_GMAIL_USER;
    const gmail_pass = process.env.NEXT_PUBLIC_GMAIL_PASS;
    const portfolioDomain = process.env.NEXT_PUBLIC_PORTFOLIO_DOMAIN;

    try {
        const body = await req.json();
        const { fullName, email, message } = body;

        if (!fullName || !email || !message) {
            return NextResponse.json(
                { error: "Please fill all the fields" },
                { status: 406 }
            );
        }

        const formData = {
            fullName,
            email,
            message,
        };

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail_user,
                pass: gmail_pass,
            },
        });

        const mailOptions = {
            from: email,
            to: gmail_user,
            subject: `New message from your portfolio`,
            text: `${fullName} has sent you a message.`,
            html: `
                <div
                    style="
                        border: 1px solid #e5e5e5;
                        border-radius: 0.375rem;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                        width: 500px;
                        margin: auto;
                    ">
                    <header style="background-color: #404040; text-align: center">
                        <img
                            src="https://github.com/SutharShantanu/SutharShantanu/blob/main/image-3.png?raw=true"
                            alt=""
                            style="
                                width: 9rem;
                                margin: auto;
                                display: block;
                                filter: invert(70%);
                            " />
                    </header>

                    <section style="background-color: #f3f4f6; padding: 1.5rem">
                        <p>Name: ${fullName}</p>
                        <p>Email: ${email}</p>
                        <p>Message: ${message}</p>
                        <div style="display: flex; justify-content: space-between">
                            <a href="https://sutharshantanu.github.io">
                                <button
                                    style="
                                        margin: auto;
                                        width: fit-content;
                                        background-color: #404040;
                                        color: #e5e5e5;
                                        padding: 0.3rem 0.7rem;
                                        border-radius: 0.25rem;
                                    ">
                                    Visit Portfolio
                                </button>
                            </a>
                        </div>
                    </section>
                    <footer style="background-color: #404040; padding: 1.5rem">
                        <h3
                            style="
                                font-size: 1.25rem;
                                margin-bottom: 1rem;
                                color: #e5e5e5;
                                font-weight: 400;
                            ">
                            Thank you for reaching out.
                        </h3>
                        <p
                            style="
                                margin-bottom: 1rem;
                                color: #e5e5e5;
                                font-size: 0.875rem;
                                font-weight: 300;
                            "></p>
                        <p
                            style="
                                margin-bottom: 1rem;
                                color: #e5e5e5;
                                font-size: 0.875rem;
                                font-weight: 300;
                            ">
                            Please reach out if you have any thoughts, praise, or custom
                            project to
                            <a
                                href="https://sutharshantanu.github.io"
                                style="
                                    color: #ffc107;
                                    text-decoration: underline;
                                    text-underline-offset: 0.25rem;
                                ">
                                ${portfolioDomain}
                            </a>
                            . I'd love to hear from you!
                        </p>
                        <section style="display: flex; margin-top: 1rem">
                            <a
                                href="https://www.instagram.com/shantanu.suthar/"
                                style="margin-right: 0.5rem">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/shantanu-suthar/"
                                style="margin-right: 0.5rem">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto" />
                            </a>
                            <a href="https://github.com/SutharShantanu">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto" />
                            </a>
                        </section>
                    </footer>
                </div>
                `,
            replyTo: email,
        };

        const info = await transporter.sendMail(mailOptions);

        const replyMailOptions = {
            from: gmail_user,
            to: email,
            subject: `Thank you for your message`,
            text: `Hi ${fullName},\n\nThank you for reaching out.`,
            html: `
                <div
                    style="
                        border: 1px solid #e5e5e5;
                        border-radius: 0.375rem;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                        width: 500px;
                        margin: auto;
                    ">
                    <header style="background-color: #404040; text-align: center">
                        <img
                            src="https://github.com/SutharShantanu/SutharShantanu/blob/main/image-3.png?raw=true"
                            alt=""
                            style="
                                width: 9rem;
                                margin: auto;
                                display: block;
                                filter: invert(70%);
                            " />
                    </header>

                    <section style="background-color: #f3f4f6; padding: 1.5rem">
                        <p>Dear ${fullName},</p>
                        <p>
                            Thank you for reaching out. I've have received your message
                            on <strong>${new Date().toLocaleString()}</strong>. Your
                            message ID is <strong>${info.messageId}</strong>.
                        </p>
                        <p style="margin: 0px;"><strong>Your message content:</strong></p>
                        <p style="margin-top: 0px;">${message}</p>
                        <p><strong>Message delivery status:</strong> Delivered</p>
                        <p>
                            I'll get back to you as soon as possible. If you have any
                            further questions, feel free to reply to this email.
                        </p>
                        <p>Best regards,</p>
                        <p style="margin: 0px; font-weight: bold;">Shantanu</p>
                        <p style="margin: 0px; font-weight: bold;">Software Developer</p>

                    </section>
                    <footer style="background-color: #404040; padding: 1.5rem">
                        <h3
                            style="
                                font-size: 1.25rem;
                                margin-bottom: 1rem;
                                color: #e5e5e5;
                                font-weight: 400;
                            ">
                            Thank you for reaching out.
                        </h3>
                        <p
                            style="
                                margin-bottom: 1rem;
                                color: #e5e5e5;
                                font-size: 0.875rem;
                                font-weight: 300;
                            "></p>
                        <p
                            style="
                                margin-bottom: 1rem;
                                color: #e5e5e5;
                                font-size: 0.875rem;
                                font-weight: 300;
                            ">
                            Please reach out if you have any thoughts, praise, or custom
                            project to
                            <a
                                href="https://sutharshantanu.github.io"
                                style="
                                    color: #ffc107;
                                    text-decoration: underline;
                                    text-underline-offset: 0.25rem;
                                ">
                                ${portfolioDomain}
                            </a>
                            . I'd love to hear from you!
                        </p>
                        <section style="display: flex; margin-top: 1rem">
                            <a
                                href="https://www.instagram.com/shantanu.suthar/"
                                style="margin-right: 0.5rem">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/shantanu-suthar/"
                                style="margin-right: 0.5rem">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto" />
                            </a>
                            <a href="https://github.com/SutharShantanu">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto" />
                            </a>
                        </section>
                    </footer>
                </div>
                `,
        };

        const replyInfo = await transporter.sendMail(replyMailOptions);

        return NextResponse.json(
            { message: "Emails sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error.message);
        return NextResponse.json(
            { error: `Error Sending Email: ${error.message}` },
            { status: 500 }
        );
    }
}
