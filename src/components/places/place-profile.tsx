import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react"
import Link from "next/link"

import { PlaceJourneyButton } from "@/components/places/place-journey-button"
import { Badge } from "@/components/ui/badge"
import { ConfidenceMark } from "@/components/research/confidence-mark"
import { formatPersonDetailDate } from "@/lib/genealogy/person-detail"
import { formatRecordedSurnameLabel } from "@/lib/genealogy/people-directory"
import type {
  PlaceProfileEvent,
  PlaceProfileModel,
  PlaceProfileMovement,
} from "@/lib/genealogy/place-profile"
import type { Place, Source } from "@/types"

const sections = [
  ["place-overview", "Overview"],
  ["place-people", "People & surnames"],
  ["place-events", "Events"],
  ["place-movements", "Movements"],
  ["place-sources", "Sources"],
] as const

const sentenceCase = (value: string) =>
  value
    .split("-")
    .map((word, index) =>
      (index === 0 ? word.charAt(0).toUpperCase() : word.charAt(0)) + word.slice(1),
    )
    .join(" ")

function ProfileSection({
  id,
  number,
  title,
  children,
}: Readonly<{
  id: string
  number: string
  title: string
  children: React.ReactNode
}>) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t py-12 sm:py-16">
      <div className="grid gap-7 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="editorial-label">{number}</p>
          <h2 id={`${id}-heading`} className="mt-3 text-xl font-[560] tracking-[-0.025em]">
            {title}
          </h2>
        </div>
        <div className="min-w-0 max-w-3xl">{children}</div>
      </div>
    </section>
  )
}

function PlaceLink({ place }: Readonly<{ place: Place }>) {
  return (
    <Link
      href={`/places/${place.id}`}
      className="font-medium underline-offset-4 hover:text-primary hover:underline"
    >
      {place.modernName}
    </Link>
  )
}

function EventLocation({ entry }: Readonly<{ entry: PlaceProfileEvent }>) {
  if (entry.scope === "direct") {
    return (
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {entry.roles.map(sentenceCase).join(" · ")}
      </p>
    )
  }

  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      Within this geography at{" "}
      {entry.matchedPlaces.map((place, index) => (
        <span key={place.id}>
          {index > 0 ? ", " : ""}
          <PlaceLink place={place} />
        </span>
      ))}
      {entry.roles.length > 0 ? ` · ${entry.roles.map(sentenceCase).join(" · ")}` : ""}
    </p>
  )
}

function PersonLinks({ people }: Readonly<{ people: PlaceProfileEvent["people"] }>) {
  if (people.length === 0) return null
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      {people.map((person, index) => (
        <span key={person.id}>
          {index > 0 ? ", " : ""}
          <Link
            href={`/people/${person.id}`}
            className="text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {person.canonicalName}
          </Link>
        </span>
      ))}
    </p>
  )
}

function SourceReferenceLinks({ entry }: Readonly<{ entry: PlaceProfileEvent }>) {
  const sourceIds = [...new Set(entry.event.sourceRefs.map(({ sourceId }) => sourceId))]
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] leading-5 text-muted-foreground">
      {sourceIds.map((sourceId) => (
        <Link key={sourceId} href={`#${sourceId}`} className="break-all hover:text-primary hover:underline">
          {sourceId}
        </Link>
      ))}
    </div>
  )
}

function MovementEndpointList({
  label,
  places,
}: Readonly<{ label: string; places: readonly Place[] }>) {
  return (
    <div>
      <dt className="editorial-label">{label}</dt>
      <dd className="mt-2 space-y-1 text-sm leading-6">
        {places.map((place) => (
          <div key={place.id}>
            <PlaceLink place={place} />
          </div>
        ))}
      </dd>
    </div>
  )
}

function MovementEntry({ movement }: Readonly<{ movement: PlaceProfileMovement }>) {
  const unknownRoute = movement.classification === "separate-known-locations-route-unknown"
  return (
    <li className="py-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-primary tabular-nums">
            {movement.dateLabel ?? "Date not established"}
          </p>
          <h3 className="mt-2 font-[560]">{movement.label}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{movement.classificationLabel}</Badge>
          <ConfidenceMark confidence={movement.event.confidence} suffix="claim" />
        </div>
      </div>

      <dl className="mt-5 grid gap-5 border-l pl-5 sm:grid-cols-2">
        <MovementEndpointList label="From" places={movement.fromPlaces} />
        <MovementEndpointList label="To" places={movement.toPlaces} />
      </dl>

      {unknownRoute && (
        <p className="mt-5 border-l-2 border-muted-foreground pl-4 text-xs leading-5 text-muted-foreground">
          These are supported locations at different dates. No precise route or discrete move is
          drawn or asserted.
        </p>
      )}
      {movement.event.description && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{movement.event.description}</p>
      )}
      <PersonLinks people={movement.people} />
      <p className="mt-3 text-[0.6875rem] leading-5 text-muted-foreground">
        <Link href={`#${movement.event.id}`} className="hover:text-primary hover:underline">
          View supporting event
        </Link>
      </p>
    </li>
  )
}

