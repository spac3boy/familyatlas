import assert from "node:assert/strict";
import test from "node:test";

import {
  familyGraph,
  familyGraphQueries as queries,
  familySearchIndex,
} from "@/data";
import { familyPlaceMapAnchors } from "@/data/geography/place-map-anchors";
import { evidenceProvenanceKinds } from "@/lib/genealogy/evidence";
import { buildPeopleDirectory } from "@/lib/genealogy/people-directory";
import { buildPersonDetailModel } from "@/lib/genealogy/person-detail";
import { buildPersonProfileModel } from "@/lib/genealogy/person-profile";
import { searchGlobalIndex } from "@/lib/genealogy/global-search";
import {
  buildFamilyJourneyModel,
  buildFamilyTimelineModel,
  layoutDaughterCenteredFamilyTree,
} from "@/lib/visualization";
import type { Event, PersonId, Relationship, RelationshipId } from "@/types";

const paternalAuntUncleIds = [
  "person-cathy-buquet",
  "person-michael-buquet-edmond-child",
] as const satisfies readonly PersonId[];

const maternalAuntUncleIds = [
  "person-allen-paul-comeaux-jr",
  "person-peggy-comeaux",
  "person-priscilla-comeaux",
  "person-russell-j-comeaux",
] as const satisfies readonly PersonId[];

const cousinIds = [
  "person-brandi-comeaux",
  "person-casey-comeaux",
  "person-conrad-miller",
  "person-dexter-babineaux",
  "person-gerard-comeaux",
  "person-paige-bartholomew",
  "person-rhyan-comeaux",
  "person-rustie-lynn-comeaux",
  "person-sean-mcrae",
] as const satisfies readonly PersonId[];

const familyConfirmedCousinParentEdgeIds = [
  "relationship-allen-paul-comeaux-jr-parent-brandi-comeaux",
  "relationship-allen-paul-comeaux-jr-parent-casey-comeaux",
  "relationship-allen-paul-comeaux-jr-parent-gerard-comeaux",
  "relationship-cathy-buquet-parent-paige-bartholomew",
  "relationship-cathy-buquet-parent-sean-mcrae",
  "relationship-peggy-comeaux-parent-conrad-miller",
  "relationship-priscilla-comeaux-parent-dexter-babineaux",
  "relationship-russell-comeaux-parent-rhyan-comeaux",
  "relationship-russell-comeaux-parent-rustie-lynn-comeaux",
] as const satisfies readonly RelationshipId[];

const ids = <T extends { readonly person: { readonly id: PersonId } }>(items: readonly T[]) =>
  items.map(({ person }) => person.id).sort();

test("C20E parental sibling groups derive only from the expected shared-parent edges", () => {
  assert.deepEqual(ids(queries.siblings("person-aubin-buquet")), [...paternalAuntUncleIds].sort());
  assert.deepEqual(ids(queries.siblings("person-paulette-comeaux")), [...maternalAuntUncleIds].sort());
  assert.equal(queries.siblings("person-aubin-buquet").length, 2);
  assert.equal(queries.siblings("person-paulette-comeaux").length, 4);
  assert.deepEqual(
    [...new Set(familyGraph.relationships.map(({ type }) => type))].sort(),
    ["parent-child", "partner", "spouse"],
  );
});

test("C20E preserves Michael's shared-parent sibling context without inventing Sidney's father", () => {
  const siblings = queries.siblings("person-michael-buquet");
  assert.deepEqual(ids(siblings), [
    "person-edmond-paul-buquet",
    "person-gina-buquet",
    "person-sidney-paul-roger",
  ]);
  assert.deepEqual(
    siblings.find(({ person }) => person.id === "person-sidney-paul-roger")?.sharedParents.map(
      ({ parent }) => parent.id,
    ),
    ["person-paulette-comeaux"],
  );
  assert.deepEqual(
    siblings.find(({ person }) => person.id === "person-gina-buquet")?.sharedParents.map(
      ({ parent }) => parent.id,
    ),
    ["person-aubin-buquet", "person-paulette-comeaux"],
  );
  assert.equal(
    familyGraph.relationships.some(
      (relationship) =>
        relationship.type === "parent-child" &&
        relationship.parentId === "person-aubin-buquet" &&
        relationship.childId === "person-sidney-paul-roger",
    ),
    false,
  );
  const sidney = buildPersonDetailModel(familyGraph, "person-sidney-paul-roger", queries);
  const gina = buildPersonDetailModel(familyGraph, "person-gina-buquet", queries);
  assert.equal(sidney?.relationshipLabel, "Maternal sibling through Paulette Comeaux");
  assert.equal(gina?.relationshipLabel, "Sibling through both recorded parents");
  assert.equal(queries.branchForPerson("person-sidney-paul-roger")?.classification, "maternal");
  assert.equal(queries.branchForPerson("person-gina-buquet")?.classification, "both");
});

