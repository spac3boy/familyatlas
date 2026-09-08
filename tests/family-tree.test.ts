import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph, familyGraphQueries } from "@/data";
import {
  buildFamilyTreeHierarchy,
  defaultExpandedPersonIds,
  formatTreeDate,
  layoutDaughterCenteredFamilyTree,
  layoutFamilyTree,
  personLifeDateLabel,
} from "@/lib/visualization";
import type { GenealogyGraph, ParentChildRelationship, PersonId } from "@/types";

const everyPersonExpanded = new Set<PersonId>(familyGraph.people.map(({ id }) => id));

test("the all-family ancestry layout derives every reachable ancestor node and edge", () => {
  const hierarchy = buildFamilyTreeHierarchy(familyGraph, {
    scope: "all",
    expandedPersonIds: everyPersonExpanded,
  });
  const layout = layoutFamilyTree(hierarchy, familyGraph.events);
  const ancestryPersonIds = new Set<PersonId>([
    "person-michael-buquet",
    ...familyGraphQueries.ancestors("person-michael-buquet").map(({ person }) => person.id),
  ]);
  const canonicalParentRelationships = familyGraph.relationships.filter(
    (relationship): relationship is ParentChildRelationship =>
      relationship.type === "parent-child" &&
      ancestryPersonIds.has(relationship.parentId) &&
      ancestryPersonIds.has(relationship.childId),
  );

  assert.equal(layout.rootPersonId, "person-michael-buquet");
  assert.deepEqual(
    new Set(layout.nodes.map(({ personId }) => personId)),
    ancestryPersonIds,
  );
  assert.equal(layout.edges.length, canonicalParentRelationships.length);
  assert.ok(!layout.nodes.some(({ personId }) => personId === "person-gina-buquet"));
  assert.ok(!layout.nodes.some(({ personId }) => personId === "person-chloe-eloise-buquet"));

  const relationshipsById = new Map(
    canonicalParentRelationships.map((relationship) => [relationship.id, relationship]),
  );
  for (const edge of layout.edges) {
    assert.equal(edge.relationshipType, "parent-child");
    if (edge.relationshipType !== "parent-child") continue;
    const relationship = relationshipsById.get(edge.relationshipId);
    assert.ok(relationship, `Missing canonical relationship ${edge.relationshipId}`);
    assert.equal(edge.childPersonId, relationship.childId);
    assert.equal(edge.parentPersonId, relationship.parentId);
    assert.equal(edge.confidence, relationship.confidence);
    assert.match(edge.path, /^M/);
  }
});

test("the default family overview centers both daughters and includes immediate collateral family", () => {
  const layout = layoutDaughterCenteredFamilyTree(
    familyGraph,
    familyGraph.events,
    everyPersonExpanded,
  );
  const nodes = new Map(layout.nodes.map((node) => [node.personId, node]));

  assert.equal(layout.rootPersonId, "person-chloe-eloise-buquet");
  assert.equal(nodes.get("person-chloe-eloise-buquet")?.role, "focus");
  assert.equal(nodes.get("person-jolie-renee-buquet")?.role, "focus");
  assert.equal(nodes.get("person-chloe-eloise-buquet")?.generation, 0);
  assert.equal(nodes.get("person-jolie-renee-buquet")?.generation, 0);
  assert.equal(nodes.get("person-michael-buquet")?.generation, 1);
  assert.equal(nodes.get("person-karla-vannessa-contreras-buquet")?.generation, 1);
  assert.ok(
    (nodes.get("person-karla-vannessa-contreras-buquet")?.x ?? Number.POSITIVE_INFINITY) <
      (nodes.get("person-chloe-eloise-buquet")?.x ?? Number.NEGATIVE_INFINITY),
  );
  assert.ok(
    (nodes.get("person-michael-buquet")?.x ?? Number.NEGATIVE_INFINITY) >
      (nodes.get("person-chloe-eloise-buquet")?.x ?? Number.POSITIVE_INFINITY),
  );
  const michaelY = nodes.get("person-michael-buquet")?.y;
  const karlaY = nodes.get("person-karla-vannessa-contreras-buquet")?.y;
  const chloeY = nodes.get("person-chloe-eloise-buquet")?.y;
  const jolieY = nodes.get("person-jolie-renee-buquet")?.y;
  const siblingYs = [
    nodes.get("person-edmond-paul-buquet")?.y,
    nodes.get("person-gina-buquet")?.y,
    nodes.get("person-sidney-paul-roger")?.y,
  ];
  assert.notEqual(michaelY, undefined);
  assert.equal(karlaY, michaelY);
  assert.equal(michaelY, ((chloeY ?? 0) + (jolieY ?? 0)) / 2);
  assert.ok(siblingYs.some((y) => y !== undefined && y < (michaelY ?? 0)));
  assert.ok(siblingYs.some((y) => y !== undefined && y > (michaelY ?? 0)));
  assert.equal(nodes.get("person-sidney-paul-roger")?.role, "collateral");
  assert.equal(nodes.get("person-cathy-buquet")?.role, "collateral");
  assert.equal(nodes.get("person-russell-j-comeaux")?.role, "collateral");
  assert.equal(nodes.get("person-monica")?.role, "collateral");
  assert.equal(nodes.get("person-paige-bartholomew")?.role, "collateral");
  assert.equal(nodes.get("person-conrad-miller")?.role, "collateral");
  assert.equal(nodes.get("person-richard-russell-mcrae")?.role, "collateral");
  assert.equal(nodes.get("person-paige-bartholomew")?.generation, 1);
  assert.equal(nodes.get("person-conrad-miller")?.generation, 1);
  assert.equal(nodes.size, familyGraph.people.length);
});

