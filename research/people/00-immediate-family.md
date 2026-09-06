# Immediate-family foundation

## Packet metadata

- **Packet status:** reviewed
- **Last reviewed:** 2026-09-04
- **Scope:** Michael Buquet, his parents, and his four grandparents
- **Evidence boundary:** This packet uses explicit family information supplied by Michael in the current task and the original Family History project chats, plus research results preserved in those chats. It does not use new internet research. The original research messages expose internal citation handles but usually not their destination URLs.
- **Source chats reviewed:** `Explain Surname History` (`6a89bd6f-ac54-83ea-b46b-e1868c2089ba`, relevant material across both history pages) and `Continue Rita Research` (`6a9af740-124c-83ea-8fa8-f79c259cff72`, all three turns)

## Immediate-family structure

```text
Michael Buquet
├── father: Aubin Buquet
│   ├── father: Edmond P. Buquet
│   └── mother: Verna Arlene Bakke Buquet
└── mother: Paulette Comeaux
    ├── mother: Rita LeBlanc
    └── father: Allen Comeaux
```

The diagram expresses the parent/grandparent structure supplied by Michael. It does **not** assert that Aubin and Paulette were married, nor does it imply dates or legal relationship types that were not provided.

## Person: Michael Buquet

### Identity

- **Stable person ID:** `person-michael-buquet`
- **Canonical name:** Michael Buquet
- **Alternate names/spellings:** Not found
- **Maiden/birth surname:** Buquet, supplied by Michael through his name
- **Relationship to Michael Buquet:** Self
- **Identity confidence:** verified
- **Identity rationale:** Michael identifies himself by this name in the task context; the researched obituary for Rita also names a Michael Buquet among her grandchildren.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-michael-buquet-001` | Birth | unknown | unknown | unresolved | `SRC-A1-FAMILY-CURRENT` | No date or birthplace was supplied or found |

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-michael-buquet-002` | child of | `person-aubin-buquet`, Aubin Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN` | Explicit family-provided information; no direct birth record was reviewed |
| `claim-michael-buquet-003` | child of | `person-paulette-comeaux`, Paulette Comeaux | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-RITA-OBIT` | Family supplied; Rita's obituary independently places Michael and Paulette in the same descendant group but does not state this exact link |
| `claim-michael-buquet-004` | grandchild of | `person-edmond-p-buquet-1919`, Edmond P. Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN` | Family supplied; depends on the Aubin parent-child link |
| `claim-michael-buquet-005` | grandchild of | `person-verna-arlene-bakke`, Verna Arlene Bakke Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-VERNA-OBIT` | Family supplied; Verna's obituary was used in the project to identify her family, but the chat excerpt does not expose the full descendant wording |
| `claim-michael-buquet-006` | grandchild of | `person-rita-leblanc-1928`, Rita LeBlanc | verified | `SRC-A1-RITA-OBIT` | Rita's obituary names Michael among her grandchildren |
| `claim-michael-buquet-007` | grandchild of | `person-allen-comeaux-1925`, Allen Paul Comeaux Sr. | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-ALLEN-TREE`, `SRC-A1-RITA-OBIT` | Family supplied and consistent with the researched Allen/Rita family; no direct record states the complete link |

### Residences, census, marriages, occupations, migrations, military, and burial

Not found or not researched for this packet.

### Biographical narrative

Michael is the reference person for this archive. The parent and grandparent structure is supplied directly by him. This packet does not add personal dates, places, occupation, marriage, military, or burial facts.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Birth date and birthplace | requires family knowledge | Not supplied or researched | Michael's own information or vital record |
| Independent proof of each parent-child link | requires family knowledge | A1 intentionally relies on supplied family information where direct records are absent | Family records or birth certificate if later desired |

## Person: Aubin Buquet

### Identity

- **Stable person ID:** `person-aubin-buquet`
- **Canonical name:** Aubin Buquet
- **Alternate names/spellings:** Not found for Michael's father
- **Maiden/birth surname:** Buquet
- **Relationship to Michael Buquet:** Father
- **Identity confidence:** probable
- **Identity rationale:** Michael explicitly identifies Aubin as his father. Public biographical records for Michael's sister Gina identify her parents as Aubin Buquet and Paulette Comeaux/Paulette Wheeler, independently corroborating the immediate family constellation, but they do not directly prove Michael's parentage.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-aubin-buquet-001` | Birth | unknown | unknown | unresolved | `SRC-A1-FAMILY-CURRENT` | No date or birthplace was supplied or established |

### Names

