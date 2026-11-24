"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { Briefcase, FolderGit2, Home, Mail } from "@/components/icons";
import { StatusScreen } from "@/components/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title={
        <>
          Lost in <span className="inline-block -rotate-2 font-hand font-semibold text-[1.3em] leading-none">the glass</span>
        </>
      }
      description="This page doesn't exist — it may have moved during the redesign. Try one of these instead."
      actions={
        <>
          <Link href="/" className={buttonVariants({ variant: "primary" })}>
            <Home className="size-4" />
            Back home
          </Link>
          <Link href="/#contact" className={buttonVariants({ variant: "secondary" })}>
            Report a broken link
          </Link>
        </>
      }
      links={[
        { href: "/#work", label: "Work", note: "Projects & repos", icon: FolderGit2 },
        { href: "/#experience", label: "Experience", note: "Roles & certifications", icon: Briefcase },
        { href: "/#contact", label: "Contact", note: "Say hi", icon: Mail },
      ]}
      footnote="Error 404 · Not found"
    />
  );
}
