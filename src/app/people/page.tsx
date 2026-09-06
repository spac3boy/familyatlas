import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPersonDetailModel } from "@/lib/genealogy"

const people = familyGraph.people
  .map((person) => buildPersonDetailModel(familyGraph, person.id, familyGraphQueries))
  .filter((person) => person !== undefined)
  .sort((first, second) => first.person.canonicalName.localeCompare(second.person.canonicalName))

export default function PeoplePage() {
  return (
    <div className="page-shell py-16 sm:py-20 lg:py-24">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="editorial-label">Canonical family graph</p>
          <h1 className="editorial-display mt-5">People</h1>
        </div>
        <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
          Every profile reflects the current accepted graph. Sparse records remain sparse, and uncertain relationships stay labeled.
        </p>
      </div>

      <ul className="mt-14 border-t sm:mt-18">
        {people.map((profile) => (
          <li key={profile.person.id} className="border-b">
            <Link
              href={`/people/${profile.person.id}`}
              className="group grid gap-3 py-5 transition-colors hover:bg-accent sm:grid-cols-[minmax(0,1fr)_13rem_8rem_auto] sm:items-center sm:gap-5 sm:px-3"
            >
              <span className="font-[560] group-hover:text-primary">{profile.person.canonicalName}</span>
              <span className="text-xs leading-5 text-muted-foreground">{profile.relationshipLabel}</span>
              <span className="text-xs leading-5 text-muted-foreground tabular-nums">{profile.lifespan ?? ""}</span>
              <span className="flex items-center justify-between gap-3 sm:justify-end">
                <Badge variant={profile.confidence}>{profile.confidence}</Badge>
                <ArrowRight aria-hidden="true" className="size-4 text-primary" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
