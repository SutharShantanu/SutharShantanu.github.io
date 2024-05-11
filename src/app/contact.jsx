/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    MoveRight,
    Type,
    AtSign,
    MessageSquareText,
    Send,
    Mailbox,
    Phone,
    Map,
    Clock,
    Loader2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { toast } from "sonner";
import axios from "axios";

const Contact = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        message: "",
        error: {
            fullName: "",
            email: "",
            message: "",
        },
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        let errors = { ...formData.error };

        switch (name) {
            case "fullName":
                errors.fullName =
                    value.length < 3 || value.length > 10
                        ? "Full name must be between 3 and 10 characters"
                        : "";
                break;
            case "email":
                errors.email = !value.match(
                    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
                )
                    ? "Invalid email address"
                    : "";
                break;
            case "message":
                errors.message =
                    value.split(" ").length < 15
                        ? "Message must contain at least 15 words"
                        : "";
                break;
            default:
                break;
        }

        setFormData({ ...formData, [name]: value, error: errors });
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
        let errorMessage = "";

        switch (name) {
            case "fullName":
                if (value.length < 3 || value.length > 10) {
                    errorMessage =
                        "Full name must be between 3 and 10 characters";
                }
                break;
            case "email":
                if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                    errorMessage = "Invalid email address";
                }
                break;
            case "message":
                if (value.split(" ").length < 15) {
                    errorMessage = "Message must contain at least 15 words";
                }
                break;
            default:
                break;
        }

        setFormData({
            ...formData,
            error: { ...formData.error, [name]: errorMessage },
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const response = await axios.post("/api/email", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response && response.status === 200) {
                toast.success("Message sent successfully.", {
                    description: new Date().toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "UTC",
                    }),
                });
            } else {
                const error = response?.data?.message || "Unknown error";
                toast.error("Failed to send message:", { description: error });
            }
        } catch (error) {
            toast.error("An error occurred:", {
                description: `${error.message}`,
                error,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            id="contact"
            className="border min-h-[87vh] border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 w-[90%] 2xl:w-4/5 xl:w-5/6 m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4">
                Contact
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="sm:mt-4 flex flex-col sm:flex-row gap-4 items-start justify-between box-border px-2">
                <div className="w-full sm:w-[48%] rounded-xl sm:min-h-[430px] bg-[url('https://ui.mantine.dev/_next/static/media/bg.daf91204.svg')] bg-no-repeat bg-cover flex justify-center items-center p-6 sm:p-0 invert">
                    <div className="w-80% items-center">
                        <Separator className="mb-4 hidden sm:block dark:bg-neutral-800" />
                        <div className="flex items-start mb-4 group">
                            <Mailbox
                                size={26}
                                strokeWidth={1.25}
                                className="text-neutral-100 mr-6 min-w-[26px]"
                            />
                            <div>
                                <p className="m-0 font-extralight text-[11px]">
                                    Email
                                </p>
                                <Link
                                    href="mailto:shantanusut2000@gmail.com"
                                    prefetch={true}
                                    className="group-hover:underline underline-offset-4"
                                    target="_black">
                                    <p className="mt-0">
                                        shantanusut2000@gmail.com
                                    </p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start mb-4 group">
                            <Phone
                                size={26}
                                strokeWidth={1.25}
                                className="text-neutral-100 mr-6 min-w-[26px]"
                            />
                            <div>
                                <p className="m-0 font-extralight text-[11px]">
                                    Phone
                                </p>
                                <Link
                                    href="tel:+91 77329 62110"
                                    className="group-hover:underline underline-offset-4"
                                    prefetch={true}>
                                    <p className="mt-0">+91 77329 62110</p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start mb-4 group">
                            <Map
                                size={26}
                                strokeWidth={1.25}
                                className="text-neutral-100 mr-6 min-w-[26px]"
                            />
                            <div>
                                <p className="m-0 font-extralight text-[11px]">
                                    Address
                                </p>
                                <Link
                                    href="https://maps.app.goo.gl/rGK8a5HPtnFKzri17"
                                    className="group-hover:underline underline-offset-4"
                                    prefetch={true}
                                    target="_black">
                                    <p className="mt-0">
                                        1575, East Pocket, Sector 23, Gurugram,
                                        Haryana 122001
                                    </p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start mb-4">
                            <Clock
                                size={26}
                                strokeWidth={1.25}
                                className="text-neutral-100 mr-6 min-w-[26px]"
                            />
                            <div>
                                <p className="m-0 font-extralight text-[11px]">
                                    Working Hours
                                </p>
                                <p className="mt-0">10:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                        <Separator className="mt-4 hidden sm:block" />
                    </div>
                </div>

                <div className="w-full sm:w-2/4 rounded-xl border sm:min-h-[430px] border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 p-4 mb-2 sm:pb-0">
                    <h2 className="text-2xl sm:text-4xl font-extralight">
                        Get in touch
                    </h2>
                    <Separator className="my-5 dark:bg-neutral-700" />
                    <form id="contact-form" onSubmit={handleSubmit}>
                        <div className="flex items-center justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
                            <label
                                htmlFor="fullName"
                                className="hidden sm:flex items-center text-neutral-300 sm:w-[7%] p-2 h-16">
                                <Type
                                    size={24}
                                    strokeWidth={1.75}
                                    className="text-neutral-600"
                                />
                            </label>
                            <Separator
                                orientation="vertical"
                                className="hidden sm:block sm:mr-6"
                            />
                            <div className="w-full sm:w-[87%] ">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full px-2 py-[4px] rounded-md border border-neutral-300 dark:border-neutral-700 outline-none text-sm sm:text-base"
                                    required
                                />
                                {formData.error && formData.error.fullName && (
                                    <span className="text-xs sm:text-sm text-red-400">
                                        {formData.error.fullName}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
                            <label
                                htmlFor="email"
                                className="hidden sm:flex items-center text-neutral-300 sm:w-[7%] p-2 h-16">
                                <AtSign
                                    size={24}
                                    strokeWidth={1.75}
                                    className="text-neutral-600"
                                />
                            </label>
                            <Separator
                                orientation="vertical"
                                className="hidden sm:block sm:mr-6"
                            />
                            <div className="w-full sm:w-[87%] ">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="example@mail.com"
                                    className="w-full px-2 py-[4px] rounded-md border border-neutral-300 dark:border-neutral-700 outline-none  text-sm sm:text-base"
                                    required
                                />
                                {formData.error && formData.error.email && (
                                    <span className="text-xs sm:text-sm text-red-400">
                                        {formData.error.email}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start justify-start my-2 mx-auto w-full h-28 p-2 pl-0">
                            <label
                                htmlFor="message"
                                className="hidden sm:flex items-center text-neutral-300 sm:w-[7%] p-2 h-16">
                                <MessageSquareText
                                    size={24}
                                    strokeWidth={1.75}
                                    className="text-neutral-600 mr-1"
                                />
                            </label>
                            <Separator
                                orientation="vertical"
                                className="hidden sm:block sm:mr-6"
                            />
                            <div className="w-full sm:w-[87%] ">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Please write your message here..."
                                    className="w-full px-2 py-[4px] h-24 rounded-md border border-neutral-300 dark:border-neutral-700 outline-none  text-sm sm:text-base"
                                    required
                                />
                                {formData.error && formData.error.message && (
                                    <span className="text-xs sm:text-sm text-red-400">
                                        {formData.error.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mr-3 sm:mr-5 mt-6">
                            <Button
                                type="submit"
                                className="rounded-2xl shadow-lg group bg-neutral-900 dark:bg-neutral-300"
                                disabled={isLoading}
                                onClick={handleSubmit}>
                                {isLoading ? (
                                    <div className="flex items-center text-sm">
                                        <span>Loading</span>
                                        <Loader2
                                            size={20}
                                            strokeWidth={1.75}
                                            className="ml-1 animate-spin h-5 w-5 text-neutral-300 dark:text-neutral-800"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center text-sm">
                                        <span>Send message</span>
                                        <Send
                                            size={18}
                                            strokeWidth={1.75}
                                            className="text-neutral-300 dark:text-neutral-800 ml-1 transition-transform transform-gpu group-hover:rotate-45"
                                        />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
