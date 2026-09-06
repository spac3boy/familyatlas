# Research ingestion audit

## Audit boundary

- **Audit date:** 2026-09-04
- **Input:** all completed files under `research/`, plus the project guardrails in `AGENTS.md`, `ARCHITECTURE.md`, and `docs/`
- **Output:** this ingestion report only
- **Not performed:** new genealogy research, source-packet rewriting, production-data creation, identity merging, conflict resolution, or UI work

The research packets remain the source material. This report indexes their normalization surface and identifies values that must stay uncertain. It does not replace packet-level evidence, reasoning, citations, false leads, or change logs.

## Readiness finding

The archive is ready to design and populate a normalized model, but it is **not safe to flatten directly into facts**. Normalization may proceed only if it preserves claims, sources, confidence, date precision, geographic precision, dispositions, conflicts, and aliases.

The principal pre-normalization issues are:

1. Thirteen claim IDs are reused across packets; eight of those reuse the same ID for different meanings.
2. One person has two research IDs; the archive already designates one canonical ID and one alias.
3. Twenty packet-drift or contradictory-claim groups require explicit alternate-value or scope treatment.
4. Twenty-five identity-conflict groups require merge guards.
5. Ninety-seven open questions remain: 55 likely need archival/local records, 19 family knowledge, 11 additional online research, 10 inaccessible records, and 2 are genuinely unknown.
6. No original civil birth, marriage, census, cemetery, passenger-list, Norwegian parish/emigration, or military personnel image/file was inspected in the completed research.
7. Several people, events, relationships, sources, and places exist only as groups, source forms, or unresolved candidates and must not be promoted to accepted entities.

These conditions do not require inventing answers before normalization. Most require modeling uncertainty explicitly.

## Archive ownership

| Domain | Research authority |
|---|---|
| Method, confidence, IDs, dates, names, and movement rules | `research/README.md` |
| Packet structure | `research/packet-template.md` |
| Original-chat retrieval | `research/chat-inventory.md` |
| Immediate family | `research/people/00-immediate-family.md` |
| Rita, Allen, Edmond, and Verna detail | Respective files under `research/people/` |
| Deeper and collateral people | `research/branches/maternal-ancestors.md` and `paternal-ancestors.md` |
| Places and movements | `research/places/family-geography.md` |
| Sources and source aliases | `research/sources/source-inventory.md` |
| Completeness, relationships, conflicts, and open questions | `research/open-questions.md` |
| Counts and handoff status | `research/manifest.json` |

For person-level facts, the latest detailed packet owns the fullest evidence. Branch audits own completeness. The place and source inventories own consolidated place/source metadata. `open-questions.md` owns the final discrepancy audit. File precedence never resolves an actual evidence dispute by itself.

## People inventory

### Counts

- **104 genealogically relevant identities** represented by 105 pre-alias `person-*` IDs.
- **36 named research-only candidate or non-relative identities** with `candidate-*` IDs.
- **1 unnamed-candidate placeholder:** `candidate-hans-hansen-bakke-parents`.
- **Canonical person-ID alias:** `person-philomene-comeaux-1916` → `person-philomene-comeaux`.

### Immediate family — 7

- `person-michael-buquet` — Michael Buquet
- `person-aubin-buquet` — Aubin Buquet
- `person-paulette-comeaux` — Paulette Comeaux
- `person-edmond-p-buquet-1919` — Edmond P. Buquet
- `person-verna-arlene-bakke` — Verna Arlene Bakke Buquet
- `person-rita-leblanc-1928` — Rita LeBlanc
- `person-allen-comeaux-1925` — Allen Paul Comeaux Sr.

### Maternal direct-line and spouse-side ancestors — 28

- `person-lucuis-leblanc` — Lucuis LeBlanc
- `person-euchariste-dugas` — Euchariste Dugas Racca
- `person-jules-comeaux-1888` — Jules Comeaux
- `person-joesette-r` — Joesette R. Comeaux
- `person-moise-j-dugas` — Moise J. Dugas
- `person-emma-miller-1883` — Emma Miller
- `person-marcel-dugas-1848` — Marcel Dugas
- `person-marie-ruffin-plaisance` — Marie Ruffin Plaisance
- `person-marcellin-dugas-1804` — Marcellin Dugas
- `person-melanie-boudreaux` — Melanie Boudreaux
- `person-joseph-simon-dugas-1769` — Joseph Simon Dugas
- `person-celeste-dugas-1778` — Céleste Dugas
- `person-charles-dugas-1737` — Charles Dugas
- `person-marguerite-granger-1740` — Marguerite Granger
- `person-claude-dugas-1702` — Claude Dugas circa 1702
- `person-anne-hebert` — Anne Hébert
- `person-claude-dugas-1677` — Claude Dugas circa 1677
- `person-jeanne-bourg` — Jeanne Bourg
- `person-claude-dugas-1649` — Claude Dugas circa 1649/1652
- `person-francoise-bourgeois` — Françoise Bourgeois
- `person-abraham-dugas-1616` — Abraham Dugas
- `person-marguerite-doucet` — Marguerite Doucet
- `person-jean-dugas` — Jean Dugas
- `person-marguerite-dupuis` — Marguerite Dupuis
- `person-adolphe-miller-1849` — Adolphe Miller
- `person-marie-emma-boudreaux-1852` — Marie Emma/Emma Boudreaux
- `person-george-charles-miller` — George Charles Miller
- `person-pauline-savoie` — Pauline Savoie

### Maternal collateral, descendants, partners, and passenger household — 29 identities

- `person-philomene-comeaux` — Philomene Comeaux LeBlanc; canonical ID
- `person-philomene-comeaux-1916` — compatibility alias for Philomene, not another person
- `person-rella-leblanc` — Rella L. LeBlanc Constantine
- `person-alton-comeaux-1910` — Alton Comeaux
- `person-lena-comeaux-1916` — Lena Comeaux
- `person-russell-j-comeaux` — Russell J. “Rooster” Comeaux
- `person-allen-paul-comeaux-jr` — Allen Paul Comeaux Jr.
- `person-peggy-comeaux` — Peggy Comeaux Miller
- `person-priscilla-comeaux` — Priscilla Comeaux/Babineaux/LeBlanc
- `person-conrad-miller` — Conrad Miller
- `person-rustie-lynn-comeaux` — Rustie Lynn Comeaux
- `person-rhyan-comeaux` — Rhyan Comeaux
- `person-dexter-babineaux` — Dexter Babineaux
- `person-sid-roger` — Sid Roger
- `person-bud-buquet` — Bud Buquet
- `person-gina` — Gina Nevils/Gina Buquet
- `person-gerard-comeaux` — Gerard Comeaux
- `person-casey-comeaux` — Casey Comeaux
- `person-brandi-comeaux` — Brandi Comeaux
- `person-ray` — Ray
- `person-clarence` — Clarence
- `person-tippy-leblanc` — Tippy LeBlanc
- `person-jim` — Jim
- `person-monica` — Monica
- `person-karlon` — Karlon
- `person-jean-charles-dugas` — Jean Charles Dugas
- `person-pierre-olivier-dugas` — Pierre Olivier Dugas
- `person-marie-joseph-dugas` — Marie Joseph Dugas
- `person-marguerite-dugas` — Marguerite Dugas
- `person-marguerite-bourg` — Marguerite Bourg

