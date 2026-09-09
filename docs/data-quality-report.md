# Data quality report

**Baseline audit date:** 2026-09-05

**Extended-family regression audit:** 2026-09-08

**Genealogy, provenance, privacy, and integrity audit:** 2026-09-09

**Current scope:** the canonical application graph after C24, including accepted direct ancestry, immediate family, parental sibling groups, and nine family-confirmed first cousins

## C24 result

The C24 graph passes the structural and genealogy-specific audit with **0 errors, 3 expected warnings, and 0 informational findings**. The warnings remain the three intentionally preserved historical birth conflicts described below.

| Entity | Count |
|---|---:|
| People | 83 |
| Relationships | 119 |
| Parent-child relationships | 88 |
| Spouse relationships | 28 |
| Partner relationships | 3 |
| Events | 125 |
| Places | 38 |
| Sources | 60 |

C24 adds no people, relationships, events, or places. It adds one family-provided source and applies Michael's direct family confirmation to 21 existing parent-child claims: 12 edges forming the two parental sibling groups and 9 aunt/uncle-to-cousin edges. All 21 retain their prior `documented` provenance, including notes where documentary support is indirect. The resulting graph has 57 verified and 62 probable relationships; 37 relationships are family-confirmed, and 25 carry both family-confirmed and documented provenance.

The audit also repaired three research-reference ownership errors. The Jules Comeaux→Allen Comeaux, Joesette R. Comeaux→Allen Comeaux, and Jules Comeaux–Joesette relationship claims now point to `research/people/allen-comeaux.md`, where their cited original claim IDs actually occur, rather than to Rita's packet.

Current relationship derivation is evidence-safe:

- two paternal and four maternal aunt/uncle identities derive from shared parent-child edges;
- all nine first cousins derive through four parent-child edges, with no direct aunt, uncle, sibling, or cousin relationship type;
- Sidney Paul Roger remains Michael's maternal sibling through Paulette and is not a cousin;
- Lauren Dugas and Collin Adkisson remain research-only names with no canonical people, relationships, placement, or planned addition;
- Richard Russell McRae's documented father edges remain independent and do not create a Cathy–Richard spouse claim;
- `parentage: "unknown"` remains on the newly confirmed roles, so family confirmation is not presented as proof of biological, adoptive, or legal subtype;
- Priscilla's two spouse reports, Rhyan/Ryan name forms, and distant ancestral claims retain their prior uncertainty.

No privacy-sensitive canonical data required removal. Living close-family birth events remain year-only where intentionally published, while lateral living relatives retain no exact birth dates, addresses, phone numbers, email addresses, contact details, or sparse-location-derived journeys.

## C5 baseline result

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

## C20E extended-family regression audit (historical pre-C24 snapshot)

> The confidence and provenance statements in this section record the graph as audited on 8 September 2026. The C24 result above supersedes its documentary-only treatment of the 21 later-confirmed close-family relationship roles; all other safeguards remain current.

The expanded graph passes runtime validation and the genealogy-specific audit with **0 errors, 3 expected warnings, and 0 informational findings**. The warnings remain the same intentionally preserved C5 birth conflicts; lateral-family normalization introduced no new chronology, ancestry-cycle, duplicate-ID, or likely-duplicate warning.

C20E graph totals:

| Entity | Count |
|---|---:|
| People | 83 |
| Relationships | 119 |
| Parent-child relationships | 88 |
| Spouse relationships | 28 |
| Partner relationships | 3 |
| Events | 125 |
| Places | 38 |
| Sources | 59 |

### Relationship derivation

