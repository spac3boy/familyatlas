# Application data

This directory contains normalized, typed data consumed by the Family Atlas application. `family-graph.ts` is the single application-facing graph. The C5 dataset contains the reviewed seven-person foundation plus 50 sufficiently established deeper direct ancestors: 28 maternal and 22 paternal.

The application must not parse or scrape prose from `research/` at runtime. The modules under `foundation/` and `ancestry/` are reviewed transformations from the human-readable archive and retain source and research-packet references. `ancestry/maternal/` and `ancestry/paternal/` preserve the branch boundary; `ancestry/places.ts` holds the additional shared place inventory.

Unknown facts are absent or represented with an explicit `HistoricalDate` of `unknown`. A supported month-only date is represented as its full possible calendar range with the original wording retained; it is never converted to an invented day.

No spouse or partner relationship is present for Aubin Buquet and Paulette Comeaux. The archive supports co-parenthood but does not establish their relationship status.

Rejected candidates, unattached identities, contextual people, and collateral-only relatives are not accepted family members. Uncertain parentage remains `unknown`; alternate historical claims remain separate or retain their original wording rather than being silently reconciled.

The current graph has 57 people, 82 relationships, 120 events, 38 places, and 53 sources. Run `npm test` for reference and lineage safeguards; `src/lib/genealogy/audit.ts` adds chronology, cycle, orphan, likely-duplicate, and contradictory-claim checks.

`familyGraphQueries` is the pre-bound, read-only public query surface for this graph. Its framework-independent factory and uncertainty behavior are documented in `docs/genealogy-queries.md`.
