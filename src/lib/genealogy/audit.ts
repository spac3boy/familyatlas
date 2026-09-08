import { validateGenealogyGraph } from "@/lib/genealogy/validation";
import type {
  Event,
  GenealogyGraph,
  HistoricalDate,
  PlaceId,
  PersonId,
  Relationship,
  SourceId,
} from "@/types";

export type DataQualitySeverity = "error" | "warning" | "info";

export interface DataQualityIssue {
  readonly code: string;
  readonly severity: DataQualitySeverity;
  readonly message: string;
  readonly entityIds: readonly string[];
}

export interface DataQualityAudit {
  readonly valid: boolean;
  readonly counts: {
    readonly errors: number;
    readonly warnings: number;
    readonly info: number;
  };
  readonly issues: readonly DataQualityIssue[];
}

interface Bounds {
  readonly earliest: number;
  readonly latest: number;
}

const pointYear = (date: { readonly kind: "exact"; readonly value: string } | { readonly kind: "year"; readonly year: number }): number =>
  date.kind === "year" ? date.year : Number(date.value.slice(0, 4));

export function historicalDateBounds(date: HistoricalDate): Bounds | undefined {
  switch (date.kind) {
    case "exact":
    case "year": {
      const year = pointYear(date);
      return { earliest: year, latest: year };
    }
    case "circa": {
      const year = pointYear(date.value);
      const tolerance = date.toleranceYears ?? 1;
      return { earliest: year - tolerance, latest: year + tolerance };
    }
    case "before":
      return { earliest: Number.NEGATIVE_INFINITY, latest: pointYear(date.value) };
    case "after":
      return { earliest: pointYear(date.value), latest: Number.POSITIVE_INFINITY };
    case "range":
      return { earliest: pointYear(date.start), latest: pointYear(date.end) };
    case "unknown":
      return undefined;
  }
}

const add = (
  issues: DataQualityIssue[],
  code: string,
  severity: DataQualitySeverity,
  message: string,
  entityIds: readonly string[],
): void => {
  issues.push({ code, severity, message, entityIds });
};

const normalizedName = (name: string): string =>
  name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const personIdsForRelationship = (relationship: Relationship): readonly PersonId[] =>
  relationship.type === "parent-child"
    ? [relationship.parentId, relationship.childId]
    : relationship.personIds;

function buildDescendants(graph: GenealogyGraph): Map<PersonId, Set<PersonId>> {
  const children = new Map<PersonId, PersonId[]>();
  for (const relationship of graph.relationships) {
    if (relationship.type !== "parent-child" || relationship.researchStatus !== "accepted") continue;
    const list = children.get(relationship.parentId) ?? [];
    list.push(relationship.childId);
    children.set(relationship.parentId, list);
  }

  const result = new Map<PersonId, Set<PersonId>>();
  const visit = (start: PersonId, current: PersonId, seen: Set<PersonId>): void => {
    for (const child of children.get(current) ?? []) {
      if (seen.has(child)) continue;
      seen.add(child);
      visit(start, child, seen);
    }
    result.set(start, seen);
  };
  for (const person of graph.people) visit(person.id, person.id, new Set());
  return result;
}

function aggregateBounds(events: readonly Event[]): Bounds | undefined {
  const bounds = events.map(({ date }) => historicalDateBounds(date)).filter((value): value is Bounds => Boolean(value));
  if (bounds.length === 0) return undefined;
  return {
    earliest: Math.min(...bounds.map(({ earliest }) => earliest)),
    latest: Math.max(...bounds.map(({ latest }) => latest)),
  };
}

