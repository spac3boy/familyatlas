# Portability and maintenance contract

## Audit result

Family Atlas is maintainable as a conventional GitHub repository. A checkout needs Node.js, npm, and the public packages locked in `package-lock.json`; it does not need ChatGPT, Codex, OpenAI, Sites, a private registry, a database, or access to Michael's original Family History chats.

The current production site is [https://spac3boy.github.io/familyatlas/](https://spac3boy.github.io/familyatlas/). The C27 audit loaded the deployed root at the expected `/familyatlas/` base path, confirmed its navigation and versioned assets use the same base path, and found no browser warnings or errors. GitHub's public Actions history showed successful deployments of the latest merged `main` commit.

| Requirement | Result |
| --- | --- |
| Plain research archive | `research/` contains UTF-8 Markdown, JSON, and empty `.gitkeep` placeholders. It contains no symlink, executable, proprietary container, or runtime-loaded file. |
| Portable canonical data | `familyGraph` is composed from standard TypeScript modules and exports JSON-compatible arrays and objects. A regression test validates a JSON round trip and then reruns graph validation. |
| Standard npm workflow | Node 20 is declared in `.nvmrc`; `package.json` requires Node 20.9+; `npm ci`, lint, tests, type-check, build, and start use normal npm scripts. |
| Local production | `npm run build` creates the production Next.js build and `npm run start` serves it without an external service. |
| Dependency provenance | All resolved package tarballs in the lockfile use `registry.npmjs.org`. There are no file, Git, workspace, private-registry, or remote-URL dependency specifications. |
| Checked-in UI source | `components.json` records shadcn conventions, and the editable Button, Badge, Command, Dialog, Drawer, and Sheet implementations live under `src/components/ui/`. |
| Standard D3 modules | The project installs individual public npm modules such as `d3-hierarchy`, `d3-scale`, `d3-geo`, `d3-shape`, `d3-brush`, and `d3-zoom`; it does not depend on a hosted visualization service or the D3 umbrella package. |
| Reusable visualization math | `src/lib/visualization/` contains framework-independent TypeScript functions. These modules import typed graph/query contracts and standard D3 packages, but not React, Next.js, browser globals, or component code. |
| Self-contained runtime data | Application routes read `src/data/` and the two vendored Natural Earth GeoJSON files in `public/data/`. The only runtime fetch loads those local map files. External genealogy URLs are citations users may follow, not application data dependencies. |
| Original-chat independence | The human packets, source inventory, open questions, normalization modules, and tests preserve the handoff. Chat IDs and `turn…` handles remain historical provenance, but neither application maintenance nor the build attempts to retrieve them. |

## Clean-clone setup

```bash
git clone https://github.com/spac3boy/familyatlas.git
cd familyatlas
npm ci
npm run dev
```

No `.env` file, secret, account, API key, database, or private package credential is currently required. If a future feature introduces one, add a committed `.env.example`, document which values are optional or required, and keep real secrets out of Git.

## Validation and production

Run the same commands locally and in continuous integration:

```bash
npm run lint
npm test
npm run type-check
npm run build
```

Serve the local production build with:

```bash
npm run start
```

The build script explicitly selects Next.js's supported Webpack builder. That is a standard framework option, not a hosted-platform adapter.

## GitHub workflows and hosting

`.github/workflows/ci.yml` validates pull requests with the locked Node/npm toolchain. `.github/workflows/deploy-pages.yml` is the single production workflow and runs only for the `main` ref. It reruns lint, tests, type-check, and build before uploading the static export to the protected `github-pages` environment. The Pages setup action supplies the repository subpath/static-export settings during that deployment; the application itself has no GitHub-specific runtime code.

The public workflow history exposed two successful deployment workflows running for the same merges. C26/C27 remove the redundant `nextjs.yml`; after these changes merge, only `deploy-pages.yml` should appear for future production releases. The retained workflow targets `main`, uses the repository's `.nvmrc` and lockfile, declares only the documented Pages permissions, applies job timeouts, retains static-export dotfiles such as `.nojekyll`, and uses current supported major versions of GitHub's official actions.

GitHub Pages is the current host but is not required by the application architecture. The normal Next.js production build can be served by any Node-capable host, and a future maintainer can replace the Pages workflow without changing genealogy data or visualization modules.

## Research and application data

The two layers intentionally have different jobs:

```text
research/           human-readable evidence and reasoning
src/data/           reviewed application data
src/types/          portable data contracts
src/lib/genealogy/  validation and queries
```

`research/` is not parsed at runtime. Its ChatGPT and Codex references record where parts of the historical handoff originated; they are not executable instructions or required connectors. When an original chat cannot be accessed, maintainers can still build, test, refactor, and present every currently normalized claim. They can also review the preserved packets, evidence summaries, conflicts, rejected identities, and source URLs.

New genealogy should still be based on inspectable evidence. If the archive preserves only an inaccessible chat handle for a disputed claim, leave the claim at its existing confidence or unresolved state until an underlying record or explicit family statement is available. Portability does not authorize guessing.

## Contributor-tool neutrality

`AGENTS.md` is a plain, optional map of repository conventions. It can help an automated or human contributor find the governing documentation, but no npm script, application module, test, or GitHub workflow reads it. The repository can be maintained with any editor and ordinary Git tooling.

The repository contains no `.openai/`, `.codex/`, Sites manifest, Vercel configuration, machine-specific runtime path, or proprietary plugin declaration. Local machine npm warnings, if any, come from user-level npm configuration and are outside this repository.

## Portability safeguards

- Keep package dependencies in `package.json` and lock them with npm.
- Keep UI component source editable in the repository.
- Keep framework-independent graph and visualization logic outside React components.
- Keep public static assets under `public/` with source/version notes.
- Never make an internal chat handle function as a required public citation or API endpoint.
- Do not add a hosted service, provider adapter, private registry, or environment secret without documenting the reason and a local-development path.
- Preserve the clean-clone CI job and the portability regression tests when changing repository structure.

## Remaining operational risks

- The repository has no automated post-deployment HTTP/browser smoke test or uptime monitor; C27 verified production manually after the latest successful deployment.
- GitHub Actions use supported major-version tags rather than immutable commit SHAs. This keeps routine maintenance simple but leaves normal upstream major-tag movement as a supply-chain consideration.
- The GitHub Pages build relies on the official `configure-pages` action to inject static-export and repository-base-path settings. A hosting change must reproduce those settings explicitly.
- Static GitHub Pages cannot provide future server-only Next.js features without a hosting change. The current application does not require any such feature.
