# Responsive and accessibility audit

## Scope

C23 audited the completed Family Atlas application at 320px, 390px, 768px, 1366px, and 1920px. The pass covered the persistent shell, Home/Explore, Tree, Journeys, Timeline, Patterns, People, Places, Research, person details, profiles, global search, and the intentionally unpublished Stories destination.

The target is a practical WCAG 2.2 AA baseline. The audit combined keyboard interaction, responsive browser inspection, DOM/role checks, source inspection, token contrast calculations, and the automated project test/build suite. It is not a certification or a substitute for a dedicated screen-reader and real-device lab pass.

## Confirmed fixes

### Responsive layout and touch

- No tested route creates page-level horizontal overflow at any audited width.
- Tree and Journeys keep pan/zoom inside their bounded canvases. Timeline keeps its wide historical axis inside a labeled local scroll region on narrow screens.
- Phone and tablet buttons, selects, and disclosure summaries now have a 44px minimum target. Compact visual styling remains available on desktop.
- Profile and Research in-page navigation links now retain a 44px minimum height on touch layouts.
- Long place, person, source, and filter labels wrap without clipping.

### Keyboard and focus

- Tree nodes, timeline rows, map marks, structured alternatives, filters, navigation, search results, and person actions are keyboard reachable.
- Timeline SVG rows now receive a visible fjord-blue focus stroke instead of suppressing the browser outline without a replacement.
- Closing a person Drawer or Sheet returns focus to the tree, timeline, or structured-list control that opened it.
- Closing global Command search returns focus to its initiating search control, with a visible-header fallback when responsive navigation changes.
- Mobile navigation and modal surfaces trap focus, dismiss with Escape, expose explicit close buttons, and return focus to their launchers.
- Pan and zoom have named button alternatives: zoom in, zoom out, and reset. The Tree also has Show all/Fold older controls and a structured ancestry list.

### Semantics, names, and navigation

- Each audited route has one primary `h1` and logical section headings.
- Icon-only controls have accessible names; decorative Lucide icons are hidden from assistive technology.
- The skip link targets the focusable main region.
- Static and stable-ID routes now expose distinct document titles for People, Places, Research, Stories, person profiles, place profiles, and source records.
- The persistent Stories navigation target now resolves to an honest unpublished-content state instead of a 404; it does not generate or invent family narrative.
- The Journeys map now presents a visible and announced empty state when the active person/scope has no supported mapped locations.

### Contrast and motion

Token checks against the warm background produced contrast ratios of 14.65:1 for primary text, 7.05:1 for muted text, 6.22:1 for the primary accent, and at least 7.44:1 for confidence-role text. State communication also uses words, marks, and line/border treatment rather than color alone.

The global reduced-motion query disables smooth scrolling and compresses animation/transition duration. Sheet, Drawer, and Dialog transitions explicitly honor reduced motion; Tree and Journeys zoom actions use zero-duration transforms and no imperative D3 DOM animation.

## Visualization accessibility limitations

- The Tree's two-dimensional placement, the map's geographic shape, and the Timeline's spatial distance cannot be conveyed completely by SVG semantics alone. Each view therefore includes a structured HTML alternative containing the supported names, relationships, places, dates, confidence, and actions.
- Freeform drag-to-pan remains a pointer/touch interaction. Named zoom/reset controls and structured alternatives provide non-pointer access to the underlying content, but they do not reproduce the exploratory feel of freeform panning.
- At narrow widths, the Timeline visual requires horizontal scrolling to keep years and event labels legible. Its structured record list presents the same dated evidence without requiring two-dimensional scrolling.
- Published geographic boundary geometry is visual context and is not narrated feature by feature. Canonical place names, precision, confidence, event associations, and movement classifications are available in the map's structured list and Places pages.
- The current pass did not include full VoiceOver/NVDA task completion, switch-control testing, mobile screen-magnifier testing, or a 400% browser-zoom conformance matrix. These remain appropriate release-candidate checks.

## Regression expectations

- Visualization calculations must not mutate canonical data.
- Unknown dates, unsupported lifespans, approximate places, and unknown migration routes must remain absent or explicitly uncertain, including in accessible alternatives.
- New modal entry points must restore focus to their triggering element.
- New phone/tablet controls must preserve a 44px target without causing page-level overflow.
- Every new route requires a distinct document title, a single primary heading, and a stable accessible name for each control.