function auditContradictoryVitalClaims(graph: GenealogyGraph, issues: DataQualityIssue[]): void {
  for (const person of graph.people) {
    for (const type of ["birth", "death"] as const) {
      const events = graph.events.filter((event) => event.type === type && event.personIds.includes(person.id));
      const bounded = events
        .map((event) => ({ event, bounds: historicalDateBounds(event.date) }))
        .filter((entry): entry is { event: Event; bounds: Bounds } => Boolean(entry.bounds));
      const conflictingIds = new Set<string>();
      for (let index = 0; index < bounded.length; index += 1) {
        for (let other = index + 1; other < bounded.length; other += 1) {
          const first = bounded[index];
          const second = bounded[other];
          if (first.bounds.latest < second.bounds.earliest || second.bounds.latest < first.bounds.earliest) {
            conflictingIds.add(first.event.id);
            conflictingIds.add(second.event.id);
          }
        }
      }
      if (conflictingIds.size > 0) {
        add(
          issues,
          `claims.contradictory-${type}`,
          "warning",
          `${person.canonicalName} has non-overlapping ${type} alternatives retained from the research archive.`,
          [person.id, ...conflictingIds],
        );
      }
    }
  }
}

function auditChronology(graph: GenealogyGraph, issues: DataQualityIssue[]): void {
  const births = new Map<PersonId, Bounds>();
  const deaths = new Map<PersonId, Bounds>();
  for (const person of graph.people) {
    const personEvents = graph.events.filter((event) => event.personIds.includes(person.id));
    const birth = aggregateBounds(personEvents.filter(({ type }) => type === "birth"));
    const death = aggregateBounds(personEvents.filter(({ type }) => type === "death"));
    if (birth) births.set(person.id, birth);
    if (death) deaths.set(person.id, death);
    if (birth && death && death.latest < birth.earliest) {
      add(issues, "chronology.death-before-birth", "error", `${person.canonicalName}'s death precedes every retained birth alternative.`, [person.id]);
    }
  }

  for (const event of graph.events) {
    if (event.type === "birth" || event.type === "death" || event.type === "burial") continue;
    const eventBounds = historicalDateBounds(event.date);
    if (!eventBounds) continue;
    for (const personId of event.personIds) {
      const birth = births.get(personId);
      const death = deaths.get(personId);
      if (birth && eventBounds.latest < birth.earliest) {
        add(issues, "chronology.event-before-birth", "error", `${event.id} precedes every retained birth alternative.`, [personId, event.id]);
      }
      if (death && eventBounds.earliest > death.latest) {
        add(issues, "chronology.event-after-death", "error", `${event.id} follows every retained death alternative.`, [personId, event.id]);
      }
    }
  }

  for (const relationship of graph.relationships) {
    if (relationship.type !== "parent-child") continue;
    const parentBirth = births.get(relationship.parentId);
    const parentDeath = deaths.get(relationship.parentId);
    const childBirth = births.get(relationship.childId);
    if (!parentBirth || !childBirth) continue;
    if (parentBirth.earliest > childBirth.latest) {
      add(issues, "chronology.parent-born-after-child", "error", "A parent is born after every retained birth alternative for the child.", [relationship.id, relationship.parentId, relationship.childId]);
    }
    const oldestPossibleAge = childBirth.latest - parentBirth.earliest;
    const youngestPossibleAge = childBirth.earliest - parentBirth.latest;
    if (oldestPossibleAge < 12) {
      add(issues, "chronology.impossible-parent-age", "error", "Every retained date alternative makes the parent younger than 12 at the child's birth.", [relationship.id, relationship.parentId, relationship.childId]);
    } else if (youngestPossibleAge > 80) {
      add(issues, "chronology.parent-age-anomaly", "warning", "Every retained date alternative makes the parent older than 80 at the child's birth.", [relationship.id, relationship.parentId, relationship.childId]);
    }
    if (parentDeath && parentDeath.latest + 1 < childBirth.earliest) {
      add(issues, "chronology.parent-death-before-child", "error", "The parent died more than one year before every retained child-birth alternative.", [relationship.id, relationship.parentId, relationship.childId]);
    }
  }
}

function auditCircularAncestry(graph: GenealogyGraph, descendants: Map<PersonId, Set<PersonId>>, issues: DataQualityIssue[]): void {
  for (const person of graph.people) {
    if (descendants.get(person.id)?.has(person.id)) {
      add(issues, "ancestry.circular", "error", `Circular ancestry includes ${person.canonicalName}.`, [person.id]);
    }
  }
}

