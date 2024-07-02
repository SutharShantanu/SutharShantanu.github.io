"use client";

import React from "react";
import { TextGenerateEffect } from "@/Components/ui/text-generate-effect";
// import Splines from "@/Components/Splines";
import { MoveRight } from "lucide-react";
import Image from "next/image";

const About = () => {
    const words = `My journey to web development wasn't exactly linear. While prepping for government exams, I found myself captivated by the world my friends were building with lines of code. Witnessing their creations come alive on the screen sparked a curiosity within me. I craved that same magic – the thrill of crafting something tangible from scratch. So, I took a leap of faith and enrolled in Masai School's grueling 30-week bootcamp. Let's just say those weeks were a whirlwind of challenges and triumphs. But with every hurdle cleared and every line of code mastered, my passion for web development only intensified.

Today, I'm not just a developer; I'm an artist who paints with code. I find immense satisfaction in building user-friendly interfaces and interactive web applications that not only function flawlessly but leave a lasting impression. But my ambitions extend beyond the digital realm. In the years to come, I aspire to leverage my technical expertise to create solutions that make a positive impact on society.

When I'm not glued to the screen, you might find me exploring new destinations, unwinding with a good video game, or simply cracking jokes and bringing laughter to those around me. My outgoing personality and creative spirit fuel my drive to excel in everything I do.`;
    return (
        <section
            id="about"
            className="border h-fit border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 sm:p-8 rounded-lg shadow-sm">
            <p className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4">
                About
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </p>
            <div className="flex justify-between items-start flex-col 2xl:flex-row">
                <div className="w-full h-[200px] 2xl:w-2/5 md:h-[30vh] lg:h-[40vh] xl:h-[50vh]">
                    {/* <Splines /> */}
                    <Image src="../../public/AboutIllustration.svg" width={50} height={50} alt="about picture" className="sm:max-w-[400px]" />
                </div>
                <h2 className="p-4 sm:p-0 w-full 2xl:w-3/5">
                    <TextGenerateEffect words={words} />
                </h2>
            </div>
        </section>
    );
};

export default About;
