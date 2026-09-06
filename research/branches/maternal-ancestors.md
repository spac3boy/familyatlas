# Maternal ancestors completeness audit

## Audit metadata

- **Audit status:** reviewed
- **Last reviewed:** 2026-09-04
- **Scope:** Every named direct maternal ancestor, collateral relative, step-relative, descendant, spouse/partner reference, and rejected or unresolved identity guardrail found in the original Rita LeBlanc and Allen Comeaux research
- **Purpose:** Completeness layer only. Detailed biographies remain in the existing person packets; this file prevents deeper people and identity warnings from disappearing during later normalization.
- **Evidence boundary:** The audit reread the A0 instructions, the immediate-family foundation, and both complete person packets. It then reread the maternal statements in `Explain Surname History` (`6a89bd6f-ac54-83ea-b46b-e1868c2089ba`) and all three turns of `Continue Rita Research` (`6a9af740-124c-83ea-8fa8-f79c259cff72`), including the dedicated Rita investigation (`a4b0c278-d929-4e24-b4b4-7a73ed9ab6b8`), Allen investigation (`ca4fb239-49c2-43e9-ba4d-76bbf3541ccf`), and Allen stopping-point review (`e3290d15-9fd4-40eb-a4b6-8690ccbc370a`). No internet research was conducted for A6. This audit relies on the source IDs and evidence descriptions already preserved in the owner packets.

## Conventions

- Only `verified`, `probable`, and `unresolved` are confidence states.
- A proposed ID in this audit is a normalization recommendation, not newly created application data.
- An ID containing a year uses it only to distinguish same-named people.
- When a birth surname is unknown, the proposed ID omits it rather than adopting a married surname as a birth surname.
- A relationship path describes the best current genealogical path. A `probable` link makes every more distant path depending on it probable.
- Source IDs beginning `SRC-RITA-…` are defined in [rita-leblanc.md](../people/rita-leblanc.md); `SRC-ALLEN-…` IDs are defined in [allen-comeaux.md](../people/allen-comeaux.md); `SRC-A1-…` IDs are defined in [00-immediate-family.md](../people/00-immediate-family.md).

## Existing anchor people — do not duplicate

| Person | Stable ID | Relationship path | Detailed owner | Coverage note |
|---|---|---|---|---|
| Michael Buquet | `person-michael-buquet` | self | [00-immediate-family.md](../people/00-immediate-family.md) | Immediate-family identity only; personal vital details remain intentionally unresolved |
| Paulette Comeaux | `person-paulette-comeaux` | Michael → mother | [00-immediate-family.md](../people/00-immediate-family.md) | Existing packet owns her names and family role; no separate biography is duplicated here |
| Rita LeBlanc Comeaux | `person-rita-leblanc-1928` | Michael → Paulette → mother | [rita-leblanc.md](../people/rita-leblanc.md) | Complete A2 packet |
| Allen Paul Comeaux Sr. | `person-allen-comeaux-1925` | Michael → Paulette → father | [allen-comeaux.md](../people/allen-comeaux.md) | Complete A3 packet; identity remains probable pending an original record |

## Additional direct ancestors — Rita's parental generation

### Lucuis LeBlanc

- **Proposed stable ID:** `person-lucuis-leblanc`
- **Canonical name:** Lucuis LeBlanc
- **Alternate names:** Lucuis Leblanc; searched but unaccepted variants Lucius, Louis, and Lucien LeBlanc
- **Relationship path:** Michael → Paulette Comeaux → Rita LeBlanc → father
- **Dates:** Not established
- **Places:** Cankton/St. Landry Parish association is probable; a 2019 St. John Berchmans memorial intention preserves the spelling `Lucuis`
- **Family relationships:** Father of Rita, verified; husband of Philomene Comeaux, verified; probable father of Rella L. LeBlanc Constantine; relationship status with Euchariste Dugas is unresolved even though both are named as Rita's parents
- **Important events:** Memorialized with an unnamed spouse as “M/M Lucuis LeBlanc” in a Cankton parish bulletin
- **Sources:** `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT`, `SRC-LUCUIS-MEMORIAL`
- **Status:** verified as Rita's father; dates, parents, birthplace, death, burial, and the chronology of relationships are unresolved
- **Conflicts:** Must not be merged with Lucius John LeBlanc (1893–1951) of Montegut/Terrebonne
- **Unresolved questions:** Who were his parents? When and where did he marry Euchariste and/or Philomene? What were his dates and burial place?

### Euchariste Dugas Racca

- **Proposed stable ID:** `person-euchariste-dugas`
- **Canonical name:** Euchariste Dugas Racca
- **Alternate names:** Euchariste Dugas
- **Relationship path:** Michael → Paulette Comeaux → Rita LeBlanc → mother
- **Dates:** 1908–1967, probable except that Rita's obituary directly establishes the identity but not all date detail
- **Places:** Cankton/St. Landry–Lafayette family area; exact birth, residence, death, and burial places unresolved
- **Family relationships:** Biological mother of Rita, verified; probable child of Moise J. Dugas and Emma Miller; later `Racca` relationship or name event unresolved
- **Important events:** Her identification corrected the earlier risk of treating Philomene Comeaux as Rita's biological mother
- **Sources:** `SRC-RITA-OBIT-ADVERTISER`, `SRC-EMMA-MILLER-FS`
- **Status:** verified as Rita's mother; deeper parentage probable
- **Conflicts:** `Racca` may reflect a later marriage, but no spouse or event was identified
- **Unresolved questions:** Who was the Racca individual? Can her 1908 birth/baptism directly establish her parents and exact name?

## Additional direct ancestors — Euchariste's Dugas and Miller lines

