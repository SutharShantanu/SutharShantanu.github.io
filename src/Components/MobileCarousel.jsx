import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
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
        <section className="mx-auto mt-6 2xl:m-0">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides &&
                        slides.map((ele, index) => (
                            <motion.div
                                className="flex shrink-0 w-full mx-4"
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                    delay: index * 0.3,
                                }}
                            >
                                <Image
                                    className="w-full object-cover object-center rounded-lg shadow-md border border-neutral-200 dark:border-neutral-800"
                                    src={ele.image}
                                    alt={`Slide ${index}`}
                                    width={600}
                                    height={400}
                                    quality={90} // Enhanced quality
                                    priority // For preloading the images
                                />
                            </motion.div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default MobileCarousel;
