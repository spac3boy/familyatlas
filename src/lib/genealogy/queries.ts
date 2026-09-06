import type {
  AlternateNameType,
  Confidence,
  Event,
  EventId,
  GenealogyGraph,
  HistoricalDate,
  ParentChildRelationship,
  Person,
  PersonId,
  Place,
  PlaceId,
  Relationship,
  ResearchStatus,
  Source,
  SourceId,
  SourceReference,
  CoupleRelationship,
} from "@/types";

export const MICHAEL_BUQUET_ID = "person-michael-buquet" as const satisfies PersonId;
export const MATERNAL_ROOT_ID = "person-paulette-comeaux" as const satisfies PersonId;
export const PATERNAL_ROOT_ID = "person-aubin-buquet" as const satisfies PersonId;

export interface GenealogyQueryOptions {
  /** Defaults to Michael Buquet for relationship-path queries. */
  readonly focalPersonId?: PersonId;
  /** Defaults to Paulette Comeaux. */
  readonly maternalRootId?: PersonId;
  /** Defaults to Aubin Buquet. */
  readonly paternalRootId?: PersonId;
  /** Defaults to accepted records only. */
  readonly researchStatuses?: readonly ResearchStatus[];
}

export interface TraversalOptions {
  /** Maximum parent-child edges to traverse. Defaults to the number of people. */
  readonly maxDepth?: number;
}

export interface PlaceQueryOptions {
  /** Include events attached to child places in the place hierarchy. */
  readonly includeDescendantPlaces?: boolean;
}

export interface RelatedPerson {
  readonly person: Person;
  readonly relationship: Relationship;
}

export interface GenealogyPath {
  /** Ordered from the query subject to the matched person. */
  readonly people: readonly Person[];
  readonly relationships: readonly Relationship[];
  /** The weakest confidence among the path's relationship edges. */
  readonly confidence: Confidence;
}

export interface TraversalMatch {
  readonly person: Person;
  /** Minimum number of parent-child edges from the query subject. */
  readonly depth: number;
  /** Every simple path found within `maxDepth`; pedigree collapse remains visible. */
  readonly paths: readonly GenealogyPath[];
}

export interface SharedParentEvidence {
  readonly parent: Person;
  readonly subjectRelationship: Relationship;
  readonly siblingRelationship: Relationship;
}

export interface SiblingMatch {
  readonly person: Person;
  /** One or more shared parents; no unsupported full/half-sibling label is inferred. */
  readonly sharedParents: readonly SharedParentEvidence[];
}

export interface RelationshipPathResult {
  readonly person: Person;
  readonly focalPerson: Person;
  readonly distance: number;
  /** All shortest paths through included relationship records. */
  readonly paths: readonly GenealogyPath[];
}

export type FamilyBranch = "maternal" | "paternal";
export type BranchClassification = FamilyBranch | "both" | "self" | "unclassified";

export interface BranchMembership {
  readonly branch: FamilyBranch;
  /** Ordered from that branch root toward the queried ancestor. */
  readonly paths: readonly GenealogyPath[];
}

export interface BranchResult {
  readonly person: Person;
  readonly classification: BranchClassification;
  readonly memberships: readonly BranchMembership[];
}

export interface SurnameNameMatch {
  readonly name: string;
  readonly type: "canonical" | AlternateNameType;
  readonly confidence: Confidence;
  readonly sourceRefs: readonly SourceReference[];
}

export interface SurnameMatch {
  readonly person: Person;
  readonly matchedNames: readonly SurnameNameMatch[];
}

export type PlaceAssociationRole = "event-location" | "migration-origin" | "migration-destination";

export interface EventPlaceMatch {
  readonly event: Event;
  readonly roles: readonly PlaceAssociationRole[];
  readonly matchedPlaceIds: readonly PlaceId[];
}

export interface PersonPlaceAssociation {
  readonly event: Event;
  readonly roles: readonly PlaceAssociationRole[];
  readonly matchedPlaceIds: readonly PlaceId[];
}