The table is intentionally compact. Each row contains the proposed ID, documented name forms, path, dates/places, relationships/events, evidence status, and remaining problem.

| Proposed stable ID | Canonical and alternate names | Relationship path from Michael | Dates and places | Relationships and important events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-moise-j-dugas` | Moise J. Dugas; Moise Dugas | Michael → Paulette → Rita → Euchariste → father | 1883–1959; Carencro/St. Landry–Lafayette area | Probable spouse of Emma Miller; probable father of Euchariste; reported marriage 27 May 1905 at Carencro | `SRC-EMMA-MILLER-FS` | **probable.** Original marriage and parentage images were not inspected; full middle name, exact vital places, occupation, and burial unresolved |
| `person-emma-miller-1883` | Emma Miller; Emma Dugas | Michael → Paulette → Rita → Euchariste → mother | 1883–1960; Grand Coteau/Carencro family geography | Probable spouse of Moise J. Dugas; probable mother of Euchariste; one of twelve-child household according to compiled profile | `SRC-EMMA-MILLER-FS`, `SRC-MILLER-ANCESTRY`, `SRC-ST-CHARLES-INDEXED` | **probable.** Direct baptism, marriage, and parentage images absent; exact vital places and burial unresolved |
| `person-marcel-dugas-1848` | Marcel Dugas; Marcelin/Marcellin risk in nearby generation | Michael → Paulette → Rita → Euchariste → Moise → father | Born 1848; later dates/places unresolved; Louisiana | Probable spouse of Marie Ruffin Plaisance; probable father of Moise; probable child of Marcellin Dugas and Melanie Boudreaux | `SRC-MARCEL-DUGAS-FS` | **probable.** Must remain distinct from his father Marcellin; death date, occupation, residences, and burial unresolved |
| `person-marie-ruffin-plaisance` | Marie Ruffin Plaisance | Michael → Paulette → Rita → Euchariste → Moise → mother | 1847–1916; Louisiana, exact localities unresolved | Probable spouse of Marcel Dugas and mother of Moise | `SRC-MARCEL-DUGAS-FS` | **probable.** Parents not established; investigated Plaisance/Placencia–Canary Islands line remains unattached |
| `person-marcellin-dugas-1804` | Marcellin Dugas; Marcelin Dugas | Michael → Paulette → Rita → Euchariste → Moise → Marcel → father | 1804–1857; Louisiana | Probable spouse of Melanie Boudreaux; probable father of Marcel; baptismal transcription supplies both grandparent pairs | `SRC-MARCEL-DUGAS-FS`, `SRC-MARCELLIN-GENEALOGY`, `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION` | **probable.** Spelling varies by one `l`; original baptismal image not inspected; exact vital places and burial unresolved |
| `person-melanie-boudreaux` | Melanie Boudreaux | Michael → Paulette → Rita → Euchariste → Moise → Marcel → mother | Dates and places not established | Probable spouse of Marcellin Dugas and mother of Marcel | `SRC-MARCEL-DUGAS-FS`, `SRC-MARCELLIN-GENEALOGY` | **probable.** Nearly all biographical details, parents, original name spelling, and event records unresolved |
| `person-joseph-simon-dugas-1769` | Joseph Simon Dugas; Joseph-Simon Dugas; Joseph Dugas in passenger transcription | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → father | 5 January 1769–1830; born Brittany, France; later Louisiana | Probable son of Charles Dugas and Marguerite Granger; probable spouse of Céleste Dugas; reported marriage 2 August 1794 at St. Martinville; probable 16-year-old aboard *La Bergère* in 1785 | `SRC-MARCELLIN-GENEALOGY`, `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`, `SRC-JOSEPH-SIMON-GENEALOGY`, `SRC-JOSEPH-CELESTE-MARRIAGE`, `SRC-LA-BERGERE-PASSENGERS` | **probable.** Passenger identity is a reasoned match, not an original-image identification; exact death place and burial unresolved |
| `person-celeste-dugas-1778` | Céleste Dugas | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → mother | Circa 1778/1779–1843; Louisiana association | Probable daughter of Jean Dugas and Marguerite Dupuis; probable spouse of Joseph Simon Dugas; her Dugas line creates pedigree collapse | `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`, `SRC-JOSEPH-CELESTE-MARRIAGE`, `SRC-CELESTE-PARENTS` | **probable.** Birth year conflict retained; parents and marriage depend on transcription/compiled sources |
| `person-charles-dugas-1737` | Charles Dugas | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → father | Circa 1737–1809; France in 1785, then Louisiana | Probable spouse of Marguerite Granger; probable father of Joseph Simon; listed as a 45-year-old pit sawyer and head of family 55 aboard *La Bergère* | `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`, `SRC-JOSEPH-SIMON-GENEALOGY`, `SRC-LA-BERGERE-PASSENGERS` | **probable.** Passenger record and genealogy converge; original images and full migration/vital records absent |
| `person-marguerite-granger-1740` | Marguerite Granger | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → mother | Circa 1740–1773; Acadian/France context | Probable spouse of Charles Dugas and mother of Joseph Simon; died before the 1785 voyage according to compiled dates | `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`, `SRC-JOSEPH-SIMON-GENEALOGY` | **probable.** Exact dates and places are compiled; no original record inspected |
| `person-claude-dugas-1702` | Claude Dugas, circa 1702 | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → father | Circa 1702; Acadia | Probable spouse of Anne Hébert; probable father of Charles; probable child of Claude Dugas circa 1677 and Jeanne Bourg | `SRC-CLAUDE-1677-GENEALOGY`, `SRC-ABRAHAM-GENEALOGY-A` | **probable.** Same-name generations require birth-year disambiguation; exact dates and events unresolved |
| `person-anne-hebert` | Anne Hébert; Anne Hebert | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → mother | Dates not established; Acadia | Probable spouse of Claude Dugas circa 1702 and mother of Charles | `SRC-CLAUDE-1677-GENEALOGY`, `SRC-ABRAHAM-GENEALOGY-A` | **probable.** Parentage and all vital details unresolved; accent variation is orthographic only |
| `person-claude-dugas-1677` | Claude Dugas, circa 1677 | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → Claude circa 1702 → father | Circa 1677; Port Royal/Acadia context | Probable spouse of Jeanne Bourg; probable father of Claude circa 1702; probable child of Claude circa 1649 and Françoise Bourgeois | `SRC-CLAUDE-1677-GENEALOGY`, `SRC-CLAUDE-1649-GENEALOGY` | **probable.** Must not be merged with adjacent Claude generations; exact dates/events unresolved |
| `person-jeanne-bourg` | Jeanne Bourg | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → Claude circa 1702 → mother | Dates not established; Acadia | Probable spouse of Claude Dugas circa 1677 and mother of Claude circa 1702 | `SRC-CLAUDE-1677-GENEALOGY`, `SRC-CLAUDE-1649-GENEALOGY` | **probable.** Parentage, dates, and events unresolved; must not be confused with Marguerite Bourg |
| `person-claude-dugas-1649` | Claude Dugas I; Claude Dugas, circa 1649/1652 | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → Claude circa 1702 → Claude circa 1677 → father | Circa 1649 or 1652–1732; Port Royal, Acadia | Probable spouse of Françoise Bourgeois and father of Claude circa 1677; probable child of Abraham Dugas and Marguerite Doucet; appears with second wife Marguerite Bourg and children in 1698/1701 census transcriptions | `SRC-CLAUDE-1649-GENEALOGY`, `SRC-CENSUS-1698`, `SRC-CENSUS-1701`, `SRC-ABRAHAM-GENEALOGY-A` | **probable.** 1649/1652 conflict retained; first/second-wife chronology is compiled; original census images not inspected |
| `person-francoise-bourgeois` | Françoise Bourgeois; Francoise Bourgeois | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → Claude circa 1702 → Claude circa 1677 → mother | Dates not established; Acadia | Probable spouse of Claude circa 1649 and mother of Claude circa 1677 | `SRC-CLAUDE-1649-GENEALOGY`, `SRC-CLAUDE-1677-GENEALOGY` | **probable.** Parentage, dates, and direct original marriage/child evidence unresolved |
| `person-abraham-dugas-1616` | Abraham Dugas | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → Claude circa 1702 → Claude circa 1677 → Claude circa 1649 → father | Circa 1616–1698 or before 1700; Acadia by the early 1640s according to compiled histories | Probable spouse of Marguerite Doucet; probable father of Claude circa 1649; early Acadian settler | `SRC-CLAUDE-1649-GENEALOGY`, `SRC-ABRAHAM-GENEALOGY-A`, `SRC-ABRAHAM-GENEALOGY-B` | **probable.** 1698 versus before-1700 death precision conflict; compiled ancestry, exact origins, parents, and original arrival evidence unresolved |
| `person-marguerite-doucet` | Marguerite Doucet | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Joseph Simon → Charles → Claude circa 1702 → Claude circa 1677 → Claude circa 1649 → mother | Dates not established; Acadia | Probable spouse of Abraham Dugas and mother of Claude circa 1649 | `SRC-CLAUDE-1649-GENEALOGY`, `SRC-ABRAHAM-GENEALOGY-A`, `SRC-ABRAHAM-GENEALOGY-B` | **probable.** Parentage, dates, and original-event documentation unresolved |
| `person-jean-dugas` | Jean Dugas | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Céleste → father | Dates not established; Acadia/Louisiana transition not documented | Probable spouse of Marguerite Dupuis and father of Céleste Dugas | `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`, `SRC-CELESTE-PARENTS` | **probable.** No safe extension into a particular earlier Dugas branch was completed; vital details unresolved |
| `person-marguerite-dupuis` | Marguerite Dupuis | Michael → Paulette → Rita → Euchariste → Moise → Marcel → Marcellin → Céleste → mother | Dates and places not established | Probable spouse of Jean Dugas and mother of Céleste Dugas | `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`, `SRC-CELESTE-PARENTS` | **probable.** Parentage and all vital/event details unresolved |
| `person-adolphe-miller-1849` | Adolphe Miller | Michael → Paulette → Rita → Euchariste → Emma Miller → father | 1849–1900; Grand Coteau, Louisiana association | Probable spouse of Marie Emma/Emma Boudreaux; probable father of Emma Miller; reported marriage 8 August 1872 at Grand Coteau | `SRC-MILLER-ANCESTRY`, `SRC-ST-CHARLES-INDEXED`, `SRC-EMMA-MILLER-FS` | **probable.** Original church image absent; spouse's given-name conflict affects the family group |
| `person-marie-emma-boudreaux-1852` | Marie Emma Boudreaux; Emma Boudreaux; conflicting Josephine Boudreaux | Michael → Paulette → Rita → Euchariste → Emma Miller → mother | 1852–1895; born/reported at Grand Coteau | Probable spouse of Adolphe Miller and mother of Emma Miller; reported 1872 Grand Coteau marriage | `SRC-MILLER-ANCESTRY`, `SRC-ST-CHARLES-INDEXED`, `SRC-EMMA-MILLER-FS` | **probable.** Marie Emma/Emma is preferred; FamilySearch's Josephine form is retained as a conflict pending original St. Charles Borromeo records |
| `person-george-charles-miller` | George Charles Miller | Michael → Paulette → Rita → Euchariste → Emma Miller → Adolphe Miller → father | Dates not established; Louisiana | Probable spouse of Pauline Savoie and father of Adolphe Miller | `SRC-MILLER-ANCESTRY`, `SRC-ST-CHARLES-INDEXED` | **probable.** All vital details, parents, and original relationship record unresolved |
| `person-pauline-savoie` | Pauline Savoie | Michael → Paulette → Rita → Euchariste → Emma Miller → Adolphe Miller → mother | Dates not established; Louisiana | Probable spouse of George Charles Miller and mother of Adolphe Miller | `SRC-MILLER-ANCESTRY`, `SRC-ST-CHARLES-INDEXED` | **probable.** Savoie surname is not used to infer an Acadian pedigree; vital details and parents unresolved |

## Additional direct ancestors — Allen's parent generation

### Jules Comeaux

- **Proposed stable ID:** `person-jules-comeaux-1888`
- **Canonical name:** Jules Comeaux
- **Alternate names:** Must not be normalized to Julien Comeaux or Jules Omer Comeaux
- **Relationship path:** Michael → Paulette Comeaux → Allen Paul Comeaux Sr. → father
- **Dates:** 15 June 1888–11 October 1965
- **Places:** Ward One, Lafayette Parish in the 1930 family evidence; St. Peter Catholic Cemetery, Carencro
- **Family relationships:** Father of Allen, verified; partner/spouse of Joesette R. Comeaux, verified as a household relationship but marriage event unresolved; probable father of Alton and Lena
- **Important events:** 1930 household; burial at St. Peter Catholic Cemetery
- **Sources:** `SRC-ALLEN-CENSUS-PROFILE`, `SRC-ALLEN-JULES-CEMETERY`
- **Status:** verified as Allen's father; own parents unresolved
- **Conflicts:** Joseph O. Comeaux and Marie Alfeda Cormier were investigated but not accepted as his parents; Julien Comeaux born 17 July 1888 is a different man
- **Unresolved questions:** Who were his parents? When and where did he marry Joesette? What were his birthplace, occupation, and complete household?

### Joesette R. Comeaux

- **Proposed stable ID:** `person-joesette-r`
- **Canonical name:** Joesette R. Comeaux
- **Alternate names:** Joesette; searched variants Josette and Josephine; possible cemetery form Mrs. Jules Comeaux
- **Relationship path:** Michael → Paulette Comeaux → Allen Paul Comeaux Sr. → mother
- **Dates:** About 1892 in the census-linked profile; possibly 29 April 1890–17 May 1977
- **Places:** Ward One/Lafayette Parish household; probable St. Peter Catholic Cemetery burial at Carencro
- **Family relationships:** Mother of Allen, verified; partner/spouse of Jules, verified as household relationship; probable mother of Alton and Lena
- **Important events:** Present in the census-linked 1930 family; probable equation with the 1890–1977 `Mrs. Jules Comeaux` cemetery entry
- **Sources:** `SRC-ALLEN-CENSUS-PROFILE`, `SRC-ALLEN-MRS-JULES-CEMETERY`, `SRC-ALLEN-RITA-TREE`
- **Status:** verified as Allen's mother; exact identity, birth surname, dates, and burial are probable/unresolved
- **Conflicts:** About 1892 versus 1890; `Joesette` versus searched variants; `R.` is not expanded and must not be guessed
- **Unresolved questions:** What was her birth surname? Was she the cemetery-listed Mrs. Jules Comeaux? What are her parents and original marriage/death records?

No ancestor earlier than Jules and Joesette is currently attached to Allen's line.

## Collateral, step, and descendant relatives

### Rita's step- and half-sibling family

| Proposed stable ID | Canonical and alternate names | Relationship path from Michael | Dates/places | Family relationships and events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-philomene-comeaux-1916` | Philomene Comeaux LeBlanc; Philomene LeBlanc | Michael → Paulette → Rita → stepmother | 1916–2015; Cankton/Carencro family context | Verified wife of Lucuis; verified mother of Rella; verified stepmother of Rita; obituary preserves 2015 descendant/spouse forms | `SRC-PHILOMENE-OBIT`, `SRC-RITA-OBIT-ADVERTISER` | **verified** in those roles. Must never replace Euchariste as Rita's biological mother; own parents and earlier life not researched |
| `person-rella-leblanc` | Rella L. LeBlanc Constantine; Rella L. Constantine | Michael → Paulette → Rita → probable paternal half-sister | Dates not established; Cankton/Carencro family context | Verified daughter of Philomene; called Rita's sister; probable daughter of Lucuis and therefore probable paternal half-sister of Rita; husband reported as Ray | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT` | **probable** exact sibling type. Birth record, dates, full middle name, and parentage proof unresolved |

