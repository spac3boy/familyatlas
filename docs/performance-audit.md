# Visualization and performance audit

## Scope and method

C25 inspected the production build and exercised Tree, Timeline, Journeys, Patterns, zoom controls, and responsive rendering in the local production server. Measurements use the current accepted graph: 83 people, 119 relationships, 125 events, and 38 places. Synthetic calculation timings are warm-process averages on the development machine and are useful for finding relative hotspots, not as user-facing Web Vitals.

The audit did not use Canvas. Current SVG complexity and measured calculation costs do not justify losing the accessibility and React ownership benefits of SVG.

## Findings

| Area | Measurement | Assessment |
| --- | ---: | --- |
| Default Tree | 41 visible person nodes, 62 paths, 359 SVG descendants | Moderate; safe for React-rendered SVG |
| Timeline | 45 rows, 875 SVG descendants | Moderate; local horizontal scrolling remains intentional on phones |
| Journeys | 228 published boundary paths, 233 total paths, 4 desktop clusters | Moderate; boundaries dominate marks but remain well below a Canvas threshold |
| Daughter-centered tree layout | 0.76 ms average over 500 warm runs | Not a bottleneck |
| Timeline model plus layout | 0.71 ms average over 500 warm runs | Not a bottleneck |
| Shared time effects | 0.43 ms average over 1,000 warm runs | Not a bottleneck; duplicate caching would add complexity without meaningful benefit |
| Journey model | 0.36 ms average over 1,000 warm runs | Not a bottleneck |
| Full map projection/path generation | 12.1 ms average over 100 warm runs | Material enough to avoid redundant resize work; already memoized outside genuine model, boundary, and size changes |

The published Natural Earth files total 1,022,364 bytes raw and about 248,507 bytes with gzip. They are fetched only when Journeys is opened. Their 1:110m geometry is retained because it is already the deliberately low-detail, published context and because map rendering stayed moderate.

The render-path inspection found that Tree and Journeys previously stored every raw zoom event at the visualization root. Their expensive models were already memoized, but React still had to revisit the SVG mark lists for each transform update. Explore state consumers also receive the complete centralized state object; that remains acceptable because only one visualization is mounted and each active view consumes several shared fields. A selector-store rewrite would add complexity without a measured current benefit.

## Changes made

- Non-default Explore implementations now load on demand. The initial page route chunk fell from 304,936 bytes to 261,212 bytes, a 14.3% reduction. Timeline, Journeys, and Patterns load their own small chunks only when selected; the shared time-control chunk is reused. A height-reserving accessible loading surface limits transient layout movement during the first switch.
- All visualization container measurements now use one shared hook. Resize notifications are rounded, equality-checked, and coalesced to one update per animation frame. This matters most for the approximately 12 ms map projection.
- Tree and map zoom events now retain only the latest D3 transform and commit to React at most once per animation frame. D3 continues to sample gestures; React remains the owner of the rendered transform.
- Static Tree marks are behind a memoized React layer, so a pan or zoom updates the containing transform without reconciling every person and edge. Journey boundary/marker marks use the same boundary; pans skip mark reconciliation, while scale changes still recompute collision-safe clusters as required.

## Rendering and ownership audit

The ownership rule remains intact:

```text
canonical graph + centralized Explore state
  → pure typed D3 calculation helpers
  → React-owned HTML and SVG

D3 zoom / brush gesture adapters
  → centralized or local React state
  → React-owned SVG transforms and marks
```

D3 does not append, remove, or reconcile production marks. The only imperative integrations are the narrowly scoped zoom and brush behaviors bound to React refs. Canonical data is read-only throughout calculation and rendering.

## Layout, hydration, and mobile checks

- The default visual viewport and map have explicit heights; Timeline has a deterministic computed SVG height; the lazy-view fallback reserves 42rem. Inter Variable is bundled locally, avoiding a third-party font request.
- A production reload and all four Explore views produced no browser warning or error, including no hydration mismatch.
- At 320px, every view retained zero page-level horizontal overflow. Timeline retained 482px of intentional local scroll; Tree rendered all 41 default nodes; Journeys retained clustered markers and its structured alternative.
- Tree zoom controls updated the React-rendered transform after frame coalescing. Existing touch, keyboard, reset, structured-list, and reduced-motion alternatives remain unchanged.

No numeric CLS claim is made: the available local harness did not expose a standards-complete field measurement. The structural checks above target the known shift causes without presenting an estimated score as measured data.

## Deferred thresholds

Keep SVG while the current graph remains in this range. Reconsider viewport virtualization or Canvas only after real-device profiling shows sustained frame loss or DOM complexity grows by an order of magnitude. If that threshold is reached, preserve the structured HTML alternatives and never let a rendering optimization become a second genealogy model.