export interface PersonPlaceMatch {
  readonly person: Person;
  readonly associations: readonly PersonPlaceAssociation[];
}

export type DateMatchKind = "contained" | "overlaps";

export interface EventDateMatch {
  readonly event: Event;
  /** `contained` means the event's whole date interval is inside the query interval. */
  readonly match: DateMatchKind;
}

export interface EventsByDateResult {
  readonly query: HistoricalDate;
  readonly matches: readonly EventDateMatch[];
  /** Included events whose date is explicitly unknown. */
  readonly indeterminate: readonly Event[];
}

export type AliveInYearBasis = "dated-event" | "bounded-lifespan" | "overlapping-lifespan";

export interface AliveInYearMatch {
  readonly person: Person;
  /** `supported` is temporal support, not an upgrade of the underlying claim confidence. */
  readonly temporalStatus: "supported" | "possible";
  readonly basis: AliveInYearBasis;
  readonly evidenceEvents: readonly Event[];
}

export interface AliveInYearIndeterminate {
  readonly person: Person;
  readonly reason: "missing-birth" | "missing-death" | "open-or-conflicting-bounds";
}

export interface AliveInYearExcluded {
  readonly person: Person;
  readonly reason: "born-after-year" | "died-before-year";
  readonly evidenceEvents: readonly Event[];
}

export interface PeopleAliveInYearResult {
  readonly year: number;
  readonly matches: readonly AliveInYearMatch[];
  readonly indeterminate: readonly AliveInYearIndeterminate[];
  readonly excluded: readonly AliveInYearExcluded[];
}

export type SourceSupportKind = "person" | "alternate-name" | "relationship" | "event";

export interface SourceSupportVia {
  readonly kind: SourceSupportKind;
  readonly entityId: string;
  readonly reference: SourceReference;
  readonly detail?: string;
}

export interface SourceSupport {
  readonly source: Source;
  readonly via: readonly SourceSupportVia[];
}

export interface GenealogyQueries {
  personById(id: PersonId): Person | undefined;
  parents(id: PersonId): readonly RelatedPerson[];
  children(id: PersonId): readonly RelatedPerson[];
  spousesAndPartners(id: PersonId): readonly RelatedPerson[];
  ancestors(id: PersonId, options?: TraversalOptions): readonly TraversalMatch[];
  descendants(id: PersonId, options?: TraversalOptions): readonly TraversalMatch[];
  siblings(id: PersonId): readonly SiblingMatch[];
  relationshipPathToMichael(id: PersonId): RelationshipPathResult | undefined;
  branchForPerson(id: PersonId): BranchResult | undefined;
  peopleBySurname(surname: string): readonly SurnameMatch[];
  peopleAssociatedWithPlace(id: PlaceId, options?: PlaceQueryOptions): readonly PersonPlaceMatch[];
  peopleAliveInYear(year: number): PeopleAliveInYearResult;
  eventsByPerson(id: PersonId): readonly Event[];
  eventsByDate(date: HistoricalDate): EventsByDateResult;
  eventsByPlace(id: PlaceId, options?: PlaceQueryOptions): readonly EventPlaceMatch[];
  sourcesSupportingPerson(id: PersonId): readonly SourceSupport[];
  sourcesSupportingEvent(id: EventId): readonly SourceSupport[];
}

interface DateSpan {
  readonly earliest: number;
  readonly latest: number;
}

const confidenceRank: Readonly<Record<Confidence, number>> = {
  unresolved: 0,
  probable: 1,
  verified: 2,
};

const weakestConfidence = (relationships: readonly Relationship[], fallback: Confidence): Confidence =>
  relationships.reduce(
    (weakest, relationship) =>
      confidenceRank[relationship.confidence] < confidenceRank[weakest]
        ? relationship.confidence
        : weakest,
    fallback,
  );