### Allen's siblings

| Proposed stable ID | Canonical and alternate names | Relationship path from Michael | Dates/places | Family relationships and events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-alton-comeaux-1910` | Alton Comeaux; possible Elton Comeaux | Michael → Paulette → Allen → probable brother | 1910–1978; Lafayette Parish family | Probable child of Jules and Joesette and brother of Allen; possible spouse Edmonia Benoit only if Alton=Elton | `SRC-ALLEN-CENSUS-PROFILE`, `SRC-ALLEN-ALTON-ELTON-CLUES` | **probable.** Alton/Elton equivalence and spouse are unresolved; a different 1916 Elton is rejected |
| `person-lena-comeaux-1916` | Lena Comeaux | Michael → Paulette → Allen → probable sister | 27 July 1916–13 December 1983; Lafayette Parish; St. Peter Catholic Cemetery, Carencro | Probable child of Jules and Joesette and sibling of Allen; her census-linked profile anchors the family | `SRC-ALLEN-CENSUS-PROFILE` | **probable** sibling relationship under A0 because original images were not inspected; marriage and fuller biography unresolved |

### Rita's children

Rita's obituary verifies all five as her children. Allen's paternity is probable because the Allen–Rita marriage and each birth were not directly documented. Paulette is already owned by the immediate-family packet and is not duplicated.

| Proposed stable ID | Canonical and alternate names | Relationship path from Michael | Dates/places | Family relationships and events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-russell-j-comeaux` | Russell J. “Rooster” Comeaux | Michael → Paulette → brother | Not established; Carencro-area family context | Verified son of Rita; probable son of Allen; one of Paulette's maternal siblings | `SRC-RITA-OBIT-ADVERTISER`, `SRC-ALLEN-RITA-OBITUARY` | **verified** as Rita's son; middle initial expansion, dates, spouse, children, and exact relationship to named grandchildren unresolved |
| `person-allen-paul-comeaux-jr` | Allen Paul Comeaux Jr. | Michael → Paulette → brother | Not established; Carencro-area family context | Verified son of Rita; probable son of Allen; wife Monica reported in Philomene's 2015 obituary | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT`, `SRC-ALLEN-RITA-OBITUARY` | **verified** as Rita's son; dates, places, original name record, and descendant mapping unresolved |
| `person-peggy-comeaux` | Peggy Comeaux Miller | Michael → Paulette → sister | Not established; Carencro-area family context | Verified daughter of Rita; probable daughter of Allen; husband Clarence reported | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT`, `SRC-ALLEN-RITA-OBITUARY` | **verified** as Rita's daughter; marriage chronology, dates, and descendant mapping unresolved |
| `person-priscilla-comeaux` | Priscilla Comeaux; Priscilla C. Babineaux; Priscilla LeBlanc | Michael → Paulette → sister | Not established; Carencro-area family context | Verified daughter of Rita; probable daughter of Allen; 2015 obituary reports husband Karlon and 2017 obituary reports husband Tippy LeBlanc | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT`, `SRC-ALLEN-RITA-OBITUARY` | **verified** as Rita's daughter; surname, middle initial, spouse, and relationship chronology conflict remains unresolved |

