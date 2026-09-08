# Genealogy data architecture

## Boundary

`research/` is evidence and reasoning for humans. `src/data/` is normalized application data created through explicit, reviewed normalization tasks; the application must never parse research Markdown at runtime. C3 defines the data contract in `src/types/genealogy.ts` and its dependency-free runtime checks in `src/lib/genealogy/validation.ts`. C4 populated the initial seven-person foundation in `src/data/foundation/`; C5 added 50 accepted deeper direct ancestors in branch-specific `src/data/ancestry/` modules. `src/data/family-graph.ts` composes both layers as the single graph.

The research handoff currently describes 104 canonical genealogically relevant identities after the documented Philomene Comeaux ID alias, plus separate research-only candidates. Counts describe archive coverage, not permission to attach every identity to the accepted family.

## One canonical family graph

The normalized layer exposes one graph with stable IDs. Every tree, profile, list, map, timeline, journey, and visualization is a projection of that graph. A view may filter or aggregate the graph, but it must not create a competing copy of people or relationships.

C11 is the first concrete visualization of this rule. Its temporary D3 hierarchy is derived at render time from accepted parent-child edges in the canonical graph. It stores path-specific layout occurrence IDs separately from canonical person and relationship IDs, never writes layout data back into `src/data/`, and is discarded when the view changes.

## Conceptual entities

| Entity | Minimum responsibility |
|---|---|
| Person | Stable ID, canonical display name, alternate/maiden forms, disposition, and supported summary fields |
| Relationship | Typed edge between person IDs, relationship role, confidence, sources, and biological/adoptive/step/social distinctions where known |
| Event | Typed occurrence involving people, a date value, optional place, confidence, evidence, and movement details when applicable |
| HistoricalDate | Exact date, year-only, circa, before, after, range, or explicitly unknown |
| Place | Stable ID, historical and modern labels where supported, administrative hierarchy, precision, confidence, and optional geometry |
| Movement | Supported endpoints plus one archive-defined movement classification; route geometry only when evidence supports it |
| Source | Stable source ID, citation metadata or preserved handle, evidence class, inspection status, reliability, and supported claims |
| ID alias | Explicit compatibility mapping without changing or merging the canonical identity silently |

The canonical TypeScript entities are `Person`, `Relationship`, `Event`, `Place`, `Source`, `HistoricalDate`, and `GenealogyGraph`. `Confidence` and `ResearchStatus` are separate unions. All evidence-bearing graph entities require at least one source reference, while source records preserve public URLs, internal citation handles, evidence class, inspection status, aliases, and research provenance.

The graph uses typed ID namespaces: `person-…` or `candidate-…`, `relationship-…`, `event-…`, `place-…` or `candidate-place-…`, and uppercase `SRC-…`. Runtime validation enforces the corresponding syntax, uniqueness, alias collisions, and cross-reference integrity.

## Confidence and disposition

Genealogical confidence has exactly three values:

- `verified`: directly supported by a strong record or secure convergence of independent records.
- `probable`: favored by evidence, but missing a direct record or crucial identity link.
- `unresolved`: no responsible choice can currently be made.

`rejected`, `unattached`, `contextual`, `unresolved`, and `research-only-candidate` are research statuses, not extra confidence levels. `accepted` is the status for a person or edge admitted to the canonical lineage. Runtime validation rejects an accepted relationship that points to a person with any non-accepted research status.

A derived relationship path is no stronger than its weakest edge. UI summaries must not upgrade a probable bridge to verified because surrounding generations are stronger.

## Historical dates

Do not normalize dates into a single nullable ISO string. `HistoricalDate` is a discriminated union for `exact`, `year`, `circa`, `before`, `after`, `range`, and `unknown`. Exact values use validated `YYYY-MM-DD`; bounded forms contain an exact date or a year. Formatting and sorting are separate concerns: a year-only date may have a sortable interval without being displayed as January 1, and a circa date must remain visibly approximate.

Conflicting date assertions are not an eighth precision. Preserve them as separate evidence-backed records or alternatives with their own confidence, sources, status, and notes; do not collapse them into one date.

## Geographic precision and movement

Place precision and claim confidence are separate. Preserve the narrowest supported level: exact named site, town/city, parish/county, state/province/region, country, probable location, or mention without enough precision. Coordinates are optional and must carry compatible precision; broad evidence must not become an exact marker.

Movement uses only these meanings from the archive:

1. `documented migration/move`
2. `strongly inferred move`
3. `separate known locations at different dates, route unknown`