function sourceDate(source: Source): string | undefined {
  return source.date ? formatPersonDetailDate(source.date) ?? source.date.originalText : undefined
}

export function PlaceProfile({ profile }: Readonly<{ profile: PlaceProfileModel }>) {
  const { place } = profile
  const eventTitleById = new Map(profile.events.map(({ event, title }) => [event.id, title]))
  const administrativeFields = [
    ["Settlement", place.settlement],
    ["Parish / county", place.parishCounty],
    ["State / province / region", place.stateProvinceRegion],
    ["Country", place.country],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))
  const recordedNames = [
    ...place.historicalNames.map((name) => ({ name, kind: "Historical name" })),
    ...(place.alternateNames ?? []).map((name) => ({ name, kind: "Alternate name" })),
  ]

  return (
    <article>
      <header className="page-shell pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-20">
        <Link
          href="/places"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All places
        </Link>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <p className="editorial-label">{profile.precisionLabel}</p>
            <h1 className="editorial-display mt-5 max-w-4xl">{place.modernName}</h1>
            {profile.context && (
              <p className="mt-5 text-lg leading-7 text-muted-foreground">{profile.context}</p>
            )}
          </div>
          <div className="border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
            <div className="flex flex-wrap gap-2">
              <ConfidenceMark confidence={place.confidence} suffix="place" />
              <Badge variant="outline">{profile.precisionLabel}</Badge>
            </div>
            <p className="mt-4 break-all text-xs leading-5 text-muted-foreground">{place.id}</p>
            <div className="mt-5">
              <PlaceJourneyButton placeId={place.id} />
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Place profile sections" className="border-y bg-card">
        <div className="page-shell flex flex-wrap gap-x-6 gap-y-1 py-3">
          {sections.map(([id, label]) => (
            <Link key={id} href={`#${id}`} className="py-2 text-xs font-semibold text-muted-foreground hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="page-shell">
        <ProfileSection id="place-overview" number="01" title="Overview">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="editorial-label">Recorded geography</p>
              {administrativeFields.length > 0 ? (
                <dl className="mt-4 divide-y border-t text-sm">
                  {administrativeFields.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 py-3">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  No modern administrative equivalent is established in the canonical record.
                </p>
              )}
            </div>

            <div>
              <p className="editorial-label">Record span</p>
              <p className="mt-4 font-[560]">{profile.dateRange.label}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {profile.dateRange.datedEventCount} dated {profile.dateRange.datedEventCount === 1 ? "event" : "events"}
                {profile.dateRange.undatedEventCount > 0
                  ? ` · ${profile.dateRange.undatedEventCount} with dates not established`
                  : ""}
              </p>
              <div className="mt-6 flex gap-6 text-xs leading-5 text-muted-foreground">
                <span><strong className="text-foreground tabular-nums">{profile.people.length}</strong> people</span>
                <span><strong className="text-foreground tabular-nums">{profile.events.length}</strong> events</span>
                <span><strong className="text-foreground tabular-nums">{profile.sources.length}</strong> sources</span>
              </div>
            </div>
          </div>

          {(profile.parentPlace || profile.childPlaces.length > 0) && (
            <div className="mt-9 border-t pt-7">
              <p className="editorial-label">Canonical place hierarchy</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {profile.parentPlace && (
                  <div>
                    <p className="text-xs text-muted-foreground">Contained by</p>
                    <p className="mt-1 text-sm"><PlaceLink place={profile.parentPlace} /></p>
                  </div>
                )}
                {profile.childPlaces.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Contains represented places</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {profile.childPlaces.map((child) => <li key={child.id}><PlaceLink place={child} /></li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {recordedNames.length > 0 && (
            <div className="mt-9 border-t pt-7">
              <p className="editorial-label">Recorded names</p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                {recordedNames.map(({ name, kind }) => (
                  <li key={`${kind}-${name}`}><span className="font-medium">{name}</span><span className="text-muted-foreground"> · {kind}</span></li>
                ))}
              </ul>
            </div>
          )}

          {place.notes && place.notes.length > 0 && (
            <div className="mt-9 border-l-2 border-primary/35 pl-5">
              <p className="editorial-label">Precision notes</p>
              {place.notes.map((note) => <p key={note} className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>)}
            </div>
          )}
        </ProfileSection>

        <ProfileSection id="place-people" number="02" title="People & surnames">
          {profile.people.length > 0 ? (
            <ul className="divide-y border-t">
              {profile.people.map(({ person, surnames, associations }) => (
                <li key={person.id} className="py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link href={`/people/${person.id}`} className="inline-flex items-center gap-2 font-[560] hover:text-primary hover:underline">
                      <Users aria-hidden="true" className="size-4 text-primary" />
                      {person.canonicalName}
                    </Link>
                    <ConfidenceMark confidence={person.confidence} />
                  </div>
                  {surnames.length > 0 && (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Recorded surname forms: {surnames.map(formatRecordedSurnameLabel).join(", ")}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] leading-5 text-muted-foreground">
                    {associations.map(({ eventId, title }) => (
                      <Link key={eventId} href={`#${eventId}`} className="hover:text-primary hover:underline">
                        {title}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">No accepted people are linked to this place.</p>
          )}

          {profile.surnames.length > 0 && (
            <div className="mt-10 border-t pt-7">
              <p className="editorial-label">Surname index</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                These are recorded canonical or alternate name forms, not inferred birth surnames.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {profile.surnames.map((surname) => (
                  <li key={surname.value}>
                    <Badge variant="outline">
                      {surname.displayLabel} · {surname.people.length}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ProfileSection>

        <ProfileSection id="place-events" number="03" title="Events">
          <p className="mb-6 text-xs leading-5 text-muted-foreground">
            {profile.directEventCount} directly linked {profile.directEventCount === 1 ? "event" : "events"}
            {profile.events.length > profile.directEventCount
              ? ` · ${profile.events.length - profile.directEventCount} within represented child places`
              : ""}
          </p>
          <ol className="border-t">
            {profile.events.map((entry) => (
              <li key={entry.event.id} id={entry.event.id} className="scroll-mt-24 grid gap-3 border-b py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-7">
                <div>
                  <p className="text-sm font-semibold text-primary tabular-nums">
                    {entry.dateLabel ?? "Date not established"}
                  </p>
                  {!entry.dateLabel && entry.event.date.originalText && (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.event.date.originalText}</p>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-[560]">{entry.title}</h3>
                    <ConfidenceMark confidence={entry.event.confidence} />
                  </div>
                  <EventLocation entry={entry} />
                  <PersonLinks people={entry.people} />
                  {entry.event.description && (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.event.description}</p>
                  )}
                  <SourceReferenceLinks entry={entry} />
                </div>
              </li>
            ))}
          </ol>
        </ProfileSection>

        <ProfileSection id="place-movements" number="04" title="Movements">
          {profile.movements.length > 0 ? (
            <>
              <p className="mb-5 text-sm leading-6 text-muted-foreground">
                Movement classifications come directly from the canonical evidence model. Endpoint
                observations do not become a precise route.
              </p>
              <ol className="divide-y border-t">
                {profile.movements.map((movement) => (
                  <MovementEntry key={movement.event.id} movement={movement} />
                ))}
              </ol>
            </>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No movement event uses this place as a supported endpoint.
            </p>
          )}
        </ProfileSection>

        <ProfileSection id="place-sources" number="05" title="Sources">
          <ol className="divide-y border-t">
            {profile.sources.map(({ source, supportsPlace, eventIds }) => (
              <li key={source.id} id={source.id} className="scroll-mt-24 py-6">
                <div className="flex items-start gap-3">
                  <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-[560] leading-6">{source.title}</h3>
                    <p className="mt-1 break-all text-[0.6875rem] leading-5 text-muted-foreground">{source.id}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{sentenceCase(source.category)}</Badge>
                      <Badge variant="neutral">{sentenceCase(source.evidenceClass)}</Badge>
                      <Badge variant="neutral">{sentenceCase(source.inspectionStatus)}</Badge>
                    </div>
                    {(sourceDate(source) || source.repository || source.jurisdiction) && (
                      <p className="mt-3 text-xs leading-5 text-muted-foreground">
                        {[sourceDate(source), source.repository, source.jurisdiction].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
                      {supportsPlace && <span>Supports place record</span>}
                      {eventIds.map((eventId) => (
                        <Link key={eventId} href={`#${eventId}`} className="hover:text-primary hover:underline">
                          {eventTitleById.get(eventId) ?? "Supporting event"}
                        </Link>
                      ))}
                    </div>
                    {source.urls.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {source.urls.map((url, index) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                            Open source{source.urls.length > 1 ? ` ${index + 1}` : ""}
                            <ExternalLink aria-hidden="true" className="size-3.5" />
                          </a>
                        ))}
                      </div>
                    )}
                    {source.urls.length === 0 && source.citationHandles.length > 0 && (
                      <div className="mt-3 text-xs leading-5 text-muted-foreground">
                        {source.citationHandles.map((handle) => (
                          <p key={handle}>
                            Archive citation handle:{" "}
                            <span className="break-all font-mono">{handle}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {source.reliabilityNotes && source.reliabilityNotes.length > 0 && (
                      <div className="mt-4 text-xs leading-5 text-muted-foreground">
                        {source.reliabilityNotes.map((note) => <p key={note}>{note}</p>)}
                      </div>
                    )}
                    {source.contradictionNotes && source.contradictionNotes.length > 0 && (
                      <div className="mt-4 border-l border-confidence-unresolved-foreground pl-3 text-xs leading-5 text-muted-foreground">
                        {source.contradictionNotes.map((note) => <p key={note}>{note}</p>)}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </ProfileSection>
      </div>

      <footer className="border-t bg-surface-subtle">
        <div className="page-shell flex flex-wrap items-center justify-between gap-5 py-8">
          <p className="max-w-xl text-xs leading-5 text-muted-foreground">
            Geographic precision, uncertainty, and movement classification remain attached to the
            canonical evidence represented above.
          </p>
          <Link href="/places" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
            Browse all places
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </footer>
    </article>
  )
}
