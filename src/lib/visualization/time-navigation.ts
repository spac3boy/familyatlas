import { scaleLinear } from "d3-scale";

import { createGenealogyQueries, type GenealogyQueries } from "@/lib/genealogy/queries";
import type { Event, EventId, GenealogyGraph, HistoricalDate, PersonId, PlaceId } from "@/types";

export type NavigatorYearDomain = readonly [number, number];
export type EventTimeState = "unfiltered" | "supported" | "possible" | "indeterminate" | "excluded";
export type PersonTimeState = "unfiltered" | "supported" | "possible" | "indeterminate" | "excluded";

export interface TimeNavigatorLayout {
  readonly width: number;
  readonly plotX1: number;
  readonly plotX2: number;
  readonly ticks: readonly { readonly year: number; readonly x: number }[];
}

export interface EventTimeMatch {
  readonly event: Event;
  readonly state: EventTimeState;
}

export interface EventTimeFilter {
  readonly selectedYear: number | null;
  readonly events: readonly EventTimeMatch[];
  readonly matching: readonly Event[];
  readonly indeterminate: readonly Event[];
  readonly excluded: readonly Event[];
}

export interface PersonTimeEmphasis {
  readonly personId: PersonId;
  readonly state: PersonTimeState;
  /** Only conclusive born-after/died-before evidence permits dimming. */
  readonly dim: boolean;
}

export interface TimeMapState {
  readonly activeEventIds: readonly EventId[];
  readonly indeterminateEventIds: readonly EventId[];
  readonly excludedEventIds: readonly EventId[];
  readonly activePlaceIds: readonly PlaceId[];
  readonly indeterminatePlaceIds: readonly PlaceId[];
  readonly activeMovementEventIds: readonly EventId[];
  readonly indeterminateMovementEventIds: readonly EventId[];
}

export interface TimeSelectionEffects {
  readonly selectedYear: number | null;
  readonly eventFilter: EventTimeFilter;
  readonly people: readonly PersonTimeEmphasis[];
  readonly map: TimeMapState;
}

function pointYear(point: Extract<HistoricalDate, { kind: "exact" | "year" }>): number {
  return point.kind === "year" ? point.year : Number(point.value.slice(0, 4));
}

function dateYearBounds(date: HistoricalDate): NavigatorYearDomain | undefined {
  switch (date.kind) {
    case "exact":
    case "year": {
      const year = pointYear(date);
      return [year, year];
    }
    case "circa": {
      const year = pointYear(date.value);
      const tolerance = date.toleranceYears ?? 1;
      return [year - tolerance, year + tolerance];
    }
    case "before":
    case "after": {
      const year = pointYear(date.value);
      return [year, year];
    }
    case "range":
      return [pointYear(date.start), pointYear(date.end)];
    case "unknown":
      return undefined;
  }
}

/**
 * Derive navigation bounds from explicit date anchors. Open-ended dates contribute
 * only their documented boundary; they do not invent an earlier or later endpoint.
 */
export function deriveTimeNavigatorDomain(events: readonly Event[]): NavigatorYearDomain | undefined {
  const years = events.flatMap((event) => dateYearBounds(event.date) ?? []);
  if (years.length === 0) return undefined;
  const minimum = Math.min(...years);
  const maximum = Math.max(...years);
  return minimum === maximum ? [minimum - 1, maximum + 1] : [minimum, maximum];
}

export function layoutTimeNavigator(
  domain: NavigatorYearDomain,
  requestedWidth: number,
): TimeNavigatorLayout {
  const width = Math.max(280, requestedWidth);
  const plotX1 = 16;
  const plotX2 = width - 16;
  const scale = scaleLinear(domain, [plotX1, plotX2]).clamp(true);
  const targetTickCount = width < 480 ? 4 : width < 800 ? 6 : 10;
  const ticks = [...new Set(scale.ticks(targetTickCount).map(Math.round))]
    .filter((year) => year >= domain[0] && year <= domain[1])
    .map((year) => ({ year, x: scale(year) }));
  return { width, plotX1, plotX2, ticks };
}

export function navigatorXForYear(
  domain: NavigatorYearDomain,
  width: number,
  year: number,
): number {
  const layout = layoutTimeNavigator(domain, width);
  return scaleLinear(domain, [layout.plotX1, layout.plotX2]).clamp(true)(year);
}

export function navigatorSelectionForYear(
  domain: NavigatorYearDomain,
  width: number,
  year: number | null,
): [number, number] | null {
  if (year === null) return null;
  const layout = layoutTimeNavigator(domain, width);
  const center = navigatorXForYear(domain, width, year);
  return [Math.max(layout.plotX1, center - 6), Math.min(layout.plotX2, center + 6)];
}

