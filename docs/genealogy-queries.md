# Genealogy graph query API

## Purpose and boundary

The C6 query layer derives read-only views from a supplied `GenealogyGraph`. It has no React, route, browser, D3, or research-Markdown dependency. The factory implementation lives in `src/lib/genealogy/queries.ts`; `src/data/queries.ts` binds it once to the canonical `familyGraph`.

Use the ready-to-query canonical graph:

```ts
import { familyGraphQueries } from "@/data";

const parents = familyGraphQueries.parents("person-michael-buquet");
```

Use the framework-independent factory with another validated graph:

```ts
import { createGenealogyQueries } from "@/lib/genealogy";

const queries = createGenealogyQueries(graph, {
  focalPersonId: "person-michael-buquet",
  maternalRootId: "person-paulette-comeaux",
  paternalRootId: "person-aubin-buquet",
});
```

By default, relationship, event, and person-list queries use records whose `researchStatus` is `accepted`. A caller may explicitly pass `researchStatuses` to the factory when building a research view. Candidate or rejected records are never included implicitly.

## Public methods

| Method | Result |
|---|---|
| `personById(id)` | A canonical `Person`, including resolution through `idAliases`, or `undefined`. |
| `parents(id)` | Parent people paired with the complete supporting parent-child relationship. |
| `children(id)` | Child people paired with the complete supporting parent-child relationship. |
| `spousesAndPartners(id)` | Other people paired with the source relationship; spouse and partner remain distinct. |
| `ancestors(id, options?)` | Ancestors with minimum depth and every simple parent path found within `maxDepth`. |
| `descendants(id, options?)` | Descendants with minimum depth and every simple child path found within `maxDepth`. |
| `siblings(id)` | People sharing at least one supported parent, plus evidence for each shared parent. No full/half label is inferred. |
| `firstCousins(id)` | People reached only through the structural path subject → parent → shared grandparent → parent’s sibling → cousin. Every supporting parent-child path and its weakest confidence remain available. |
| `relationshipPathToMichael(id)` | Every shortest included relationship path to the configured focal person, which defaults to Michael. |
| `branchForPerson(id)` | `maternal`, `paternal`, `both`, `self`, or `unclassified`, plus the ancestry, focal-sibling shared-parent, or parental-collateral-descendant paths supporting each membership. |
| `peopleBySurname(surname)` | Suffix matches against canonical and alternate source-backed name forms, with the exact matched forms returned. |
| `peopleAssociatedWithPlace(id, options?)` | People grouped with the events that associate them with the place. |
| `peopleAliveInYear(year)` | Temporally supported or possible matches, indeterminate people, and evidence-supported exclusions. |
| `eventsByPerson(id)` | Included events involving the person, in historical-date order with unknown dates last. |
| `eventsByDate(date)` | Events whose historical-date interval is contained by or overlaps the query interval, plus explicitly undated events. |
| `eventsByPlace(id, options?)` | Events tied to the place as event location, migration origin, or migration destination. |
| `sourcesSupportingPerson(id)` | Sources supporting the person entity, alternate names, relationships, or events, grouped without discarding the route of support. |
| `sourcesSupportingEvent(id)` | Sources cited by the event, with the original `SourceReference` objects retained. |

`eventsByPlace` and `peopleAssociatedWithPlace` accept `{ includeDescendantPlaces: true }` to include supported child places from the normalized place hierarchy. This hierarchy option does not increase a place's precision.

`ancestors` and `descendants` accept `{ maxDepth }`. Their paths follow only parent-child edges; couple relationships do not create ancestry. `relationshipPathToMichael` may follow parent-child, spouse, and partner edges because it describes graph relationship rather than lineage.

`firstCousins` never matches by surname, obituary list position, or a stored cousin label. It requires four accepted parent-child edges for each returned path. A probable parent assignment therefore yields a probable cousin path even when the shared grandparent and surrounding identities are verified. In the current C24 graph, Michael's nine accepted first-cousin paths are verified because he confirmed each relationship role; their previously attached documentary evidence remains independently classified and partly indirect.

## Uncertainty behavior

