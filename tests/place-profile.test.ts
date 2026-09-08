import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import {
  buildPlaceIndexGroups,
  buildPlaceProfileModel,
} from "@/lib/genealogy/place-profile";
import type { PlaceId } from "@/types";

const requiredPlace = (placeId: PlaceId) => {
  const profile = buildPlaceProfileModel(familyGraph, placeId, familyGraphQueries);
  assert.ok(profile, `Expected a profile for ${placeId}`);
  return profile;
};

test("every accepted canonical place produces one evidence-backed profile", () => {
  const accepted = familyGraph.places.filter(({ researchStatus }) => researchStatus === "accepted");
  const profiles = accepted.map(({ id }) => requiredPlace(id));

  assert.equal(profiles.length, 38);
  assert.equal(new Set(profiles.map(({ place }) => place.id)).size, profiles.length);
  assert.ok(profiles.every(({ events }) => events.length > 0));
});

test("parish and county profiles include only explicit canonical child-place associations", () => {
  const stLandry = requiredPlace("place-us-la-st-landry-parish");

  assert.equal(stLandry.place.precision, "parish-county");
  assert.equal(stLandry.place.settlement, undefined);
  assert.equal(stLandry.directEventCount, 0);
  assert.deepEqual(
    stLandry.childPlaces.map(({ id }) => id),
    ["place-us-la-cankton", "place-us-la-grand-coteau"],
  );
  assert.ok(stLandry.events.every(({ scope }) => scope === "within-child-place"));
  assert.deepEqual(
    [...new Set(stLandry.events.flatMap(({ matchedPlaces }) => matchedPlaces.map(({ modernName }) => modernName)))].sort(),
    ["Cankton", "Grand Coteau"],
  );
});

test("direct place associations retain people, recorded surnames, sources, and unknown dates", () => {
  const cankton = requiredPlace("place-us-la-cankton");

  assert.deepEqual(cankton.people.map(({ person }) => person.canonicalName), ["Rita LeBlanc"]);
  assert.deepEqual(cankton.surnames.map(({ label }) => label), ["Comeaux", "LeBlanc"]);
  assert.equal(cankton.dateRange.label, "April 20, 1928");
  assert.equal(cankton.dateRange.datedEventCount, 1);
  assert.equal(cankton.dateRange.undatedEventCount, 1);
  assert.ok(cankton.sources.some(({ supportsPlace }) => supportsPlace));
  assert.ok(cankton.sources.some(({ eventIds }) => eventIds.length > 0));
});

test("place surname indexes identify alternate spellings", () => {
  const france = requiredPlace("place-fr-france");
  const bouquet = france.surnames.find(({ value }) => value === "bouquet");

  assert.equal(bouquet?.displayLabel, "Bouquet — alternate spelling");
});

test("movement classifications remain distinct and keep their exact canonical endpoints", () => {
  const france = requiredPlace("place-fr-france");
  const cankton = requiredPlace("place-us-la-cankton");

  assert.deepEqual(
    france.movements.map(({ classification }) => classification).sort(),
    ["documented-migration-move", "strongly-inferred-move"],
  );
  assert.deepEqual(cankton.movements.map(({ classification }) => classification), [
    "separate-known-locations-route-unknown",
  ]);
  assert.deepEqual(cankton.movements[0].fromPlaces.map(({ id }) => id), [
    "place-us-la-cankton",
  ]);
  assert.deepEqual(cankton.movements[0].toPlaces.map(({ id }) => id), [
    "place-us-la-carencro",
  ]);
});

test("place date summaries preserve bounded and historical observations", () => {
  const portRoyal = requiredPlace("place-historical-port-royal-acadia");
  const france = requiredPlace("place-fr-france");

  assert.equal(portRoyal.dateRange.label, "1698 to 1701");
  assert.equal(france.dateRange.label, "1785 to August 25, 1819");
  assert.equal(portRoyal.place.country, undefined);
  assert.equal(portRoyal.context, "Port Royal, Historical Acadia");
});

test("all projected person, event, place, and source references resolve", () => {
  const personIds = new Set<string>(familyGraph.people.map(({ id }) => id));
  const eventIds = new Set<string>(familyGraph.events.map(({ id }) => id));
  const placeIds = new Set<string>(familyGraph.places.map(({ id }) => id));
  const sourceIds = new Set<string>(familyGraph.sources.map(({ id }) => id));

  for (const place of familyGraph.places) {
    const profile = requiredPlace(place.id);
    assert.ok(profile.people.every(({ person }) => personIds.has(person.id)));
    assert.ok(profile.events.every(({ event }) => eventIds.has(event.id)));
    assert.ok(profile.events.every(({ matchedPlaces }) => matchedPlaces.every(({ id }) => placeIds.has(id))));
    assert.ok(profile.sources.every(({ source }) => sourceIds.has(source.id)));
    assert.ok(profile.movements.every(({ fromPlaces, toPlaces }) =>
      [...fromPlaces, ...toPlaces].every(({ id }) => placeIds.has(id)),
    ));
  }
});

test("the Places index groups every canonical place exactly once", () => {
  const groups = buildPlaceIndexGroups(familyGraph, familyGraphQueries);
  const placeIds = groups.flatMap(({ places }) => places.map(({ place }) => place.id));

  assert.equal(placeIds.length, 38);
  assert.equal(new Set(placeIds).size, placeIds.length);
  assert.ok(groups.some(({ label }) => label === "Louisiana · United States"));
  assert.ok(groups.some(({ label }) => label === "Historical Acadia"));
});

test("unknown stable IDs do not produce place profiles", () => {
  assert.equal(
    buildPlaceProfileModel(familyGraph, "place-not-canonical", familyGraphQueries),
    undefined,
  );
});