export function navigatorYearFromSelection(
  domain: NavigatorYearDomain,
  width: number,
  selection: readonly [number, number],
): number {
  const layout = layoutTimeNavigator(domain, width);
  const scale = scaleLinear(domain, [layout.plotX1, layout.plotX2]).clamp(true);
  const center = (selection[0] + selection[1]) / 2;
  return Math.max(domain[0], Math.min(domain[1], Math.round(scale.invert(center))));
}

export function filterEventsBySelectedYear(
  events: readonly Event[],
  selectedYear: number | null,
  queries: GenealogyQueries,
): EventTimeFilter {
  if (selectedYear === null) {
    return {
      selectedYear,
      events: events.map((event) => ({ event, state: "unfiltered" })),
      matching: events,
      indeterminate: [],
      excluded: [],
    };
  }

  const result = queries.eventsByDate({ kind: "year", year: selectedYear });
  const matchStates = new Map(
    result.matches.map(({ event, match }) => [
      event.id,
      match === "contained" ? "supported" : "possible",
    ] as const),
  );
  const indeterminateIds = new Set(result.indeterminate.map(({ id }) => id));
  const matches = events.map((event): EventTimeMatch => ({
    event,
    state: matchStates.get(event.id) ?? (indeterminateIds.has(event.id) ? "indeterminate" : "excluded"),
  }));

  return {
    selectedYear,
    events: matches,
    matching: matches
      .filter(({ state }) => state === "supported" || state === "possible")
      .map(({ event }) => event),
    indeterminate: matches.filter(({ state }) => state === "indeterminate").map(({ event }) => event),
    excluded: matches.filter(({ state }) => state === "excluded").map(({ event }) => event),
  };
}

function placeIdsForEvent(event: Event): readonly PlaceId[] {
  const ids = new Set<PlaceId>();
  if (event.placeId) ids.add(event.placeId);
  for (const placeId of event.migration?.fromPlaceIds ?? []) ids.add(placeId);
  for (const placeId of event.migration?.toPlaceIds ?? []) ids.add(placeId);
  return [...ids];
}

export function buildTimeMapState(eventFilter: EventTimeFilter): TimeMapState {
  const active = eventFilter.events.filter(({ state }) =>
    state === "unfiltered" || state === "supported" || state === "possible",
  );
  const indeterminate = eventFilter.events.filter(({ state }) => state === "indeterminate");
  const excluded = eventFilter.events.filter(({ state }) => state === "excluded");

  return {
    activeEventIds: active.map(({ event }) => event.id),
    indeterminateEventIds: indeterminate.map(({ event }) => event.id),
    excludedEventIds: excluded.map(({ event }) => event.id),
    activePlaceIds: [...new Set(active.flatMap(({ event }) => placeIdsForEvent(event)))],
    indeterminatePlaceIds: [
      ...new Set(indeterminate.flatMap(({ event }) => placeIdsForEvent(event))),
    ],
    activeMovementEventIds: active
      .filter(({ event }) => event.type === "migration")
      .map(({ event }) => event.id),
    indeterminateMovementEventIds: indeterminate
      .filter(({ event }) => event.type === "migration")
      .map(({ event }) => event.id),
  };
}

export function buildTimeSelectionEffects(
  graph: GenealogyGraph,
  selectedYear: number | null,
  suppliedQueries?: GenealogyQueries,
): TimeSelectionEffects {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const acceptedEvents = graph.events.filter(({ researchStatus }) => researchStatus === "accepted");
  const acceptedPeople = graph.people.filter(({ researchStatus }) => researchStatus === "accepted");
  const eventFilter = filterEventsBySelectedYear(acceptedEvents, selectedYear, queries);

  if (selectedYear === null) {
    return {
      selectedYear,
      eventFilter,
      people: acceptedPeople.map(({ id }) => ({ personId: id, state: "unfiltered", dim: false })),
      map: buildTimeMapState(eventFilter),
    };
  }

  const alive = queries.peopleAliveInYear(selectedYear);
  const matchStates = new Map(alive.matches.map(({ person, temporalStatus }) => [person.id, temporalStatus]));
  const indeterminateIds = new Set(alive.indeterminate.map(({ person }) => person.id));
  const excludedIds = new Set(alive.excluded.map(({ person }) => person.id));

  return {
    selectedYear,
    eventFilter,
    people: acceptedPeople.map(({ id }) => {
      const matched = matchStates.get(id);
      if (matched) return { personId: id, state: matched, dim: false };
      if (excludedIds.has(id)) return { personId: id, state: "excluded", dim: true };
      if (indeterminateIds.has(id)) {
        return { personId: id, state: "indeterminate", dim: false };
      }
      return { personId: id, state: "indeterminate", dim: false };
    }),
    map: buildTimeMapState(eventFilter),
  };
}