Direct-family results return the complete `Relationship`, including confidence, research status, parentage subtype, source references, and notes. Paths carry all of their relationship records and a derived `confidence` equal to the weakest edge. An empty self/root path falls back to the person's confidence.

Branch classification describes where accepted paths occur in the graph; it does not promote the confidence of those paths. Inspect each membership path before presenting the classification as certain.

For a sibling of the configured focal person, branch membership uses only supported shared-parent edges. A sibling sharing the maternal root is maternal; a sibling with supported edges to both branch roots is `both`. The query does not infer a full-, half-, biological-, adoptive-, or step-sibling subtype from missing parent records.

Surname matching is intentionally textual. The data contract has source-backed full name forms rather than an inferred surname field, so the query returns every matched name form and does not claim that the final token was legally or consistently used as a surname.

### Historical-date matching

`eventsByDate` accepts a `HistoricalDate`, not a bare JavaScript `Date`. This retains exact, year, circa, before, after, range, and unknown semantics.

- `contained`: the event's full supported interval fits within the requested interval.
- `overlaps`: only part of the event's possible interval intersects the request.
- `indeterminate`: the event has an explicit unknown date and a dated query cannot responsibly include or exclude it.

Querying `{ kind: "unknown" }` returns explicitly undated events rather than pretending they occurred within a calendar range.

### Alive-in-year matching

`peopleAliveInYear` deliberately does not return one unqualified boolean list:

- `matches` with `temporalStatus: "supported"` have a dated life event in that year or birth/death bounds that contain it.
- `matches` with `temporalStatus: "possible"` have lifespan alternatives that overlap the year but do not establish it across all retained alternatives.
- `indeterminate` identifies missing or open evidence that prevents classification.
- `excluded` contains people whose retained birth alternatives are all later or whose retained death alternatives are all earlier.

The `supported` label describes the temporal calculation only. It does not upgrade an underlying probable or unresolved event to verified. `evidenceEvents` must travel with any presentation of the result. Burial and generic `other` events are not treated as proof that a person was alive during their stated year.

A birth or death event inside the selected year yields `supported` only when every retained alternative for that vital event also overlaps the year. If another retained alternative excludes the year, the result remains `possible`.

## Determinism and errors

Person results are sorted by canonical name and stable ID. Events are sorted by their earliest supported date, with unknown dates last. Missing IDs return `undefined` or an empty result as appropriate. `peopleAliveInYear` throws `RangeError` unless the year is an integer from 1 through 9999.

The factory assumes a structurally valid graph. Run `validateGenealogyGraph` when accepting new or external graph data; query utilities do not repair invalid references or settle genealogical conflicts.

## Person-detail view model

`buildPersonDetailModel(graph, personId, queries?)` in `src/lib/genealogy/person-detail.ts` is the framework-independent adapter used by the C12 person Sheet/Drawer. It composes the public query methods without copying genealogy into a component. The model includes supported direct relatives, event-associated places, confidence, de-duplicated source count, lifespan alternatives, a concise event-backed biography, and every shortest relationship path.

`relationshipPathToMichael` returns paths in traversal order from the requested person to the configured focal person. The person-detail adapter reverses that presentation order so the UI reads from Michael outward—such as Michael → Paulette → Rita—while retaining the exact canonical relationship IDs and weakest-edge confidence. Neither the adapter nor the UI hard-codes a family chain.

## Full person-profile view model

`buildPersonProfileModel(graph, personId, queries?)` in `src/lib/genealogy/person-profile.ts` extends the compact C12 detail model for full profiles. It groups each accepted person’s event-linked places without increasing their precision, retains migration-origin and migration-destination roles, provides the complete uncertainty-aware event timeline, resolves related event participants, and carries the de-duplicated source-support routes returned by `sourcesSupportingPerson`.

The model also creates a presentation ledger of explicit normalized research flags: probable or unresolved relationship/event claims, unknown event dates, unresolved alternate-name forms, source contradiction notes, and relevant person notes. These flags are views of existing normalized fields, not newly normalized research questions. An absent branch never creates a flag, and runtime code does not read `research/open-questions.md`.
