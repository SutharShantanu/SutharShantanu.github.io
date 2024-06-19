import nodemailer from "nodemailer";

const email = process.env.GMAIL_USER
const pass = process.env.GMAIL_PASS


export const transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
        user: email,
        pass,
    }
});

export const mailOptios = {
    from: email,
    to: email,
}