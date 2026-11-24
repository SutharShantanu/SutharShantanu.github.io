"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import DefaultCertificates from "@/public/DefaultCertificates.png";
import { CertificationType } from "./types/certificates.types";

export default function Certifications({ certifications }: { certifications: CertificationType[] }) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <div id="certificates" className="w-full py-12 space-y-6 border-b border-border">
            <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    <span className="size-2 rounded-xs bg-foreground" />
                    <span>ACCREDITATIONS &amp; CERTIFICATIONS</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                    Technical credentials.
                </h3>
            </div>
            <div className="relative w-full overflow-hidden">
                <Marquee pauseOnHover className="[--duration:30s]">
                    {certifications.map((cert, i) => (
                        <TiltCard key={i} cert={cert} />
                    ))}
                </Marquee>

                {/* Gradient overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-linear-to-r from-background" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-linear-to-l from-background" />
            </div>
        </div>
    );
}

const TiltCard = ({ cert }: { cert: CertificationType }) => {
    const { name, authority, image, issued } = cert;

    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // 👇 More realistic rotation angles
    const rotateX = useTransform(mouseY, [0, 1], [-15, 15]);
    const rotateY = useTransform(mouseX, [1, 0], [15, -15]);

    const updateTilt = (clientX: number, clientY: number) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;

        mouseX.set(x);
        mouseY.set(y);
    };

    const resetTilt = () => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={(e) => updateTilt(e.clientX, e.clientY)}
            onMouseLeave={resetTilt}
            onTouchMove={(e) => {
                if (e.touches.length > 0) {
                    const t = e.touches[0];
                    updateTilt(t.clientX, t.clientY);
                }
            }}
            onTouchEnd={resetTilt}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            className="min-w-[200px] max-w-[200px] mx-2"
        >
            <div className="glass-panel rounded-2xl overflow-hidden p-3.5 space-y-2.5 transition-all hover:scale-[1.02]">
                <Image
                    src={image ? image : DefaultCertificates}
                    alt={`${name} - ${authority}`}
                    width={200}
                    height={120}
                    className="rounded-xl object-cover w-full h-[140px] bg-muted/40"
                />
                <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-foreground line-clamp-1">{name}</p>
                    <p className="text-muted-foreground line-clamp-1 text-[11px]">{authority}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/80 line-clamp-1">Issued: {issued}</p>
                </div>
            </div>
        </motion.div>
    );
};
