"use client";

import React from "react";
import { TextGenerateEffect } from "@/Components/ui/text-generate-effect";
import Splines from "@/Components/Splines";
import { MoveRight } from "lucide-react";

const About = () => {
    const words = `I remember when I was preparing for Govt jobs after my graduation, some of my friends were practicing HTML CSS, and some other tech stack. Somehow I became interested too

Later, I found myself interested in programming and I also remember my first experience where I was happy to see the result of my code on the screen, this experience triggered me to change my field.
My interest further prompted me to enroll myself in Masai School to pursue a 30-week, full-time, Full Stack Web Development course, in which I got an opportunity to enhance my skills in front-end and back-end technologies.

At Masai, I grew into a trained and creative developer who derived great satisfaction from his work. I created many user-friendly and interactive web applications during this course. Apart from being a good technocrat, I wish to contribute towards the betterment of society with the knowledge I have gained so far and I will in the coming years.

Besides being a web developer, I enjoy traveling and playing video games. I am outgoing and fun-loving by nature which helps me bring out my creative side.`;
    return (
        <section
            id="about"
            className="border min-h-[80vh] w-[90%]  border-neutral-800 2xl:w-4/5 xl:w-5/6  m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <div className="group inline-block text-left text-5xl w-fit hover:font-bold hover transition-all p-4">
                About
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </div>
            <div className="flex justify-between flex-col">
                <div className="w-full md:w-2/6 h-[60vh] md:max-h-[500px] ">
                    <Splines />
                </div>
                <h2 className="p-4 w-full md:w-4/6">
                    <TextGenerateEffect words={words} />
                </h2>
            </div>
        </section>
    );
};

export default About;
