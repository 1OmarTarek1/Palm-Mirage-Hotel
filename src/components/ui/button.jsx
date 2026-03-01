import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[#fefefe] shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-primary bg-transparent text-primary shadow-sm hover:bg-primary hover:text-white active:scale-95 transition-all duration-300",
        secondary:
          "bg-secondary text-primary shadow-sm hover:shadow-md hover:brightness-110 active:scale-95 transition-all duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8 py-3 pb-2 rounded-full text-base",
        sm: "h-9 rounded-full px-4 text-sm",
        lg: "h-14 rounded-full px-10 text-lg",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef((props, ref) => {
  const {
    className,
    variant,
    size,
    asChild = false,
    ...rest
  } = props

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...rest}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }