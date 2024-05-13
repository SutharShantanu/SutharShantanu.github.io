"use client";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { Provider } from "@/Components/Provider";
import Head from "next/head";
import Navbar from "@/Components/Navbar";
import "./globals.css";
import Footer from "@/Components/Footer";
import Loading from "./Loading";

export default function RootLayout({ children }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { userData, repoData } = await GithubFetch();
            if (userData && repoData) {
                setIsLoading(false);
            }
        };

        const handleLoad = () => {
            setIsLoading(true);
            fetchData();
        };

        window.addEventListener("load", handleLoad);

        const clearLoadingState = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => {
            window.removeEventListener("load", handleLoad);
            clearTimeout(clearLoadingState);
        };
    }, []);

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="description" content="" />
                <meta
                    name="keywords"
                    content="keywords, separated, by, commas"
                />
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />

                <title>Shantanu Suthar&apos;s Portfolio</title>

                <meta name="theme-color" content="#F42727" />
            </Head>
            <html lang="en" suppressHydrationWarning>
                <body className={`${inter.className}   dark:bg-neutral-950 bg-neutral-50`}>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <Provider>
                            <Navbar />
                            {children}
                            <Footer />
                            <SpeedInsights />
                            <Analytics />
                            <Toaster
                                position="bottom-right"
                                richColors
                                closeButton
                            />
                        </Provider>
                    )}
                </body>
            </html>
        </>
    );
}
