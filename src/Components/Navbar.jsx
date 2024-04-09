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
import { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import { memo } from "react";
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
    const [current, setCurrent] = useState("homepage");
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const links = [
        { id: "homepage", title: "Home", icon: "Home" },
        { id: "about", title: "About", icon: "BadgeInfo" },
        {
            id: "experience",

            title: "Experience",
            icon: "LampDesk",
        },
        { id: "skills", title: "Skills", icon: "Puzzle" },
        { id: "github", title: "Github", icon: "Github" },
        {
            id: "projects",

            title: "Projects",
            icon: "FolderGit2",
        },
        { id: "contact", title: "Contact", icon: "User" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            const scrollPosition = window.scrollY + 110;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (scrollPosition >= sectionTop) {
                    setCurrent(section.id);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = (id) => {
        const element = document.getElementById(id);
        const yOffset = -100;
        const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
    };

    const handleView = () => {
        setIsDownloading(true);
        // toast({
        //     title: "Downloading Resume File !",
        //     description: new Date().toLocaleString("en-US", {
        //         weekday: "long",
        //         year: "numeric",
        //         month: "long",
        //         day: "numeric",
        //         hour: "numeric",
        //         minute: "numeric",
        //         timeZone: "UTC",
        //     }),
        // });

        setTimeout(() => {
            setIsDownloading(false);
            const googleDriveLink =
                "https://drive.google.com/file/d/173kc0AW6miCrWOsqeYN3ad348otgyA13/view?usp=drive_link";
            window.open(googleDriveLink, "_blank");
        }, 2000);
    };

    return (
        <div className="fixed top-0 backdrop-blur-sm z-50 w-full">
            <Card className="hidden lg:flex p-4 2xl:w-4/5 xl:w-5/6 w-full m-auto mt-2 justify-between ">
                <div className="flex space-x-4 ">
                    {links.map((ele) => (
                        <NavItem
                            key={ele.id}
                            id={ele.id}
                            title={ele.title}
                            icon={ele.icon}
                            current={current}
                            onClick={handleClick}
                        />
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
                        prefetch={true}
                        href="https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13">
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
        </div>
    );
};

export default Navbar;

const NavItem = memo(function NavItem({ id, current, onClick, title, icon }) {
    const isActive = id === current;
    const handleClick = () => onClick(id);

    return (
        <span
            className={`flex items-center px-4 cursor-pointer rounded-xl transition-all ${
                isActive
                    ? "bg-black dark:bg-white text-white shadow-lg"
                    : "hover:bg-gray-200"
            }`}
            onClick={handleClick}>
            <span className="mr-2">{title}</span>
            {icon === "Home" ? (
                <Home size={18} strokeWidth={1.5} />
            ) : icon === "User" ? (
                <User size={18} strokeWidth={1.5} />
            ) : icon === "FolderGit2" ? (
                <FolderGit2 size={18} strokeWidth={1.5} />
            ) : icon === "Github" ? (
                <Github size={18} strokeWidth={1.5} />
            ) : icon === "Puzzle" ? (
                <Puzzle size={18} strokeWidth={1.5} />
            ) : icon === "LampDesk" ? (
                <LampDesk size={18} strokeWidth={1.5} />
            ) : icon === "BadgeInfo" ? (
                <BadgeInfo size={18} strokeWidth={1.5} />
            ) : null}
        </span>
    );
});

{
    /* <Card className="flex p-4 w-full lg:hidden justify-between">
    <Sheet>
        <SheetTrigger>
            <Button variant="outline" className="rounded-xl w-fit">
                <Menu size={20} strokeWidth={1.5} />
            </Button>
        </SheetTrigger>
        <SheetContent side="left">
            <SheetHeader>
                <SheetTitle>
                    <Image
                                    src="/public/images/banner.png"
                                    width={500}
                                    height={500}
                                    alt=""
                                />
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
                            <span className="ml-2">{link.title}</span>
                        </Link>
                    ))}
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>

    <Link
        target="_blank"
        prefetch={true}
        href="https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13"
    >
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
</Card>; */
}
