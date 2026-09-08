"use client"

import { FamilyTimeline } from "@/components/visualizations/family-timeline"
import { FamilyTree } from "@/components/visualizations/family-tree"
import { useExploreState } from "@/state"

export function ExploreVisualizations() {
  const { activeView } = useExploreState()
  return (
    <div id="family-explore">
      {activeView === "timeline" ? <FamilyTimeline /> : <FamilyTree />}
    </div>
  )
}
