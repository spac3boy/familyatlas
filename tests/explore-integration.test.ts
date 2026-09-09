import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import { familyPlaceMapAnchors } from "@/data/geography/place-map-anchors";
import {
  buildFamilyJourneyModel,
  buildFamilyPatternsModel,
  buildFamilyTimelineModel,
  buildFamilyTreeHierarchy,
  defaultExpandedPersonIds,
  layoutDaughterCenteredFamilyTree,
  layoutFamilyJourneyMap,
  layoutFamilyTree,
  uniqueJourneyPlaceId,
  type BoundaryFeatureCollection,
} from "@/lib/visualization";
import {
  exploreStateReducer,
  initialExploreState,
  type ExploreAction,
  type ExploreState,
} from "@/state/explore-state";
import type { PersonId } from "@/types";

const emptyBoundaries: BoundaryFeatureCollection = { type: "FeatureCollection", features: [] };

function transition(initial: ExploreState, actions: readonly ExploreAction[]): ExploreState {
  return actions.reduce(exploreStateReducer, initial);
}

test("person handoffs change view and identity while preserving cross-view context", () => {
  const contextualState = transition(initialExploreState, [
    { type: "select-year", year: 1930 },
    { type: "select-branch", branch: "maternal" },
    { type: "select-place", placeId: "place-us-la-carencro" },
    { type: "set-evidence-mode", mode: "evidence" },
  ]);
  const timeline = exploreStateReducer(contextualState, {
    type: "show-person-in-view",
    personId: "person-rita-leblanc-1928",
    view: "timeline",
  });
  const journeys = exploreStateReducer(timeline, {
    type: "show-person-in-view",
    personId: "person-rita-leblanc-1928",
    view: "journeys",
  });

  assert.deepEqual(timeline, {
    ...contextualState,
    activeView: "timeline",
    selectedPerson: "person-rita-leblanc-1928",
  });
  assert.deepEqual(journeys, { ...timeline, activeView: "journeys" });
});

test("show in tree clears only the branch filter and retains entity context", () => {
  const state = transition(initialExploreState, [
    { type: "set-active-view", view: "journeys" },
    { type: "select-person", personId: "person-rita-leblanc-1928" },
    { type: "select-branch", branch: "maternal" },
    { type: "select-year", year: 1930 },
    { type: "select-place", placeId: "place-us-la-carencro" },
    { type: "set-evidence-mode", mode: "evidence" },
  ]);
  const focused = exploreStateReducer(state, {
    type: "focus-person-in-tree",
    personId: "person-rita-leblanc-1928",
  });

  assert.deepEqual(focused, {
    ...state,
    activeView: "tree",
    selectedBranch: null,
  });
});

test("place-focused route handoff clears stale person and branch filters but preserves time and evidence", () => {
  const state = transition(initialExploreState, [
    { type: "select-person", personId: "person-rita-leblanc-1928" },
    { type: "select-branch", branch: "maternal" },
    { type: "select-year", year: 1930 },
    { type: "set-evidence-mode", mode: "evidence" },
  ]);
  const placeFocused = exploreStateReducer(state, {
    type: "show-place-in-journeys",
    placeId: "place-us-mn-spring-grove",
  });

  assert.deepEqual(placeFocused, {
    ...state,
    activeView: "journeys",
    selectedPerson: null,
    selectedBranch: null,
    selectedPlace: "place-us-mn-spring-grove",
  });
});

test("map selection never retains an unrelated place for a multi-place cluster", () => {
  assert.equal(
    uniqueJourneyPlaceId([
      { id: "place-us-la-carencro" },
      { id: "place-us-la-cankton" },
    ]),
    null,
  );
  assert.equal(
    uniqueJourneyPlaceId([
      { id: "place-us-la-carencro" },
      { id: "place-us-la-carencro" },
    ]),
    "place-us-la-carencro",
  );
});

test("relationship paths and stable routes resolve the same canonical person identity", () => {
  const personId = "person-rita-leblanc-1928" as const;
  const person = familyGraphQueries.personById(personId);
  const path = familyGraphQueries.relationshipPathToMichael(personId);

  assert.ok(person && path);
  assert.strictEqual(path.person, person);
  assert.equal(path.person.id, personId);
  assert.equal(`/people/${path.person.id}`, "/people/person-rita-leblanc-1928");
  assert.deepEqual(path.paths[0].people.map(({ id }) => id), [
    personId,
    "person-paulette-comeaux",
    "person-michael-buquet",
  ]);
});

test("visualization projections do not mutate the canonical graph", () => {
  const before = JSON.stringify(familyGraph);
  const expanded = new Set<PersonId>(familyGraph.people.map(({ id }) => id));
  const hierarchy = buildFamilyTreeHierarchy(familyGraph, {
    scope: "maternal",
    expandedPersonIds: defaultExpandedPersonIds(
      familyGraph,
      { scope: "maternal", selectedPersonId: null },
      4,
    ),
  });
  layoutFamilyTree(hierarchy, familyGraph.events);
  layoutDaughterCenteredFamilyTree(familyGraph, familyGraph.events, expanded);
  buildFamilyTimelineModel(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-rita-leblanc-1928",
  });
  const journeys = buildFamilyJourneyModel(
    familyGraph,
    familyPlaceMapAnchors,
    { scope: "maternal", selectedPersonId: null, selectedYear: 1930 },
    familyGraphQueries,
  );
  layoutFamilyJourneyMap(
    journeys,
    emptyBoundaries,
    emptyBoundaries,
    960,
    560,
    familyPlaceMapAnchors,
  );
  buildFamilyPatternsModel(familyGraph);

  assert.equal(JSON.stringify(familyGraph), before);
});
