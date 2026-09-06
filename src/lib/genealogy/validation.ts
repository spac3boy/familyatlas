import {
  alternateNameTypeValues,
  confidenceValues,
  eventTypeValues,
  evidenceClassValues,
  inspectionStatusValues,
  locationPrecisionValues,
  movementClassificationValues,
  parentageTypeValues,
  relationshipTypeValues,
  researchStatusValues,
  sourceCategoryValues,
  type GenealogyGraph,
  type HistoricalDate,
  type HistoricalDatePoint,
  type PersonId,
  type PlaceId,
  type SourceId,
} from "@/types";

export interface ValidationIssue {
  readonly code: string;
  readonly path: string;
  readonly message: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

const PERSON_ID = /^(?:person|candidate)-(?!place(?:-|$))[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RELATIONSHIP_ID = /^relationship-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EVENT_ID = /^event-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLACE_ID = /^(?:place|candidate-place)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE_ID = /^SRC-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isOneOf = <T extends string>(value: unknown, values: readonly T[]): value is T =>
  typeof value === "string" && values.includes(value as T);

const issue = (code: string, path: string, message: string): ValidationIssue => ({
  code,
  path,
  message,
});

export const isPersonId = (value: unknown): value is PersonId =>
  typeof value === "string" && PERSON_ID.test(value);

export const isRelationshipId = (value: unknown): value is `relationship-${string}` =>
  typeof value === "string" && RELATIONSHIP_ID.test(value);

export const isEventId = (value: unknown): value is `event-${string}` =>
  typeof value === "string" && EVENT_ID.test(value);

export const isPlaceId = (value: unknown): value is PlaceId =>
  typeof value === "string" && PLACE_ID.test(value);

export const isSourceId = (value: unknown): value is SourceId =>
  typeof value === "string" && SOURCE_ID.test(value);

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const isExactDate = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const monthLengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= monthLengths[month - 1];
};

const isYear = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 9999;

function validateDatePoint(value: unknown, path: string): ValidationIssue[] {
  if (!isRecord(value)) return [issue("date.point", path, "Expected an exact date or year date.")];
  if (value.kind === "exact") {
    return isExactDate(value.value)
      ? []
      : [issue("date.exact", `${path}.value`, "Expected a real date in YYYY-MM-DD form.")];
  }
  if (value.kind === "year") {
    return isYear(value.year)
      ? []
      : [issue("date.year", `${path}.year`, "Expected an integer year from 1 through 9999.")];
  }
  return [issue("date.point-kind", `${path}.kind`, "Date boundary must be exact or year.")];
}

function pointBounds(value: HistoricalDatePoint): readonly [number, number] {
  if (value.kind === "year") {
    return [value.year * 10_000 + 101, value.year * 10_000 + 1231];
  }
  const numeric = Number(value.value.replaceAll("-", ""));
  return [numeric, numeric];
}

export function validateHistoricalDate(value: unknown, path = "date"): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isRecord(value)) {
    issues.push(issue("date.object", path, "Expected a historical-date object."));
    return { valid: false, issues };
  }

  if (value.originalText !== undefined && typeof value.originalText !== "string") {
    issues.push(issue("date.original-text", `${path}.originalText`, "Expected a string."));
  }
  if (value.note !== undefined && typeof value.note !== "string") {
    issues.push(issue("date.note", `${path}.note`, "Expected a string."));
  }

  switch (value.kind) {
    case "exact":
    case "year":
      issues.push(...validateDatePoint(value, path));
      break;
    case "circa":
    case "before":
    case "after":
      issues.push(...validateDatePoint(value.value, `${path}.value`));
      if (
        value.kind === "circa" &&
        value.toleranceYears !== undefined &&
        (!Number.isInteger(value.toleranceYears) || Number(value.toleranceYears) < 0)
      ) {
        issues.push(
          issue("date.tolerance", `${path}.toleranceYears`, "Expected a non-negative integer."),
        );
      }
      break;
    case "range": {
      const startIssues = validateDatePoint(value.start, `${path}.start`);
      const endIssues = validateDatePoint(value.end, `${path}.end`);
      issues.push(...startIssues, ...endIssues);
      if (startIssues.length === 0 && endIssues.length === 0) {
        const [startEarliest] = pointBounds(value.start as HistoricalDatePoint);
        const [, endLatest] = pointBounds(value.end as HistoricalDatePoint);
        if (startEarliest > endLatest) {
          issues.push(issue("date.range-order", path, "Range start must not follow range end."));
        }
      }
      break;
    }
    case "unknown":
      break;
    default:
      issues.push(
        issue(
          "date.kind",
          `${path}.kind`,
          "Expected exact, year, circa, before, after, range, or unknown.",
        ),
      );
  }

  return { valid: issues.length === 0, issues };
}

