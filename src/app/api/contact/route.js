import { transporter, mailOptions } from "@/config/nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req, res) {
    console.log(req.body);

    try {
        const body = await req.json();
        console.log(body);
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return new NextResponse(
                JSON.stringify({ error: "Please fill all the fields" }),
                { status: 406, headers: { "Content-Type": "application/json" } }
            );
        }

        await transporter.sendMail({
            ...mailOptions,
            subject: "This is test email",
            text: "this is a test string",
            html: "<h1>Test Title</h1><p>Some Body Text</p>"
        });

        return new NextResponse(
            JSON.stringify({ message: "Message sent Successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
}
