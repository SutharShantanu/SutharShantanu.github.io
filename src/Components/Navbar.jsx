"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Home,
    User,
    FolderGit2,
    Github,
    BadgeInfo,
    Loader2,
    ArrowDownCircle,
    Menu,
    X,
    LampDesk,
    Puzzle,
} from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetFooter,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { memo } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import ThemeSwitch from "./Theme";
import banner from "../../public/image-3.png";
import banner2 from "../../public/banner2.jpeg";

const Navbar = () => {
    const [current, setCurrent] = useState("homepage");
    const [isDownloading, setIsDownloading] = useState(false);

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
            const scrollPosition = window.scrollY + 10;

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
        toast.success("Downloading Resume !", {
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
            <Card className="hidden border bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 lg:flex p-4 2xl:w-4/5 xl:w-5/6 w-full m-auto mt-2 justify-between ">
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
                <div className="flex items-center flex-row space-x-4">
                    <ThemeSwitch />
                    <Link
                        prefetch={true}
                        href="https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13">
                        <Button
                            disabled={isDownloading}
                            onClick={handleView}
                            className="rounded-md shadow-lg border border-neutral-200 bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-neutral-50 dark:text-neutral-900">
                            {isDownloading ? (
                                <div className="flex">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    <span>Downloading</span>
                                </div>
                            ) : (
                                <div className="flex ">
                                    <span>Download Resume &nbsp;</span>
                                    <ArrowDownCircle
                                        className="h-5 w-5 text-neutral-50 dark:text-neutral-900"
                                        size={20}
                                        strokeWidth={1.5}
                                    />
                                </div>
                            )}
                        </Button>
                    </Link>
                </div>
            </Card>
            <Card className="flex items-center p-4 w-full lg:hidden justify-between bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full group shadow-sm hover:shadow-none border hover:border-neutral-200 dark:border-neutral-700
                            dark:hover:bg-neutral-700 dark:bg-neutral-800">
                            <Menu
                                size={20}
                                strokeWidth={1.5}
                                className="group-hover:hidden "
                            />
                            <X
                                size={20}
                                strokeWidth={1.5}
                                className="hidden group-hover:block "
                            />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="border dark:border-neutral-700 dark:bg-neutral-900">
                        <SheetHeader>
                            <SheetTitle>
                                <Image
                                    priority
                                    quality={100}
                                    src={banner2}
                                    width={500}
                                    // height={500}
                                    alt=""
                                    className="w-[100%]  object-cover aspect-video max-h-36 border rounded-md dark:border-neutral-700 shadow-sm"
                                />
                                {/* <video
                                    width="320"
                                    height="240"
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    loop
                                    preload="auto">
                                    <source
                                        src="../../public/MAROONED.mp4"
                                        type="video/mp4"
                                    />
                                </video> */}
                            </SheetTitle>
                            <SheetDescription className="space-y-4 border border-neutral-200 dark:border-neutral-700 shadow-sm my-2 rounded-lg p-2 dark:bg-neutral-800">
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
                            </SheetDescription>
                        </SheetHeader>
                        <SheetFooter className="mt-4 text-xs text-center dark:text-neutral-500">
                            2024 Shantanu, Inc. All rights reserved.
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <div className="flex item-center justify-between space-x-1 border border-neutral-200 dark:border-neutral-800 p-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                    <ThemeSwitch />
                    <Link
                        prefetch={true}
                        href="https://drive.google.com/uc?export=download&id=173kc0AW6miCrWOsqeYN3ad348otgyA13">
                        <Button
                            disabled={isDownloading}
                            onClick={handleView}
                            size="icon"
                            className="rounded-full shadow-lg border border-neutral-200 bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-neutral-50 dark:text-neutral-900
                        ">
                            {isDownloading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <ArrowDownCircle
                                    className="h-5 w-5 text-neutral dark:text-neutral-900"
                                    size={20}
                                    strokeWidth={1.5}
                                />
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
            className={`flex items-center md:px-4 px-4 py-3 cursor-pointer rounded-md transition-all duration-75 animate-out ${
                isActive
                    ? "bg-neutral-800 dark:bg-neutral-200 shadow-lg dark:text-neutral-900 text-neutral-50"
                    : "hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:text-neutral-200"
            }`}
            onClick={handleClick}>
            <span className="mr-2 hidden md:inline-block">{title}</span>
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
            <span className="ml-2 inline-block md:hidden">{title}</span>
        </span>
    );
});
