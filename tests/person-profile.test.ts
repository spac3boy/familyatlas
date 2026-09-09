import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import { buildPersonProfileModel } from "@/lib/genealogy";
import type { EventId, PersonId, PlaceId, SourceId } from "@/types";

test("a richly researched profile retains events, places, evidence, and explicit uncertainty", () => {
  const rita = buildPersonProfileModel(
    familyGraph,
    "person-rita-leblanc-1928",
    familyGraphQueries,
  );
  assert.ok(rita);

  assert.equal(rita.timeline.length, 6);
  assert.deepEqual(rita.places.map(({ place }) => place.id), [
    "place-us-la-cankton",
    "place-us-la-carencro",
    "place-us-la-evangeline-oaks-guest-house",
    "place-us-la-st-peter-catholic-cemetery-carencro",
  ]);
  assert.equal(rita.evidence.length, 7);
  assert.ok(
    rita.researchFlags.some(({ title }) =>
      title.includes("Spouse relationship with Allen Paul Comeaux Sr. is probable"),
    ),
  );
  assert.ok(
    rita.researchFlags.some(({ title }) => title.includes("Name form “Rita M. LeBlanc” is unresolved")),
  );
  assert.ok(rita.researchFlags.some(({ title }) => title.startsWith("Date not established")));
});

test("a sparse profile remains useful without inventing events, places, or life dates", () => {
  const michael = buildPersonProfileModel(
    familyGraph,
    "person-michael-buquet",
    familyGraphQueries,
  );
  assert.ok(michael);

  assert.equal(michael.detail.lifespan, undefined);
  assert.equal(michael.timeline.length, 0);
  assert.equal(michael.places.length, 0);
  assert.deepEqual(michael.detail.parents.map(({ person }) => person.id), [
    "person-aubin-buquet",
    "person-paulette-comeaux",
  ]);
  assert.ok(michael.researchFlags.every(({ details }) => !details.includes("Reference person for the Family Atlas archive.")));
  assert.ok(
    michael.detail.parents.every(({ relationship }) =>
      relationship.provenance?.some(({ kind }) => kind === "family-confirmed"),
    ),
  );
  assert.ok(michael.researchFlags.every(({ title }) => !title.includes("Parent relationship")));
});

test("living sibling profiles omit exact dates and preserve Gina's unresolved name detail", () => {
  const edmond = buildPersonProfileModel(familyGraph, "person-edmond-paul-buquet", familyGraphQueries);
  const gina = buildPersonProfileModel(familyGraph, "person-gina-buquet", familyGraphQueries);
  const sidney = buildPersonProfileModel(familyGraph, "person-sidney-paul-roger", familyGraphQueries);
  assert.ok(edmond && gina && sidney);

  assert.equal(edmond.detail.lifespan, "Birth: 1987");
  assert.ok(edmond.timeline.every(({ event }) => event.date.kind !== "exact"));
  assert.equal(gina.detail.lifespan, "Birth: 1990");
  assert.equal(sidney.detail.lifespan, undefined);
  assert.ok(gina.researchFlags.some(({ title }) => title.includes("Gina Renee Buquet")));
});

test("Karla and the children receive sparse, privacy-safe graph-derived profiles", () => {
  const karla = buildPersonProfileModel(
    familyGraph,
    "person-karla-vannessa-contreras-buquet",
    familyGraphQueries,
  );
  const chloe = buildPersonProfileModel(familyGraph, "person-chloe-eloise-buquet", familyGraphQueries);
  const jolie = buildPersonProfileModel(familyGraph, "person-jolie-renee-buquet", familyGraphQueries);
  assert.ok(karla && chloe && jolie);

  assert.equal(karla.detail.lifespan, "Birth: 1989");
  assert.equal(karla.detail.spousesAndPartners[0]?.person.id, "person-michael-buquet");
  assert.deepEqual(karla.detail.children.map(({ person }) => person.id), [
    "person-chloe-eloise-buquet",
    "person-jolie-renee-buquet",
  ]);
  assert.equal(chloe.detail.lifespan, "Birth: 2019");
  assert.equal(jolie.detail.lifespan, "Birth: 2022");
  assert.ok(
    [...karla.timeline, ...chloe.timeline, ...jolie.timeline].every(
      ({ event }) => event.date.kind !== "exact",
    ),
  );
});

