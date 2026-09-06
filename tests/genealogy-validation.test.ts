import assert from "node:assert/strict";
import test from "node:test";

import {
  assertValidGenealogyGraph,
  isEventId,
  isPersonId,
  isPlaceId,
  isSourceId,
  resolvePersonId,
  resolveSourceId,
  validateGenealogyGraph,
  validateHistoricalDate,
} from "@/lib/genealogy/validation";
import type { GenealogyGraph, Person, Source } from "@/types";

const source = {
  id: "SRC-TEST-ONE",
  title: "Synthetic schema test fixture",
  category: "other",
  urls: [],
  citationHandles: ["test-fixture"],
  evidenceClass: "unknown",
  inspectionStatus: "directly-inspected",
  researchStatus: "accepted",
  idAliases: ["SRC-TEST-ALIAS"],
} as const satisfies Source;

const sourceRefs = [{ sourceId: "SRC-TEST-ALIAS" }] as const;

const parent = {
  id: "person-test-parent",
  canonicalName: "Test Parent",
  alternateNames: [],
  confidence: "verified",
  researchStatus: "accepted",
  sourceRefs,
  idAliases: ["person-test-parent-old"],
} as const satisfies Person;

const child = {
  id: "person-test-child",
  canonicalName: "Test Child",
  alternateNames: [],
  confidence: "probable",
  researchStatus: "accepted",
  sourceRefs,
} as const satisfies Person;

const validGraph = {
  schemaVersion: 1,
  sources: [source],
  people: [parent, child],
  places: [
    {
      id: "place-test-town",
      modernName: "Test Town",
      historicalNames: [],
      precision: "town-city",
      confidence: "verified",
      researchStatus: "accepted",
      sourceRefs,
    },
  ],
  relationships: [
    {
      id: "relationship-test-parent-child",
      type: "parent-child",
      parentage: "biological",
      parentId: parent.id,
      childId: child.id,
      confidence: "verified",
      researchStatus: "accepted",
      sourceRefs,
    },
  ],
  events: [
    {
      id: "event-test-residence",
      type: "residence",
      personIds: [child.id],
      date: { kind: "year", year: 1900 },
      placeId: "place-test-town",
      confidence: "verified",
      researchStatus: "accepted",
      sourceRefs,
    },
  ],
} as const satisfies GenealogyGraph;

test("HistoricalDate accepts all supported precision forms", () => {
  const dates = [
    { kind: "exact", value: "2000-02-29" },
    { kind: "year", year: 1900 },
    { kind: "circa", value: { kind: "year", year: 1850 }, toleranceYears: 2 },
    { kind: "before", value: { kind: "exact", value: "1800-01-01" } },
    { kind: "after", value: { kind: "year", year: 1800 } },
    {
      kind: "range",
      start: { kind: "year", year: 1890 },
      end: { kind: "exact", value: "1895-06-01" },
    },
    { kind: "unknown", originalText: "date not established" },
  ];

  for (const date of dates) assert.equal(validateHistoricalDate(date).valid, true);
});

test("HistoricalDate rejects impossible dates and inverted ranges", () => {
  const impossible = validateHistoricalDate({ kind: "exact", value: "1900-02-29" });
  assert.equal(impossible.valid, false);
  assert.ok(impossible.issues.some(({ code }) => code === "date.exact"));

  const inverted = validateHistoricalDate({
    kind: "range",
    start: { kind: "exact", value: "1901-01-01" },
    end: { kind: "year", year: 1900 },
  });
  assert.equal(inverted.valid, false);
  assert.ok(inverted.issues.some(({ code }) => code === "date.range-order"));
});

test("stable ID guards enforce entity namespaces", () => {
  assert.equal(isPersonId("person-test-person"), true);
  assert.equal(isPersonId("candidate-test-person"), true);
  assert.equal(isPersonId("candidate-place-test"), false);
  assert.equal(isPlaceId("candidate-place-test"), true);
  assert.equal(isEventId("event-test"), true);
  assert.equal(isSourceId("SRC-TEST-ONE"), true);
  assert.equal(isSourceId("src-test-one"), false);
});

test("valid graph resolves source and person aliases", () => {
  assert.deepEqual(validateGenealogyGraph(validGraph), { valid: true, issues: [] });
  assert.equal(resolveSourceId(validGraph, "SRC-TEST-ALIAS"), "SRC-TEST-ONE");
  assert.equal(resolvePersonId(validGraph, "person-test-parent-old"), "person-test-parent");
  assert.doesNotThrow(() => assertValidGenealogyGraph(validGraph));
});

test("graph validation rejects dangling source and person references", () => {
  const withMissingSource = structuredClone(validGraph) as unknown as GenealogyGraph;
  (withMissingSource.people[0].sourceRefs[0] as { sourceId: string }).sourceId = "SRC-MISSING";
  const missingSource = validateGenealogyGraph(withMissingSource);
  assert.ok(missingSource.issues.some(({ code }) => code === "source-ref.missing"));

  const withMissingPerson = structuredClone(validGraph) as unknown as GenealogyGraph;
  (withMissingPerson.relationships[0] as { childId: string }).childId = "person-missing";
  const missingPerson = validateGenealogyGraph(withMissingPerson);
  assert.ok(missingPerson.issues.some(({ code }) => code === "person-ref.missing"));
});

test("accepted lineage cannot include a rejected or research-only person", () => {
  const graph = structuredClone(validGraph) as unknown as GenealogyGraph;
  (graph.people[1] as { researchStatus: string }).researchStatus = "research-only-candidate";
  const result = validateGenealogyGraph(graph);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some(({ code }) => code === "lineage.candidate-promotion"));
});

test("migration evidence requires classified, resolvable endpoints", () => {
  const graph = structuredClone(validGraph) as unknown as GenealogyGraph;
  (graph.events as unknown as unknown[])[0] = {
    ...graph.events[0],
    type: "migration",
    migration: {
      classification: "separate-known-locations-route-unknown",
      fromPlaceIds: ["place-test-town"],
      toPlaceIds: ["place-missing"],
    },
  };
  const result = validateGenealogyGraph(graph);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some(({ code }) => code === "place-ref.missing"));
});