test("C24 derives exactly nine verified first-cousin paths and excludes guarded identities", () => {
  const cousins = queries.firstCousins("person-michael-buquet");
  assert.deepEqual(ids(cousins), [...cousinIds].sort());
  assert.equal(cousins.length, 9);
  assert.ok(cousins.every(({ paths }) => paths.every(({ confidence }) => confidence === "verified")));
  for (const excludedId of [
    "person-sidney-paul-roger",
    "person-lauren-dugas",
    "person-collin-adkisson",
  ] as const satisfies readonly PersonId[]) {
    assert.equal(cousins.some(({ person }) => person.id === excludedId), false);
  }

  const cousinEdges = familyGraph.relationships.filter(({ id }) =>
    familyConfirmedCousinParentEdgeIds.includes(id as (typeof familyConfirmedCousinParentEdgeIds)[number]),
  ) as readonly Relationship[];
  assert.equal(cousinEdges.length, 9);
  assert.ok(cousinEdges.every(({ confidence }) => confidence === "verified"));
  assert.ok(cousinEdges.every((edge) => evidenceProvenanceKinds(edge).includes("documented")));
  assert.ok(cousinEdges.every((edge) => evidenceProvenanceKinds(edge).includes("family-confirmed")));
});

test("C20E preserves identity variants without duplicate accepted people", () => {
  const accepted = familyGraph.people.filter(({ researchStatus }) => researchStatus === "accepted");
  assert.equal(new Set(accepted.map(({ id }) => id)).size, accepted.length);
  assert.equal(accepted.filter(({ canonicalName }) => canonicalName === "Rhyan Comeaux").length, 1);
  assert.equal(accepted.some(({ canonicalName }) => /^Ryan(?: Earl)? Comeaux$/u.test(canonicalName)), false);
  const rhyan = queries.personById("person-rhyan-comeaux");
  assert.deepEqual(
    rhyan?.alternateNames.map(({ name, confidence }) => [name, confidence]),
    [
      ["Ryan Comeaux", "unresolved"],
      ["Ryan Earl Comeaux", "unresolved"],
    ],
  );

  const priscillas = accepted.filter(({ canonicalName, alternateNames }) =>
    canonicalName.includes("Priscilla") || alternateNames.some(({ name }) => name.includes("Priscilla")),
  );
  assert.equal(priscillas.length, 1);
  assert.equal(priscillas[0]?.id, "person-priscilla-comeaux");
  assert.ok(priscillas[0]?.alternateNames.some(({ name }) => name === "Priscilla LeBlanc"));
  assert.equal(queries.personById("person-lauren-dugas"), undefined);
  assert.equal(queries.personById("person-collin-adkisson"), undefined);
});

test("C20E keeps extended-family directory, search, profiles, and tree projections coherent", () => {
  const directory = new Map(buildPeopleDirectory(familyGraph, queries).map((record) => [record.person.id, record]));
  const tree = layoutDaughterCenteredFamilyTree(
    familyGraph,
    familyGraph.events,
    new Set(familyGraph.people.map(({ id }) => id)),
  );
  const treeIds = new Set(tree.nodes.map(({ personId }) => personId));
  assert.equal(treeIds.size, familyGraph.people.length);

  for (const cousinId of cousinIds) {
    const record = directory.get(cousinId);
    assert.ok(record);
    assert.equal(record.relationshipConfidence, "verified");
    assert.ok(record.branch === "maternal" || record.branch === "paternal");
    assert.ok(searchGlobalIndex(familySearchIndex, record.person.canonicalName).some(
      ({ kind, entityId }) => kind === "person" && entityId === cousinId,
    ));
    assert.ok(buildPersonProfileModel(familyGraph, cousinId, queries));
    assert.ok(treeIds.has(cousinId));
  }

  assert.equal(directory.get("person-cathy-buquet")?.relationshipLabel, "Paternal aunt/uncle");
  assert.equal(directory.get("person-russell-j-comeaux")?.relationshipLabel, "Maternal aunt/uncle");
});

test("C20E prevents sparse living-relative records from inventing life ranges or journeys", () => {
  const protectedIds = new Set<PersonId>([
    "person-sidney-paul-roger",
    "person-edmond-paul-buquet",
    "person-gina-buquet",
    "person-karla-vannessa-contreras-buquet",
    "person-chloe-eloise-buquet",
    "person-jolie-renee-buquet",
    ...paternalAuntUncleIds,
    ...maternalAuntUncleIds,
    ...cousinIds,
  ]);
  const protectedEvents = familyGraph.events.filter(({ personIds }) =>
    personIds.some((personId) => protectedIds.has(personId)),
  ) as readonly Event[];
  assert.ok(protectedEvents.every(({ date }) => date.kind !== "exact"));
  assert.ok(protectedEvents.every(({ placeId, migration }) => !placeId && !migration));

  for (const cousinId of cousinIds) {
    const timeline = buildFamilyTimelineModel(familyGraph, {
      scope: "selected",
      selectedPersonId: cousinId,
    });
    assert.equal(timeline.rows.length, 0);
    assert.equal(timeline.domain, undefined);

    const journeys = buildFamilyJourneyModel(
      familyGraph,
      familyPlaceMapAnchors,
      { scope: "selected", selectedPersonId: cousinId, selectedYear: null },
      queries,
    );
    assert.deepEqual(journeys.points, []);
    assert.deepEqual(journeys.movements, []);
    assert.deepEqual(journeys.unmappedPlaces, []);
  }

  const publicAssociation = familyGraph.sources.find(
    ({ id }) => id === "SRC-MCRAE-PUBLIC-RECORD-ASSOCIATIONS",
  );
  assert.deepEqual(publicAssociation?.urls, []);
  assert.deepEqual(publicAssociation?.citationHandles, []);
});
