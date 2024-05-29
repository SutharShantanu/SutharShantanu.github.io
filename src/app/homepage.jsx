"use client";

import React from "react";

import MobileCarousel from "@/Components/MobileCarousel";
import ImageA from "../../public/A.jpg";
import ImageB from "../../public/B.jpg";
import ImageC from "../../public/C.jpg";
import ImageD from "../../public/D.jpg";

const Homepage = () => {
    const OPTIONS = { loop: true };
    const SLIDES = [
        { id: 0, image: ImageA },
        { id: 1, image: ImageB },
        { id: 2, image: ImageC },
        { id: 3, image: ImageD },
    ];
    return (
        <section
            id="homepage"
            className="border border-neutral-200 dark:border-neutral-800 min-h-[80vh] sm:min-h-[87vh] dark:bg-neutral-900 bg-neutral-100 w-[90%] xl:max-w-[80%] m-auto mt-24 sm:p-8 rounded-lg shadow-sm">
            <div className="min-h-[80vh] grid grid-cols-1 2xl:grid-cols-2 justify-around items-center p-6 lg:p-0">
                <div className="w-full md:w-fit inline-block m-auto ">
                    <h1 className="text-6xl sm:text-[6rem] lg:text-[8rem] text-center sm:text-left inline-block bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 leading-normal p-2 rounded-md">
                        Hey, I&apos;m
                    </h1>
                    <h1 className="text-6xl sm:text-[6rem] lg:text-[8rem] w-min text-center sm:text-left bg-neutral-300 dark:bg-neutral-700  dark:text-neutral-200 leading-relaxed p-2 rounded-md">
                        Shantanu!
                    </h1>
                </div>
                <div className="m-auto w-full md:max-w-[70%] lg:max-w-[60%] 2xl:max-w-[75%]">
                    <MobileCarousel slides={SLIDES} options={OPTIONS} />
                </div>
            </div>
        </section>
    );
};

export default Homepage;
