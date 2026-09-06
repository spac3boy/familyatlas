# Family Atlas

Family Atlas is a Next.js application built around a source-grounded family-history archive.

## Repository boundaries

- `research/` is the human-readable research archive and evidence trail.
- `src/data/` contains the normalized application graph, currently the reviewed seven-person foundation.
- The application must never parse or scrape research prose at runtime.

## Development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm test
npm run type-check
npm run build
```
