# Family Atlas agent map

Family Atlas is a source-grounded genealogy application. Use this file to find the right source of truth; keep detailed rules in the linked documents.

## Read first

1. Read [docs/STATUS.md](docs/STATUS.md) for the current implementation boundary.
2. Read [docs/DECISIONS.md](docs/DECISIONS.md) before changing a settled convention.
3. Read the domain document relevant to the task.
4. For genealogy or evidence work, follow [research/README.md](research/README.md) and then read the owning packet or inventory.

## Source-of-truth map

| Concern | Canonical document |
|---|---|
| System boundaries and dependency direction | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Product intent and scope | [docs/product-spec.md](docs/product-spec.md) |
| Visual language, UI, and accessibility | [docs/design-system.md](docs/design-system.md) |
| Canonical graph and normalization contract | [docs/genealogy-data.md](docs/genealogy-data.md) |
| React/D3 responsibilities | [docs/visualization-architecture.md](docs/visualization-architecture.md) |
| Evidence and confidence methodology | [docs/research-methodology.md](docs/research-methodology.md) |
| Current state and next boundary | [docs/STATUS.md](docs/STATUS.md) |
| Durable technical/product decisions | [docs/DECISIONS.md](docs/DECISIONS.md) |
| Research archive policy | [research/README.md](research/README.md) |
| Research coverage | [research/manifest.json](research/manifest.json) |

## Non-negotiable guardrails

- Maintain one canonical family graph; derive every view from it.
- Keep `research/` evidence separate from normalized `src/data/`; never parse research prose at runtime.
- Never invent genealogy or silently resolve a conflict.
- Preserve confidence, date uncertainty, place precision, source links, and rejected-candidate safeguards.
- React owns state and rendering. D3, when added, owns calculations rather than the DOM.
- Use TypeScript, shadcn/Base UI conventions, responsive accessible UI, and reduced-motion support.
- Keep the repository portable to a normal GitHub and npm workflow.

## Commands

```bash
npm install
npm ci
npm run dev
npm run lint
npm test
npm run type-check
npm run build
npm run start
```

Update `docs/STATUS.md` after a milestone and `docs/DECISIONS.md` only when a durable decision is made or superseded.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
