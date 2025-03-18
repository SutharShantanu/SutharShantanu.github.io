"use client";

import React from "react";
import { TextGenerateEffect } from "@/Components/ui/text-generate-effect";
// import Splines from "@/Components/Splines";
import { MoveRight } from "lucide-react";
import aboutImage from "../../public/AboutIllustration.svg";
import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
    const words = `My journey to web development wasn't exactly linear. While prepping for government exams, I found myself captivated by the world my friends were building with lines of code. Witnessing their creations come alive on the screen sparked a curiosity within me. I craved that same magic – the thrill of crafting something tangible from scratch. So, I took a leap of faith and enrolled in Masai School's grueling 30-week bootcamp. Let's just say those weeks were a whirlwind of challenges and triumphs. But with every hurdle cleared and every line of code mastered, my passion for web development only intensified.

Today, I'm not just a developer; I'm an artist who paints with code. I find immense satisfaction in building user-friendly interfaces and interactive web applications that not only function flawlessly but leave a lasting impression. But my ambitions extend beyond the digital realm. In the years to come, I aspire to leverage my technical expertise to create solutions that make a positive impact on society.

When I'm not glued to the screen, you might find me exploring new destinations, unwinding with a good video game, or simply cracking jokes and bringing laughter to those around me. My outgoing personality and creative spirit fuel my drive to excel in everything I do.`;

    // Framer Motion Variants
    const containerVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.8, ease: "easeOut" },
        },
    };

    const imageVariant = {
        hidden: { opacity: 0, scale: 0.8, x: -50 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: { delay: 0.2, duration: 0.8, ease: "easeOut" },
        },
    };

    const textVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.3, duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <motion.section
            id="about"
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="border h-fit border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-[90%] xl:max-w-[80%] m-auto my-4 sm:p-8 rounded-lg shadow-xs"
        >
            <motion.p
                variants={containerVariant}
                className="group inline-block text-left text-3xl sm:text-5xl w-fit hover:font-bold hover transition-all p-4"
            >
                About
                <MoveRight
                    className="hidden transition-all group-hover:inline-block group-hover:ml-4 group-hover:line-through"
                    size={40}
                    strokeWidth={2.5}
                />
            </motion.p>
            <div className="flex justify-between items-center flex-col 2xl:flex-row">
                {/* Animated Image */}
                <motion.div variants={imageVariant}>
                    <Image
                        src={aboutImage}
                        width={5000}
                        height={5000}
                        alt="about picture"
                        className="w-[350px] sm:w-[420px] md:w-[450px] lg:w-[550px] mx-auto my-2 lg:my-8 sm:max-w-[580px]"
                    />
                </motion.div>
                {/* Animated Text */}
                <motion.h2
                    variants={textVariant}
                    className="p-4 sm:p-0 w-full 2xl:w-3/5"
                >
                    <TextGenerateEffect words={words} />
                </motion.h2>
            </div>
        </motion.section>
    );
};

export default About;
