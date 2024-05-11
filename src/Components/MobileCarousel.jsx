import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const MobileCarousel = ({ slides, options }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ delay: 3000 }),
    ]);

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        autoplay.play();
    }, [emblaApi]);

    return (
        <section className="mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides &&
                        slides.map((ele, index) => (
                            <div
                                className="flex-shrink-0 w-full mx-4"
                                key={index}>
                                <Image
                                    className="w-[90%] mx-auto h-[100%] object-cover object-top rounded-md border border-neutral-200 dark:border-neutral-800"
                                    src={ele.image}
                                    alt=""
                                />
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default MobileCarousel;
