import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm ring-offset-neutral-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500  disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 focus-visible:outline-none",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
