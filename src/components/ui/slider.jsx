import React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef((props, ref) => {
  const { className, value, defaultValue, ...rest } = props
  const thumbs = value ?? defaultValue ?? [0]

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex w-full cursor-pointer touch-none select-none items-center",
        className
      )}
      {...rest}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {thumbs.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 cursor-pointer rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }