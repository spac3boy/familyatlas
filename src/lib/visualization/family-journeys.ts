import { geoNaturalEarth1, geoPath } from "d3-geo";
import { curveBasis, line } from "d3-shape";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

import type { PlaceMapAnchor } from "@/data/geography/place-map-anchors";
import { createGenealogyQueries, type GenealogyQueries } from "@/lib/genealogy/queries";
import { buildTimeSelectionEffects, type EventTimeState } from "@/lib/visualization/time-navigation";
import type {
  Event,
  EventId,
  GenealogyGraph,
  MovementClassification,
  Person,
  PersonId,
  Place,
  PlaceId,
} from "@/types";

export type FamilyJourneyScope = "all" | "maternal" | "paternal" | "selected";
export type JourneyPlaceCertainty = "documented" | "probable" | "mixed";

export interface FamilyJourneyOptions {
  readonly scope: FamilyJourneyScope;
  readonly selectedPersonId: PersonId | null;
  readonly selectedYear: number | null;
}

export interface JourneyPlacePoint {
  readonly anchorId: string;
  readonly coordinates: readonly [number, number];
  readonly anchorLabel: string;
  readonly precisionNotes: readonly string[];
  readonly places: readonly Place[];
  readonly events: readonly Event[];
  readonly people: readonly Person[];
  readonly certainty: JourneyPlaceCertainty;
  readonly timeState: "active" | "indeterminate";
  readonly unknownRouteEventIds: readonly EventId[];
}

export interface JourneyMovement {
  readonly event: Event;
  readonly people: readonly Person[];
  readonly classification: MovementClassification;
  readonly fromPlaces: readonly Place[];
  readonly toPlaces: readonly Place[];
  readonly fromAnchorId?: string;
  readonly toAnchorId?: string;
  readonly timeState: "active" | "indeterminate";
  /** Absent by design for separate known locations with an unknown route. */
  readonly shouldDrawPath: boolean;
}

export interface FamilyJourneyModel {
  readonly scope: FamilyJourneyScope;
  readonly selectedYear: number | null;
  readonly people: readonly Person[];
  readonly points: readonly JourneyPlacePoint[];
  readonly movements: readonly JourneyMovement[];
  readonly unmappedPlaces: readonly Place[];
}

export interface FamilyJourneyMapLayout {
  readonly width: number;
  readonly height: number;
  readonly countryPaths: readonly string[];
  readonly subdivisionPaths: readonly string[];
  readonly points: readonly (JourneyPlacePoint & { readonly x: number; readonly y: number })[];
  readonly movements: readonly (JourneyMovement & { readonly path?: string })[];
}

export interface JourneyPointCluster {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly points: readonly (JourneyPlacePoint & { readonly x: number; readonly y: number })[];
  readonly certainty: JourneyPlaceCertainty;
  readonly timeState: "active" | "indeterminate";
  readonly unknownRouteEventIds: readonly EventId[];
}

export type BoundaryFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;

function acceptedPeopleForScope(
  graph: GenealogyGraph,
  queries: GenealogyQueries,
  scope: FamilyJourneyScope,
  selectedPersonId: PersonId | null,
): readonly Person[] {
  const accepted = graph.people.filter(({ researchStatus }) => researchStatus === "accepted");
  if (scope === "all") return accepted;
  if (scope === "selected") {
    const selected = selectedPersonId ? queries.personById(selectedPersonId) : undefined;
    return selected?.researchStatus === "accepted" ? [selected] : [];
  }
  return accepted.filter((person) => {
    const branch = queries.branchForPerson(person.id);
    return branch?.classification === scope || branch?.classification === "both";
  });
}

function placeIdsForEvent(event: Event): readonly PlaceId[] {
  return [
    ...(event.placeId ? [event.placeId] : []),
    ...(event.migration?.fromPlaceIds ?? []),
    ...(event.migration?.toPlaceIds ?? []),
  ];
}

function certaintyForPlaces(places: readonly Place[]): JourneyPlaceCertainty {
  const documented = places.some(
    ({ confidence, precision }) =>
      confidence === "verified" &&
      precision !== "probable-location" &&
      precision !== "mentioned-insufficient-precision",
  );
  const probable = places.some(
    ({ confidence, precision }) =>
      confidence !== "verified" ||
      precision === "probable-location" ||
      precision === "mentioned-insufficient-precision",
  );
  if (documented && probable) return "mixed";
  return probable ? "probable" : "documented";
}

function eventTimeState(
  eventId: EventId,
  activeIds: ReadonlySet<EventId>,
  indeterminateIds: ReadonlySet<EventId>,
): "active" | "indeterminate" | undefined {
  if (activeIds.has(eventId)) return "active";
  if (indeterminateIds.has(eventId)) return "indeterminate";
  return undefined;
}

function primaryAnchor(
  placeIds: readonly PlaceId[],
  anchorByPlaceId: ReadonlyMap<PlaceId, PlaceMapAnchor>,
): PlaceMapAnchor | undefined {
  const rank = {
    "settlement-reference": 0,
    "administrative-reference": 1,
    "regional-reference": 2,
  } as const;
  return placeIds
    .map((placeId) => anchorByPlaceId.get(placeId))
    .filter((anchor): anchor is PlaceMapAnchor => Boolean(anchor))
    .sort((first, second) => rank[first.precision] - rank[second.precision])[0];
}

