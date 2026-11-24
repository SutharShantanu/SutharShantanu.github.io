"use client";

/**
 * PDF viewer adapted from Elements (tryelements.dev/docs/pdf/pdf-viewer, react-pdf based),
 * rebuilt with HeroUI controls, a bundled PDF.js worker (no CDN), container-aware sizing,
 * keyboard paging and a page-turn transition.
 */
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Skeleton, ToggleButton, ToggleButtonGroup, Tooltip } from "@heroui/react";
import { BookOpen, ChevronLeft, ChevronRight, Download, FileText, Rows3, ZoomIn, ZoomOut } from "@/components/icons";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Must be set in the same module that renders <Document> (react-pdf README).
if (typeof window !== "undefined") {
    const workerVersion = pdfjs.version || "6.5.438";
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(`/pdf.worker.min.mjs?v=${workerVersion}`, window.location.origin).toString();
}

type ViewMode = "single" | "scroll" | "book";

const MODES: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "single", label: "Single page", icon: FileText },
    { id: "scroll", label: "Continuous scroll", icon: Rows3 },
    { id: "book", label: "Book spread", icon: BookOpen },
];

export function PdfViewer({ file, downloadUrl, className }: { file: string; downloadUrl?: string; className?: string }) {
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState<ViewMode>("single");
    const [zoom, setZoom] = useState(1);
    const [containerWidth, setContainerWidth] = useState(0);
    const [failed, setFailed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Size pages to the container (dialog), not the window.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Immediate measurement if container already has layout dimensions
        if (el.clientWidth > 0) {
            setContainerWidth(Math.round(el.clientWidth / 8) * 8);
        }

        // Debounce resize updates so dialog opening animation or rapid resizing
        // doesn't thrash or cancel in-flight PDF canvas rendering.
        let timer: ReturnType<typeof setTimeout> | null = null;
        const ro = new ResizeObserver(([entry]) => {
            if (!entry) return;
            const newWidth = Math.round(entry.contentRect.width / 8) * 8;
            if (newWidth <= 0) return;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                setContainerWidth((prev) => (prev !== newWidth ? newWidth : prev));
            }, 80);
        });

        ro.observe(el);
        return () => {
            if (timer) clearTimeout(timer);
            ro.disconnect();
        };
    }, []);

    const step = mode === "book" ? 2 : 1;
    const lastPage = mode === "book" ? Math.max(1, numPages - 1) : numPages;
    const prev = () => setPage((p) => Math.max(1, p - step));
    const next = () => setPage((p) => Math.min(lastPage, p + step));
    const pageWidth = Math.max(200, Math.round((mode === "book" ? containerWidth / 2 - 24 : containerWidth - 32) * zoom));
    const bookSecond = mode === "book" && page > 1 && page + 1 <= numPages ? page + 1 : null;

    const pageSkeleton = <Skeleton className="aspect-[1/1.414] rounded-xl" style={{ width: pageWidth }} />;

    return (
        <div className={`flex min-h-0 flex-col overflow-hidden rounded-2xl bg-default ${className ?? ""}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-separator p-2">
                <ToggleButtonGroup
                    aria-label="View mode"
                    size="sm"
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={new Set([mode])}
                    onSelectionChange={(keys) => {
                        const [k] = keys;
                        if (k) {
                            setMode(k as ViewMode);
                            setPage(1);
                        }
                    }}
                >
                    {MODES.map(({ id, label, icon: Icon }, i) => (
                        <ToggleButton key={id} id={id} isIconOnly aria-label={label} className={id === "book" ? "hidden sm:flex" : undefined}>
                            {i > 0 && <ToggleButtonGroup.Separator />}
                            <Icon className="size-4" />
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {mode !== "scroll" && (
                    <div className="flex items-center gap-1">
                        <Button isIconOnly size="sm" variant="ghost" aria-label="Previous page" isDisabled={page <= 1} onPress={prev}>
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="min-w-16 text-center font-mono text-xs text-muted tabular-nums" aria-live="polite">
                            {numPages ? `${page}${bookSecond ? `–${bookSecond}` : ""} / ${numPages}` : "–"}
                        </span>
                        <Button isIconOnly size="sm" variant="ghost" aria-label="Next page" isDisabled={page >= lastPage} onPress={next}>
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <Button isIconOnly size="sm" variant="ghost" aria-label="Zoom out" isDisabled={zoom <= 0.5} onPress={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
                        <ZoomOut className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Reset zoom to fit width" className="min-w-12 font-mono text-xs tabular-nums" onPress={() => setZoom(1)}>
                        {Math.round(zoom * 100)}%
                    </Button>
                    <Button isIconOnly size="sm" variant="ghost" aria-label="Zoom in" isDisabled={zoom >= 2} onPress={() => setZoom((z) => Math.min(2, z + 0.25))}>
                        <ZoomIn className="size-4" />
                    </Button>
                    {downloadUrl && (
                        <Tooltip delay={200}>
                            <Button isIconOnly size="sm" variant="ghost" aria-label="Download PDF" onPress={() => window.open(downloadUrl, "_blank", "noopener,noreferrer")}>
                                <Download className="size-4" />
                            </Button>
                            <Tooltip.Content>Download PDF</Tooltip.Content>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Document */}
            <div
                ref={containerRef}
                tabIndex={0}
                aria-label="Résumé document. Use left and right arrow keys to change pages."
                onKeyDown={(e) => {
                    if (mode === "scroll") return;
                    if (e.key === "ArrowRight") next();
                    if (e.key === "ArrowLeft") prev();
                }}
                className="min-h-0 flex-1 overflow-auto p-4 outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset"
            >
                {containerWidth === 0 ? (
                    <div className="flex justify-center">{pageSkeleton}</div>
                ) : failed ? (
                    <LoadError downloadUrl={downloadUrl} />
                ) : (
                <Document
                    file={file}
                    onLoadError={(err) => {
                        console.error("PDF preview load error:", err);
                        setFailed(true);
                    }}
                    onSourceError={(err) => {
                        console.error("PDF preview source error:", err);
                        setFailed(true);
                    }}
                    onLoadSuccess={({ numPages: n }) => {
                        setNumPages(n);
                        setPage(1);
                    }}
                    loading={<div className="flex justify-center">{pageSkeleton}</div>}
                    error={<LoadError downloadUrl={downloadUrl} />}
                    className={mode === "scroll" ? "grid justify-center gap-4" : "flex justify-center"}
                >
                    {mode === "scroll" ? (
                        Array.from({ length: numPages }, (_, i) => (
                            <Page
                                key={`p-${i + 1}`}
                                pageNumber={i + 1}
                                width={pageWidth}
                                loading={pageSkeleton}
                                className="relative overflow-hidden rounded-xl shadow-lg bg-white"
                            />
                        ))
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${mode}-${page}`}
                                className="flex gap-4"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Page
                                    key={`p-${page}`}
                                    pageNumber={page}
                                    width={pageWidth}
                                    loading={pageSkeleton}
                                    className="relative overflow-hidden rounded-xl shadow-lg bg-white"
                                />
                                {bookSecond && (
                                    <Page
                                        key={`p-${bookSecond}`}
                                        pageNumber={bookSecond}
                                        width={pageWidth}
                                        loading={pageSkeleton}
                                        className="relative overflow-hidden rounded-xl shadow-lg bg-white"
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </Document>
                )}
            </div>
        </div>
    );
}

function LoadError({ downloadUrl }: { downloadUrl?: string }) {
    return (
        <div className="grid place-items-center gap-3 py-16 text-center text-sm text-muted">
            <p>Couldn&apos;t load the PDF preview.</p>
            {downloadUrl && (
                <Button size="sm" variant="primary" onPress={() => window.open(downloadUrl, "_blank", "noopener,noreferrer")}>
                    <Download className="size-3.5" />
                    Download instead
                </Button>
            )}
        </div>
    );
}

/** Keeps a pdf.js failure inside the dialog instead of taking down the page. */
class ViewerBoundary extends React.Component<{ downloadUrl?: string; children: React.ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? <LoadError downloadUrl={this.props.downloadUrl} /> : this.props.children;
    }
}

export default function SafePdfViewer(props: React.ComponentProps<typeof PdfViewer>) {
    return (
        <ViewerBoundary downloadUrl={props.downloadUrl}>
            <PdfViewer {...props} />
        </ViewerBoundary>
    );
}
