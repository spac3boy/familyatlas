import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import {
  buildFamilyTimelineModel,
  buildTimeSelectionEffects,
  deriveTimeNavigatorDomain,
  filterEventsBySelectedYear,
  layoutFamilyTimeline,
  layoutTimeNavigator,
  navigatorSelectionForYear,
  navigatorYearFromSelection,
} from "@/lib/visualization";
import type { EventId, PersonId } from "@/types";

function requiredEvent(id: EventId) {
  const event = familyGraph.events.find((candidate) => candidate.id === id);
  assert.ok(event, `Missing event ${id}`);
  return event;
}

test("the navigator domain and D3 scale round-trip known years", () => {
  const domain = deriveTimeNavigatorDomain(familyGraph.events);
  assert.ok(domain);
  assert.ok(domain[0] <= 1649);
  assert.ok(domain[1] >= 2021);

  const layout = layoutTimeNavigator(domain, 720);
  const selection = navigatorSelectionForYear(domain, layout.width, 1928);
  assert.ok(selection);
  assert.equal(navigatorYearFromSelection(domain, layout.width, selection), 1928);
  assert.ok(layout.ticks.length >= 4);
});

test("event filtering preserves supported, possible, indeterminate, and excluded states", () => {
  const events = [
    requiredEvent("event-rita-leblanc-birth"),
    requiredEvent("event-francois-michel-buquet-france-louisiana"),
    requiredEvent("event-rita-leblanc-carencro-residence"),
    requiredEvent("event-verna-bakke-birth"),
  ];
  const filter = filterEventsBySelectedYear(events, 1800, familyGraphQueries);
  const states = new Map(filter.events.map(({ event, state }) => [event.id, state]));

  assert.equal(states.get("event-francois-michel-buquet-france-louisiana"), "possible");
  assert.equal(states.get("event-rita-leblanc-carencro-residence"), "indeterminate");
  assert.equal(states.get("event-rita-leblanc-birth"), "excluded");
  assert.equal(states.get("event-verna-bakke-birth"), "excluded");
});

test("clearing the year returns an explicitly unfiltered event and map state", () => {
  const effects = buildTimeSelectionEffects(familyGraph, null, familyGraphQueries);

  assert.equal(effects.eventFilter.matching.length, familyGraph.events.length);
  assert.ok(effects.eventFilter.events.every(({ state }) => state === "unfiltered"));
  assert.ok(effects.people.every(({ state, dim }) => state === "unfiltered" && !dim));
  assert.equal(effects.map.indeterminateEventIds.length, 0);
  assert.equal(effects.map.excludedEventIds.length, 0);
});

test("map effects expose active and indeterminate places and movements separately", () => {
  const effects = buildTimeSelectionEffects(familyGraph, 1840, familyGraphQueries);

  assert.ok(effects.map.activeMovementEventIds.includes("event-hans-bakke-norway-wisconsin"));
  assert.ok(effects.map.activePlaceIds.includes("place-no-ringebu"));
  assert.ok(effects.map.activePlaceIds.includes("place-us-wi-milwaukee"));
  assert.ok(effects.map.indeterminateMovementEventIds.length > 0);
});

test("person emphasis dims only lives conclusively outside the chosen year", () => {
  const effects = buildTimeSelectionEffects(familyGraph, 1900, familyGraphQueries);
  const people = new Map<PersonId, { state: string; dim: boolean }>(
    effects.people.map(({ personId, state, dim }) => [personId, { state, dim }]),
  );

  assert.deepEqual(people.get("person-rita-leblanc-1928"), { state: "excluded", dim: true });
  assert.deepEqual(people.get("person-michael-buquet"), { state: "indeterminate", dim: false });
  assert.deepEqual(people.get("person-martin-h-bakke"), { state: "supported", dim: false });
});

test("the family timeline receives a bounded selected-year band without altering its domain", () => {
  const model = buildFamilyTimelineModel(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-rita-leblanc-1928",
  });
  const layout = layoutFamilyTimeline(model, 760, 1928);
  const outside = layoutFamilyTimeline(model, 760, 1700);

  assert.equal(layout?.selectedYearBand?.year, 1928);
  assert.ok((layout?.selectedYearBand?.x2 ?? 0) > (layout?.selectedYearBand?.x1 ?? 0));
  assert.equal(outside?.selectedYearBand, undefined);
  assert.deepEqual(layout?.ticks, outside?.ticks);
});
