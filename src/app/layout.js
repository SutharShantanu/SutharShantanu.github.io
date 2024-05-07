"use client";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { Provider } from "@/Components/Provider";
import Head from "next/head";
import Navbar from "@/Components/Navbar";
import "./globals.css";
import Footer from "@/Components/Footer";
import { Suspense } from "react";

export default function RootLayout({ children }) {
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
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <title>Shantanu Suthar&apos;s Portfolio</title>

                <meta name="theme-color" content="#F42727" />
            </Head>
            <html lang="en" suppressHydrationWarning>
                <body className={inter.className}>
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
                </body>
            </html>
        </>
    );
}
