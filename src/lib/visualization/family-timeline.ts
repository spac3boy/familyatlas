import { axisBottom } from "d3-axis";
import { scaleUtc } from "d3-scale";
import { utcYear, type TimeInterval } from "d3-time";
import { utcFormat } from "d3-time-format";

import { createGenealogyQueries, type GenealogyQueries } from "@/lib/genealogy/queries";
import type {
  Confidence,
  Event,
  GenealogyGraph,
  HistoricalDate,
  Person,
  PersonId,
} from "@/types";

export type FamilyTimelineScope = "all" | "maternal" | "paternal" | "selected";

export interface TimelineTemporalExtent {
  readonly kind: HistoricalDate["kind"];
  readonly start?: Date;
  readonly end?: Date;
  readonly label: string;
}

export interface TimelineLifespan {
  readonly possibleStart: Date;
  readonly supportedStart: Date;
  readonly supportedEnd: Date;
  readonly possibleEnd: Date;
  readonly birthEvents: readonly Event[];
  readonly deathEvents: readonly Event[];
  readonly confidence: Confidence;
  readonly label: string;
}

export interface FamilyTimelineRow {
  readonly person: Person;
  readonly lifespan?: TimelineLifespan;
  readonly datedEvents: readonly { readonly event: Event; readonly extent: TimelineTemporalExtent }[];
}

export interface FamilyTimelineModel {
  readonly scope: FamilyTimelineScope;
  readonly rows: readonly FamilyTimelineRow[];
  readonly undatedEvents: readonly Event[];
  readonly domain?: readonly [Date, Date];
}

export interface FamilyTimelineLayoutEvent {
  readonly event: Event;
  readonly extent: TimelineTemporalExtent;
  readonly x1: number;
  readonly x2: number;
  readonly openStart: boolean;
  readonly openEnd: boolean;
}

export interface FamilyTimelineLayoutRow {
  readonly person: Person;
  readonly y: number;
  readonly lifespan?: TimelineLifespan & {
    readonly possibleX1: number;
    readonly supportedX1: number;
    readonly supportedX2: number;
    readonly possibleX2: number;
  };
  readonly events: readonly FamilyTimelineLayoutEvent[];
}

export interface FamilyTimelineLayout {
  readonly width: number;
  readonly height: number;
  readonly plotX1: number;
  readonly plotX2: number;
  readonly axisY: number;
  readonly ticks: readonly { readonly date: Date; readonly x: number; readonly label: string }[];
  readonly rows: readonly FamilyTimelineLayoutRow[];
}

const confidenceRank: Readonly<Record<Confidence, number>> = {
  unresolved: 0,
  probable: 1,
  verified: 2,
};

const weakestConfidence = (events: readonly Event[]): Confidence =>
  events.reduce<Confidence>(
    (weakest, event) =>
      confidenceRank[event.confidence] < confidenceRank[weakest] ? event.confidence : weakest,
    "verified",
  );

const exactDate = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const yearStart = (year: number): Date => new Date(Date.UTC(year, 0, 1));
const yearEnd = (year: number): Date => new Date(Date.UTC(year, 11, 31));

const pointExtent = (
  point: Extract<HistoricalDate, { kind: "exact" | "year" }>,
): readonly [Date, Date] =>
  point.kind === "exact"
    ? [exactDate(point.value), exactDate(point.value)]
    : [yearStart(point.year), yearEnd(point.year)];

const exactLabel = utcFormat("%B %-d, %Y");

export function formatTimelineDate(date: HistoricalDate): string {
  const pointLabel = (point: Extract<HistoricalDate, { kind: "exact" | "year" }>) =>
    point.kind === "exact" ? exactLabel(exactDate(point.value)) : String(point.year);

  switch (date.kind) {
    case "exact":
      return pointLabel(date);
    case "year":
      return String(date.year);
    case "circa":
      return `circa ${pointLabel(date.value)}`;
    case "before":
      return `before ${pointLabel(date.value)}`;
    case "after":
      return `after ${pointLabel(date.value)}`;
    case "range":
      return `${pointLabel(date.start)}–${pointLabel(date.end)}`;
    case "unknown":
      return date.originalText ?? "Date unknown";
  }
}

