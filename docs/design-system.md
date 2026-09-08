# Family Atlas design system

## Direction

Family Atlas uses a **Nordic minimal/editorial** visual language: quiet, spacious, precise, archival, contemporary, and human. It should feel like a carefully edited historical publication with modern interaction quality—not a dashboard, scrapbook, or themed genealogy product.

The system lets names, relationships, dates, places, and evidence carry the hierarchy. Color supports orientation and state but never replaces visible language.

## Implementation foundation

- Tailwind CSS supplies layout and token-driven styling.
- shadcn components are source-owned under `src/components/ui/`.
- Base UI supplies accessible behavior beneath interactive shadcn primitives. The current `Button` wraps Base UI's button primitive.
- Lucide is the icon family. Decorative icons use `aria-hidden`; icon-only controls require an accessible name.
- Inter Variable is bundled through `@fontsource-variable/inter`, avoiding network-dependent font loading and machine-specific fonts.
- Global semantic tokens and reusable page/type conventions live in `src/app/globals.css`.

Feature code consumes semantic utilities such as `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`, `bg-primary`, and confidence-role colors. It must not introduce an unrelated local palette.

## Color system

The canonical light foundation uses a warm off-white canvas, graphite text, cool secondary text, restrained warm-white surfaces, fine neutral rules, and one desaturated fjord-blue interaction family.

| Role | Token | Use |
|---|---|---|
| Canvas | `background` | Main page ground; warm off-white rather than pure white or parchment |
| Primary text | `foreground` | Graphite names, headings, and body text |
| Surface | `card`, `popover` | Restrained warm-white content and overlay surfaces |
| Quiet surface | `surface-subtle`, `muted` | Section differentiation and low-emphasis controls |
| Secondary text | `muted-foreground` | Metadata and supporting prose; cool neutral |
| Rules | `border`, `input` | Mostly 1px separators, field boundaries, and structural edges |
| Interaction | `primary`, `accent`, `ring` | Fjord-blue actions, hover surfaces, links, and focus |
| Destructive | `destructive` | Destructive state only; never general emphasis |
| Evidence | `confidence-*` | Verified, probable, and unresolved treatments paired with text/icon/border cues |

Do not use gradients, glass effects, sepia washes, faux paper textures, or ornamental color. The `.dark` token set preserves the same semantic relationships for future use; C7 does not introduce a theme switch or dark-mode product behavior.

## Typography

Inter Variable is the sole foundation family. Use its optical sizing and a restrained weight range:

- Display and section headings: weight approximately 560, tight tracking, balanced wrapping.
- Body: regular weight, comfortable 1.7–1.8 line height, and readable line lengths around 42rem.
- Controls: 14px medium weight.
- Editorial labels: 11px semibold uppercase with deliberate tracking; reserve them for compact wayfinding and metadata.
- Tabular figures should be enabled locally for dates or aligned numeric data when the feature requires them.

Reusable classes:

- `.editorial-display` — responsive page-level specimen/display scale.
- `.editorial-heading` — responsive section heading.
- `.editorial-copy` — readable secondary body copy.
- `.editorial-label` — compact uppercase orientation label.

Avoid giant type used only for spectacle, unnecessary font families, faux handwriting, and decorative historical typefaces.

## Spacing and page structure

Spacing follows a compact 4px-derived control rhythm inside generous page whitespace.

- `--page-gutter`: fluid side padding from 20px on narrow screens to 56px on large screens.
- `--section-space`: fluid vertical section spacing from 72px to 136px.
- `--content-gap`: fluid major content gap from 24px to 44px.
- `.page-shell`: centered responsive container capped at 76rem.
- `.section-space`: standard editorial section padding.

Build mobile-first. Preserve reading order when columns collapse. A typical breakpoint progression is:

1. single-column content and wrapped controls by default;
2. supporting two-column arrangements at `sm` or `md` only when content remains legible;
3. wider editorial compositions at `lg`, never simply to fill the viewport.

Keep primary reading copy near the `reading` container width. Full-width treatments are reserved for rules, quiet section grounds, and future visualizations that genuinely need space.

## Shape, borders, and elevation

- Base radius: 6px; token variants range from 4px to 12px.
- Controls and badges use small radii, not capsule styling by default.
- Borders are normally 1px and carry most structural separation.
- Surfaces may change tone slightly before introducing elevation.
- Shadows are exceptional, low-amplitude, and reserved for overlays or a real layering need.

Avoid giant rounded cards, nested card grids, floating dashboard panels, and large ambient shadows.

## Controls and focus

Controls are compact and calm while remaining usable with touch, keyboard, and zoom:

- standard button height: 36px;
- compact button height: 32px;
- large button height: 40px;
- icon-only controls require an `aria-label`;
- disabled controls retain legibility and prevent interaction;
- hover adjusts semantic color or border without movement or large shadow changes;
- visible focus uses the fjord-blue `ring` token with clear offset.

Global focus styling covers native interactive elements. shadcn/Base UI components may add a component-aware focus ring but must preserve visible keyboard focus. Hover can never be the sole indication of availability.

## Genealogy semantics

Confidence labels use exactly `verified`, `probable`, and `unresolved` where confidence matters.

- Verified: fjord-tinted background, solid border, check icon, and visible text.
- Probable: restrained ochre-neutral tint, question/help icon, and visible text.
- Unresolved: cool-neutral tint, dashed border, unresolved icon, and visible text.

These treatments deliberately combine color with text, icon, and border style. They do not alter the confidence values in application data.

