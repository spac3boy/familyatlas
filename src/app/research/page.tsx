import { ResearchOverview } from "@/components/research/research-overview"
import { familyResearchOverview } from "@/data"

export default function ResearchPage() {
  return <ResearchOverview model={familyResearchOverview} />
}
