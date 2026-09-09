import { scaleLinear } from "d3-scale";

import {
  createGenealogyQueries,
  MICHAEL_BUQUET_ID,
  type BranchClassification,
} from "@/lib/genealogy";
import type { Confidence, GenealogyGraph } from "@/types";

export type PatternKey =
  | "maternal"
  | "paternal"
  | "both"
  | Confidence
  | "birthplace-supported"
  | "birth-without-place"
  | "birth-not-recorded";

export interface PatternSegment {
  readonly key: PatternKey;
  readonly label: string;
  readonly count: number;
  /** Percentage of the chart's comparison scale, not an inferred completeness percentage. */
  readonly width: number;
}

export interface AncestorGenerationPattern {
  readonly generation: number;
  readonly label: string;
  readonly total: number;
  readonly segments: readonly PatternSegment[];
}

export interface ConfidencePattern {
  readonly entityType: "people" | "relationships" | "events" | "places";
  readonly label: string;
  readonly total: number;
  readonly segments: readonly PatternSegment[];
}

export interface BirthplaceEvidencePattern {
  readonly total: number;
  readonly distinctSupportedPlaces: number;
  readonly segments: readonly PatternSegment[];
}

export interface ExcludedPattern {
  readonly id: "surname-frequency" | "geographic-distribution" | "branch-completeness";
  readonly label: string;
  readonly reason: string;
}

export interface FamilyPatternsModel {
  readonly acceptedPeople: number;
  readonly recordedAncestors: number;
  readonly generations: readonly AncestorGenerationPattern[];
  readonly confidence: readonly ConfidencePattern[];
  readonly birthplaceEvidence: BirthplaceEvidencePattern;
  readonly excluded: readonly ExcludedPattern[];
}

const branchLabels: Readonly<Record<Exclude<BranchClassification, "self" | "unclassified">, string>> = {
  maternal: "Maternal",
  paternal: "Paternal",
  both: "Both branches",
};

const confidenceLabels: Readonly<Record<Confidence, string>> = {
  verified: "Verified",
  probable: "Probable",
  unresolved: "Unresolved",
};

function generationLabel(generation: number): string {
  if (generation === 1) return "Parents";
  if (generation === 2) return "Grandparents";
  return `Generation ${generation}`;
}

function proportionalSegments(
  entries: readonly { readonly key: PatternKey; readonly label: string; readonly count: number }[],
  total: number,
): readonly PatternSegment[] {
  const scale = scaleLinear().domain([0, Math.max(1, total)]).range([0, 100]);
  return entries.map((entry) => ({ ...entry, width: scale(entry.count) }));
}

