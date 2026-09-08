import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import {
  buildPeopleDirectory,
  buildPeopleDirectoryOptions,
  filterPeopleDirectory,
  formatRecordedSurnameLabel,
  type PeopleDirectoryFilters,
} from "@/lib/genealogy/people-directory";
import type { PersonId } from "@/types";

const records = buildPeopleDirectory(familyGraph, familyGraphQueries);
const byId = new Map<PersonId, (typeof records)[number]>(
  records.map((record) => [record.person.id, record]),
);

const allFilters: PeopleDirectoryFilters = {
  branch: "all",
  surname: "",
  generation: null,
  birthplace: null,
  confidence: "all",
};

test("the directory contains every accepted canonical person exactly once", () => {
  assert.equal(records.length, familyGraph.people.length);
  assert.equal(new Set(records.map(({ person }) => person.id)).size, records.length);
  assert.ok(records.every(({ person }) => person.researchStatus === "accepted"));
});

test("generation counts only supported parent-child steps from Michael", () => {
  assert.equal(byId.get("person-michael-buquet")?.generation, 0);
  assert.equal(byId.get("person-paulette-comeaux")?.generation, 1);
  assert.equal(byId.get("person-rita-leblanc-1928")?.generation, 2);
  assert.equal(byId.get("person-euchariste-dugas")?.generation, 3);
  assert.equal(byId.get("person-abraham-dugas-1616")?.generation, 12);
  assert.equal(byId.get("person-sidney-paul-roger")?.generation, 2);
  assert.equal(byId.get("person-edmond-paul-buquet")?.generation, 2);
  assert.equal(byId.get("person-karla-vannessa-contreras-buquet")?.generation, 0);
  assert.equal(byId.get("person-chloe-eloise-buquet")?.generation, 1);
  assert.equal(byId.get("person-jolie-renee-buquet")?.generation, 1);
  assert.equal(byId.get("person-cathy-buquet")?.generation, 3);
  assert.equal(byId.get("person-russell-j-comeaux")?.generation, 3);
  assert.equal(byId.get("person-monica")?.generation, 3);
  assert.equal(byId.get("person-paige-bartholomew")?.generation, 4);
  assert.equal(byId.get("person-conrad-miller")?.generation, 4);
  assert.equal(byId.get("person-richard-russell-mcrae")?.generation, 5);
});

test("branch classification comes from canonical ancestry paths", () => {
  assert.equal(byId.get("person-rita-leblanc-1928")?.branch, "maternal");
  assert.equal(byId.get("person-verna-arlene-bakke")?.branch, "paternal");
  assert.equal(byId.get("person-michael-buquet")?.branch, "self");
  assert.equal(byId.get("person-sidney-paul-roger")?.branch, "maternal");
  assert.equal(byId.get("person-edmond-paul-buquet")?.branch, "both");
  assert.equal(byId.get("person-gina-buquet")?.branch, "both");
  assert.equal(byId.get("person-cathy-buquet")?.branch, "paternal");
  assert.equal(byId.get("person-russell-j-comeaux")?.branch, "maternal");
  assert.equal(byId.get("person-paige-bartholomew")?.branch, "paternal");
  assert.equal(byId.get("person-conrad-miller")?.branch, "maternal");
  assert.equal(byId.get("person-richard-russell-mcrae")?.branch, "unclassified");
  assert.equal(byId.get("person-paige-bartholomew")?.relationshipLabel, "Paternal first cousin");
  assert.equal(byId.get("person-conrad-miller")?.relationshipLabel, "Maternal first cousin");
  assert.equal(byId.get("person-paige-bartholomew")?.relationshipConfidence, "probable");
  assert.equal(byId.get("person-sidney-paul-roger")?.relationshipConfidence, "verified");
});

