"use client"

import { FamilyTimeline } from "@/components/visualizations/family-timeline"
import { FamilyTree } from "@/components/visualizations/family-tree"
import { useExploreState } from "@/state"

export function ExploreVisualizations() {
  const { activeView } = useExploreState()
  return activeView === "timeline" ? <FamilyTimeline /> : <FamilyTree />
}