### Paternal direct-line and spouse-side ancestors beyond the immediate family — 22

- `person-aubin-vincent-buquet-1887` — Aubin Vincent Buquet
- `person-lena-maronge-1890` — Lena Maronge
- `person-quentin-alcide-augustin-buquet` — Quentin Alcide Augustin Buquet
- `person-jeanne-octavie-savoie` — Jeanne Octavie Savoie
- `person-francois-luc-theodore-buquet` — François Luc Théodore Buquet
- `person-celeste-felonise-leblanc` — Céleste Félonise LeBlanc
- `person-francois-michel-jacques-buquet` — François Michel Jacques Bouquet/Buquet
- `person-marie-anne-henry` — Marie Anne Henry
- `person-marcelin-tiburse-savoie` — Marcelin Tiburse Savoie
- `person-malvina-bergeron` — Malvina Bergeron
- `person-oscar-paul-bakke` — Oscar Paul Bakke
- `person-olga-josephine-doely` — Olga Josephine Doely
- `person-martin-h-bakke` — Martin H. Bakke
- `person-olava-olausdatter-dukleth` — Olava Olausdatter Dukleth
- `person-hans-hansen-bakke-1801` — Hans Hansen Bakke
- `person-ingeborg-skore` — Ingeborg Skore
- `person-olaus-paulsen-dukleth` — Olaus Paulsen Dukleth
- `person-grethe-pauline-pedersdatter-melhus` — Grethe Pauline Pedersdatter Melhus
- `person-nicolai-ingvaldsen-doely` — Nicolai Ingvaldsen Doely
- `person-serine-roble` — Serine/Serina Roble
- `person-ingvald-throndsen-doely` — Ingvald Throndsen Doely
- `person-helene-blexrud` — Helene Blexrud

### Paternal collateral and descendants — 18

- `person-robert-buquet-1908` — C. Robert/Robert Claude Buquet
- `person-aubin-joseph-buquet-1917` — Aubin Joseph “A.J.” Buquet
- `person-eve-marie-buquet-1910` — Eve Marie Buquet
- `person-may-buquet` — May B. Buquet Lirette
- `person-daisy-bridget-buquet-1912` — Daisy Bridget Buquet
- `person-fred-buquet` — Fred Buquet
- `person-lena-marie-buquet-1896` — Lena Marie Buquet
- `person-marie-louise-buquet-1819` — Marie Louise Buquet/Bouquet
- `person-paul-oswald-bakke` — Paul/Paul Oswald Bakke
- `person-ione-bakke-kjome` — Ione Bakke Kjome
- `person-styrek-belden-doely` — Styrek Belden Doely
- `person-michael-buquet-edmond-child` — Michael Buquet, Edmond and Verna's son
- `person-cathy-buquet` — Cathy B. McRae
- `person-paige-bartholomew` — Paige Bartholomew
- `person-sean-mcrae` — Sean McRae
- `person-edmond-buquet-verna-grandchild` — Edmond “Bud” Buquet, Verna's grandchild
- `person-lauren-dugas` — Lauren Dugas
- `person-collin-adkisson` — Collin Adkisson

### Named research-only candidates and non-relatives — 36

| Group | Candidate IDs |
|---|---|
| Rejected/unattached LeBlanc family (4) | `candidate-lucius-john-leblanc-1893`; `candidate-arthur-leblanc`; `candidate-marie-eve-chauvin`; `candidate-florence-oraline-cloutier` |
| Rejected/unattached Comeaux families (18) | `candidate-joseph-o-comeaux`; `candidate-marie-alfeda-cormier`; `candidate-jules-omer-comeaux-1857`; `candidate-julien-comeaux-1888`; `candidate-jules-onezime-comeaux`; `candidate-marie-doralise-veronie`; `candidate-coralie-mathieu`; `candidate-allen-bernard-comeaux-1921`; `candidate-edward-comeaux`; `candidate-elisa-langlinais`; `candidate-cleida-monty`; `candidate-allen-joseph-comeaux-1935`; `candidate-rene-comeaux`; `candidate-elleda-blanchard`; `candidate-barbara-naquin`; `candidate-elton-comeaux`; `candidate-edmonia-benoit`; `candidate-elton-comeaux-1916` |
| Unattached Louisiana Buquets (5) | `candidate-joseph-buquet-1824`; `candidate-francois-louis-isidore-buquet`; `candidate-francois-joseph-julian-buquet`; `candidate-marie-domatilde-buquet`; `candidate-marceline-delphine-buquet` |
| Norwegian-American collateral leads (2) | `candidate-ingeborg-olive-doely-1899`; `candidate-mathias-paulsen-dukleith-1819` |
| Unrelated historical Buquets (5) | `candidate-louis-leopold-buquet-1768`; `candidate-charles-joseph-buquet-1776`; `candidate-henri-alfred-leopold-buquet-1809`; `candidate-jean-baptiste-lucien-buquet-1807`; `candidate-narcisse-alexandre-buquet-1825` |
| Historical contacts, not relatives (2) | `candidate-even-heg`; `candidate-hans-christian-heg` |

Candidates need a disposition and exclusion reason. They must not share accepted-lineage edges merely because their internal family relationships are documented.

## Branch inventory