### Rita's other named grandchildren

Each person below is verified as a grandchild of Rita by her obituary. Because the obituary does not map grandchildren to Rita's children, each exact relationship to Michael—sibling versus first cousin—and each birth surname remain unresolved unless another source is listed.

| Proposed stable ID | Canonical/recorded name | Relationship path to Michael | Dates and places | Family relationships/events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-conrad-miller` | Conrad Miller | Michael → shared grandmother Rita → grandchild, exact intermediate parent unresolved | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent, dates, places, and whether Miller is birth surname unresolved |
| `person-rustie-lynn-comeaux` | Rustie Lynn Comeaux | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and all events unresolved |
| `person-rhyan-comeaux` | Rhyan Comeaux | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and all events unresolved |
| `person-dexter-babineaux` | Dexter Babineaux | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and whether surname implies a particular maternal line unresolved |
| `person-sid-roger` | Sid Roger | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and all events unresolved |
| `person-bud-buquet` | Bud Buquet | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; whether `Bud` is a nickname, legal name, or the Edmond “Bud” in another obituary is unresolved in the maternal evidence |
| `person-gina` | Gina Nevils; Gina Buquet in public-biography context | Michael → probable sibling through shared parents Aubin and Paulette; independently a named grandchild of Rita | Dates not established; institutions named only in source descriptions | Public biographies identify parents Aubin Buquet and Paulette Comeaux/Wheeler; Rita's obituary names Gina Nevils as a grandchild | `SRC-A1-GINA-BIOS`, `SRC-RITA-OBIT-ADVERTISER` | **probable** sibling of Michael; proposed ID omits an unresolved birth surname; exact parent-child proof remains probable until a direct/family record is added |
| `person-gerard-comeaux` | Gerard Comeaux | Michael → shared grandmother Rita → grandchild, exact intermediate parent unresolved | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and all events unresolved |
| `person-casey-comeaux` | Casey Comeaux | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and all events unresolved |
| `person-brandi-comeaux` | Brandi Comeaux | Same | Not established | Named grandchild of Rita | `SRC-RITA-OBIT-ADVERTISER` | **verified** as Rita's grandchild; exact parent and all events unresolved |

Michael Buquet is the eleventh grandchild named in Rita's obituary and is already owned by [00-immediate-family.md](../people/00-immediate-family.md).

### Named relatives by marriage or partnership

These people matter for identity resolution and surname chronology. The obituaries report the relationships, but dates and legal chronology were not researched.

| Proposed stable ID | Canonical and alternate names | Relationship path to Michael | Dates/places | Relationships/events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-ray` | Ray; probable recorded surname Constantine | Michael → Rita → probable half-sister Rella → husband | Not established | Reported husband of Rella | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT` | **probable.** Proposed ID omits the unresolved surname; full legal name, dates, and marriage event unresolved |
| `person-clarence` | Clarence; probable recorded surname Miller | Michael → Paulette → sister Peggy → husband | Not established | Reported husband of Peggy | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT` | **probable.** Proposed ID omits the unresolved surname; full name, dates, and marriage event unresolved |
| `person-tippy-leblanc` | Tippy LeBlanc | Michael → Paulette → sister Priscilla → husband reported in 2017 | Not established | Reported husband of Priscilla C. Babineaux in Rita's obituary | `SRC-RITA-OBIT-ADVERTISER` | **probable.** `Tippy` may be a nickname; relationship chronology with Karlon unresolved |
| `person-jim` | Jim; surname unresolved | Michael → mother Paulette → husband reported in Rita's obituary | Not established | Reported husband of Paulette Comeaux Wheeler | `SRC-RITA-OBIT-ADVERTISER`, `SRC-PHILOMENE-OBIT` | **probable.** Do not infer that Jim's surname was Wheeler without a direct source; marriage timing and status unresolved |
| `person-monica` | Monica; surname unresolved | Michael → Paulette → brother Allen Jr. → wife | Not established | Reported wife of Allen Paul Comeaux Jr. in Philomene's 2015 obituary | `SRC-PHILOMENE-OBIT` | **probable.** Full name, dates, and marriage event unresolved |
| `person-karlon` | Karlon; surname unresolved | Michael → Paulette → sister Priscilla → husband reported in 2015 | Not established | Reported husband of Priscilla LeBlanc in Philomene's obituary | `SRC-PHILOMENE-OBIT` | **probable.** Full name and relationship chronology with the 2017 Tippy LeBlanc report unresolved |

