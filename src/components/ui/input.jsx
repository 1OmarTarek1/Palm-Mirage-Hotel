import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary md:text-sm",
        palm:
          "h-12 px-4 rounded-md bg-transparent border border-border focus:border-secondary focus:ring-1 focus:ring-secondary text-foreground placeholder:text-muted-foreground placeholder:text-sm",
      },
    },
    defaultVariants: {
      variant: "palm",
    },
  }
)


const Input = React.forwardRef(({ className, type, variant, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input, inputVariants }
