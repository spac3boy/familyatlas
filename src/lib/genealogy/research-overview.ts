import { formatPersonDetailDate } from "@/lib/genealogy/person-detail"
import type {
  Confidence,
  Event,
  GenealogyGraph,
  Person,
  Place,
  Relationship,
  Source,
  SourceCategory,
  SourceId,
} from "@/types"

export const confidenceOrder = ["verified", "probable", "unresolved"] as const

export interface ResearchCountSet {
  readonly total: number
  readonly verified: number
  readonly probable: number
  readonly unresolved: number
}

export interface ResearchCoverageModel {
  readonly people: ResearchCountSet
  readonly relationships: ResearchCountSet
  readonly events: ResearchCountSet
  readonly places: ResearchCountSet
  readonly sources: number
  readonly directlyInspectedSources: number
  readonly sourcesWithPublicUrls: number
  readonly sourcesWithContradictions: number
}

export type ResearchConclusionKind = "person" | "relationship" | "event" | "place"

export interface ResearchConclusion {
  readonly id: string
  readonly kind: ResearchConclusionKind
  readonly confidence: Confidence
  readonly title: string
  readonly detail: string
  readonly href?: string
  readonly sourceIds: readonly SourceId[]
}

export interface ResearchSourceGroup {
  readonly category: SourceCategory
  readonly label: string
  readonly sources: readonly Source[]
}

export interface ResearchOverviewModel {
  readonly coverage: ResearchCoverageModel
  readonly conclusions: Readonly<Record<Confidence, readonly ResearchConclusion[]>>
  readonly sourceGroups: readonly ResearchSourceGroup[]
}

const sourceCategoryLabels: Readonly<Record<SourceCategory, string>> = {
  census: "Census",
  "civil-birth": "Civil birth",
  "baptism-church": "Baptism and church",
  marriage: "Marriage",
  death: "Death",
  obituary: "Obituary and funeral",
  "cemetery-burial": "Cemetery and burial",
  military: "Military",
  immigration: "Immigration",
  naturalization: "Naturalization",
  directory: "Directories",
  newspaper: "Newspapers",
  "genealogy-database": "Genealogy databases",
  "family-provided": "Family-provided information",
  "other-primary": "Other primary material",
  secondary: "Secondary sources",
  other: "Other sources",
}

function countConfidence<T extends { readonly confidence: Confidence }>(items: readonly T[]): ResearchCountSet {
  return {
    total: items.length,
    verified: items.filter(({ confidence }) => confidence === "verified").length,
    probable: items.filter(({ confidence }) => confidence === "probable").length,
    unresolved: items.filter(({ confidence }) => confidence === "unresolved").length,
  }
}

function sourceIds(entity: { readonly sourceRefs: readonly { readonly sourceId: SourceId }[] }) {
  return [...new Set(entity.sourceRefs.map(({ sourceId }) => sourceId))]
}

function personConclusion(person: Person): ResearchConclusion {
  return {
    id: `conclusion-person-${person.id}`,
    kind: "person",
    confidence: person.confidence,
    title: person.canonicalName,
    detail: "Accepted identity in the canonical family graph.",
    href: `/people/${person.id}`,
    sourceIds: sourceIds(person),
  }
}

function relationshipConclusion(
  relationship: Relationship,
  peopleById: ReadonlyMap<string, Person>,
): ResearchConclusion {
  if (relationship.type === "parent-child") {
    const parent = peopleById.get(relationship.parentId)?.canonicalName ?? relationship.parentId
    const child = peopleById.get(relationship.childId)?.canonicalName ?? relationship.childId
    return {
      id: `conclusion-relationship-${relationship.id}`,
      kind: "relationship",
      confidence: relationship.confidence,
      title: `${parent} → ${child}`,
      detail: `${relationship.parentage === "unknown" ? "Parent-child" : `${relationship.parentage} parent-child`} relationship.`,
      href: `/people/${relationship.childId}#family`,
      sourceIds: sourceIds(relationship),
    }
  }

  const first = peopleById.get(relationship.personIds[0])?.canonicalName ?? relationship.personIds[0]
  const second = peopleById.get(relationship.personIds[1])?.canonicalName ?? relationship.personIds[1]
  return {
    id: `conclusion-relationship-${relationship.id}`,
    kind: "relationship",
    confidence: relationship.confidence,
    title: `${first} — ${second}`,
    detail: relationship.type === "spouse" ? "Spouse relationship." : "Partner relationship.",
    href: `/people/${relationship.personIds[0]}#family`,
    sourceIds: sourceIds(relationship),
  }
}