const normalizeText = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const dateOrdinal = (year: number, month: number, day: number): number =>
  year * 400 + month * 32 + day;

const pointSpan = (point: Extract<HistoricalDate, { kind: "exact" | "year" }>): DateSpan => {
  if (point.kind === "year") {
    return { earliest: dateOrdinal(point.year, 1, 1), latest: dateOrdinal(point.year, 12, 31) };
  }
  const [year, month, day] = point.value.split("-").map(Number);
  const ordinal = dateOrdinal(year, month, day);
  return { earliest: ordinal, latest: ordinal };
};

function dateSpan(date: HistoricalDate): DateSpan | undefined {
  switch (date.kind) {
    case "exact":
    case "year":
      return pointSpan(date);
    case "circa": {
      const base = pointSpan(date.value);
      const tolerance = date.toleranceYears ?? 1;
      return {
        earliest: base.earliest - tolerance * 400,
        latest: base.latest + tolerance * 400,
      };
    }
    case "before": {
      const boundary = pointSpan(date.value);
      return { earliest: Number.NEGATIVE_INFINITY, latest: boundary.earliest - 1 };
    }
    case "after": {
      const boundary = pointSpan(date.value);
      return { earliest: boundary.latest + 1, latest: Number.POSITIVE_INFINITY };
    }
    case "range":
      return { earliest: pointSpan(date.start).earliest, latest: pointSpan(date.end).latest };
    case "unknown":
      return undefined;
  }
}

const byPersonName = <T extends { readonly person: Person }>(first: T, second: T): number =>
  first.person.canonicalName.localeCompare(second.person.canonicalName) ||
  first.person.id.localeCompare(second.person.id);

const byEventDate = (first: Event, second: Event): number => {
  const firstSpan = dateSpan(first.date);
  const secondSpan = dateSpan(second.date);
  if (!firstSpan && !secondSpan) return first.id.localeCompare(second.id);
  if (!firstSpan) return 1;
  if (!secondSpan) return -1;
  return firstSpan.earliest - secondSpan.earliest || firstSpan.latest - secondSpan.latest || first.id.localeCompare(second.id);
};

const relationshipPersonIds = (relationship: Relationship): readonly [PersonId, PersonId] =>
  relationship.type === "parent-child"
    ? [relationship.parentId, relationship.childId]
    : relationship.personIds;

const lifeEvidenceEventTypes = new Set<Event["type"]>([
  "birth",
  "baptism",
  "residence",
  "census",
  "marriage",
  "migration",
  "military",
  "occupation",
  "death",
]);

