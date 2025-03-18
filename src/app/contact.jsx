"use client";
import React, { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { motion } from "framer-motion";

const FormSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  message: z.string().min(10, "Message is required"),
});

const ContactInfo = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full md:w-[48%] rounded-xl sm:min-h-[540px] bg-[url('/contact-background-light.jpeg')] bg-no-repeat bg-cover flex justify-center items-center sm:p-0"
  >
    <div className="w-full lg:w-[70%] items-center backdrop-blur-xs p-4 sm:p-6 rounded-xl">
      <ContactItem
        icon={Mailbox}
        title="Email"
        link="mailto:shantanusut2000@gmail.com"
        text="shantanusut2000@gmail.com"
      />
      <ContactItem
        icon={Phone}
        title="Phone"
        link="tel:+91 77329 62110"
        text="+91 77329 62110"
      />
      <ContactItem
        icon={Map}
        title="Address"
        link="https://maps.app.goo.gl/rGK8a5HPtnFKzri17"
        text="1575, East Pocket, Sector 23, Gurugram, Haryana 122001"
      />
      <ContactItem
        icon={Clock}
        title="Working Hours"
        text="10:00 AM - 6:00 PM"
      />
    </div>
  </motion.div>
);

const ContactItem = ({ icon: Icon, title, link, text }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-end mb-4 group"
  >
    <Icon
      size={26}
      strokeWidth={1.25}
      className="mr-2 sm:mr-6 min-w-[26px] text-neutral-900"
    />
    <div>
      <p className="m-0 font-extralight text-[11px] text-neutral-900">
        {title}
      </p>
      {link ? (
        <a
          href={link}
          className="group-hover:underline underline-offset-4 text-neutral-900"
          target="_blank"
        >
          <p className="mt-0 text-neutral-900 text-xs sm:text-sm">{text}</p>
        </a>
      ) : (
        <p className="mt-0 text-neutral-900 text-xs sm:text-sm">{text}</p>
      )}
    </div>
  </motion.div>
);

const ContactForm = ({ form, onSubmit, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full md:w-2/4 rounded-xl sm:min-h-[540px] border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 p-4 mb-2 sm:pb-0"
  >
    <h2 className="text-2xl sm:text-4xl font-extralight">Get in touch</h2>
    <Separator className="my-5 dark:bg-neutral-700 bg-neutral-300" />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <InputField
          form={form}
          name="fullName"
          icon={Type}
          placeholder="Name"
        />
        <InputField
          form={form}
          name="email"
          icon={AtSign}
          placeholder="Mail@example.com"
        />
        <TextareaField
          form={form}
          name="message"
          icon={MessageSquareText}
          placeholder="Tell us a little bit about yourself"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mr-3 sm:mr-3 float-end"
        >
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
                  className="h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform transform-gpu group-hover:rotate-45"
                />
              </div>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  </motion.div>
);

const InputField = ({ form, name, icon: Icon, placeholder }) => (
  <div className="flex items-center justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
    <FormLabel
      htmlFor={name}
      className="flex items-center text-neutral-300 sm:w-[7%] p-2 h-16 min-w-12"
    >
      <Icon
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
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const TextareaField = ({ form, name, icon: Icon, placeholder }) => (
  <div className="flex justify-start my-2 mx-auto w-full p-2 pl-0 h-14">
    <div className="flex items-center">
      <FormLabel
        htmlFor={name}
        className="flex items-center text-neutral-300 sm:w-[7%] p-2 h-16 min-w-12"
      >
        <Icon
          size={24}
          strokeWidth={1.75}
          className="text-neutral-600 dark:text-neutral-300 min-w-6"
        />
      </FormLabel>
      <Separator
        orientation="vertical"
        className="block mr-6 dark:bg-neutral-700 bg-neutral-300"
      />
    </div>
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({ resolver: zodResolver(FormSchema) });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.status == 200) {
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
      } else {
        setIsLoading(false);
        const resData = await response.json();
        toast.error("Failed to send message:", { description: resData.error });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while sending the message.");
    }
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 rounded-lg shadow-xs">
      <motion.div
        className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4 sm:pt-8 sm:pl-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contact
        <motion.div
          className="hidden transition-all group-hover:inline-block group-hover:ml-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MoveRight size={40} strokeWidth={2.5} />
        </motion.div>
      </motion.div>
      <motion.div
        className="sm:mt-4 flex flex-col md:flex-row gap-4 items-start justify-between box-border p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ContactInfo />
        <ContactForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};

export default Contact;
