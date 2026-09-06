import Link from "next/link"
import { ArrowDownRight } from "lucide-react"

import { ExploreVisualizations } from "@/components/visualizations/explore-visualizations"
import { buttonVariants } from "@/components/ui/button-variants"
import { familyGraph, familyGraphQueries } from "@/data"
import { cn } from "@/lib/utils"
import type { Event, EventId, ExactHistoricalDate, PersonId, Place, PlaceId } from "@/types"

const michael = requiredPerson("person-michael-buquet")
const michaelParents = familyGraphQueries.parents(michael.id).map(({ person }) => person)

const featuredPlaces = [
  requiredPlace("place-us-la-carencro"),
  requiredPlace("place-us-la-dulac"),
  requiredPlace("place-us-mn-spring-grove"),
]

const featuredEvents = [
  requiredExactEvent("event-verna-bakke-birth"),
  requiredExactEvent("event-rita-leblanc-birth"),
]

function requiredPerson(id: PersonId) {
  const person = familyGraphQueries.personById(id)
  if (!person) throw new Error(`Canonical person not found: ${id}`)
  return person
}

function requiredPlace(id: PlaceId): Place {
  const place = familyGraph.places.find((candidate) => candidate.id === id)
  if (!place) throw new Error(`Canonical place not found: ${id}`)
  return place
}

interface ExactEventPreview {
  readonly event: Event
  readonly date: ExactHistoricalDate
}

function requiredExactEvent(id: EventId): ExactEventPreview {
  const event: Event | undefined = familyGraph.events.find((candidate) => candidate.id === id)
  if (!event) throw new Error(`Canonical event not found: ${id}`)
  if (event.date.kind !== "exact") {
    throw new Error(`Home-page event must have an exact canonical date: ${id}`)
  }
  return { event, date: event.date }
}

function placeRegion(place: Place): string {
  return [place.parishCounty, place.stateProvinceRegion].filter(Boolean).join(", ")
}

function formatExactDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

export default function Home() {
  return (
    <>
      <section className="page-shell pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-32">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:gap-20">
          <div>
            <p className="editorial-label mb-6">A source-grounded family history</p>
            <h1 className="editorial-display max-w-4xl">Family Atlas</h1>
            <p className="mt-7 max-w-xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
              Explore a family across people, place, and time.
            </p>
          </div>

          <div className="border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Follow relationships, locations, and historical records while keeping uncertainty
              and evidence in view.
            </p>
            <Link
              href="#family-tree"
              className={cn(buttonVariants({ size: "lg" }), "mt-7")}
            >
              Explore the family
              <ArrowDownRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <ExploreVisualizations />

      <section
        id="people-place-time"
        aria-labelledby="collection-heading"
        className="border-y bg-surface-subtle"
      >
        <div className="page-shell py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="editorial-label mb-4">The collection</p>
            <h2 id="collection-heading" className="editorial-heading">
              A family, read three ways.
            </h2>
          </div>

          <div className="mt-12 grid border-t lg:mt-16 lg:grid-cols-3 lg:divide-x">
            <article className="border-b py-8 lg:border-b-0 lg:pr-12">
              <p className="editorial-label">01 / People</p>
              <h3 className="mt-8 text-2xl font-[560] tracking-[-0.035em]">
                {michael.canonicalName}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Begin with the reference person, then follow the relationships preserved in the
                family graph.
              </p>
              <dl className="mt-10 border-t pt-4">
                <dt className="editorial-label">Parents</dt>
                <dd className="mt-3 space-y-1 text-sm leading-6">
                  {michaelParents.map((parent) => (
                    <span key={parent.id} className="block">
                      {parent.canonicalName}
                    </span>
                  ))}
                </dd>
              </dl>
            </article>

            <article className="border-b py-8 lg:border-b-0 lg:px-12">
              <p className="editorial-label">02 / Places</p>
              <h3 className="mt-8 text-2xl font-[560] tracking-[-0.035em]">Known ground</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Read each location at the level of precision supported by the archive.
              </p>
              <ul className="mt-10 divide-y border-t" aria-label="Featured family places">
                {featuredPlaces.map((place) => (
                  <li key={place.id} className="py-3">
                    <p className="text-sm font-medium">{place.modernName}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {placeRegion(place)}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="py-8 lg:pl-12">
              <p className="editorial-label">03 / Time</p>
              <h3 className="mt-8 text-2xl font-[560] tracking-[-0.035em]">Lives in context</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Move through events without turning historical uncertainty into false precision.
              </p>
              <ol className="mt-10 divide-y border-t" aria-label="Featured verified events">
                {featuredEvents.map(({ event, date }) => {
                  const person = requiredPerson(event.personIds[0])
                  const place = event.placeId ? requiredPlace(event.placeId) : null

                  return (
                    <li key={event.id} className="py-3">
                      <p className="text-xs font-semibold tracking-[0.06em] text-primary tabular-nums uppercase">
                        {formatExactDate(date.value)}
                      </p>
                      <p className="mt-2 text-sm font-medium">{person.canonicalName}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Birth{place ? ` · ${place.modernName}` : ""} · Verified
                      </p>
                    </li>
                  )
                })}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <footer className="page-shell py-10 sm:py-12">
        <p className="max-w-xl text-xs leading-5 text-muted-foreground">
          Family Atlas presents normalized, source-linked research. Unknown and unresolved details
          remain visible rather than being filled for completeness.
        </p>
      </footer>
    </>
  )
}
