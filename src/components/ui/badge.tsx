import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex min-h-6 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[0.6875rem] leading-none font-semibold tracking-[0.04em] whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-muted-foreground",
        accent: "border-primary/20 bg-accent text-accent-foreground",
        verified:
          "border-primary/25 bg-confidence-verified text-confidence-verified-foreground",
        probable:
          "border-confidence-probable-foreground/20 bg-confidence-probable text-confidence-probable-foreground",
        unresolved:
          "border-confidence-unresolved-foreground/25 border-dashed bg-confidence-unresolved text-confidence-unresolved-foreground",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
)

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
