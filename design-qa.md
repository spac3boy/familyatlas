# Design QA: Regional hero system

Date: 2026-09-09

## Source visual truth

- Home — user-provided Norway fjord photograph: `/var/folders/1d/_rw4dmv94zbgm8zzwq6y5fkr0000gn/T/codex-clipboard-b583d881-b496-466c-92cf-db7e3a497882.png` (2340 × 1560 pixels).
- People — user-provided Louisiana bayou photograph: `/var/folders/1d/_rw4dmv94zbgm8zzwq6y5fkr0000gn/T/codex-clipboard-543f70a3-724b-495f-8190-8b9536559c96.png` (2342 × 1561 pixels).
- Places — user-provided France coastal photograph: `/var/folders/1d/_rw4dmv94zbgm8zzwq6y5fkr0000gn/T/codex-clipboard-6403d82a-dc01-4eea-b5ba-215340481b14.png` (1600 × 1199 pixels).
- Stories — user-provided Norway coastal-path photograph: `/var/folders/1d/_rw4dmv94zbgm8zzwq6y5fkr0000gn/T/codex-clipboard-64ee9cc3-5d78-4638-9352-2504d2075ec6.png` (3072 × 2048 pixels).
- Research — user-provided Venezuela cloud-forest photograph: `/var/folders/1d/_rw4dmv94zbgm8zzwq6y5fkr0000gn/T/codex-clipboard-6f50a509-2009-4d07-94c4-b94ec6d0e4e3.png` (2352 × 1558 pixels).
- Change target: extend the accepted Home treatment to the main destination pages, retain page-specific content and controls, preserve the black header and primary-action hierarchy, and keep the People filters padded on all four sides.

## Implementation evidence

Desktop captures use a 1280 × 720 CSS viewport at device pixel ratio 1:

- People: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/people-desktop.png`
- Places: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/places-desktop.png`
- Stories: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/stories-desktop.png`
- Research: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/research-desktop.png`

Mobile captures use a 390 × 844 CSS viewport at device pixel ratio 1:

- People: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/people-mobile.png`
- Places: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/places-mobile.png`
- Stories: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/stories-mobile.png`
- Research: `/private/tmp/family-atlas-all-hero-qa-2026-09-09/research-mobile.png`

## Comparison and checks

- Full-view comparison: each supplied source image was reviewed beside its implemented desktop capture. The photographs remain faithful after optimization, with deliberate focal positions for each hero and no distortion, halos, or compression artifacts.
- Focused regions: full-width hero captures provide a large, legible view of the source image, overlay, type, and page transition. The mobile captures verify the responsive crop, content stacking, and navigation scale.
- Fonts and typography: Inter Variable, optical weights, sizes, line heights, and hierarchy remain consistent. Hero titles and supporting copy wrap cleanly at desktop and mobile widths.
- Spacing and layout rhythm: secondary heroes measure 513 pixels high at desktop and 385 pixels on mobile, while Research expands to 558 pixels on mobile to contain its additional explanation and control. Gutters, rules, and content transitions are consistent. The People filter panel retains padding on every edge.
- Colors and tokens: a solid semantic primary-blue overlay unifies the regional photographs with the site palette; Research uses a slightly stronger overlay for its brighter cloud field. White text and the existing graphite header maintain clear contrast. No gradients were introduced.
- Image quality: optimized JPEG assets preserve the subjects and natural detail. `background-size: cover` and page-specific focal points prevent stretching while supporting varied viewport proportions.
- Copy and content: existing page copy, counts, links, evidence controls, and actions are unchanged.
- Accessibility and behavior: desktop heroes use fixed-background parallax. Mobile and reduced-motion contexts use a static background. The mobile menu opens, closes, and navigates successfully; active-page semantics and keyboard focus styling are preserved.
- Overflow and console: no horizontal overflow was observed at 1280 or 390 pixels. Browser console warnings and errors were empty across People, Places, Stories, and Research.

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Comparison history

- Home hero and People filters: the original fjord hero and four-sided filter-padding changes passed desktop and mobile comparison.
- Header and actions: the black persistent header and black primary-button hierarchy passed responsive checks without layout or content drift.
- Regional hero pass: Louisiana, France, Norway, and Venezuela source images were compared with their desktop implementations, followed by responsive and interaction checks on all four destination pages. No corrective iteration was required.

final result: passed