Two place observations do not prove a route, intermediate stops, timing, or cause. Movement of goods and general historical context are not personal migration.

## Names, IDs, and merge safety

- Preserve the archive's immutable person, place, claim, and source IDs wherever assigned. Original packet claim IDs remain provenance because the ingestion audit found semantic collisions; normalized graph IDs must be globally unique in their namespace.
- Canonical names are working display labels, not proof that every component appeared on a birth record.
- Store maiden/birth names and alternate spellings separately with provenance.
- Never merge people by display name, surname, geography, or date similarity alone.
- Retain the documented alias `person-philomene-comeaux-1916` → `person-philomene-comeaux`.
- Candidate IDs and exclusion reasons remain merge guards during normalization.

## Source handling

Claims refer to source IDs; sources record whether an original image, transcription, index, compilation, obituary, secondary history, research synthesis, or family statement was actually inspected. Internal ChatGPT citation handles are retrieval aids, not public URLs. Missing bibliography fields remain missing rather than manufactured.

## Normalization invariants

- No person, relationship, event, date, place, occupation, service record, burial, or journey is added merely to complete a story or tree.
- Conflicting values remain representable even when one is preferred.
- Family-provided information remains distinguishable from independent evidence.
- Research synthesis is provenance, not independent proof.
- Research-only candidates cannot appear in accepted paths without new reviewed evidence.
- Normalization is deterministic, reviewable, and testable; application code imports only its output.

## Runtime validation boundary

`validateHistoricalDate` checks date structure, real Gregorian calendar dates, integer years, circa tolerances, and range ordering. `validateGenealogyGraph` checks schema version, stable-ID namespaces, duplicate IDs and aliases, required evidence fields, source/person/place/relationship references, event-specific requirements, and candidate-to-lineage safeguards. Alias helpers resolve legacy person and source IDs without mutating data.

Validation is deliberately lightweight and dependency-free. It protects structural invariants; it cannot decide whether a historical conclusion is genealogically correct. Reviewed normalization and the research archive remain authoritative for that judgment.

`auditGenealogyGraph` adds graph-level quality checks for orphan person/place/source IDs, ancestry cycles, likely duplicate identities, bounded chronology, impossible parent chronology, and non-overlapping vital-event alternatives. Its C5 results and limits are documented in `docs/data-quality-report.md`.

## Graph queries

C6 adds a framework-independent, graph-injected query factory in `src/lib/genealogy/queries.ts`. The application-facing `familyGraphQueries` instance is bound to the single canonical graph in `src/data/queries.ts`. Queries return supporting relationship paths, confidence, source-reference routes, date-overlap states, and indeterminate temporal results rather than flattening uncertainty into bare booleans. The complete public contract is documented in `docs/genealogy-queries.md`.

## People directory projection

C17 derives its directory records in `src/lib/genealogy/people-directory.ts`; no separate people dataset exists. Generation is the number of accepted parent-child edges from Michael, not an estimate from dates. Branch comes from accepted ancestry paths. Surname indexing uses only final surname forms already present in a person's canonical or alternate names and therefore must be described as a recorded-name filter, not a birth-surname assertion. Birthplace indexing accepts only birth events with explicit canonical place references and preserves all confidence states when multiple claims point to the same place. The person-confidence filter qualifies the person identity record, not every claim shown in its row.

## Place profile projection

C18 derives the Places index and stable-ID place profiles in `src/lib/genealogy/place-profile.ts`. Direct associations retain their event-location, migration-origin, or migration-destination role. Parish/county and regional profiles may include associations from canonical descendants only when explicit `parentPlaceId` edges establish that hierarchy; those entries remain marked as child-place observations. Associated people, recorded surname forms, dated-event spans, undated-event counts, place/event source support, and movement endpoints all resolve from the canonical graph. No map coordinate or research prose participates in this profile projection.

## Global search projection

C19 builds a serializable global index in `src/lib/genealogy/global-search.ts`, bound to the canonical graph by `src/data/search.ts`. It includes accepted people, accepted places, recorded surname forms, and accepted normalized sources. Supported alternate person names, historical/alternate place names, source metadata, citation handles, aliases, and stable IDs are keywords; they remain search terms rather than new claims. Text matching is case- and accent-insensitive, deterministic, and independent of React.

Person and place results use their stable-ID routes. Recorded surnames are not canonical entities, so surname results use `/people?surname=…` and the directory validates the value against its graph-derived options. Source results use `/sources/[sourceId]`; those pages show only normalized source metadata and explicit normalized references. Neither indexing nor source presentation reads research Markdown at runtime.