export function createGenealogyQueries(
  graph: GenealogyGraph,
  options: GenealogyQueryOptions = {},
): GenealogyQueries {
  const focalPersonId = options.focalPersonId ?? MICHAEL_BUQUET_ID;
  const maternalRootId = options.maternalRootId ?? MATERNAL_ROOT_ID;
  const paternalRootId = options.paternalRootId ?? PATERNAL_ROOT_ID;
  const includedStatuses = new Set<ResearchStatus>(options.researchStatuses ?? ["accepted"]);

  const peopleById = new Map<PersonId, Person>();
  const personAliases = new Map<PersonId, PersonId>();
  for (const person of graph.people) {
    peopleById.set(person.id, person);
    for (const alias of person.idAliases ?? []) personAliases.set(alias, person.id);
  }
  const placesById = new Map<PlaceId, Place>();
  const placeAliases = new Map<PlaceId, PlaceId>();
  for (const place of graph.places) {
    placesById.set(place.id, place);
    for (const alias of place.idAliases ?? []) placeAliases.set(alias, place.id);
  }
  const sourcesById = new Map<SourceId, Source>();
  const sourceAliases = new Map<SourceId, SourceId>();
  for (const source of graph.sources) {
    sourcesById.set(source.id, source);
    for (const alias of source.idAliases ?? []) sourceAliases.set(alias, source.id);
  }
  const eventsById = new Map<EventId, Event>(graph.events.map((event) => [event.id, event]));

  const includedRelationships = graph.relationships.filter(({ researchStatus }) =>
    includedStatuses.has(researchStatus),
  );
  const includedEvents = graph.events.filter(({ researchStatus }) => includedStatuses.has(researchStatus));

  const canonicalPersonId = (id: PersonId): PersonId => personAliases.get(id) ?? id;
  const canonicalPlaceId = (id: PlaceId): PlaceId => placeAliases.get(id) ?? id;
  const canonicalSourceId = (id: SourceId): SourceId => sourceAliases.get(id) ?? id;
  const personById = (id: PersonId): Person | undefined => peopleById.get(canonicalPersonId(id));

  const makePath = (
    personIds: readonly PersonId[],
    relationships: readonly Relationship[],
  ): GenealogyPath => ({
    people: personIds.map((id) => peopleById.get(id)).filter((person): person is Person => Boolean(person)),
    relationships,
    confidence: weakestConfidence(relationships, peopleById.get(personIds[0])?.confidence ?? "unresolved"),
  });

  const parents = (id: PersonId): readonly RelatedPerson[] => {
    const canonical = canonicalPersonId(id);
    return includedRelationships
      .filter(
        (relationship): relationship is ParentChildRelationship =>
          relationship.type === "parent-child" && relationship.childId === canonical,
      )
      .flatMap((relationship): RelatedPerson[] => {
        const person = peopleById.get(relationship.parentId);
        return person ? [{ person, relationship }] : [];
      })
      .sort(byPersonName);
  };

  const children = (id: PersonId): readonly RelatedPerson[] => {
    const canonical = canonicalPersonId(id);
    return includedRelationships
      .filter(
        (relationship): relationship is ParentChildRelationship =>
          relationship.type === "parent-child" && relationship.parentId === canonical,
      )
      .flatMap((relationship): RelatedPerson[] => {
        const person = peopleById.get(relationship.childId);
        return person ? [{ person, relationship }] : [];
      })
      .sort(byPersonName);
  };

  const spousesAndPartners = (id: PersonId): readonly RelatedPerson[] => {
    const canonical = canonicalPersonId(id);
    return includedRelationships
      .filter(
        (relationship): relationship is CoupleRelationship =>
          relationship.type !== "parent-child" && relationship.personIds.includes(canonical),
      )
      .flatMap((relationship): RelatedPerson[] => {
        const otherId = relationship.personIds.find((personId) => personId !== canonical);
        const person = otherId ? peopleById.get(otherId) : undefined;
        return person ? [{ person, relationship }] : [];
      })
      .sort(byPersonName);
  };

  const traverse = (
    id: PersonId,
    direction: "ancestors" | "descendants",
    traversalOptions: TraversalOptions = {},
  ): readonly TraversalMatch[] => {
    const startId = canonicalPersonId(id);
    if (!peopleById.has(startId)) return [];
    const maxDepth = Math.max(0, traversalOptions.maxDepth ?? graph.people.length);
    const queue: Array<{
      personIds: PersonId[];
      relationships: Relationship[];
    }> = [{ personIds: [startId], relationships: [] }];
    const found = new Map<PersonId, GenealogyPath[]>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.relationships.length >= maxDepth) continue;
      const currentId = current.personIds[current.personIds.length - 1];
      const edges = includedRelationships.filter((relationship) => {
        if (relationship.type !== "parent-child") return false;
        return direction === "ancestors"
          ? relationship.childId === currentId
          : relationship.parentId === currentId;
      });
      for (const relationship of edges) {
        if (relationship.type !== "parent-child") continue;
        const nextId = direction === "ancestors" ? relationship.parentId : relationship.childId;
        if (current.personIds.includes(nextId)) continue;
        const personIds = [...current.personIds, nextId];
        const relationships = [...current.relationships, relationship];
        found.set(nextId, [...(found.get(nextId) ?? []), makePath(personIds, relationships)]);
        queue.push({ personIds, relationships });
      }
    }

    return [...found.entries()]
      .map(([personId, paths]) => ({
        person: peopleById.get(personId)!,
        depth: Math.min(...paths.map(({ relationships }) => relationships.length)),
        paths,
      }))
      .sort((first, second) => first.depth - second.depth || byPersonName(first, second));
  };

  const ancestors = (id: PersonId, traversalOptions?: TraversalOptions): readonly TraversalMatch[] =>
    traverse(id, "ancestors", traversalOptions);

  const descendants = (id: PersonId, traversalOptions?: TraversalOptions): readonly TraversalMatch[] =>
    traverse(id, "descendants", traversalOptions);

  const siblings = (id: PersonId): readonly SiblingMatch[] => {
    const canonical = canonicalPersonId(id);
    const matches = new Map<PersonId, SharedParentEvidence[]>();
    for (const parentMatch of parents(canonical)) {
      for (const siblingMatch of children(parentMatch.person.id)) {
        if (siblingMatch.person.id === canonical) continue;
        matches.set(siblingMatch.person.id, [
          ...(matches.get(siblingMatch.person.id) ?? []),
          {
            parent: parentMatch.person,
            subjectRelationship: parentMatch.relationship,
            siblingRelationship: siblingMatch.relationship,
          },
        ]);
      }
    }
    return [...matches.entries()]
      .map(([personId, sharedParents]) => ({ person: peopleById.get(personId)!, sharedParents }))
      .sort(byPersonName);
  };

  const relationshipPathToMichael = (id: PersonId): RelationshipPathResult | undefined => {
    const startId = canonicalPersonId(id);
    const targetId = canonicalPersonId(focalPersonId);
    const person = peopleById.get(startId);
    const focalPerson = peopleById.get(targetId);
    if (!person || !focalPerson) return undefined;
    if (startId === targetId) {
      return { person, focalPerson, distance: 0, paths: [makePath([startId], [])] };
    }

    const queue: Array<{ personIds: PersonId[]; relationships: Relationship[] }> = [
      { personIds: [startId], relationships: [] },
    ];
    const shortestPaths: GenealogyPath[] = [];
    let shortestDistance = Number.POSITIVE_INFINITY;
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.relationships.length >= shortestDistance) continue;
      const currentId = current.personIds[current.personIds.length - 1];
      for (const relationship of includedRelationships) {
        const [first, second] = relationshipPersonIds(relationship);
        const nextId = first === currentId ? second : second === currentId ? first : undefined;
        if (!nextId || current.personIds.includes(nextId)) continue;
        const personIds = [...current.personIds, nextId];
        const relationships = [...current.relationships, relationship];
        if (nextId === targetId) {
          shortestDistance = relationships.length;
          shortestPaths.push(makePath(personIds, relationships));
        } else if (relationships.length < shortestDistance) {
          queue.push({ personIds, relationships });
        }
      }
    }
    if (shortestPaths.length === 0) return undefined;
    return {
      person,
      focalPerson,
      distance: shortestDistance,
      paths: shortestPaths.filter(({ relationships }) => relationships.length === shortestDistance),
    };
  };

  const branchForPerson = (id: PersonId): BranchResult | undefined => {
    const person = personById(id);
    if (!person) return undefined;
    if (person.id === canonicalPersonId(focalPersonId)) {
      return { person, classification: "self", memberships: [] };
    }
    const memberships: BranchMembership[] = [];
    for (const [branch, rootId] of [
      ["maternal", maternalRootId],
      ["paternal", paternalRootId],
    ] as const) {
      const root = personById(rootId);
      if (!root) continue;
      if (root.id === person.id) {
        memberships.push({ branch, paths: [makePath([root.id], [])] });
        continue;
      }
      const match = ancestors(root.id).find(({ person: ancestor }) => ancestor.id === person.id);
      if (match) memberships.push({ branch, paths: match.paths });
    }
    const classification: BranchClassification =
      memberships.length === 2
        ? "both"
        : memberships[0]?.branch ?? "unclassified";
    return { person, classification, memberships };
  };

  const peopleBySurname = (surname: string): readonly SurnameMatch[] => {
    const query = normalizeText(surname);
    if (!query) return [];
    const matches: SurnameMatch[] = [];
    for (const person of graph.people) {
      if (!includedStatuses.has(person.researchStatus)) continue;
      const names: SurnameNameMatch[] = [
        {
          name: person.canonicalName,
          type: "canonical",
          confidence: person.confidence,
          sourceRefs: person.sourceRefs,
        },
        ...person.alternateNames.map((name) => ({
          name: name.name,
          type: name.type,
          confidence: name.confidence,
          sourceRefs: name.sourceRefs,
        })),
      ];
      const matchedNames = names.filter((name) => {
        const normalized = normalizeText(name.name);
        return normalized === query || normalized.endsWith(` ${query}`);
      });
      if (matchedNames.length > 0) matches.push({ person, matchedNames });
    }
    return matches.sort(byPersonName);
  };

  const selectedPlaceIds = (id: PlaceId, queryOptions: PlaceQueryOptions): Set<PlaceId> => {
    const canonical = canonicalPlaceId(id);
    if (!placesById.has(canonical)) return new Set();
    const selected = new Set<PlaceId>([canonical]);
    if (!queryOptions.includeDescendantPlaces) return selected;
    let changed = true;
    while (changed) {
      changed = false;
      for (const place of graph.places) {
        const parent = place.parentPlaceId ? canonicalPlaceId(place.parentPlaceId) : undefined;
        if (parent && selected.has(parent) && !selected.has(place.id)) {
          selected.add(place.id);
          changed = true;
        }
      }
    }
    return selected;
  };

  const eventsByPlace = (
    id: PlaceId,
    queryOptions: PlaceQueryOptions = {},
  ): readonly EventPlaceMatch[] => {
    const selected = selectedPlaceIds(id, queryOptions);
    if (selected.size === 0) return [];
    const matches: EventPlaceMatch[] = [];
    for (const event of includedEvents) {
      const roles = new Set<PlaceAssociationRole>();
      const matchedPlaceIds = new Set<PlaceId>();
      if (event.placeId && selected.has(canonicalPlaceId(event.placeId))) {
        roles.add("event-location");
        matchedPlaceIds.add(canonicalPlaceId(event.placeId));
      }
      for (const placeId of event.migration?.fromPlaceIds ?? []) {
        const canonical = canonicalPlaceId(placeId);
        if (selected.has(canonical)) {
          roles.add("migration-origin");
          matchedPlaceIds.add(canonical);
        }
      }
      for (const placeId of event.migration?.toPlaceIds ?? []) {
        const canonical = canonicalPlaceId(placeId);
        if (selected.has(canonical)) {
          roles.add("migration-destination");
          matchedPlaceIds.add(canonical);
        }
      }
      if (roles.size > 0) {
        matches.push({ event, roles: [...roles], matchedPlaceIds: [...matchedPlaceIds] });
      }
    }
    return matches.sort((first, second) => byEventDate(first.event, second.event));
  };

  const peopleAssociatedWithPlace = (
    id: PlaceId,
    queryOptions: PlaceQueryOptions = {},
  ): readonly PersonPlaceMatch[] => {
    const people = new Map<PersonId, PersonPlaceAssociation[]>();
    for (const match of eventsByPlace(id, queryOptions)) {
      for (const personId of match.event.personIds) {
        const canonical = canonicalPersonId(personId);
        const person = peopleById.get(canonical);
        if (!person) continue;
        people.set(canonical, [
          ...(people.get(canonical) ?? []),
          { event: match.event, roles: match.roles, matchedPlaceIds: match.matchedPlaceIds },
        ]);
      }
    }
    return [...people.entries()]
      .map(([personId, associations]) => ({ person: peopleById.get(personId)!, associations }))
      .sort(byPersonName);
  };

  const eventsByPerson = (id: PersonId): readonly Event[] => {
    const canonical = canonicalPersonId(id);
    if (!peopleById.has(canonical)) return [];
    return includedEvents
      .filter((event) => event.personIds.some((personId) => canonicalPersonId(personId) === canonical))
      .sort(byEventDate);
  };

  const eventsByDate = (date: HistoricalDate): EventsByDateResult => {
    const querySpan = dateSpan(date);
    if (!querySpan) {
      return {
        query: date,
        matches: includedEvents
          .filter((event) => !dateSpan(event.date))
          .sort(byEventDate)
          .map((event) => ({ event, match: "contained" })),
        indeterminate: [],
      };
    }
    const matches: EventDateMatch[] = [];
    const indeterminate: Event[] = [];
    for (const event of includedEvents) {
      const eventSpan = dateSpan(event.date);
      if (!eventSpan) {
        indeterminate.push(event);
        continue;
      }
      if (eventSpan.latest < querySpan.earliest || eventSpan.earliest > querySpan.latest) continue;
      const match: DateMatchKind =
        eventSpan.earliest >= querySpan.earliest && eventSpan.latest <= querySpan.latest
          ? "contained"
          : "overlaps";
      matches.push({ event, match });
    }
    return {
      query: date,
      matches: matches.sort((first, second) => byEventDate(first.event, second.event)),
      indeterminate: indeterminate.sort(byEventDate),
    };
  };

  const peopleAliveInYear = (year: number): PeopleAliveInYearResult => {
    if (!Number.isInteger(year) || year < 1 || year > 9999) {
      throw new RangeError("Year must be an integer from 1 through 9999.");
    }
    const yearSpan = dateSpan({ kind: "year", year })!;
    const matches: AliveInYearMatch[] = [];
    const indeterminate: AliveInYearIndeterminate[] = [];
    const excluded: AliveInYearExcluded[] = [];

    for (const person of graph.people) {
      if (!includedStatuses.has(person.researchStatus)) continue;
      const events = eventsByPerson(person.id);
      const birthEvents = events.filter((event) => event.type === "birth" && dateSpan(event.date));
      const deathEvents = events.filter((event) => event.type === "death" && dateSpan(event.date));
      const directEvents = events.filter((event) => {
        if (!lifeEvidenceEventTypes.has(event.type)) return false;
        const span = dateSpan(event.date);
        return Boolean(span && span.earliest >= yearSpan.earliest && span.latest <= yearSpan.latest);
      });
      const birthSpans = birthEvents.map((event) => dateSpan(event.date)!);
      const deathSpans = deathEvents.map((event) => dateSpan(event.date)!);
      const directNonVitalEvents = directEvents.filter(
        ({ type }) => type !== "birth" && type !== "death",
      );
      const everySpanOverlapsYear = (spans: readonly DateSpan[]): boolean =>
        spans.every(
          (span) => span.latest >= yearSpan.earliest && span.earliest <= yearSpan.latest,
        );
      const directVitalEventIsConsistent =
        (directEvents.some(({ type }) => type === "birth") && everySpanOverlapsYear(birthSpans)) ||
        (directEvents.some(({ type }) => type === "death") && everySpanOverlapsYear(deathSpans));
      if (directNonVitalEvents.length > 0 || directVitalEventIsConsistent) {
        matches.push({
          person,
          temporalStatus: "supported",
          basis: "dated-event",
          evidenceEvents: directNonVitalEvents.length > 0 ? directNonVitalEvents : directEvents,
        });
        continue;
      }
      if (birthSpans.length > 0 && birthSpans.every((span) => span.earliest > yearSpan.latest)) {
        excluded.push({ person, reason: "born-after-year", evidenceEvents: birthEvents });
        continue;
      }
      if (deathSpans.length > 0 && deathSpans.every((span) => span.latest < yearSpan.earliest)) {
        excluded.push({ person, reason: "died-before-year", evidenceEvents: deathEvents });
        continue;
      }
      if (birthSpans.length === 0) {
        indeterminate.push({ person, reason: "missing-birth" });
        continue;
      }
      if (deathSpans.length === 0) {
        indeterminate.push({ person, reason: "missing-death" });
        continue;
      }

      const definitelyBorn = birthSpans.every((span) => span.latest <= yearSpan.latest);
      const definitelyNotDeadBefore = deathSpans.every((span) => span.earliest >= yearSpan.earliest);
      if (definitelyBorn && definitelyNotDeadBefore) {
        matches.push({
          person,
          temporalStatus: "supported",
          basis: "bounded-lifespan",
          evidenceEvents: [...birthEvents, ...deathEvents],
        });
        continue;
      }
      const possiblyBorn = birthSpans.some((span) => span.earliest <= yearSpan.latest);
      const possiblyNotDeadBefore = deathSpans.some((span) => span.latest >= yearSpan.earliest);
      if (possiblyBorn && possiblyNotDeadBefore) {
        matches.push({
          person,
          temporalStatus: "possible",
          basis: "overlapping-lifespan",
          evidenceEvents: [...birthEvents, ...deathEvents],
        });
      } else {
        indeterminate.push({ person, reason: "open-or-conflicting-bounds" });
      }
    }
    return {
      year,
      matches: matches.sort(byPersonName),
      indeterminate: indeterminate.sort(byPersonName),
      excluded: excluded.sort(byPersonName),
    };
  };

  const sourceSupport = (entries: readonly SourceSupportVia[]): readonly SourceSupport[] => {
    const grouped = new Map<SourceId, SourceSupportVia[]>();
    for (const entry of entries) {
      const sourceId = canonicalSourceId(entry.reference.sourceId);
      if (!sourcesById.has(sourceId)) continue;
      grouped.set(sourceId, [...(grouped.get(sourceId) ?? []), entry]);
    }
    return [...grouped.entries()]
      .map(([sourceId, via]) => ({ source: sourcesById.get(sourceId)!, via }))
      .sort((first, second) => first.source.title.localeCompare(second.source.title));
  };

  const sourcesSupportingPerson = (id: PersonId): readonly SourceSupport[] => {
    const person = personById(id);
    if (!person) return [];
    const via: SourceSupportVia[] = person.sourceRefs.map((reference) => ({
      kind: "person",
      entityId: person.id,
      reference,
    }));
    for (const alternateName of person.alternateNames) {
      for (const reference of alternateName.sourceRefs) {
        via.push({ kind: "alternate-name", entityId: person.id, reference, detail: alternateName.name });
      }
    }
    for (const relationship of includedRelationships) {
      if (!relationshipPersonIds(relationship).includes(person.id)) continue;
      for (const reference of relationship.sourceRefs) {
        via.push({ kind: "relationship", entityId: relationship.id, reference });
      }
    }
    for (const event of eventsByPerson(person.id)) {
      for (const reference of event.sourceRefs) {
        via.push({ kind: "event", entityId: event.id, reference });
      }
    }
    return sourceSupport(via);
  };

  const sourcesSupportingEvent = (id: EventId): readonly SourceSupport[] => {
    const event = eventsById.get(id);
    if (!event || !includedStatuses.has(event.researchStatus)) return [];
    return sourceSupport(
      event.sourceRefs.map((reference) => ({ kind: "event", entityId: event.id, reference })),
    );
  };

  return {
    personById,
    parents,
    children,
    spousesAndPartners,
    ancestors,
    descendants,
    siblings,
    relationshipPathToMichael,
    branchForPerson,
    peopleBySurname,
    peopleAssociatedWithPlace,
    peopleAliveInYear,
    eventsByPerson,
    eventsByDate,
    eventsByPlace,
    sourcesSupportingPerson,
    sourcesSupportingEvent,
  };
}