The project contains an older ancestor named **Aubin Vincent Buquet (1887–1953)**. That person is not Michael's father. The shared given name creates a future record-matching risk; their stable IDs must remain distinct.

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-aubin-buquet-002` | parent of | `person-michael-buquet`, Michael Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN` | Family supplied |
| `claim-aubin-buquet-003` | child of | `person-edmond-p-buquet-1919`, Edmond P. Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN` | Family supplied; no direct birth record reviewed |
| `claim-aubin-buquet-004` | child of | `person-verna-arlene-bakke`, Verna Arlene Bakke Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-VERNA-OBIT` | Family supplied and consistent with the obituary research |
| `claim-aubin-buquet-005` | co-parent with | `person-paulette-comeaux`, Paulette Comeaux | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-GINA-BIOS` | Michael supplies both as his parents; Gina's two biographies name them as her parents |

### Marriages and partnerships

| Claim ID | Spouse/partner ID and name | Date | Place | Relationship type | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-aubin-buquet-006` | `person-paulette-comeaux`, Paulette Comeaux | unknown | unknown | unresolved | unresolved | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-GINA-BIOS` | They are supported as co-parents; marital or partnership status was not established and must not be inferred |

### Residences, census, occupations, migrations, military, and burial

Not found or not established for this packet. A cited Lafayette record uses the form “Paulette Comeaux Buquet,” but that does not establish Aubin's residence.

### Biographical narrative

Aubin is identified by Michael as his father and as the son of Edmond and Verna. The project research independently places an Aubin Buquet and Paulette Comeaux/Paulette Wheeler together as parents in Gina's biographies. No dates, places, occupation, military information, or marriage facts for this Aubin were established.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Birth information and places | requires family knowledge | Not supplied or researched | Family information or vital record |
| Exact relationship status with Paulette | requires family knowledge | Co-parenthood does not prove marriage | Family information or marriage record |
| Middle name or initial | genuinely unknown | None was supplied or securely found | Family record |

## Person: Paulette Comeaux

### Identity

- **Stable person ID:** `person-paulette-comeaux`
- **Canonical name:** Paulette Comeaux
- **Alternate names/spellings:** Paulette Comeaux Buquet; Paulette Wheeler; Paulette Comeaux Wheeler; family message spelled her locality “Carenco”
- **Maiden/birth surname:** Comeaux — supplied by Michael and supported by public biographical/reference forms
- **Relationship to Michael Buquet:** Mother
- **Identity confidence:** probable
- **Identity rationale:** Michael explicitly identifies Paulette as his mother. Gina's Wayne State biography names Aubin Buquet and Paulette Comeaux as her parents; a later Mercyhurst biography uses Paulette Wheeler, and a Lafayette record uses Paulette Comeaux Buquet. Rita's obituary independently names Paulette among Rita's children.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-paulette-comeaux-001` | Birth | unknown | Carencro, Louisiana, possibly origin rather than exact birthplace | probable | `SRC-A1-FAMILY-EXPLAIN` | Michael said she is “from Carenco, LA”; do not convert this to an exact birthplace |

### Names

| Name form | Confidence | Evidence/source IDs | Limitation |
|---|---|---|---|
| Paulette Comeaux | verified as a used name | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-GINA-BIOS` | Family-supplied canonical form |
| Paulette Comeaux Buquet | verified as a recorded form | `SRC-A1-PAULETTE-LAFAYETTE` | The record type and URL are not exposed in the chat |
| Paulette Wheeler | verified as a recorded form | `SRC-A1-GINA-BIOS` | A biography uses this form; cause/timing of surname change is not established |
| Paulette Comeaux Wheeler | verified as an obituary form | `SRC-A1-RITA-OBIT` | Does not by itself define birth surname or complete marital history |

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-paulette-comeaux-002` | parent of | `person-michael-buquet`, Michael Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-RITA-OBIT` | Family supplied; obituary corroborates the family group but not the exact link |
| `claim-paulette-comeaux-003` | child of | `person-rita-leblanc-1928`, Rita LeBlanc | verified | `SRC-A1-RITA-OBIT` | Rita's obituary explicitly includes Paulette among her daughters |
| `claim-paulette-comeaux-004` | child of | `person-allen-comeaux-1925`, Allen Paul Comeaux Sr. | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-ALLEN-TREE`, `SRC-A1-RITA-OBIT` | Family supplied and consistent with the researched couple/children; no direct birth record reviewed |
| `claim-paulette-comeaux-005` | co-parent with | `person-aubin-buquet`, Aubin Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-GINA-BIOS` | Co-parenthood supported; marriage not established |

### Residences and migration

| Claim ID | Date | Place | Record/household | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-paulette-comeaux-006` | unknown | Carencro, Lafayette Parish, Louisiana | Family statement: “from Carenco, LA” | probable | `SRC-A1-FAMILY-EXPLAIN` | Association only; exact residence dates and birthplace unresolved |

No migration route is asserted.

### Marriages, occupations, military, and burial

Marital history is unresolved. The surnames Buquet and Wheeler are recorded forms but are not used here to infer dates or legal relationships. Occupation, military information, and burial information were not found or not applicable in the reviewed research.

### Biographical narrative

