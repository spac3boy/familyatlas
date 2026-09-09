import assert from "node:assert/strict";
import test from "node:test";

import { familyGraphQueries as queries } from "@/data";
import type { PersonId } from "@/types";

const personIds = <T extends { readonly person: { readonly id: PersonId } }>(items: readonly T[]) =>
  items.map(({ person }) => person.id);

test("person and direct-family queries return evidence-bearing records", () => {
  assert.equal(queries.personById("person-michael-buquet")?.canonicalName, "Michael Buquet");
  assert.equal(queries.personById("person-not-present"), undefined);

  assert.deepEqual(personIds(queries.parents("person-michael-buquet")), [
    "person-aubin-buquet",
    "person-paulette-comeaux",
  ]);
  assert.deepEqual(personIds(queries.children("person-paulette-comeaux")), [
    "person-edmond-paul-buquet",
    "person-gina-buquet",
    "person-michael-buquet",
    "person-sidney-paul-roger",
  ]);
  assert.deepEqual(personIds(queries.children("person-michael-buquet")), [
    "person-chloe-eloise-buquet",
    "person-jolie-renee-buquet",
  ]);

  const michaelSpouse = queries.spousesAndPartners("person-michael-buquet");
  assert.equal(michaelSpouse.length, 1);
  assert.equal(michaelSpouse[0]?.person.id, "person-karla-vannessa-contreras-buquet");
  assert.equal(michaelSpouse[0]?.relationship.confidence, "verified");

  const ritaPartner = queries.spousesAndPartners("person-rita-leblanc-1928");
  assert.equal(ritaPartner.length, 1);
  assert.equal(ritaPartner[0].person.id, "person-allen-comeaux-1925");
  assert.equal(ritaPartner[0].relationship.type, "spouse");
  assert.equal(ritaPartner[0].relationship.confidence, "probable");
});

test("ancestor and descendant traversal preserves depth, paths, and weakest confidence", () => {
  const directAncestors = queries.ancestors("person-michael-buquet", { maxDepth: 1 });
  assert.deepEqual(personIds(directAncestors), ["person-aubin-buquet", "person-paulette-comeaux"]);

  const ancestors = queries.ancestors("person-michael-buquet");
  assert.equal(ancestors.length, 56);
  const abraham = ancestors.find(({ person }) => person.id === "person-abraham-dugas-1616");
  assert.equal(abraham?.depth, 12);
  assert.equal(abraham?.paths[0].confidence, "probable");
  assert.equal(abraham?.paths[0].people[0].id, "person-michael-buquet");
  assert.equal(abraham?.paths[0].people.at(-1)?.id, "person-abraham-dugas-1616");

  const descendants = queries.descendants("person-abraham-dugas-1616");
  const michael = descendants.find(({ person }) => person.id === "person-michael-buquet");
  assert.equal(michael?.depth, 12);
});

test("siblings are derived from shared-parent evidence without a direct sibling edge", () => {
  const matches = queries.siblings("person-michael-buquet");
  assert.deepEqual(personIds(matches), [
    "person-edmond-paul-buquet",
    "person-gina-buquet",
    "person-sidney-paul-roger",
  ]);
  assert.deepEqual(
    matches.find(({ person }) => person.id === "person-sidney-paul-roger")?.sharedParents.map(
      ({ parent }) => parent.id,
    ),
    ["person-paulette-comeaux"],
  );
  assert.deepEqual(
    matches.find(({ person }) => person.id === "person-gina-buquet")?.sharedParents.map(
      ({ parent }) => parent.id,
    ),
    ["person-aubin-buquet", "person-paulette-comeaux"],
  );
});

test("parental sibling groups are derived from shared obituary-backed parents", () => {
  const paternal = queries.siblings("person-aubin-buquet");
  const maternal = queries.siblings("person-paulette-comeaux");

  assert.deepEqual(personIds(paternal), [
    "person-cathy-buquet",
    "person-michael-buquet-edmond-child",
  ]);
  assert.deepEqual(personIds(maternal), [
    "person-allen-paul-comeaux-jr",
    "person-peggy-comeaux",
    "person-priscilla-comeaux",
    "person-russell-j-comeaux",
  ]);
  assert.ok(paternal.every(({ sharedParents }) => sharedParents.length === 2));
  assert.ok(maternal.every(({ sharedParents }) => sharedParents.length === 2));
});

