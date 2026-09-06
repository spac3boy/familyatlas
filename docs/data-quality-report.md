# C5 data quality report

**Audit date:** 2026-09-05  
**Scope:** the canonical application graph after normalization of the accepted direct maternal and paternal ancestry documented in the completed research archive

## Result

The C5 graph passes structural and genealogy-specific integrity checks with **0 errors, 3 expected warnings, and 0 informational findings**. The warnings are retained contradictory birth alternatives; they are evidence-preservation signals, not normalization defects.

The normalized graph now contains:

| Entity | Count |
|---|---:|
| People | 57 |
| Foundation people | 7 |
| Deeper maternal ancestors | 28 |
| Deeper paternal ancestors | 22 |
| Relationships | 82 |
| Parent-child relationships | 56 |
| Spouse relationships | 23 |
| Partner relationships | 3 |
| Events | 120 |
| Places | 38 |
| Sources | 53 |

Every one of the 50 newly normalized deeper ancestors has an accepted parent-child path to Michael Buquet. The graph does not admit collateral-only people, contextual people, unattached identities, research-only candidates, or rejected candidates as family members.

## Normalization boundary

The maternal and paternal branch coverage audits were used as the inclusion ledger. A person was added only when the archive represented that person as a sufficiently established direct ancestor. Similar names were not used as merge evidence.

Not normalized as accepted family members:

- rejected candidate identities and rejected place hypotheses;
- unattached and research-only candidate identities;
- collateral relatives and descendants who are not part of Michael's direct ancestral chain;
- contextual people who occur only in source or historical background;
- unnamed parents, spouses, and other relatives;
- a proposed couple edge where the archive did not establish spouse or partner status.

Parent-child edges use `parentage: "unknown"` unless the research independently established a biological, adoptive, step, or social subtype. This preserves the relationship evidence without silently claiming a more specific kind of parentage.

## Integrity audit

| Check | Result | Notes |
|---|---|---|
| Orphan IDs | Pass | No accepted person lacks a relationship edge; no place is unused by an event, movement, or place hierarchy; no source is uncited by normalized evidence. |
| Invalid references | Pass | Person, relationship, event, place, source, alias, movement-endpoint, and parent-place references resolve. |
| Self relationships | Pass | No person is related to themself. |
| Duplicate IDs | Pass | No duplicate canonical IDs or alias collisions were found. |
| Likely duplicate identities | Pass with safeguards | No unresolved likely duplicate was found by the normalized-name and ancestry-separation audit. Known similar-name cases remain separate as described below. |
| Missing source references | Pass | Every evidence-bearing entity has a source reference, all references resolve, and all 53 normalized source records are used. |
| Chronology anomalies | Pass | No event-before-birth, event-after-death, death-before-birth, or extreme parent-age anomaly was determinable from the retained date bounds. |
| Impossible parent chronology | Pass | No parent is necessarily born after a child, younger than 12 at a child's birth, or dead more than one year before every possible child-birth date. |
| Circular ancestry | Pass | No accepted person is their own ancestor. |
| Contradictory claims | 3 warnings | Non-overlapping birth alternatives for Joesette R. Comeaux, Oscar Paul Bakke, and Martin H. Bakke remain explicit. |

The structural checks are provided by `validateGenealogyGraph`; the genealogy-specific checks are provided by `auditGenealogyGraph`. These checks detect data-shape and bounded chronology problems. They do not prove that a historical identity or conclusion is genealogically correct.

## Preserved contradictory birth claims

### Joesette R. Comeaux

- `event-joesette-r-birth-census-estimate`
- `event-joesette-r-birth-cemetery-alternative`

The census-derived estimate and cemetery alternative do not overlap. Both remain present with their own evidence and confidence.

### Oscar Paul Bakke

- `event-oscar-bakke-birth-preferred`
- `event-oscar-bakke-birth-alternative`

The preferred 1884 claim and unresolved 1885 alternative remain distinct.

### Martin H. Bakke

- `event-martin-bakke-birth-preferred`
- `event-martin-bakke-birth-1853-alternative`
- `event-martin-bakke-birth-1855-alternative`

The preferred 1854 claim and unresolved 1853 and 1855 alternatives remain distinct.

## Other uncertainty deliberately retained

Some alternatives overlap when expressed as bounded historical dates and therefore do not trigger the non-overlap warning. They remain visible in the graph through `originalText`, confidence, notes, or separate events, including:

- Olava Olausdatter Dukleth: about 1853 or 1855;
- Céleste Dugas: 1778 or 1779;
- Claude Dugas (earliest normalized generation): circa 1649 or 1652;
- Abraham Dugas: death reported as 1698 or before 1700;
- François Michel Jacques Buquet: birth reported as about 1785/1786;
- Marie Emma Boudreaux: the possible `Josephine Boudreaux` identity equation remains unresolved and is not stored as an alternate name.

No inferred route, exact place, exact date, or relationship subtype was created to eliminate these uncertainties.

## Identity and merge safeguards

- The three accepted people canonically named Claude Dugas retain separate stable IDs for their distinct generations.
- Aubin Buquet and Aubin Vincent Buquet remain separate people.
- Marcel Dugas and Marcellin Dugas remain separate people.
- Céleste Dugas and Céleste Félonise LeBlanc remain separate people.
- Similar Comeaux, LeBlanc, Buquet, Bakke, and Norwegian name forms remain separate unless the archive explicitly establishes an alternate-name relationship.
- `Joesette R.` and `Mrs. Jules Comeaux` are preserved as source forms for one archive-established identity; the given-name expansion is not invented.
- Rejected and unattached candidate IDs are absent from accepted people and relationships.

## Remaining quality limits

- The normalized graph represents accepted direct ancestry, not every person mentioned in the research archive.
- Many people have partial event coverage because the archive establishes lineage more strongly than complete biography.
- Some source entries represent inspected transcriptions, search snippets, indexes, family statements, or research synthesis rather than directly inspected original record images; inspection status remains explicit.
- Absence of an automated chronology warning can mean the dates are too broad or unknown to determine impossibility.
- The research archive remains the authority for reasoning, rejected identities, exhausted searches, and full source context. Application data must not replace or rewrite that evidence trail.

## Validation commands

```text
npm run type-check
npm test
npm run lint
npm run build
```

The final command results are recorded in `docs/STATUS.md`.