Paulette is Michael's family-identified mother, originally identified to the project as Paulette Comeaux from Carencro. Independent records cited in the chats corroborate her Comeaux, Buquet, and Wheeler name forms and her place in Rita's family. Her dates, exact birthplace, residence timeline, and marital history remain unresolved.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Birth date and exact birthplace | requires family knowledge | Not supplied; “from Carencro” is not necessarily birthplace | Family information or vital record |
| Meaning and chronology of Buquet/Wheeler surnames | requires family knowledge | Records show forms but not transitions | Family information and marriage records |
| Direct documentary link to Allen | likely requires archive/local records | Rita obituary proves maternity; Allen link is family-supplied/convergent | Birth or baptism record |

## Person: Edmond P. Buquet

### Identity

- **Stable person ID:** `person-edmond-p-buquet-1919`
- **Canonical name:** Edmond P. Buquet
- **Alternate names/spellings:** Edmond “Bud” Buquet; one family message used Edmund Buquet
- **Maiden/birth surname:** Buquet
- **Relationship to Michael Buquet:** Paternal grandfather
- **Identity confidence:** verified
- **Identity rationale:** Michael supplied Edmond Buquet from Dulac, then explicitly confirmed the researched 16 February 1919–November 1986 Houma record as definitely his grandfather. Eve Marie Buquet's obituary independently places Edmond P. in the researched Aubin V./Lena Maronge sibling group, and Verna's obituary names Edmond “Bud” Buquet as her husband.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-edmond-buquet-001` | Birth | 16 February 1919 | unknown | verified | `SRC-A1-EDMOND-INDEX`, `SRC-A1-FAMILY-EXPLAIN` | Michael confirmed the identity match; birthplace was not established |
| `claim-edmond-buquet-002` | Death | November 1986 | unknown | verified | `SRC-A1-EDMOND-INDEX`, `SRC-A1-FAMILY-EXPLAIN` | Exact day and death place unresolved |

### Names

- **Edmond P. Buquet** is independently supported by the genealogy record and Eve's obituary.
- **Edmond “Bud” Buquet** is used in Verna's obituary.
- **Edmund Buquet** appears once in Michael's message introducing Verna. Because Michael otherwise uses Edmond and independent records use Edmond, `Edmond` is canonical; `Edmund` is retained as a family-message spelling discrepancy.

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-edmond-buquet-003` | spouse of | `person-verna-arlene-bakke`, Verna Arlene Bakke Buquet | verified | `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-VERNA-OBIT` | Family supplied and obituary-confirmed |
| `claim-edmond-buquet-004` | parent of | `person-aubin-buquet`, Aubin Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN` | Family supplied; no direct record reviewed in A1 |
| `claim-edmond-buquet-005` | child of | Aubin Vincent Buquet | verified | `SRC-A1-EVE-OBIT`, `SRC-A1-FAMILY-EXPLAIN` | Eve's obituary names their parents and Edmond among her brothers |
| `claim-edmond-buquet-006` | child of | Lena Maronge Buquet | verified | `SRC-A1-EVE-OBIT`, `SRC-A1-FAMILY-EXPLAIN` | Same obituary evidence |

### Residences and census appearances

| Claim ID | Date | Place | Record/household | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-edmond-buquet-007` | unspecified | Dulac, Terrebonne Parish, Louisiana | Michael said Edmond was from Dulac | probable | `SRC-A1-FAMILY-EXPLAIN` | Do not convert to birthplace |
| `claim-edmond-buquet-008` | at death-index endpoint, 1986 | Houma, Terrebonne Parish, Louisiana | Last residence in genealogy/death-derived record | verified | `SRC-A1-EDMOND-INDEX` | Last residence is not necessarily death place |

No census appearance was identified in the A1 source material.

### Marriages and partnerships

| Claim ID | Spouse/partner ID and name | Date | Place | Relationship type | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-edmond-buquet-009` | `person-verna-arlene-bakke`, Verna Arlene Bakke Buquet | unknown | unknown | spouse | verified | `SRC-A1-VERNA-OBIT` | Marriage date/place not found |

### Occupations and activities

Not found for Edmond. Research about Buquet Canning Company principally concerns his father Aubin Vincent and siblings; it must not be transferred to Edmond without a source.

### Migration and movement

| Claim ID | Classification | From | To | Date/range | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-edmond-buquet-010` | locations at different dates | Dulac | Houma | unknown to 1986 | probable | `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-EDMOND-INDEX` | No source states a move or route; both are within Terrebonne Parish |

### Military and burial information

Not found. Military records for other Buquet relatives must not be assigned to Edmond.

### Biographical narrative

