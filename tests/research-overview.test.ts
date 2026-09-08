import assert from "node:assert/strict"
import test from "node:test"

import {
  familyGraph,
  familyResearchOverview,
  normalizedResearchQuestions,
  researchQuestionGroups,
} from "@/data"
import { buildResearchOverview } from "@/lib/genealogy/research-overview"

test("research coverage is derived from the accepted canonical graph", () => {
  assert.deepEqual(familyResearchOverview.coverage.people, {
    total: 57,
    verified: 16,
    probable: 41,
    unresolved: 0,
  })
  assert.deepEqual(familyResearchOverview.coverage.relationships, {
    total: 82,
    verified: 20,
    probable: 62,
    unresolved: 0,
  })
  assert.deepEqual(familyResearchOverview.coverage.events, {
    total: 120,
    verified: 35,
    probable: 82,
    unresolved: 3,
  })
  assert.deepEqual(familyResearchOverview.coverage.places, {
    total: 38,
    verified: 16,
    probable: 22,
    unresolved: 0,
  })
  assert.equal(familyResearchOverview.coverage.sources, 53)
})

test("every canonical conclusion retains confidence, source references, and a stable destination", () => {
  const model = buildResearchOverview(familyGraph)
  const conclusions = Object.values(model.conclusions).flat()
  const acceptedEntityCount =
    familyGraph.people.length +
    familyGraph.relationships.length +
    familyGraph.events.length +
    familyGraph.places.length
  const sourceIds = new Set(familyGraph.sources.map(({ id }) => id))

  assert.equal(conclusions.length, acceptedEntityCount)
  assert.ok(conclusions.every(({ sourceIds: references }) => references.length > 0))
  assert.ok(conclusions.every(({ sourceIds: references }) => references.every((id) => sourceIds.has(id))))
  assert.ok(conclusions.every(({ href }) => href?.startsWith("/people/") || href?.startsWith("/places/")))
})

test("source inventory groups every accepted source exactly once", () => {
  const grouped = familyResearchOverview.sourceGroups.flatMap(({ sources }) => sources)
  assert.equal(grouped.length, familyGraph.sources.length)
  assert.equal(new Set(grouped.map(({ id }) => id)).size, grouped.length)
  assert.ok(grouped.every(({ researchStatus }) => researchStatus === "accepted"))
})

test("normalized research questions are explicit, unique, and cover every archive group", () => {
  assert.equal(
    new Set(normalizedResearchQuestions.map(({ id }) => id)).size,
    normalizedResearchQuestions.length,
  )
  assert.deepEqual(
    new Set(normalizedResearchQuestions.map(({ group }) => group)),
    new Set(researchQuestionGroups),
  )
  assert.ok(normalizedResearchQuestions.every(({ researchFile }) => researchFile === "research/open-questions.md"))
  assert.ok(normalizedResearchQuestions.every(({ question, nextEvidence }) => question.length > 0 && nextEvidence.length > 0))
})
