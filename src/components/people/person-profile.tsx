import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  MapPin,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ConfidenceMark } from "@/components/research/confidence-mark"
import type {
  PersonProfileModel,
  PersonProfilePlace,
  PersonProfileTimelineEntry,
} from "@/lib/genealogy/person-profile"
import { formatPersonDetailDate } from "@/lib/genealogy/person-detail"
import type {
  Confidence,
  PersonId,
  Place,
  Relationship,
  SourceReference,
} from "@/types"

const sectionNavigation = [
  ["story", "Story"],
  ["family", "Family"],
  ["life-in-places", "Life in places"],
  ["timeline", "Timeline"],
  ["records-evidence", "Records & evidence"],
  ["open-research", "Open research questions"],
] as const

const confidenceLabel = (confidence: Confidence) =>
  confidence.charAt(0).toUpperCase() + confidence.slice(1)

const sentenceCase = (value: string) =>
  value
    .split("-")
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() : word.charAt(0)) + word.slice(1))
    .join(" ")

function placeContext(place: Place) {
  return [place.settlement, place.parishCounty, place.stateProvinceRegion, place.country]
    .filter((part, index, parts): part is string => Boolean(part) && parts.indexOf(part) === index)
    .filter((part) => part !== place.modernName)
    .join(", ")
}

function sourceLinks(references: readonly SourceReference[]) {
  return [...new Set(references.map(({ sourceId }) => sourceId))]
}

function RelationshipSources({ references }: Readonly<{ references: readonly SourceReference[] }>) {
  const links = sourceLinks(references)
  return (
    <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.6875rem] leading-5 text-muted-foreground">
      {links.map((sourceId) => (
        <Link key={sourceId} href={`#${sourceId}`} className="hover:text-primary hover:underline">
          {sourceId}
        </Link>
      ))}
    </span>
  )
}

function FamilyGroup({
  title,
  relatives,
}: Readonly<{
  title: string
  relatives: readonly { person: { id: PersonId; canonicalName: string }; relationship: Relationship }[]
}>) {
  if (relatives.length === 0) return null
  return (
    <div>
      <h3 className="editorial-label">{title}</h3>
      <ul className="mt-4 divide-y border-t">
        {relatives.map(({ person, relationship }) => (
          <li key={relationship.id} id={relationship.id} className="scroll-mt-24 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/people/${person.id}`}
                className="font-medium underline-offset-4 hover:text-primary hover:underline"
              >
                {person.canonicalName}
              </Link>
              <ConfidenceMark confidence={relationship.confidence} suffix="relationship" />
            </div>
            <RelationshipSources references={relationship.sourceRefs} />
          </li>
        ))}
      </ul>
    </div>
  )
}

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

function TimelinePlaceLinks({ entry }: Readonly<{ entry: PersonProfileTimelineEntry }>) {
  if (entry.places.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
      {entry.places.map(({ place, role }) => (
        <Link key={`${place.id}-${role}`} href={`/places/${place.id}#${entry.event.id}`} className="inline-flex items-center gap-1.5 hover:text-primary">
          <MapPin aria-hidden="true" className="size-3" />
          {place.modernName}
          {role !== "event-location" ? ` · ${sentenceCase(role)}` : ""}
        </Link>
      ))}
    </div>
  )
}

