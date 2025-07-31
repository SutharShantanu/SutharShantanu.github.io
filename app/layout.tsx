import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shantanu Suthar | Portfolio",
  description:
    "Creative Frontend Developer crafting interactive and user-friendly web experiences.",
  metadataBase: new URL("https://shantanusuthar.vercel.app"),
  alternates: {
    canonical: "https://sutharshantanu.github.io",
  },
  openGraph: {
    title: "Shantanu Suthar | Portfolio",
    description:
      "Creative Frontend Developer crafting interactive and user-friendly web experiences.",
    url: "https://shantanusuthar.vercel.app",
    siteName: "Shantanu Suthar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shantanu Suthar Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Toaster position="top-center" expand={false} richColors />
          <Navbar />
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Shantanu Suthar",
                url: "https://shantanusuthar.vercel.app",
                jobTitle: "Creative Frontend Developer",
                sameAs: [
                  "https://github.com/SutharShantanu",
                  "https://linkedin.com/in/shantanu-suthar",
                ],
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
