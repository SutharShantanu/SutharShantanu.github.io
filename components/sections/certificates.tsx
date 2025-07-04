"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import DefaultCertificates from "@/public/DefaultCertificates.png";
import { CertificationType } from "./types/certificates.types";
import SectionHeader from "../ui/section-header/section-header";

export default function Certifications({ certifications }: { certifications: CertificationType[] }) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-between py-6 gap-10 overflow-hidden max-w-5xl">
            <SectionHeader
                title="Certifications"
                description="Explore my certifications that reflect my commitment to continuous learning, technical excellence, and professional growth."
                center={false}
            />
            <div className="relative w-full overflow-hidden">
                <Marquee pauseOnHover className="[--duration:30s]">
                    {certifications.map((cert, i) => (
                        <TiltCard key={i} cert={cert} />
                    ))}
                </Marquee>

                {/* Gradient overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-background" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-background" />
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
            <Card className="border-border bg-card transition-shadow">
                <CardContent className="p-4 space-y-2">
                    <Image
                        src={image ? image : DefaultCertificates}
                        alt={`${name} - ${authority}`}
                        width={200}
                        height={120}
                        className="rounded-md object-cover w-full h-[150px]"
                    />
                    <div className="text-xs">
                        <p className="font-semibold line-clamp-1">{name}</p>
                        <p className="text-muted-foreground line-clamp-1">{authority}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">Issued: {issued}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