Uncertain dates remain written as `circa`, `before`, `after`, a range, or `unknown`. Approximate or jurisdiction-level places cannot receive a visual treatment that implies exact coordinates. Rejected and research-only candidates must remain visibly and semantically outside accepted lineage.

## Surfaces and content patterns

- Prefer fine rules and whitespace over cards around every content block.
- Use a quiet surface band to distinguish a major section when needed.
- Keep metadata compact but never cryptic.
- Place uncertainty next to the fact it qualifies.
- Preserve progressive disclosure: concise primary content with evidence detail available in context.
- Use badges sparingly for compact state, not for every category or navigation item.

## Motion and accessibility

Motion explains state or spatial change; it does not decorate idle surfaces. The global reduced-motion rule removes nonessential animation and compresses transitions when `prefers-reduced-motion: reduce` is active.

Every implementation must retain:

- semantic HTML and logical heading order;
- keyboard reachability and visible focus;
- WCAG-appropriate text and control contrast;
- non-color-only status communication;
- readable zoom/reflow behavior;
- structured text alternatives for future charts and visualizations.

## C7 preview boundary

The C7 root route was a small design-foundation specimen used to verify the canvas, typography, spacing, borders, surfaces, confidence treatments, Lucide usage, and Base UI-backed buttons at responsive widths. It was not a committed product-page composition and was replaced by the C8 shell preview.

Future feature tasks may reuse the foundation but should design their information hierarchy from the product need rather than copying the preview literally.

## Application shell

C8 establishes the persistent shell in the root layout:

- A visible-on-focus skip link targets the main content region.
- `Family Atlas` is the brand/home link.
- Primary destinations are `Explore`, `People`, `Places`, `Stories`, and `Research`.
- The current destination uses both a visual rule/background treatment and `aria-current="page"`.
- At `lg` and wider, navigation is an inline editorial row with the search affordance at the right edge.
- Below `lg`, tablet and phone widths use compact search and menu controls. The menu opens a Base UI-backed modal sheet with focus management, Escape dismissal, backdrop dismissal, and an explicit close control.
- Global search is visibly labeled `Soon` and disabled until a later task implements behavior.
- The shell uses a solid background rather than blur or glass effects.

The `lg` transition is intentional: five destinations should not be compressed into a tablet header. At 320px the brand and two compact controls remain on one line; navigation labels move to the sheet where each receives a full touch-friendly row.

## Home page composition

C10 applies the design foundation as a restrained editorial opening rather than a marketing landing page. A concise hero pairs the product premise with one primary action; a quiet, ruled collection section introduces People, Places, and Time through canonical data. Columns use whitespace, fine dividers, and reading hierarchy instead of promotional cards, invented metrics, decorative imagery, or oversized claims. On narrow screens the three readings retain their semantic order and become vertically separated articles.

## Family-tree presentation

C11 renders people as compact typographic labels with a slim rule and quiet surface, not profile cards. A restrained selected state, visible confidence words, and solid/dashed relationship lines preserve hierarchy without visual weight. Controls wrap rather than overflow, and the canvas clips internal panning without creating page-level horizontal scroll.

The spatial tree is paired with an expandable structured list. SVG tree items support Enter/Space selection and Left/Right ancestry folding; the list provides a conventional non-spatial alternative. On phones the reset scale favors readable names over fitting the entire ancestry into a tiny viewport.

## Person-detail disclosure

C12 uses the same person-detail composition in two Base UI dialog surfaces: a restrained right-side Sheet from `md` upward and a bottom Drawer below `md`. Both trap focus, dismiss with Escape/backdrop, restore focus, support an explicit close control, and confine scrolling to the content region. The mobile drawer is capped at 92dvh so its heading and actions remain reachable without page-level overflow.

The composition prioritizes name and graph-derived relationship, followed by confidence/source metadata, a readable Michael-first path, a short event-supported biography, places, and direct family. Fine rules and whitespace separate sections; the content is not presented as a stack of profile cards. Full supported event detail is progressive disclosure, and unknown life dates are not replaced with placeholders that imply a fact exists.

## Full person profiles

C13 extends person disclosure into long-form editorial profiles. A quiet identity header is followed by a wrapping in-page section index and six ruled sections: Story, Family, Life in places, Timeline, Records & evidence, and Open research questions. On wide screens, compact section numbers and titles form a stable left rail; content remains in a readable right column. On narrow screens, the rail collapses above the content without horizontal navigation overflow.

Profiles use links rather than card chrome to express connected people, places, events, relationships, and sources. Stable IDs remain visible where they aid provenance. Confidence badges sit next to the entity or claim they qualify; person confidence and relationship-path confidence remain distinct. Sparse profiles keep the same navigable structure but use concise data-boundary statements instead of blank panels or generated narrative.

## People directory

C17 presents people as one ruled editorial list rather than a card grid. Each row is a full profile link with a typographic name lead, quiet relationship and generation context, only explicitly supported birthplace evidence, a person-confidence badge, and a directional cue. Missing dates and birthplaces leave no synthetic placeholder in the reading flow.

Five compact, labeled native selects provide branch, recorded surname, generation, birthplace, and person-confidence filtering. Controls wrap into two columns and then one column as space narrows; the directory rows likewise move from a four-column reading line to a stacked mobile composition. Result counts announce changes, clear state remains keyboard accessible, focus uses the shared ring treatment, and no filtering state creates page-level horizontal overflow.