## Collateral Dugas relatives aboard *La Bergère*

The passenger transcription names these children in Charles Dugas's household in addition to probable direct ancestor Joseph Simon. Their relationship to Michael is probable because the Joseph Simon passenger identity and the multi-generation path to Rita are probable.

| Proposed stable ID | Canonical and alternate names | Relationship path to Michael | Dates/places | Family relationships/events | Sources | Status, conflicts, and unresolved questions |
|---|---|---|---|---|---|---|
| `person-jean-charles-dugas` | Jean Charles Dugas | Michael → Rita → probable ancestor Joseph Simon → brother | Age 20 in 1785; France to Louisiana | Listed as Charles Dugas's son in family 55 aboard *La Bergère* | `SRC-LA-BERGERE-PASSENGERS` | **probable** collateral relative; birth date, mother, later life, and independent identity unresolved |
| `person-pierre-olivier-dugas` | Pierre Olivier Dugas | Michael → Rita → probable ancestor Joseph Simon → brother | Age 18 in 1785; France to Louisiana | Listed as Charles Dugas's son in family 55 aboard *La Bergère* | `SRC-LA-BERGERE-PASSENGERS` | **probable** collateral relative; birth date, mother, later life, and independent identity unresolved |
| `person-marie-joseph-dugas` | Marie Joseph Dugas | Michael → Rita → probable ancestor Joseph Simon → sister | Age not preserved in the packet; France to Louisiana in 1785 | Listed as Charles Dugas's daughter in family 55 aboard *La Bergère* | `SRC-LA-BERGERE-PASSENGERS` | **probable** collateral relative; exact age/name form, mother, and later life unresolved |
| `person-marguerite-dugas` | Marguerite Dugas | Michael → Rita → probable ancestor Joseph Simon → sister | Age not preserved in the packet; France to Louisiana in 1785 | Listed as Charles Dugas's daughter in family 55 aboard *La Bergère* | `SRC-LA-BERGERE-PASSENGERS` | **probable** collateral relative; birth year and later life unresolved |
| `person-marguerite-bourg` | Marguerite Bourg | Michael → Rita → probable ancestor Claude circa 1649 → second wife; not established as Michael's ancestor | Dates not established; Port Royal in 1698 and 1701 | Appears as Claude Dugas's second wife in both census transcriptions; mother/stepmother relationship to individual children was not resolved | `SRC-CENSUS-1698`, `SRC-CENSUS-1701`, `SRC-CLAUDE-1649-GENEALOGY` | **probable** collateral spouse. Must not be merged with Jeanne Bourg; marriage date, parentage, and biological relationship to the direct child unresolved |

