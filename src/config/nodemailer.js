import nodemailer from "nodemailer";

const email = process.env.NEXT_PUBLIC_GMAIL_USER;
const pass = process.env.NEXT_PUBLIC_GMAIL_PASS;

export const transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
        user: email,
        pass,
    },
});

export const mailOptios = {
    from: email,
    to: email,
};
