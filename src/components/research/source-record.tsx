import {
  ArrowLeft,
  ExternalLink,
  FileText,
  MapPin,
  UserRound,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { formatPersonDetailDate } from "@/lib/genealogy/person-detail"
import type { SourceRecordModel } from "@/lib/genealogy/source-record"

const titleCase = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export function SourceRecord({ model }: Readonly<{ model: SourceRecordModel }>) {
  const { source, people, places, events, relationships } = model
  const dateLabel = source.date ? formatPersonDetailDate(source.date) : undefined

  const metadata = [
    ["Record type", source.recordType],
    ["Category", titleCase(source.category)],
    ["Repository", source.repository],
    ["Jurisdiction", source.jurisdiction],
    ["Date", dateLabel],
    ["Evidence class", titleCase(source.evidenceClass)],
    ["Inspection", titleCase(source.inspectionStatus)],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))

  return (
    <article className="page-shell py-14 sm:py-18 lg:py-22">
      <Link href="/research#source-inventory" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary hover:underline">
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Return to source inventory
      </Link>

      <header className="mt-10 grid gap-7 border-b pb-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <p className="editorial-label">Normalized source record</p>
          <h1 className="mt-5 max-w-4xl text-3xl leading-tight font-[560] tracking-[-0.035em] sm:text-4xl">
            {source.title}
          </h1>
          <p className="mt-5 font-mono text-xs text-muted-foreground">{source.id}</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="outline">{titleCase(source.category)}</Badge>
          <Badge variant="neutral">{titleCase(source.inspectionStatus)}</Badge>
        </div>
      </header>

      <div className="grid gap-14 py-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-18">
        <div className="space-y-14">
          <section aria-labelledby="source-details-heading">
            <p className="editorial-label">01 · Description</p>
            <h2 id="source-details-heading" className="mt-3 text-xl font-[560]">Source details</h2>
            <dl className="mt-7 grid border-t sm:grid-cols-2">
              {metadata.map(([label, value]) => (
                <div key={label} className="border-b py-4 sm:pr-6">
                  <dt className="text-[0.625rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">{label}</dt>
                  <dd className="mt-1.5 text-sm leading-6">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="source-links-heading">
            <p className="editorial-label">02 · Retrieval</p>
            <h2 id="source-links-heading" className="mt-3 text-xl font-[560]">Links and citation handles</h2>
            {source.urls.length > 0 && (
              <ul className="mt-6 space-y-2">
                {source.urls.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 break-all text-sm text-primary hover:underline">
                      <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {source.citationHandles.length > 0 && (
              <div className="mt-7">
                <p className="text-xs font-medium">Preserved citation handles</p>
                <ul className="mt-3 space-y-2 font-mono text-[0.6875rem] leading-5 text-muted-foreground">
                  {source.citationHandles.map((handle) => <li key={handle}>{handle}</li>)}
                </ul>
              </div>
            )}
            {source.urls.length === 0 && source.citationHandles.length === 0 && (
              <p className="mt-5 text-sm leading-6 text-muted-foreground">No public URL or citation handle is preserved in normalized data.</p>
            )}
          </section>

          <section aria-labelledby="source-use-heading">
            <p className="editorial-label">03 · Canonical graph</p>
            <h2 id="source-use-heading" className="mt-3 text-xl font-[560]">Represented in the atlas</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              These links reflect explicit normalized references to this source; they do not expand its claims.
            </p>

            {people.length > 0 && (
              <div className="mt-7">
                <h3 className="text-sm font-semibold">People</h3>
                <ul className="mt-3 divide-y border-t">
                  {people.map((person) => (
                    <li key={person.id}>
                      <Link href={`/people/${person.id}`} className="flex min-h-11 items-center gap-2 py-2 text-sm hover:text-primary hover:underline">
                        <UserRound aria-hidden="true" className="size-3.5 text-primary" />
                        {person.canonicalName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {places.length > 0 && (
              <div className="mt-7">
                <h3 className="text-sm font-semibold">Places</h3>
                <ul className="mt-3 divide-y border-t">
                  {places.map((place) => (
                    <li key={place.id}>
                      <Link href={`/places/${place.id}`} className="flex min-h-11 items-center gap-2 py-2 text-sm hover:text-primary hover:underline">
                        <MapPin aria-hidden="true" className="size-3.5 text-primary" />
                        {place.modernName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline"><FileText aria-hidden="true" />{events.length} {events.length === 1 ? "event" : "events"}</Badge>
              <Badge variant="outline">{relationships.length} {relationships.length === 1 ? "relationship" : "relationships"}</Badge>
            </div>
          </section>
        </div>

        <aside className="border-t pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7" aria-label="Source assessment">
          <p className="editorial-label">Assessment</p>
          {source.reliabilityNotes && source.reliabilityNotes.length > 0 ? (
            <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              {source.reliabilityNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          ) : (
            <p className="mt-5 text-sm leading-6 text-muted-foreground">No additional reliability note is represented.</p>
          )}
          {source.contradictionNotes && source.contradictionNotes.length > 0 && (
            <div className="mt-8 border-l-2 border-confidence-probable-foreground/30 pl-4">
              <p className="text-xs font-semibold">Contradictions retained</p>
              {source.contradictionNotes.map((note) => <p key={note} className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>)}
            </div>
          )}
        </aside>
      </div>

      <footer className="border-t pt-6 text-xs leading-5 text-muted-foreground">
        This route reads normalized application data only. It does not search or parse research prose at runtime.
      </footer>
    </article>
  )
}
