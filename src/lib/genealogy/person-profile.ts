import { createGenealogyQueries, type GenealogyQueries, type PlaceAssociationRole, type SourceSupport } from "@/lib/genealogy/queries";
import { buildPersonDetailModel, formatPersonDetailDate, type PersonDetailModel, type PersonDetailRelative } from "@/lib/genealogy/person-detail";
import type {
  Confidence,
  Event,
  EventType,
  GenealogyGraph,
  Person,
  PersonId,
  Place,
  PlaceId,
  Source,
} from "@/types";

export interface PersonProfileEventPlace {
  readonly place: Place;
  readonly role: PlaceAssociationRole;
}

export interface PersonProfileTimelineEntry {
  readonly event: Event;
  readonly label: string;
  readonly dateLabel?: string;
  readonly dateOriginalText?: string;
  readonly places: readonly PersonProfileEventPlace[];
  readonly relatedPeople: readonly Person[];
}

export interface PersonProfilePlaceAssociation {
  readonly event: Event;
  readonly role: PlaceAssociationRole;
}

export interface PersonProfilePlace {
  readonly place: Place;
  readonly associations: readonly PersonProfilePlaceAssociation[];
}

export interface PersonProfileEvidence {
  readonly source: Source;
  readonly support: SourceSupport;
}

export interface PersonProfileResearchFlag {
  readonly id: string;
  readonly title: string;
  readonly details: readonly string[];
  readonly confidence?: Confidence;
  readonly targetId: string;
}

export interface PersonProfileModel {
  readonly detail: PersonDetailModel;
  readonly timeline: readonly PersonProfileTimelineEntry[];
  readonly places: readonly PersonProfilePlace[];
  readonly evidence: readonly PersonProfileEvidence[];
  readonly researchFlags: readonly PersonProfileResearchFlag[];
}

const titleCase = (value: string): string =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function eventLabel(event: Event): string {
  return event.title ?? titleCase(event.type);
}

function eventPlaces(
  event: Event,
  placesById: ReadonlyMap<PlaceId, Place>,
): readonly PersonProfileEventPlace[] {
  const matches = new Map<string, PersonProfileEventPlace>();
  const add = (placeId: PlaceId, role: PlaceAssociationRole) => {
    const place = placesById.get(placeId);
    if (place) matches.set(`${place.id}:${role}`, { place, role });
  };

  if (event.placeId) add(event.placeId, "event-location");
  for (const placeId of event.migration?.fromPlaceIds ?? []) add(placeId, "migration-origin");
  for (const placeId of event.migration?.toPlaceIds ?? []) add(placeId, "migration-destination");
  return [...matches.values()];
}

function profilePlaces(timeline: readonly PersonProfileTimelineEntry[]): readonly PersonProfilePlace[] {
  const grouped = new Map<PlaceId, { place: Place; associations: PersonProfilePlaceAssociation[] }>();
  for (const entry of timeline) {
    for (const { place, role } of entry.places) {
      const match = grouped.get(place.id) ?? { place, associations: [] };
      if (!match.associations.some(({ event, role: existingRole }) => event.id === entry.event.id && existingRole === role)) {
        match.associations.push({ event: entry.event, role });
      }
      grouped.set(place.id, match);
    }
  }
  return [...grouped.values()].sort((first, second) =>
    first.place.modernName.localeCompare(second.place.modernName),
  );
}

function relationshipFlag(
  role: "Parent" | "Child" | "Spouse" | "Partner",
  relative: PersonDetailRelative,
): PersonProfileResearchFlag | undefined {
  if (relative.relationship.confidence === "verified") return undefined;
  return {
    id: `research-relationship-${relative.relationship.id}`,
    title: `${role} relationship with ${relative.person.canonicalName} is ${relative.relationship.confidence}`,
    details: relative.relationship.notes ?? [],
    confidence: relative.relationship.confidence,
    targetId: relative.relationship.id,
  };
}