test("relationship paths to Michael return all shortest paths with edge confidence", () => {
  const path = queries.relationshipPathToMichael("person-abraham-dugas-1616");
  assert.equal(path?.distance, 12);
  assert.equal(path?.paths.length, 1);
  assert.equal(path?.paths[0].confidence, "probable");
  assert.equal(path?.paths[0].people.at(-1)?.id, "person-michael-buquet");

  const self = queries.relationshipPathToMichael("person-michael-buquet");
  assert.equal(self?.distance, 0);
  assert.equal(self?.paths[0].relationships.length, 0);
  assert.equal(queries.relationshipPathToMichael("person-not-present"), undefined);

  const sidney = queries.relationshipPathToMichael("person-sidney-paul-roger");
  assert.equal(sidney?.distance, 2);
  assert.deepEqual(
    sidney?.paths[0].people.map(({ id }) => id),
    ["person-sidney-paul-roger", "person-paulette-comeaux", "person-michael-buquet"],
  );
  assert.equal(sidney?.paths[0].confidence, "verified");

  const gina = queries.relationshipPathToMichael("person-gina-buquet");
  assert.equal(gina?.distance, 2);
  assert.equal(gina?.paths.length, 2);
  assert.ok(gina?.paths.every(({ confidence }) => confidence === "verified"));

  const karla = queries.relationshipPathToMichael("person-karla-vannessa-contreras-buquet");
  assert.equal(karla?.distance, 1);
  assert.equal(karla?.paths[0].relationships[0]?.type, "spouse");

  const chloe = queries.relationshipPathToMichael("person-chloe-eloise-buquet");
  assert.equal(chloe?.distance, 1);
  assert.deepEqual(
    chloe?.paths[0].people.map(({ id }) => id),
    ["person-chloe-eloise-buquet", "person-michael-buquet"],
  );
});

test("aunt and uncle paths reach Michael through a parent and shared grandparent", () => {
  const cathy = queries.relationshipPathToMichael("person-cathy-buquet");
  const russell = queries.relationshipPathToMichael("person-russell-j-comeaux");

  assert.equal(cathy?.distance, 3);
  assert.equal(cathy?.paths.length, 2);
  assert.deepEqual(
    cathy?.paths.map(({ confidence }) => confidence).sort(),
    ["verified", "verified"],
  );
  assert.equal(russell?.distance, 3);
  assert.equal(russell?.paths.length, 2);
  assert.deepEqual(
    russell?.paths.map(({ confidence }) => confidence).sort(),
    ["verified", "verified"],
  );
});

test("first cousins are derived only from four parent-child edges", () => {
  const cousins = queries.firstCousins("person-michael-buquet");
  assert.deepEqual(personIds(cousins), [
    "person-brandi-comeaux",
    "person-casey-comeaux",
    "person-conrad-miller",
    "person-dexter-babineaux",
    "person-gerard-comeaux",
    "person-paige-bartholomew",
    "person-rhyan-comeaux",
    "person-rustie-lynn-comeaux",
    "person-sean-mcrae",
  ]);
  assert.ok(cousins.every(({ paths }) => paths.length === 2));
  assert.ok(cousins.every(({ paths }) =>
    paths.every(({ relationships }) =>
      relationships.length === 4 && relationships.every(({ type }) => type === "parent-child"),
    ),
  ));
  assert.ok(cousins.every(({ paths }) =>
    paths.every(({ confidence }) => confidence === "verified"),
  ));

  const paige = cousins.find(({ person }) => person.id === "person-paige-bartholomew");
  assert.deepEqual(
    paige?.paths[0].people.map(({ id }) => id),
    [
      "person-michael-buquet",
      "person-aubin-buquet",
      "person-edmond-p-buquet-1919",
      "person-cathy-buquet",
      "person-paige-bartholomew",
    ],
  );
  assert.ok(!personIds(cousins).includes("person-sidney-paul-roger"));
  assert.deepEqual(queries.firstCousins("person-not-present"), []);
});

test("cousin relationship paths preserve verified family-confirmed parent assignments", () => {
  const paige = queries.relationshipPathToMichael("person-paige-bartholomew");
  const conrad = queries.relationshipPathToMichael("person-conrad-miller");

  assert.equal(paige?.distance, 4);
  assert.equal(paige?.paths.length, 2);
  assert.ok(paige?.paths.every(({ confidence }) => confidence === "verified"));
  assert.equal(conrad?.distance, 4);
  assert.equal(conrad?.paths.length, 2);
  assert.ok(conrad?.paths.every(({ confidence }) => confidence === "verified"));
});

test("branch queries retain the path evidence behind their classification", () => {
  const maternal = queries.branchForPerson("person-abraham-dugas-1616");
  assert.equal(maternal?.classification, "maternal");
  assert.equal(maternal?.memberships[0].paths[0].confidence, "probable");

  const paternal = queries.branchForPerson("person-oscar-paul-bakke");
  assert.equal(paternal?.classification, "paternal");
  assert.equal(paternal?.memberships[0].paths[0].people[0].id, "person-aubin-buquet");

  assert.equal(queries.branchForPerson("person-michael-buquet")?.classification, "self");
  assert.equal(queries.branchForPerson("person-cathy-buquet")?.classification, "paternal");
  assert.equal(queries.branchForPerson("person-russell-j-comeaux")?.classification, "maternal");
  assert.equal(queries.branchForPerson("person-paige-bartholomew")?.classification, "paternal");
  assert.equal(queries.branchForPerson("person-conrad-miller")?.classification, "maternal");
  assert.equal(queries.branchForPerson("person-not-present"), undefined);
});

