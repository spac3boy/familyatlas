import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph } from "@/data";
import { buildFamilyPatternsModel } from "@/lib/visualization";

const model = buildFamilyPatternsModel(familyGraph);

test("patterns count accepted ancestor identities without implying theoretical completeness", () => {
  assert.equal(model.acceptedPeople, 83);
  assert.equal(model.recordedAncestors, 56);
  assert.equal(model.generations.reduce((sum, row) => sum + row.total, 0), 56);
  assert.deepEqual(
    model.generations.slice(0, 3).map(({ generation, total }) => ({ generation, total })),
    [
      { generation: 1, total: 2 },
      { generation: 2, total: 4 },
      { generation: 3, total: 8 },
    ],
  );
  assert.ok(model.excluded.some(({ id }) => id === "branch-completeness"));
});

test("generation branch segments retain maternal and paternal identity counts", () => {
  const counts = new Map<string, number>();
  for (const row of model.generations) {
    for (const segment of row.segments) {
      counts.set(segment.key, (counts.get(segment.key) ?? 0) + segment.count);
    }
  }

  assert.equal(counts.get("maternal"), 31);
  assert.equal(counts.get("paternal"), 25);
  assert.equal(counts.get("both"), undefined);
  assert.ok(model.generations.every((row) => row.segments.every(({ width }) => width > 0 && width <= 100)));
});

test("birthplace coverage keeps missing evidence as explicit categories", () => {
  const counts = Object.fromEntries(
    model.birthplaceEvidence.segments.map(({ key, count }) => [key, count]),
  );

  assert.deepEqual(counts, {
    "birthplace-supported": 11,
    "birth-without-place": 32,
    "birth-not-recorded": 40,
  });
  assert.equal(model.birthplaceEvidence.distinctSupportedPlaces, 9);
  assert.equal(
    model.birthplaceEvidence.segments.reduce((sum, { count }) => sum + count, 0),
    model.acceptedPeople,
  );
  assert.ok(model.excluded.some(({ id }) => id === "geographic-distribution"));
});

test("confidence is counted separately for each accepted entity type", () => {
  const rows = Object.fromEntries(
    model.confidence.map((row) => [
      row.entityType,
      Object.fromEntries(row.segments.map(({ key, count }) => [key, count])),
    ]),
  );

  assert.deepEqual(rows, {
    people: { verified: 38, probable: 45, unresolved: 0 },
    relationships: { verified: 42, probable: 77, unresolved: 0 },
    events: { verified: 40, probable: 82, unresolved: 3 },
    places: { verified: 16, probable: 22, unresolved: 0 },
  });
  assert.ok(
    model.confidence.every(
      (row) => Math.abs(row.segments.reduce((sum, { width }) => sum + width, 0) - 100) < 0.000_001,
    ),
  );
});

test("patterns decline rankings that the current evidence cannot defend", () => {
  assert.deepEqual(
    model.excluded.map(({ id }) => id),
    ["surname-frequency", "geographic-distribution", "branch-completeness"],
  );
});
