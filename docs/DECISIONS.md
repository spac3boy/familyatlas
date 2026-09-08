# Decision log

Durable decisions live here. New entries should state the consequence; superseded entries remain in the log and link to their replacement.

## D-001 — One canonical family graph

- **Status:** accepted
- **Decision:** Normalize genealogy into one typed graph with stable IDs. All product views derive from it.
- **Consequence:** Features cannot maintain independent person or relationship datasets.

## D-002 — Research and application data are separate

- **Status:** accepted
- **Decision:** `research/` remains the human-readable evidence archive; `src/data/` will hold explicitly normalized application data.
- **Consequence:** Runtime code never parses research prose. Normalization is a reviewed development step, and application work does not casually rewrite research packets.

## D-003 — Uncertainty is first-class

- **Status:** accepted
- **Decision:** Preserve `verified`, `probable`, and `unresolved` confidence, historical-date uncertainty, geographic precision, source inspection status, conflicts, and research-only dispositions.
- **Consequence:** Models and UI cannot reduce claims to bare values or use `rejected` as a fourth confidence state. Missing genealogy is never invented.

## D-004 — React renders; D3 calculates

- **Status:** accepted
- **Decision:** React owns application and interaction state plus HTML/SVG rendering. D3 is limited to layout, projection, scale, interpolation, and path calculations unless a narrowly isolated behavior requires otherwise.
- **Consequence:** Prefer React-rendered SVG and pure typed calculation helpers; D3 does not become a parallel DOM or state owner.

## D-005 — Conventional UI foundation

- **Status:** accepted
- **Decision:** Use source-owned shadcn components built on Base UI primitives, Tailwind semantic tokens, and Lucide icons.
- **Consequence:** New primitives follow the same composition and accessibility conventions before introducing another UI system.

## D-006 — Nordic minimal/editorial direction

- **Status:** accepted
- **Decision:** Use quiet editorial hierarchy, generous space, restrained surfaces, and purposeful data encoding.
- **Consequence:** Avoid generic dashboard density, decorative scrapbook motifs, and ornamental motion that competes with historical content.

## D-007 — Responsive and accessible by default

- **Status:** accepted
- **Decision:** Build mobile-first with semantic HTML, keyboard access, visible focus, readable contrast, non-color-only meaning, structured alternatives to visuals, and reduced-motion support.
- **Consequence:** Accessibility and narrow-screen behavior are feature acceptance criteria, not later polish.

## D-008 — Narrow dependencies and GitHub portability

- **Status:** accepted
- **Decision:** Use TypeScript and standard npm/Next.js conventions, add dependencies only when required, and avoid machine-specific runtime paths or provider lock-in.
- **Consequence:** Add individual D3 modules only with their first feature. The repository must build from a normal GitHub clone with documented commands.

## D-009 — Production build uses Webpack in the foundation

- **Status:** accepted
- **Decision:** `npm run build` uses Next.js's supported `--webpack` builder.
- **Consequence:** Production validation works in the managed environment where Turbopack's CSS worker cannot bind its internal port. Development remains free to use Next.js defaults; revisit only with evidence and update this log.

## D-010 — Canonical genealogy contracts are discriminated and runtime-checked

- **Status:** accepted
- **Decision:** Define the normalized graph in `src/types/genealogy.ts` with discriminated historical dates, evidence-backed entities, namespaced stable IDs, explicit source references, and separate confidence and research-status fields. Use dependency-free runtime validation for structural and reference integrity.
- **Consequence:** Normalized data must pass `validateGenealogyGraph` before use. Accepted relationships cannot include candidate, rejected, unattached, contextual, or otherwise non-accepted people. Validation protects structure but never substitutes for evidence review.

## D-011 — Normalization begins with a bounded, source-traceable foundation

- **Status:** accepted
- **Decision:** The first canonical graph contains only Michael Buquet, his parents, and four grandparents, plus supported in-scope relationships, events, places, and sources. Every evidence-bearing record links to normalized source IDs and, where available, its owning research file and original claim handle.
- **Consequence:** Deeper relatives remain outside application data until separately reviewed. Unknown facts stay absent or explicitly unknown; month-only dates use their full possible calendar interval with the original wording, never an invented day.

## D-012 — Deeper normalization follows the accepted direct-ancestor ledger

- **Status:** accepted
- **Decision:** C5 admits the 28 maternal and 22 paternal deeper ancestors identified as sufficiently established direct ancestors by the branch coverage audits. It excludes collateral, contextual, unattached, research-only, and rejected identities. Parentage subtype remains `unknown` unless independently established, and contradictory historical claims remain separately traceable.
- **Consequence:** Similar names do not authorize identity merges, and no person enters the accepted family graph merely because they appear in a source. The canonical graph must pass both structural validation and the genealogy-specific data-quality audit documented in `docs/data-quality-report.md`.

## D-013 — Graph queries are framework-independent and uncertainty-bearing

- **Status:** accepted
- **Decision:** Build read-only genealogy selectors through a graph-injected TypeScript factory with no React, route, browser, or research-prose dependency. Relationship results retain source edges; recursive and branch results retain paths and weakest-edge confidence; temporal queries expose overlap and indeterminate states.
- **Consequence:** Components consume one pre-bound `familyGraphQueries` instance or inject another validated graph in tests. Query APIs may not replace missing evidence with inferred relationships, surnames, exact dates, place precision, or binary life-status conclusions.

## D-014 — The visual foundation uses semantic Nordic editorial tokens

