import { familyGraph } from "@/data/family-graph"
import { buildResearchOverview } from "@/lib/genealogy/research-overview"

export const familyResearchOverview = buildResearchOverview(familyGraph)
