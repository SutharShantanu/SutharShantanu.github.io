"use client"

import React from 'react'
import SectionHeader from './ui/section-header/section-header'
import { Globe } from './ui/globe';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, MessageSquare, Shield } from "lucide-react"
import { useContactForm } from './hooks/useContact';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';


const Contact = () => {
    return (
        <div className="flex flex-col items-center justify-between gap-10 overflow-hidden max-w-5xl">
            <SectionHeader title="Contact Me" description='Get in touch with us for any inquiries or feedback.' />
            <div className="flex items-stretch gap-4 flex-1">
                <Card className="w-1/2 flex flex-col">
                    <CardContent className="relative flex items-center justify-center w-full p-6 flex-1">
                        <Globe />
                    </CardContent>
                    <CardFooter className="flex flex-col items-center text-center p-6">
                        <h3 className="text-lg font-semibold mb-2">Reach Out From Anywhere</h3>
                        <p className="text-sm text-muted-foreground text-justify">
                            The globe highlights where our connections span across the world. No matter your location, feel free to contact us with your questions, ideas, or feedback. We look forward to hearing from you!
                        </p>
                    </CardFooter>
                </Card>
                <ContactForm />
            </div>
        </div>
    )
}

export default Contact;


const ContactForm = () => {
    const { form, onSubmit, isSubmitting } = useContactForm()

    return (
        <Card className="w-1/2 p-4">
            <CardHeader className='p-0'>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contact Us
                </CardTitle>
                <CardDescription>Send us a message and we&#39;ll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Honeypot fields - hidden from users but visible to bots */}
                        <div style={{ display: "none" }}>
                            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                            <input type="text" name="phone" tabIndex={-1} autoComplete="off" />
                        </div>

                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        Email Address *
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Subject Field */}
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="How can we help you?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Message Field */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Please describe your inquiry in detail..."
                                            className="min-h-[120px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{field.value?.length || 0}/1000 characters</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Message...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>

                        {/* Security Notice */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                            <Shield className="h-4 w-4" />
                            <span>This form is protected against spam and abuse.</span>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
