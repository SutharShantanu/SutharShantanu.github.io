import React, { useCallback, useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const usePrevNextButtons = (emblaApi, onButtonClick) => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
        if (onButtonClick) onButtonClick(emblaApi);
    }, [emblaApi, onButtonClick]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
        if (onButtonClick) onButtonClick(emblaApi);
    }, [emblaApi, onButtonClick]);

    const onSelect = useCallback((emblaApi) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};

export const PrevButton = (props) => {
    const { children, ...restProps } = props;

    return (
        <button
            className=" bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800  dark:hover:bg-neutral-700  select-none flex items-center justify-center cursor-pointer border border-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 dark:border-neutral-700 shadow-sm w-10 h-10 rounded-full text-black hover:shadow-md"
            type="button"
            {...restProps}>
            <ChevronLeft size={24} strokeWidth={1.75} className="dark:text-neutral-200" />
            {children}
        </button>
    );
};

export const NextButton = (props) => {
    const { children, ...restProps } = props;

    return (
        <button
            className=" bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800  dark:hover:bg-neutral-700 select-none flex items-center justify-center cursor-pointer border border-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 dark:border-neutral-700 shadow-sm w-10 h-10 rounded-full text-black hover:shadow-md "
            type="button"
            {...restProps}>
            <ChevronRight
                size={24}
                strokeWidth={1.75}
                className="dark:text-neutral-200"
            />
            {children}
        </button>
    );
};
