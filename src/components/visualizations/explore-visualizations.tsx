"use client"

import { FamilyJourneys } from "@/components/visualizations/family-journeys"
import { FamilyPatterns } from "@/components/visualizations/family-patterns"
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
  if (activeView === "patterns") {
    return (
      <div id="family-explore">
        <FamilyPatterns />
      </div>
    )
  }
  return (
    <div id="family-explore">
      {activeView === "timeline" ? <FamilyTimeline /> : <FamilyTree />}
    </div>
  )
}
