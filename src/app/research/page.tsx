import type { Metadata } from "next"

import heroVenezuela from "@/assets/family-atlas-hero-venezuela.jpg"
import { EditorialHero } from "@/components/layout/editorial-hero"
import { EvidenceModeToggle } from "@/components/research/evidence-mode"
import { ResearchOverview } from "@/components/research/research-overview"
import { familyResearchOverview } from "@/data"

export const metadata: Metadata = {
  title: "Research",
  description: "Review Family Atlas methodology, evidence, coverage, and unresolved questions.",
}

export default function ResearchPage() {
  return (
    <article>
      <EditorialHero
        image={heroVenezuela}
        imagePosition="center 58%"
        overlayClassName="bg-primary/70"
        eyebrow="Evidence trail"
        title="Research"
        description="See which details are supported by records, which come from family knowledge, and which questions are still open."
        aside={
          <>
            <p className="max-w-sm text-sm leading-6">
              Turn on Evidence Mode to see where details came from and how certain we are. Family
              confirmation and historical documentation remain clearly distinguished.
            </p>
            <EvidenceModeToggle className="mt-5 bg-background text-foreground hover:bg-background/90" />
          </>
        }
      />
      <ResearchOverview model={familyResearchOverview} />
    </article>
  )
}