Edmond P. “Bud” Buquet is Michael's confirmed paternal grandfather. Michael associated him with Dulac and supplied that he spoke Cajun French; research located a matching man born in 1919 with a last residence in Houma and linked him through an obituary to Aubin Vincent and Lena Maronge Buquet. Edmond's own occupation, military history, exact death day/place, burial, and detailed residence timeline were not established in A1.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Birthplace, exact death day/place, and burial | potentially answerable online | Matching index lacks complete details in recovered chat | Obituary, death certificate, cemetery record |
| Marriage date/place with Verna | likely requires archive/local records | Obituary establishes relationship, not event details | Civil or church marriage record |
| Meaning of middle initial P | genuinely unknown | No expansion was located | Birth/baptism record |
| Occupation and military service | genuinely unknown | No supporting record was found | Census, obituary, personnel, or employment records |

## Person: Verna Arlene Bakke Buquet

### Identity

- **Stable person ID:** `person-verna-arlene-bakke`
- **Canonical name:** Verna Arlene Bakke Buquet
- **Alternate names/spellings:** Verna Arlene Bakke; Verna Buquet; Verna B. Buquet
- **Maiden/birth surname:** Bakke
- **Relationship to Michael Buquet:** Paternal grandmother
- **Identity confidence:** verified
- **Identity rationale:** Michael supplied Verna Buquet from Spring Grove and stated Buquet was her married name. Her obituary independently gives the full name, dates, Spring Grove birth, husband, and parents.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-verna-bakke-001` | Birth | 18 January 1921 | Spring Grove, Minnesota | verified | `SRC-A1-VERNA-OBIT` | Obituary evidence |
| `claim-verna-bakke-002` | Death | 14 January 2021 | unknown | verified | `SRC-A1-VERNA-OBIT` | Chat excerpt does not state death place |

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-verna-bakke-003` | spouse of | `person-edmond-p-buquet-1919`, Edmond “Bud” Buquet | verified | `SRC-A1-VERNA-OBIT`, `SRC-A1-FAMILY-EXPLAIN` | Independently confirmed |
| `claim-verna-bakke-004` | parent of | `person-aubin-buquet`, Aubin Buquet | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-FAMILY-EXPLAIN`, `SRC-A1-VERNA-OBIT` | Family supplied and consistent with obituary research; full descendant wording was not exposed in the chat excerpt |
| `claim-verna-bakke-005` | child of | Oscar Bakke | verified | `SRC-A1-VERNA-OBIT` | Obituary evidence |
| `claim-verna-bakke-006` | child of | Olga Doely Bakke | verified | `SRC-A1-VERNA-OBIT` | Obituary evidence |

### Residences and census appearances

| Claim ID | Date | Place | Record/household | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-verna-bakke-007` | 1921 | Spring Grove, Minnesota | Birthplace in obituary | verified | `SRC-A1-VERNA-OBIT` | Exact address unknown |

No census appearance or later residence interval for Verna was captured in the reviewed chat text.

### Marriages and partnerships

| Claim ID | Spouse/partner ID and name | Date | Place | Relationship type | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-verna-bakke-008` | `person-edmond-p-buquet-1919`, Edmond P. “Bud” Buquet | unknown | unknown | spouse | verified | `SRC-A1-VERNA-OBIT` | Marriage event details unresolved |

### Occupations and activities

| Claim ID | Occupation/activity | Date range | Place/employer | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-verna-bakke-009` | Registered nurse | during World War II, exact dates unknown | U.S. Navy | verified | `SRC-A1-VERNA-OBIT`, `SRC-A1-VERNA-VETERAN` | Station and unit not found |

### Migration and movement

Unresolved. The project established Spring Grove as her birthplace and her marriage to a Louisiana resident, but the reviewed chat text did not document when, how, or by what route she moved to Louisiana. No migration event is created.

### Military information

| Claim ID | Branch/service | Rank | Unit/station | Date/range | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-verna-bakke-010` | United States Navy | Lieutenant (LT) | unknown | World War II | verified | `SRC-A1-VERNA-OBIT`, `SRC-A1-VERNA-VETERAN` | Obituary confirms Navy nurse; veterans-burial index supplies rank; service dates and station unresolved |

### Burial information

The project referenced a veterans burial record but the recovered chat text does not state cemetery, locality, burial date, or plot. These remain unresolved.

### Biographical narrative

Verna Arlene Bakke was born in Spring Grove, Minnesota, and later used the married surname Buquet. Her obituary identifies Edmond “Bud” Buquet as her husband and Oscar and Olga Doely Bakke as her parents. She was a registered nurse and served as a U.S. Navy lieutenant during World War II. Her exact movement to Louisiana, marriage details, service station, and burial location are not supplied in this packet.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Marriage date/place | likely requires archive/local records | Not in chat excerpt | Civil/church marriage record |
| Move from Minnesota to Louisiana | requires family knowledge | Endpoints do not document movement | Family account, directories, service and marriage records |
| Navy dates, unit, and station | likely requires archive/local records | Only branch/rank/role/war are known | Official military personnel file |
| Death place and burial details | potentially answerable online | Not exposed in recovered chat text | Full obituary and veterans cemetery record |

## Person: Rita LeBlanc

### Identity

- **Stable person ID:** `person-rita-leblanc-1928`
- **Canonical name:** Rita LeBlanc
- **Alternate names/spellings:** Rita Leblanc; Rita LeBlanc Comeaux; Rita M. LeBlanc in a compiled Ancestry result
- **Maiden/birth surname:** LeBlanc
- **Relationship to Michael Buquet:** Maternal grandmother
- **Identity confidence:** verified
- **Identity rationale:** Michael supplied Rita LeBlanc from St. Landry Parish. Her obituary independently provides exact dates, Cankton/Carencro associations, parents, children, burial, and Michael among her grandchildren.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-rita-leblanc-001` | Birth | 20 April 1928 | Cankton, Louisiana | verified | `SRC-A1-RITA-OBIT` | Obituary calls her a native of Cankton |
| `claim-rita-leblanc-002` | Death | 13 February 2017 | unknown | verified | `SRC-A1-RITA-OBIT` | Age 88; the reviewed chat text did not state the death place |
| `claim-rita-leblanc-003` | Burial | unknown | St. Peter Catholic Cemetery, Carencro | verified | `SRC-A1-RITA-OBIT` | Burial date and plot unknown |

