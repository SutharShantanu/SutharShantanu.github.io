"use client"

import * as React from "react";
import { useRef, useState } from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from "framer-motion";
import Image, { StaticImageData } from "next/image";

interface HoverLinkPreviewProps {
    href: string;
    previewImage: string | StaticImageData;
    imageAlt?: string;
    children: React.ReactNode;
    className?: string;
}

const HoverLinkPreview: React.FC<HoverLinkPreviewProps> = ({
    href,
    previewImage,
    imageAlt = "Link preview",
    children,
    className,
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const prevX = useRef<number | null>(null);

    const motionTop = useMotionValue(0);
    const motionLeft = useMotionValue(0);
    const motionRotate = useMotionValue(0);

    const springTop = useSpring(motionTop, { stiffness: 300, damping: 30 });
    const springLeft = useSpring(motionLeft, { stiffness: 300, damping: 30 });
    const springRotate = useSpring(motionRotate, { stiffness: 300, damping: 20 });

    const handleMouseEnter = () => {
        setShowPreview(true);
        prevX.current = null;
    };

    const handleMouseLeave = () => {
        setShowPreview(false);
        prevX.current = null;
        motionRotate.set(0);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const PREVIEW_WIDTH = 192;
        const PREVIEW_HEIGHT = 112;
        const OFFSET_Y = 40;

        motionTop.set(e.clientY - PREVIEW_HEIGHT - OFFSET_Y);
        motionLeft.set(e.clientX - PREVIEW_WIDTH / 2);

        if (prevX.current !== null) {
            const deltaX = e.clientX - prevX.current;
            const newRotate = Math.max(-15, Math.min(15, deltaX * 1.2));
            motionRotate.set(newRotate);
        }
        prevX.current = e.clientX;
    };

    return (
        <>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative cursor-pointer ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {children}
            </a>

            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        style={{
                            position: "fixed",
                            top: springTop,
                            left: springLeft,
                            rotate: springRotate,
                            zIndex: 50,
                            pointerEvents: "none",
                        }}
                    >
                        <div className="bg-white border rounded-2xl shadow-lg p-2 min-w-[180px] max-w-xs">
                            <Image
                                src={previewImage}
                                alt={imageAlt}
                                width={192}
                                height={112}
                                draggable={false}
                                className="object-cover rounded-md"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export { HoverLinkPreview };