function auditOrphans(graph: GenealogyGraph, issues: DataQualityIssue[]): void {
  const connectedPeople = new Set<PersonId>();
  for (const relationship of graph.relationships) {
    for (const personId of personIdsForRelationship(relationship)) connectedPeople.add(personId);
  }
  for (const person of graph.people) {
    if (!connectedPeople.has(person.id)) {
      add(issues, "person.orphan", "warning", `${person.canonicalName} has no relationship edge in the canonical graph.`, [person.id]);
    }
  }

  const connectedPlaces = new Set<PlaceId>();
  for (const event of graph.events) {
    if (event.placeId) connectedPlaces.add(event.placeId);
    for (const placeId of event.migration?.fromPlaceIds ?? []) connectedPlaces.add(placeId);
    for (const placeId of event.migration?.toPlaceIds ?? []) connectedPlaces.add(placeId);
  }
  for (const place of graph.places) {
    if (place.parentPlaceId) connectedPlaces.add(place.parentPlaceId);
  }
  for (const place of graph.places) {
    if (!connectedPlaces.has(place.id)) {
      add(issues, "place.orphan", "warning", `${place.modernName} is not used by an event, movement, or child-place hierarchy.`, [place.id]);
    }
  }

  const connectedSources = new Set<SourceId>();
  for (const person of graph.people) {
    for (const ref of person.sourceRefs) connectedSources.add(ref.sourceId);
    for (const name of person.alternateNames) {
      for (const ref of name.sourceRefs) connectedSources.add(ref.sourceId);
    }
  }
  for (const entity of [...graph.relationships, ...graph.events, ...graph.places]) {
    for (const ref of entity.sourceRefs) connectedSources.add(ref.sourceId);
  }
  for (const source of graph.sources) {
    if (!connectedSources.has(source.id)) {
      add(issues, "source.orphan", "warning", `${source.title} is not cited by any normalized claim.`, [source.id]);
    }
  }
}

function auditLikelyDuplicates(graph: GenealogyGraph, descendants: Map<PersonId, Set<PersonId>>, issues: DataQualityIssue[]): void {
  const peopleById = new Map(graph.people.map((person) => [person.id, person]));
  const names = new Map<string, PersonId[]>();
  for (const person of graph.people) {
    const keys = new Set([person.canonicalName, ...person.alternateNames.map(({ name }) => name)].map(normalizedName));
    for (const key of keys) names.set(key, [...(names.get(key) ?? []), person.id]);
  }
  for (const [name, rawIds] of names) {
    const ids = [...new Set(rawIds)];
    if (ids.length < 2) continue;
    const allGenealogicallySeparated = ids.every((id, index) =>
      ids.slice(index + 1).every((other) => {
        const explicitlyDistinct =
          peopleById.get(id)?.distinctFromPersonIds?.includes(other) ||
          peopleById.get(other)?.distinctFromPersonIds?.includes(id);
        return (
          explicitlyDistinct ||
          descendants.get(id)?.has(other) ||
          descendants.get(other)?.has(id)
        );
      }),
    );
    if (!allGenealogicallySeparated) {
      add(issues, "identity.likely-duplicate", "warning", `Multiple accepted people share the normalized name “${name}” without an ancestor/descendant disambiguation.`, ids);
    }
  }
}

export function auditGenealogyGraph(graph: GenealogyGraph): DataQualityAudit {
  const issues: DataQualityIssue[] = [];
  const structural = validateGenealogyGraph(graph);
  for (const item of structural.issues) {
    add(issues, `structure.${item.code}`, "error", `${item.path}: ${item.message}`, []);
  }

  const descendants = buildDescendants(graph);
  auditOrphans(graph, issues);
  auditCircularAncestry(graph, descendants, issues);
  auditLikelyDuplicates(graph, descendants, issues);
  auditChronology(graph, issues);
  auditContradictoryVitalClaims(graph, issues);

  const counts = {
    errors: issues.filter(({ severity }) => severity === "error").length,
    warnings: issues.filter(({ severity }) => severity === "warning").length,
    info: issues.filter(({ severity }) => severity === "info").length,
  };
  return { valid: counts.errors === 0, counts, issues };
}
