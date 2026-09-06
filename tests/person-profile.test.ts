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
  assert.equal(rita.evidence.length, 5);
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
  assert.ok(michael.researchFlags.every(({ title }) => title.includes("Parent relationship")));
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