### Names

- `LeBlanc` and `Leblanc` are both used in the project sources.
- `Comeaux` is her married/used surname in the obituary.
- A compiled tree uses `Rita M. LeBlanc`; the initial is not expanded and is not adopted as part of the canonical name.
- Michael said he did not think Rita had a middle name. This family recollection is retained, but it does not prove that the compiled initial is wrong.

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-rita-leblanc-004` | spouse of | `person-allen-comeaux-1925`, Allen Paul Comeaux Sr. | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-ALLEN-TREE`, `SRC-A1-RITA-OBIT` | Family supplied and compiled-tree supported; original marriage record not reviewed |
| `claim-rita-leblanc-005` | parent of | `person-paulette-comeaux`, Paulette Comeaux | verified | `SRC-A1-RITA-OBIT` | Obituary explicitly identifies Paulette among her daughters |
| `claim-rita-leblanc-006` | grandparent of | `person-michael-buquet`, Michael Buquet | verified | `SRC-A1-RITA-OBIT` | Obituary explicitly names Michael among 11 grandchildren |
| `claim-rita-leblanc-007` | child of | Lucuis LeBlanc | verified | `SRC-A1-RITA-OBIT` | Obituary evidence |
| `claim-rita-leblanc-008` | child of | Euchariste Dugas Racca | verified | `SRC-A1-RITA-OBIT` | Obituary evidence; later research rejected Philomene Comeaux as biological mother |

### Residences and census appearances

| Claim ID | Date | Place | Record/household | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-rita-leblanc-009` | 1928 | Cankton, Louisiana | Native/birth association in obituary | verified | `SRC-A1-RITA-OBIT` | Cankton is in St. Landry Parish, consistent with Michael's supplied parish association |
| `claim-rita-leblanc-010` | most of her life through 2017 | Carencro, Louisiana | Obituary residence summary | verified | `SRC-A1-RITA-OBIT` | Exact move date not stated |

No securely identified census appearance for Rita was included in the reviewed chat.

### Marriages and partnerships

| Claim ID | Spouse/partner ID and name | Date | Place | Relationship type | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-rita-leblanc-011` | `person-allen-comeaux-1925`, Allen Paul Comeaux Sr. | unknown | unknown | spouse | probable | `SRC-A1-ALLEN-TREE`, `SRC-A1-FAMILY-CURRENT` | Original Catholic/civil marriage record was not found |

### Occupations, military, and migration

Occupation and military information were not found. Cankton and Carencro are documented locations at different periods, but the exact move and route are not documented; no migration event is asserted.

### Burial information

