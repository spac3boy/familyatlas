import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import { familyPlaceMapAnchors } from "@/data/geography/place-map-anchors";
import {
  buildFamilyJourneyModel,
  clusterJourneyPoints,
  layoutFamilyJourneyMap,
  type BoundaryFeatureCollection,
} from "@/lib/visualization";
import type { EventId, PlaceId } from "@/types";

const emptyBoundaries: BoundaryFeatureCollection = { type: "FeatureCollection", features: [] };

test("journeys derive only canonical accepted places and events", () => {
  const model = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "all", selectedPersonId: null, selectedYear: null },
    familyGraphQueries,
  );
  const canonicalPlaceIds = new Set<PlaceId>(familyGraph.places.map(({ id }) => id));
  const canonicalEventIds = new Set<EventId>(familyGraph.events.map(({ id }) => id));

  assert.ok(model.points.length > 0);
  assert.ok(
    model.points.every((point) => point.places.every(({ id }) => canonicalPlaceIds.has(id))),
  );
  assert.ok(
    model.points.every((point) => point.events.every(({ id }) => canonicalEventIds.has(id))),
  );
  assert.ok(model.points.some(({ certainty }) => certainty === "documented"));
  assert.ok(model.points.some(({ certainty }) => certainty === "probable"));
});

test("known endpoints with unknown routes never produce drawable paths", () => {
  const model = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "all", selectedPersonId: null, selectedYear: null },
    familyGraphQueries,
  );
  const unknownRoutes = model.movements.filter(
    ({ classification }) => classification === "separate-known-locations-route-unknown",
  );
  const layout = layoutFamilyJourneyMap(
    model,
    emptyBoundaries,
    emptyBoundaries,
    960,
    560,
    familyPlaceMapAnchors,
  );

  assert.ok(unknownRoutes.length > 0);
  assert.ok(unknownRoutes.every(({ shouldDrawPath }) => !shouldDrawPath));
  assert.ok(
    layout.movements
      .filter(({ classification }) => classification === "separate-known-locations-route-unknown")
      .every(({ path }) => path === undefined),
  );
  assert.ok(
    layout.movements.some(
      ({ classification, path }) => classification === "documented-migration-move" && Boolean(path),
    ),
  );
});

test("branch and selected-person scopes preserve shared genealogy context", () => {
  const maternal = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "maternal", selectedPersonId: null, selectedYear: null },
    familyGraphQueries,
  );
  const selectedRita = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "selected", selectedPersonId: "person-rita-leblanc-1928", selectedYear: null },
    familyGraphQueries,
  );

  assert.ok(maternal.people.some(({ id }) => id === "person-rita-leblanc-1928"));
  assert.ok(!maternal.people.some(({ id }) => id === "person-verna-arlene-bakke"));
  assert.deepEqual(selectedRita.people.map(({ id }) => id), ["person-rita-leblanc-1928"]);
  assert.ok(selectedRita.points.some(({ places }) => places.some(({ id }) => id === "place-us-la-cankton")));
  assert.ok(!selectedRita.points.some(({ places }) => places.some(({ id }) => id === "place-us-mn-spring-grove")));
});

test("selected year reuses active and indeterminate map effects", () => {
  const model = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "paternal", selectedPersonId: null, selectedYear: 1840 },
    familyGraphQueries,
  );
  const hansMovement = model.movements.find(
    ({ event }) => event.id === "event-hans-bakke-norway-wisconsin",
  );
  const vernaUnknown = model.movements.find(
    ({ event }) => event.id === "event-verna-bakke-spring-grove-houma-locations",
  );

  assert.equal(hansMovement?.timeState, "active");
  assert.equal(vernaUnknown?.timeState, "indeterminate");
  assert.ok(!model.movements.some(({ event }) => event.id === "event-rita-leblanc-cankton-carencro-locations"));
});

test("historical places without a defensible modern anchor remain explicit but unplotted", () => {
  const model = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "maternal", selectedPersonId: null, selectedYear: null },
    familyGraphQueries,
  );
  const unmappedIds = new Set(model.unmappedPlaces.map(({ id }) => id));

  assert.ok(unmappedIds.has("place-historical-port-royal-acadia"));
  assert.ok(unmappedIds.has("place-historical-acadia"));
  assert.ok(!model.points.some(({ places }) => places.some(({ id }) => unmappedIds.has(id))));
});

test("map layout is responsive and keeps coordinates finite", () => {
  const model = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "selected", selectedPersonId: "person-rita-leblanc-1928", selectedYear: null },
    familyGraphQueries,
  );
  const layout = layoutFamilyJourneyMap(
    model,
    emptyBoundaries,
    emptyBoundaries,
    280,
    320,
    familyPlaceMapAnchors,
  );

  assert.equal(layout.width, 300);
  assert.equal(layout.height, 360);
  assert.ok(layout.points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)));
});

test("nearby anchors cluster so full-size pointer targets cannot compete", () => {
  const model = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "all", selectedPersonId: null, selectedYear: null },
    familyGraphQueries,
  );
  const layout = layoutFamilyJourneyMap(
    model,
    emptyBoundaries,
    emptyBoundaries,
    960,
    560,
    familyPlaceMapAnchors,
  );
  const clusters = clusterJourneyPoints(layout.points, 46);

  assert.ok(clusters.length < layout.points.length);
  assert.equal(
    clusters.flatMap(({ points }) => points).length,
    layout.points.length,
  );
  for (let first = 0; first < clusters.length; first += 1) {
    for (let second = first + 1; second < clusters.length; second += 1) {
      assert.ok(
        Math.hypot(clusters[first].x - clusters[second].x, clusters[first].y - clusters[second].y) >= 46,
      );
    }
  }
});
