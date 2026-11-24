"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toast } from "@heroui/react"

export const ThemeProvider = ({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
    return (
        <NextThemesProvider {...props}>
            <Toast.Provider placement="top end" />
            {children}
        </NextThemesProvider>
    )
}
