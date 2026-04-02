import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary md:text-sm",
        palm:
          "min-h-[120px] p-4 rounded-md bg-transparent border border-border focus:border-secondary focus:ring-1 focus:ring-secondary text-foreground placeholder:text-muted-foreground placeholder:text-sm",
      },
    },
    defaultVariants: {
      variant: "palm",
    },
  }
)

const Textarea = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