export function buildFamilyJourneyModel(
  graph: GenealogyGraph,
  anchors: readonly PlaceMapAnchor[],
  options: FamilyJourneyOptions,
  suppliedQueries?: GenealogyQueries,
): FamilyJourneyModel {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const people = acceptedPeopleForScope(
    graph,
    queries,
    options.scope,
    options.selectedPersonId,
  );
  const personIds = new Set(people.map(({ id }) => id));
  const placeById = new Map(graph.places.map((place) => [place.id, place]));
  const personById = new Map(graph.people.map((person) => [person.id, person]));
  const anchorByPlaceId = new Map(anchors.map((anchor) => [anchor.placeId, anchor]));
  const effects = buildTimeSelectionEffects(graph, options.selectedYear, queries);
  const activeIds = new Set(effects.map.activeEventIds);
  const indeterminateIds = new Set(effects.map.indeterminateEventIds);

  const events = graph.events.filter(
    (event) =>
      event.researchStatus === "accepted" &&
      event.personIds.some((personId) => personIds.has(personId)) &&
      eventTimeState(event.id, activeIds, indeterminateIds),
  );

  const movements = events.flatMap((event): JourneyMovement[] => {
    if (!event.migration) return [];
    const timeState = eventTimeState(event.id, activeIds, indeterminateIds);
    if (!timeState) return [];
    const fromAnchor = primaryAnchor(event.migration.fromPlaceIds, anchorByPlaceId);
    const toAnchor = primaryAnchor(event.migration.toPlaceIds, anchorByPlaceId);
    return [
      {
        event,
        people: event.personIds.flatMap((id) => (personById.get(id) ? [personById.get(id)!] : [])),
        classification: event.migration.classification,
        fromPlaces: event.migration.fromPlaceIds.flatMap((id) =>
          placeById.get(id) ? [placeById.get(id)!] : [],
        ),
        toPlaces: event.migration.toPlaceIds.flatMap((id) =>
          placeById.get(id) ? [placeById.get(id)!] : [],
        ),
        fromAnchorId: fromAnchor?.anchorId,
        toAnchorId: toAnchor?.anchorId,
        timeState,
        shouldDrawPath:
          event.migration.classification !== "separate-known-locations-route-unknown" &&
          Boolean(fromAnchor && toAnchor),
      },
    ];
  });

  const unknownRouteEventIdsByAnchor = new Map<string, Set<EventId>>();
  for (const movement of movements) {
    if (movement.classification !== "separate-known-locations-route-unknown") continue;
    for (const anchorId of [movement.fromAnchorId, movement.toAnchorId]) {
      if (!anchorId) continue;
      const ids = unknownRouteEventIdsByAnchor.get(anchorId) ?? new Set<EventId>();
      ids.add(movement.event.id);
      unknownRouteEventIdsByAnchor.set(anchorId, ids);
    }
  }

  const pointParts = new Map<
    string,
    { anchor: PlaceMapAnchor; places: Map<PlaceId, Place>; events: Map<EventId, Event>; people: Map<PersonId, Person>; timeStates: Set<"active" | "indeterminate">; precisionNotes: Set<string> }
  >();
  const unmapped = new Map<PlaceId, Place>();

  for (const event of events) {
    const timeState = eventTimeState(event.id, activeIds, indeterminateIds);
    if (!timeState) continue;
    for (const placeId of placeIdsForEvent(event)) {
      const place = placeById.get(placeId);
      if (!place) continue;
      const anchor = anchorByPlaceId.get(placeId);
      if (!anchor) {
        unmapped.set(place.id, place);
        continue;
      }
      const part = pointParts.get(anchor.anchorId) ?? {
        anchor,
        places: new Map(),
        events: new Map(),
        people: new Map(),
        timeStates: new Set(),
        precisionNotes: new Set(),
      };
      part.places.set(place.id, place);
      part.events.set(event.id, event);
      for (const personId of event.personIds) {
        const person = personById.get(personId);
        if (person && personIds.has(person.id)) part.people.set(person.id, person);
      }
      part.timeStates.add(timeState);
      part.precisionNotes.add(anchor.precisionNote);
      pointParts.set(anchor.anchorId, part);
    }
  }

  const points = [...pointParts.values()]
    .map(({ anchor, places, events: pointEvents, people: pointPeople, timeStates, precisionNotes }) => {
      const pointPlaces = [...places.values()].sort((a, b) => a.modernName.localeCompare(b.modernName));
      return {
        anchorId: anchor.anchorId,
        coordinates: anchor.coordinates,
        anchorLabel: anchor.anchorLabel,
        precisionNotes: [...precisionNotes],
        places: pointPlaces,
        events: [...pointEvents.values()],
        people: [...pointPeople.values()].sort((a, b) => a.canonicalName.localeCompare(b.canonicalName)),
        certainty: certaintyForPlaces(pointPlaces),
        timeState: timeStates.has("active") ? "active" : "indeterminate",
        unknownRouteEventIds: [...(unknownRouteEventIdsByAnchor.get(anchor.anchorId) ?? [])],
      } satisfies JourneyPlacePoint;
    })
    .sort((first, second) => first.anchorLabel.localeCompare(second.anchorLabel));

  return {
    scope: options.scope,
    selectedYear: options.selectedYear,
    people,
    points,
    movements,
    unmappedPlaces: [...unmapped.values()].sort((a, b) => a.modernName.localeCompare(b.modernName)),
  };
}

function schematicPath(
  source: readonly [number, number],
  target: readonly [number, number],
): string | undefined {
  const dx = target[0] - source[0];
  const dy = target[1] - source[1];
  const bend = Math.min(70, Math.max(18, Math.hypot(dx, dy) * 0.16));
  return (
    line<[number, number]>()
      .x((point) => point[0])
      .y((point) => point[1])
      .curve(curveBasis)([
        [source[0], source[1]],
        [(source[0] + target[0]) / 2, (source[1] + target[1]) / 2 - bend],
        [target[0], target[1]],
      ]) ?? undefined
  );
}

