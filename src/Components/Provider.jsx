// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({ children, ...props }) {
//     return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }


"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

const Provider = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider enableSystem={true} attribute="class">
            {children}
        </ThemeProvider>
    );
};

export default Provider;
