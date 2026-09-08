import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Confidence, EvidenceProvenanceKind } from "@/types"

export const confidencePresentation: Readonly<
  Record<Confidence, { readonly symbol: string; readonly label: string; readonly description: string }>
> = {
  verified: {
    symbol: "●",
    label: "Verified",
    description: "Established by adequate direct support; provenance shows whether that support is family confirmation, documentation, or both.",
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

export const provenancePresentation: Readonly<
  Record<EvidenceProvenanceKind, { readonly label: string; readonly description: string }>
> = {
  "family-confirmed": {
    label: "Family confirmed",
    description: "Confirmed directly by Michael from firsthand close-family knowledge.",
  },
  documented: {
    label: "Documented",
    description: "Supported by an external documentary or published source.",
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

export function ProvenanceMarks({
  kinds,
  alwaysVisible = false,
  className,
}: Readonly<{
  kinds: readonly EvidenceProvenanceKind[]
  alwaysVisible?: boolean
  className?: string
}>) {
  if (kinds.length === 0) return null
  return (
    <span
      data-evidence-detail={!alwaysVisible ? "provenance" : undefined}
      className={cn("inline-flex flex-wrap items-center gap-1.5", className)}
    >
      {kinds.map((kind) => (
        <Badge
          key={kind}
          variant={kind === "family-confirmed" ? "accent" : "outline"}
          title={provenancePresentation[kind].description}
          className="normal-case tracking-normal"
        >
          {provenancePresentation[kind].label}
        </Badge>
      ))}
    </span>
  )
}
