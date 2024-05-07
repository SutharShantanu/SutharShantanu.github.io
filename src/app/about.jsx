"use client";

import React from "react";
import { TextGenerateEffect } from "@/Components/ui/text-generate-effect";
import Splines from "@/Components/Splines";
import { MoveRight } from "lucide-react";

const About = () => {
    const words = `During my post-graduation, while preparing for government jobs, I observed some friends delving into HTML, CSS, and various tech stacks. Intrigued, I joined them, and the experience sparked a fascination with programming. Witnessing the tangible results of my code on the screen filled me with joy, prompting a shift in my career aspirations. This newfound interest led me to enroll in Masai School's intensive 30-week Full Stack Web Development course, where I honed my skills in both front-end and back-end technologies. At Masai, I evolved into a proficient and imaginative developer, deriving immense satisfaction from crafting user-friendly and interactive web applications. Beyond my technical prowess, I harbor a desire to leverage my knowledge for societal betterment in the years ahead. In addition to my passion for web development, I find solace in traveling and indulging in video games. With an outgoing and fun-loving nature, I strive to cultivate my creative instincts in every endeavor.`;
    return (
        <section
            id="about"
            className="border min-h-[80vh] w-[90%] border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 2xl:w-4/5 xl:w-5/6 m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <p className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4">
                About
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </p>
            <div className="flex justify-between items-start flex-col md:flex-row">
                <div className="w-full h-[200px] md:w-2/6 md:h-[55vh] ">
                    {/* <Splines /> */}
                </div>
                <h2 className="p-4 sm:p-0 w-full md:w-4/6">
                    <TextGenerateEffect words={words} />
                </h2>
            </div>
        </section>
    );
};

export default About;
