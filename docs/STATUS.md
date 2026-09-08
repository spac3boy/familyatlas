# Project status

**Last updated:** 2026-09-08
**Current milestone:** C18 — Places section

## Complete

- A0–A11 research handoff under `research/`.
- Research archive status: ready for normalization with unresolved claims preserved; it is a first-pass handoff, not a proof-standard completed genealogy.
- Research coverage includes 104 canonical genealogically relevant identities after aliasing, 87 proposed source/source-set entries, 53 accepted/probable/contextual/unresolved places, 9 excluded or unattached places, and 12 movement entries.
- C0 application foundation: Next.js, React, TypeScript, Tailwind CSS, shadcn configuration, Base UI, and Lucide.
- C0 validation: install, lint, type-check, production build, and zero-vulnerability npm audit passed.
- C1 durable architecture, product, design, data, visualization, methodology, status, and decision documents.
- C2 research-ingestion audit covering all people, branches, relationships, event families, places, sources, confidence states, identity risks, contradictions, incomplete records, and geographic uncertainty.
- C3 canonical TypeScript contracts for people, relationships, events, places, sources, historical dates, confidence, research status, stable IDs, aliases, and the single family graph.
- C3 dependency-free runtime validation for dates, IDs, evidence requirements, aliases, cross-references, migration endpoints, and accepted-lineage safeguards.
- C3 Node test foundation with seven passing schema and reference-integrity tests.
- C4 canonical graph with exactly seven people, eight supported in-scope relationships, 26 evidence-backed events, 10 places, and 15 normalized sources.
- C4 referential-integrity coverage for authorized people, exact relationship edges, source resolution, and all event/person/place/relationship references; the full suite now has 13 passing tests.
- C5 branch-by-branch normalization of 50 sufficiently established deeper direct ancestors: 28 maternal and 22 paternal.
- C5 canonical graph totals: 57 people, 82 relationships (56 parent-child, 23 spouse, 3 partner), 120 events, 38 places, and 53 sources.
- C5 data-quality audit for orphan IDs, invalid references, self relationships, duplicate IDs, likely duplicate identities, source coverage, chronology, impossible parent chronology, circular ancestry, and contradictory claims.
- C5 audit result: 0 errors and 3 expected warnings for explicitly retained, non-overlapping birth alternatives. All 50 deeper ancestors have an accepted path to Michael Buquet.
- C5 validation: 18 passing tests plus successful type-check, lint, and production build.
- C6 graph-injected query API for people, direct and recursive relationships, shortest paths to Michael, branch membership, source-backed surname matching, place associations, uncertainty-aware alive-in-year results, events, and source support.
- C6 preserves complete relationship/path evidence, weakest-edge confidence, historical-date overlap, place-association roles, source-reference routes, and indeterminate temporal outcomes.
- C6 validation: 28 passing tests plus successful type-check, lint, and production build.
- C7 centralized Nordic minimal/editorial tokens for warm canvas and surfaces, graphite/cool-neutral typography, fjord-blue interaction, confidence treatments, compact radii and controls, focus, responsive whitespace, and reduced motion.
- C7 portable Inter Variable font, refined Base UI-backed shadcn button, shadcn-style badge, Lucide conventions, and a limited responsive foundation specimen on the placeholder route.
- C7 validation: 28 passing tests plus successful type-check, lint, production build, and responsive visual inspection.
- C8 persistent root application shell with skip navigation, Family Atlas brand link, Explore/People/Places/Stories/Research primary navigation, active-route semantics, and a clearly deferred global-search affordance.
- C8 intentional responsive navigation: inline desktop navigation at `lg` and a Base UI-backed modal sheet for phone and tablet widths, including focus management and explicit close behavior.
- C8 validation: 28 passing tests plus successful type-check, lint, production build, and browser checks at 320px, 390px, 768px, 1366px, and 1920px with no page-level horizontal overflow.
- C9 framework-independent Explore state contracts and pure reducer for `activeView`, `selectedPerson`, `selectedYear`, `selectedBranch`, `selectedPlace`, and `evidenceMode`.
- C9 React provider and focused hooks mounted in the persistent application shell; view transitions preserve selections, routes do not own live visualization state, and D3 remains outside the state layer.
- C9 state semantics distinguish clearing filters from a full reset, validate selected years against the canonical 1–9999 bounds, and preserve object identity for no-op transitions.
- C9 validation: 35 passing tests plus successful type-check and lint.
- C10 responsive, accessible Family Atlas home page with the requested headline, supporting concept, and primary action in a restrained editorial/museum composition.
- C10 People, Places, and Time introduction resolves its Michael/parent, Carencro/Dulac/Spring Grove, and verified birth-event previews directly from the canonical application graph; no statistics or genealogy were invented.
- C10 validation: 35 passing tests plus successful lint, type-check, production build, and browser checks from 320px through 1920px with no horizontal overflow or runtime-console issues.
- C11 Family Tree V1 derives disposable ancestry hierarchies from the canonical graph for all-family, paternal, maternal, and selected-person scopes; every connector retains its source relationship ID, endpoints, and confidence.
- C11 uses `d3-hierarchy` for layout, `d3-shape` for connectors, and `d3-zoom` with its `d3-selection` binding for pan/zoom navigation. React continues to own SVG marks, controls, shared selection, expansion, and accessible semantics.
- C11 initially reveals three generations, supports node-level keyboard expansion, Show all/Fold older controls, selected-person rerooting, zoom controls, reset, and shared `selectedPerson` updates.
- C11 provides a keyboard-operable SVG tree plus an equivalent structured list, preserves known date uncertainty, omits unknown dates, uses non-color confidence cues, and disables zoom animation for reduced motion.
- C11 validation: 42 passing tests plus successful lint, type-check, production build, and browser interaction checks at 320px, 390px, 768px, 1366px, and 1920px with no page overflow or runtime-console issues.
- C12 responsive person details: an accessible shadcn/Base UI Sheet on desktop and bottom Drawer on mobile, opened from either the SVG tree or its structured-list alternative.
- C12 person presentation derives name, relationship label and path, supported lifespan, event-backed biography, places, direct family, confidence, and de-duplicated source count from the canonical graph. Unknown dates and missing biographical events remain absent or explicitly unknown; retained date conflicts remain visible.
- C12 actions preserve shared Explore context. Show in tree reroots the existing tree; journey and timeline actions set the future shared view selection without inventing an unavailable visualization.
- C12 relationship paths are calculated by the framework-independent graph utilities and presented Michael-first (for example, Michael → Paulette → Rita); no path is hard-coded in the component.
- C12 keeps person confidence separate from weakest-edge path confidence, preventing a verified identity from visually upgrading a probable relationship chain.
- C12 validation: 47 passing tests plus successful lint, type-check, production build, and live interaction checks at 320px and 1366px for Drawer/Sheet switching, relationship rendering, progressive event disclosure, shared-view actions, selected-person rerooting, and Escape dismissal.
- C13 reusable `/people/[personId]` profiles for every accepted canonical person plus an editorial `/people` index. All 57 stable-ID routes are statically generated, and unknown IDs return the standard not-found response.
- C13 profiles include Story, Family, Life in places, Timeline, Records & evidence, and Open research questions sections. Rich and sparse records use the same structure without synthesized dates, places, relationships, or narrative filler.
- C13 links parents, spouses/partners, children, related event participants, place associations, events, relationships, and source support using canonical person paths or stable-ID anchors. The C12 Sheet/Drawer now links its full-biography action to the corresponding profile.
- C13 open-research presentation is limited to explicit normalized uncertainty: probable/unresolved relationships and events, unknown event dates, unresolved alternate names, retained source contradictions, and relevant record notes. It never scrapes `research/open-questions.md` at runtime or infers missing branches as questions.
- C13 validation: 50 passing tests plus successful type-check, lint, and production build of the People index and all 57 statically generated person routes. Live checks covered rich and sparse profiles at 320px and 1366px, stable-ID deep links, active People navigation, and the Sheet-to-profile handoff without runtime warnings.
- C14 Timeline V1 derives person rows, temporal extents, supported lifespan intervals, and axis ticks from the canonical graph for all-family, maternal, paternal, and selected-person scopes.
- C14 uses `d3-scale`, `d3-time`, `d3-axis`, and `d3-time-format` for UTC temporal geometry and ticks while React owns SVG/HTML rendering, scope, selection, and accessible interaction.
- C14 preserves date semantics: exact dates are points; years and ranges retain bounded extents; circa dates use dashed tolerance intervals; before/after values remain open-ended; unknown dates are excluded from the axis and disclosed separately.
- C14 lifespan rows require both bounded birth and death evidence. Conflicting alternatives expand the possible extent and retain the narrower common supported interval rather than selecting an invented date.
- C14 connects Tree and Timeline through shared Explore state, provides a horizontally scrollable readable canvas on narrow screens, keyboard-selectable person rows, and an equivalent structured record list.
- C14 validation: 55 passing tests plus successful type-check, lint, and production build. Live browser checks at 320px and 1366px covered view switching, all/maternal/selected scopes, keyboard person selection, cross-view person/branch persistence, local horizontal timeline scrolling without page overflow, and a clean runtime console.
- C15 shared Time Navigator reads and writes the centralized Explore `selectedYear`; Timeline and the future Journeys view have no local duplicate time state.
- C15 uses D3 scale calculations and an isolated `d3-brush` binding for responsive pointer/touch selection. Keyboard arrows, Page Up/Page Down, Home/End, Escape/Delete, and the explicit Clear year action operate the same shared value without animation.
- C15 adds framework-independent event filtering plus map and person-emphasis projections. Supported, possible, indeterminate, excluded, and unfiltered states remain distinct; only conclusively out-of-year people are dimmed.
- C15 Timeline integration renders a bounded calendar-year band, de-emphasizes out-of-year events, preserves incomplete life histories, and retains the year when switching between Tree and Timeline.
- C15 validation: 61 passing tests plus successful lint, type-check, and production build. Live checks at 320px and 1366px covered keyboard and pointer selection, cross-view year persistence, keyboard/button clearing, responsive sizing without page overflow, and a clean runtime console.
- C16 Journeys Map V1 derives supported locations and movements from accepted canonical events for all-family, maternal, paternal, and selected-person scopes. Shared `selectedPerson`, `selectedBranch`, `selectedYear`, and `selectedPlace` remain React-owned Explore context.
- C16 uses `d3-geo` for a Natural Earth projection and boundary paths, `d3-shape` for explicitly schematic movement curves, and isolated `d3-zoom` behavior for pan/zoom. React renders every SVG/HTML mark and accessible control.
- C16 distinguishes documented, probable, and mixed-location anchors without inventing coordinates. Named sites lacking inspected coordinates use disclosed town/county anchors; historical Acadia and Port Royal remain explicit but unplotted because no modern equivalent was normalized.
- C16 encodes documented movements with solid schematic curves and strongly inferred movements with dashed curves. Separate known locations with unknown routes use paired endpoint rings and are structurally prohibited from producing a connecting path.
- C16 vendors published Natural Earth 1:110m Admin 0 and Admin 1 GeoJSON boundary context under `public/data/`, with source and version disclosed in the interface and visualization documentation.
- C16 validation: 68 passing tests plus successful lint, type-check, and production build. Live browser checks at 320px and 1366px covered published-boundary loading, pointer and keyboard marker selection, collision-safe responsive clusters, zoom detail, branch/year filtering, selected-person handoff, and zero page-level horizontal overflow.
- C17 People directory projects all 57 accepted canonical people into restrained, linked typographic rows and supports composable branch, recorded-surname, generation, explicit-birthplace, and person-confidence filters.
- C17 filter semantics retain evidence boundaries: generation is parent-child depth from Michael; surname values come only from canonical or alternate recorded names; birthplace requires an accepted birth event with an explicit canonical place reference; and unavailable filter values are not manufactured.
- C17 validation: 75 passing tests plus successful lint, type-check, and production build. Live browser checks at 320px and 1366px covered all 57 stable-ID profile links, five-filter composition, filter clearing, profile navigation, uncertainty labels, and zero page-level horizontal overflow.
- C18 Places index groups all 38 accepted canonical locations into restrained geographic lists and links each one to a statically generated stable-ID detail route.
- C18 place profiles derive associated people, recorded surname forms, events, historical-date spans, supporting sources, canonical place hierarchy, and all three movement classifications. Broader parish, county, and region profiles include only normalized child-place associations and label them as occurring within that geography.
- C18 connects place profiles to person profiles, supporting event/source anchors, and shared Journeys state. Person profiles, the home-page place preview, and Journeys map details now link back to canonical place routes.
- C18 validation: 83 passing tests plus successful lint, type-check, and production build. Live browser checks at 320px and 1366px covered all 38 place links, parish-level precision, historical geography without a manufactured modern country, Places-to-Journeys selection, stable cross-links, and zero page-level horizontal overflow.

