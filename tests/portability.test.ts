import assert from "node:assert/strict"
import { lstatSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import test from "node:test"

import { familyGraph } from "@/data"
import { validateGenealogyGraph } from "@/lib/genealogy/validation"
import type { GenealogyGraph } from "@/types"

const repositoryRoot = process.cwd()

function filesUnder(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(entryPath) : [entryPath]
  })
}

test("the research archive consists only of plain portable files", () => {
  const researchFiles = filesUnder(path.join(repositoryRoot, "research"))

  assert.ok(researchFiles.length > 0)
  for (const filePath of researchFiles) {
    const relativePath = path.relative(repositoryRoot, filePath)
    const stats = lstatSync(filePath)
    assert.equal(stats.isSymbolicLink(), false, `${relativePath} must not be a symlink`)
    assert.match(relativePath, /(?:\.md|\.json|\.gitkeep)$/)

    const contents = readFileSync(filePath)
    assert.equal(contents.includes(0), false, `${relativePath} must not contain binary null bytes`)
    assert.doesNotThrow(
      () => new TextDecoder("utf-8", { fatal: true }).decode(contents),
      `${relativePath} must be valid UTF-8`,
    )
    if (filePath.endsWith(".json")) {
      assert.doesNotThrow(() => JSON.parse(contents.toString("utf8")))
    }
  }
})

test("the canonical graph survives a JSON serialization round trip", () => {
  const serialized = JSON.stringify(familyGraph)
  const roundTripped = JSON.parse(serialized) as GenealogyGraph

  assert.deepEqual(roundTripped, familyGraph)
  assert.deepEqual(validateGenealogyGraph(roundTripped), { valid: true, issues: [] })
})

test("visualization calculation modules remain framework-independent", () => {
  const visualizationDirectory = path.join(repositoryRoot, "src/lib/visualization")
  const modules = filesUnder(visualizationDirectory).filter((filePath) => filePath.endsWith(".ts"))

  assert.ok(modules.length > 0)
  for (const filePath of modules) {
    const source = readFileSync(filePath, "utf8")
    const relativePath = path.relative(repositoryRoot, filePath)
    assert.doesNotMatch(source, /["']use client["']/, `${relativePath} must not be a client module`)
    assert.doesNotMatch(
      source,
      /from\s+["'](?:react|next(?:\/[^"']*)?)["']/,
      `${relativePath} must not import React or Next.js`,
    )
    assert.doesNotMatch(source, /\b(?:window|document)\./, `${relativePath} must not use browser globals`)
  }
})

test("shadcn configuration and editable UI source are checked in", () => {
  const shadcnConfig = JSON.parse(
    readFileSync(path.join(repositoryRoot, "components.json"), "utf8"),
  ) as { aliases?: { ui?: string } }
  assert.equal(shadcnConfig.aliases?.ui, "@/components/ui")

  for (const component of ["badge", "button", "command", "dialog", "drawer", "sheet"]) {
    assert.equal(
      lstatSync(path.join(repositoryRoot, `src/components/ui/${component}.tsx`)).isFile(),
      true,
    )
  }
})

test("type-checking generates Next.js declarations for a clean clone", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
  ) as { scripts?: Record<string, string> }
  const gitignore = readFileSync(path.join(repositoryRoot, ".gitignore"), "utf8")

  assert.equal(packageJson.scripts?.["type-check"], "next typegen && tsc --noEmit")
  assert.match(gitignore, /^next-env\.d\.ts$/m)
})

test("production deployment has one main-only validation-gated path", () => {
  const workflowDirectory = path.join(repositoryRoot, ".github/workflows")
  assert.deepEqual(readdirSync(workflowDirectory).sort(), ["ci.yml", "deploy-pages.yml"])

  const deployment = readFileSync(path.join(workflowDirectory, "deploy-pages.yml"), "utf8")
  assert.match(deployment, /branches:\s*\n\s*- main/)
  assert.match(deployment, /if: github\.ref == 'refs\/heads\/main'/)
  for (const command of ["npm ci", "npm run lint", "npm test", "npm run type-check", "npm run build"]) {
    assert.match(deployment, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  }
  for (const action of [
    "actions/checkout",
    "actions/setup-node",
    "actions/configure-pages",
    "actions/upload-pages-artifact",
    "actions/deploy-pages",
  ]) {
    assert.match(deployment, new RegExp(`${action.replace("/", "\\/")}@v\\d+`))
  }
})

test("the README preserves the complete fresh-machine and genealogy handoff", () => {
  const readme = readFileSync(path.join(repositoryRoot, "README.md"), "utf8")

  assert.match(readme, /https:\/\/spac3boy\.github\.io\/familyatlas\//)
  for (const section of [
    "Technology stack",
    "Repository structure",
    "Install and run locally",
    "Commands and validation",
    "Production and deployment",
    "Research and canonical data",
    "Adding or changing genealogy",
    "Add a source",
    "Add a place",
    "Add a person",
    "Add a relationship",
    "Add an event",
    "Evidence and uncertainty rules",
    "Privacy for living relatives",
  ]) {
    assert.match(readme, new RegExp(`^#{2,3} ${section}$`, "m"))
  }
})