export function buildFamilyPatternsModel(graph: GenealogyGraph): FamilyPatternsModel {
  const queries = createGenealogyQueries(graph);
  const acceptedPeople = graph.people.filter(({ researchStatus }) => researchStatus === "accepted");
  const ancestorMatches = queries
    .ancestors(MICHAEL_BUQUET_ID)
    .filter(({ person }) => person.researchStatus === "accepted");
  const generations = new Map<number, { maternal: number; paternal: number; both: number }>();

  for (const match of ancestorMatches) {
    const counts = generations.get(match.depth) ?? { maternal: 0, paternal: 0, both: 0 };
    const branch = queries.branchForPerson(match.person.id)?.classification;
    if (branch === "maternal" || branch === "paternal" || branch === "both") counts[branch] += 1;
    generations.set(match.depth, counts);
  }

  const maxGenerationTotal = Math.max(
    1,
    ...[...generations.values()].map(({ maternal, paternal, both }) => maternal + paternal + both),
  );
  const generationScale = scaleLinear().domain([0, maxGenerationTotal]).range([0, 100]);
  const generationPatterns = [...generations.entries()]
    .sort(([first], [second]) => first - second)
    .map(([generation, counts]): AncestorGenerationPattern => {
      const entries = (["maternal", "paternal", "both"] as const).map((key) => ({
        key,
        label: branchLabels[key],
        count: counts[key],
        width: generationScale(counts[key]),
      }));
      return {
        generation,
        label: generationLabel(generation),
        total: counts.maternal + counts.paternal + counts.both,
        segments: entries.filter(({ count }) => count > 0),
      };
    });

  const confidenceRows = [
    { entityType: "people", label: "People", records: acceptedPeople },
    {
      entityType: "relationships",
      label: "Relationships",
      records: graph.relationships.filter(({ researchStatus }) => researchStatus === "accepted"),
    },
    {
      entityType: "events",
      label: "Events",
      records: graph.events.filter(({ researchStatus }) => researchStatus === "accepted"),
    },
    {
      entityType: "places",
      label: "Places",
      records: graph.places.filter(({ researchStatus }) => researchStatus === "accepted"),
    },
  ] as const;
  const confidence = confidenceRows.map(({ entityType, label, records }): ConfidencePattern => {
    const counts = { verified: 0, probable: 0, unresolved: 0 } satisfies Record<Confidence, number>;
    for (const record of records) counts[record.confidence] += 1;
    return {
      entityType,
      label,
      total: records.length,
      segments: proportionalSegments(
        (["verified", "probable", "unresolved"] as const).map((key) => ({
          key,
          label: confidenceLabels[key],
          count: counts[key],
        })),
        records.length,
      ),
    };
  });

  const acceptedPersonIds = new Set(acceptedPeople.map(({ id }) => id));
  const acceptedPlaceIds = new Set(
    graph.places
      .filter(({ researchStatus }) => researchStatus === "accepted")
      .map(({ id }) => id),
  );
  const acceptedBirthEvents = graph.events.filter(
    (event) =>
      event.researchStatus === "accepted" &&
      event.type === "birth" &&
      event.personIds.some((personId) => acceptedPersonIds.has(personId)),
  );
  const peopleWithBirth = new Set(
    acceptedBirthEvents.flatMap(({ personIds }) =>
      personIds.filter((personId) => acceptedPersonIds.has(personId)),
    ),
  );
  const peopleWithSupportedBirthplace = new Set(
    acceptedBirthEvents.flatMap((event) =>
      event.placeId && acceptedPlaceIds.has(event.placeId)
        ? event.personIds.filter((personId) => acceptedPersonIds.has(personId))
        : [],
    ),
  );
  const distinctSupportedPlaces = new Set(
    acceptedBirthEvents.flatMap((event) =>
      event.placeId && acceptedPlaceIds.has(event.placeId) ? [event.placeId] : [],
    ),
  ).size;
  const birthplaceEntries = [
    {
      key: "birthplace-supported" as const,
      label: "Supported birthplace",
      count: peopleWithSupportedBirthplace.size,
    },
    {
      key: "birth-without-place" as const,
      label: "Birth evidence, place not established",
      count: peopleWithBirth.size - peopleWithSupportedBirthplace.size,
    },
    {
      key: "birth-not-recorded" as const,
      label: "No accepted birth event",
      count: acceptedPeople.length - peopleWithBirth.size,
    },
  ];

  return {
    acceptedPeople: acceptedPeople.length,
    recordedAncestors: ancestorMatches.length,
    generations: generationPatterns,
    confidence,
    birthplaceEvidence: {
      total: acceptedPeople.length,
      distinctSupportedPlaces,
      segments: proportionalSegments(birthplaceEntries, acceptedPeople.length),
    },
    excluded: [
      {
        id: "surname-frequency",
        label: "Surname frequency",
        reason:
          "Canonical, maiden, married, and historical spelling forms overlap; a frequency ranking would count naming conventions as if they were comparable lineage facts.",
      },
      {
        id: "geographic-distribution",
        label: "Birthplace distribution",
        reason:
          "Too few accepted people have a supported birthplace, and the represented records mix town, region, and country precision.",
      },
      {
        id: "branch-completeness",
        label: "Branch completeness percentage",
        reason:
          "The graph has no defensible denominator for every biological ancestor, so recorded ancestors cannot be converted into a completeness percentage.",
      },
    ],
  };
}