export const isHistoricalDate = (value: unknown): value is HistoricalDate =>
  validateHistoricalDate(value).valid;

function registerIds(
  items: readonly unknown[],
  path: string,
  idCheck: (value: unknown) => boolean,
  canonicalIds: Set<string>,
  aliases: Map<string, string>,
  issues: ValidationIssue[],
): void {
  items.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(item)) {
      issues.push(issue("entity.object", itemPath, "Expected an object."));
      return;
    }
    if (!idCheck(item.id)) {
      issues.push(issue("id.format", `${itemPath}.id`, "Stable ID has the wrong format."));
      return;
    }
    const id = item.id as string;
    if (canonicalIds.has(id) || aliases.has(id)) {
      issues.push(issue("id.duplicate", `${itemPath}.id`, `Duplicate stable ID: ${id}.`));
    } else {
      canonicalIds.add(id);
    }
    if (item.idAliases === undefined) return;
    if (!Array.isArray(item.idAliases)) {
      issues.push(issue("id.aliases", `${itemPath}.idAliases`, "Expected an array."));
      return;
    }
    item.idAliases.forEach((alias, aliasIndex) => {
      const aliasPath = `${itemPath}.idAliases[${aliasIndex}]`;
      if (!idCheck(alias)) {
        issues.push(issue("id.alias-format", aliasPath, "Stable ID alias has the wrong format."));
      } else if (alias === id || canonicalIds.has(alias as string) || aliases.has(alias as string)) {
        issues.push(issue("id.alias-collision", aliasPath, `ID alias collides: ${String(alias)}.`));
      } else {
        aliases.set(alias as string, id);
      }
    });
  });
}

function validateSourceRefs(
  value: unknown,
  path: string,
  sourceIds: Set<string>,
  sourceAliases: Map<string, string>,
  issues: ValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push(issue("source-ref.required", path, "Expected at least one source reference."));
    return;
  }
  value.forEach((reference, index) => {
    const refPath = `${path}[${index}]`;
    if (!isRecord(reference) || !isSourceId(reference.sourceId)) {
      issues.push(issue("source-ref.format", refPath, "Expected a valid sourceId reference."));
    } else if (!sourceIds.has(reference.sourceId) && !sourceAliases.has(reference.sourceId)) {
      issues.push(
        issue("source-ref.missing", `${refPath}.sourceId`, `Unknown source: ${reference.sourceId}.`),
      );
    }
  });
}

function validateEvidenceFields(
  item: UnknownRecord,
  path: string,
  sourceIds: Set<string>,
  sourceAliases: Map<string, string>,
  issues: ValidationIssue[],
): void {
  if (!isOneOf(item.confidence, confidenceValues)) {
    issues.push(issue("confidence", `${path}.confidence`, "Unknown confidence value."));
  }
  if (!isOneOf(item.researchStatus, researchStatusValues)) {
    issues.push(issue("research-status", `${path}.researchStatus`, "Unknown research status."));
  }
  validateSourceRefs(item.sourceRefs, `${path}.sourceRefs`, sourceIds, sourceAliases, issues);
}

