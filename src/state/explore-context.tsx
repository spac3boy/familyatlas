"use client"

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"

import {
  exploreStateReducer,
  initialExploreState,
  type EvidenceMode,
  type ExploreAction,
  type ExploreBranch,
  type ExploreState,
  type ExploreView,
} from "@/state/explore-state"
import type { PersonId, PlaceId } from "@/types"

const ExploreStateContext = createContext<ExploreState | undefined>(undefined)
const ExploreDispatchContext = createContext<Dispatch<ExploreAction> | undefined>(undefined)

export interface ExploreActions {
  readonly setActiveView: (view: ExploreView) => void
  readonly showPersonInView: (personId: PersonId, view: "journeys" | "timeline") => void
  readonly focusPersonInTree: (personId: PersonId) => void
  readonly showPlaceInJourneys: (placeId: PlaceId) => void
  readonly selectPerson: (personId: PersonId | null) => void
  readonly selectYear: (year: number | null) => void
  readonly selectBranch: (branch: ExploreBranch | null) => void
  readonly selectPlace: (placeId: PlaceId | null) => void
  readonly setEvidenceMode: (mode: EvidenceMode) => void
  readonly clearSelections: () => void
  readonly resetExploreState: () => void
}

export function ExploreStateProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(exploreStateReducer, initialExploreState)

  return (
    <ExploreStateContext.Provider value={state}>
      <ExploreDispatchContext.Provider value={dispatch}>{children}</ExploreDispatchContext.Provider>
    </ExploreStateContext.Provider>
  )
}

export function useExploreState(): ExploreState {
  const state = useContext(ExploreStateContext)
  if (state === undefined) {
    throw new Error("useExploreState must be used within an ExploreStateProvider.")
  }
  return state
}

export function useExploreActions(): ExploreActions {
  const dispatch = useContext(ExploreDispatchContext)
  if (dispatch === undefined) {
    throw new Error("useExploreActions must be used within an ExploreStateProvider.")
  }

  return useMemo(
    () => ({
      setActiveView: (view) => dispatch({ type: "set-active-view", view }),
      showPersonInView: (personId, view) =>
        dispatch({ type: "show-person-in-view", personId, view }),
      focusPersonInTree: (personId) => dispatch({ type: "focus-person-in-tree", personId }),
      showPlaceInJourneys: (placeId) => dispatch({ type: "show-place-in-journeys", placeId }),
      selectPerson: (personId) => dispatch({ type: "select-person", personId }),
      selectYear: (year) => dispatch({ type: "select-year", year }),
      selectBranch: (branch) => dispatch({ type: "select-branch", branch }),
      selectPlace: (placeId) => dispatch({ type: "select-place", placeId }),
      setEvidenceMode: (mode) => dispatch({ type: "set-evidence-mode", mode }),
      clearSelections: () => dispatch({ type: "clear-selections" }),
      resetExploreState: () => dispatch({ type: "reset" }),
    }),
    [dispatch],
  )
}