## Rejected and unattached identity guardrails

These named people are **not** accepted maternal relatives. They are preserved because losing them would invite later same-name merges. `Disposition` is separate from confidence; all genealogical attachment claims remain `unresolved` or rejected.

| Research-only candidate ID | Person or group | Why considered | Disposition and source references |
|---|---|---|---|
| `candidate-lucius-john-leblanc-1893` | Lucius John LeBlanc (1893–1951) | Same general name/generation as Rita's father | **Rejected.** Montegut/Terrebonne/New Orleans geography and marriage to Florence Oraline Cloutier do not match Rita's Cankton family. `SRC-LUCIUS-JOHN-REJECTED` |
| `candidate-arthur-leblanc` and `candidate-marie-eve-chauvin` | Arthur LeBlanc and Marie Eve Chauvin | Parents of rejected Lucius John | **Not relatives.** They must not be attached through the rejected candidate. `SRC-LUCIUS-JOHN-REJECTED` |
| `candidate-florence-oraline-cloutier` | Florence Oraline Cloutier | Wife of rejected Lucius John | **Not Rita's stepmother on current evidence.** `SRC-LUCIUS-JOHN-REJECTED` |
| `candidate-joseph-o-comeaux` and `candidate-marie-alfeda-cormier` | Joseph O. Comeaux and Marie Alfeda Cormier | Ancestry result suggested them as parents of a Jules born about 1888 | **Unattached.** Result appeared mixed with another Jules/Jules Omer; no original record tied them to Allen's father. `SRC-ALLEN-JULES-PARENT-CLUE` |
| `candidate-jules-omer-comeaux-1857` | Jules Omer Comeaux, born 1857 | Record contamination in the proposed parentage result | **Different or mixed identity; not attached.** `SRC-ALLEN-JULES-PARENT-CLUE` |
| `candidate-julien-comeaux-1888` | Julien Comeaux, born 17 July 1888 | Birth date close to Jules Comeaux, born 15 June 1888 | **Rejected.** Different parents, spouse Coralie Mathieu, and fourteen-child family. `SRC-ALLEN-JULIEN-REJECTED` |
| `candidate-jules-onezime-comeaux` and `candidate-marie-doralise-veronie` | Jules Onezime Comeaux and Marie Doralise Veronie | Parents of rejected Julien | **Not ancestors through Jules.** `SRC-ALLEN-JULIEN-REJECTED` |
| `candidate-coralie-mathieu` | Coralie Mathieu | Spouse of rejected Julien | **Not Allen's grandmother.** `SRC-ALLEN-JULIEN-REJECTED` |
| `candidate-allen-bernard-comeaux-1921` | Allen Bernard Comeaux (1921–2022) | Same name and WWII-age profile | **Rejected.** Different dates, parents Edward Comeaux and Elisa Langlinais, spouse Cleida Monty, and Army service. `SRC-ALLEN-BERNARD-OBITUARY` |
| `candidate-edward-comeaux`, `candidate-elisa-langlinais`, and `candidate-cleida-monty` | Edward Comeaux, Elisa Langlinais, and Cleida Monty | Family of rejected Allen Bernard | **Not attached.** Their facts and WWII history must not enter Allen Paul's record. `SRC-ALLEN-BERNARD-OBITUARY` |
| `candidate-allen-joseph-comeaux-1935` | Allen Joseph Comeaux (1935–2020) | Same name in regional search results | **Rejected.** Delcambre identity, different dates, parents Rene Comeaux and Elleda Blanchard, spouse Barbara Naquin. `SRC-ALLEN-JOSEPH-OBITUARY` |
| `candidate-rene-comeaux`, `candidate-elleda-blanchard`, and `candidate-barbara-naquin` | Rene Comeaux, Elleda Blanchard, and Barbara Naquin | Family of rejected Allen Joseph | **Not attached.** Fisherman/boat-captain history belongs to the rejected man. `SRC-ALLEN-JOSEPH-OBITUARY` |
| `candidate-elton-comeaux` and `candidate-edmonia-benoit` | Elton Comeaux and spouse Edmonia Benoit | Hidden parent birth years resemble Jules/Joesette; Elton may be Alton | **Unresolved, not merged.** A direct Alton record is needed. `SRC-ALLEN-ALTON-ELTON-CLUES` |
| `candidate-elton-comeaux-1916` | Different Elton Comeaux born in 1916 | Appeared in sibling searches | **Rejected as Allen's brother.** Incompatible with Lena's July 1916 birth and the supported 1910 Alton. `SRC-ALLEN-ALTON-ELTON-CLUES` |

