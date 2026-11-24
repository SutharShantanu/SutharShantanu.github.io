import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/themeProvider";
import { DitherField } from "@/components/ui/dither-field";
import "./globals.css";
import { Bricolage_Grotesque, Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--nf-display", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
// Mono is only for small meta text: don't compete with above-the-fold fonts.
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
// Handwriting accent for short personal touches (name, small annotations); serif stays for long italics.
const hand = Caveat({ subsets: ["latin"], variable: "--nf-hand", display: "swap" });
// "optional": slow connections keep the fallback italic instead of re-painting the LCP text late.
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--nf-serif", display: "optional" });

const SITE_URL = "https://shantanusuthar.vercel.app";
const DESCRIPTION =
  "Shantanu Suthar — Software Engineer at WhizHack building scalable, accessible web apps with Next.js, React and TypeScript. Based in Gurugram, India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Shantanu Suthar — Software Engineer", template: "%s · Shantanu Suthar" },
  description: DESCRIPTION,
  applicationName: "Shantanu Suthar",
  authors: [{ name: "Shantanu Suthar", url: SITE_URL }],
  creator: "Shantanu Suthar",
  keywords: ["Shantanu Suthar", "Software Engineer", "Frontend Developer", "Next.js", "React", "TypeScript", "HeroUI", "Portfolio", "Gurugram"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shantanu Suthar — Software Engineer",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Shantanu Suthar",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shantanu Suthar — Software Engineer",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable} ${serif.variable} ${hand.variable}`}>
      <body
        className="min-h-full bg-background text-foreground antialiased"
      >
        {/* Root background: Magic UI Dither Field in the glass theme ramp (sits above the blurred mesh) */}
        <DitherField
          aria-hidden="true"
          pattern="horizon"
          color={["var(--dither-low)", "var(--dither-mid)", "var(--dither-high)"]}
          dotSize={2}
          intensity={0.7}
          className="!fixed inset-0 -z-[1]"
        />
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
