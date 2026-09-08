# Visualization architecture

## Ownership boundary

React owns application state, interaction state, accessibility semantics, and rendering. D3 owns visualization calculations when ordinary TypeScript is insufficient: hierarchy layout, scales, geographic projections, path generation, interpolation, and related geometry.

Prefer React-rendered SVG and HTML. D3 helpers receive typed input and return coordinates, dimensions, paths, ticks, or other view-model data. They should not append, remove, or reconcile production DOM nodes.

## Intended flow

```text
canonical graph → typed selector → visualization view model
                → pure D3/TypeScript calculation
                → React SVG/HTML rendering
```

Keep interaction state—selection, focus, expansion, filters, viewport mode, and disclosure—in React. If a D3 behavior requires imperative event wiring, isolate it in a small hook around a ref and synchronize its result back to React without creating a second state store.

## Shared Explore state

C9 establishes one React-owned Explore state above route content. Its public state is:

| Field | Values | Default |
|---|---|---|
| `activeView` | `tree`, `journeys`, `timeline`, `patterns` | `tree` |
| `selectedPerson` | canonical `PersonId` or `null` | `null` |
| `selectedYear` | integer from 1 through 9999 or `null` | `null` |
| `selectedBranch` | `maternal`, `paternal`, `both`, or `null` | `null` |
| `selectedPlace` | canonical `PlaceId` or `null` | `null` |
| `evidenceMode` | `overview` or `evidence` | `overview` |

`null` means no active filter for a selection. Switching `activeView` preserves every selection and the evidence mode, so a person, year, branch, or place can remain the user's context while the representation changes. Clearing selections is intentionally distinct from a full reset: it retains the current view and evidence mode.

The pure reducer and contracts live in `src/state/explore-state.ts`; the React provider and hooks live in `src/state/explore-context.tsx`. The provider is mounted in the persistent application shell so state survives view and route-content changes. Routes may offer shareable or entry-point parameters later, but the URL is not the canonical live state store and must not continuously overwrite in-memory interaction state.

## Dependency policy

C11 adds `d3-hierarchy`, `d3-shape`, `d3-zoom`, and the `d3-selection` adapter required to bind zoom behavior to the React-owned SVG. C14 adds `d3-scale`, `d3-time`, `d3-axis`, and `d3-time-format` for timeline geometry and UTC axis calculations. C15 adds `d3-brush` for the isolated shared time-control gesture. The umbrella `d3` package is not installed. Continue adding individual modules only when a feature demonstrably needs them, and record durable boundary changes in `docs/DECISIONS.md`.

## Family Tree V1

The C11 tree follows the intended ownership flow:

```text
canonical GenealogyGraph
  → temporary ancestry datum (`buildFamilyTreeHierarchy`)
  → D3 hierarchy coordinates + D3 shape connector paths (`layoutFamilyTree`)
  → React-rendered SVG and structured HTML list
```

The temporary hierarchy is an ancestry projection, not a replacement data model. Every datum retains its canonical `Person`; every connector retains the canonical parent-child `RelationshipId`, endpoints, and confidence. Repeated people in a future pedigree-collapse case receive path-specific occurrence IDs while retaining one canonical person ID.

Tree scopes are `all`, `paternal`, `maternal`, and `selected`. All, paternal, and maternal retain Michael as the visual root so the branch edge remains explicit; selected-person scope starts at the shared `selectedPerson` and walks only supported parent edges. No descendants or placeholder relatives are introduced into an ancestry projection.

The initial view expands three generations and exposes known older parents through per-person controls. `Show all` derives the complete currently accepted ancestry; `Fold older` restores the readable initial window. Node selection updates shared Explore state. Expansion and zoom/pan transform remain tree-local interaction state.

D3 zoom is isolated around the SVG ref and reports transforms back to React; D3 does not create or reconcile marks. Programmatic zoom and reset are immediate, and double-click zoom animation is disabled, so reduced-motion users do not receive hidden transition behavior. On narrow screens reset preserves a readable scale and relies on panning plus the structured list rather than shrinking all labels to illegibility.

## Timeline V1

Timeline V1 keeps the same ownership boundary:

```text
canonical GenealogyGraph
  → scoped person/event model (`buildFamilyTimelineModel`)
  → historical-date extents + D3 UTC scale/axis calculations (`layoutFamilyTimeline`)
  → React-rendered SVG and structured HTML lists
```

Scopes are `all`, `maternal`, `paternal`, and `selected`. Maternal and paternal membership comes from the graph query API; selected scope is the shared `selectedPerson`. Selecting a populated row updates that shared person without moving visualization scope or mutating canonical data. Tree and Timeline share one view switch while journeys and patterns remain deferred.

Temporal marks carry the canonical `Event` and original `HistoricalDate` semantics. Exact dates map to points. Year and range values map to bounded intervals. Circa values map to visibly dashed tolerance intervals. Before and after values map to one-sided, open intervals clipped at the displayed domain. Unknown dates have no coordinate and appear only in the explicit unplotted-record disclosure.

A lifespan is not inferred from a single life event. It requires at least one bounded accepted birth event and one bounded accepted death event. Multiple date alternatives produce an outer possible interval and an inner common supported interval; conflicts remain visible and influence confidence. If those bounds do not produce a coherent overlap, no lifespan is drawn.

The SVG retains a readable minimum width and is locally horizontally scrollable on narrow screens rather than shrinking its labels beyond usability. Every populated row is keyboard-selectable, and the structured record list provides a non-spatial equivalent with exact source-backed date wording and confidence.

## Shared Time Navigator

C15 makes `selectedYear` an operational cross-view context while retaining the C9 ownership boundary. `TimeNavigator` reads and writes only the centralized Explore value. D3 scale helpers calculate its responsive ticks and coordinate conversions; an imperative `d3-brush` binding is isolated to one empty SVG group and synchronizes gesture results back to React state. It does not own the selected year or render the surrounding interface.

The control supports pointer and touch brushing plus a keyboard slider contract. All programmatic brush movement is immediate, so reduced-motion behavior does not depend on a transition override. Clearing restores `selectedYear: null` rather than choosing a substitute year.

Framework-independent effects partition accepted events into supported, possible, indeterminate, and excluded sets; provide active and indeterminate place/movement IDs for Journeys; and classify person emphasis through `peopleAliveInYear`. Only conclusively excluded people may be dimmed. Timeline consumes these effects now; Journeys must reuse them rather than creating another year filter. The complete public contract is in `docs/time-navigation.md`.

## Genealogy-safe encodings

- Read relationships from the canonical graph; never manufacture placeholder ancestors to balance a layout.
- Encode verified, probable, and unresolved status with text and at least one non-color visual cue.
- Preserve exact, approximate, ranged, and conflicting time values in axes and labels.
- Match map geometry to source precision. Broad regions may use areas or uncertainty treatments rather than exact pins.
- Visually distinguish documented moves, strongly inferred moves, and separate locations with unknown routes.
- Never draw a continuous journey line when only disconnected endpoints are supported.
- Keep rejected and unattached identities outside accepted family paths; research views may display them with explicit disposition.

## Responsive behavior

Measure available space rather than assuming a desktop canvas. Prefer responsive `viewBox` SVG, container observation, and layouts that can recompute from typed inputs. On narrow screens, simplify labels, use progressive disclosure, or offer a structured list rather than shrinking content below usability.

## Accessibility and motion

Every visualization needs an equivalent structured representation for screen readers and users who cannot operate a spatial canvas. Provide a title and description, keyboard navigation where marks are interactive, visible focus, meaningful labels, and non-color-only distinctions.

Honor `prefers-reduced-motion`. Layout changes should remain understandable without animated transitions; zooming or panning must not be the only way to reach content.

## Testing boundary

Test calculation helpers with deterministic fixtures, including empty data, one-person graphs, uncertain dates, disconnected branches, ambiguous places, and reduced-motion modes. Test rendered semantics and keyboard behavior separately from geometry. Avoid brittle pixel snapshots as the only evidence of correctness.

Family Tree V1, Timeline V1, and their shared Time Navigator are implemented through C15. Journeys and patterns remain unimplemented.
