"use client";

import {
    Home,
    User,
    FolderGit2,
    BadgeInfo,
    LampDesk,
    Puzzle,
    FolderCode,
} from "lucide-react";
import { DropdownNavigation } from "./ui/navigation-menu/navigation-menu";

const Navbar = () => {
    const NAV_ITEMS = [
        { id: 1, label: "Home", link: "#home", icon: Home },
        { id: 2, label: "About", link: "#about", icon: BadgeInfo },
        { id: 3, label: "Experience", link: "#experience", icon: LampDesk },
        { id: 4, label: "Skills", link: "#skills", icon: Puzzle },
        { id: 5, label: "Social", link: "#social", icon: FolderCode },
        { id: 6, label: "Projects", link: "#projects", icon: FolderGit2 },
        { id: 7, label: "Contact", link: "#contact", icon: User },
    ];

    return <DropdownNavigation navItems={NAV_ITEMS} />;
};

export default Navbar;
