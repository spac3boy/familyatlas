"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

type ButtonProps = Omit<
  React.ComponentProps<typeof ButtonPrimitive>,
  "className"
> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
