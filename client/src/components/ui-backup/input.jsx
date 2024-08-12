import * as React from "react"

import {cn} from "@/lib/utils"

const Input = React.forwardRef(({className, type, ...props}, ref) => {
    return (
        (<input
            type={type}
            className={cn(
                "flex font-medium tracking-tight h-11 w-full rounded-full border border-input-gray bg-white px-4 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-hyacinth-arbor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
                className
            )}
            ref={ref}
            {...props} />)
    );
})
Input.displayName = "Input"

export {Input}
