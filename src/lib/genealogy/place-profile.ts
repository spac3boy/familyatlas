import { formatPersonDetailDate } from "@/lib/genealogy/person-detail";
import {
  formatRecordedSurnameLabel,
  recordedSurnamesForPerson,
  type DirectorySurname,
} from "@/lib/genealogy/people-directory";
import {
  createGenealogyQueries,
  type GenealogyQueries,
  type PlaceAssociationRole,
} from "@/lib/genealogy/queries";
import type {
  Confidence,
  AlternateNameType,
  Event,
  EventId,
  GenealogyGraph,
  HistoricalDate,
  LocationPrecision,
  MovementClassification,
  Person,
  Place,
  PlaceId,
  Source,
  SourceId,
} from "@/types";

export type PlaceAssociationScope = "direct" | "within-child-place";

export interface PlaceProfileEvent {
  readonly event: Event;
  readonly title: string;
  readonly dateLabel?: string;
  readonly people: readonly Person[];
  readonly matchedPlaces: readonly Place[];
  readonly roles: readonly PlaceAssociationRole[];
  readonly scope: PlaceAssociationScope;
}

export interface PlaceProfilePerson {
  readonly person: Person;
  readonly surnames: readonly DirectorySurname[];
  readonly associations: readonly {
    readonly eventId: EventId;
    readonly title: string;
    readonly roles: readonly PlaceAssociationRole[];
    readonly scope: PlaceAssociationScope;
  }[];
}

export interface PlaceProfileSurname {
  readonly value: string;
  readonly label: string;
  readonly displayLabel: string;
  readonly people: readonly Person[];
  readonly confidenceStates: readonly Confidence[];
}

export interface PlaceProfileSource {
  readonly source: Source;
  readonly supportsPlace: boolean;
  readonly eventIds: readonly EventId[];
}

export interface PlaceProfileMovement {
  readonly event: Event;
  readonly label: string;
  readonly classification: MovementClassification;
  readonly classificationLabel: string;
  readonly dateLabel?: string;
  readonly people: readonly Person[];
  readonly fromPlaces: readonly Place[];
  readonly toPlaces: readonly Place[];
  readonly scope: PlaceAssociationScope;
}

export interface PlaceDateRange {
  readonly label: string;
  readonly datedEventCount: number;
  readonly undatedEventCount: number;
  readonly firstEventId?: EventId;
  readonly lastEventId?: EventId;
}

export interface PlaceProfileModel {
  readonly place: Place;
  readonly context: string;
  readonly precisionLabel: string;
  readonly parentPlace?: Place;
  readonly childPlaces: readonly Place[];
  readonly events: readonly PlaceProfileEvent[];
  readonly directEventCount: number;
  readonly people: readonly PlaceProfilePerson[];
  readonly surnames: readonly PlaceProfileSurname[];
  readonly sources: readonly PlaceProfileSource[];
  readonly movements: readonly PlaceProfileMovement[];
  readonly dateRange: PlaceDateRange;
}

export interface PlaceIndexGroup {
  readonly label: string;
  readonly places: readonly PlaceProfileModel[];
}

const confidenceOrder: readonly Confidence[] = ["verified", "probable", "unresolved"];

const titleCase = (value: string): string =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const placeEventTitle = (event: Event): string => event.title ?? titleCase(event.type);

export function placePrecisionLabel(precision: LocationPrecision): string {
  switch (precision) {
    case "exact-documented-location":
      return "Exact named location";
    case "town-city":
      return "Town / city";
    case "parish-county":
      return "Parish / county";
    case "state-province-region":
      return "State / province / region";
    case "country":
      return "Country";
    case "probable-location":
      return "Probable location";
    case "mentioned-insufficient-precision":
      return "Location mentioned; precision unresolved";
  }
}