| Claim ID | Cemetery | Locality | Burial date | Plot/marker | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-rita-leblanc-012` | St. Peter Catholic Cemetery | Carencro, Louisiana | unknown | unknown | verified | `SRC-A1-RITA-OBIT` | Obituary evidence |

### Biographical narrative

Rita LeBlanc Comeaux was born in Cankton in 1928, lived most of her life in Carencro, and died in 2017. Her obituary establishes Paulette as her daughter and Michael as her grandson. Later project research corrected a potential maternal error: Euchariste Dugas Racca was Rita's biological mother, while Philomene Comeaux LeBlanc was her stepmother. A1 does not export Rita's deeper ancestry.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Whether she had a middle name | genuinely unknown | Family recollection says probably none; compiled tree uses an unexplained M. | Baptism or birth record |
| Marriage date/place with Allen | likely requires archive/local records | Original record not found | Catholic/civil marriage record |
| Exact movement from Cankton to Carencro | requires family knowledge | Obituary gives endpoints only | Family account, directories, censuses |

## Person: Allen Comeaux

### Identity

- **Stable person ID:** `person-allen-comeaux-1925`
- **Canonical name:** Allen Paul Comeaux Sr.
- **Alternate names/spellings:** Allen Comeaux; Allen Paul Comeaux; Allen Paul Comeaux Sr.
- **Maiden/birth surname:** Comeaux
- **Relationship to Michael Buquet:** Maternal grandfather
- **Identity confidence:** probable
- **Identity rationale:** Michael supplied Allen Comeaux of Lafayette Parish and expressed doubt that Allen had a middle name. Research strongly matched him to Allen Paul Comeaux Sr., born 27 May 1925, associated with Carencro/Lafayette Parish, and paired with Rita M. LeBlanc in a compiled tree. The identity is strongly supported by converging indexes and family structure, but an original birth or marriage record was not reviewed.

### Vital information

| Claim ID | Event | Date | Place | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-allen-comeaux-001` | Birth | 27 May 1925 | Louisiana | verified | `SRC-A1-ALLEN-DEATH-INDEX` | Multiple Social Security-derived indexes converge; exact locality unknown |
| `claim-allen-comeaux-002` | Death | June 1985 | unknown | verified | `SRC-A1-ALLEN-DEATH-INDEX` | Month/year supported by multiple indexes |
| `claim-allen-comeaux-003` | Death | 1 June 1985 | unknown | probable | `SRC-A1-ALLEN-DEATH-INDEX` | Exact day appears in one index and is weaker than month/year |

### Names

- Michael supplied **Allen Comeaux** and believed he probably had no middle name.
- Research indexes use **Allen Paul Comeaux Sr.**; Rita's obituary names a son **Allen Paul Comeaux Jr.**, an independent family-pattern check.
- Because the direct original record was not reviewed, `Paul` and `Sr.` are retained as **probable identity details**, not treated as family-supplied fact.

### Family relationships

| Claim ID | Relationship | Related person ID and name | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|
| `claim-allen-comeaux-004` | spouse of | `person-rita-leblanc-1928`, Rita LeBlanc | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-ALLEN-TREE` | Original marriage record not found |
| `claim-allen-comeaux-005` | parent of | `person-paulette-comeaux`, Paulette Comeaux | probable | `SRC-A1-FAMILY-CURRENT`, `SRC-A1-ALLEN-TREE`, `SRC-A1-RITA-OBIT` | Family supplied and consistent with Rita's children; direct record not reviewed |
| `claim-allen-comeaux-006` | child of | Jules Comeaux | verified | `SRC-A1-ALLEN-CENSUS-HOUSEHOLD` | Census-linked FamilySearch household identifies father |
| `claim-allen-comeaux-007` | child of | Joesette R. Comeaux | verified | `SRC-A1-ALLEN-CENSUS-HOUSEHOLD` | Census-linked household identifies mother; her maiden name remains unknown |

### Residences and census appearances

| Claim ID | Date | Place | Record/household | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|
| `claim-allen-comeaux-008` | 1930 | Ward One, Lafayette Parish, Louisiana | Jules Comeaux household, via census-linked FamilySearch profile for sister Lena | verified | `SRC-A1-ALLEN-CENSUS-HOUSEHOLD` | Original census image was not reviewed in the chat |
| `claim-allen-comeaux-009` | adulthood, dates unspecified | Carencro/Lafayette Parish, Louisiana | Residence/death-derived index summary | probable | `SRC-A1-ALLEN-DEATH-INDEX` | Precise residence intervals unknown |

### Marriages and partnerships

| Claim ID | Spouse/partner ID and name | Date | Place | Relationship type | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-allen-comeaux-010` | `person-rita-leblanc-1928`, Rita LeBlanc | unknown | unknown | spouse | probable | `SRC-A1-ALLEN-TREE`, `SRC-A1-FAMILY-CURRENT` | Compiled-tree and family evidence; original record not located |

### Occupations and activities

Not found.

### Migration and movement

No migration is asserted. The evidence places the family in Ward One/Lafayette Parish and later associates Allen with Carencro, but does not document a move or route.

### Military information

| Claim ID | Branch/service | Rank | Unit/station | Date/range | Confidence | Evidence/source IDs | Notes |
|---|---|---|---|---|---|---|---|
| `claim-allen-comeaux-011` | unknown | unknown | unknown | unknown | unresolved | `SRC-A1-ALLEN-REJECTED-IDENTITIES` | No service record was found; WWII service of other men named Allen Comeaux must not be transferred to him |

### Burial information

Not found for Allen in the reviewed research.

### Biographical narrative

The project strongly identifies Michael's maternal grandfather as Allen Paul Comeaux Sr., born in Louisiana in 1925 and present in a Lafayette Parish household in 1930. His line is tied to Jules Comeaux and Joesette R. Comeaux through a census-linked profile. Exact death day, middle-name certainty, marriage record, occupation, military service, and burial remain unresolved. Research explicitly rejected two other Allen Comeaux identities and warned against assigning their records to him.

### Unresolved questions

