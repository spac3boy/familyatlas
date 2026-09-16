# Family Atlas

Family Atlas is a source-grounded genealogy application for exploring one family across people, place, and time. It presents a reviewed family graph while keeping historical uncertainty, research confidence, evidence provenance, geographic precision, and living-relative privacy visible.

**Live site:** [spac3boy.github.io/familyatlas](https://spac3boy.github.io/familyatlas/)

## Technology stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS with checked-in shadcn-style components built on Base UI
- Lucide icons and a bundled Inter Variable font
- Individual D3 packages for hierarchy, scales, axes, geography, shapes, brushing, and zoom
- Node.js tests plus ESLint and the TypeScript compiler
- GitHub Actions and GitHub Pages for the current production deployment

No database, API key, private registry, hosted data service, or environment variable is currently required.

## Repository structure

```text
research/                 Human-readable evidence, reasoning, conflicts, and open questions
src/data/                 Reviewed, normalized application data
src/types/                Canonical genealogy TypeScript contracts
src/lib/genealogy/        Validation, audits, queries, and view-model projections
src/lib/visualization/    Framework-independent D3-backed calculations
src/components/ui/        Editable shadcn-style component source
src/components/           Application and visualization presentation
src/app/                  Next.js routes and layouts
public/data/              Vendored public map boundary data
tests/                    Data, query, visualization, integration, and portability tests
docs/                     Product, architecture, evidence, status, and maintenance documentation
.github/workflows/        Pull-request validation and GitHub Pages deployment
```

The application never parses or scrapes `research/` prose at runtime. `src/data/family-graph.ts` composes the one canonical application graph used by every route and visualization.

## Install and run locally

Requirements:

- Node.js 20.9 or newer; `.nvmrc` selects Node 20.
- npm, using the checked-in `package-lock.json`.

```bash
git clone https://github.com/spac3boy/familyatlas.git
cd familyatlas
npm ci
npm run dev
```

Open the local URL printed by Next.js. Use `npm install` when intentionally changing dependencies; use `npm ci` for a reproducible install from the lockfile.

## Commands and validation

```bash
npm run dev          # local development server
npm run lint         # ESLint
npm test             # schema, graph, query, UI-model, integration, and portability tests
npm run type-check   # TypeScript without emitting files
npm run build        # optimized production build
npm run start        # serve the local production build
```

Before opening a pull request, run lint, tests, type-check, and the production build. The test suite invokes both `validateGenealogyGraph` and the broader graph-quality safeguards covering references, duplicate IDs, ancestry cycles, chronology, source linkage, and portability.

## Production and deployment

The current production site is GitHub Pages at [https://spac3boy.github.io/familyatlas/](https://spac3boy.github.io/familyatlas/).

- Pull requests run `.github/workflows/ci.yml`.
- A push to `main` runs `.github/workflows/deploy-pages.yml`.
- The deployment job accepts only the `main` ref, performs the complete validation suite, creates the Next.js static export with GitHub's Pages configuration action, uploads `out/`, and deploys to the `github-pages` environment.
- A manual workflow dispatch is available for `main`; other refs are intentionally refused by the build job.
- Repository Settings → Pages must use **GitHub Actions** as the publishing source.

GitHub Pages is the current host, not an application runtime dependency. `npm run build` and `npm run start` also produce and serve a conventional Next.js production build on a fresh machine.

## Research and canonical data

`research/` is the durable, human-readable research archive. It preserves family statements, source-by-source evidence, citation handles, conflicts, rejected identities, geographic precision, and unanswered questions. `src/data/` is a reviewed normalization of supported claims into JSON-compatible TypeScript objects.

The checked-in archive and normalized graph are sufficient to maintain the current application without the original Family History chats. Original chat IDs remain historical retrieval aids, not build dependencies or public citations. New genealogy still requires reviewed evidence; chat independence never authorizes guessing.

Read [research/README.md](research/README.md), [docs/research-methodology.md](docs/research-methodology.md), and [docs/genealogy-data.md](docs/genealogy-data.md) before changing genealogy.

## Adding or changing genealogy

Treat a genealogy update as a reviewed data change, not a UI shortcut:

1. Preserve the supporting family statement or documentary evidence in the appropriate plain file under `research/` when research changes are in scope.
2. Choose the owning normalized module: close/lateral family lives under `src/data/foundation/`; direct maternal or paternal ancestry lives under the matching `src/data/ancestry/` branch.
3. Add or reuse sources before claims so every `sourceRef` resolves. Preserve `researchRefs` back to the owning packet or intake file.
4. Add only supported people, places, relationships, and events. Do not add placeholder relatives or fill a tree for visual completeness.
5. Run the complete validation suite and inspect any data-quality warning rather than suppressing it.

### Add a source

Add a stable `SRC-…` record to the appropriate `sources.ts` module. Record only known citation metadata, evidence class, inspection status, reliability notes, public URLs or retained citation handles, and research references. Never manufacture missing bibliography. ChatGPT `turn…` handles are internal retrieval aids and must not be presented as public URLs.

### Add a place

Add a `place-…` record to the appropriate `places.ts` module. Use the narrowest supported `precision`, link a known containing geography with `parentPlaceId`, and omit coordinates when an honest display anchor is unavailable. A parish or county observation must not become a town, street, church, cemetery, or migration route.

### Add a person

Add one immutable `person-…` ID and a supported canonical display name to the owning `people.ts` module. Preserve maiden and alternate forms as separate source-backed names. Do not merge similar names without evidence, and use explicit non-equivalence guards where separate same-name people could be confused.

### Add a relationship

Add a stable `relationship-…` record to the owning `relationships.ts` module using only `parent-child`, `spouse`, or `partner`. Sibling, aunt/uncle, and cousin labels are derived from parent-child structure and must not be stored as redundant edges. Keep parentage subtype `unknown` unless the evidence establishes a narrower meaning.

### Add an event

Add a stable `event-…` record to the owning `events.ts` module. Supported types include birth, baptism, residence, census, marriage, migration, military, occupation, death, burial, and other. Link only supported people, places, sources, and related relationships. Migration events must retain their documented, strongly inferred, or unknown-route classification.

If a new module is introduced, export it through `src/data/family-graph.ts`; never create a second graph for a feature.

## Evidence and uncertainty rules

Research confidence and claim provenance answer different questions:

- `verified`: the claim is established by adequate support.
- `probable`: the evidence favors the claim, but a material link is missing.
- `unresolved`: the available evidence cannot responsibly decide the claim.
- `family-confirmed`: Michael directly confirmed the specific close-family fact.
- `documented`: an external documentary or published source supports the specific claim.

`family-confirmed` and `documented` are provenance and may coexist on one verified claim. Neither provenance kind automatically transfers to dates, places, parentage subtype, biography, or related ancestral claims. A relationship path is no stronger than its weakest edge.

Historical dates use explicit `exact`, `year`, `circa`, `before`, `after`, `range`, or `unknown` forms. Do not turn a year into January 1, collapse a range into a point, remove circa uncertainty, or reconcile conflicting dates by guessing.

## Privacy for living relatives

Publish only information needed for the family-history experience and intentionally suitable for a public website. Current privacy-safe defaults omit exact birth dates for living people and exclude private addresses, phone numbers, email addresses, contact data, and public-record aggregator details. A source being publicly searchable does not make every field appropriate to republish.

## Maintainer documentation

- [AGENTS.md](AGENTS.md) — concise contributor map; optional for human maintainers
- [ARCHITECTURE.md](ARCHITECTURE.md) — dependency and ownership boundaries
- [docs/STATUS.md](docs/STATUS.md) — implemented scope and remaining boundaries
- [docs/DECISIONS.md](docs/DECISIONS.md) — durable decisions
- [docs/PORTABILITY.md](docs/PORTABILITY.md) — clean-clone and hosting contract
- [docs/accessibility-audit.md](docs/accessibility-audit.md) — tested baseline and known limitations
- [docs/data-quality-report.md](docs/data-quality-report.md) — canonical graph audit and retained conflicts

`AGENTS.md` is a map, not a runtime instruction file. The application, tests, build, and deployment do not require Codex, ChatGPT, OpenAI, or Sites.
