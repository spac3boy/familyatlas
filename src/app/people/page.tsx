import { PeopleDirectory } from "@/components/people/people-directory"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPeopleDirectory } from "@/lib/genealogy/people-directory"

const people = buildPeopleDirectory(familyGraph, familyGraphQueries)

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

      <PeopleDirectory records={people} />
    </div>
  )
}