## Deliberately not started

- Collateral, descendant, contextual, unattached, research-only candidate, or rejected identities beyond the accepted direct ancestral graph.
- Additional normalization not authorized by the branch coverage audits or later evidence review.
- Standalone Family or Research destination features beyond the completed People and Places sections.
- Secondary product routes plus the patterns visualization UI/view model.
- Hosting, authentication, analytics, editing, collaboration, or synchronization.

## Current repository boundary

The site contains a validated application shell, an editorial home/Explore route with Family Tree V1, Timeline V1, Journeys Map V1, their shared Time Navigator, and responsive person details, plus filterable People and evidence-bounded Places sections with stable-ID profiles. C4 added the source-traceable seven-person foundation; C5 extended that graph with accepted direct maternal and paternal ancestry; C6 added read-only graph utilities; C7 added visual tokens and primitives; C8 added persistent navigation; C9 added shared Explore state; C10 added the canonical-data-backed home page; C11 added the first derived visualization; C12 added person-centered disclosure over that visualization; C13 added person profiles; C14 added the uncertainty-preserving cross-person timeline; C15 made year context operational across temporal views; C16 added evidence-limited geographic projection and movement presentation; C17 made the People index an evidence-bounded directory; C18 added the canonical Places index and detail views. No search behavior, patterns view, or standalone Research destination is implemented. `research/manifest.json` records the state at the end of A11, so its `websiteCodeCreated: false` field is historically correct for that research handoff even though C0 subsequently created application code.

No application code may parse `research/` at runtime. The ingestion audit is recorded in `docs/research-ingestion-report.md`; it found 13 reused claim IDs, including 8 semantic collisions. Normalized data uses globally unique application IDs and preserves packet IDs only as file-scoped research provenance. The C5 integrity results are recorded in `docs/data-quality-report.md`; the C6 public query contract is recorded in `docs/genealogy-queries.md`. Further genealogy expansion must remain explicit and reviewed; unresolved claims may not be resolved merely to make the product complete.

## Known environment notes

- `npm run build` uses Next.js's supported Webpack builder because Turbopack's CSS worker cannot bind its internal port in the managed Codex environment.
- npm reports two warnings from unrelated user-level configuration keys; project install and validation are unaffected.
- The repository is connected to `https://github.com/spac3boy/familyatlas.git`; task changes remain unstaged unless the user commits them.
