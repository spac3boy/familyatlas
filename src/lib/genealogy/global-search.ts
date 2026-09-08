import {
  formatRecordedSurnameLabel,
  recordedSurnamesForPerson,
} from "@/lib/genealogy/people-directory";
import { formatPlaceContext } from "@/lib/genealogy/place-profile";
import type {
  AlternateNameType,
  GenealogyGraph,
  PersonId,
  PlaceId,
  SourceId,
} from "@/types";

export type GlobalSearchKind = "person" | "place" | "surname" | "source";

export interface GlobalSearchEntry {
  readonly id: string;
  readonly entityId: PersonId | PlaceId | SourceId | string;
  readonly kind: GlobalSearchKind;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly keywords: readonly string[];
}

interface SurnameAggregate {
  readonly value: string;
  readonly label: string;
  readonly people: Set<PersonId>;
  readonly supportedNames: Set<string>;
  isCanonical: boolean;
  readonly alternateNameTypes: Set<AlternateNameType>;
}

const kindOrder: Readonly<Record<GlobalSearchKind, number>> = {
  person: 0,
  place: 1,
  surname: 2,
  source: 3,
};

const titleCase = (value: string): string =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/gu, " ");
}

function sourceDescription(
  source: GenealogyGraph["sources"][number],
): string {
  const parts = [
    source.repository,
    source.recordType,
    titleCase(source.category),
  ].filter((part): part is string => Boolean(part));
  return [...new Set(parts)].join(" · ");
}

export function buildGlobalSearchIndex(graph: GenealogyGraph): readonly GlobalSearchEntry[] {
  const acceptedPeople = graph.people.filter(({ researchStatus }) => researchStatus === "accepted");
  const acceptedPlaces = graph.places.filter(({ researchStatus }) => researchStatus === "accepted");
  const acceptedSources = graph.sources.filter(({ researchStatus }) => researchStatus === "accepted");

  const people: GlobalSearchEntry[] = acceptedPeople.map((person) => ({
    id: `search-person-${person.id}`,
    entityId: person.id,
    kind: "person",
    title: person.canonicalName,
    description: `Person · ${titleCase(person.confidence)}`,
    href: `/people/${person.id}`,
    keywords: [
      person.id,
      ...person.idAliases ?? [],
      ...person.alternateNames.map(({ name }) => name),
    ],
  }));

  const places: GlobalSearchEntry[] = acceptedPlaces.map((place) => {
    const context = formatPlaceContext(place);
    return {
      id: `search-place-${place.id}`,
      entityId: place.id,
      kind: "place",
      title: place.modernName,
      description: [context, titleCase(place.precision)].filter(Boolean).join(" · "),
      href: `/places/${place.id}`,
      keywords: [
        place.id,
        ...place.idAliases ?? [],
        ...place.historicalNames,
        ...place.alternateNames ?? [],
        place.settlement ?? "",
        place.parishCounty ?? "",
        place.stateProvinceRegion ?? "",
        place.country ?? "",
      ],
    };
  });

  const surnameMap = new Map<string, SurnameAggregate>();
  for (const person of acceptedPeople) {
    for (const surname of recordedSurnamesForPerson(person)) {
      const current = surnameMap.get(surname.value) ?? {
        value: surname.value,
        label: surname.label,
        people: new Set<PersonId>(),
        supportedNames: new Set<string>(),
        isCanonical: false,
        alternateNameTypes: new Set<AlternateNameType>(),
      };
      current.people.add(person.id);
      surname.supportedNames.forEach((name) => current.supportedNames.add(name));
      current.isCanonical ||= surname.isCanonical;
      surname.alternateNameTypes.forEach((type) => current.alternateNameTypes.add(type));
      surnameMap.set(surname.value, current);
    }
  }
  const surnames: GlobalSearchEntry[] = [...surnameMap.values()].map((surname) => ({
    id: `search-surname-${surname.value}`,
    entityId: surname.value,
    kind: "surname",
    title: formatRecordedSurnameLabel({
      label: surname.label,
      isCanonical: surname.isCanonical,
      alternateNameTypes: [...surname.alternateNameTypes],
    }),
    description: `Recorded surname · ${surname.people.size} ${surname.people.size === 1 ? "person" : "people"}`,
    href: `/people?surname=${encodeURIComponent(surname.value)}`,
    keywords: [surname.value, surname.label, ...surname.supportedNames],
  }));

  const sources: GlobalSearchEntry[] = acceptedSources.map((source) => ({
    id: `search-source-${source.id}`,
    entityId: source.id,
    kind: "source",
    title: source.title,
    description: sourceDescription(source),
    href: `/sources/${source.id}`,
    keywords: [
      source.id,
      ...source.idAliases ?? [],
      source.category,
      source.evidenceClass,
      source.inspectionStatus,
      source.recordType ?? "",
      source.repository ?? "",
      source.jurisdiction ?? "",
      ...source.citationHandles,
    ],
  }));

  return [...people, ...places, ...surnames, ...sources].sort(
    (first, second) =>
      kindOrder[first.kind] - kindOrder[second.kind]
      || first.title.localeCompare(second.title)
      || first.id.localeCompare(second.id),
  );
}

interface RankedEntry {
  readonly entry: GlobalSearchEntry;
  readonly score: number;
}

function scoreEntry(entry: GlobalSearchEntry, query: string, terms: readonly string[]): number {
  const title = normalizeSearchText(entry.title);
  const description = normalizeSearchText(entry.description);
  const keywords = entry.keywords.map(normalizeSearchText).filter(Boolean);
  const searchable = [title, description, ...keywords];
  if (!terms.every((term) => searchable.some((value) => value.includes(term)))) return -1;

  let score = 0;
  if (title === query) score += 1_000;
  else if (title.startsWith(query)) score += 800;
  else if (title.split(" ").some((word) => word.startsWith(query))) score += 700;
  else if (title.includes(query)) score += 600;
  if (keywords.some((value) => value === query)) score += 500;

  for (const term of terms) {
    if (title.split(" ").some((word) => word.startsWith(term))) score += 60;
    else if (title.includes(term)) score += 40;
    if (keywords.some((value) => value.startsWith(term))) score += 25;
    else if (searchable.some((value) => value.includes(term))) score += 10;
  }
  return score;
}

export function searchGlobalIndex(
  index: readonly GlobalSearchEntry[],
  rawQuery: string,
  limit = 24,
): readonly GlobalSearchEntry[] {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError("Search limit must be a positive integer.");
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];
  const terms = query.split(" ");

  return index
    .map((entry): RankedEntry => ({ entry, score: scoreEntry(entry, query, terms) }))
    .filter(({ score }) => score >= 0)
    .sort(
      (first, second) =>
        second.score - first.score
        || kindOrder[first.entry.kind] - kindOrder[second.entry.kind]
        || first.entry.title.localeCompare(second.entry.title)
        || first.entry.id.localeCompare(second.entry.id),
    )
    .slice(0, limit)
    .map(({ entry }) => entry);
}
