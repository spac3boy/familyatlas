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
- **Consequence:** Product routes supply page content rather than duplicating navigation. Active destinations use URL-derived state and `aria-current`; mobile navigation closes on selection. Search was enabled by C19 under D-025.

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

## D-023 — Directory filters are evidence-bounded graph projections

- **Status:** accepted
- **Decision:** Derive the People directory from accepted people in the canonical graph. Generation counts supported parent-child edges outward from Michael; branch uses the canonical ancestry query; surname options use only the final surname form in canonical and alternate recorded names; birthplace requires an accepted birth event with an explicit place reference; and confidence filters the person record itself.
- **Consequence:** Directory filtering cannot infer a birth surname, birthplace, generation, or branch from context. Alternate and uncertain recorded names remain attributable to their own confidence, multiple birthplace claims remain visible, and options with no represented canonical value are omitted. The server prepares the serializable directory model while the client owns only transient filter controls.

## D-024 — Place profiles preserve canonical hierarchy and association scope

- **Status:** accepted
- **Decision:** Generate `/places/[placeId]` from accepted canonical places, events, people, sources, and movement endpoints. A broad place may include events attached to its explicitly normalized child places, but those events remain labeled as occurring within the child place rather than directly at the parent geography. Movement classifications and endpoints remain unchanged.
- **Consequence:** Place pages cannot manufacture a settlement, modern equivalent, route, date, or person association. Parish/county and region rollups depend only on `parentPlaceId`; surname labels remain recorded-name forms; record spans summarize dated events while disclosing undated records. Place-to-Journeys actions update centralized Explore state before navigation, and stable place routes serve all cross-links.

## D-025 — Global search is a canonical graph projection

- **Status:** accepted
- **Decision:** Build the global search index from accepted people, places, recorded canonical/alternate surname forms, and normalized sources only. Keep indexing and deterministic ranking in framework-independent TypeScript; pass the serialized projection into the interactive shadcn Command presentation.
- **Consequence:** Search cannot scrape `research/`, promote excluded records, infer surnames, or invent destinations. People, places, and sources use stable-ID routes; surname results use a stable `/people?surname=…` filter URL. Source routes expose normalized metadata and explicit graph references without becoming a second research archive.

## D-026 — Evidence Mode reveals confidence without weakening uncertainty defaults

- **Status:** accepted
- **Decision:** Keep Evidence Mode in the existing global Explore reducer and expose one control in the persistent shell. Normal browsing always shows probable and unresolved states where they qualify a claim; Evidence Mode additionally reveals restrained verified markers and supporting confidence context. Build the Research section from a framework-independent projection of accepted canonical entities plus explicitly reviewed application-facing methodology and open-question data.
- **Consequence:** Evidence Mode cannot hide material uncertainty, alter confidence, or create a second evidence store. Research pages and cross-product confidence treatments never parse `research/` at runtime. The human archive remains fuller than the accepted graph, and coverage copy must distinguish those scopes.

## D-027 — Claim provenance is independent of research confidence

- **Status:** accepted
- **Decision:** Keep `verified`, `probable`, and `unresolved` as research-confidence values, and add optional claim-level `family-confirmed` and `documented` provenance entries with their own source references. Multiple provenance kinds may coexist on one claim. Michael's explicit firsthand identification of his parents and grandparents establishes the six corresponding parent-child roles as verified and family-confirmed.
- **Consequence:** A family-confirmed relationship is no longer displayed as merely probable because no birth record was reviewed, but the confirmation does not transfer to parentage subtype, dates, places, names, or other biographical facts. Existing documentary references remain attached; Verna→Aubin, Rita→Paulette, and Gina's two parent edges currently carry both classified provenance kinds. Unclassified legacy claims remain valid, and distant ancestry is unchanged.

## D-028 — Siblings are derived and living-person data is minimized

- **Status:** accepted
- **Decision:** Represent a sibling only through supported parent-child relationships to the shared parent or parents. Do not add a direct sibling edge or a placeholder for an unidentified parent. For living close relatives, normalize only the biographical detail needed by the product: omit exact birth dates, preserve a supported year only when it is confirmed, and retain tentative name/date details as unresolved rather than canonical.
- **Consequence:** Sidney Paul Roger is linked only through Paulette Comeaux; Edmond Paul Buquet and Gina Buquet are linked through both Aubin Buquet and Paulette. Existing sibling and relationship-path queries derive the connection. Gina's middle name remains unresolved, her confirmed 1990 birth year is retained, and no full living-person birth date appears in public canonical data.

## D-029 — The immediate graph may extend to spouse and descendants without inventing in-laws