function eventConclusion(
  event: Event,
  peopleById: ReadonlyMap<string, Person>,
  placesById: ReadonlyMap<string, Place>,
): ResearchConclusion {
  const people = event.personIds
    .map((id) => peopleById.get(id)?.canonicalName ?? id)
    .join(", ")
  const date = formatPersonDetailDate(event.date) ?? "date not established"
  const place = event.placeId ? placesById.get(event.placeId)?.modernName : undefined
  const title = event.title ?? event.type.charAt(0).toUpperCase() + event.type.slice(1)
  return {
    id: `conclusion-event-${event.id}`,
    kind: "event",
    confidence: event.confidence,
    title: `${title} · ${people}`,
    detail: [date, place].filter(Boolean).join(" · "),
    href: `/people/${event.personIds[0]}#${event.id}`,
    sourceIds: sourceIds(event),
  }
}

function placeConclusion(place: Place): ResearchConclusion {
  const precision = place.precision.replaceAll("-", " ")
  return {
    id: `conclusion-place-${place.id}`,
    kind: "place",
    confidence: place.confidence,
    title: place.modernName,
    detail: `${precision.charAt(0).toUpperCase()}${precision.slice(1)}.`,
    href: `/places/${place.id}`,
    sourceIds: sourceIds(place),
  }
}

export function buildResearchOverview(graph: GenealogyGraph): ResearchOverviewModel {
  const acceptedPeople = graph.people.filter(({ researchStatus }) => researchStatus === "accepted")
  const acceptedRelationships = graph.relationships.filter(({ researchStatus }) => researchStatus === "accepted")
  const acceptedEvents = graph.events.filter(({ researchStatus }) => researchStatus === "accepted")
  const acceptedPlaces = graph.places.filter(({ researchStatus }) => researchStatus === "accepted")
  const acceptedSources = graph.sources.filter(({ researchStatus }) => researchStatus === "accepted")
  const peopleById = new Map(acceptedPeople.map((person) => [person.id, person]))
  const placesById = new Map(acceptedPlaces.map((place) => [place.id, place]))

  const conclusions = [
    ...acceptedPeople.map(personConclusion),
    ...acceptedRelationships.map((relationship) => relationshipConclusion(relationship, peopleById)),
    ...acceptedEvents.map((event) => eventConclusion(event, peopleById, placesById)),
    ...acceptedPlaces.map(placeConclusion),
  ]

  const sourceGroups = [...new Set(acceptedSources.map(({ category }) => category))]
    .sort((first, second) => sourceCategoryLabels[first].localeCompare(sourceCategoryLabels[second]))
    .map((category) => ({
      category,
      label: sourceCategoryLabels[category],
      sources: acceptedSources
        .filter((source) => source.category === category)
        .sort((first, second) => first.title.localeCompare(second.title)),
    }))

  return {
    coverage: {
      people: countConfidence(acceptedPeople),
      relationships: countConfidence(acceptedRelationships),
      events: countConfidence(acceptedEvents),
      places: countConfidence(acceptedPlaces),
      sources: acceptedSources.length,
      directlyInspectedSources: acceptedSources.filter(({ inspectionStatus }) => inspectionStatus === "directly-inspected").length,
      sourcesWithPublicUrls: acceptedSources.filter(({ urls }) => urls.length > 0).length,
      sourcesWithContradictions: acceptedSources.filter(({ contradictionNotes }) => (contradictionNotes?.length ?? 0) > 0).length,
    },
    conclusions: {
      verified: conclusions.filter(({ confidence }) => confidence === "verified"),
      probable: conclusions.filter(({ confidence }) => confidence === "probable"),
      unresolved: conclusions.filter(({ confidence }) => confidence === "unresolved"),
    },
    sourceGroups,
  }
}
