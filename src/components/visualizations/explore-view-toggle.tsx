"use client"

import { Network, Rows3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useExploreActions, useExploreState } from "@/state"

const availableViews = [
  { value: "tree", label: "Tree", icon: Network },
  { value: "timeline", label: "Timeline", icon: Rows3 },
] as const

export function ExploreViewToggle() {
  const { activeView } = useExploreState()
  const { setActiveView } = useExploreActions()

  return (
    <div role="group" aria-label="Explore visualization" className="flex gap-1.5">
      {availableViews.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant={activeView === value ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={activeView === value}
          onClick={() => setActiveView(value)}
        >
          <Icon aria-hidden="true" />
          {label}
        </Button>
      ))}
    </div>
  )
}
