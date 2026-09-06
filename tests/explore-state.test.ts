import assert from "node:assert/strict"
import test from "node:test"

import {
  exploreStateReducer,
  initialExploreState,
  type ExploreAction,
  type ExploreState,
} from "@/state/explore-state"

function transition(initial: ExploreState, actions: readonly ExploreAction[]): ExploreState {
  return actions.reduce(exploreStateReducer, initial)
}

test("Explore state starts in the tree overview without active selections", () => {
  assert.deepEqual(initialExploreState, {
    activeView: "tree",
    selectedPerson: null,
    selectedYear: null,
    selectedBranch: null,
    selectedPlace: null,
    evidenceMode: "overview",
  })
})

test("changing visualization views preserves every shared selection", () => {
  const selected = transition(initialExploreState, [
    { type: "select-person", personId: "person-rita-leblanc-1928" },
    { type: "select-year", year: 1930 },
    { type: "select-branch", branch: "maternal" },
    { type: "select-place", placeId: "place-us-la-carencro" },
    { type: "set-evidence-mode", mode: "evidence" },
  ])

  for (const view of ["journeys", "timeline", "patterns", "tree"] as const) {
    const next = exploreStateReducer(selected, { type: "set-active-view", view })
    assert.deepEqual(next, { ...selected, activeView: view })
  }
})

test("individual selections can change or clear without affecting the others", () => {
  const selected = transition(initialExploreState, [
    { type: "select-person", personId: "person-michael-buquet" },
    { type: "select-year", year: 2026 },
    { type: "select-branch", branch: "both" },
    { type: "select-place", placeId: "place-us-la-dulac" },
  ])

  assert.deepEqual(exploreStateReducer(selected, { type: "select-person", personId: null }), {
    ...selected,
    selectedPerson: null,
  })
  assert.deepEqual(exploreStateReducer(selected, { type: "select-year", year: null }), {
    ...selected,
    selectedYear: null,
  })
})

test("clearing filters retains the current view and evidence presentation mode", () => {
  const selected = transition(initialExploreState, [
    { type: "set-active-view", view: "journeys" },
    { type: "select-person", personId: "person-michael-buquet" },
    { type: "select-year", year: 1930 },
    { type: "select-branch", branch: "paternal" },
    { type: "select-place", placeId: "place-us-la-dulac" },
    { type: "set-evidence-mode", mode: "evidence" },
  ])

  assert.deepEqual(exploreStateReducer(selected, { type: "clear-selections" }), {
    ...initialExploreState,
    activeView: "journeys",
    evidenceMode: "evidence",
  })
})

test("reset restores the complete initial state", () => {
  const changed = transition(initialExploreState, [
    { type: "set-active-view", view: "timeline" },
    { type: "select-year", year: 1910 },
    { type: "set-evidence-mode", mode: "evidence" },
  ])

  assert.strictEqual(exploreStateReducer(changed, { type: "reset" }), initialExploreState)
})

test("selected years use the canonical historical-year bounds", () => {
  assert.throws(
    () => exploreStateReducer(initialExploreState, { type: "select-year", year: 0 }),
    RangeError,
  )
  assert.throws(
    () => exploreStateReducer(initialExploreState, { type: "select-year", year: 1930.5 }),
    RangeError,
  )
  assert.throws(
    () => exploreStateReducer(initialExploreState, { type: "select-year", year: 10_000 }),
    RangeError,
  )
})

test("no-op transitions preserve object identity", () => {
  assert.strictEqual(
    exploreStateReducer(initialExploreState, { type: "set-active-view", view: "tree" }),
    initialExploreState,
  )
  assert.strictEqual(
    exploreStateReducer(initialExploreState, { type: "clear-selections" }),
    initialExploreState,
  )
})
