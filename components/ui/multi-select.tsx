"use client";

import * as React from "react";
import {
    CheckIcon,
    XCircle,
    ChevronDown,
    XIcon,
    Filter,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    onValueChange: (value: string[]) => void;
    defaultValue?: string[];
    placeholder?: string;
    maxCount?: number;
    modalPopover?: boolean;
    asChild?: boolean;
    className?: string;
}

export const MultiSelect = React.forwardRef<
    HTMLButtonElement,
    MultiSelectProps
>(
    (
        {
            options,
            onValueChange,
            defaultValue = [],
            placeholder = "Select options",
            maxCount = 3,
            modalPopover = false,
            asChild = false,
            className,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [bounceKey, setBounceKey] = React.useState<number>(0);

        const triggerBounce = () => setBounceKey(Date.now());

        const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (event.key === "Backspace" && !event.currentTarget.value) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
                triggerBounce();
            }
        };

        const toggleOption = (option: string) => {
            const newSelectedValues = selectedValues.includes(option)
                ? selectedValues.filter((value) => value !== option)
                : [...selectedValues, option];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
            triggerBounce();
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
            triggerBounce();
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(0, maxCount);
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
            triggerBounce();
        };

        const toggleAll = () => {
            if (selectedValues.length === options.length) {
                handleClear();
            } else {
                const allValues = options.map((option) => option.value);
                setSelectedValues(allValues);
                onValueChange(allValues);
                triggerBounce();
            }
        };

        return (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
                <PopoverTrigger asChild className="!px-2">
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            "flex w-fit p-1 rounded-md border min-h-9 h-auto items-center justify-between bg-transparent hover: [&_svg]:pointer-events-auto",
                            className
                        )}
                    >
                        <Filter className="text-muted-foreground" />
                        {selectedValues.length > 0 ? (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-wrap items-center gap-1">
                                    <AnimatePresence initial={false}>
                                        {selectedValues.slice(0, maxCount).map((value) => {
                                            const option = options.find((o) => o.value === value);
                                            const IconComponent = option?.icon;

                                            return (
                                                <motion.div
                                                    key={`${value}-${bounceKey}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Badge
                                                        className="cursor-pointer"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            toggleOption(value);
                                                        }}
                                                    >
                                                        {IconComponent && <IconComponent className="h-4 w-4 mr-1" />}
                                                        {option?.label}
                                                        <XCircle className="h-4 w-4 ml-1" />
                                                    </Badge>
                                                </motion.div>
                                            );
                                        })}
                                        {selectedValues.length > maxCount && (
                                            <motion.div
                                                key={`extra-${bounceKey}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Badge
                                                    className="cursor-pointer"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        clearExtraOptions();
                                                    }}
                                                >
                                                    {`+${selectedValues.length - maxCount} more`}
                                                    <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
                                                </Badge>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex items-center justify-between">
                                    <XIcon
                                        className="h-4 mx-2 cursor-pointer text-muted-foreground"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleClear();
                                        }}
                                    />
                                    <Separator orientation="vertical" className="flex min-h-6 h-full" />
                                    <ChevronDown className="h-4 ml-2 cursor-pointer text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full mx-auto">
                                <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
                                <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start" onEscapeKeyDown={() => setIsPopoverOpen(false)}>
                    <Command>
                        <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <CommandItem onSelect={toggleAll} className="cursor-pointer">
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedValues.length === options.length
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </div>
                                        <span>(Select All)</span>
                                    </CommandItem>
                                </motion.div>

                                <AnimatePresence>
                                    {options.map((option, index) => {
                                        const isSelected = selectedValues.includes(option.value);
                                        return (
                                            <motion.div
                                                key={option.value}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <CommandItem
                                                    onSelect={() => toggleOption(option.value)}
                                                    className="cursor-pointer"
                                                >
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            isSelected
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </div>
                                                    {option.icon && (
                                                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <span>{option.label}</span>
                                                </CommandItem>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between">
                                    {selectedValues.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CommandItem onSelect={handleClear} className="flex-1 justify-center cursor-pointer">
                                                Clear
                                            </CommandItem>
                                        </motion.div>
                                    )}
                                    <Separator orientation="vertical" className="flex min-h-6 h-full mx-1" />
                                    <CommandItem
                                        onSelect={() => setIsPopoverOpen(false)}
                                        className="flex-1 justify-center cursor-pointer max-w-full"
                                    >
                                        Close
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }
);

MultiSelect.displayName = "MultiSelect";