| Branch | Families represented | Coverage and normalization caution |
|---|---|---|
| Immediate family | Buquet; Comeaux; LeBlanc; Bakke | Seven anchors are present. Michael, Aubin, and Paulette remain intentionally sparse and largely family-provided. |
| Maternal—Rita/LeBlanc | LeBlanc; Dugas; Miller; Boudreaux; Plaisance; Granger; Hébert; Bourg; Doucet; Dupuis; Savoie | Rita and her parents are stronger than the deeper Dugas/Miller ancestry. Most deeper links are probable and derivative. Rita's paternal line stops at Lucuis. |
| Maternal—Allen/Comeaux | Comeaux | Allen's identity is probable as the 1925 Allen Paul. Parent links to Jules and Joesette are supported through a census-linked profile; the direct line stops there. |
| Paternal—Edmond/Buquet | Buquet/Bouquet; Maronge; Savoie; LeBlanc; Bergeron | Edmond is verified. The deeper Buquet line becomes probable and reaches François Michel Jacques in France; precise origin and parents are unresolved. |
| Paternal—Verna/Bakke | Bakke; Skore; Dukleth; Melhus; Doely; Roble; Blexrud | Verna and nearer Bakke links are strong; several immigrant narratives and deeper Norwegian parent-child bridges remain probable or unresolved. |

`maternal-ancestors.md` and `paternal-ancestors.md` are completeness layers, not separate graphs. Normalize their additional people into the same canonical graph while retaining the detailed packet as owner for Rita, Allen, Edmond, and Verna.

## Relationship inventory

### Parent-child groups — 36 archived rows

Each named child must become a separate relationship edge with its own confidence and sources. A parent pair in research prose must not become one inseparable edge.

| Parent or parent pair | Children | Preserved status |
|---|---|---|
| Aubin Buquet and Paulette Comeaux | Michael; Gina | probable; co-parent evidence, no direct birth records |
| Edmond P. Buquet and Verna Arlene Bakke | Aubin; Michael, their son; Cathy | Verna's links verified; Edmond's paternity probable |
| Rita LeBlanc and probably Allen Paul Comeaux Sr. | Russell J.; Allen Paul Jr.; Peggy; Priscilla; Paulette | Rita's maternity verified; Allen's paternity probable |
| Lucuis LeBlanc and Euchariste Dugas | Rita | each parent verified; parents' partnership type unresolved |
| Lucuis LeBlanc and Philomene Comeaux | Rella | Philomene maternity verified; Lucuis paternity/half-sibling framing probable |
| Jules Comeaux and Joesette R. Comeaux | Allen; Alton; Lena | Allen link verified from profile; sibling links probable |
| Moise J. Dugas and Emma Miller | Euchariste | probable |
| Marcel Dugas and Marie Ruffin Plaisance | Moise | probable |
| Marcellin Dugas and Melanie Boudreaux | Marcel | probable |
| Joseph Simon Dugas and Céleste Dugas | Marcellin | probable |
| Charles Dugas and Marguerite Granger | Joseph Simon | probable |
| Claude Dugas circa 1702 and Anne Hébert | Charles | probable |
| Claude Dugas circa 1677 and Jeanne Bourg | Claude circa 1702 | probable |
| Claude Dugas circa 1649/1652 and Françoise Bourgeois | Claude circa 1677 | probable |
| Abraham Dugas and Marguerite Doucet | Claude circa 1649/1652 | probable |
| Jean Dugas and Marguerite Dupuis | Céleste Dugas | probable |
| Adolphe Miller and Marie Emma/Emma Boudreaux | Emma Miller | probable; Josephine-name conflict |
| George Charles Miller and Pauline Savoie | Adolphe | probable |
| Charles Dugas household | Jean Charles; Pierre Olivier; Joseph; Marie Joseph; Marguerite | passenger household transcribed; Joseph-as-Joseph-Simon match probable |
| Claude circa 1649/1652 and second wife Marguerite Bourg | unnamed 1698/1701 household children | household transcribed; maternity of each child unresolved |
| Aubin Vincent Buquet and Lena Maronge | C. Robert; A.J.; Eve Marie; May; Daisy; Edmond; unnamed infant | named links vary verified/probable; list may be incomplete |
| Quentin Alcide Augustin Buquet and Jeanne Octavie Savoie | Aubin Vincent; Fred; Lena Marie | probable |
| François Luc Théodore Buquet and Céleste Félonise LeBlanc | Quentin | probable |
| François Michel Jacques Buquet and Marie Anne Henry | François Luc; Marie Louise | probable; Joseph remains unattached |
| Marcelin Tiburse Savoie and Malvina Bergeron | Jeanne Octavie | probable |
| Oscar Paul Bakke and Olga Josephine Doely | Verna; Paul; Ione | Verna verified; siblings' parent links probable |
| Martin H. Bakke and Olava Olausdatter Dukleth | Oscar | verified from transcription; original not inspected |
| Hans Hansen Bakke and Ingeborg Skore | Martin | verified from transcription |
| Olaus Paulsen Dukleth and Grethe Pauline Pedersdatter Melhus | Olava | probable |
| Nicolai Ingvaldsen Doely and Serine/Serina Roble | Olga; Styrek | Olga probable; Styrek verified by transcription |
| Ingvald Throndsen Doely and Helene Blexrud | Nicolai; unnamed children | Nicolai probable; unnamed children are collateral evidence |
| Rejected Lucius John family | Arthur and Marie Eve → Lucius John | internally documented candidate family; not attached to Rita |
| Rejected Julien family | Jules Onezime and Marie Doralise → Julien | internally documented candidate family; not attached to Allen's Jules |
| Rejected Allen Bernard family | Edward and Elisa → Allen Bernard | internally documented candidate family; not attached to Allen Paul |
| Rejected Allen Joseph family | Rene and Elleda → Allen Joseph | internally documented candidate family; not attached to Allen Paul |
| Unrelated historical context | Louis Léopold → Henri Alfred; Even Heg → Hans Christian Heg | contextual only; not attached to Michael |

Rita's eleven and Verna's eight named grandchildren are verified at grandchild level, but most intermediate parent-child edges are not mapped. Do not derive those edges from surname, list order, or another obituary.

### Spouse, partner, and co-parent groups — 35 archived rows

