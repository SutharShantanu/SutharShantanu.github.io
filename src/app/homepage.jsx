"use client";

import React from "react";
import { motion } from "framer-motion";  // Import framer-motion

import MobileCarousel from "@/Components/MobileCarousel";
import ImageA from "../../public/A.webp";
import ImageB from "../../public/B.webp";
import ImageC from "../../public/C.webp";
import ImageD from "../../public/D.webp";
import ImageE from "../../public/E.webp";
import ImageF from "../../public/F.webp";
import ImageG from "../../public/G.webp";
import ImageH from "../../public/H.webp";

const Homepage = () => {
    const OPTIONS = { loop: true };
    const SLIDES = [
        { id: 0, image: ImageA },
        { id: 1, image: ImageB },
        { id: 2, image: ImageC },
        { id: 3, image: ImageD },
        { id: 4, image: ImageE },
        { id: 5, image: ImageF },
        { id: 6, image: ImageG },
        { id: 7, image: ImageH },
    ];

    return (
        <section
            id="homepage"
            className="border border-neutral-200 dark:border-neutral-800 min-h-[80vh] sm:min-h-[87vh] dark:bg-neutral-900 bg-neutral-100 w-[90%] xl:max-w-[80%] m-auto mt-24 sm:p-8 rounded-lg shadow-sm">
            
            {/* Scroll Animation Section */}
            <div className="min-h-[80vh] grid grid-cols-1 2xl:grid-cols-2 justify-around items-center p-6 lg:p-0">
                
                {/* Header Text Animation */}
                <div className="w-full md:w-fit inline-block m-auto ">
                    <motion.h1
                        className="text-5xl sm:text-[6rem] lg:text-[8rem] text-center sm:text-left inline-block bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 leading-normal p-2 rounded-md"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Hey, I&apos;m
                    </motion.h1>
                    <motion.h1
                        className="text-5xl sm:text-[6rem] lg:text-[8rem] w-min text-center sm:text-left bg-neutral-300 dark:bg-neutral-700  dark:text-neutral-200 leading-relaxed p-2 rounded-md"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Shantanu!
                    </motion.h1>
                </div>

                {/* Carousel Animation */}
                <div className="m-auto w-full md:max-w-[70%] lg:max-w-[60%] 2xl:max-w-[75%]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <MobileCarousel slides={SLIDES} options={OPTIONS} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Homepage;
