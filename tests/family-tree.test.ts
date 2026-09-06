import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph } from "@/data";
import {
  buildFamilyTreeHierarchy,
  defaultExpandedPersonIds,
  formatTreeDate,
  layoutFamilyTree,
  personLifeDateLabel,
} from "@/lib/visualization";
import type { ParentChildRelationship, PersonId } from "@/types";

const everyPersonExpanded = new Set<PersonId>(familyGraph.people.map(({ id }) => id));

test("the all-family layout derives every node and edge from the real canonical graph", () => {
  const hierarchy = buildFamilyTreeHierarchy(familyGraph, {
    scope: "all",
    expandedPersonIds: everyPersonExpanded,
  });
  const layout = layoutFamilyTree(hierarchy, familyGraph.events);
  const canonicalParentRelationships = familyGraph.relationships.filter(
    (relationship): relationship is ParentChildRelationship =>
      relationship.type === "parent-child",
  );

  assert.equal(layout.rootPersonId, "person-michael-buquet");
  assert.deepEqual(
    new Set(layout.nodes.map(({ personId }) => personId)),
    new Set(familyGraph.people.map(({ id }) => id)),
  );
  assert.equal(layout.edges.length, canonicalParentRelationships.length);

  const relationshipsById = new Map(
    canonicalParentRelationships.map((relationship) => [relationship.id, relationship]),
  );
  for (const edge of layout.edges) {
    const relationship = relationshipsById.get(edge.relationshipId);
    assert.ok(relationship, `Missing canonical relationship ${edge.relationshipId}`);
    assert.equal(edge.childPersonId, relationship.childId);
    assert.equal(edge.parentPersonId, relationship.parentId);
    assert.equal(edge.confidence, relationship.confidence);
    assert.match(edge.path, /^M/);
  }
});

test("paternal and maternal scopes retain Michael while filtering the opposite root branch", () => {
  const paternal = layoutFamilyTree(
    buildFamilyTreeHierarchy(familyGraph, {
      scope: "paternal",
      expandedPersonIds: everyPersonExpanded,
    }),
    familyGraph.events,
  );
  const maternal = layoutFamilyTree(
    buildFamilyTreeHierarchy(familyGraph, {
      scope: "maternal",
      expandedPersonIds: everyPersonExpanded,
    }),
    familyGraph.events,
  );
  const paternalIds = new Set(paternal.nodes.map(({ personId }) => personId));
  const maternalIds = new Set(maternal.nodes.map(({ personId }) => personId));

  assert.ok(paternalIds.has("person-michael-buquet"));
  assert.ok(paternalIds.has("person-aubin-buquet"));
  assert.ok(!paternalIds.has("person-paulette-comeaux"));
  assert.ok(maternalIds.has("person-michael-buquet"));
  assert.ok(maternalIds.has("person-paulette-comeaux"));
  assert.ok(!maternalIds.has("person-aubin-buquet"));
});

test("selected-person scope creates an ancestor projection without adding descendants", () => {
  const hierarchy = buildFamilyTreeHierarchy(familyGraph, {
    scope: "selected",
    selectedPersonId: "person-verna-arlene-bakke",
    expandedPersonIds: everyPersonExpanded,
  });
  const layout = layoutFamilyTree(hierarchy, familyGraph.events);
  const ids = new Set(layout.nodes.map(({ personId }) => personId));

  assert.equal(layout.rootPersonId, "person-verna-arlene-bakke");
  assert.ok(ids.has("person-oscar-paul-bakke"));
  assert.ok(ids.has("person-olga-josephine-doely"));
  assert.ok(!ids.has("person-aubin-buquet"));
  assert.ok(!ids.has("person-michael-buquet"));
});

test("the default window folds older ancestry and an individual branch can expand", () => {
  const initiallyExpanded = defaultExpandedPersonIds(familyGraph, { scope: "all" }, 3);
  const initialLayout = layoutFamilyTree(
    buildFamilyTreeHierarchy(familyGraph, {
      scope: "all",
      expandedPersonIds: initiallyExpanded,
    }),
    familyGraph.events,
  );
  assert.equal(Math.max(...initialLayout.nodes.map(({ generation }) => generation)), 3);

  const expandable = initialLayout.nodes.find(
    ({ generation, hasParents, expanded }) => generation === 3 && hasParents && !expanded,
  );
  assert.ok(expandable);
  const expanded = new Set(initiallyExpanded).add(expandable.personId);
  const expandedLayout = layoutFamilyTree(
    buildFamilyTreeHierarchy(familyGraph, { scope: "all", expandedPersonIds: expanded }),
    familyGraph.events,
  );

  assert.ok(expandedLayout.nodes.length > initialLayout.nodes.length);
  assert.ok(expandedLayout.nodes.some(({ generation }) => generation === 4));
});

test("tree date labels show supported precision and omit unknown dates", () => {
  assert.equal(personLifeDateLabel("person-michael-buquet", familyGraph.events), undefined);
  assert.equal(
    personLifeDateLabel("person-verna-arlene-bakke", familyGraph.events),
    "b. 1921 · d. 2021",
  );
  assert.equal(formatTreeDate({ kind: "circa", value: { kind: "year", year: 1790 } }), "c. 1790");
  assert.equal(
    formatTreeDate({
      kind: "range",
      start: { kind: "year", year: 1785 },
      end: { kind: "year", year: 1786 },
    }),
    "1785–1786",
  );
  assert.equal(formatTreeDate({ kind: "unknown" }), undefined);
});

test("hierarchy construction rejects a root absent from the canonical graph", () => {
  assert.throws(
    () =>
      buildFamilyTreeHierarchy(familyGraph, {
        scope: "selected",
        selectedPersonId: "person-not-present",
      }),
    /root is not in the canonical graph/,
  );
});

test("default expansion validates its generation boundary", () => {
  assert.throws(() => defaultExpandedPersonIds(familyGraph, { scope: "all" }, 0), RangeError);
  assert.throws(() => defaultExpandedPersonIds(familyGraph, { scope: "all" }, 2.5), RangeError);
});