| Couple or grouping | Preserved status |
|---|---|
| Aubin Buquet — Paulette Comeaux | co-parents only; marriage/partnership unresolved |
| Edmond P. Buquet — Verna Arlene Bakke | verified spouses; event details unknown |
| Allen Paul Comeaux Sr. — Rita LeBlanc | probable spouses |
| Lucuis LeBlanc — Philomene Comeaux | verified spouses |
| Lucuis LeBlanc — Euchariste Dugas | verified as Rita's parents; partnership type unresolved |
| Jules Comeaux — Joesette R. Comeaux | verified household couple; marriage unresolved |
| Moise J. Dugas — Emma Miller | probable spouses |
| Marcel Dugas — Marie Ruffin Plaisance | probable spouses |
| Marcellin Dugas — Melanie Boudreaux | probable spouses |
| Joseph Simon Dugas — Céleste Dugas | probable spouses; 1794 event reported |
| Charles Dugas — Marguerite Granger | probable spouses |
| Claude circa 1702 — Anne Hébert | probable spouses |
| Claude circa 1677 — Jeanne Bourg | probable spouses |
| Claude circa 1649/1652 — Françoise Bourgeois; later Marguerite Bourg | probable first/second-wife chronology |
| Abraham Dugas — Marguerite Doucet | probable spouses |
| Jean Dugas — Marguerite Dupuis | probable spouses |
| Adolphe Miller — Marie Emma/Emma Boudreaux | probable spouses; Josephine conflict |
| George Charles Miller — Pauline Savoie | probable spouses |
| Rella LeBlanc Constantine — Ray | probable reported spouses |
| Allen Paul Comeaux Jr. — Monica | probable reported spouses |
| Peggy Comeaux Miller — Clarence | probable reported spouses |
| Priscilla Comeaux/Babineaux/LeBlanc — Karlon; later Tippy LeBlanc | both obituary forms retained; chronology unresolved |
| Paulette Comeaux Wheeler — Jim | probable reported spouses; Jim's surname unresolved |
| Aubin Vincent Buquet — Lena Maronge | verified spouses |
| Quentin Alcide Augustin Buquet — Jeanne Octavie Savoie | probable spouses |
| François Luc Théodore Buquet — Céleste Félonise LeBlanc | probable spouses |
| François Michel Jacques Buquet — Marie Anne Henry | probable spouses |
| Marcelin Tiburse Savoie — Malvina Bergeron | probable couple/parents; event uninspected |
| Oscar Paul Bakke — Olga Josephine Doely | verified couple; 1920 marriage probable |
| Martin H. Bakke — Olava Olausdatter Dukleth | verified couple |
| Hans Hansen Bakke — Ingeborg Skore | verified couple; details secondary/probable |
| Olaus Paulsen Dukleth — Grethe Pauline Pedersdatter Melhus | probable spouses |
| Nicolai Ingvaldsen Doely — Serine/Serina Roble | probable spouses; couple supported through a child |
| Ingvald Throndsen Doely — Helene Blexrud | probable couple |
| Rejected/unattached couples | Lucius John–Florence; Julien–Coralie; Allen Bernard–Cleida; Allen Joseph–Barbara; possible Elton–Edmonia |

Relationship type, relationship confidence, event confidence, and person-identity confidence are separate fields. A verified couple does not imply a known marriage date or place.

## Event inventory

The five person packets contain **227 claim-table rows using 214 distinct claim IDs**. Those rows include vital events, relationships, residences, census observations, marriages, occupations, military activity, burial, movement, and higher-level identity/ancestry conclusions. They are evidence claims, not 227 independent events.

### Event families represented

| Event family | Archive coverage | Ingestion caution |
|---|---|---|
| Birth and native-place observations | Immediate family; Louisiana Dugas/Miller/Buquet ancestors; Minnesota/Norway Bakke lines | Preserve exact, year-only, circa, range, conflicts, and unknown locality separately. “Native/from” is not always birthplace. |
| Death and funeral | Rita, Allen, Edmond, Verna, numerous ancestors/collaterals | Death date, death place, funeral plan, and burial occurrence are distinct. Scheduled services are not automatic occurrence proof. |
| Burial/cemetery | Rita; Verna; Comeaux, Buquet, Bakke, Dukleth, and Doely relatives | Cemetery association may be verified while plot, date, marker wording, or occurrence remains unknown. Never infer a person's burial from relatives nearby. |
| Marriage/partnership | Couples in the relationship register | No original marriage register image was inspected. Several couples are probable; some are only co-parents or household partners. |
| Census/household | Allen family in 1930; Martin/Olava in 1900; Dugas households in 1698 and 1701 | Original images were not inspected. Context-only 1803 Comeaux and 1880 Buquet surname results do not identify accepted ancestors. |
| Residence/location observations | Cankton, Carencro, Ward One, Dulac, Houma, Spring Grove, Wilmington, Wisconsin, Norway, France, Acadia, and related sites | Preserve the observation date, precision, source wording, and whether it is residence, last residence, native place, event place, or context. |
| Occupation/activity | Verna's nursing and church/community activities; Bakke farming; Buquet seafood/postmaster/business context; Rita's activities | Do not transfer occupations among relatives or convert obituary interests into employment. Edmond's Buquet Canning role remains unknown. |
| Military/draft | Verna's Navy nursing/rank; Robert Buquet's Navy evidence; Aubin Vincent's draft transcription | Draft registration is not service. Allen/Edmond military service is unresolved; same-name relatives/candidates cannot supply it. |
| Immigration/movement | Twelve movement records listed below | Preserve classification and endpoint precision; do not generate routes from endpoints. |
| Land/business/public activity | Bayou Terrebonne land transcription; Buquet Canning/seafood history; A.J. policy activity | Generic-name land identity and individual employment/ownership require separate claims. Goods shipped to Japan are not personal migration. |
| Identity and ancestry conclusions | Rita, Allen, Edmond, Verna claim registers | Preserve reasoning, weak-link confidence, and rejected alternatives; do not turn narrative conclusions into source-free facts. |

### Movement events — 12

| Movement ID | Classification | Subject and endpoints | Status |
|---|---|---|---|
| `movement-dugas-la-bergere-1785` | documented migration/move | Charles Dugas household, France → Louisiana, 1785 | movement transcribed; Joseph-as-Joseph-Simon attachment probable; ports unresolved |
| `movement-hans-bakke-norway-wisconsin-1840` | documented migration/move | Hans Bakke, Ringebu/Gudbrandsdalen → Milwaukee/Muskego, 1840 | probable genealogy; secondary narrative |
| `movement-hans-bakke-wisconsin-minnesota-c1855` | documented migration/move | Hans family, Wisconsin → farm west of Spring Grove, circa 1855 | probable; route/intermediate stops unknown |
| `movement-francois-michel-france-louisiana-pre1819` | strongly inferred move | François Michel, France → Louisiana by 1819 | probable; no route/arrival record |
| `movement-nicolai-serina-norway-minnesota-pre1900` | strongly inferred move | Nicolai and Serina, Norway → Minnesota before 1900 | probable; immigration details absent |
| `movement-olava-verdal-spring-grove-c1870` | separate known locations at different dates, route unknown | Olava, Verdal → Spring Grove, about 1870 | probable endpoints/year; no passenger evidence |
| `movement-martin-bakke-wisconsin-spring-grove` | separate known locations at different dates, route unknown | Martin, Wisconsin → Spring Grove | endpoints supported; individual move unknown |
| `movement-verna-spring-grove-houma` | separate known locations at different dates, route unknown | Verna, Spring Grove → Houma | endpoints verified; timing/cause/route unknown |
| `movement-edmond-dulac-houma` | separate known locations at different dates, route unknown | Edmond, Dulac association → Houma last residence | probable; may not represent a discrete move |
| `movement-rita-cankton-carencro` | separate known locations at different dates, route unknown | Rita, Cankton → Carencro | endpoints verified; timing/route/cause unknown |
| `movement-allen-ward-one-carencro` | separate known locations at different dates, route unknown | Allen, Ward One → Carencro | probable; labels may overlap geographically |
| `movement-marie-louise-plattenville-thibodaux-houma` | separate known locations at different dates, route unknown | Marie Louise, Plattenville → Thibodaux → Houma | probable compiled observations; route unknown |

### Claim-ID collisions requiring normalization IDs

| Reused ID | Immediate-family meaning | Detailed-packet meaning | Treatment |
|---|---|---|---|
| `claim-rita-leblanc-001` | birth | birth | Same subject; canonicalize to detailed claim and retain source provenance. |
| `claim-rita-leblanc-002` | death, place unknown | death at Evangeline Oaks | Same event with later fuller evidence; preserve A1 scope/history. |
| `claim-rita-leblanc-003` | burial | scheduled funeral | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-rita-leblanc-004` | spouse relationship | burial | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-rita-leblanc-010` | Carencro residence | child of Lucuis | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-rita-leblanc-011` | spouse relationship | child of Euchariste | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-rita-leblanc-012` | burial | stepchild of Philomene | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-allen-comeaux-001` | birth | birth | Same event; canonicalize to detailed claim. |
| `claim-allen-comeaux-002` | death month/year | death month/year | Same event; canonicalize to detailed claim. |
| `claim-allen-comeaux-003` | probable exact death day | probable exact death day | Same event; canonicalize to detailed claim. |
| `claim-allen-comeaux-004` | spouse relationship | burial unknown | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-allen-comeaux-010` | spouse relationship | child of Jules | **Semantic collision:** assign distinct normalized claim IDs. |
| `claim-allen-comeaux-011` | military service unresolved | child of Joesette | **Semantic collision:** assign distinct normalized claim IDs. |

Do not edit the research packets to hide these collisions. The normalized layer needs globally unique IDs plus a provenance field for source file and original research claim ID.

## Place inventory

The archive has **53 accepted, probable, contextual, or unresolved place IDs** and **9 excluded/unattached place IDs**. No map coordinates are supplied.

| Region | Place IDs |
|---|---|
| Louisiana and Gulf context (27) | `place-us-la-carencro`; `place-us-la-cankton`; `place-us-la-lafayette-parish-ward-one`; `place-us-la-lafayette-parish`; `place-us-la-st-landry-parish`; `place-us-la-grand-coteau`; `place-us-la-st-charles-borromeo-grand-coteau`; `place-us-la-st-martinville`; `place-us-la-dulac`; `place-us-la-houma`; `place-us-la-terrebonne-parish`; `place-us-la-grand-caillou-area`; `place-us-la-bayou-terrebonne`; `place-us-la-thibodaux`; `place-us-la-plattenville`; `place-us-la-magnolia-cemetery-terrebonne`; `place-us-la-terrebonne-memorial-park`; `place-us-la-first-evangelical-presbyterian-houma`; `place-us-la-st-peter-catholic-cemetery-carencro`; `place-us-la-st-peter-catholic-church-carencro`; `place-us-la-evangeline-oaks-guest-house`; `place-us-la-evangeline-memorial-gardens-chapel`; `place-us-la-st-john-berchmans-cankton`; `place-beau-sejours-unresolved`; `place-us-la-acadiana-region`; `place-us-la-louisiana`; `place-gulf-shrimp-region` |
| Minnesota and Wisconsin (12) | `place-us-mn-spring-grove`; `place-us-mn-spring-grove-township`; `place-us-mn-wilmington-township`; `place-us-mn-houston-county`; `place-us-mn-caledonia`; `place-us-mn-old-trinity-cemetery`; `place-us-mn-hans-bakke-farm-west-spring-grove`; `place-us-mn-minnesota`; `place-us-wi-milwaukee`; `place-us-wi-muskego-area`; `place-us-wi-racine-county-area`; `place-us-wi-wisconsin` |
| Norway (9) | `place-no-ringebu`; `place-no-gudbrandsdalen`; `place-no-tinn`; `place-no-telemark`; `place-no-verdal`; `place-no-inderoy`; `place-no-trondelag`; `place-no-akershus-area-unresolved`; `place-no-norway` |
| France, Acadia, and international (5) | `place-fr-brittany`; `place-fr-france`; `place-historical-port-royal-acadia`; `place-historical-acadia`; `place-jp-japan` |
| Excluded or unattached (9) | `candidate-place-fr-saint-malo`; `candidate-place-fr-nantes-context`; `candidate-place-fr-charmes-vosges-lorraine`; `candidate-place-fr-northern-buquet-distribution`; `candidate-place-us-la-montegut`; `candidate-place-us-la-new-orleans`; `candidate-place-us-la-delcambre`; `candidate-place-china-burma-india-theater`; `candidate-place-canary-islands` |

Country, region, parish/county, town, exact named site, and unresolved institution are different precisions. Exact named location does not imply exact coordinates or street address. Excluded places remain negative evidence and must not appear as family journey nodes.

## Source inventory

The archive contains **87 proposed stable sources or source sets**. Packet aliases listed in `source-inventory.md` refer to these entries and must not be counted as additional sources.

| Category | Stable source IDs |
|---|---|
| Family-provided (2) | `SRC-A1-FAMILY-CURRENT`; `SRC-FAMILY-EXPLAIN-CHAT` |
| Census (6) | `SRC-ALLEN-CENSUS-PROFILE`; `SRC-VERNA-1900-CENSUS`; `SRC-CENSUS-1698`; `SRC-CENSUS-1701`; `SRC-ALLEN-CARENCRO-1803-CENSUS`; `SRC-EDMOND-1880-CENSUS-CONTEXT` |
| Civil/church/marriage (4) | `SRC-LUCUIS-MEMORIAL`; `SRC-MARCELLIN-BAPTISM-TRANSCRIPTION`; `SRC-JOSEPH-CELESTE-MARRIAGE`; `SRC-ST-CHARLES-INDEXED` |
| Death/directory (9) | `SRC-ALLEN-DEATH-INDEX-DIRECTORY`; `SRC-ALLEN-DEATH-INDEX-DAY`; `SRC-EDMOND-DEATH-DIRECTORY`; `SRC-VERNA-OSCAR-DEATH`; `SRC-VERNA-MARTIN-DEATH`; `SRC-VERNA-OLGA-DEATH`; `SRC-VERNA-STYREK-DEATH`; `SRC-A1-PAULETTE-LAFAYETTE`; `SRC-EDMOND-BUQUET-DISTRIBUTING` |
| Obituary/funeral/newspaper (8) | `SRC-RITA-OBIT-ADVERTISER`; `SRC-RITA-FUNERAL-NOTICE`; `SRC-PHILOMENE-OBIT`; `SRC-EDMOND-EVE-OBITUARY`; `SRC-EDMOND-MAY-OBITUARY`; `SRC-VERNA-OBITUARY`; `SRC-ALLEN-BERNARD-OBITUARY`; `SRC-ALLEN-JOSEPH-OBITUARY` |
| Cemetery/burial/military (7) | `SRC-ALLEN-JULES-CEMETERY`; `SRC-ALLEN-MRS-JULES-CEMETERY`; `SRC-EDMOND-MAGNOLIA-CEMETERY`; `SRC-VERNA-VETERANS-BURIAL`; `SRC-EDMOND-ROBERT-VETERAN`; `SRC-VERNA-OLD-TRINITY`; `SRC-EDMOND-AUBIN-DRAFT` |
| Immigration/migration (3) | `SRC-LA-BERGERE-PASSENGERS`; `SRC-VERNA-SETTLER-HISTORY`; `SRC-EDMOND-UPPER-BRITTANY-SAILORS-LEAD` |
| Other primary/primary-derived (6) | `SRC-EDMOND-LAND-TRANSCRIPTION`; `SRC-EDMOND-AJ-POLICY`; `SRC-EDMOND-TGS-INDEX`; `SRC-EDMOND-CELESTE-INDEX`; `SRC-EDMOND-LENA-DULAC-RECORD`; `SRC-EDMOND-EARLY-BUQUET-NAME-INDEX` |
| Genealogy databases/compilations (24) | `SRC-ALLEN-RITA-TREE`; `SRC-EMMA-MILLER-FS`; `SRC-MARCEL-DUGAS-FS`; `SRC-MARCELLIN-GENEALOGY`; `SRC-JOSEPH-SIMON-GENEALOGY`; `SRC-CLAUDE-1677-GENEALOGY`; `SRC-CLAUDE-1649-GENEALOGY`; `SRC-JOSEPH-EXILE-GENEALOGY-A`; `SRC-ABRAHAM-GENEALOGY-A`; `SRC-ABRAHAM-GENEALOGY-B`; `SRC-CELESTE-PARENTS`; `SRC-MILLER-ANCESTRY`; `SRC-LUCIUS-JOHN-REJECTED`; `SRC-ALLEN-JULES-PARENT-CLUE`; `SRC-ALLEN-JULIEN-REJECTED`; `SRC-ALLEN-ALTON-ELTON-CLUES`; `SRC-EDMOND-AUBIN-GENEALOGY`; `SRC-EDMOND-QUENTIN-GENEALOGY`; `SRC-EDMOND-FRANCOIS-GENEALOGY`; `SRC-EDMOND-MARIE-LOUISE-GENEALOGY`; `SRC-VERNA-COMPILED-BAKKE`; `SRC-VERNA-COMPILED-DUKLETH`; `SRC-VERNA-COMPILED-DOELY`; `SRC-RITA-PLAISANCE-CANARY-LEAD` |
| Secondary/context (14) | `SRC-A1-GINA-WAYNE-STATE-BIO`; `SRC-A1-GINA-MERCYHURST-BIO`; `SRC-EDMOND-ASPA-BUSINESS`; `SRC-EDMOND-CAJUN-CONTEXT`; `SRC-EDMOND-SURNAME-HISTORY`; `SRC-EDMOND-SAINT-MALO-ACADIAN-CONTEXT`; `SRC-EDMOND-NAPOLEONIC-LOUIS`; `SRC-EDMOND-NAPOLEONIC-CHARLES`; `SRC-EDMOND-NAPOLEONIC-HENRI`; `SRC-EDMOND-NAPOLEONIC-FAMILY`; `SRC-EDMOND-BUQUET-LUCIEN-BIO`; `SRC-EDMOND-BUQUET-NARCISSE-BIO`; `SRC-VERNA-SPRING-GROVE-HISTORY`; `SRC-JOSEPH-EXILE-GENEALOGY-B` |
| Research syntheses (4) | `SRC-RITA-RESEARCH-SYNTHESIS`; `SRC-ALLEN-RESEARCH-SYNTHESIS`; `SRC-EDMOND-RESEARCH-SYNTHESIS`; `SRC-VERNA-RESEARCH-SYNTHESIS` |

Source records need evidence class, inspection status, URL and/or preserved handle, reliability notes, supported claims, and aliases. A source set must remain a set until its members can be identified safely. Research synthesis is provenance, not independent evidence.

## Confidence and uncertainty vocabulary

### Genealogical confidence

- `verified`: strong direct support or secure convergence of independent records.
- `probable`: evidence favors the claim, but a direct record or crucial identity link is missing.
- `unresolved`: the archive cannot choose responsibly or found no support.

No other genealogical confidence values are permitted. `rejected`, `unattached`, `contextual`, and `research-only candidate` are dispositions or roles. Source inspection status and evidence class are separate from both confidence and disposition.

### Date uncertainty

The ingestion model must preserve exact dates, year-only dates, month/year, circa, before, after, ranges, conflicting alternatives, scheduled events, and unknown values. Sort intervals or machine dates may be derived, but they must not replace the historical expression.

### Relationship uncertainty

Person identity, edge existence, relationship type, and relationship-event details may have different confidence. Examples include verified co-parenthood with unresolved marriage, verified maternity with probable paternity, and a verified cemetery destination with an unknown burial date.

## Unresolved identity and duplicate-person issues — 25

| # | Identity issue | Required ingestion treatment |
|---:|---|---|
| 1 | Michael Buquet, archive reference person, versus Michael Buquet, Edmond and Verna's son | Keep `person-michael-buquet` and `person-michael-buquet-edmond-child` separate. |
| 2 | Aubin Buquet versus Aubin Vincent Buquet (1887–1953) | Keep separate; never transfer elder Aubin's business/draft facts to Michael's father. |
| 3 | Edmond P. “Bud” Buquet; Verna's grandson Edmond “Bud”; Rita's grandson Bud Buquet | Keep all three records separate pending direct family mapping. |
| 4 | Gina Nevils/Gina Buquet across biographies and both obituary groups | One identity is probable, but retain alternate forms and unproved intermediate edges. |
| 5 | Sid Roger across Rita's and Verna's grandchild lists | Possible duplicate; do not merge without the intermediate parent mapping. |
| 6 | Philomene Comeaux's two person IDs | Use `person-philomene-comeaux`; retain `person-philomene-comeaux-1916` as an alias. |
| 7 | Allen Comeaux family form versus Allen Paul Comeaux Sr. | Same identity is probable, not original-record verified; preserve middle-name/suffix uncertainty. |
| 8 | Allen Paul versus Allen Bernard and Allen Joseph Comeaux | Keep rejected same-name candidates separate; never transfer their service, occupation, parents, spouses, or places. |
| 9 | Jules Comeaux versus Julien Comeaux and mixed Jules Omer evidence | Keep Jules accepted; Julien rejected; Jules Omer unattached until originals resolve parentage. |
| 10 | Joesette R. versus `Mrs. Jules Comeaux`; Joesette/Josette/Josephine and date variants | Probable equation only; preserve source forms and unresolved maiden name. |
| 11 | Alton Comeaux versus Elton candidates | Do not merge. Alton/Elton equivalence and Edmonia partnership remain unresolved. |
| 12 | Lucuis LeBlanc versus Lucius John and searched Louis/Lucien variants | Keep Lucuis accepted and Lucius John rejected; variants alone do not merge. |
| 13 | Rella's status as Rita's paternal half-sister | Preserve probable relationship; do not upgrade from obituary wording. |
| 14 | Priscilla Comeaux/Babineaux/LeBlanc and Karlon/Tippy chronology | Preserve all recorded forms and relationships without ordering them by inference. |
| 15 | Marie Emma/Emma Boudreaux versus Josephine Boudreaux | Preserve conflict; do not create or merge a separate Josephine ancestor without record review. |
| 16 | Three adjacent Claude Dugas generations | Keep distinct by stable ID and circa generation; never collapse by name. |
| 17 | Jeanne Bourg versus Marguerite Bourg | Distinct women in adjacent family context; keep separate. |
| 18 | Marcel Dugas versus Marcellin/Marcelin Dugas | Keep father and son distinct. |
| 19 | Céleste Dugas versus Céleste Félonise LeBlanc | Distinct branches/people; keep separate. |
| 20 | Quentin/Alcide/Iventin Augustin Buquet forms | One probable person with unresolved canonical name details; retain every source form. |
| 21 | François Michel Jacques versus Upper Brittany same-name result and generic landowner | Accepted immigrant, rejected/unattached search result, and probable land-record equation must remain separable. |
| 22 | Lena Maronge; Lena Comeaux; Lena Marie Buquet | Three distinct people; stable IDs are mandatory in every reference. |
| 23 | Nicolai/Nicoli; Serine/Serina; Roble/Robble; Doely/Doley/Doli | Preserve variants with source attribution; do not create duplicate people solely from spelling. |
| 24 | Olaus/Olava and Dukleth/Duklet/Duklith/Dukleith | Separate Olaus from Olava; attach spelling variants to the correct identity/source. |
| 25 | Paul Bakke/Paul Oswald Bakke and Ione Kjome/probable Ione Bakke | Preserve the verified sibling forms and probable expanded/birth forms separately. |

## Contradictory claims and packet drift — 20

| # | Conflict or drift | Required treatment before/during normalization |
|---:|---|---|
| 1 | Philomene stable ID duplicated | Apply the documented alias; do not duplicate the person. |
| 2 | Rita death place unknown in A1, Evangeline Oaks in A2/A8 | Use later detailed evidence while retaining the A1 scope limitation as provenance. |
| 3 | Verna cemetery absent from A1 excerpt, Terrebonne Memorial Park in A5/A8 | Treat as later evidence expansion, not a competing burial place. |
| 4 | Verna→Aubin probable in A1, verified in A5 | Use detailed-packet confidence and retain earlier assessment history. |
| 5 | Edmond→Aubin remains probable while Verna→Aubin is verified | Keep separate parent edges and separate confidence. |
| 6 | Rita's St. Peter burial called verified, but notices describe planned interment | Preserve cemetery destination strength and occurrence/date limitation separately. |
| 7 | A.J. policy source called original image in A4, more cautiously described in A9 | Use A9 inspection status until reacquired. |
| 8 | Early Buquet source assigned to synthesis in A7, precise source ID created in A9 | Use `SRC-EDMOND-EARLY-BUQUET-NAME-INDEX`; retain old reference as alias/history. |
| 9 | Oscar Bakke birth year 1884 versus 1885 | Store alternatives; prefer 1884 only as the packet's current interpretation. |
| 10 | Martin Bakke birth year 1853, 1854, or 1855 | Store all alternatives and source attribution. |
| 11 | Olava birth about 1853 versus 1855; surname variants | Preserve range/alternatives and source-specific names. |
| 12 | Céleste Dugas birth circa 1778 versus 1779 | Preserve circa alternatives. |
| 13 | Claude Dugas birth circa 1649 versus 1652 | Preserve circa alternatives. |
| 14 | Abraham Dugas death 1698 versus before 1700 | Preserve both; do not manufacture an exact date. |
| 15 | François Michel birth about 1785 versus 1786; Saint-Malo retracted | Preserve year alternatives; normalize France only; Saint-Malo remains excluded. |
| 16 | Edmond versus one family use of Edmund | Canonical display `Edmond`; preserve `Edmund` as a source-specific alternate. |
| 17 | Allen death June 1985 versus probable 1 June 1985 | Represent month/year as stronger and exact day as probable alternative/refinement. |
| 18 | Paulette surnames Comeaux, Comeaux Buquet, Wheeler, Comeaux Wheeler | Preserve name forms; do not infer chronology or relationship events. |
| 19 | Rita compiled middle initial `M.` versus family recollection of no middle name | Canonical display omits middle name; preserve the unresolved initial claim. |
| 20 | Dulac/Houma, Cankton/Carencro, Ward One/Carencro observations | Treat as dated/typed location observations, not automatic conflicts or documented moves. |

## Incomplete records

### Open-question load

| Classification | Count | Modeling consequence |
|---|---:|---|
| Likely requires archival/local records | 55 | Normalize the current claim with uncertainty; retain the requested future evidence. |
| Requires family knowledge | 19 | Keep sparse or unresolved; do not substitute public same-name data. |
| Potentially answerable through additional online research | 11 | Preserve as open work; do not run new research during ingestion. |
| Blocked by inaccessible records | 10 | Retain citation handles, indexed references, and the exact access limitation. |
| Genuinely unknown at present | 2 | Represent unknown directly; do not generate placeholders that look factual. |

### Record classes not inspected in original form

- Civil birth certificates and baptism/register images
- Marriage licenses and church marriage registers
- Census images
- Death certificates and original death-register images
- Cemetery registers and marker images
- Passenger-list images
- Naturalization records
- Norwegian parish, emigration, and farm-book originals
- Military personnel files

Current evidence is therefore often a transcription, index, compiled profile, obituary, history, or family statement. This is not a reason to discard it; it is a required inspection-status field.

### Evidence-only people and groups

The following should remain source annotations, unresolved source forms, or explicitly modeled anonymous groups unless a later task defines a safe anonymous-entity strategy:

- `Mrs. Jules Comeaux`, probably Joesette R.
- `Josephine Boudreaux`, a conflicting form/possible merge for Marie Emma
- the Upper Brittany same-named François Michel result
- unnamed infant of Aubin Vincent and Lena Maronge
- unnamed children of Ingvald and Helene
- unnamed spouse in the `M/M Lucuis LeBlanc` memorial
- unnamed great-grandchildren in Verna's obituary
- unnamed same-name candidates for Hans Bakke's parents

Angie Lietzau is a source transcriber, not a genealogy subject.

### Structurally sparse accepted people

- Michael: birth details intentionally absent; parent links family-provided.
- Aubin Buquet: birth, middle name, places, occupation, and partnership details absent.
- Paulette: birth date/place and surname/relationship chronology unresolved.
- Lucuis: parents, vital chronology, burial, and earlier line unresolved.
- Allen: exact identity form remains probable; death place, burial, marriage, occupation, military service, and later censuses unresolved.
- Jules and Joesette: earlier ancestry unresolved; Joesette's complete identity absent.
- Edmond: middle initial, birthplace, exact death, burial, marriage, occupation, military service, and census history unresolved.
- Verna: death place, marriage, movement chronology, nursing education/employment, full service record, and censuses unresolved.
- Lena Maronge, Céleste Félonise, Marie Anne Henry, Marcelin Tiburse Savoie, Malvina Bergeron, Ingeborg Skore, Grethe Melhus, Serine Roble, Ingvald Doely, and Helene Blexrud are explicitly insufficient in the paternal audit.

## Uncertain geographic precision

1. **Dulac/Houma:** Edmond's undated family “from” association and 1986 last residence; not birth/death places or a documented move.
2. **Carenco/Carencro:** one place with family and modern spellings; not duplicate place records.
3. **Spring Grove:** settlement, township, area, farm west of town, Wilmington Township, and Houston County must remain distinct levels.
4. **Muskego/Racine County:** historical area wording is not mapped to reconstructed modern boundaries.
5. **France/Saint-Malo:** France is the accepted narrowest origin for François Michel; Saint-Malo is retracted and excluded.
6. **Port Royal/Acadia:** historical labels are established; modern administrative equivalence was not.
7. **Akershus:** only an area-level Doely/Blexrud hypothesis, not a birth parish, farm, or migration endpoint.
8. **Beau Sejours:** institution named, but locality, jurisdiction, facility type, and coordinates unresolved.
9. **Magnolia Cemetery:** Terrebonne context established; exact municipality, plots, and Edmond association unresolved.
10. **Louisiana arrivals:** the Dugas passenger transcription and François Michel research establish no specific landing port or first residence.
11. **Hans Bakke farm:** “160 acres four miles west of Spring Grove” is a historical description, not a geocoded parcel.
12. **Ward One/Carencro:** may represent overlapping geography rather than a discrete Allen move.

Any future geometry needs a separate provenance and precision value. A convenient centroid must never be displayed as an exact historical point.

## Source incompleteness and alias handling

- Many `turn…` citation handles have no recoverable destination URL.
- Some stable entries are source sets because the original chat did not expose a safe one-to-one bibliography.
- `SRC-A1-PAULETTE-LAFAYETTE` lacks exact record type, date, repository, and URL.
- Marcellin baptism and Joseph–Céleste marriage results lack complete repository/volume/page data.
- The indexed *Terrebonne Life Lines* articles were not inspected.
- Public URLs are not guaranteed to remain available or unchanged.
- Packet source aliases in `source-inventory.md` must resolve to the 87 stable entries rather than becoming duplicates.

## Normalization preconditions

These are requirements for the future normalization task, not requests to resolve genealogy first:

1. Define globally unique normalized claim/event/relationship IDs and preserve each original packet ID plus source-file provenance.
2. Apply the Philomene person alias and the source alias register deterministically.
3. Model accepted people, research-only candidates, rejected identities, contextual people, and anonymous evidence groups separately.
4. Store relationship edges individually with relationship type and confidence; do not infer missing parents between grandparents and named grandchildren.
5. Represent date expressions structurally, including alternatives and scheduled-versus-occurred semantics.
6. Represent place precision independently from claim confidence and geometry precision.
7. Preserve all three movement classifications verbatim and forbid generated routes for endpoint-only observations.
8. Attach source evidence class, inspection status, reliability notes, citation handle/URL, and aliases to every normalized source.
9. Carry the 20 conflict/drift groups and 25 identity merge guards into validation fixtures.
10. Validate that candidates and excluded places cannot enter accepted lineage or journeys accidentally.
11. Decide how living-person publication/privacy will be handled before any public product release; it need not be guessed during internal normalization.
12. Keep the transformation offline and reviewable. Production code imports normalized output and never scrapes `research/`.

## Audit conclusion

No source formatting defect justified rewriting a completed research packet. The archive is internally navigable and comprehensive as a first-pass handoff. The future model must ingest it as a claim-and-evidence graph with explicit uncertainty, not as a conventional flat family tree.
