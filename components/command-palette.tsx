"use client";

import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
    FolderGit2,
    Briefcase,
    Wrench,
    Activity,
    Mail,
    Download,
    Github,
    Linkedin,
    Moon,
    Sun,
    Monitor,
    Copy,
    ArrowUpRight,
    Home,
    Sparkles,
} from "lucide-react";

const RESUME_URL = "https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13";
const EMAIL = "shantanusut2000@gmail.com";

interface CommandPaletteProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const { setTheme } = useTheme();

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : open;
    const setIsOpen = isControlled && onOpenChange ? onOpenChange : setOpen;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(!isOpen);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isOpen, setIsOpen]);

    const runCommand = (command: () => void) => {
        setIsOpen(false);
        command();
    };

    const scrollTo = (id: string) => {
        runCommand(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        });
    };

    const copyEmail = () => {
        runCommand(() => {
            navigator.clipboard.writeText(EMAIL);
            toast.success("Email copied to clipboard!", {
                description: EMAIL,
            });
        });
    };

    const downloadResume = () => {
        runCommand(() => {
            window.open(RESUME_URL, "_blank", "noopener,noreferrer");
            toast.success("Opening résumé download...");
        });
    };

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput placeholder="Type a command or search sections..." />
            <CommandList className="max-h-[380px]">
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => scrollTo("top")}>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Intro &amp; Signature</span>
                        <CommandShortcut>G T</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => scrollTo("about")}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>1 / About</span>
                        <CommandShortcut>G A</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => scrollTo("work")}>
                        <FolderGit2 className="mr-2 h-4 w-4" />
                        <span>2 / Selected Work</span>
                        <CommandShortcut>G W</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => scrollTo("experience")}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>3 / Experience</span>
                        <CommandShortcut>G E</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => scrollTo("elsewhere")}>
                        <Wrench className="mr-2 h-4 w-4" />
                        <span>4 / Elsewhere</span>
                        <CommandShortcut>G L</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => scrollTo("education")}>
                        <Activity className="mr-2 h-4 w-4" />
                        <span>5 / Education &amp; Craft</span>
                        <CommandShortcut>G D</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => scrollTo("contact")}>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>6 / Get in Touch</span>
                        <CommandShortcut>G C</CommandShortcut>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Quick Actions">
                    <CommandItem onSelect={copyEmail}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy Email ({EMAIL})</span>
                    </CommandItem>
                    <CommandItem onSelect={downloadResume}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download Résumé (PDF)</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Switch to Light Theme</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Switch to Dark Theme</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>Use System Theme</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="External Links">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() =>
                                window.open(
                                    "https://github.com/SutharShantanu",
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            )
                        }
                    >
                        <Github className="mr-2 h-4 w-4" />
                        <span>GitHub Profile (@SutharShantanu)</span>
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            runCommand(() =>
                                window.open(
                                    "https://linkedin.com/in/shantanu-suthar",
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            )
                        }
                    >
                        <Linkedin className="mr-2 h-4 w-4" />
                        <span>LinkedIn Profile (/in/shantanu-suthar)</span>
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
