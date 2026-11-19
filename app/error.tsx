"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Home, RotateCcw } from "lucide-react";
import { StatusScreen } from "@/components/status-screen";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      title={
        <>
          Something <span className="font-serif font-normal italic">cracked</span>
        </>
      }
      description="An unexpected error broke this page. Retrying usually fixes it; if not, the home page still works."
      actions={
        <>
          <Button variant="primary" onPress={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            <Home className="size-4" />
            Back home
          </Link>
        </>
      }
      footnote={error.digest ? `Error ID · ${error.digest}` : "Error 500 · Unexpected error"}
    />
  );
}
