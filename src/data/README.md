# Application data

This directory contains normalized, typed data consumed by the Family Atlas application. `family-graph.ts` composes the single application-facing graph from the reviewed foundation and maternal/paternal ancestry modules.

The application must not parse or scrape prose from `research/` at runtime. The modules under `foundation/` and `ancestry/` are reviewed transformations from the human-readable archive and retain source and research-packet references. `ancestry/maternal/` and `ancestry/paternal/` preserve the branch boundary; `ancestry/places.ts` holds the additional shared place inventory.

Unknown facts are absent or represented with an explicit `HistoricalDate` of `unknown`. A supported month-only date is represented as its full possible calendar range with the original wording retained; it is never converted to an invented day.

No spouse or partner relationship is present for Aubin Buquet and Paulette Comeaux. The archive supports co-parenthood but does not establish their relationship status.

Rejected candidates, unattached identities, contextual people, and collateral-only relatives are not accepted family members. Uncertain parentage remains `unknown`; alternate historical claims remain separate or retain their original wording rather than being silently reconciled.

The current graph has 83 people, 119 relationships, 125 events, 38 places, and 60 sources. Its exported value contains ordinary readonly objects, arrays, strings, numbers, booleans, and absent optional fields, so it survives a JSON serialization round trip without a provider-specific decoder. Run `npm test` for reference, portability, and lineage safeguards; `src/lib/genealogy/audit.ts` adds chronology, cycle, orphan, likely-duplicate, and contradictory-claim checks.

`familyGraphQueries` is the pre-bound, read-only public query surface for this graph. Its framework-independent factory and uncertainty behavior are documented in `docs/genealogy-queries.md`.
