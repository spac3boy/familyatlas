import { ArrowRight, MapPin, MoveRight } from "lucide-react"
import Link from "next/link"

import { ConfidenceMark } from "@/components/research/confidence-mark"
import type { PlaceIndexGroup } from "@/lib/genealogy/place-profile"

export function PlaceDirectory({ groups }: Readonly<{ groups: readonly PlaceIndexGroup[] }>) {
  const placeCount = groups.reduce((total, group) => total + group.places.length, 0)

  return (
    <div className="page-shell py-16 sm:py-20 lg:py-24">
      <header className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="editorial-label">Canonical family geography</p>
          <h1 className="editorial-display mt-5">Places</h1>
        </div>
        <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
          Locations appear only at the precision supported by the record. A parish is not displayed
          as a town, and an unknown route remains unknown.
        </p>
      </header>

      <div className="mt-14 flex items-center justify-between gap-4 border-y py-4 text-xs text-muted-foreground sm:mt-18">
        <p>
          <span className="font-semibold text-foreground tabular-nums">{placeCount}</span>{" "}
          canonical {placeCount === 1 ? "place" : "places"}
        </p>
        <p className="hidden sm:block">Grouped by the narrowest represented regional context.</p>
      </div>

      <div>
        {groups.map((group, groupIndex) => (
          <section
            key={group.label}
            aria-labelledby={`place-group-${groupIndex}`}
            className="grid gap-6 border-b py-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12"
          >
            <div>
              <p className="editorial-label">{String(groupIndex + 1).padStart(2, "0")}</p>
              <h2 id={`place-group-${groupIndex}`} className="mt-3 text-lg font-[560] tracking-[-0.02em]">
                {group.label}
              </h2>
            </div>

            <ul className="border-t">
              {group.places.map((profile) => {
                const { place, context, dateRange } = profile
                return (
                  <li key={place.id} className="border-b last:border-b-0">
                    <Link
                      href={`/places/${place.id}`}
                      className="group grid gap-4 py-5 transition-colors hover:bg-accent sm:px-3 lg:grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,0.85fr)_minmax(9rem,0.7fr)_auto] lg:items-center lg:gap-6"
                    >
                      <span className="min-w-0">
                        <span className="flex items-start gap-2 font-[560] group-hover:text-primary">
                          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{place.modernName}</span>
                        </span>
                        {context && (
                          <span className="mt-1 block pl-6 text-xs leading-5 text-muted-foreground">
                            {context}
                          </span>
                        )}
                      </span>

                      <span className="text-xs leading-5 text-muted-foreground">
                        <span className="block text-foreground">{profile.precisionLabel}</span>
                        <span className="mt-1 block">{dateRange.label}</span>
                        {dateRange.undatedEventCount > 0 && (
                          <span className="block">
                            plus {dateRange.undatedEventCount} undated {dateRange.undatedEventCount === 1 ? "record" : "records"}
                          </span>
                        )}
                      </span>

                      <span className="text-xs leading-5 text-muted-foreground">
                        <span className="block">
                          {profile.people.length} {profile.people.length === 1 ? "person" : "people"}
                        </span>
                        <span className="mt-1 block">
                          {profile.events.length} {profile.events.length === 1 ? "event" : "events"}
                        </span>
                        {profile.movements.length > 0 && (
                          <span className="mt-1 inline-flex items-center gap-1.5">
                            <MoveRight aria-hidden="true" className="size-3" />
                            {profile.movements.length} {profile.movements.length === 1 ? "movement" : "movements"}
                          </span>
                        )}
                      </span>

                      <span className="flex items-center justify-between gap-3 lg:justify-end">
                        <ConfidenceMark confidence={place.confidence} />
                        <ArrowRight aria-hidden="true" className="size-4 text-primary" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
