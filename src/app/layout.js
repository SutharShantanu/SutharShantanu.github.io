"use client";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { ChakraProvider } from "@chakra-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import Navbar from "@/Components/Navbar";
import "./globals.css";
import Footer from "@/Components/Footer";
import Provider from "@/Components/Provider";

// export const metadata = {
//     title: "Create Next App",
//     description: "Generated by create next app",----- // can't enable this becouse this create problem in nextUiProvider !!
// };

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ChakraProvider>
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
                </ChakraProvider>
            </body>
        </html>
    );
}
