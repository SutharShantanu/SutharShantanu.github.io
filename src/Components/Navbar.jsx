"use client";

import {
    Home,
    User,
    FolderGit2,
    Github,
    Code2,
    BadgeInfo,
    Loader2,
    ArrowDownCircle,
    Menu,
    LampDesk,
    Puzzle,
} from "lucide-react";
import { Card } from "./ui/card";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@nextui-org/react";

import { useToast } from "./ui/use-toast";
import Image from "next/image";
import { Button } from "./ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import ThemeSwitch from "./Theme";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();
    const links = [
        { href: "/", title: "Home", icon: "Home", isActive: true },
        { href: "#about", title: "About", icon: "BadgeInfo" },
        { href: "#experience", title: "Experience", icon: "LampDesk" },
        { href: "#skill", title: "Skills", icon: "Puzzle" },
        { href: "#github", title: "Github", icon: "Github" },
        { href: "#project", title: "Projects", icon: "FolderGit2" },
        { href: "#contact", title: "Contact", icon: "User" },
    ];

    const toggleActiveLink = (index) => {
        links.forEach((link, i) => (link.isActive = i === index));
    };

    const handleView = () => {
        setIsDownloading(true);
        toast({
            title: "Downloading Resume File !",
            description: new Date().toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                timeZone: "UTC",
            }),
        });

        setTimeout(() => {
            setIsDownloading(false);
            // const googleDriveLink =
            //     "https://drive.google.com/file/d/173kc0AW6miCrWOsqeYN3ad348otgyA13/view?usp=drive_link";
            // window.open(googleDriveLink, "_blank");
        }, 2000);
    };

    return (
        <div className="fixed top-0 backdrop-blur-sm z-50 w-full">
            <Card className="hidden lg:flex p-4 2xl:w-4/5 xl:w-5/6 w-full m-auto mt-2 justify-between ">
                <div className="flex flex-row space-x-4 ">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className={`flex items-center px-4 rounded-xl animate-out transition-all  ${
                                link.isActive
                                    ? "bg-black dark:bg-white text-white px-4 rounded-xl transition-all shadow-lg"
                                    : "hover:bg-gray-200"
                            }`}
                            onTap={() => toggleActiveLink(index)}>
                            <span className="mr-2">{link.title}</span>
                            {(() => {
                                switch (link.icon) {
                                    case "Home":
                                        return (
                                            <Home size={18} strokeWidth={1.5} />
                                        );
                                    case "User":
                                        return (
                                            <User size={18} strokeWidth={1.5} />
                                        );
                                    case "FolderGit2":
                                        return (
                                            <FolderGit2
                                                size={18}
                                                strokeWidth={1.5}
                                            />
                                        );
                                    case "Github":
                                        return (
                                            <Github
                                                size={18}
                                                strokeWidth={1.5}
                                            />
                                        );
                                    case "Puzzle":
                                        return (
                                            <Puzzle
                                                size={18}
                                                strokeWidth={1.5}
                                            />
                                        );
                                    case "LampDesk":
                                        return (
                                            <LampDesk
                                                size={18}
                                                strokeWidth={1.5}
                                            />
                                        );
                                    case "BadgeInfo":
                                        return (
                                            <BadgeInfo
                                                size={18}
                                                strokeWidth={1.5}
                                            />
                                        );
                                    default:
                                        return null;
                                }
                            })()}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-row space-x-4">
                    <TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <Avatar>
                                    <TooltipTrigger>
                                        <AvatarImage src="https://avatars.githubusercontent.com/u/110021464?v=4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <AvatarFallback>ST</AvatarFallback>
                                    </TooltipContent>
                                </Avatar>
                            </Tooltip>
                        </TooltipProvider>
                    </TooltipProvider>
                    {/* <ThemeSwitch /> */}
                    <Link
                        // target="_blank"
                        prefetch={true}
                        // href="https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13"
                        href="#">
                        <Button
                            disabled={isDownloading}
                            onClick={handleView}
                            className="rounded-xl shadow-lg ">
                            {isDownloading ? (
                                <div className="flex">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    <span>Downloading</span>
                                </div>
                            ) : (
                                <div className="flex ">
                                    <span>Download Resume &nbsp;</span>
                                    <ArrowDownCircle
                                        className="mr-2 h-5 w-5 text-white"
                                        size={20}
                                        strokeWidth={1.5}
                                    />
                                </div>
                            )}
                        </Button>
                    </Link>
                </div>
            </Card>
            <Card className="flex p-4 w-full lg:hidden justify-between">
                <Sheet>
                    <SheetTrigger>
                        <Button variant="outline" className="rounded-xl w-fit">
                            <Menu size={20} strokeWidth={1.5} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>
                                {/* <Image
                                    src="/public/images/banner.png"
                                    width={500}
                                    height={500}
                                    alt=""
                                /> */}
                            </SheetTitle>

                            <SheetDescription>
                                <Separator className="my-4" />
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={`flex items-center mb-2  p-4  rounded-xl animate-out transition-all  ${
                                            link.isActive
                                                ? "bg-black text-white p-4 rounded-xl transition-all shadow-lg"
                                                : "hover:bg-gray-200"
                                        }`}
                                        onTap={() => toggleActiveLink(index)}>
                                        {(() => {
                                            switch (link.icon) {
                                                case "Home":
                                                    return (
                                                        <Home
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                case "User":
                                                    return (
                                                        <User
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                case "FolderGit2":
                                                    return (
                                                        <FolderGit2
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                case "Github":
                                                    return (
                                                        <Github
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                case "Puzzle":
                                                    return (
                                                        <Puzzle
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                case "LampDesk":
                                                    return (
                                                        <LampDesk
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                case "BadgeInfo":
                                                    return (
                                                        <BadgeInfo
                                                            size={18}
                                                            strokeWidth={1.5}
                                                        />
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })()}
                                        <span className="ml-2">
                                            {link.title}
                                        </span>
                                    </Link>
                                ))}
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                <Link
                    // target="_blank"
                    prefetch={true}
                    // href="https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13"
                    href="#">
                    <Button
                        disabled={isDownloading}
                        onClick={handleView}
                        className="rounded-xl shadow-lg">
                        {isDownloading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <ArrowDownCircle
                                className="h-5 w-5 text-white animate-pulse"
                                size={20}
                                strokeWidth={1.5}
                            />
                        )}
                    </Button>
                </Link>
            </Card>
        </div>
    );
};

export default Navbar;
