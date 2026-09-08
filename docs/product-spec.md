# Family Atlas product specification

## Product intent

Family Atlas should make a family's relationships, places, journeys, people, and supporting research understandable without presenting uncertain genealogy as settled fact. It is an editorial exploration experience built from one canonical family graph.

## User promises

- The same person and relationship mean the same thing everywhere in the product.
- Verified, probable, and unresolved information remain visibly distinguishable.
- Approximate, ranged, conflicting, and unknown dates are not displayed as false precision.
- Place and movement displays never imply a more exact location or route than the evidence supports.
- Evidence and research context can be understood without exposing the research archive as a runtime data API.
- Core content and navigation work on mobile, with a keyboard, and with reduced motion.

## Intended product areas

These are product domains, not authorization to implement them in C1:

| Area | Purpose |
|---|---|
| Family | Explore parent-child, spouse/partner, and other supported relationships |
| People | Browse the accepted family by supported branch, recorded surname, generation, birthplace, and confidence, then read person-centered profiles |
| Research | Understand provenance, evidence quality, conflicts, and unresolved questions |
| Geography | Explore supported places at their documented precision |
| Journeys | Compare documented moves, strongly inferred moves, and separate locations with unknown routes |
| Visualizations | Reveal structure and patterns while retaining accessible nonvisual equivalents |

## Product behavior principles

- Derive all areas from the canonical graph and shared selectors.
- Show uncertainty near the claim it qualifies, not only in a distant legend.
- Never fill gaps for visual symmetry, tree completeness, narrative smoothness, or map continuity.
- Keep rejected and unattached identities out of accepted family paths while retaining appropriate research guardrails.
- Favor focused progressive disclosure over dense genealogy dashboards.
- Preserve context when navigating between a person, relationship, place, source, and visualization.

## Current scope boundary

C5 establishes the reviewed direct-ancestor graph, C6 supplies framework-independent graph queries, C7 supplies the Nordic design foundation, C8 supplies the responsive application shell and primary navigation, C9 supplies shared Explore interaction state, C10 introduces the editorial home page, C11 adds the family tree, C12 adds responsive person details with calculated relationship paths, C13 adds full stable-ID person profiles, C14 adds the cross-person timeline, C15 adds shared time navigation, C16 adds the evidence-limited Journeys map, C17 adds the filterable People directory, and C18 adds stable-ID Places index and detail views. The repository still contains no global-search behavior, patterns visualization, or standalone Stories/Research pages; those features require later explicit tasks.

## Not currently specified

Authentication, editing workflows, collaboration, public/private access, hosting provider, analytics, content management, and data synchronization are undecided. Do not add them by assumption; record a decision first if a later task requires one.
