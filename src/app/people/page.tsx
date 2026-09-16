import { Suspense } from "react"
import type { Metadata } from "next"

import heroLouisiana from "@/assets/family-atlas-hero-louisiana.jpg"
import { EditorialHero } from "@/components/layout/editorial-hero"
import { PeopleDirectory } from "@/components/people/people-directory"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPeopleDirectory } from "@/lib/genealogy/people-directory"

const people = buildPeopleDirectory(familyGraph, familyGraphQueries)

export const metadata: Metadata = {
  title: "People",
  description: "Meet the relatives and family connections gathered in Family Atlas.",
}

export default function PeoplePage() {
  return (
    <>
      <EditorialHero
        image={heroLouisiana}
        imagePosition="center 56%"
        eyebrow="Our family, one person at a time"
        title="People"
        aside={
          <p className="max-w-sm text-sm leading-6">
            Browse the relatives and family connections we&apos;ve identified so far. When a
            relationship is uncertain—or a life story is still thin—we say so.
          </p>
        }
      />

      <div className="page-shell pb-16 sm:pb-20 lg:pb-24">
        <Suspense fallback={<p className="mt-14 border-y py-8 text-sm text-muted-foreground">Loading directory filters…</p>}>
          <PeopleDirectory records={people} />
        </Suspense>
      </div>
    </>
  )
}