test("surname indexing uses supported canonical and alternate recorded names", () => {
  const vernaSurnames = byId.get("person-verna-arlene-bakke")?.surnames.map(({ value }) => value);
  const pauletteSurnames = byId.get("person-paulette-comeaux")?.surnames.map(({ value }) => value);
  const allenSurnames = byId.get("person-allen-comeaux-1925")?.surnames.map(({ value }) => value);
  const bouquet = byId
    .get("person-francois-michel-jacques-buquet")
    ?.surnames.find(({ value }) => value === "bouquet");

  assert.deepEqual(vernaSurnames, ["bakke", "buquet"]);
  assert.deepEqual(pauletteSurnames, ["buquet", "comeaux", "wheeler"]);
  assert.deepEqual(allenSurnames, ["comeaux"]);
  assert.deepEqual(byId.get("person-sidney-paul-roger")?.surnames.map(({ value }) => value), ["roger"]);
  assert.deepEqual(byId.get("person-gina-buquet")?.surnames.map(({ value }) => value), [
    "buquet",
    "nevils",
  ]);
  assert.equal(bouquet?.isCanonical, false);
  assert.deepEqual(bouquet?.alternateNameTypes, ["spelling"]);
  assert.equal(bouquet && formatRecordedSurnameLabel(bouquet), "Bouquet — alternate spelling");
});

test("birthplace includes only explicit birth events with canonical place references", () => {
  assert.deepEqual(
    byId.get("person-rita-leblanc-1928")?.birthplaces.map(({ placeId }) => placeId),
    ["place-us-la-cankton"],
  );
  assert.deepEqual(byId.get("person-edmond-p-buquet-1919")?.birthplaces, []);
  assert.deepEqual(byId.get("person-michael-buquet")?.birthplaces, []);

  const martinWisconsin = byId.get("person-martin-h-bakke")?.birthplaces[0];
  assert.equal(martinWisconsin?.placeId, "place-us-wi-wisconsin");
  assert.deepEqual(martinWisconsin?.confidenceStates, ["verified", "probable", "unresolved"]);
  assert.equal(martinWisconsin?.eventIds.length, 3);
});

test("filters compose without promoting absent or uncertain values", () => {
  const matches = filterPeopleDirectory(records, {
    ...allFilters,
    branch: "paternal",
    surname: "bakke",
    generation: 4,
    confidence: "verified",
  });
  const ids = matches.map(({ person }) => person.id);

  assert.deepEqual(ids, ["person-martin-h-bakke"]);
  assert.equal(
    filterPeopleDirectory(records, {
      ...allFilters,
      birthplace: "place-us-la-cankton",
    })[0]?.person.id,
    "person-rita-leblanc-1928",
  );
  assert.ok(
    filterPeopleDirectory(records, { ...allFilters, birthplace: "place-us-la-cankton" })
      .every(({ birthplaces }) => birthplaces.length > 0),
  );
});

test("filter options expose only values represented in canonical records", () => {
  const options = buildPeopleDirectoryOptions(records);

  assert.deepEqual(options.confidences.map(({ value }) => value), ["verified", "probable"]);
  assert.ok(options.surnames.some(({ value, label }) => value === "leblanc" && label === "LeBlanc"));
  assert.ok(options.surnames.some(({ value, label }) => value === "roger" && label === "Roger"));
  assert.ok(options.surnames.some(
    ({ value, label }) => value === "nevils" && label === "Nevils — married name",
  ));
  assert.ok(options.surnames.some(
    ({ value, label }) => value === "bouquet" && label === "Bouquet — alternate spelling",
  ));
  assert.ok(!options.surnames.some(({ value }) => value === "i"));
  assert.ok(options.generations.some(({ value, count, label }) =>
    value === 0 && count === 2 && label === "Generation 0 · Michael and spouse",
  ));
  assert.ok(options.birthplaces.some(({ value }) => value === "place-no-norway"));
  assert.ok(!options.birthplaces.some(({ label }) => /unknown/iu.test(label)));
});
