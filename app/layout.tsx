import type { Metadata } from "next";
import { ThemeProvider } from "@/components/themeProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { FloatingControls } from "@/components/floating-controls";
import { ScrollProgress } from "@/components/scroll-progress";

export const metadata: Metadata = {
  title: "Shantanu Suthar — Frontend Developer",
  description:
    "Frontend Developer crafting high-performance, thoughtful web experiences and design systems. Based in Gurugram, India.",
  metadataBase: new URL("https://sutharshantanu.github.io"),
  openGraph: {
    title: "Shantanu Suthar — Frontend Developer",
    description:
      "Frontend Developer crafting high-performance, thoughtful web experiences and design systems. Based in Gurugram, India.",
    url: "https://sutharshantanu.github.io",
    siteName: "Shantanu Suthar",
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
      <body
        className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-black/10 dark:selection:bg-white/15"
      >
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ScrollProgress />
          <Toaster position="top-center" expand={false} richColors />
          <FloatingControls />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