function researchFlags(
  detail: PersonDetailModel,
  timeline: readonly PersonProfileTimelineEntry[],
  evidence: readonly PersonProfileEvidence[],
): readonly PersonProfileResearchFlag[] {
  const flags = new Map<string, PersonProfileResearchFlag>();
  const add = (flag: PersonProfileResearchFlag | undefined) => {
    if (flag) flags.set(flag.id, flag);
  };

  for (const relative of detail.parents) add(relationshipFlag("Parent", relative));
  for (const relative of detail.children) add(relationshipFlag("Child", relative));
  for (const relative of detail.spousesAndPartners) {
    add(relationshipFlag(relative.relationship.type === "partner" ? "Partner" : "Spouse", relative));
  }

  for (const entry of timeline) {
    if (entry.event.confidence !== "verified") {
      add({
        id: `research-confidence-${entry.event.id}`,
        title: `${entry.label} is ${entry.event.confidence}`,
        details: entry.event.notes ?? [],
        confidence: entry.event.confidence,
        targetId: entry.event.id,
      });
    }
    if (entry.event.date.kind === "unknown") {
      add({
        id: `research-date-${entry.event.id}`,
        title: `Date not established for ${entry.label.toLocaleLowerCase("en-US")}`,
        details: [entry.event.date.originalText, entry.event.date.note].filter(
          (value): value is string => Boolean(value),
        ),
        targetId: entry.event.id,
      });
    }
  }

  for (const { source } of evidence) {
    for (const [index, note] of (source.contradictionNotes ?? []).entries()) {
      add({
        id: `research-source-${source.id}-${index + 1}`,
        title: `Contradiction retained in ${source.title}`,
        details: [note],
        targetId: source.id,
      });
    }
  }

  for (const [index, alternateName] of detail.person.alternateNames.entries()) {
    if (alternateName.confidence === "verified") continue;
    add({
      id: `research-name-${detail.person.id}-${index + 1}`,
      title: `Name form “${alternateName.name}” is ${alternateName.confidence}`,
      details: [alternateName.note].filter((value): value is string => Boolean(value)),
      confidence: alternateName.confidence,
      targetId: detail.person.id,
    });
  }

  for (const [index, note] of (detail.person.notes ?? []).entries()) {
    if (
      detail.person.confidence === "verified" &&
      !/\b(?:unknown|unresolved|not established|not supported|distinct)\b/iu.test(note)
    ) {
      continue;
    }
    add({
      id: `research-person-${detail.person.id}-${index + 1}`,
      title: "Person record note",
      details: [note],
      confidence: detail.person.confidence,
      targetId: detail.person.id,
    });
  }

  return [...flags.values()];
}

export function buildPersonProfileModel(
  graph: GenealogyGraph,
  personId: PersonId,
  suppliedQueries?: GenealogyQueries,
): PersonProfileModel | undefined {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const detail = buildPersonDetailModel(graph, personId, queries);
  if (!detail) return undefined;

  const peopleById = new Map<PersonId, Person>(graph.people.map((person) => [person.id, person]));
  const placesById = new Map<PlaceId, Place>(graph.places.map((place) => [place.id, place]));
  const timeline = queries.eventsByPerson(personId).map((event) => ({
    event,
    label: eventLabel(event),
    dateLabel: formatPersonDetailDate(event.date),
    dateOriginalText: event.date.originalText,
    places: eventPlaces(event, placesById),
    relatedPeople: event.personIds
      .filter((id) => id !== personId)
      .map((id) => peopleById.get(id))
      .filter((person): person is Person => Boolean(person)),
  }));
  const evidence = queries.sourcesSupportingPerson(personId).map((support) => ({
    source: support.source,
    support,
  }));

  return {
    detail,
    timeline,
    places: profilePlaces(timeline),
    evidence,
    researchFlags: researchFlags(detail, timeline, evidence),
  };
}

export const personProfileEventTypeLabel = (type: EventType): string => titleCase(type);
