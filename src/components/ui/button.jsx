import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-primary/90 active:scale-95",
        primary:
          "bg-primary text-white shadow hover:bg-primary/90 active:scale-95",
        secondary:
          "bg-secondary text-white shadow hover:bg-secondary/90 active:scale-95",
        palmPrimary:
          "relative overflow-hidden isolate text-white border-2 border-primary shadow-md active:scale-95 before:content-[''] before:absolute before:inset-0 before:z-[-2] before:transition-all before:duration-300 before:bg-primary after:content-[''] after:absolute after:inset-0 after:z-[-1] after:translate-y-full after:transition-transform after:duration-500 after:ease-in-out hover:after:translate-y-0 after:bg-secondary/80",
        palmSecondary:
          "relative overflow-hidden isolate text-primary border-2 border-primary bg-transparent active:scale-95 hover:text-white before:content-[''] before:absolute before:inset-0 before:z-[-2] before:transition-all before:duration-300 before:bg-transparent after:content-[''] after:absolute after:inset-0 after:z-[-1] after:translate-y-full after:transition-transform after:duration-500 after:ease-in-out hover:after:translate-y-0 after:bg-primary",
        ghost: 
          "text-primary hover:bg-primary/10",
        light:
          "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95",
      },
      size: {
        default: "h-11 px-8 py-3 pb-2 rounded-full text-base",
        sm: "h-9 px-3 rounded-full text-xs",
        lg: "h-14 px-10 py-5 pb-4 rounded-full text-lg",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "palmPrimary",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }