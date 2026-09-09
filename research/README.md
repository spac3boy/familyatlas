# Family History research archive

> **Repository boundary**
>
> `research/` = **human-readable research archive and evidence trail**
>
> `src/data/` or equivalent = **normalized application data consumed by the website**
>
> The application must never scrape or parse research prose at runtime.

## Purpose and current status

This directory preserves the Family Atlas genealogy research handoff: evidence, family-provided information, reasoning, uncertainty, conflicts, rejected identities, source references, geographic precision, and future research paths. It is designed for human review and for a deliberate later normalization step, not for direct application consumption.

A0–A11 are complete. The archive is ready for normalization as a **first-pass research handoff**, not as a proof-standard or fully resolved genealogy. Important claims remain probable or unresolved, and many underlying original records were not inspected. The A0–A11 sequence itself created no application dataset or website code; later C-series implementation uses a separate normalized layer and adds dated family-intake records without rewriting the original packets.

## Archive structure

```text
research/
  README.md                   Archive policy, structure, and handoff status
  packet-template.md          Standard format for person research packets
  chat-inventory.md           Accessible Family History project-chat inventory
  manifest.json               Machine-readable inventory of this research archive
  open-questions.md           Completeness, conflict, and unresolved-question audit
  family-intake/              Dated, application-era statements supplied directly by Michael
  people/
    00-immediate-family.md    Michael, parents, and four grandparents
    rita-leblanc.md           Complete Rita LeBlanc research packet
    allen-comeaux.md          Complete Allen Comeaux research packet
    edmond-p-buquet.md        Complete Edmond P. Buquet research packet
    verna-arlene-bakke-buquet.md
                              Complete Verna Bakke Buquet research packet
  branches/
    maternal-ancestors.md     Maternal-line completeness layer
    paternal-ancestors.md     Paternal-line completeness layer
  places/
    family-geography.md       Place, precision, and movement archive
  sources/
    source-inventory.md       Consolidated source and evidence inventory

src/data/ or equivalent       Future normalized application data; not yet created
```

The detailed person packet owns person-level reasoning. Branch files preserve deeper and collateral people without duplicating full biographies. The geography file owns place precision and movement classifications. The source inventory owns consolidated source metadata and aliases. `open-questions.md` is the A10 completeness and discrepancy audit. `family-intake/` preserves later explicit family statements as dated addenda. `manifest.json` inventories the archive as it stood at the end of A11; it is a historical handoff snapshot, not genealogy application data or a live filesystem index.

The four `.gitkeep` files are legacy directory placeholders from A0. Their old “intentionally empty” text is non-authoritative now that those directories are populated; they are listed in the manifest only for complete filesystem accounting.

## Research methodology

- Re-read the relevant original Family History project chats rather than treating prior Codex summaries as evidence.
- Preserve explicit family information as `family-provided`; do not present it as independently verified merely because it is credible.
- Separate a source's literal content from identity matching and genealogical inference.
- Give every important claim a confidence state and source reference.
- Prefer the most direct and contemporary evidence available, while recording whether an original image, a transcription, an index, a compilation, or only a reference was actually inspected.
- Keep later corrections alongside the superseded claim so the reasoning history remains auditable.
- Treat a relationship path as no stronger than its weakest link. A probable parent-child bridge makes every earlier ancestry claim depending on it probable.
- Distinguish an exhausted open-web/indexed search from exhausted archival research. The former does not imply that no evidence exists.
- Never infer missing genealogy merely to complete the tree.

## Confidence states

Only these three genealogical confidence states are used:

- **verified:** directly supported by a strong record, or by multiple independent records whose identity match is secure.
- **probable:** the evidence favors the claim, but a direct record, original image, or crucial identity link is missing.
- **unresolved:** the archive cannot choose responsibly among possibilities, or no supporting evidence was located.

`Rejected`, `unattached`, `contextual`, and `research-only candidate` describe disposition or role, not additional confidence states. A source transcription can accurately report a record while its attachment to Michael's family remains only probable.

## Dates and historical uncertainty

- Preserve exact dates, year-only dates, `circa`, `before`, `after`, ranges, and unknown dates as distinct values.
- Do not replace conflicting historical years with a single exact year merely for convenience.
- Record the preferred interpretation only when the evidence supports it, and retain competing values and their sources.
- A scheduled funeral, burial, or other announced event is evidence of the plan; it is not automatically occurrence-level proof.
- Historical calendars, spelling practices, transcription errors, and age estimates may make relationship evidence stronger than exact date precision.

## Canonical names, maiden names, and alternate forms

- A canonical name is the best-supported working label for one person; it is not a claim that every component is proved by an original birth record.
- Preserve birth or maiden surnames separately from married, later-used, nickname, abbreviated, accented, and spelling-variant forms.
- Do not infer a birth surname from a spouse's surname, an obituary heading, or `Mrs. {spouse}` wording.
- Do not expand initials, nicknames, patronymics, or middle names without evidence.
- Alternate spellings remain attached to their sources. Similar names, shared surnames, or nearby geography do not establish identity.
- When name forms may represent different people, keep the identities separate until evidence supports a merge.

## Stable identifiers

Person IDs use lowercase ASCII kebab case:

```text
person-{given}-{middle-if-known}-{birth-surname}-{birth-year-if-needed}
```

