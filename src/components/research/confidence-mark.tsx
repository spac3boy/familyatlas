import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Confidence } from "@/types"

export const confidencePresentation: Readonly<
  Record<Confidence, { readonly symbol: string; readonly label: string; readonly description: string }>
> = {
  verified: {
    symbol: "●",
    label: "Verified",
    description: "Supported by a strong record or secure agreement across independent evidence.",
  },
  probable: {
    symbol: "◐",
    label: "Probable",
    description: "Favored by the evidence, with a direct record or crucial identity link still missing.",
  },
  unresolved: {
    symbol: "○",
    label: "Unresolved",
    description: "The current evidence does not support a responsible conclusion.",
  },
}

export function ConfidenceMark({
  confidence,
  suffix,
  alwaysVisible = false,
  className,
}: Readonly<{
  confidence: Confidence
  suffix?: string
  alwaysVisible?: boolean
  className?: string
}>) {
  const presentation = confidencePresentation[confidence]
  return (
    <Badge
      variant={confidence}
      data-evidence-detail={!alwaysVisible && confidence === "verified" ? "verified" : undefined}
      className={cn("normal-case tracking-normal", className)}
    >
      <span aria-hidden="true">{presentation.symbol}</span>
      {presentation.label}{suffix ? ` ${suffix}` : ""}
    </Badge>
  )
}
