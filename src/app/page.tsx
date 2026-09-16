import Link from "next/link"
import { ArrowDownRight } from "lucide-react"

import heroMountains from "@/assets/family-atlas-hero-mountains.jpg"
import { EditorialHero } from "@/components/layout/editorial-hero"
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
      <EditorialHero
        image={heroMountains}
        eyebrow="Our family, gathered from records and recollections"
        title="Family Atlas"
        description="Meet the people who came before us, the places they called home, and the stories we're still piecing together."
        size="home"
        aside={
          <>
            <p className="max-w-sm text-sm leading-6">
              Some details are well documented. Others come from family memory or remain open
              questions. We show the difference.
            </p>
            <Link
              href="#family-explore"
              className={cn(buttonVariants({ size: "lg" }), "mt-7")}
            >
              Explore our family
              <ArrowDownRight aria-hidden="true" />
            </Link>
          </>
        }
      />

      <ExploreVisualizations />

      <section
        id="people-place-time"
        aria-labelledby="collection-heading"
        className="border-y bg-surface-subtle"
      >
        <div className="page-shell py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="editorial-label mb-4">Explore our history</p>
            <h2 id="collection-heading" className="editorial-heading">
              Follow our family through people, places, and time.
            </h2>
          </div>

          <div className="mt-12 grid border-t lg:mt-16 lg:grid-cols-3 lg:divide-x">
            <article className="border-b py-8 lg:border-b-0 lg:pr-12">
              <p className="editorial-label">01 / People</p>
              <h3 className="mt-8 text-2xl font-[560] tracking-[-0.035em]">
                {michael.canonicalName}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Start with Michael, then follow the parents, grandparents, siblings, and cousins
                connected to him.
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
              <h3 className="mt-8 text-2xl font-[560] tracking-[-0.035em]">Places our family knew</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Visit the towns, parishes, regions, and countries connected to our family&apos;s
                records and recollections.
              </p>
              <ul className="mt-10 divide-y border-t" aria-label="Featured family places">
                {featuredPlaces.map((place) => (
                  <li key={place.id} className="py-3">
                    <Link href={`/places/${place.id}`} className="text-sm font-medium underline-offset-4 hover:text-primary hover:underline">
                      {place.modernName}
                    </Link>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {placeRegion(place)}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="py-8 lg:pl-12">
              <p className="editorial-label">03 / Time</p>
              <h3 className="mt-8 text-2xl font-[560] tracking-[-0.035em]">Lives across time</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                See when lives overlapped, while approximate and conflicting dates remain clearly
                marked.
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
                        Birth{place ? ` · ${place.modernName}` : ""}
                        <span data-evidence-detail="verified"> · ● Verified</span>
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
          Family Atlas brings together family knowledge and historical records. When a detail is
          uncertain or still unknown, we say so.
        </p>
      </footer>
    </>
  )
}