| Check | Result | Notes |
|---|---|---|
| Paternal aunts/uncles | Pass — 2 | Cathy B. McRae and Michael Buquet derive as Aubin's siblings through Edmond P. Buquet and Verna Arlene Bakke Buquet. |
| Maternal aunts/uncles | Pass — 4 | Russell J. Comeaux, Allen Paul Comeaux Jr., Peggy C. Miller, and Priscilla C. Babineaux derive as Paulette's siblings through Allen Paul Comeaux Sr. and Rita LeBlanc Comeaux. |
| Michael's siblings | Pass — 3 | Sidney shares the recorded Paulette edge; Edmond “Bud” and Gina share the recorded Aubin and Paulette edges. No sibling edge exists. |
| First-cousin candidates | Pass — 9 | Every candidate derives through four parent-child edges. No cousin edge exists. All nine paths remain probable because their aunt/uncle→child edge is probable. |
| Branch classification | Pass | Sidney is maternal from his shared Paulette edge; Edmond and Gina are both; cousins follow their supported maternal or paternal collateral paths. |
| Parentage specificity | Pass | Parent-child roles remain `parentage: "unknown"`; shared-parent topology is not presented as proof of biological, adoptive, or legal parentage. |

The nine probable cousin-parent edges are:

- Cathy B. McRae → Paige Bartholomew
- Cathy B. McRae → Sean “Rusty” McRae
- Peggy C. Miller → Conrad Miller
- Russell J. Comeaux → Rustie Lynn Comeaux
- Russell J. Comeaux → Rhyan Comeaux
- Priscilla C. Babineaux → Dexter Babineaux
- Allen Paul Comeaux Jr. → Gerard Comeaux
- Allen Paul Comeaux Jr. → Casey Comeaux
- Allen Paul Comeaux Jr. → Brandi Comeaux

Each remains probable with documented provenance and no `family-confirmed` provenance. Richard Russell McRae's separate father edges to Paige and Sean remain verified/documented. Immediate-family and sibling edges explicitly confirmed by Michael remain verified/family-confirmed; the audit did not downgrade them or use them to upgrade unrelated documentary claims.

### Identity and blended-family safeguards

- `Sid Roger` resolves only to canonical sibling `person-sidney-paul-roger`; he is not returned by first-cousin derivation.
- Michael's statement that Sidney shares Paulette with him and has a different father is preserved. The father remains unnamed and unmodeled, and the Paulette parent-child edge retains an unknown biological/adoptive/legal subtype.
- `Rhyan Comeaux` remains one canonical person. `Ryan Comeaux` and `Ryan Earl Comeaux` remain unresolved alternate source forms rather than duplicate people or a silently proved merge.
- Priscilla C. Babineaux remains one canonical person with `Priscilla LeBlanc` preserved as a conflicting source form. Karlon and Tippy LeBlanc remain separate probable spouse identities, and neither is assigned as Dexter's father.
- Lauren Dugas and Collin Adkisson remain outside the accepted graph and are not returned as first cousins.

### UI and visualization audit

- The daughter-centered Tree contains all 83 accepted people once and renders only canonical relationship edges. Its selected-person ancestry mode remains ancestor-focused, so the wider lateral graph does not replace the readable ancestry projection.
- People directory branch membership now includes Michael's shared-parent sibling context. Sibling and aunt/uncle labels are graph-derived instead of generic distance labels.
- The directory now presents relationship-path confidence separately from person confidence. A verified cousin identity therefore does not hide a probable cousin path; verified path marks remain quiet until Evidence Mode.
- Search resolves all nine cousin records and supported alternate forms to stable person routes. Every extended-family profile builds successfully.
- Evidence Mode retains the confidence and provenance of individual edges. Family confirmation does not propagate across a path or overwrite probable cousin parentage.
- Sparse cousin records produce no Timeline lifespan rows and no Journeys points or movement paths because no dated life bounds or normalized locations exist for them.

### Privacy audit

No newly exposed sensitive field required removal. The accepted public graph already withheld exact living-person birth dates and contains no street address, phone number, email address, or public-record contact detail for the audited relatives.

Regression coverage now enforces:

- year-only dates for the few living immediate relatives whose birth years are intentionally public;
- no exact dates or normalized locations for the audited sibling, aunt/uncle, and cousin records beyond those reviewed year-only exceptions;
- no URL or citation-handle publication from the McRae public-record association set;
- no synthesized Timeline lifespan or Journeys movement for sparse cousin records.

## Validation commands

```text
npm run type-check
npm test
npm run lint
npm run build
```

The final command results are recorded in `docs/STATUS.md`.
