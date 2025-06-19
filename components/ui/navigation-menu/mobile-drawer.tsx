"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerClose, DrawerFooter, } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import { MobileDrawerProps } from "./types/navigation-menu.types";
import scrollIntoView from "scroll-into-view";
import Hamburger from "../hamburger/hamburger";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function MobileDrawer({
    isOpen,
    onClose,
    navItems,
    activeSection,
    setDrawerOpen,
}: MobileDrawerProps) {

    const handleItemClick = (link: string) => {
        onClose();
        const targetId = link.replace("#", "");
        const section = document.getElementById(targetId);
        if (section) {
            scrollIntoView(section, {
                time: 500,
                align: { top: 0.1 },
                ease: (t) => 1 - Math.pow(1 - t, 3),
            });
        }
    };


    return (
        <Drawer open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DrawerContent className="w-full h-svh">
                <DrawerHeader className="flex items-center flex-row dark:bg-neutral-900 justify-between m-2">
                    <DialogTitle className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage
                                src="https://avatars.githubusercontent.com/u/110021464?v=4"
                                alt="@SutharShantanu"
                            />
                            <AvatarFallback>SS</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-lg">Shantanu</span>
                    </DialogTitle>
                    <DrawerClose asChild>
                        <Hamburger
                            open={isOpen}
                            onClick={() => setDrawerOpen(false)}
                        />
                    </DrawerClose>
                </DrawerHeader>

                <ul className="flex flex-col gap-3 px-3 py-3">
                    {navItems.map((item) => {
                        const isActive = activeSection === String(item.id);
                        return (
                            <li key={item.label}>
                                <button
                                    className={`w-full text-left px-3 py-1.5 rounded-md text-4xl transition-all duration-300 flex items-center gap-2 gap-x-6 ${isActive
                                            ? "bg-primary/10 text-foreground font-semibold"
                                            : "hover:bg-accent/20 text-muted-foreground"
                                        }`}
                                    onClick={() => handleItemClick(item.link)}
                                >
                                    <item.icon className="w-8 h-8" />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <DrawerFooter className="flex flex-row items-center justify-between border-t pt-4 px-4">
                    <span className="text-xs text-muted-foreground w-fit">
                        © {new Date().getFullYear()} design and buid by Shantanu Suthar
                    </span>
                    <ThemeToggle />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
