import { Dispatch, SetStateAction } from "react";

export interface NavigationMenuProps {
    navItems: {
        id: number;
        label: string;
        link: string;
        icon: React.ElementType;
    }[];
};

export interface MobileDrawerProps extends NavigationMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activeSection: string | null;
    setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}
