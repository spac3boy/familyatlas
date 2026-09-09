import type { PersonId, PlaceId } from "@/types"

export const exploreViewValues = ["tree", "journeys", "timeline", "patterns"] as const
export type ExploreView = (typeof exploreViewValues)[number]

/** `null` means that no branch filter is active. */
export const exploreBranchValues = ["maternal", "paternal", "both"] as const
export type ExploreBranch = (typeof exploreBranchValues)[number]

export const evidenceModeValues = ["overview", "evidence"] as const
export type EvidenceMode = (typeof evidenceModeValues)[number]

export interface ExploreState {
  readonly activeView: ExploreView
  readonly selectedPerson: PersonId | null
  readonly selectedYear: number | null
  readonly selectedBranch: ExploreBranch | null
  readonly selectedPlace: PlaceId | null
  readonly evidenceMode: EvidenceMode
}

export const initialExploreState: ExploreState = {
  activeView: "tree",
  selectedPerson: null,
  selectedYear: null,
  selectedBranch: null,
  selectedPlace: null,
  evidenceMode: "overview",
}

export type ExploreAction =
  | { readonly type: "set-active-view"; readonly view: ExploreView }
  | {
      readonly type: "show-person-in-view"
      readonly personId: PersonId
      readonly view: "journeys" | "timeline"
    }
  | { readonly type: "focus-person-in-tree"; readonly personId: PersonId }
  | { readonly type: "show-place-in-journeys"; readonly placeId: PlaceId }
  | { readonly type: "select-person"; readonly personId: PersonId | null }
  | { readonly type: "select-year"; readonly year: number | null }
  | { readonly type: "select-branch"; readonly branch: ExploreBranch | null }
  | { readonly type: "select-place"; readonly placeId: PlaceId | null }
  | { readonly type: "set-evidence-mode"; readonly mode: EvidenceMode }
  | { readonly type: "clear-selections" }
  | { readonly type: "reset" }

function withChangedValue<Key extends keyof ExploreState>(
  state: ExploreState,
  key: Key,
  value: ExploreState[Key],
): ExploreState {
  return Object.is(state[key], value) ? state : { ...state, [key]: value }
}

function assertValidSelectedYear(year: number | null): void {
  if (year !== null && (!Number.isInteger(year) || year < 1 || year > 9999)) {
    throw new RangeError("Selected year must be null or an integer from 1 through 9999.")
  }
}

/**
 * Pure state transition function shared by React and dependency-free tests.
 * Changing views deliberately does not clear any cross-view selection.
 */
export function exploreStateReducer(state: ExploreState, action: ExploreAction): ExploreState {
  switch (action.type) {
    case "set-active-view":
      return withChangedValue(state, "activeView", action.view)
    case "show-person-in-view":
      if (state.activeView === action.view && state.selectedPerson === action.personId) return state
      return { ...state, activeView: action.view, selectedPerson: action.personId }
    case "focus-person-in-tree":
      if (
        state.activeView === "tree" &&
        state.selectedPerson === action.personId &&
        state.selectedBranch === null
      ) {
        return state
      }
      return {
        ...state,
        activeView: "tree",
        selectedPerson: action.personId,
        selectedBranch: null,
      }
    case "show-place-in-journeys":
      if (
        state.activeView === "journeys" &&
        state.selectedPlace === action.placeId &&
        state.selectedPerson === null &&
        state.selectedBranch === null
      ) {
        return state
      }
      return {
        ...state,
        activeView: "journeys",
        selectedPerson: null,
        selectedBranch: null,
        selectedPlace: action.placeId,
      }
    case "select-person":
      return withChangedValue(state, "selectedPerson", action.personId)
    case "select-year":
      assertValidSelectedYear(action.year)
      return withChangedValue(state, "selectedYear", action.year)
    case "select-branch":
      return withChangedValue(state, "selectedBranch", action.branch)
    case "select-place":
      return withChangedValue(state, "selectedPlace", action.placeId)
    case "set-evidence-mode":
      return withChangedValue(state, "evidenceMode", action.mode)
    case "clear-selections":
      if (
        state.selectedPerson === null &&
        state.selectedYear === null &&
        state.selectedBranch === null &&
        state.selectedPlace === null
      ) {
        return state
      }
      return {
        ...state,
        selectedPerson: null,
        selectedYear: null,
        selectedBranch: null,
        selectedPlace: null,
      }
    case "reset":
      return initialExploreState
    default: {
      const exhaustiveAction: never = action
      return exhaustiveAction
    }
  }
}
