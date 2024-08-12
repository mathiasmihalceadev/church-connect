import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva} from "class-variance-authority";

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
    {
        variants: {
            variant: {
                default: "bg-royal-blue text-lynx-white drop-shadow-button",
                destructive:
                    "bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
                outline:
                    "border text-hyacinth-arbor border-input-gray hover:bg-background-gray",
                secondary:
                    "bg-lila-purple text-dark-slate drop-shadow-button",
                ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                link: "text-sm text-royal-blue hover:underline",
            },
            size: {
                default: "px-4 py-4",
                sm: "py-2 px-6",
                md: "px-3 py-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
                xs: "p-0",
                select: "px-2 py-2"
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        (<Comp
            className={cn(buttonVariants({variant, size, className}))}
            ref={ref}
            {...props} />)
    );
})
Button.displayName = "Button"

export {Button, buttonVariants}
