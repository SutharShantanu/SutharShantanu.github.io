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
            className="bg-gray-100 select-none flex items-center justify-center cursor-pointer border border-gray-200 shadow-sm w-10 h-10 rounded-full text-black hover:shadow-md hover:bg-gray-200 hover:border-gray-300"
            type="button"
            {...restProps}>
            <ChevronLeft size={24} strokeWidth={1.75} />
            {children}
        </button>
    );
};

export const NextButton = (props) => {
    const { children, ...restProps } = props;

    return (
        <button
            className="bg-gray-100 select-none flex items-center justify-center cursor-pointer border border-gray-200 shadow-sm w-10 h-10 rounded-full text-black hover:shadow-md hover:bg-gray-200 hover:border-gray-300"
            type="button"
            {...restProps}>
            <ChevronRight size={24} strokeWidth={1.75} />
            {children}
        </button>
    );
};
