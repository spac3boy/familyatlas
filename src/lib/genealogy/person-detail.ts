import {
  createGenealogyQueries,
  MICHAEL_BUQUET_ID,
  type GenealogyQueries,
} from "@/lib/genealogy/queries";
import { sharedRelationshipProvenanceKinds } from "@/lib/genealogy/evidence";
import type {
  Confidence,
  EvidenceProvenanceKind,
  Event,
  EventType,
  GenealogyGraph,
  HistoricalDate,
  Person,
  PersonId,
  Place,
  PlaceId,
  Relationship,
  RelationshipId,
} from "@/types";

export interface PersonDetailRelative {
  readonly person: Person;
  readonly relationship: Relationship;
}

export interface PersonDetailPlace {
  readonly place: Place;
  readonly eventTypes: readonly EventType[];
}

export interface PersonDetailPath {
  /** Always ordered from Michael to the displayed person. */
  readonly people: readonly Person[];
  readonly relationshipIds: readonly RelationshipId[];
  readonly confidence: Confidence;
  readonly provenanceKinds: readonly EvidenceProvenanceKind[];
}

export interface PersonDetailEvent {
  readonly event: Event;
  readonly label: string;
  readonly dateLabel?: string;
  readonly place?: Place;
}

export interface PersonDetailModel {
  readonly person: Person;
  readonly relationshipLabel: string;
  readonly relationshipPaths: readonly PersonDetailPath[];
  readonly lifespan?: string;
  readonly biography: string;
  readonly places: readonly PersonDetailPlace[];
  readonly parents: readonly PersonDetailRelative[];
  readonly spousesAndPartners: readonly PersonDetailRelative[];
  readonly children: readonly PersonDetailRelative[];
  readonly events: readonly PersonDetailEvent[];
  readonly confidence: Confidence;
  readonly sourceCount: number;
}

const titleCase = (value: string): string =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatExactDate = (value: string): string => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const formatDatePoint = (
  point: Extract<HistoricalDate, { kind: "exact" | "year" }>,
): string => (point.kind === "exact" ? formatExactDate(point.value) : String(point.year));

export function formatPersonDetailDate(date: HistoricalDate): string | undefined {
  switch (date.kind) {
    case "exact":
      return formatExactDate(date.value);
    case "year":
      return String(date.year);
    case "circa":
      return `circa ${formatDatePoint(date.value)}`;
    case "before":
      return `before ${formatDatePoint(date.value)}`;
    case "after":
      return `after ${formatDatePoint(date.value)}`;
    case "range": {
      const start = formatDatePoint(date.start);
      const end = formatDatePoint(date.end);
      return start === end ? start : `${start}–${end}`;
    }
    case "unknown":
      return undefined;
  }
}

const uniqueEventDateLabels = (events: readonly Event[], type: "birth" | "death") => [
  ...new Set(
    events
      .filter((event) => event.type === type)
      .map(({ date }) => formatPersonDetailDate(date))
      .filter((label): label is string => Boolean(label)),
  ),
];

function lifespanFor(events: readonly Event[]): string | undefined {
  const births = uniqueEventDateLabels(events, "birth");
  const deaths = uniqueEventDateLabels(events, "death");
  if (births.length === 1 && deaths.length === 1) return `${births[0]}–${deaths[0]}`;
  const parts = [
    births.length > 0 ? `Birth: ${births.join(" / ")}` : undefined,
    deaths.length > 0 ? `Death: ${deaths.join(" / ")}` : undefined,
  ].filter((part): part is string => Boolean(part));
  return parts.join(" · ") || undefined;
}

function placeLabel(place: Place): string {
  const region = [place.parishCounty, place.stateProvinceRegion, place.country].filter(Boolean);
  return [place.modernName, ...region.filter((part) => part !== place.modernName)].join(", ");
}

function datedEventPhrase(event: Event, placesById: ReadonlyMap<string, Place>): string | undefined {
  const date = formatPersonDetailDate(event.date);
  const place = event.placeId ? placesById.get(event.placeId) : undefined;
  if (!date && !place) return undefined;
  return [date, place ? `in ${placeLabel(place)}` : undefined].filter(Boolean).join(" ");
}

function biographyFor(
  person: Person,
  events: readonly Event[],
  placesById: ReadonlyMap<string, Place>,
): string {
  const sentences: string[] = [];
  const birthEvents = events.filter(({ type }) => type === "birth");
  const deathEvents = events.filter(({ type }) => type === "death");
  const birthPhrases = [...new Set(birthEvents.map((event) => datedEventPhrase(event, placesById)).filter(Boolean))];
  const deathPhrases = [...new Set(deathEvents.map((event) => datedEventPhrase(event, placesById)).filter(Boolean))];

  if (birthPhrases.length === 1) {
    sentences.push(`${person.canonicalName} was born ${birthPhrases[0]}.`);
  } else if (birthPhrases.length > 1) {
    sentences.push(`The archive retains alternative birth details for ${person.canonicalName}: ${birthPhrases.join("; ")}.`);
  }
  if (deathPhrases.length === 1) {
    sentences.push(`${person.canonicalName} died ${deathPhrases[0]}.`);
  } else if (deathPhrases.length > 1) {
    sentences.push(`The archive retains alternative death details: ${deathPhrases.join("; ")}.`);
  }

  const occupations = [
    ...new Set(
      events
        .filter(({ type }) => type === "occupation")
        .map(({ title, description }) => title ?? description)
        .filter((value): value is string => Boolean(value)),
    ),
  ];
  if (occupations.length > 0) {
    sentences.push(`Recorded work includes ${occupations.join("; ").replace(/[.]+$/u, "")}.`);
  }

  const military = events.find(({ type }) => type === "military");
  if (military) {
    const service = military.title ?? military.description;
    if (service) sentences.push(`${service.replace(/[.]+$/u, "")}.`);
  }

  return (
    sentences.slice(0, 3).join(" ") ||
    `The canonical family graph currently preserves ${person.canonicalName} through supported family relationships; no additional biographical events are established in the normalized record.`
  );
}

