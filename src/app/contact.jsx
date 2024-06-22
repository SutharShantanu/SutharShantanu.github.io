"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    MoveRight,
    Mailbox,
    Phone,
    Map,
    Clock,
    Type,
    MessageSquareText,
    AtSign,
    Loader2,
    Send,
} from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

const FormSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    message: z.string().min(10, "Message is required"),
});

const Contact = () => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = async (values) => {
        console.log(values);

        try {
            setIsLoading(true);
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setIsLoading(false);
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
            } else if (response.status === 406) {
                const resData = await response.json();
                setIsLoading(false);
                console.log("error", resData);
                toast.error("Failed to send message:", { description: resData.error });
            }
        } catch (error) {
            setIsLoading(false);
            console.log("error logging here", error);
            toast.error("An error occurred:", {
                description: error.message,
            });
        }
    };

    return (
        <section
            id="contact"
            className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-sm"
        >
            <div className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8">
                Contact
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="sm:mt-4 flex flex-col md:flex-row gap-4 items-start justify-between box-border p-6">
                <div className={`w-full md:w-[48%] rounded-xl sm:min-h-[540px] bg-[url('/contact-background-light.jpeg')] bg-no-repeat bg-cover flex justify-center items-center sm:p-0`}>
                    <div className="w-full lg:w-[70%] items-center backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                        <div className="flex items-end mb-4 group">
                            <Mailbox size={26} strokeWidth={1.25} className="mr-2 sm:mr-6 min-w-[26px] text-neutral-900" />
                            <div>
                                <p className="m-0 font-extralight text-[11px] text-neutral-900">Email</p>
                                <Link href="mailto:shantanusut2000@gmail.com" prefetch={true} className="group-hover:underline underline-offset-4 text-neutral-900" target="_blank">
                                    <p className="mt-0 text-neutral-900 text-xs sm:text-sm">shantanusut2000@gmail.com</p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-end mb-4 group">
                            <Phone size={26} strokeWidth={1.25} className="mr-2 sm:mr-6 min-w-[26px] text-neutral-900" />
                            <div>
                                <p className="m-0 font-extralight text-[11px] text-neutral-900">Phone</p>
                                <Link href="tel:+91 77329 62110" className="group-hover:underline underline-offset-4 text-neutral-900" prefetch={true}>
                                    <p className="mt-0 text-neutral-900 text-xs sm:text-sm">+91 77329 62110</p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-end mb-4 group">
                            <Map size={26} strokeWidth={1.25} className="mr-2 sm:mr-6 min-w-[26px] text-neutral-900" />
                            <div>
                                <p className="m-0 font-extralight text-[11px] text-neutral-900">Address</p>
                                <Link href="https://maps.app.goo.gl/rGK8a5HPtnFKzri17" className="group-hover:underline underline-offset-4 text-neutral-900" prefetch={true} target="_blank">
                                    <p className="mt-0 text-neutral-900 text-xs sm:text-sm">1575, East Pocket, Sector 23, Gurugram, Haryana 122001</p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-end mb-4">
                            <Clock size={26} strokeWidth={1.25} className="mr-2 sm:mr-6 min-w-[26px] text-neutral-900" />
                            <div>
                                <p className="m-0 font-extralight text-[11px] text-neutral-900">Working Hours</p>
                                <p className="mt-0 text-neutral-900 text-xs sm:text-sm">10:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/4 rounded-xl sm:min-h-[540px] border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 p-4 mb-2 sm:pb-0">
                    <h2 className="text-2xl sm:text-4xl font-extralight">Get in touch</h2>
                    <Separator className="my-5 dark:bg-neutral-700 bg-neutral-300" />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex items-center justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
                                <FormLabel
                                    htmlFor="fullName"
                                    className="flex items-center text-neutral-300 sm:w-[7%] p-2 h-16 min-w-12">
                                    <Type
                                        size={24}
                                        strokeWidth={1.75}
                                        className="text-neutral-600 dark:text-neutral-300 min-w-6"
                                    />
                                </FormLabel>
                                <Separator
                                    orientation="vertical"
                                    className="block mr-6 dark:bg-neutral-700 bg-neutral-300"
                                />
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem className="w-full" >
                                            <FormControl >
                                                <Input name="fullName" placeholder="Name" {...field} />
                                            </FormControl>
                                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
                                <FormLabel
                                    htmlFor="email"
                                    className="flex items-center text-neutral-300 sm:w-[7%] p-2 h-16 min-w-12">
                                    <AtSign
                                        size={24}
                                        strokeWidth={1.75}
                                        className="text-neutral-600 dark:text-neutral-300 min-w-6"
                                    />
                                </FormLabel>
                                <Separator
                                    orientation="vertical"
                                    className="block mr-6 dark:bg-neutral-700 bg-neutral-300"
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Mail@example.com" {...field} />
                                            </FormControl>
                                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
                                <div className="flex items-center">
                                    <FormLabel
                                        htmlFor="message"
                                        className="flex items-center text-neutral-300 sm:w-[7%] p-2 h-16 min-w-12"><MessageSquareText
                                            size={24}
                                            strokeWidth={1.75}
                                            className="text-neutral-600 dark:text-neutral-300 min-w-6"
                                        /></FormLabel>
                                    <Separator
                                        orientation="vertical"
                                        className="block mr-6 dark:bg-neutral-700 bg-neutral-300"
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us a little bit about yourself"
                                                    className="resize-none"
                                                    {...field}
                                                />

                                            </FormControl>
                                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className=" mr-3 sm:mr-3 float-end" >
                                <Button
                                    type="submit"
                                    className="px-2 py-0 sm:px-4 sm:py-2 h-8 sm:h-auto shadow-lg group bg-neutral-900 dark:bg-neutral-300 mt-8"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center ">
                                            <span className="text-xs sm:text-sm">Loading</span>
                                            <Loader2
                                                size={20}
                                                strokeWidth={1.75}
                                                className="ml-1 animate-spin h-5 w-5 sm:h-4 sm:w-4"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center ">
                                            <span className="text-xs sm:text-sm">Send message</span>
                                            <Send
                                                size={18}
                                                strokeWidth={1.75}
                                                className=" h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform transform-gpu group-hover:rotate-45"
                                            />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
