# Shared time-navigation API

The C15 time navigator uses the single `selectedYear` value in centralized Explore state. Neither Timeline nor the future Journeys view may keep a competing selected-year value.

## Public calculation API

Framework-independent exports live in `src/lib/visualization/time-navigation.ts`:

- `deriveTimeNavigatorDomain(events)` derives inclusive year bounds from explicit date anchors. Unknown dates contribute no bound; `before` and `after` dates contribute only their documented boundary.
- `layoutTimeNavigator(domain, width)` uses a D3 linear scale to produce responsive track geometry and ticks.
- `navigatorSelectionForYear(domain, width, year)` maps a selected year to the narrow brush band used by the shared control.
- `navigatorYearFromSelection(domain, width, selection)` snaps the midpoint of a pointer/touch brush gesture to one integer year.
- `filterEventsBySelectedYear(events, selectedYear, queries)` partitions accepted records into `supported`, `possible`, `indeterminate`, or `excluded` states. A cleared year returns `unfiltered` records.
- `buildTimeMapState(eventFilter)` exposes active, indeterminate, and excluded event IDs; active and indeterminate place IDs; and movement-event IDs for Journeys.
- `buildTimeSelectionEffects(graph, selectedYear, queries)` combines event, place/movement, and person-emphasis results for visualization consumers.

## Uncertainty rules

An event wholly contained in the selected calendar year is `supported`. An uncertain interval that overlaps the year is `possible`. An unknown date is `indeterminate`. Only a non-overlapping known interval is `excluded`.

Person emphasis delegates to the genealogy query layer. A person is dimmed only when evidence conclusively places their birth after the selected year or death before it. `Possible` and `indeterminate` people stay undimmed.

The map projection never turns unknown dates into a false time match. Journeys can use `activePlaceIds` and `activeMovementEventIds` for the selected context while presenting `indeterminatePlaceIds` and `indeterminateMovementEventIds` with an explicit uncertainty treatment.

## Interaction contract

`TimeNavigator` reads `selectedYear` through `useExploreState()` and changes it only through `selectYear()`. Its isolated D3 brush handles pointer and touch gestures; keyboard interaction on the slider supports one-year arrows, ten-year Page Up/Page Down steps, Home/End bounds, and Escape/Delete clearing. Programmatic brush synchronization is immediate and has no animated transition, including under reduced-motion preferences.

Timeline currently consumes the navigator and its person/event emphasis. Journeys should reuse this component and the same calculation exports when implemented.
