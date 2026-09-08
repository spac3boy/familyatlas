"use client"

import { FamilyJourneys } from "@/components/visualizations/family-journeys"
import { FamilyTimeline } from "@/components/visualizations/family-timeline"
import { FamilyTree } from "@/components/visualizations/family-tree"
import { useExploreState } from "@/state"

export function ExploreVisualizations() {
  const { activeView } = useExploreState()
  if (activeView === "journeys") {
    return (
      <div id="family-explore">
        <FamilyJourneys />
      </div>
    )
  }
  return (
    <div id="family-explore">
      {activeView === "timeline" ? <FamilyTimeline /> : <FamilyTree />}
    </div>
  )
}