## Source-reference ownership

| Source family | Detailed owner | What it covers in this audit |
|---|---|---|
| `SRC-RITA-FAMILY-STATEMENT`, `SRC-A1-FAMILY-EXPLAIN` | [00-immediate-family.md](../people/00-immediate-family.md) and [rita-leblanc.md](../people/rita-leblanc.md) | Michael's supplied grandparent names, parish associations, and middle-name recollection |
| `SRC-RITA-OBIT-ADVERTISER`, `SRC-RITA-FUNERAL-NOTICE`, `SRC-PHILOMENE-OBIT`, `SRC-LUCUIS-MEMORIAL` | [rita-leblanc.md](../people/rita-leblanc.md) | Rita's parent, stepfamily, children, grandchildren, and Cankton/Carencro evidence |
| `SRC-EMMA-MILLER-FS` through `SRC-CELESTE-PARENTS` | [rita-leblanc.md](../people/rita-leblanc.md) | Dugas line, *La Bergère*, Acadian census households, and pedigree-collapse branch |
| `SRC-MILLER-ANCESTRY`, `SRC-ST-CHARLES-INDEXED` | [rita-leblanc.md](../people/rita-leblanc.md) | Miller/Boudreaux/Savoie branch and Marie Emma/Josephine conflict |
| `SRC-ALLEN-CENSUS-PROFILE`, `SRC-ALLEN-JULES-CEMETERY`, `SRC-ALLEN-MRS-JULES-CEMETERY` | [allen-comeaux.md](../people/allen-comeaux.md) | Jules/Joesette household, Allen's siblings, dates, and burial evidence |
| `SRC-ALLEN-JULES-PARENT-CLUE`, `SRC-ALLEN-JULIEN-REJECTED`, `SRC-ALLEN-ALTON-ELTON-CLUES` | [allen-comeaux.md](../people/allen-comeaux.md) | Unresolved and rejected Comeaux extensions |
| `SRC-ALLEN-BERNARD-OBITUARY`, `SRC-ALLEN-JOSEPH-OBITUARY` | [allen-comeaux.md](../people/allen-comeaux.md) | Same-name Allen exclusion guardrails |

## Maternal Lineage Coverage Audit

This table lists every **named person currently accepted or probable as a direct maternal ancestor** of Michael. Collateral relatives and rejected candidates are preserved above but are not mislabeled as ancestors here.