function asArray(value: unknown, path: string, issues: ValidationIssue[]): readonly unknown[] {
  if (Array.isArray(value)) return value;
  issues.push(issue("graph.array", path, "Expected an array."));
  return [];
}

export function validateGenealogyGraph(value: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isRecord(value)) {
    return { valid: false, issues: [issue("graph.object", "graph", "Expected a graph object.")] };
  }
  if (value.schemaVersion !== 1) {
    issues.push(issue("graph.schema-version", "graph.schemaVersion", "Expected schema version 1."));
  }

  const sources = asArray(value.sources, "graph.sources", issues);
  const people = asArray(value.people, "graph.people", issues);
  const relationships = asArray(value.relationships, "graph.relationships", issues);
  const events = asArray(value.events, "graph.events", issues);
  const places = asArray(value.places, "graph.places", issues);

  const sourceIds = new Set<string>();
  const sourceAliases = new Map<string, string>();
  const personIds = new Set<string>();
  const personAliases = new Map<string, string>();
  const relationshipIds = new Set<string>();
  const placeIds = new Set<string>();
  const placeAliases = new Map<string, string>();

  registerIds(sources, "graph.sources", isSourceId, sourceIds, sourceAliases, issues);
  registerIds(people, "graph.people", isPersonId, personIds, personAliases, issues);
  registerIds(
    relationships,
    "graph.relationships",
    isRelationshipId,
    relationshipIds,
    new Map(),
    issues,
  );
  registerIds(places, "graph.places", isPlaceId, placeIds, placeAliases, issues);
  registerIds(events, "graph.events", isEventId, new Set(), new Map(), issues);

  sources.forEach((source, index) => {
    const path = `graph.sources[${index}]`;
    if (!isRecord(source)) return;
    if (!isNonEmptyString(source.title)) issues.push(issue("source.title", `${path}.title`, "Required."));
    if (!isOneOf(source.category, sourceCategoryValues)) {
      issues.push(issue("source.category", `${path}.category`, "Unknown source category."));
    }
    if (!isOneOf(source.evidenceClass, evidenceClassValues)) {
      issues.push(issue("source.evidence-class", `${path}.evidenceClass`, "Unknown evidence class."));
    }
    if (!isOneOf(source.inspectionStatus, inspectionStatusValues)) {
      issues.push(issue("source.inspection", `${path}.inspectionStatus`, "Unknown inspection status."));
    }
    if (!isOneOf(source.researchStatus, researchStatusValues)) {
      issues.push(issue("research-status", `${path}.researchStatus`, "Unknown research status."));
    }
    if (!Array.isArray(source.urls) || source.urls.some((url) => !isHttpUrl(url))) {
      issues.push(issue("source.urls", `${path}.urls`, "Expected only absolute HTTP(S) URLs."));
    }
    if (!Array.isArray(source.citationHandles) || source.citationHandles.some((handle) => !isNonEmptyString(handle))) {
      issues.push(issue("source.citation-handles", `${path}.citationHandles`, "Expected non-empty strings."));
    }
    if (source.date !== undefined) issues.push(...validateHistoricalDate(source.date, `${path}.date`).issues);
  });

  const peopleById = new Map<string, UnknownRecord>();
  people.forEach((person, index) => {
    const path = `graph.people[${index}]`;
    if (!isRecord(person)) return;
    if (typeof person.id === "string") peopleById.set(person.id, person);
    validateEvidenceFields(person, path, sourceIds, sourceAliases, issues);
    if (!isNonEmptyString(person.canonicalName)) {
      issues.push(issue("person.name", `${path}.canonicalName`, "Required."));
    }
    if (!Array.isArray(person.alternateNames)) {
      issues.push(issue("person.alternate-names", `${path}.alternateNames`, "Expected an array."));
    } else {
      person.alternateNames.forEach((name, nameIndex) => {
        const namePath = `${path}.alternateNames[${nameIndex}]`;
        if (!isRecord(name) || !isNonEmptyString(name.name)) {
          issues.push(issue("person.alternate-name", namePath, "Expected a named alternate-name object."));
          return;
        }
        if (!isOneOf(name.type, alternateNameTypeValues)) {
          issues.push(issue("person.alternate-name-type", `${namePath}.type`, "Unknown name type."));
        }
        if (!isOneOf(name.confidence, confidenceValues)) {
          issues.push(issue("confidence", `${namePath}.confidence`, "Unknown confidence value."));
        }
        validateSourceRefs(name.sourceRefs, `${namePath}.sourceRefs`, sourceIds, sourceAliases, issues);
      });
    }
  });

  places.forEach((place, index) => {
    const path = `graph.places[${index}]`;
    if (!isRecord(place)) return;
    validateEvidenceFields(place, path, sourceIds, sourceAliases, issues);
    if (!isNonEmptyString(place.modernName)) issues.push(issue("place.name", `${path}.modernName`, "Required."));
    if (!Array.isArray(place.historicalNames)) {
      issues.push(issue("place.historical-names", `${path}.historicalNames`, "Expected an array."));
    }
    if (!isOneOf(place.precision, locationPrecisionValues)) {
      issues.push(issue("place.precision", `${path}.precision`, "Unknown location precision."));
    }
    if (
      place.parentPlaceId !== undefined &&
      (!isPlaceId(place.parentPlaceId) ||
        (!placeIds.has(place.parentPlaceId) && !placeAliases.has(place.parentPlaceId)))
    ) {
      issues.push(issue("place.parent-ref", `${path}.parentPlaceId`, "Unknown parent place."));
    }
  });

  const resolvePersonRecord = (id: unknown): UnknownRecord | undefined => {
    if (!isPersonId(id)) return undefined;
    return peopleById.get(personAliases.get(id) ?? id);
  };

  relationships.forEach((relationship, index) => {
    const path = `graph.relationships[${index}]`;
    if (!isRecord(relationship)) return;
    validateEvidenceFields(relationship, path, sourceIds, sourceAliases, issues);
    if (!isOneOf(relationship.type, relationshipTypeValues)) {
      issues.push(issue("relationship.type", `${path}.type`, "Unknown relationship type."));
      return;
    }
    if (
      relationship.type === "parent-child" &&
      !isOneOf(relationship.parentage, parentageTypeValues)
    ) {
      issues.push(issue("relationship.parentage", `${path}.parentage`, "Unknown parentage type."));
    }
    const ids =
      relationship.type === "parent-child"
        ? [relationship.parentId, relationship.childId]
        : relationship.personIds;
    if (!Array.isArray(ids) || ids.length !== 2 || ids.some((id) => !isPersonId(id))) {
      issues.push(issue("relationship.people", path, "Expected two valid person references."));
      return;
    }
    if (ids[0] === ids[1]) {
      issues.push(issue("relationship.self", path, "A person cannot have a relationship with themself."));
    }
    ids.forEach((id, personIndex) => {
      const person = resolvePersonRecord(id);
      if (!person) {
        issues.push(issue("person-ref.missing", `${path}.people[${personIndex}]`, `Unknown person: ${String(id)}.`));
      } else if (relationship.researchStatus === "accepted" && person.researchStatus !== "accepted") {
        issues.push(
          issue(
            "lineage.candidate-promotion",
            `${path}.people[${personIndex}]`,
            `Accepted relationship cannot include ${String(person.researchStatus)} person ${String(id)}.`,
          ),
        );
      }
    });
  });

  events.forEach((event, index) => {
    const path = `graph.events[${index}]`;
    if (!isRecord(event)) return;
    validateEvidenceFields(event, path, sourceIds, sourceAliases, issues);
    if (!isOneOf(event.type, eventTypeValues)) {
      issues.push(issue("event.type", `${path}.type`, "Unknown event type."));
    }
    issues.push(...validateHistoricalDate(event.date, `${path}.date`).issues);
    if (!Array.isArray(event.personIds) || event.personIds.length === 0) {
      issues.push(issue("event.people", `${path}.personIds`, "Expected at least one person reference."));
    } else {
      event.personIds.forEach((id, personIndex) => {
        if (!resolvePersonRecord(id)) {
          issues.push(issue("person-ref.missing", `${path}.personIds[${personIndex}]`, `Unknown person: ${String(id)}.`));
        }
      });
    }
    if (event.relationshipIds !== undefined) {
      if (!Array.isArray(event.relationshipIds)) {
        issues.push(issue("event.relationships", `${path}.relationshipIds`, "Expected an array."));
      } else {
        event.relationshipIds.forEach((id, relationshipIndex) => {
          if (!isRelationshipId(id) || !relationshipIds.has(id)) {
            issues.push(issue("relationship-ref.missing", `${path}.relationshipIds[${relationshipIndex}]`, `Unknown relationship: ${String(id)}.`));
          }
        });
      }
    }
    if (
      event.placeId !== undefined &&
      (!isPlaceId(event.placeId) || (!placeIds.has(event.placeId) && !placeAliases.has(event.placeId)))
    ) {
      issues.push(issue("place-ref.missing", `${path}.placeId`, `Unknown place: ${String(event.placeId)}.`));
    }
    if (event.type === "other" && !isNonEmptyString(event.title)) {
      issues.push(issue("event.other-title", `${path}.title`, "Other events require a title."));
    }
    if (event.type === "migration") {
      validateMigration(event.migration, `${path}.migration`, placeIds, placeAliases, issues);
    } else if (event.migration !== undefined) {
      issues.push(issue("event.migration-type", `${path}.migration`, "Only migration events may include migration details."));
    }
  });

  return { valid: issues.length === 0, issues };
}