| Question | Classification | Why unresolved | Best next evidence |
|---|---|---|---|
| Was Paul his legal middle name? | likely requires archive/local records | Family recollection conflicts with derivative index/compiled usage | Birth or baptism record |
| Exact death place and burial | potentially answerable online | Not found in recovered research | Obituary, death certificate, cemetery record |
| Marriage date/place with Rita | likely requires archive/local records | Original marriage record not located | Catholic/civil marriage record |
| Military service | likely requires archive/local records | No evidence found; same-name contamination exists | Official personnel, draft, discharge, or VA record |

## Source-by-source evidence

| Source ID | Full citation/title | Record type/date | Repository/database | URL or preserved citation handle | Evidence type | Claims supported | Reliability/conflicts |
|---|---|---|---|---|---|---|---|
| `SRC-A1-FAMILY-CURRENT` | Michael's A1 task statement | Family statement, 2026-09-04 | Current Codex task | No URL | family-provided information | Seven-person parent/grandparent structure and canonical supplied names | First-person family information; not independent documentary proof |
| `SRC-A1-FAMILY-EXPLAIN` | Michael's messages in “Explain Surname History” | Family statements, original chat | ChatGPT Family History project | Chat ID `6a89bd6f-ac54-83ea-b46b-e1868c2089ba` | family-provided information | Edmond from Dulac; confirmation of Edmond match; Verna from Spring Grove and Buquet as married name; father Aubin; mother Paulette from “Carenco”; Rita/St. Landry and Allen/Lafayette; doubt about middle names; grandfather spoke Cajun French | Direct family testimony; spelling and precision vary |
| `SRC-A1-GINA-BIOS` | Gina's Wayne State and Mercyhurst biographies as reported in original chat | Public biographies, dates not exposed | Wayne State; Mercyhurst | `turn800744search0`; `turn587383search3`; destination URLs not exposed | secondary history | Aubin Buquet and Paulette Comeaux/Paulette Wheeler named as Gina's parents | Independently corroborates family constellation, not Michael's direct parentage |
| `SRC-A1-PAULETTE-LAFAYETTE` | Lafayette record using “Paulette Comeaux Buquet” | Record type/date not exposed | Unspecified Lafayette source | `turn800744search1`; destination URL not exposed | derivative index/transcription | Recorded name form | Insufficient metadata to establish residence or relationship event |
| `SRC-A1-EDMOND-INDEX` | Genealogy/death-derived record for Edmond Buquet | Index/compiled record | Repository not exposed | `turn131812view0`; destination URL not exposed | derivative index/transcription | Birth 16 Feb 1919; death Nov 1986; last residence Houma | Identity strengthened by Michael's explicit confirmation and family obituary |
| `SRC-A1-EVE-OBIT` | Obituary of Eve Marie Buquet | Obituary | Repository not exposed | `turn851422search0`; corroborating later handle `turn725264view1`; destination URLs not exposed | obituary | Parents Aubin V. Buquet and Lena Maronge Buquet; brothers include Edmond P. | Strong family-relationship evidence; obituary is derivative for vital facts |
| `SRC-A1-VERNA-OBIT` | Obituary of Verna Arlene Bakke Buquet | Obituary, 2021 | Repository not exposed | `turn410141search0`; destination URL not exposed | obituary | Full name; birth 18 Jan 1921 in Spring Grove; death 14 Jan 2021; husband Edmond “Bud”; parents Oscar and Olga Doely Bakke; Navy nurse | Strong identification; some event details remain absent from excerpt |
| `SRC-A1-VERNA-VETERAN` | Veterans burial index for Verna | Burial/military index | Repository not exposed | `turn410141search1`; destination URL not exposed | derivative index/transcription | Rank LT, U.S. Navy, WWII | Supports rank/service; unit, station, dates, and cemetery details not exposed |
| `SRC-A1-RITA-OBIT` | Obituary of Rita Leblanc Comeaux | Obituary, 2017 | Repository not exposed | `turn880484search0`; `turn880484search1`; `turn432383search0`; also cited as `turn633248search0`; destination URLs not exposed | obituary | Birth 20 Apr 1928; native Cankton; longtime Carencro resident; death 13 Feb 2017; burial St. Peter; parents; children including Paulette; grandchildren including Michael | Strong family and vital evidence; LeBlanc capitalization varies |
| `SRC-A1-ALLEN-DEATH-INDEX` | Social Security-derived index results for Allen Paul Comeaux | Death/residence indexes | Repositories not exposed | `turn288368search0`; `turn288368search7`; destination URLs not exposed | derivative index/transcription | Birth 27 May 1925; death June 1985; one gives 1 June; adult Carencro association | Multiple indexes support month/year; exact day is only probable |
| `SRC-A1-ALLEN-TREE` | Public Ancestry family-tree index pairing Allen and Rita | Compiled family tree/index | Ancestry | `turn633248search22`; destination URL not exposed | compiled genealogy | Allen Paul Comeaux (1925) paired with Rita M. LeBlanc (1928) | Useful convergence, not an original marriage record |
| `SRC-A1-ALLEN-CENSUS-HOUSEHOLD` | FamilySearch profile for Lena Comeaux linked to 1930 U.S. census | Compiled profile with census linkage | FamilySearch | `turn486408view1`; later convergence `turn464049search1`; destination URLs not exposed | derivative index/transcription | Jules and Joesette as parents; Alton, Lena, Allen as siblings; Ward One, Lafayette Parish | Strong household evidence; original census image not reviewed |
| `SRC-A1-ALLEN-REJECTED-IDENTITIES` | Same-name Allen Comeaux candidate research | Search synthesis in original chat | Multiple indexed sources | Specific destination URLs not exposed; Julien candidate cited `turn710264search7` and later `turn613315search2` | compiled genealogy | Prevents conflation with Allen Bernard Comeaux (1921–2022) and Allen Joseph Comeaux (1935–2020); warns against transferred WWII service | Negative identity evidence; retain in later Allen packet |