Rules:

1. IDs are immutable after assignment.
2. Omit titles, married surnames, punctuation, and uncertain name parts.
3. Add a birth year or another neutral disambiguator only when needed.
4. Do not encode confidence in an ID.
5. Research-only rejected or unattached people use `candidate-*` IDs and must never be silently promoted or merged.
6. Place IDs use `place-*`; excluded or unattached places use `candidate-place-*`.
7. Source IDs use `SRC-{BRANCH-OR-PERSON}-{SHORT-DESCRIPTOR}`; claim IDs use `claim-{person-key}-{sequence}`.
8. Source aliases remain valid references and are consolidated in `sources/source-inventory.md` rather than rewriting completed packets.

The final consistency audit found two proposed IDs for Philomene Comeaux. Under the immutability rule, the earlier detailed-packet ID `person-philomene-comeaux` is retained as the canonical research ID; the later `person-philomene-comeaux-1916` is a compatibility alias. This repository-level alias does not resolve or alter any genealogical claim.

## Source and citation handling

- Preserve the fullest citation actually available: title or description, record type/date, jurisdiction, repository, URL or original handle, people represented, claims supported, evidence class, inspection status, reliability, and contradictions.
- Use exact URLs when recoverable. Never manufacture a URL, title, volume, page, repository, or record type to make a citation look complete.
- A ChatGPT citation handle such as `turn…search…` is a retrieval handle, not a public URL. Preserve it when the destination URL is unavailable and state that limitation.
- Keep bundled source sets intact when the original chat does not expose enough metadata to split them safely.
- A research synthesis preserves reasoning and stopping points but is not independent evidence and never replaces the underlying source.
- Distinguish original records/images from derivative indexes/transcriptions, compiled genealogies, obituaries, secondary histories, and family-provided information.
- Use `sources/source-inventory.md` as the consolidated source authority and `chat-inventory.md` to locate the original project chats when a claim needs rechecking.

## Geographic precision

- Record the narrowest supported level: exact named site, town/city, parish/county, state/province/region, country, probable location, or location mentioned without enough precision.
- A town does not imply an address, household, hospital, church, cemetery, birthplace, death place, or continuous residence.
- Keep historical names distinct from modern administrative equivalents unless the archive documents the conversion.
- Preserve family wording and spelling alongside the preferred modern form where appropriate, such as `Carenco` and `Carencro`.
- Excluded places and surname-distribution locations remain research guardrails; they are not family-journey nodes.

## Migration-evidence rules

Every movement must use one of the archive's three classifications:

- **documented migration/move:** a source explicitly describes the movement.
- **strongly inferred move:** supported locations at different times require geographic change if both observations are correct, but no source states the route or move.
- **separate known locations at different dates, route unknown:** both endpoints are known, but a discrete move, timing, route, intermediate stops, or cause is not established.

Two location observations must never be converted into a documented migration route. Movement of goods, military context, surname distribution, and relatives' locations are not personal migration evidence.

## Rejected identities and false leads

- Preserve rejected people, mixed records, famous-surname matches, false geographic origins, and failed hypotheses with the reason they were considered and rejected.
- Keep facts belonging to rejected candidates out of accepted people. In particular, occupations, military service, spouses, parents, and places may not transfer merely because names match.
- An unattached candidate remains outside the family tree until a source proves the missing relationship.
- Surname meaning, ethnicity, culture, community history, and proximity may guide research but cannot supply a missing parent-child link.

## Normalization handoff rules

Normalization must be an explicit, reviewed transformation from this evidence archive into `src/data/` or an equivalent application-data directory. The normalized model should retain stable IDs, confidence, source links, alternate values, and exclusion safeguards appropriate to the product, while selecting only claims justified by the archive.

The website may import normalized JSON, TypeScript, database records, or another defined data format. It must never scrape Markdown, parse packet prose, or infer relationships from directory structure at runtime. Research files may be linked for human provenance, but they are not an application API.

No missing parent, spouse, child, date, place, journey, occupation, military event, or ancestral generation may be invented to make the normalized tree look complete.

## Handoff status and precedence

Current archive coverage is summarized in `manifest.json` and audited in `open-questions.md`: 104 genealogically relevant identities represented by 105 pre-alias person IDs, 36 named research-only candidate identities, 53 accepted/probable/contextual/unresolved place IDs, 9 excluded/unattached place IDs, and 87 proposed stable source or source-set entries.

When files differ because later tasks exposed more evidence, use this precedence while preserving the earlier statement as research history:

1. The latest detailed person packet for person-level facts and reasoning.
2. Branch audits for completeness, collateral people, and relationship-path coverage.
3. `places/family-geography.md` for place precision and movement classification.
4. `sources/source-inventory.md` for consolidated source metadata, inspection status, and aliases.
5. `open-questions.md` for unresolved conflicts, packet drift, and exhausted searches.
6. This README and `manifest.json` for archive policy, navigation, and current handoff status.

If a material dispute remains, return to the original source chat or underlying record; do not resolve it by file precedence alone.

## Final status

The research handoff is **ready for normalization with unresolved claims preserved**. It is not authorization to create application data, build the website, perform new research, or silently reconcile the conflicts listed in `open-questions.md`.
