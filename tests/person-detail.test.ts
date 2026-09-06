import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import { buildPersonDetailModel, formatPersonDetailDate } from "@/lib/genealogy";

test("person details derive the Michael-first relationship path from canonical edges", () => {
  const rita = buildPersonDetailModel(
    familyGraph,
    "person-rita-leblanc-1928",
    familyGraphQueries,
  );

  assert.ok(rita);
  assert.equal(rita.relationshipLabel, "Maternal grandparent");
  assert.deepEqual(
    rita.relationshipPaths[0].people.map(({ canonicalName }) => canonicalName),
    ["Michael Buquet", "Paulette Comeaux", "Rita LeBlanc"],
  );
  assert.deepEqual(rita.relationshipPaths[0].relationshipIds, [
    "relationship-paulette-comeaux-parent-michael-buquet",
    "relationship-rita-leblanc-parent-paulette-comeaux",
  ]);
  assert.equal(rita.relationshipPaths[0].confidence, "probable");
  assert.equal(rita.lifespan, "April 20, 1928–February 13, 2017");
  assert.equal(
    rita.sourceCount,
    familyGraphQueries.sourcesSupportingPerson("person-rita-leblanc-1928").length,
  );
});

test("person details expose only canonical direct relatives and supported places", () => {
  const rita = buildPersonDetailModel(familyGraph, "person-rita-leblanc-1928");
  assert.ok(rita);

  assert.deepEqual(rita.spousesAndPartners.map(({ person }) => person.canonicalName), [
    "Allen Paul Comeaux Sr.",
  ]);
  assert.deepEqual(rita.children.map(({ person }) => person.canonicalName), ["Paulette Comeaux"]);
  assert.ok(rita.places.some(({ place }) => place.modernName === "Cankton"));
  assert.ok(rita.places.some(({ place }) => place.modernName === "Carencro"));
});

test("the reference person remains undated when the normalized graph has no life dates", () => {
  const michael = buildPersonDetailModel(familyGraph, "person-michael-buquet");
  assert.ok(michael);

  assert.equal(michael.relationshipLabel, "Reference person");
  assert.equal(michael.lifespan, undefined);
  assert.deepEqual(michael.relationshipPaths[0].people.map(({ id }) => id), [
    "person-michael-buquet",
  ]);
  assert.deepEqual(michael.parents.map(({ person }) => person.canonicalName), [
    "Aubin Buquet",
    "Paulette Comeaux",
  ]);
  assert.match(michael.biography, /no additional biographical events are established/i);
});

test("conflicting life dates remain visible as alternatives", () => {
  const oscar = buildPersonDetailModel(familyGraph, "person-oscar-paul-bakke");
  assert.ok(oscar);
  assert.equal(
    oscar.lifespan,
    "Birth: January 31, 1884 / January 31, 1885 · Death: January 10, 1937",
  );
  assert.match(oscar.biography, /alternative birth details/i);
});

test("historical-date formatting preserves precision and unknown values", () => {
  assert.equal(formatPersonDetailDate({ kind: "year", year: 1928 }), "1928");
  assert.equal(
    formatPersonDetailDate({ kind: "circa", value: { kind: "year", year: 1737 } }),
    "circa 1737",
  );
  assert.equal(
    formatPersonDetailDate({
      kind: "range",
      start: { kind: "year", year: 1778 },
      end: { kind: "year", year: 1779 },
    }),
    "1778–1779",
  );
  assert.equal(formatPersonDetailDate({ kind: "unknown" }), undefined);
  assert.equal(buildPersonDetailModel(familyGraph, "person-not-present"), undefined);
});
