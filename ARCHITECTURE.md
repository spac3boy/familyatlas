# Family Atlas architecture

## Purpose

Family Atlas is a Next.js and TypeScript application that presents one source-grounded family graph without concealing uncertainty. The architecture keeps research evidence, normalized application data, interface state, and visualization math distinct.

## Layer model

```text
research/ evidence archive
        ↓ explicit, reviewed normalization (offline development step)
src/data/ canonical family graph
        ↓ typed selectors and view models
React routes, components, and application state
        ↓ data passed into pure calculation helpers
D3 modules for layout, scales, projections, and path math
        ↓ geometry returned to React
React-rendered HTML and SVG
```

There is no runtime edge from application code back to research Markdown.

## Repository ownership

| Path | Responsibility |
|---|---|
| `research/` | Human-readable evidence, reasoning, conflicts, source handles, and open questions |
| `src/data/` | Normalized, reviewed data for the single canonical graph; currently the C5 direct-ancestor graph and its pre-bound queries |
| `src/types/` | Shared application and graph contracts |
| `src/lib/genealogy/` | Framework-independent graph validation, quality audit, and read-only query utilities |
| `src/app/` | Next.js App Router routes, layouts, and route-level composition |
| `src/components/family/` | Family-relationship views derived from the graph |
| `src/components/people/` | Person-focused presentation |
| `src/components/research/` | Provenance, evidence, and uncertainty presentation |
| `src/components/visualizations/` | React-owned visualization composition and SVG markup |
| `src/components/layout/` | Shared application layout |
| `src/components/ui/` | Source-owned shadcn components built on Base UI primitives |
| `src/lib/visualization/` | Pure or isolated D3-backed calculations |
| `src/state/` | Cross-component application state only when local state is insufficient |
| `docs/` | Product, domain, design, status, and decision knowledge |

## Canonical graph rule

The application has one normalized family graph exported from `src/data/family-graph.ts`. Person pages, trees, lists, maps, journeys, timelines, and research views must select from that graph rather than maintain competing relationship copies. Alternate names, conflicting claims, and research-only candidates may be represented, but they must not become parallel genealogies or silently enter accepted lineage.

## Rendering and state ownership

React owns application state, interaction state, component lifecycles, accessibility semantics, and all HTML/SVG rendering. Prefer server-rendered or statically generated content where interaction is unnecessary; add client boundaries deliberately.

D3 may be added by module only when a feature needs layout, projection, scale, interpolation, or path mathematics. Helpers should accept typed data and return serializable geometry or view models. Prefer React-rendered SVG. If an imperative D3 behavior is unavoidable, isolate it behind a ref or hook and do not let it become a second owner of application state or production DOM nodes.

## Quality constraints

- Strict TypeScript contracts at every layer boundary.
- Mobile-first responsive layouts with progressive enhancement for larger screens.
- Semantic HTML, keyboard access, visible focus, readable contrast, and non-color-only status cues.
- Reduced-motion behavior for every nonessential animation or transition.
- Stable IDs in data and keys; never use display names as identity.
- Dependencies kept narrow; D3 modules are installed only when required.
- No machine-specific runtime paths, private registries, or hosting-only assumptions. npm scripts and checked-in files must work in a conventional GitHub clone and CI environment.

## Change discipline

Architecture changes require an entry in `docs/DECISIONS.md`. Milestone state belongs in `docs/STATUS.md`. Research methodology changes belong in `research/README.md` and must not be made as a side effect of application work.