## Conflicts and discrepancies

1. **Edmond versus Edmund:** Michael used `Edmund` once while introducing Verna, but repeatedly used `Edmond`, confirmed the Edmond record, and research sources use Edmond P./Edmond “Bud.” Canonical form: **Edmond P. Buquet**; the `Edmund` spelling is preserved as a discrepancy.
2. **Paulette's surnames:** Comeaux, Comeaux Buquet, Wheeler, and Comeaux Wheeler all appear. Comeaux is the family-supplied birth surname. The packet does not infer marriage dates or the reason for each later form.
3. **Allen's middle name:** Michael doubted that Allen had a middle name, while multiple research results use **Paul** and identify a son as Allen Paul Jr. The full form is probable; an original birth/baptism record is needed.
4. **Rita's middle initial:** a compiled tree uses `Rita M. LeBlanc`, while Michael doubted she had a middle name and the obituary form does not establish one. Canonical form omits a middle name; the initial remains unresolved.
5. **Carenco versus Carencro:** Michael's message used `Carenco`; research consistently refers to Carencro. This packet uses the modern place spelling while retaining the original family wording in the source description.
6. **Aubin name collision:** Michael's father Aubin Buquet is distinct from his great-grandfather Aubin Vincent Buquet (1887–1953). No facts from the older man may be assigned to Michael's father.
7. **Allen death precision:** June 1985 is verified by converging indexes; 1 June 1985 is probable because only one recovered index supplied the day.
8. **Relationship status of Aubin and Paulette:** they are supported as co-parents, but marriage or partnership details were not established.

## Rejected hypotheses and false leads

- Do not merge Michael's father Aubin with Aubin Vincent Buquet (1887–1953).
- Do not assign the WWII service of Allen Bernard Comeaux to Allen Paul Comeaux Sr.
- Do not merge Allen Paul with Allen Bernard Comeaux (1921–2022) or Allen Joseph Comeaux (1935–2020).
- Do not treat Philomene Comeaux LeBlanc as Rita's biological mother; the project research established her as Rita's stepmother and Euchariste Dugas Racca as the biological mother.
- Do not infer that Aubin and Paulette were married from shared parenthood or surname forms.

## Research already attempted

A1 performed no new research. It re-read the relevant original project-chat pages and extracted only the immediate-family facts already supplied or researched there. The deeper lineage work, search histories, and rejected candidates remain for the dedicated A2–A7 packets.

## Recommendations for future research

1. Use A2–A5 to preserve complete person-level evidence for the four grandparents without expanding this foundation packet.
2. Obtain direct birth/baptism or family records only if the production dataset requires independent proof of Michael's parent links.
3. Resolve Allen's middle name and exact death day through an original birth/baptism or death record.
4. Preserve Paulette's surname chronology only when family knowledge or marriage records establish it.
5. Keep Michael's father Aubin and ancestor Aubin Vincent disambiguated in every later file.

## Recommended stable person IDs

```json
[
  {"id":"person-michael-buquet","canonicalName":"Michael Buquet"},
  {"id":"person-aubin-buquet","canonicalName":"Aubin Buquet"},
  {"id":"person-paulette-comeaux","canonicalName":"Paulette Comeaux"},
  {"id":"person-edmond-p-buquet-1919","canonicalName":"Edmond P. Buquet"},
  {"id":"person-verna-arlene-bakke","canonicalName":"Verna Arlene Bakke Buquet"},
  {"id":"person-rita-leblanc-1928","canonicalName":"Rita LeBlanc"},
  {"id":"person-allen-comeaux-1925","canonicalName":"Allen Paul Comeaux Sr."}
]
```

## Change log

| Date | Change | Reason/source | Previous value retained where |
|---|---|---|---|
| 2026-09-04 | Created A1 immediate-family foundation | Current A1 task plus re-reading original project chats | Conflicts section and per-person name notes |