export function movementClassificationLabel(classification: MovementClassification): string {
  switch (classification) {
    case "documented-migration-move":
      return "Documented movement";
    case "strongly-inferred-move":
      return "Strongly inferred movement";
    case "separate-known-locations-route-unknown":
      return "Known locations; route unknown";
  }
}

export function formatPlaceContext(place: Place): string {
  return [place.settlement, place.parishCounty, place.stateProvinceRegion, place.country]
    .filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index)
    .filter((value) => value !== place.modernName)
    .join(", ");
}

interface SortableDate {
  readonly start: number;
  readonly end: number;
}

const datePointOrdinal = (
  point: Extract<HistoricalDate, { kind: "exact" | "year" }>,
  edge: "start" | "end",
): number => {
  if (point.kind === "year") return point.year * 400 + (edge === "start" ? 33 : 399);
  const [year, month, day] = point.value.split("-").map(Number);
  return year * 400 + month * 32 + day;
};

function sortableDate(date: HistoricalDate): SortableDate | undefined {
  switch (date.kind) {
    case "exact": {
      const ordinal = datePointOrdinal(date, "start");
      return { start: ordinal, end: ordinal };
    }
    case "year":
      return {
        start: datePointOrdinal(date, "start"),
        end: datePointOrdinal(date, "end"),
      };
    case "circa": {
      const tolerance = date.toleranceYears ?? 1;
      return {
        start: datePointOrdinal(date.value, "start") - tolerance * 400,
        end: datePointOrdinal(date.value, "end") + tolerance * 400,
      };
    }
    case "before":
      return {
        start: Number.NEGATIVE_INFINITY,
        end: datePointOrdinal(date.value, "start"),
      };
    case "after":
      return {
        start: datePointOrdinal(date.value, "end"),
        end: Number.POSITIVE_INFINITY,
      };
    case "range":
      return {
        start: datePointOrdinal(date.start, "start"),
        end: datePointOrdinal(date.end, "end"),
      };
    case "unknown":
      return undefined;
  }
}

function dateBoundaryLabel(date: HistoricalDate, edge: "start" | "end"): string | undefined {
  const pointLabel = (
    point: Extract<HistoricalDate, { kind: "exact" | "year" }>,
  ): string => formatPersonDetailDate(point) ?? point.originalText ?? "Date not established";
  switch (date.kind) {
    case "exact":
    case "year":
      return pointLabel(date);
    case "circa":
      return `circa ${pointLabel(date.value)}`;
    case "before":
      return `before ${pointLabel(date.value)}`;
    case "after":
      return `after ${pointLabel(date.value)}`;
    case "range":
      return pointLabel(edge === "start" ? date.start : date.end);
    case "unknown":
      return undefined;
  }
}

function placeDateRange(events: readonly PlaceProfileEvent[]): PlaceDateRange {
  const dated = events
    .flatMap((entry) => {
      const bounds = sortableDate(entry.event.date);
      const label = formatPersonDetailDate(entry.event.date);
      return bounds && label ? [{ entry, bounds, label }] : [];
    })
    .sort(
      (first, second) =>
        first.bounds.start - second.bounds.start ||
        first.bounds.end - second.bounds.end ||
        first.entry.event.id.localeCompare(second.entry.event.id),
    );
  const undatedEventCount = events.length - dated.length;
  if (dated.length === 0) {
    return { label: "Dates not established", datedEventCount: 0, undatedEventCount };
  }

  const first = dated[0];
  const last = [...dated].sort(
    (firstEntry, secondEntry) =>
      secondEntry.bounds.end - firstEntry.bounds.end ||
      secondEntry.bounds.start - firstEntry.bounds.start ||
      firstEntry.entry.event.id.localeCompare(secondEntry.entry.event.id),
  )[0];
  const firstLabel = dateBoundaryLabel(first.entry.event.date, "start") ?? first.label;
  const lastLabel = dateBoundaryLabel(last.entry.event.date, "end") ?? last.label;
  return {
    label:
      first.entry.event.id === last.entry.event.id
        ? first.label
        : firstLabel === lastLabel
          ? firstLabel
          : `${firstLabel} to ${lastLabel}`,
    datedEventCount: dated.length,
    undatedEventCount,
    firstEventId: first.entry.event.id,
    lastEventId: last.entry.event.id,
  };
}