function PlaceEntry({ profilePlace }: Readonly<{ profilePlace: PersonProfilePlace }>) {
  const { place, associations } = profilePlace
  const context = placeContext(place)
  return (
    <li id={place.id} className="scroll-mt-24 py-6 first:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-[560] tracking-[-0.02em]">
            <Link href={`/places/${place.id}`} className="underline-offset-4 hover:text-primary hover:underline">
              {place.modernName}
            </Link>
          </h3>
          {context && <p className="mt-1 text-sm leading-6 text-muted-foreground">{context}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <ConfidenceMark confidence={place.confidence} />
          <Badge variant="outline">{sentenceCase(place.precision)}</Badge>
        </div>
      </div>
      <ul className="mt-4 space-y-2 border-l pl-4 text-sm leading-6 text-muted-foreground">
        {associations.map(({ event, role }) => (
          <li key={`${event.id}-${role}`}>
            <Link href={`#${event.id}`} className="text-foreground underline-offset-4 hover:text-primary hover:underline">
              {event.title ?? sentenceCase(event.type)}
            </Link>
            <span> · {sentenceCase(role)}</span>
          </li>
        ))}
      </ul>
    </li>
  )
}

function supportTargetHref(kind: string, entityId: string, personId: PersonId) {
  if (kind === "person" && entityId !== personId) return `/people/${entityId}`
  if (kind === "person" || kind === "alternate-name") return "#story"
  return `#${entityId}`
}

export function PersonProfile({ profile }: Readonly<{ profile: PersonProfileModel }>) {
  const { detail, timeline, places, evidence, researchFlags } = profile
  const person = detail.person
  const hasFamily =
    detail.parents.length > 0 || detail.spousesAndPartners.length > 0 || detail.children.length > 0

  return (
    <article>
      <header className="page-shell pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-20">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All people
        </Link>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <p className="editorial-label">{detail.relationshipLabel}</p>
            <h1 className="editorial-display mt-5 max-w-4xl">{person.canonicalName}</h1>
            {detail.lifespan && (
              <p className="mt-5 text-lg leading-7 text-muted-foreground tabular-nums">
                {detail.lifespan}
              </p>
            )}
          </div>
          <div className="border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
            <div className="flex flex-wrap gap-2">
              <ConfidenceMark confidence={person.confidence} suffix="person" />
              <Badge variant="outline">
                {detail.sourceCount} {detail.sourceCount === 1 ? "source" : "sources"}
              </Badge>
            </div>
            <p className="mt-4 break-all text-xs leading-5 text-muted-foreground">{person.id}</p>
          </div>
        </div>
      </header>

      <nav aria-label="Person profile sections" className="border-y bg-card">
        <div className="page-shell flex flex-wrap gap-x-6 gap-y-1 py-3">
          {sectionNavigation.map(([id, label]) => (
            <Link key={id} href={`#${id}`} className="py-2 text-xs font-semibold text-muted-foreground hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="page-shell">
        <ProfileSection id="story" number="01" title="Story">
          <p className="max-w-2xl text-base leading-7 text-foreground/90">{detail.biography}</p>

          {detail.relationshipPaths.length > 0 && (
            <div className="mt-8 border-l pl-5">
              <p className="editorial-label">Relationship to Michael</p>
              <div className="mt-3 space-y-4">
                {detail.relationshipPaths.map((path, pathIndex) => (
                  <div key={path.people.map(({ id }) => id).join("-")}>
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-6" aria-label={`Relationship path ${pathIndex + 1}`}>
                      {path.people.map((pathPerson, index) => (
                        <li key={pathPerson.id} className="contents">
                          {index > 0 && <ArrowRight aria-hidden="true" className="size-3.5 text-muted-foreground" />}
                          <Link
                            href={`/people/${pathPerson.id}`}
                            className={index === path.people.length - 1 ? "font-semibold" : "hover:text-primary hover:underline"}
                          >
                            {pathPerson.canonicalName}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  <p
                    data-evidence-detail={path.confidence === "verified" ? "verified" : undefined}
                    className="mt-1 text-[0.6875rem] font-medium tracking-[0.04em] text-muted-foreground uppercase"
                  >
                    {confidenceLabel(path.confidence)} path
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {person.alternateNames.length > 0 && (
            <div className="mt-8">
              <h3 className="editorial-label">Recorded names</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>
                  <span className="font-medium">{person.canonicalName}</span>
                  <span className="text-muted-foreground"> · Canonical display name</span>
                </li>
                {person.alternateNames.map((name, index) => (
                  <li key={`${name.name}-${index}`}>
                    <span className="font-medium">{name.name}</span>
                    <span className="text-muted-foreground">
                      {` · ${sentenceCase(name.type)}`}
                      <span data-evidence-detail={name.confidence === "verified" ? "verified" : undefined}>
                        {` · ${confidenceLabel(name.confidence)}`}
                      </span>
                    </span>
                    <RelationshipSources references={name.sourceRefs} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ProfileSection>

        <ProfileSection id="family" number="02" title="Family">
          {hasFamily ? (
            <div className="grid gap-9 sm:grid-cols-2">
              <FamilyGroup title="Parents" relatives={detail.parents} />
              <FamilyGroup title="Spouses / partners" relatives={detail.spousesAndPartners} />
              <FamilyGroup title="Children" relatives={detail.children} />
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No direct family relationships are represented for this person in the canonical graph.
            </p>
          )}
        </ProfileSection>

        <ProfileSection id="life-in-places" number="03" title="Life in places">
          {places.length > 0 ? (
            <ul className="divide-y">
              {places.map((place) => <PlaceEntry key={place.place.id} profilePlace={place} />)}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No place-linked events are represented for this person in the canonical graph.
            </p>
          )}
        </ProfileSection>

        <ProfileSection id="timeline" number="04" title="Timeline">
          {timeline.length > 0 ? (
            <ol className="border-t">
              {timeline.map((entry) => (
                <li key={entry.event.id} id={entry.event.id} className="scroll-mt-24 grid gap-3 border-b py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-7">
                  <div>
                    <p className="text-sm font-semibold text-primary tabular-nums">
                      {entry.dateLabel ?? "Date not established"}
                    </p>
                    {!entry.dateLabel && entry.dateOriginalText && (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.dateOriginalText}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-[560]">{entry.label}</h3>
                      <ConfidenceMark confidence={entry.event.confidence} />
                    </div>
                    {entry.event.description && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.event.description}</p>
                    )}
                    {entry.relatedPeople.length > 0 && (
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        With{" "}
                        {entry.relatedPeople.map((related, index) => (
                          <span key={related.id}>
                            {index > 0 ? ", " : ""}
                            <Link href={`/people/${related.id}`} className="text-foreground hover:text-primary hover:underline">
                              {related.canonicalName}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                    <TimelinePlaceLinks entry={entry} />
                    <RelationshipSources references={entry.event.sourceRefs} />
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No life events are represented for this person in the canonical graph.
            </p>
          )}
        </ProfileSection>

        <ProfileSection id="records-evidence" number="05" title="Records & evidence">
          {evidence.length > 0 ? (
            <ol className="divide-y border-t">
              {evidence.map(({ source, support }) => {
                const sourceDate = source.date ? formatPersonDetailDate(source.date) : undefined
                return (
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
                        {(sourceDate || source.repository || source.jurisdiction) && (
                          <p className="mt-3 text-xs leading-5 text-muted-foreground">
                            {[sourceDate, source.repository, source.jurisdiction].filter(Boolean).join(" · ")}
                          </p>
                        )}
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
                              <p key={handle}>Archive citation handle: <span className="break-all font-mono">{handle}</span></p>
                            ))}
                          </div>
                        )}
                        <div className="mt-4">
                          <p className="editorial-label">Supports</p>
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5">
                            {support.via.map((via, index) => (
                              <li key={`${via.kind}-${via.entityId}-${via.reference.locator ?? ""}-${index}`}>
                                <Link href={supportTargetHref(via.kind, via.entityId, person.id)} className="text-muted-foreground hover:text-primary hover:underline">
                                  {sentenceCase(via.kind)}{via.detail ? ` · ${via.detail}` : ""}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
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
                )
              })}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No source record is linked to this person in the canonical graph.
            </p>
          )}
        </ProfileSection>

        <ProfileSection id="open-research" number="06" title="Open research questions">
          <p className="mb-6 max-w-2xl text-sm leading-6 text-muted-foreground">
            This section reports explicit uncertainty carried by normalized claims. It does not infer questions from missing family-tree branches.
          </p>
          {researchFlags.length > 0 ? (
            <ul className="divide-y border-t">
              {researchFlags.map((flag) => (
                <li key={flag.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <Link href={flag.targetId.startsWith("person-") ? "#story" : `#${flag.targetId}`} className="font-medium leading-6 underline-offset-4 hover:text-primary hover:underline">
                      {flag.title}
                    </Link>
                    {flag.confidence && <ConfidenceMark confidence={flag.confidence} alwaysVisible />}
                  </div>
                  {flag.details.map((detailText) => (
                    <p key={detailText} className="mt-2 text-sm leading-6 text-muted-foreground">{detailText}</p>
                  ))}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              No person-specific research flag is currently represented in normalized application data. This does not mean the genealogy is complete.
            </p>
          )}
        </ProfileSection>
      </div>

      <footer className="border-t bg-surface-subtle">
        <div className="page-shell flex flex-col gap-4 py-9 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-muted-foreground">
            This profile is generated from normalized application data. Research prose is never scraped at runtime.
          </p>
          <Link href="/people" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Browse all people
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </footer>
    </article>
  )
}
