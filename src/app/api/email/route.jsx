import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Get request fired successfully" });
}

export async function POST(request) {
    try {
        const { fullName, email, message } = await request.json();
        console.log(fullName, email, message);

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.GMAIL_USER,
            subject: "New message from your portfolio",
            text: `${fullName} has sent you a message.`,
            html: `<div style="border: 1px solid #ccc; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); width: 500px; margin: auto;">
                    <header style="background-color: #000; text-align: center;">
                        <img
                            src="https://github.com/SutharShantanu/SutharShantanu/blob/main/image-3.png?raw=true"
                            alt=""
                            style="width: 9rem; margin: auto; display: block;"
                        />
                    </header>

                    <section style="background-color: #f3f4f6; padding: 1.5rem;">
                        <p>Name: ${fullName}</p>
                        <p>Message: ${message}</p>
                        <div style="display: flex; justify-content: space-between;">
                            <a href="https://sutharshantanu.github.io">
                                <button style="margin: auto; width: fit-content; background-color: #2d2d2d; color: #fff; padding: 0.3rem .7rem; border-radius: 0.25rem;">
                                    Visit Portfolio
                                </button>
                            </a>
                        </div>
                    </section>
                    <footer style="background-color: #000; padding: 1.5rem;">
                        <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #fff; font-weight: 400;">
                            Thank you for reaching out.
                        </h3>
                        <p style="margin-bottom: 1rem; color: #ccc; font-size: 0.875rem; font-weight: 300;">
                            I truly appreciate your interest and am grateful for the opportunity to connect with you. If you
                            have any further questions or need assistance, please feel free to contact. I'm here to help.
                        </p>
                        <p style="margin-bottom: 1rem; color: #ccc; font-size: 0.875rem; font-weight: 300;">
                            Please reach out if you have any thoughts, praise, or custom project to
                            <a
                                href="https://sutharshantanu.github.io"
                                style="color: #ffc107; text-decoration: underline; text-underline-offset: 0.25rem;"
                            >
                                www.sutharshantanu.github.io
                            </a>
                            . I'd love to hear from you!
                        </p>
                        <section style="display: flex; margin-top: 1rem;">
                            <a href="https://www.instagram.com/shantanu.suthar/" style="margin-right: 0.5rem;">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto;"
                                />
                            </a>
                            <a href="https://www.linkedin.com/in/shantanu-suthar/" style="margin-right: 0.5rem;">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto;"
                                />
                            </a>
                            <a href="https://github.com/SutharShantanu">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                                    alt=""
                                    style="width: 1.2rem; margin: auto;"
                                />
                            </a>
                        </section>
                    </footer>
                </div>`,
            replyTo: email,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json(
            { message: `Email Sent Successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: `Failed to Send Email` },
            { status: 500 }
        );
    }
}
