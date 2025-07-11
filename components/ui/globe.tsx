"use client"

import createGlobe, { type COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const GLOBE_CONFIG: COBEOptions = {
    width: 800,
    height: 800,
    onRender: () => { },
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: 0,
    diffuse: 0.4,
    mapSamples: 16000,
    mapBrightness: 1.2,
    baseColor: [1, 1, 1],
    markerColor: [251 / 255, 100 / 255, 21 / 255],
    glowColor: [1, 1, 1],
    markers: [
        { location: [14.5995, 120.9842], size: 0.03 },
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [23.8103, 90.4125], size: 0.05 },
        { location: [30.0444, 31.2357], size: 0.07 },
        { location: [39.9042, 116.4074], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [19.4326, -99.1332], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [34.6937, 135.5022], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
    ],
}

export function Globe({
    className,
    config = GLOBE_CONFIG,
}: {
    className?: string
    config?: COBEOptions
}) {
    const phiRef = useRef(0)
    const widthRef = useRef(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)
    const [r, setR] = useState(0)

    const updatePointerInteraction = (value: number | null) => {
        pointerInteracting.current = value
        if (canvasRef.current) {
            canvasRef.current.style.cursor = value ? "grabbing" : "grab"
        }
    }

    const updateMovement = (clientX: number) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            setR(delta / 200)
        }
    }

    const onRender = useCallback(
        (state: Record<string, unknown>) => {
            if (!pointerInteracting.current) phiRef.current += 0.005
            state.phi = phiRef.current + r
            state.width = widthRef.current * 2
            state.height = widthRef.current * 2
        },
        [r],
    )

    const onResize = useCallback(() => {
        if (canvasRef.current) {
            widthRef.current = canvasRef.current.offsetWidth
        }
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current

        // Check if canvas context is available
        const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        if (!context) {
            console.warn("WebGL not supported")
            return
        }

        window.addEventListener("resize", onResize)
        onResize()

        // Ensure width is set before creating globe
        if (widthRef.current === 0) {
            widthRef.current = canvas.offsetWidth || 400
        }

        try {
            globeRef.current = createGlobe(canvas, {
                ...config,
                width: widthRef.current * 2,
                height: widthRef.current * 2,
                onRender,
            })

            // Set opacity after a short delay to ensure globe is initialized
            const timeoutId = setTimeout(() => {
                if (canvas) {
                    canvas.style.opacity = "1"
                }
            }, 100)

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener("resize", onResize)
                if (globeRef.current) {
                    globeRef.current.destroy()
                    globeRef.current = null
                }
            }
        } catch (error) {
            console.log("Error initializing globe:", error)
        }
    }, [config, onRender, onResize])

    return (
        <div className={cn("mx-auto aspect-[1/1] w-full max-w-[600px]", className)}>
            <canvas
                className={cn("size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]")}
                ref={canvasRef}
                onPointerDown={(e) => updatePointerInteraction(e.clientX - pointerInteractionMovement.current)}
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onMouseMove={(e) => updateMovement(e.clientX)}
                onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
            />
        </div>
    )
}
