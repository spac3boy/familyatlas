"use client"

import { ScanSearch } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useExploreActions, useExploreState } from "@/state"

export function EvidenceModeBoundary({ children }: Readonly<{ children: React.ReactNode }>) {
  const { evidenceMode } = useExploreState()
  return (
    <div data-evidence-mode={evidenceMode} className="min-h-svh">
      {children}
    </div>
  )
}

export function EvidenceModeToggle({
  compact = false,
  className,
}: Readonly<{ compact?: boolean; className?: string }>) {
  const { evidenceMode } = useExploreState()
  const { setEvidenceMode } = useExploreActions()
  const enabled = evidenceMode === "evidence"

  return (
    <Button
      type="button"
      variant={enabled ? "secondary" : "ghost"}
      size={compact ? "icon" : "sm"}
      aria-pressed={enabled}
      aria-label={`${enabled ? "Hide" : "Show"} Evidence Mode`}
      title={`${enabled ? "Hide" : "Show"} confidence and source context`}
      onClick={() => setEvidenceMode(enabled ? "overview" : "evidence")}
      className={cn(!compact && "gap-2 text-muted-foreground", className)}
    >
      <ScanSearch aria-hidden="true" />
      {!compact && <span>{enabled ? "Evidence on" : "Evidence"}</span>}
    </Button>
  )
}