export function historicalDateExtent(date: HistoricalDate): TimelineTemporalExtent | undefined {
  const label = formatTimelineDate(date);
  switch (date.kind) {
    case "exact": {
      const value = exactDate(date.value);
      return { kind: date.kind, start: value, end: value, label };
    }
    case "year":
      return { kind: date.kind, start: yearStart(date.year), end: yearEnd(date.year), label };
    case "circa": {
      const [start, end] = pointExtent(date.value);
      const tolerance = date.toleranceYears ?? 1;
      return {
        kind: date.kind,
        start: utcYear.offset(start, -tolerance),
        end: utcYear.offset(end, tolerance),
        label,
      };
    }
    case "before": {
      const [start] = pointExtent(date.value);
      return { kind: date.kind, end: start, label };
    }
    case "after": {
      const [, end] = pointExtent(date.value);
      return { kind: date.kind, start: end, label };
    }
    case "range": {
      const [start] = pointExtent(date.start);
      const [, end] = pointExtent(date.end);
      return { kind: date.kind, start, end, label };
    }
    case "unknown":
      return undefined;
  }
}

function lifespanFor(events: readonly Event[]): TimelineLifespan | undefined {
  const birthEvents = events.filter(({ type, date }) => type === "birth" && date.kind !== "unknown");
  const deathEvents = events.filter(({ type, date }) => type === "death" && date.kind !== "unknown");
  const births = birthEvents.map(({ date }) => historicalDateExtent(date)).filter((value): value is TimelineTemporalExtent => Boolean(value));
  const deaths = deathEvents.map(({ date }) => historicalDateExtent(date)).filter((value): value is TimelineTemporalExtent => Boolean(value));
  if (
    births.length === 0 ||
    deaths.length === 0 ||
    births.some(({ start, end }) => !start || !end) ||
    deaths.some(({ start, end }) => !start || !end)
  ) {
    return undefined;
  }

  const possibleStart = new Date(Math.min(...births.map(({ start }) => start!.getTime())));
  const supportedStart = new Date(Math.max(...births.map(({ end }) => end!.getTime())));
  const supportedEnd = new Date(Math.min(...deaths.map(({ start }) => start!.getTime())));
  const possibleEnd = new Date(Math.max(...deaths.map(({ end }) => end!.getTime())));
  if (supportedStart > supportedEnd) return undefined;

  return {
    possibleStart,
    supportedStart,
    supportedEnd,
    possibleEnd,
    birthEvents,
    deathEvents,
    confidence: weakestConfidence([...birthEvents, ...deathEvents]),
    label: `birth ${births.map(({ label }) => label).join(" / ")}; death ${deaths.map(({ label }) => label).join(" / ")}`,
  };
}

function includedPeople(
  graph: GenealogyGraph,
  queries: GenealogyQueries,
  scope: FamilyTimelineScope,
  selectedPersonId: PersonId | null,
): readonly Person[] {
  if (scope === "selected") {
    const selected = selectedPersonId ? queries.personById(selectedPersonId) : undefined;
    return selected ? [selected] : [];
  }
  if (scope === "all") return graph.people.filter(({ researchStatus }) => researchStatus === "accepted");
  return graph.people.filter((person) => {
    if (person.researchStatus !== "accepted") return false;
    const branch = queries.branchForPerson(person.id)?.classification;
    return branch === scope || branch === "both" || branch === "self";
  });
}

