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
  assert.equal(rita.relationshipPaths[0].confidence, "verified");
  assert.deepEqual(rita.relationshipPaths[0].provenanceKinds, ["family-confirmed"]);
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
  assert.deepEqual(rita.children.map(({ person }) => person.canonicalName), [
    "Allen Paul Comeaux Jr.",
    "Paulette Comeaux",
    "Peggy C. Miller",
    "Priscilla C. Babineaux",
    "Russell J. Comeaux",
  ]);
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

test("sibling paths are graph-derived through supported shared parents", () => {
  const sidney = buildPersonDetailModel(familyGraph, "person-sidney-paul-roger");
  assert.ok(sidney);
  assert.deepEqual(
    sidney.relationshipPaths[0].people.map(({ id }) => id),
    ["person-michael-buquet", "person-paulette-comeaux", "person-sidney-paul-roger"],
  );
  assert.deepEqual(sidney.relationshipPaths[0].provenanceKinds, ["family-confirmed"]);
  assert.equal(sidney.relationshipLabel, "Maternal sibling through Paulette Comeaux");
  assert.equal(sidney.lifespan, undefined);

  const gina = buildPersonDetailModel(familyGraph, "person-gina-buquet");
  assert.ok(gina);
  assert.equal(gina.relationshipLabel, "Sibling through both recorded parents");
  assert.equal(gina.relationshipPaths.length, 2);
  assert.ok(gina.relationshipPaths.every(({ confidence }) => confidence === "verified"));
});

test("first-cousin labels and paths are graph-derived without cousin edges", () => {
  const paige = buildPersonDetailModel(familyGraph, "person-paige-bartholomew");
  const conrad = buildPersonDetailModel(familyGraph, "person-conrad-miller");
  assert.ok(paige && conrad);

  assert.equal(paige.relationshipLabel, "Paternal first cousin");
  assert.equal(conrad.relationshipLabel, "Maternal first cousin");
  assert.deepEqual(
    paige.relationshipPaths
      .map(({ people }) => people.map(({ id }) => id).join(" > "))
      .sort(),
    [
      "person-michael-buquet > person-aubin-buquet > person-edmond-p-buquet-1919 > person-cathy-buquet > person-paige-bartholomew",
      "person-michael-buquet > person-aubin-buquet > person-verna-arlene-bakke > person-cathy-buquet > person-paige-bartholomew",
    ],
  );
  assert.ok(paige.relationshipPaths.every(({ confidence }) => confidence === "verified"));
  assert.deepEqual(paige.parents.map(({ person }) => person.id), [
    "person-cathy-buquet",
    "person-richard-russell-mcrae",
  ]);
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
