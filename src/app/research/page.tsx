import type { Metadata } from "next"

import { ResearchOverview } from "@/components/research/research-overview"
import { familyResearchOverview } from "@/data"

export const metadata: Metadata = {
  title: "Research",
  description: "Review Family Atlas methodology, evidence, coverage, and unresolved questions.",
}

export default function ResearchPage() {
  return <ResearchOverview model={familyResearchOverview} />
}
