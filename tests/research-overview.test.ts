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
    total: 83,
    verified: 38,
    probable: 45,
    unresolved: 0,
  })
  assert.deepEqual(familyResearchOverview.coverage.relationships, {
    total: 119,
    verified: 57,
    probable: 62,
    unresolved: 0,
  })
  assert.deepEqual(familyResearchOverview.coverage.events, {
    total: 125,
    verified: 40,
    probable: 82,
    unresolved: 3,
  })
  assert.deepEqual(familyResearchOverview.coverage.places, {
    total: 38,
    verified: 16,
    probable: 22,
    unresolved: 0,
  })
  assert.equal(familyResearchOverview.coverage.sources, 60)
})

test("research conclusions preserve confidence separately from classified provenance", () => {
  const relationshipConclusions = Object.values(familyResearchOverview.conclusions)
    .flat()
    .filter(({ kind }) => kind === "relationship")
  const familyConfirmed = relationshipConclusions.filter(({ provenanceKinds }) =>
    provenanceKinds.includes("family-confirmed"),
  )

  assert.equal(familyConfirmed.length, 37)
  assert.ok(familyConfirmed.every(({ confidence }) => confidence === "verified"))
  const dualProvenance = familyConfirmed.filter(({ provenanceKinds }) =>
    provenanceKinds.includes("documented"),
  )
  assert.equal(dualProvenance.length, 25)
  assert.ok(dualProvenance.some(({ title }) => title === "Cathy B. McRae → Paige Bartholomew"))
  assert.ok(dualProvenance.some(({ title }) => title === "Allen Paul Comeaux Sr. → Peggy C. Miller"))
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
  assert.ok(normalizedResearchQuestions.every(({ researchFile }) => researchFile.startsWith("research/")))
  assert.ok(normalizedResearchQuestions.every(({ question, nextEvidence }) => question.length > 0 && nextEvidence.length > 0))
})
