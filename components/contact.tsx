"use client";

import React from "react";
import SectionHeader from "./ui/section-header/section-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, MessageSquare, Shield } from "lucide-react";
import { useContactForm, type ContactFormData } from "./hooks/useContact";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ControllerRenderProps } from "react-hook-form";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ScrollArea } from "./ui/scroll-area";

const Contact = () => {
    return (
        <div id="contact" className="flex flex-col items-center justify-between py-6 gap-10 overflow-hidden max-w-5xl">
            <SectionHeader
                title="Let's Connect"
                description="Have a question, project idea, or just want to say hello? Fill out the form and I’ll get back to you shortly."
            />
            <div className="flex flex-col lg:flex-row items-stretch gap-4 flex-1 w-full">
                <Card className="w-full lg:w-1/2 flex items-center justify-center relative">
                    <CardContent className="flex items-center justify-center w-full p-6">
                        <p className="text-7xl text-pretty text-left text-primary/20 dark:text-primary-foreground/20">
                            Master of Googling answers and pretending I knew it all along
                        </p>
                    </CardContent>

                </Card>
                <ContactForm />
            </div>
        </div>
    );
};

// <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
//     {/* Gradient Diagonal Lines Pattern */}
//     <div
//         className="
//     />
//     {/* Your Content/Components */}
// </div>

export default Contact;

const ContactForm = () => {
    const { form, onSubmit, isSubmitting } = useContactForm();

    return (
        <Card className="w-full lg:w-1/2 flex">
            <CardHeader className="p-4 border-b border-border">
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Get In Touch
                </CardTitle>
                <CardDescription>
                    Fill out the form and we’ll reply as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        aria-label="Contact Form"
                    >
                        {/* Honeypot */}
                        <div style={{ display: "none" }}>
                            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                            <input type="text" name="phone" tabIndex={-1} autoComplete="off" />
                        </div>

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }: { field: ControllerRenderProps<ContactFormData, "name"> }) => (
                                <FormItem>
                                    <FormLabel>Full Name*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }: { field: ControllerRenderProps<ContactFormData, "email"> }) => (
                                <FormItem>
                                    <FormLabel>Email Address*</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            {...field}
                                            required
                                            aria-label="Email Address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Subject (Dropdown) */}
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }: { field: ControllerRenderProps<ContactFormData, "subject"> }) => (
                                <FormItem>
                                    <FormLabel>Subject*</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Choose a subject" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                <SelectItem value="general">General Inquiry</SelectItem>
                                                <SelectItem value="proposal">Project Proposal</SelectItem>
                                                <SelectItem value="feedback">Feedback</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Message */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }: { field: ControllerRenderProps<ContactFormData, "message"> }) => (
                                <FormItem>
                                    <FormLabel>Message*</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Please describe your inquiry in detail..."
                                            className="min-h-[120px] resize-none"
                                            maxLength={1000}
                                            {...field}
                                            required
                                            aria-label="Message"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        {field.value?.length || 0}/1000 characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <motion.div className="flex items-center gap-1">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </motion.div>
                            ) : (
                                "Send Message"
                            )}
                        </Button>

                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex items-center gap-1 text-xs text-muted-foreground px-4 py-2 border-t border-border bg-neutral-50 dark:bg-neutral-800 rounded-b-xl">
                <Shield className="h-4 w-4" />
                <span>This form is protected against spam and abuse.</span>
            </CardFooter>
        </Card>
    );
};