export function layoutFamilyJourneyMap(
  model: FamilyJourneyModel,
  countryBoundaries: BoundaryFeatureCollection,
  subdivisionBoundaries: BoundaryFeatureCollection,
  requestedWidth: number,
  requestedHeight: number,
  allAnchors: readonly PlaceMapAnchor[],
): FamilyJourneyMapLayout {
  const width = Math.max(300, requestedWidth);
  const height = Math.max(360, requestedHeight);
  const frameCoordinates = [...new Map(allAnchors.map((anchor) => [anchor.anchorId, anchor.coordinates])).values()];
  const frame: FeatureCollection = {
    type: "FeatureCollection",
    features: frameCoordinates.map((coordinates) => ({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: [...coordinates] },
    })),
  };
  const projection = geoNaturalEarth1().fitExtent(
    [
      [width < 520 ? 30 : 54, 34],
      [width - (width < 520 ? 30 : 54), height - 34],
    ],
    frame,
  );
  const path = geoPath(projection);
  const projectedPoints = model.points.flatMap((point) => {
    const projected = projection([...point.coordinates]);
    return projected ? [{ ...point, x: projected[0], y: projected[1] }] : [];
  });
  const projectedByAnchorId = new Map(projectedPoints.map((point) => [point.anchorId, point]));

  return {
    width,
    height,
    countryPaths: countryBoundaries.features.flatMap((feature) => {
      const value = path(feature);
      return value ? [value] : [];
    }),
    subdivisionPaths: subdivisionBoundaries.features.flatMap((feature) => {
      const value = path(feature);
      return value ? [value] : [];
    }),
    points: projectedPoints,
    movements: model.movements.map((movement) => {
      if (!movement.shouldDrawPath) return movement;
      const from = movement.fromAnchorId ? projectedByAnchorId.get(movement.fromAnchorId) : undefined;
      const to = movement.toAnchorId ? projectedByAnchorId.get(movement.toAnchorId) : undefined;
      return {
        ...movement,
        path: from && to ? schematicPath([from.x, from.y], [to.x, to.y]) : undefined,
      };
    }),
  };
}

/**
 * Combine nearby projected anchors so minimum-size touch targets never compete.
 * Underlying canonical places and their distinct coordinates remain available
 * in the cluster detail; only the initial map mark is aggregated.
 */
export function clusterJourneyPoints(
  points: FamilyJourneyMapLayout["points"],
  minimumDistance = 46,
): readonly JourneyPointCluster[] {
  const remaining = new Set(points.map((_, index) => index));
  const clusters: JourneyPointCluster[] = [];

  while (remaining.size > 0) {
    const seed = remaining.values().next().value as number;
    const members = new Set<number>([seed]);
    remaining.delete(seed);
    let changed = true;
    while (changed) {
      changed = false;
      for (const candidate of [...remaining]) {
        const joins = [...members].some((member) =>
          Math.hypot(points[candidate].x - points[member].x, points[candidate].y - points[member].y) < minimumDistance,
        );
        if (!joins) continue;
        members.add(candidate);
        remaining.delete(candidate);
        changed = true;
      }
    }

    const clusterPoints = [...members].map((index) => points[index]);
    const certaintyStates = new Set(clusterPoints.map(({ certainty }) => certainty));
    const certainty: JourneyPlaceCertainty =
      certaintyStates.has("mixed") || certaintyStates.size > 1
        ? "mixed"
        : clusterPoints[0].certainty;
    clusters.push({
      id: clusterPoints.map(({ anchorId }) => anchorId).sort().join("+"),
      x: clusterPoints.reduce((total, point) => total + point.x, 0) / clusterPoints.length,
      y: clusterPoints.reduce((total, point) => total + point.y, 0) / clusterPoints.length,
      points: clusterPoints,
      certainty,
      timeState: clusterPoints.some(({ timeState }) => timeState === "active") ? "active" : "indeterminate",
      unknownRouteEventIds: [
        ...new Set(clusterPoints.flatMap(({ unknownRouteEventIds }) => unknownRouteEventIds)),
      ],
    });
  }

  return clusters;
}

/** A map cluster selects a canonical place only when exactly one unique place is represented. */
export function uniqueJourneyPlaceId(
  places: readonly Pick<Place, "id">[],
): PlaceId | null {
  const placeIds = new Set(places.map(({ id }) => id));
  return placeIds.size === 1 ? [...placeIds][0] : null;
}

export function eventTimeStateLabel(state: EventTimeState): string {
  if (state === "unfiltered") return "all years";
  if (state === "supported") return "supported in selected year";
  if (state === "possible") return "possibly in selected year";
  if (state === "indeterminate") return "date unknown";
  return "outside selected year";
}