const placeForId = (
  placesById: ReadonlyMap<PlaceId, Place>,
  id: PlaceId,
): Place | undefined => placesById.get(id);

export function buildPlaceProfileModel(
  graph: GenealogyGraph,
  placeId: PlaceId,
  suppliedQueries?: GenealogyQueries,
): PlaceProfileModel | undefined {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const place = graph.places.find(
    (candidate) => candidate.id === placeId || candidate.idAliases?.includes(placeId),
  );
  if (!place || place.researchStatus !== "accepted") return undefined;

  const placesById = new Map<PlaceId, Place>(graph.places.map((candidate) => [candidate.id, candidate]));
  const peopleById = new Map(graph.people.map((person) => [person.id, person]));
  const sourcesById = new Map<SourceId, Source>();
  for (const source of graph.sources) {
    sourcesById.set(source.id, source);
    for (const alias of source.idAliases ?? []) sourcesById.set(alias, source);
  }

  const events = queries
    .eventsByPlace(place.id, { includeDescendantPlaces: true })
    .map((match): PlaceProfileEvent => {
      const matchedPlaces = match.matchedPlaceIds.flatMap((id) => {
        const matched = placeForId(placesById, id);
        return matched ? [matched] : [];
      });
      return {
        event: match.event,
        title: placeEventTitle(match.event),
        dateLabel: formatPersonDetailDate(match.event.date),
        people: match.event.personIds.flatMap((id) => {
          const person = peopleById.get(id);
          return person?.researchStatus === "accepted" ? [person] : [];
        }),
        matchedPlaces,
        roles: match.roles,
        scope: match.matchedPlaceIds.includes(place.id) ? "direct" : "within-child-place",
      };
    });

  const peopleParts = new Map<
    Person["id"],
    { person: Person; associations: PlaceProfilePerson["associations"] }
  >();
  for (const entry of events) {
    for (const person of entry.people) {
      const current = peopleParts.get(person.id) ?? { person, associations: [] };
      peopleParts.set(person.id, {
        person,
        associations: [
          ...current.associations,
          {
            eventId: entry.event.id,
            title: entry.title,
            roles: entry.roles,
            scope: entry.scope,
          },
        ],
      });
    }
  }
  const people = [...peopleParts.values()]
    .map(({ person, associations }) => ({
      person,
      surnames: recordedSurnamesForPerson(person),
      associations,
    }))
    .sort((first, second) => first.person.canonicalName.localeCompare(second.person.canonicalName));

  const surnameParts = new Map<
    string,
    {
      label: string;
      isCanonical: boolean;
      alternateNameTypes: Set<AlternateNameType>;
      people: Map<Person["id"], Person>;
      confidenceStates: Set<Confidence>;
    }
  >();
  for (const personEntry of people) {
    for (const surname of personEntry.surnames) {
      const current = surnameParts.get(surname.value) ?? {
        label: surname.label,
        isCanonical: false,
        alternateNameTypes: new Set<AlternateNameType>(),
        people: new Map(),
        confidenceStates: new Set(),
      };
      current.isCanonical ||= surname.isCanonical;
      surname.alternateNameTypes.forEach((type) => current.alternateNameTypes.add(type));
      current.people.set(personEntry.person.id, personEntry.person);
      surname.confidenceStates.forEach((confidence) => current.confidenceStates.add(confidence));
      surnameParts.set(surname.value, current);
    }
  }
  const surnames = [...surnameParts.entries()]
    .map(([value, current]) => ({
      value,
      label: current.label,
      displayLabel: formatRecordedSurnameLabel({
        label: current.label,
        isCanonical: current.isCanonical,
        alternateNameTypes: [...current.alternateNameTypes],
      }),
      people: [...current.people.values()].sort((first, second) =>
        first.canonicalName.localeCompare(second.canonicalName),
      ),
      confidenceStates: confidenceOrder.filter((confidence) =>
        current.confidenceStates.has(confidence),
      ),
    }))
    .sort((first, second) => first.label.localeCompare(second.label));

  const sourceParts = new Map<
    SourceId,
    { source: Source; supportsPlace: boolean; eventIds: Set<EventId> }
  >();
  const addSource = (sourceId: SourceId, supportsPlace: boolean, eventId?: EventId) => {
    const source = sourcesById.get(sourceId);
    if (!source) return;
    const current = sourceParts.get(source.id) ?? {
      source,
      supportsPlace: false,
      eventIds: new Set<EventId>(),
    };
    if (eventId) current.eventIds.add(eventId);
    sourceParts.set(source.id, {
      ...current,
      supportsPlace: current.supportsPlace || supportsPlace,
    });
  };
  place.sourceRefs.forEach(({ sourceId }) => addSource(sourceId, true));
  events.forEach(({ event }) =>
    event.sourceRefs.forEach(({ sourceId }) => addSource(sourceId, false, event.id)),
  );
  const sources = [...sourceParts.values()]
    .map(({ source, supportsPlace, eventIds }) => ({
      source,
      supportsPlace,
      eventIds: [...eventIds],
    }))
    .sort((first, second) => first.source.title.localeCompare(second.source.title));

  const movements = events.flatMap((entry): PlaceProfileMovement[] => {
    if (!entry.event.migration) return [];
    return [
      {
        event: entry.event,
        label: entry.title,
        classification: entry.event.migration.classification,
        classificationLabel: movementClassificationLabel(entry.event.migration.classification),
        dateLabel: entry.dateLabel,
        people: entry.people,
        fromPlaces: entry.event.migration.fromPlaceIds.flatMap((id) => {
          const from = placeForId(placesById, id);
          return from ? [from] : [];
        }),
        toPlaces: entry.event.migration.toPlaceIds.flatMap((id) => {
          const to = placeForId(placesById, id);
          return to ? [to] : [];
        }),
        scope: entry.scope,
      },
    ];
  });

  return {
    place,
    context: formatPlaceContext(place),
    precisionLabel: placePrecisionLabel(place.precision),
    parentPlace: place.parentPlaceId ? placesById.get(place.parentPlaceId) : undefined,
    childPlaces: graph.places
      .filter(
        (candidate) =>
          candidate.parentPlaceId === place.id && candidate.researchStatus === "accepted",
      )
      .sort((first, second) => first.modernName.localeCompare(second.modernName)),
    events,
    directEventCount: events.filter(({ scope }) => scope === "direct").length,
    people,
    surnames,
    sources,
    movements,
    dateRange: placeDateRange(events),
  };
}

function placeGroupLabel(place: Place): string {
  if (place.country === "United States" && place.stateProvinceRegion) {
    return `${place.stateProvinceRegion} · United States`;
  }
  return place.country ?? place.stateProvinceRegion ?? "Historical geography";
}

export function buildPlaceIndexGroups(
  graph: GenealogyGraph,
  suppliedQueries?: GenealogyQueries,
): readonly PlaceIndexGroup[] {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const groups = new Map<string, PlaceProfileModel[]>();
  for (const place of graph.places) {
    const profile = buildPlaceProfileModel(graph, place.id, queries);
    if (!profile) continue;
    const label = placeGroupLabel(place);
    groups.set(label, [...(groups.get(label) ?? []), profile]);
  }
  return [...groups.entries()]
    .map(([label, places]) => ({
      label,
      places: places.sort((first, second) =>
        first.place.modernName.localeCompare(second.place.modernName),
      ),
    }))
    .sort((first, second) => first.label.localeCompare(second.label));
}