- **Status:** accepted
- **Decision:** Add Karla Vannessa Contreras-Buquet through a verified, family-confirmed spouse edge to Michael, and add Chloé Eloise Buquet and Jolie Renee Buquet through verified parent-child edges to both Michael and Karla. Treat a spouse as the same directory generation as the connected focal person, while each parent-child step changes the directory distance by one. Do not infer Karla's parents or ancestors from her surname or family role.
- **Consequence:** All three people receive stable routes, search records, profiles, and Evidence Mode support from the canonical graph. Only birth years are public for these living people. Karla's paternal and maternal lines remain an explicit future research area rather than incomplete synthetic nodes.

## D-030 — The default family tree begins with the youngest known generation

- **Status:** accepted
- **Decision:** Make Chloé Eloise Buquet and Jolie Renee Buquet the focal generation at the center of the default Family Tree V2 view. Derive a disposable two-sided projection that places Karla to their left and Michael to their right, includes Michael's supported siblings and accepted ancestry, and grows each parent's ancestry outward. Michael's line grows right; Karla's future supported line automatically mirrors left. Keep Michael as the configured reference person for relationship paths, directory generations, and maternal/paternal branch queries. Preserve the focused paternal, maternal, and selected-person ancestry scopes from V1.
- **Consequence:** The default diagram can show descendants, collateral relatives, and a canonical spouse edge without changing the one canonical family graph. Michael is positioned within the vertical sibling group and both parents align with the daughters' midpoint, keeping the family core visually balanced. Every visible connector must resolve to an accepted relationship; siblings remain derived from shared parent-child edges, and Karla's unknown ancestry remains absent. The focal treatment is visual emphasis, not a new evidence or identity state.

## D-031 — Parental siblings remain structural, documentary collateral family

- **Status:** accepted
- **Decision:** Normalize Michael's known aunts and uncles only through obituary-supported parent-child edges to their shared parents. Classify direct siblings of Paulette and Aubin as maternal or paternal collateral family from those shared-parent paths. Preserve the archive's distinction between direct obituary maternity and probable indirectly supported paternity, and keep reported spouse pairs probable unless stronger evidence is supplied.
- **Consequence:** No aunt, uncle, or sibling edge is added. Priscilla's Karlon and Tippy LeBlanc reports remain separate people and relationships with no inferred chronology or parentage for Dexter Babineaux. The uncle Michael Buquet has an explicit `distinctFromPersonIds` guard against the reference person of the same name. Tree, directory, search, profiles, and Evidence Mode consume the new graph records automatically.

## D-032 — First cousins are derived through evidence-bearing parent paths

- **Status:** accepted
- **Decision:** Normalize a first cousin only through four accepted parent-child edges: Michael → parent → shared grandparent → aunt/uncle → cousin. Add a framework-independent `firstCousins(id)` query that returns every structural path and its weakest confidence. Keep documentary-inferred parent assignments probable even when both endpoints and the grandchild generation are verified.
- **Consequence:** Nine named cousins enter the accepted graph without a `cousin` edge. Cathy→Paige, Cathy→Sean, and the seven maternal parent assignments remain probable/documented and are eligible for later family-confirmed provenance. Richard Russell McRae's memorial supplies separate verified/documented father edges to Paige and Sean without implying a Cathy–Richard spouse relationship. Sid Roger resolves to sibling Sidney Paul Roger; Lauren Dugas and Collin Adkisson remain excluded from cousin classification. Tree, directory, search, profiles, branch filtering, and Evidence Mode derive their presentation from these same records.

## D-033 — Shared-parent sibling presentation does not imply parentage subtype

- **Status:** accepted
- **Decision:** Derive Michael's sibling branch membership and public relationship wording only from supported shared-parent edges. A sibling sharing Paulette is maternal; a sibling sharing both Paulette and Aubin is `both`. Describe the actual recorded-parent context instead of inferring biological full-, half-, adoptive-, legal-, or step-sibling status from topology alone.
- **Consequence:** Sidney is presented as Michael's maternal sibling through Paulette, while the research and source notes retain Michael's explicit different-father statement. Edmond “Bud” and Gina are presented as siblings through both recorded parents. Sidney's unnamed father remains absent, and every parent-child edge retains its existing `parentage: "unknown"` subtype.

## D-034 — Aggregate patterns expose the archive before interpreting the family

- **Status:** accepted
- **Decision:** Limit Patterns V1 to counts whose denominator and meaning are explicit in the accepted canonical graph: unique recorded ancestors by supported generation and branch, birthplace-evidence coverage across accepted people, and confidence mix within each accepted entity type. Use D3 only for proportional scale calculations and let React render accessible HTML. Keep missing birthplace evidence as named categories and describe generation counts as represented identities rather than theoretical ancestor slots.
- **Consequence:** Patterns V1 cannot claim biological-tree completeness, collapse unknowns into zeros, or combine people, relationships, events, and places into one quality score. Surname rankings remain excluded while canonical, maiden, married, and historical forms overlap; geographic distributions remain excluded while birthplace coverage is sparse and precision is mixed; branch-completeness percentages remain excluded because the graph has no defensible complete-family denominator.
