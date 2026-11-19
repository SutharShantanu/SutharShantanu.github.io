"use client";

// Replaces the root layout when the layout itself throws, so it renders its own <html>.
import "./globals.css";
import { Button } from "@heroui/react";
import { RotateCcw } from "@/components/icons";
import { StatusScreen } from "@/components/status-screen";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-full bg-background text-foreground antialiased">
        <StatusScreen
          code="500"
          title="The whole site tripped"
          description="A critical error stopped the portfolio from loading. Please try again in a moment."
          actions={
            <Button variant="primary" onPress={reset}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
          }
          footnote={error.digest ? `Error ID · ${error.digest}` : "Error 500 · Critical"}
        />
      </body>
    </html>
  );
}