- **Status:** accepted
- **Decision:** Use a bundled Inter Variable foundation, warm off-white canvas, graphite and cool-neutral text, restrained warm surfaces, 1px neutral rules, small radii, minimal elevation, and desaturated fjord-blue interaction tokens. Confidence styling combines semantic color with text, icon, and border treatment.
- **Consequence:** Components consume the centralized semantic tokens and shadcn/Base UI conventions. Gradients, glassmorphism, parchment/sepia themes, ornamental historical styling, large shadows, excessive pills, oversized SaaS cards, and generic dashboard composition are outside the design language.

## D-015 — The root layout owns one responsive application shell

- **Status:** accepted
- **Decision:** Keep brand, primary navigation, deferred global search, skip navigation, and main-content framing in a persistent root-layout shell. Use inline navigation at `lg` and wider; use an accessible Base UI dialog sheet below `lg` rather than compressing all destinations into tablet and phone headers.
- **Consequence:** Product routes supply page content rather than duplicating navigation. Active destinations use URL-derived state and `aria-current`; mobile navigation closes on selection. Search remains visibly unavailable until a dedicated implementation task supplies real behavior.

## D-016 — Explore interaction state is shared, React-owned, and route-independent

- **Status:** accepted
- **Decision:** Keep the active Explore view, person/year/branch/place selections, and evidence mode in one typed reducer exposed through a React provider in the persistent application shell. Changing among tree, journeys, timeline, and patterns preserves the other shared selections. Routes may provide future entry points, but they are not the canonical live visualization state.
- **Consequence:** Individual visualization components consume the shared hooks and may keep only genuinely local transient interaction state. They cannot create competing selection stores, let D3 own state, or clear cross-view context merely because the representation changes.

## D-017 — Family trees use disposable ancestry projections over canonical edges

- **Status:** accepted
- **Decision:** Derive Family Tree V1 from the canonical graph into a temporary, path-aware D3 hierarchy. D3 hierarchy and shape modules calculate coordinates and connector paths; D3 zoom reports navigation transforms; React owns marks, controls, accessibility, selection, and expansion. Every connector retains its canonical parent-child relationship ID and confidence.
- **Consequence:** The tree may duplicate a person's layout occurrence if pedigree collapse requires it, but it cannot duplicate or mutate the canonical person. Tree-specific hierarchy, coordinates, expansion, and transforms never enter `src/data/`. The initial view folds older generations for legibility and must retain a keyboard-operable structured alternative.

## D-018 — Person detail is one responsive, graph-derived disclosure

- **Status:** accepted
- **Decision:** Use one person-detail view model derived from the canonical graph and C6 query API. Present it in a right-side shadcn/Base UI Sheet at desktop widths and a bottom Drawer on mobile. Relationship paths are calculated to the configured Michael focal person, then displayed Michael-first; components never encode family paths manually.
- **Consequence:** The Sheet and Drawer cannot maintain separate genealogy content. Missing dates remain omitted, conflicting dates remain alternatives, short biographies use accepted normalized events only, and source counts de-duplicate the support routes returned by the graph. Cross-view actions update shared Explore state; routes do not become visualization state.

## D-019 — Person profiles are stable-ID projections of normalized data

- **Status:** accepted
- **Decision:** Generate every accepted person profile at `/people/[personId]` from one framework-independent profile adapter over the canonical graph. Person links use stable-ID paths; event, relationship, place, and source links use their stable IDs as in-page anchors until dedicated resource routes exist.
- **Consequence:** Rich and sparse profiles share one six-section structure without independent biography data. The open-research section may expose only uncertainty already encoded in normalized entities; it cannot parse the research archive at runtime or treat an absent ancestor as a research question. Unknown person IDs are not generated and resolve to not found.

## D-020 — Timeline geometry preserves historical-date sets

- **Status:** accepted
- **Decision:** Derive Timeline V1 from accepted canonical events into explicit temporal extents. Use D3 UTC scales, intervals, axis configuration, and formatting only for calculations; React renders and owns interaction. Exact dates are points, year/range/circa values remain intervals, before/after values remain open, and unknown dates receive no coordinate. A lifespan requires bounded birth and death evidence at both ends.
- **Consequence:** Timeline code cannot coerce uncertainty into a representative point or infer a life span from incomplete evidence. Conflicting alternatives contribute an outer possible extent and an inner common supported extent. Unknown records remain accessible outside the plotted axis, and person/branch selections continue through shared Explore state.

## D-021 — One selected year drives every temporal view

- **Status:** accepted
- **Decision:** Timeline and Journeys consume the centralized Explore `selectedYear`; no visualization keeps a competing selected-year value. The shared navigator uses D3 scales for coordinate calculation and an isolated D3 brush for pointer/touch gestures, then dispatches through the React-owned Explore action.
- **Consequence:** Event filters, map state, and person emphasis derive from one uncertainty-preserving time-effects API. Unknown dates remain indeterminate, overlapping intervals remain possible, and only people conclusively born later or dead earlier may be dimmed. Clearing selects no year, and programmatic brush synchronization uses no animated transition.

## D-022 — Journey geometry cannot exceed movement evidence

- **Status:** accepted
- **Decision:** Derive Journeys from accepted canonical events and display-only place anchors over vendored Natural Earth boundaries. Render documented and strongly inferred movement as differently styled schematic curves; render separate known locations with an unknown route as endpoint rings without any connecting path. Coordinates position claims for display and never upgrade canonical place precision.
- **Consequence:** Map code may group claims at the same honest anchor, but it cannot offset them into invented sites or reconstruct travel paths. Historical places without a defensible modern anchor remain explicit in the structured result and unplotted. React owns scope and shared selections; D3 Geo, Shape, and Zoom remain calculation/behavior helpers.
