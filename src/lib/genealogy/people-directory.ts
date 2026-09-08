import {
  createGenealogyQueries,
  MICHAEL_BUQUET_ID,
  type BranchClassification,
  type GenealogyQueries,
} from "@/lib/genealogy/queries";
import { buildPersonDetailModel } from "@/lib/genealogy/person-detail";
import type {
  AlternateNameType,
  Confidence,
  EventId,
  GenealogyGraph,
  Person,
  PersonId,
  PlaceId,
} from "@/types";

export interface DirectorySurname {
  readonly value: string;
  readonly label: string;
  readonly supportedNames: readonly string[];
  readonly confidenceStates: readonly Confidence[];
  readonly isCanonical: boolean;
  readonly alternateNameTypes: readonly AlternateNameType[];
}

export interface DirectoryBirthplace {
  readonly placeId: PlaceId;
  readonly label: string;
  readonly confidenceStates: readonly Confidence[];
  readonly eventIds: readonly EventId[];
}

export interface PeopleDirectoryRecord {
  readonly person: Person;
  readonly relationshipLabel: string;
  readonly lifespan?: string;
  readonly branch: BranchClassification;
  /** Parent-child edges from Michael. Zero is Michael. */
  readonly generation: number;
  readonly surnames: readonly DirectorySurname[];
  readonly birthplaces: readonly DirectoryBirthplace[];
}

export interface PeopleDirectoryFilters {
  readonly branch: "all" | "maternal" | "paternal";
  readonly surname: string;
  readonly generation: number | null;
  readonly birthplace: PlaceId | null;
  readonly confidence: "all" | Confidence;
}

export interface PeopleDirectoryOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
  readonly count: number;
}

export interface PeopleDirectoryOptions {
  readonly surnames: readonly PeopleDirectoryOption<string>[];
  readonly generations: readonly PeopleDirectoryOption<number>[];
  readonly birthplaces: readonly PeopleDirectoryOption<PlaceId>[];
  readonly confidences: readonly PeopleDirectoryOption<Confidence>[];
}

const confidenceOrder: readonly Confidence[] = ["verified", "probable", "unresolved"];
const alternateNameTypeOrder: readonly AlternateNameType[] = [
  "maiden",
  "married",
  "nickname",
  "spelling",
  "source-form",
  "other",
];

function normalizeSurname(value: string): string {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("en-US");
}