| Generation/branch | Named ancestor | Proposed or assigned stable ID | Detailed research owner | Coverage status |
|---|---|---|---|---|
| Self | Michael Buquet | `person-michael-buquet` | [00-immediate-family.md](../people/00-immediate-family.md) | Adequate for lineage anchor; personal vitals intentionally sparse |
| Mother | Paulette Comeaux | `person-paulette-comeaux` | [00-immediate-family.md](../people/00-immediate-family.md) | Insufficient personal detail; parent links preserved |
| Maternal grandmother | Rita LeBlanc | `person-rita-leblanc-1928` | [rita-leblanc.md](../people/rita-leblanc.md) | Complete first-pass packet |
| Maternal grandfather | Allen Paul Comeaux Sr. | `person-allen-comeaux-1925` | [allen-comeaux.md](../people/allen-comeaux.md) | Complete first-pass packet; identity remains probable |
| Rita's father | Lucuis LeBlanc | `person-lucuis-leblanc` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, parents, vital events, and marriages unresolved |
| Rita's mother | Euchariste Dugas Racca | `person-euchariste-dugas` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** direct birth/parentage and Racca event unresolved |
| Allen's father | Jules Comeaux | `person-jules-comeaux-1888` | [allen-comeaux.md](../people/allen-comeaux.md) | **Insufficient:** parents and original marriage/birth records unresolved |
| Allen's mother | Joesette R. Comeaux | `person-joesette-r` | [allen-comeaux.md](../people/allen-comeaux.md) | **Insufficient:** birth surname, exact identity/dates, parents, and burial unresolved |
| Euchariste's father | Moise J. Dugas | `person-moise-j-dugas` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; needs original marriage/parentage records |
| Euchariste's mother | Emma Miller | `person-emma-miller-1883` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; needs original baptism/marriage and parentage records |
| Moise's father | Marcel Dugas | `person-marcel-dugas-1848` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; sparse vital details |
| Moise's mother | Marie Ruffin Plaisance | `person-marie-ruffin-plaisance` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** parents and possible Plaisance origins unattached |
| Marcel's father | Marcellin Dugas | `person-marcellin-dugas-1804` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; original baptism/parentage image needed |
| Marcel's mother | Melanie Boudreaux | `person-melanie-boudreaux` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, places, parents, and events not established |
| Marcellin's father | Joseph Simon Dugas | `person-joseph-simon-dugas-1769` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; *La Bergère* identity and original records need confirmation |
| Marcellin's mother | Céleste Dugas | `person-celeste-dugas-1778` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; 1778/1779 conflict and original parentage unresolved |
| Joseph Simon's father | Charles Dugas | `person-charles-dugas-1737` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; passenger transcription and compiled genealogy only |
| Joseph Simon's mother | Marguerite Granger | `person-marguerite-granger-1740` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; exact events and originals unresolved |
| Charles's father | Claude Dugas, circa 1702 | `person-claude-dugas-1702` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; sparse exact dates/events |
| Charles's mother | Anne Hébert | `person-anne-hebert` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** nearly all person-level details unresolved |
| Claude circa 1702's father | Claude Dugas, circa 1677 | `person-claude-dugas-1677` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; same-name disambiguation preserved |
| Claude circa 1702's mother | Jeanne Bourg | `person-jeanne-bourg` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, parents, and original events unresolved |
| Claude circa 1677's father | Claude Dugas, circa 1649/1652 | `person-claude-dugas-1649` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; birth-year conflict and original census images unresolved |
| Claude circa 1677's mother | Françoise Bourgeois | `person-francoise-bourgeois` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, parents, and original events unresolved |
| Claude circa 1649's father | Abraham Dugas | `person-abraham-dugas-1616` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; exact origin and death date unresolved |
| Claude circa 1649's mother | Marguerite Doucet | `person-marguerite-doucet` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, parents, and original events unresolved |
| Céleste's father | Jean Dugas | `person-jean-dugas` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** no safe earlier branch or vital details established |
| Céleste's mother | Marguerite Dupuis | `person-marguerite-dupuis` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** all vital details and parents unresolved |
| Emma Miller's father | Adolphe Miller | `person-adolphe-miller-1849` | [rita-leblanc.md](../people/rita-leblanc.md) | Probable; original church records needed |
| Emma Miller's mother | Marie Emma Boudreaux | `person-marie-emma-boudreaux-1852` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** Marie Emma/Emma versus Josephine conflict unresolved |
| Adolphe's father | George Charles Miller | `person-george-charles-miller` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, parents, and original relationship record unresolved |
| Adolphe's mother | Pauline Savoie | `person-pauline-savoie` | [rita-leblanc.md](../people/rita-leblanc.md) | **Insufficient:** dates, parents, and any deeper Savoie lineage unresolved |

### Coverage conclusions

- **Named direct ancestors represented:** 32 including Michael and Paulette; 30 ancestral people beyond Michael and Paulette.
- **Fully developed person packets:** Rita LeBlanc and Allen Comeaux.
- **Immediate-family owner:** Michael and Paulette remain in `00-immediate-family.md`.
- **Rita packet ownership:** Lucuis, Euchariste, the Dugas line, the Miller/Boudreaux branch, Jean Dugas/Marguerite Dupuis, and the *La Bergère* evidence.
- **Allen packet ownership:** Jules, Joesette, and the Comeaux brick wall.
- **Most urgent insufficient people:** Lucuis LeBlanc, Joesette R. Comeaux, Jules Comeaux, Euchariste Dugas Racca, Marie Ruffin Plaisance, Melanie Boudreaux, and the sparsely documented spouse-side ancestors in the seventeenth-century and Miller branches.
- **No accepted direct line beyond Jules/Joesette:** Allen's earlier Comeaux ancestry remains unresolved; no Acadian Comeaux ancestor is attached.
- **No accepted direct line beyond Lucuis:** Rita's paternal LeBlanc ancestry remains unresolved.

## Change log

| Date | Change | Reason/source | Previous value retained where |
|---|---|---|---|
| 2026-09-04 | Created A6 maternal completeness audit | Re-read A0 files, A1 foundation, A2/A3 packets, and original Rita/Allen source chats | Person packets remain the detailed owners |
| 2026-09-04 | Added compact records for all named direct ancestors, collateral relatives, descendants, and marriage references | Prevent loss during later normalization without duplicating biographies | This file's completeness tables |
| 2026-09-04 | Added research-only guardrails for rejected and unresolved same-name candidates | Preserve false leads and prevent accidental merges | Rejected and unattached identity guardrails |
| 2026-09-04 | Preserved all deeper links as probable where original images were not inspected | A0 confidence rules | Person rows and lineage coverage audit |