function relationshipLabel(
  personId: PersonId,
  queries: GenealogyQueries,
  originalPaths: ReturnType<GenealogyQueries["relationshipPathToMichael"]>,
): string {
  if (!originalPaths) return "Relationship to Michael unresolved";
  if (originalPaths.distance === 0) return "Reference person";
  const branch = queries.branchForPerson(personId)?.classification;
  const branchLabel =
    branch === "maternal"
      ? "Maternal"
      : branch === "paternal"
        ? "Paternal"
        : branch === "both"
          ? "Maternal and paternal"
          : undefined;
  const siblingMatch = queries
    .siblings(MICHAEL_BUQUET_ID)
    .find(({ person }) => person.id === personId);
  if (siblingMatch) {
    const sharedParentNames = siblingMatch.sharedParents.map(({ parent }) => parent.canonicalName);
    if (sharedParentNames.length === 1) {
      return `${branchLabel ? `${branchLabel} sibling` : "Sibling"} through ${sharedParentNames[0]}`;
    }
    if (sharedParentNames.length === 2) return "Sibling through both recorded parents";
    return "Sibling through shared recorded parents";
  }
  const isParentsSibling = queries.parents(MICHAEL_BUQUET_ID).some(({ person: parent }) =>
    queries.siblings(parent.id).some(({ person: sibling }) => sibling.id === personId),
  );
  if (isParentsSibling) return branchLabel ? `${branchLabel} aunt/uncle` : "Aunt/uncle";
  const isFirstCousin = queries
    .firstCousins(MICHAEL_BUQUET_ID)
    .some(({ person }) => person.id === personId);
  if (isFirstCousin) return branchLabel ? `${branchLabel} first cousin` : "First cousin";
  const primaryPath = originalPaths.paths[0];
  const isDirectAncestor = primaryPath.relationships.every((relationship, index) => {
    if (relationship.type !== "parent-child") return false;
    return (
      relationship.parentId === primaryPath.people[index]?.id &&
      relationship.childId === primaryPath.people[index + 1]?.id
    );
  });
  if (!isDirectAncestor) {
    return `Related through ${originalPaths.distance} supported relationship${originalPaths.distance === 1 ? "" : "s"}`;
  }

  const generation = originalPaths.distance;
  const kinship =
    generation === 1
      ? "parent"
      : generation === 2
        ? "grandparent"
        : generation === 3
          ? "great-grandparent"
          : `${generation - 2}× great-grandparent`;
  return branchLabel ? `${branchLabel} ${kinship}` : titleCase(kinship);
}

export function buildPersonDetailModel(
  graph: GenealogyGraph,
  personId: PersonId,
  suppliedQueries?: GenealogyQueries,
): PersonDetailModel | undefined {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const person = queries.personById(personId);
  if (!person) return undefined;
  const events = queries.eventsByPerson(person.id);
  const placesById = new Map<PlaceId, Place>(graph.places.map((place) => [place.id, place]));
  const pathResult = queries.relationshipPathToMichael(person.id);
  const relationshipPaths =
    pathResult?.paths.map((path) => ({
      people: [...path.people].reverse(),
      relationshipIds: [...path.relationships].reverse().map(({ id }) => id),
      confidence: path.confidence,
      provenanceKinds: sharedRelationshipProvenanceKinds(path.relationships),
    })) ?? [];

  const placeEvents = new Map<PlaceId, Set<EventType>>();
  for (const event of events) {
    if (event.placeId) {
      const types = placeEvents.get(event.placeId) ?? new Set<EventType>();
      types.add(event.type);
      placeEvents.set(event.placeId, types);
    }
    for (const placeId of event.migration?.fromPlaceIds ?? []) {
      const types = placeEvents.get(placeId) ?? new Set<EventType>();
      types.add("migration");
      placeEvents.set(placeId, types);
    }
    for (const placeId of event.migration?.toPlaceIds ?? []) {
      const types = placeEvents.get(placeId) ?? new Set<EventType>();
      types.add("migration");
      placeEvents.set(placeId, types);
    }
  }

  const places = [...placeEvents.entries()].flatMap(([placeId, eventTypes]) => {
    const place = placesById.get(placeId);
    return place ? [{ place, eventTypes: [...eventTypes] }] : [];
  });
  const detailEvents = events.map((event) => ({
    event,
    label: event.title ?? titleCase(event.type),
    dateLabel: formatPersonDetailDate(event.date),
    place: event.placeId ? placesById.get(event.placeId) : undefined,
  }));

  return {
    person,
    relationshipLabel: relationshipLabel(person.id, queries, pathResult),
    relationshipPaths,
    lifespan: lifespanFor(events),
    biography: biographyFor(person, events, placesById),
    places,
    parents: queries.parents(person.id),
    spousesAndPartners: queries.spousesAndPartners(person.id),
    children: queries.children(person.id),
    events: detailEvents,
    confidence: person.confidence,
    sourceCount: queries.sourcesSupportingPerson(person.id).length,
  };
}