export function buildFamilyTimelineModel(
  graph: GenealogyGraph,
  options: {
    readonly scope: FamilyTimelineScope;
    readonly selectedPersonId: PersonId | null;
  },
  suppliedQueries?: GenealogyQueries,
): FamilyTimelineModel {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const undatedEvents = new Map<Event["id"], Event>();
  const rows = includedPeople(graph, queries, options.scope, options.selectedPersonId)
    .map((person): FamilyTimelineRow | undefined => {
      const events = queries.eventsByPerson(person.id);
      const datedEvents = events.flatMap((event) => {
        const extent = historicalDateExtent(event.date);
        if (!extent) {
          undatedEvents.set(event.id, event);
          return [];
        }
        return [{ event, extent }];
      });
      const lifespan = lifespanFor(events);
      if (datedEvents.length === 0 && !lifespan) return undefined;
      return { person, lifespan, datedEvents };
    })
    .filter((row): row is FamilyTimelineRow => Boolean(row))
    .sort((first, second) => {
      const firstDate = first.lifespan?.possibleStart ?? first.datedEvents[0]?.extent.start ?? first.datedEvents[0]?.extent.end;
      const secondDate = second.lifespan?.possibleStart ?? second.datedEvents[0]?.extent.start ?? second.datedEvents[0]?.extent.end;
      return (firstDate?.getTime() ?? 0) - (secondDate?.getTime() ?? 0) || first.person.canonicalName.localeCompare(second.person.canonicalName);
    });

  const bounds: Date[] = [];
  for (const row of rows) {
    if (row.lifespan) bounds.push(row.lifespan.possibleStart, row.lifespan.possibleEnd);
    for (const { extent } of row.datedEvents) {
      if (extent.start) bounds.push(extent.start);
      if (extent.end) bounds.push(extent.end);
    }
  }
  const domain =
    bounds.length > 0
      ? ([
          utcYear.offset(new Date(Math.min(...bounds.map((date) => date.getTime()))), -1),
          utcYear.offset(new Date(Math.max(...bounds.map((date) => date.getTime()))), 1),
        ] as const)
      : undefined;

  return {
    scope: options.scope,
    rows,
    undatedEvents: [...undatedEvents.values()],
    domain,
  };
}

function tickInterval(domain: readonly [Date, Date], plotWidth: number): TimeInterval {
  const spanYears = Math.max(1, domain[1].getUTCFullYear() - domain[0].getUTCFullYear());
  const targetTicks = Math.max(3, Math.floor(plotWidth / 90));
  const roughStep = spanYears / targetTicks;
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find((value) => value >= roughStep) ?? 1000;
  return utcYear.every(step) ?? utcYear;
}

export function layoutFamilyTimeline(
  model: FamilyTimelineModel,
  requestedWidth: number,
): FamilyTimelineLayout | undefined {
  if (!model.domain || model.rows.length === 0) return undefined;
  const width = Math.max(760, requestedWidth);
  const plotX1 = width < 900 ? 196 : 224;
  const plotX2 = width - 28;
  const axisY = 42;
  const rowStart = 78;
  const rowHeight = 52;
  const scale = scaleUtc(model.domain, [plotX1, plotX2]);
  const interval = tickInterval(model.domain, plotX2 - plotX1);
  const yearFormat = utcFormat("%Y");
  const generatedTicks = scale.ticks(interval);
  const axis = axisBottom(scale)
    .ticks(interval)
    .tickValues(generatedTicks)
    .tickFormat((value) => yearFormat(value instanceof Date ? value : new Date(Number(value))));
  const tickValues = axis.tickValues() ?? generatedTicks;
  const tickFormat = axis.tickFormat();

  return {
    width,
    height: rowStart + model.rows.length * rowHeight + 24,
    plotX1,
    plotX2,
    axisY,
    ticks: tickValues.map((value, index) => {
      const date = value instanceof Date ? value : new Date(Number(value));
      return { date, x: scale(date), label: tickFormat ? tickFormat(value, index) : yearFormat(date) };
    }),
    rows: model.rows.map((row, index) => ({
      person: row.person,
      y: rowStart + index * rowHeight,
      lifespan: row.lifespan
        ? {
            ...row.lifespan,
            possibleX1: scale(row.lifespan.possibleStart),
            supportedX1: scale(row.lifespan.supportedStart),
            supportedX2: scale(row.lifespan.supportedEnd),
            possibleX2: scale(row.lifespan.possibleEnd),
          }
        : undefined,
      events: row.datedEvents.map(({ event, extent }) => ({
        event,
        extent,
        x1: extent.start ? scale(extent.start) : plotX1,
        x2: extent.end ? scale(extent.end) : plotX2,
        openStart: !extent.start,
        openEnd: !extent.end,
      })),
    })),
  };
}
