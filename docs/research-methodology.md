# Research methodology bridge

This document tells application contributors how to use the completed research archive. It does not replace or amend [research/README.md](../research/README.md), which is authoritative for research structure and evidence handling.

## Archive authorities

| Need | Read |
|---|---|
| Policy, confidence, IDs, names, dates, places, and migration rules | `research/README.md` |
| Person-packet structure | `research/packet-template.md` |
| Original Family History chat retrieval | `research/chat-inventory.md` |
| Person-level facts and reasoning | Owning file under `research/people/` |
| Deeper/collateral coverage | Owning file under `research/branches/` |
| Place precision and movement classification | `research/places/family-geography.md` |
| Consolidated source metadata and aliases | `research/sources/source-inventory.md` |
| Conflicts, gaps, and exhausted searches | `research/open-questions.md` |
| Coverage and handoff state | `research/manifest.json` |

When a material conflict cannot be resolved from the archive, return to the relevant original chat or underlying record. A prior Codex summary is not a substitute for the source material.

## Evidence discipline

- Separate what a source literally reports from identity matching and genealogical inference.
- Keep family-provided information labeled. Firsthand confirmation by Michael can establish a close-family relationship without becoming independent documentary evidence.
- Use only `verified`, `probable`, or `unresolved` for genealogical confidence. Use `family-confirmed` and `documented` separately for claim provenance.
- Allow both provenance kinds on one claim when the cited family statement and external record each support it; never derive one kind from the other.
- Preserve later corrections alongside superseded values and rejected hypotheses.
- Treat every relationship path as no stronger than its weakest link.
- Distinguish directly inspected originals from indexes, transcriptions, compilations, obituaries, histories, and references to inaccessible records.
- Never invent missing bibliography, URLs, genealogy, or event details.

## Historical information

Dates retain exact, year-only, circa, before, after, range, conflicting, and unknown forms. Names retain maiden/birth forms, married forms, initials, nicknames, accents, and source-specific spellings without unsupported expansion. Similar names and nearby places do not prove identity.

Geography uses the narrowest supported precision. A town is not an address, church, cemetery, hospital, or continuous residence. Two places at different dates do not establish a route or documented move.

## Sources and handles

Use stable source IDs when transferring claims. Preserve an exact public URL when the archive has one. A `turn…search…` or similar ChatGPT handle is a retrieval handle only and must not be presented as a public citation. Missing destination URLs remain missing.

Research syntheses explain reasoning and stopping points but are not independent evidence. Rejected or unattached identities remain available as negative merge evidence and never become relatives through normalization alone.

## Application handoff

Normalization is an explicit offline development step from research evidence into typed application data. It must preserve stable IDs, confidence, uncertainty, precision, sources, conflicts, aliases, and exclusion safeguards. The C3 contracts in `src/types/genealogy.ts` encode those distinctions, and `src/lib/genealogy/validation.ts` checks structural integrity and blocks accepted lineage edges to non-accepted people. These files define and validate the handoff shape; they do not replace historical review or contain family records. Application tasks must not edit completed research packets unless the user specifically authorizes research work.

C20A adds claim-level provenance without rewriting the historical research packets. `family-confirmed` means Michael supplied a firsthand close-family fact; `documented` means the claim has external documentary or published support. These are not confidence grades. A family-confirmed close relationship may be verified as a relationship while its parentage subtype and every unconfirmed biographical detail remain unknown, probable, or separately documented on their own records.

C24 applies that rule to Michael's expressly confirmed parental sibling groups and nine first-cousin parent assignments. The confirmation upgrades only those named relationship roles; it does not upgrade spouse claims, parentage subtype, dates, places, name variants, migrations, or historical ancestry. Existing documentary provenance remains attached so Evidence Mode can show both support types together.

## Product evidence presentation

The C20 Research page is an application-facing window into normalized evidence, not the research archive itself. It derives accepted conclusion and source registers from the canonical graph and uses a reviewed set of methodology statements, archive totals, and open questions under `src/data/`. The page must name the difference between archive coverage and accepted application coverage.

Global Evidence Mode changes presentation only. Probable and unresolved states remain visible during normal browsing because hiding them would misrepresent the research. Evidence Mode adds verified markers and classified `Family confirmed` / `Documented` provenance where it has been explicitly normalized, using the quiet `● Verified`, `◐ Probable`, and `○ Unresolved` confidence vocabulary. It cannot upgrade, suppress, resolve, or infer provenance for a claim.
