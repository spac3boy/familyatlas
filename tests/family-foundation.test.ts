import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph } from "@/data";
import { foundationPeople } from "@/data/foundation/people";
import { foundationRelationships } from "@/data/foundation/relationships";
import { resolveSourceId, validateGenealogyGraph } from "@/lib/genealogy/validation";
import type {
  Event,
  PersonId,
  PlaceId,
  Relationship,
  RelationshipId,
  SourceReference,
} from "@/types";

const expectedPeople = [
  "person-michael-buquet",
  "person-aubin-buquet",
  "person-paulette-comeaux",
  "person-edmond-p-buquet-1919",
  "person-verna-arlene-bakke",
  "person-rita-leblanc-1928",
  "person-allen-comeaux-1925",
] as const satisfies readonly PersonId[];

const relationshipSignature = (relationship: Relationship): string => {
  if (relationship.type === "parent-child") {
    return `parent-child:${relationship.parentId}>${relationship.childId}`;
  }
  return `${relationship.type}:${[...relationship.personIds].sort().join("+")}`;
};

const expectedRelationshipSignatures = [
  "parent-child:person-aubin-buquet>person-michael-buquet",
  "parent-child:person-paulette-comeaux>person-michael-buquet",
  "parent-child:person-edmond-p-buquet-1919>person-aubin-buquet",
  "parent-child:person-verna-arlene-bakke>person-aubin-buquet",
  "parent-child:person-rita-leblanc-1928>person-paulette-comeaux",
  "parent-child:person-allen-comeaux-1925>person-paulette-comeaux",
  "spouse:person-edmond-p-buquet-1919+person-verna-arlene-bakke",
  "spouse:person-allen-comeaux-1925+person-rita-leblanc-1928",
].sort();

test("the canonical family graph passes runtime referential validation", () => {
  assert.deepEqual(validateGenealogyGraph(familyGraph), { valid: true, issues: [] });
});

test("the foundation module contains exactly the seven authorized people", () => {
  assert.deepEqual(
    foundationPeople.map(({ id }) => id).sort(),
    [...expectedPeople].sort(),
  );
});

test("the foundation module contains exactly the supported in-scope family relationships", () => {
  const signatures = foundationRelationships.map(relationshipSignature).sort();
  assert.deepEqual(signatures, expectedRelationshipSignatures);
  assert.equal(new Set(signatures).size, signatures.length);
});

test("Aubin and Paulette are not normalized as spouses or partners", () => {
  const relationships: readonly Relationship[] = familyGraph.relationships;
  const couple = relationships.find((relationship) => {
    if (relationship.type === "parent-child") return false;
    const ids: readonly PersonId[] = relationship.personIds;
    return ids.includes("person-aubin-buquet") && ids.includes("person-paulette-comeaux");
  });
  assert.equal(couple, undefined);
});

test("every normalized evidence reference resolves to an inventoried source", () => {
  const references: SourceReference[] = [];

  for (const person of familyGraph.people) {
    references.push(...person.sourceRefs);
    for (const name of person.alternateNames) references.push(...name.sourceRefs);
  }
  for (const relationship of familyGraph.relationships) references.push(...relationship.sourceRefs);
  for (const event of familyGraph.events) references.push(...event.sourceRefs);
  for (const place of familyGraph.places) references.push(...place.sourceRefs);

  for (const reference of references) {
    assert.ok(
      resolveSourceId(familyGraph, reference.sourceId),
      `Missing source reference: ${reference.sourceId}`,
    );
  }
});

test("all relationship and event references stay inside the foundation graph", () => {
  const relationships: readonly Relationship[] = familyGraph.relationships;
  const events: readonly Event[] = familyGraph.events;
  const personIds = new Set<PersonId>(familyGraph.people.map(({ id }) => id));
  const relationshipIds = new Set<RelationshipId>(familyGraph.relationships.map(({ id }) => id));
  const placeIds = new Set<PlaceId>(familyGraph.places.map(({ id }) => id));

  for (const relationship of relationships) {
    const ids =
      relationship.type === "parent-child"
        ? [relationship.parentId, relationship.childId]
        : relationship.personIds;
    for (const id of ids) assert.ok(personIds.has(id), `Missing relationship person: ${id}`);
  }

  for (const event of events) {
    for (const id of event.personIds) assert.ok(personIds.has(id), `Missing event person: ${id}`);
    for (const id of event.relationshipIds ?? []) {
      assert.ok(relationshipIds.has(id), `Missing event relationship: ${id}`);
    }
    if (event.placeId) assert.ok(placeIds.has(event.placeId), `Missing event place: ${event.placeId}`);
    if (event.migration) {
      for (const id of [...event.migration.fromPlaceIds, ...event.migration.toPlaceIds]) {
        assert.ok(placeIds.has(id), `Missing migration place: ${id}`);
      }
    }
  }
});