function surnameFromName(name: string): string | undefined {
  const withoutSuffix = name
    .replace(/[,\s]+(?:Jr\.?|Sr\.?|I|II|III|IV)$/iu, "")
    .replace(/[”'.,]+$/u, "")
    .trim();
  const surname = withoutSuffix.split(/\s+/u).at(-1)?.replace(/^[“'.,]+|[”'.,]+$/gu, "");
  return surname || undefined;
}

export function recordedSurnamesForPerson(person: Person): readonly DirectorySurname[] {
  const grouped = new Map<
    string,
    {
      label: string;
      supportedNames: Set<string>;
      confidenceStates: Set<Confidence>;
      isCanonical: boolean;
      alternateNameTypes: Set<AlternateNameType>;
    }
  >();
  const names: {
    name: string;
    confidence: Confidence;
    isCanonical: boolean;
    type?: AlternateNameType;
  }[] = [
    { name: person.canonicalName, confidence: person.confidence, isCanonical: true },
    ...person.alternateNames.map(({ name, confidence, type }) => ({
      name,
      confidence,
      isCanonical: false,
      type,
    })),
  ];
  for (const { name, confidence, isCanonical, type } of names) {
    const surname = surnameFromName(name);
    if (!surname) continue;
    const value = normalizeSurname(surname);
    const entry = grouped.get(value) ?? {
      label: surname,
      supportedNames: new Set(),
      confidenceStates: new Set(),
      isCanonical: false,
      alternateNameTypes: new Set(),
    };
    entry.supportedNames.add(name);
    entry.confidenceStates.add(confidence);
    entry.isCanonical ||= isCanonical;
    if (type) entry.alternateNameTypes.add(type);
    grouped.set(value, entry);
  }
  return [...grouped.entries()]
    .map(([value, { label, supportedNames, confidenceStates, isCanonical, alternateNameTypes }]) => ({
      value,
      label,
      supportedNames: [...supportedNames],
      confidenceStates: weakestFirst(confidenceStates),
      isCanonical,
      alternateNameTypes: alternateNameTypeOrder.filter((type) => alternateNameTypes.has(type)),
    }))
    .sort((first, second) => first.label.localeCompare(second.label));
}

export function recordedSurnameQualifier(
  surname: Pick<DirectorySurname, "isCanonical" | "alternateNameTypes">,
): string | undefined {
  if (surname.isCanonical) return undefined;
  if (surname.alternateNameTypes.length !== 1) return "alternate name form";

  switch (surname.alternateNameTypes[0]) {
    case "maiden":
      return "maiden name";
    case "married":
      return "married name";
    case "spelling":
      return "alternate spelling";
    case "source-form":
      return "source-recorded form";
    case "nickname":
      return "nickname form";
    case "other":
      return "alternate name form";
  }
}

export function formatRecordedSurnameLabel(
  surname: Pick<DirectorySurname, "label" | "isCanonical" | "alternateNameTypes">,
): string {
  const qualifier = recordedSurnameQualifier(surname);
  return qualifier ? `${surname.label} — ${qualifier}` : surname.label;
}

function birthplaceLabel(
  place: GenealogyGraph["places"][number],
): string {
  const region = [place.stateProvinceRegion, place.country]
    .filter((part): part is string => Boolean(part) && part !== place.modernName);
  return [place.modernName, ...region].join(", ");
}

function weakestFirst(states: Iterable<Confidence>): readonly Confidence[] {
  const unique = new Set(states);
  return confidenceOrder.filter((state) => unique.has(state));
}

function directoryBirthplaces(
  graph: GenealogyGraph,
  queries: GenealogyQueries,
  personId: PersonId,
): readonly DirectoryBirthplace[] {
  const placeById = new Map(graph.places.map((place) => [place.id, place]));
  const grouped = new Map<
    PlaceId,
    { label: string; confidenceStates: Set<Confidence>; eventIds: Set<EventId> }
  >();

  for (const event of queries.eventsByPerson(personId)) {
    if (event.type !== "birth" || !event.placeId) continue;
    const place = placeById.get(event.placeId);
    if (!place) continue;
    const entry = grouped.get(place.id) ?? {
      label: birthplaceLabel(place),
      confidenceStates: new Set(),
      eventIds: new Set(),
    };
    entry.confidenceStates.add(event.confidence);
    entry.confidenceStates.add(place.confidence);
    entry.eventIds.add(event.id);
    grouped.set(place.id, entry);
  }

  return [...grouped.entries()]
    .map(([placeId, { label, confidenceStates, eventIds }]) => ({
      placeId,
      label,
      confidenceStates: weakestFirst(confidenceStates),
      eventIds: [...eventIds],
    }))
    .sort((first, second) => first.label.localeCompare(second.label));
}

export function buildPeopleDirectory(
  graph: GenealogyGraph,
  suppliedQueries?: GenealogyQueries,
): readonly PeopleDirectoryRecord[] {
  const queries = suppliedQueries ?? createGenealogyQueries(graph);
  const ancestorDepth = new Map(
    queries.ancestors(MICHAEL_BUQUET_ID).map(({ person, depth }) => [person.id, depth]),
  );

  return graph.people
    .filter(({ researchStatus }) => researchStatus === "accepted")
    .flatMap((person): PeopleDirectoryRecord[] => {
      const detail = buildPersonDetailModel(graph, person.id, queries);
      const generation = person.id === MICHAEL_BUQUET_ID ? 0 : ancestorDepth.get(person.id);
      if (!detail || generation === undefined) return [];
      return [{
        person,
        relationshipLabel: detail.relationshipLabel,
        lifespan: detail.lifespan,
        branch: queries.branchForPerson(person.id)?.classification ?? "unclassified",
        generation,
        surnames: recordedSurnamesForPerson(person),
        birthplaces: directoryBirthplaces(graph, queries, person.id),
      }];
    })
    .sort((first, second) => first.person.canonicalName.localeCompare(second.person.canonicalName));
}

export function buildPeopleDirectoryOptions(
  records: readonly PeopleDirectoryRecord[],
): PeopleDirectoryOptions {
  const surnameCounts = new Map<
    string,
    {
      label: string;
      count: number;
      isCanonical: boolean;
      alternateNameTypes: Set<AlternateNameType>;
    }
  >();
  const generationCounts = new Map<number, number>();
  const birthplaceCounts = new Map<PlaceId, { label: string; count: number }>();
  const confidenceCounts = new Map<Confidence, number>();

  for (const record of records) {
    generationCounts.set(record.generation, (generationCounts.get(record.generation) ?? 0) + 1);
    confidenceCounts.set(record.person.confidence, (confidenceCounts.get(record.person.confidence) ?? 0) + 1);
    for (const surname of record.surnames) {
      const entry = surnameCounts.get(surname.value) ?? {
        label: surname.label,
        count: 0,
        isCanonical: false,
        alternateNameTypes: new Set<AlternateNameType>(),
      };
      entry.count += 1;
      entry.isCanonical ||= surname.isCanonical;
      surname.alternateNameTypes.forEach((type) => entry.alternateNameTypes.add(type));
      surnameCounts.set(surname.value, entry);
    }
    for (const birthplace of record.birthplaces) {
      const entry = birthplaceCounts.get(birthplace.placeId) ?? { label: birthplace.label, count: 0 };
      entry.count += 1;
      birthplaceCounts.set(birthplace.placeId, entry);
    }
  }

  return {
    surnames: [...surnameCounts.entries()]
      .map(([value, { label, count, isCanonical, alternateNameTypes }]) => ({
        value,
        label: formatRecordedSurnameLabel({
          label,
          isCanonical,
          alternateNameTypes: [...alternateNameTypes],
        }),
        count,
      }))
      .sort((first, second) => first.label.localeCompare(second.label)),
    generations: [...generationCounts.entries()]
      .map(([value, count]) => ({
        value,
        label: value === 0 ? "Generation 0 · Michael" : `Generation ${value}`,
        count,
      }))
      .sort((first, second) => first.value - second.value),
    birthplaces: [...birthplaceCounts.entries()]
      .map(([value, { label, count }]) => ({ value, label, count }))
      .sort((first, second) => first.label.localeCompare(second.label)),
    confidences: confidenceOrder.flatMap((value) => {
      const count = confidenceCounts.get(value);
      return count ? [{ value, label: value[0].toUpperCase() + value.slice(1), count }] : [];
    }),
  };
}

export function filterPeopleDirectory(
  records: readonly PeopleDirectoryRecord[],
  filters: PeopleDirectoryFilters,
): readonly PeopleDirectoryRecord[] {
  return records.filter((record) => {
    if (filters.branch !== "all" && record.branch !== filters.branch && record.branch !== "both") {
      return false;
    }
    if (filters.surname && !record.surnames.some(({ value }) => value === filters.surname)) {
      return false;
    }
    if (filters.generation !== null && record.generation !== filters.generation) return false;
    if (
      filters.birthplace &&
      !record.birthplaces.some(({ placeId }) => placeId === filters.birthplace)
    ) {
      return false;
    }
    if (filters.confidence !== "all" && record.person.confidence !== filters.confidence) return false;
    return true;
  });
}