test("daughter-centered edges come only from canonical relationships", () => {
  const layout = layoutDaughterCenteredFamilyTree(
    familyGraph,
    familyGraph.events,
    everyPersonExpanded,
  );
  const relationships = new Map(familyGraph.relationships.map((relationship) => [relationship.id, relationship]));

  assert.ok(layout.edges.length > 0);
  for (const edge of layout.edges) {
    const relationship = relationships.get(edge.relationshipId);
    assert.ok(relationship, `Missing canonical relationship ${edge.relationshipId}`);
    assert.equal(edge.relationshipType, relationship.type);
  }
  const spouseEdge = layout.edges.find(
    ({ relationshipId }) =>
      relationshipId === "relationship-michael-buquet-spouse-karla-contreras-buquet",
  );
  assert.equal(spouseEdge?.relationshipType, "spouse");
  assert.ok(spouseEdge?.path.includes("C"), "The side-by-side spouse connector should curve between columns");

  const sidneyParentEdges = layout.edges.flatMap((edge) =>
    edge.relationshipType === "parent-child" && edge.childPersonId === "person-sidney-paul-roger"
      ? [edge]
      : [],
  );
  assert.deepEqual(sidneyParentEdges.map(({ parentPersonId }) => parentPersonId), [
    "person-paulette-comeaux",
  ]);

  const cathyParentEdges = layout.edges.flatMap((edge) =>
    edge.relationshipType === "parent-child" && edge.childPersonId === "person-cathy-buquet"
      ? [edge]
      : [],
  );
  assert.deepEqual(
    cathyParentEdges.map(({ parentPersonId }) => parentPersonId).sort(),
    ["person-edmond-p-buquet-1919", "person-verna-arlene-bakke"],
  );
  assert.ok(
    layout.edges.some(
      ({ relationshipId }) =>
        relationshipId === "relationship-priscilla-comeaux-spouse-karlon",
    ),
  );
  assert.ok(
    layout.edges.some(
      ({ relationshipId }) =>
        relationshipId === "relationship-priscilla-comeaux-spouse-tippy-leblanc",
    ),
  );
  const paigeParentEdges = layout.edges.flatMap((edge) =>
    edge.relationshipType === "parent-child" && edge.childPersonId === "person-paige-bartholomew"
      ? [edge]
      : [],
  );
  assert.deepEqual(
    paigeParentEdges.map(({ parentPersonId }) => parentPersonId).sort(),
    ["person-cathy-buquet", "person-richard-russell-mcrae"],
  );
  assert.equal(
    paigeParentEdges.find(({ parentPersonId }) => parentPersonId === "person-cathy-buquet")
      ?.confidence,
    "probable",
  );
  assert.ok(
    layout.edges.some(
      ({ relationshipId }) =>
        relationshipId === "relationship-allen-paul-comeaux-jr-parent-gerard-comeaux",
    ),
  );
});

test("future supported Karla ancestry projects outward from her left-hand position", () => {
  const testParentId: PersonId = "person-test-karla-parent";
  const testRelationshipId = "relationship-test-karla-parent" as const;
  const exemplarPerson = familyGraph.people[0];
  const exemplarRelationship = familyGraph.relationships.find(
    (relationship): relationship is ParentChildRelationship => relationship.type === "parent-child",
  );
  assert.ok(exemplarPerson);
  assert.ok(exemplarRelationship);

  const graphWithKarlaParent: GenealogyGraph = {
    ...familyGraph,
    people: [
      ...familyGraph.people,
      { ...exemplarPerson, id: testParentId, canonicalName: "Test Karla Parent" },
    ],
    relationships: [
      ...familyGraph.relationships,
      {
        ...exemplarRelationship,
        id: testRelationshipId,
        parentId: testParentId,
        childId: "person-karla-vannessa-contreras-buquet",
      },
    ],
  };
  const expanded = new Set<PersonId>(graphWithKarlaParent.people.map(({ id }) => id));
  const layout = layoutDaughterCenteredFamilyTree(
    graphWithKarlaParent,
    graphWithKarlaParent.events,
    expanded,
  );
  const nodes = new Map(layout.nodes.map((node) => [node.personId, node]));

  assert.ok(
    (nodes.get(testParentId)?.x ?? Number.POSITIVE_INFINITY) <
      (nodes.get("person-karla-vannessa-contreras-buquet")?.x ?? Number.NEGATIVE_INFINITY),
  );
  const parentEdge = layout.edges.find(({ relationshipId }) => relationshipId === testRelationshipId);
  assert.equal(parentEdge?.relationshipType, "parent-child");
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