function validateMigration(
  value: unknown,
  path: string,
  placeIds: Set<string>,
  placeAliases: Map<string, string>,
  issues: ValidationIssue[],
): void {
  if (!isRecord(value)) {
    issues.push(issue("migration.required", path, "Migration events require movement details."));
    return;
  }
  if (!isOneOf(value.classification, movementClassificationValues)) {
    issues.push(issue("migration.classification", `${path}.classification`, "Unknown movement classification."));
  }
  for (const field of ["fromPlaceIds", "toPlaceIds"] as const) {
    const ids = value[field];
    if (!Array.isArray(ids) || ids.length === 0) {
      issues.push(issue("migration.places", `${path}.${field}`, "Expected at least one place reference."));
      continue;
    }
    ids.forEach((id, index) => {
      if (!isPlaceId(id) || (!placeIds.has(id) && !placeAliases.has(id))) {
        issues.push(issue("place-ref.missing", `${path}.${field}[${index}]`, `Unknown place: ${String(id)}.`));
      }
    });
  }
}

function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function resolvePersonId(graph: GenealogyGraph, id: PersonId): PersonId | undefined {
  const direct = graph.people.find((person) => person.id === id);
  if (direct) return direct.id;
  return graph.people.find((person) => person.idAliases?.includes(id))?.id;
}

export function resolveSourceId(graph: GenealogyGraph, id: SourceId): SourceId | undefined {
  const direct = graph.sources.find((source) => source.id === id);
  if (direct) return direct.id;
  return graph.sources.find((source) => source.idAliases?.includes(id))?.id;
}

export function assertValidGenealogyGraph(value: unknown): asserts value is GenealogyGraph {
  const result = validateGenealogyGraph(value);
  if (!result.valid) {
    const details = result.issues.map(({ path, message }) => `${path}: ${message}`).join("\n");
    throw new Error(`Invalid genealogy graph:\n${details}`);
  }
}