test("lateral-family profiles preserve sparse biography and conflicting spouse reports", () => {
  const cathy = buildPersonProfileModel(familyGraph, "person-cathy-buquet", familyGraphQueries);
  const priscilla = buildPersonProfileModel(
    familyGraph,
    "person-priscilla-comeaux",
    familyGraphQueries,
  );
  assert.ok(cathy && priscilla);

  assert.equal(cathy.detail.lifespan, undefined);
  assert.deepEqual(cathy.detail.parents.map(({ person }) => person.id), [
    "person-edmond-p-buquet-1919",
    "person-verna-arlene-bakke",
  ]);
  assert.deepEqual(priscilla.detail.spousesAndPartners.map(({ person }) => person.id), [
    "person-karlon",
    "person-tippy-leblanc",
  ]);
  assert.ok(priscilla.timeline.length === 0);
  assert.equal(
    priscilla.detail.person.alternateNames.find(({ name }) => name === "Priscilla LeBlanc")
      ?.confidence,
    "verified",
  );
  assert.ok(priscilla.detail.person.notes?.some((note) => note.includes("without inferring a chronology")));
});

test("cousin profiles stay privacy-safe while confirmed parent roles no longer appear probable", () => {
  const paige = buildPersonProfileModel(
    familyGraph,
    "person-paige-bartholomew",
    familyGraphQueries,
  );
  const rhyan = buildPersonProfileModel(
    familyGraph,
    "person-rhyan-comeaux",
    familyGraphQueries,
  );
  assert.ok(paige && rhyan);

  assert.equal(paige.detail.relationshipLabel, "Paternal first cousin");
  assert.equal(paige.detail.lifespan, undefined);
  assert.equal(paige.timeline.length, 0);
  assert.ok(!paige.researchFlags.some(({ title }) => title.includes("Parent relationship")));
  assert.ok(
    !paige.researchFlags.some(({ title }) =>
      title.includes("Parent relationship with Richard Russell McRae is probable"),
    ),
  );
  assert.equal(
    rhyan.detail.person.alternateNames.find(({ name }) => name === "Ryan Earl Comeaux")
      ?.confidence,
    "unresolved",
  );
  assert.ok(rhyan.researchFlags.some(({ title }) => title.includes("Ryan Earl Comeaux")));
});

test("every canonical person can produce a referentially complete reusable profile", () => {
  const personIds = new Set<PersonId>(familyGraph.people.map(({ id }) => id));
  const eventIds = new Set<EventId>(familyGraph.events.map(({ id }) => id));
  const placeIds = new Set<PlaceId>(familyGraph.places.map(({ id }) => id));
  const sourceIds = new Set<SourceId>(familyGraph.sources.map(({ id }) => id));

  for (const person of familyGraph.people) {
    const profile = buildPersonProfileModel(familyGraph, person.id, familyGraphQueries);
    assert.ok(profile, `missing profile for ${person.id}`);
    assert.equal(profile.detail.person.id, person.id);
    const profileSourceIds = new Set<SourceId>(profile.evidence.map(({ source }) => source.id));
    assert.equal(profileSourceIds.size, profile.evidence.length);

    const relatives = [
      ...profile.detail.parents,
      ...profile.detail.spousesAndPartners,
      ...profile.detail.children,
    ];
    for (const { person: relative, relationship } of relatives) {
      assert.ok(personIds.has(relative.id));
      assert.ok(relationship.sourceRefs.every(({ sourceId }) => profileSourceIds.has(sourceId)));
    }
    for (const alternateName of person.alternateNames) {
      assert.ok(alternateName.sourceRefs.every(({ sourceId }) => profileSourceIds.has(sourceId)));
    }

    for (const entry of profile.timeline) {
      assert.ok(eventIds.has(entry.event.id));
      assert.ok(entry.event.personIds.includes(person.id));
      assert.ok(entry.relatedPeople.every((relative) => personIds.has(relative.id)));
      assert.ok(entry.places.every(({ place }) => placeIds.has(place.id)));
      assert.ok(entry.event.sourceRefs.every(({ sourceId }) => sourceIds.has(sourceId)));
      assert.ok(entry.event.sourceRefs.every(({ sourceId }) => profileSourceIds.has(sourceId)));
    }
  }

  assert.equal(buildPersonProfileModel(familyGraph, "person-not-present"), undefined);
});