test("surname queries use canonical and alternate source-backed name forms", () => {
  const matches = queries.peopleBySurname("Bakke");
  assert.deepEqual(personIds(matches), [
    "person-hans-hansen-bakke-1801",
    "person-martin-h-bakke",
    "person-olga-josephine-doely",
    "person-oscar-paul-bakke",
    "person-verna-arlene-bakke",
  ]);
  const olga = matches.find(({ person }) => person.id === "person-olga-josephine-doely");
  assert.ok(olga?.matchedNames.some(({ type, name }) => type === "married" && name.endsWith("Bakke")));
  assert.deepEqual(queries.peopleBySurname(""), []);
});

test("place queries preserve event and migration association roles", () => {
  const carencro = queries.peopleAssociatedWithPlace("place-us-la-carencro");
  assert.ok(personIds(carencro).includes("person-paulette-comeaux"));
  assert.ok(personIds(carencro).includes("person-rita-leblanc-1928"));

  const dulacEvents = queries.eventsByPlace("place-us-la-dulac");
  assert.ok(dulacEvents.some(({ roles }) => roles.includes("event-location")));
  assert.ok(dulacEvents.some(({ roles }) => roles.includes("migration-origin")));

  const stLandryEvents = queries.eventsByPlace("place-us-la-st-landry-parish", {
    includeDescendantPlaces: true,
  });
  assert.ok(stLandryEvents.some(({ matchedPlaceIds }) => matchedPlaceIds.includes("place-us-la-grand-coteau")));
  assert.deepEqual(queries.eventsByPlace("place-not-present"), []);
});

test("events can be selected by person, uncertain date overlap, and place", () => {
  const allenEvents = queries.eventsByPerson("person-allen-comeaux-1925");
  assert.ok(allenEvents.some(({ id }) => id === "event-allen-comeaux-census-1930"));
  assert.deepEqual(queries.eventsByPerson("person-not-present"), []);

  const in1930 = queries.eventsByDate({ kind: "year", year: 1930 });
  assert.ok(
    in1930.matches.some(
      ({ event, match }) => event.id === "event-jules-comeaux-1930-census" && match === "contained",
    ),
  );
  assert.ok(
    in1930.matches.some(
      ({ event, match }) =>
        event.id === "event-aubin-vincent-buquet-seafood-work" && match === "overlaps",
    ),
  );
  assert.ok(in1930.indeterminate.length > 0);

  const unknownDates = queries.eventsByDate({ kind: "unknown" });
  assert.ok(unknownDates.matches.length > 0);
  assert.ok(unknownDates.matches.every(({ event }) => event.date.kind === "unknown"));
});

test("alive-in-year queries return supported, possible, indeterminate, and excluded outcomes", () => {
  const in1930 = queries.peopleAliveInYear(1930);
  const allen = in1930.matches.find(({ person }) => person.id === "person-allen-comeaux-1925");
  assert.equal(allen?.temporalStatus, "supported");
  assert.equal(allen?.basis, "dated-event");
  assert.ok(in1930.excluded.some(({ person }) => person.id === "person-abraham-dugas-1616"));
  assert.ok(in1930.indeterminate.some(({ person }) => person.id === "person-michael-buquet"));

  const in1891 = queries.peopleAliveInYear(1891);
  const joesette = in1891.matches.find(({ person }) => person.id === "person-joesette-r");
  assert.equal(joesette?.temporalStatus, "possible");
  assert.equal(joesette?.basis, "overlapping-lifespan");

  const in1890 = queries.peopleAliveInYear(1890);
  const conflictingJoesette = in1890.matches.find(
    ({ person }) => person.id === "person-joesette-r",
  );
  assert.equal(conflictingJoesette?.temporalStatus, "possible");

  assert.throws(() => queries.peopleAliveInYear(0), RangeError);
  assert.throws(() => queries.peopleAliveInYear(1930.5), RangeError);
});

test("source queries retain every supporting route and original source reference", () => {
  const eventSources = queries.sourcesSupportingEvent("event-jules-comeaux-1930-census");
  assert.deepEqual(eventSources.map(({ source }) => source.id), ["SRC-ALLEN-CENSUS-PROFILE"]);
  assert.equal(eventSources[0].via[0].entityId, "event-jules-comeaux-1930-census");

  const ritaSources = queries.sourcesSupportingPerson("person-rita-leblanc-1928");
  const obituary = ritaSources.find(({ source }) => source.id === "SRC-RITA-OBIT-ADVERTISER");
  assert.ok(obituary);
  assert.ok(obituary.via.some(({ kind }) => kind === "person"));
  assert.ok(obituary.via.some(({ kind }) => kind === "relationship"));
  assert.ok(obituary.via.some(({ kind }) => kind === "event"));

  assert.deepEqual(queries.sourcesSupportingPerson("person-not-present"), []);
  assert.deepEqual(queries.sourcesSupportingEvent("event-not-present"), []);
});
