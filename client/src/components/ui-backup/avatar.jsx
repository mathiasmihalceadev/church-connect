"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import {cn} from "@/lib/utils"

const Avatar = React.forwardRef(({className, ...props}, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn("relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full", className)}
        {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({className, ...props}, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({className, ...props}, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex text-xl h-full w-full items-center justify-center rounded-full bg-lila-purple",
            className
        )}
        {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export {Avatar, AvatarImage, AvatarFallback}