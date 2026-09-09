"use client"

import dynamic from "next/dynamic"

import { FamilyTree } from "@/components/visualizations/family-tree"
import { useExploreState } from "@/state"

function VisualizationLoading() {
  return (
    <section className="border-y bg-card" aria-live="polite" aria-busy="true">
      <div className="page-shell flex min-h-[42rem] items-center py-16 sm:py-20 lg:py-24">
        <p className="text-sm text-muted-foreground">Loading this view…</p>
      </div>
    </section>
  )
}

const FamilyJourneys = dynamic(
  () => import("@/components/visualizations/family-journeys").then((module) => module.FamilyJourneys),
  { loading: VisualizationLoading },
)
const FamilyTimeline = dynamic(
  () => import("@/components/visualizations/family-timeline").then((module) => module.FamilyTimeline),
  { loading: VisualizationLoading },
)
const FamilyPatterns = dynamic(
  () => import("@/components/visualizations/family-patterns").then((module) => module.FamilyPatterns),
  { loading: VisualizationLoading },
)

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
