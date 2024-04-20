import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { PrevButton, NextButton, usePrevNextButtons } from "./CarouselButton";
import { Link2, GitBranch, Languages, GitCommitVertical } from "lucide-react";
import Link from "next/link";

const RepoCard = (props) => {
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop;

        resetOrStop();
    }, []);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi, onNavButtonClick);

    return (
        <section className="mx-auto">
            <p className="mb-4 text-2xl sm:text-4xl font-extralight">
                Repositories
            </p>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides &&
                        slides.map((ele, index) => (
                            <div
                                className="pl-1 flex-shrink-0 w-full mx-4"
                                key={index}>
                                <div className="shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm p-4">
                                    <div>
                                        <p className="font-semibold text-2xl text-neutral-200">
                                            {ele.name}
                                        </p>
                                        <p className="font-extralight text-lg text-neutral-200">
                                            {ele.description}
                                        </p>
                                        <div className="flex w-fit gap-6 justify-between items-center my-4">
                                            <p className=" flex items-center bg-slate-100 w-fit rounded-xl  font-light text-sm shadow-sm px-2 py-[.8px] border border-slate-200 hover:bg-slate-200 transition-all duration-300 hover:border-slate-300">
                                                <Languages
                                                    size={18}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 mr-2"
                                                />
                                                {ele.Languages
                                                    ? ele.language
                                                    : "Javascript"}
                                            </p>
                                            <p className="flex items-center bg-slate-100 w-fit rounded-xl  font-light text-sm shadow-sm px-2 py-[.8px] border border-slate-200 hover:bg-slate-200 transition-all duration-300 hover:border-slate-300">
                                                <GitCommitVertical
                                                    size={18}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 mr-2"
                                                />
                                                {new Date(
                                                    ele.pushed_at
                                                ).toLocaleString("en-US", {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    timeZoneName: "short",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    timeZone: "GMT",
                                                })}
                                            </p>

                                            <p
                                                onClick={() => ele.url}
                                                className="flex items-center bg-slate-100 w-fit rounded-xl  font-light text-sm shadow-sm px-2 py-[.8px] border border-slate-200 hover:bg-slate-200 transition-all duration-300 hover:border-slate-300">
                                                <GitBranch
                                                    size={18}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 mr-2"
                                                />
                                                {ele.default_branch}
                                            </p>

                                            <Link
                                                href={ele.html_url}
                                                target="_blank"
                                                className="flex items-center bg-slate-100 w-fit rounded-xl font-light text-sm shadow-sm px-2 py-[.8px] border group border-slate-200 hover:bg-slate-200 transition duration-300 hover:border-slate-300">
                                                <Link2
                                                    size={18}
                                                    strokeWidth={1.75}
                                                    className="text-neutral-500 group-hover:mr-2"
                                                />
                                                <p className="hidden group-hover:inline transition duration-300">
                                                    Check more
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3 items-center">
                    <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                    />
                </div>

                {/* <div className="flex flex-wrap justify-end items-center">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`border border-neutral-200 rounded-full m-2 shadow-sm bg-neutral-100 select-none flex items-center justify-center cursor-pointer ${
                                index === selectedIndex
                                    ? "border-transparent bg-transparent w-4 h-4 outline outline-[0.8px] outline-offset-4"
                                    : "hover:bg-slate-200 hover:shadow-lg w-6 h-6"
                            }`}
                        />
                    ))}
                </div> */}
            </div>
        </section>
    );
};

export default RepoCard;
