import assert from "node:assert/strict";
import test from "node:test";

import { familyGraph } from "@/data";
import { foundationPeople } from "@/data/foundation/people";
import { foundationRelationships } from "@/data/foundation/relationships";
import { resolveSourceId, validateGenealogyGraph } from "@/lib/genealogy/validation";
import { evidenceProvenanceKinds } from "@/lib/genealogy/evidence";
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
  "person-sidney-paul-roger",
  "person-edmond-paul-buquet",
  "person-gina-buquet",
  "person-karla-vannessa-contreras-buquet",
  "person-chloe-eloise-buquet",
  "person-jolie-renee-buquet",
  "person-michael-buquet-edmond-child",
  "person-cathy-buquet",
  "person-russell-j-comeaux",
  "person-allen-paul-comeaux-jr",
  "person-peggy-comeaux",
  "person-priscilla-comeaux",
  "person-monica",
  "person-clarence-miller",
  "person-karlon",
  "person-tippy-leblanc",
  "person-richard-russell-mcrae",
  "person-paige-bartholomew",
  "person-sean-mcrae",
  "person-conrad-miller",
  "person-rustie-lynn-comeaux",
  "person-rhyan-comeaux",
  "person-dexter-babineaux",
  "person-gerard-comeaux",
  "person-casey-comeaux",
  "person-brandi-comeaux",
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
  "parent-child:person-paulette-comeaux>person-sidney-paul-roger",
  "parent-child:person-aubin-buquet>person-edmond-paul-buquet",
  "parent-child:person-paulette-comeaux>person-edmond-paul-buquet",
  "parent-child:person-aubin-buquet>person-gina-buquet",
  "parent-child:person-paulette-comeaux>person-gina-buquet",
  "parent-child:person-michael-buquet>person-chloe-eloise-buquet",
  "parent-child:person-karla-vannessa-contreras-buquet>person-chloe-eloise-buquet",
  "parent-child:person-michael-buquet>person-jolie-renee-buquet",
  "parent-child:person-karla-vannessa-contreras-buquet>person-jolie-renee-buquet",
  "parent-child:person-verna-arlene-bakke>person-michael-buquet-edmond-child",
  "parent-child:person-edmond-p-buquet-1919>person-michael-buquet-edmond-child",
  "parent-child:person-verna-arlene-bakke>person-cathy-buquet",
  "parent-child:person-edmond-p-buquet-1919>person-cathy-buquet",
  "parent-child:person-rita-leblanc-1928>person-russell-j-comeaux",
  "parent-child:person-allen-comeaux-1925>person-russell-j-comeaux",
  "parent-child:person-rita-leblanc-1928>person-allen-paul-comeaux-jr",
  "parent-child:person-allen-comeaux-1925>person-allen-paul-comeaux-jr",
  "parent-child:person-rita-leblanc-1928>person-peggy-comeaux",
  "parent-child:person-allen-comeaux-1925>person-peggy-comeaux",
  "parent-child:person-rita-leblanc-1928>person-priscilla-comeaux",
  "parent-child:person-allen-comeaux-1925>person-priscilla-comeaux",
  "spouse:person-allen-paul-comeaux-jr+person-monica",
  "spouse:person-clarence-miller+person-peggy-comeaux",
  "spouse:person-karlon+person-priscilla-comeaux",
  "spouse:person-priscilla-comeaux+person-tippy-leblanc",
  "parent-child:person-cathy-buquet>person-paige-bartholomew",
  "parent-child:person-richard-russell-mcrae>person-paige-bartholomew",
  "parent-child:person-cathy-buquet>person-sean-mcrae",
  "parent-child:person-richard-russell-mcrae>person-sean-mcrae",
  "parent-child:person-peggy-comeaux>person-conrad-miller",
  "parent-child:person-russell-j-comeaux>person-rustie-lynn-comeaux",
  "parent-child:person-russell-j-comeaux>person-rhyan-comeaux",
  "parent-child:person-priscilla-comeaux>person-dexter-babineaux",
  "parent-child:person-allen-paul-comeaux-jr>person-gerard-comeaux",
  "parent-child:person-allen-paul-comeaux-jr>person-casey-comeaux",
  "parent-child:person-allen-paul-comeaux-jr>person-brandi-comeaux",
  "spouse:person-edmond-p-buquet-1919+person-verna-arlene-bakke",
  "spouse:person-allen-comeaux-1925+person-rita-leblanc-1928",
  "spouse:person-karla-vannessa-contreras-buquet+person-michael-buquet",
].sort();

test("the canonical family graph passes runtime referential validation", () => {
  assert.deepEqual(validateGenealogyGraph(familyGraph), { valid: true, issues: [] });
});

test("the foundation module contains exactly the authorized close and lateral family people", () => {
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

test("Michael's six stated parent and grandparent links are family-confirmed", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const immediateAncestorRelationshipIds = new Set([
    "relationship-aubin-buquet-parent-michael-buquet",
    "relationship-paulette-comeaux-parent-michael-buquet",
    "relationship-edmond-buquet-parent-aubin-buquet",
    "relationship-verna-bakke-parent-aubin-buquet",
    "relationship-rita-leblanc-parent-paulette-comeaux",
    "relationship-allen-comeaux-parent-paulette-comeaux",
  ]);
  const parentChildRelationships = relationships.filter((relationship) =>
    immediateAncestorRelationshipIds.has(relationship.id),
  );

  assert.equal(parentChildRelationships.length, 6);
  for (const relationship of parentChildRelationships) {
    assert.equal(relationship.confidence, "verified");
    assert.ok(evidenceProvenanceKinds(relationship).includes("family-confirmed"));
    const familyConfirmation = relationship.provenance?.find(
      ({ kind }) => kind === "family-confirmed",
    );
    assert.ok(familyConfirmation);
    assert.deepEqual(familyConfirmation.sourceRefs, [{ sourceId: "SRC-A1-FAMILY-CURRENT" }]);
  }

  assert.deepEqual(
    parentChildRelationships
      .filter((relationship) => evidenceProvenanceKinds(relationship).includes("documented"))
      .map(({ id }) => id)
      .sort(),
    [
      "relationship-rita-leblanc-parent-paulette-comeaux",
      "relationship-verna-bakke-parent-aubin-buquet",
    ],
  );
});

test("siblings are represented only through family-confirmed shared-parent edges", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const expectedParents = new Map([
    ["person-sidney-paul-roger", ["person-paulette-comeaux"]],
    ["person-edmond-paul-buquet", ["person-aubin-buquet", "person-paulette-comeaux"]],
    ["person-gina-buquet", ["person-aubin-buquet", "person-paulette-comeaux"]],
  ]);

  for (const [childId, parentIds] of expectedParents) {
    const siblingRelationships = relationships.filter(
      (relationship) => relationship.type === "parent-child" && relationship.childId === childId,
    );
    assert.deepEqual(
      siblingRelationships.map((relationship) =>
        relationship.type === "parent-child" ? relationship.parentId : "",
      ).sort(),
      parentIds.sort(),
    );
    assert.ok(siblingRelationships.every(({ confidence }) => confidence === "verified"));
    assert.ok(
      siblingRelationships.every((relationship) =>
        evidenceProvenanceKinds(relationship).includes("family-confirmed"),
      ),
    );
  }

  assert.ok(relationships.every(({ type }) => type !== ("sibling" as Relationship["type"])));
});

test("parental sibling groups are documentary and never use redundant kinship edges", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const paternalChildren = relationships.filter(
    (relationship) =>
      relationship.type === "parent-child" &&
      ["person-michael-buquet-edmond-child", "person-cathy-buquet"].includes(
        relationship.childId,
      ),
  );
  const maternalChildren = relationships.filter(
    (relationship) =>
      relationship.type === "parent-child" &&
      [
        "person-russell-j-comeaux",
        "person-allen-paul-comeaux-jr",
        "person-peggy-comeaux",
        "person-priscilla-comeaux",
      ].includes(relationship.childId),
  );

  assert.equal(paternalChildren.length, 4);
  assert.equal(maternalChildren.length, 8);
  assert.ok(
    [...paternalChildren, ...maternalChildren].every((relationship) =>
      evidenceProvenanceKinds(relationship).includes("documented"),
    ),
  );
  assert.ok(
    [...paternalChildren, ...maternalChildren].every(
      (relationship) => !evidenceProvenanceKinds(relationship).includes("family-confirmed"),
    ),
  );
  assert.ok(
    relationships.every(({ type }) =>
      !["aunt", "uncle", "sibling"].includes(type),
    ),
  );
});

test("direct obituary parentage stays distinct from probable other-parent links", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const confidenceFor = (parentId: PersonId, childId: PersonId) =>
    relationships.find(
      (relationship) =>
        relationship.type === "parent-child" &&
        relationship.parentId === parentId &&
        relationship.childId === childId,
    )?.confidence;

  for (const childId of ["person-michael-buquet-edmond-child", "person-cathy-buquet"] as const) {
    assert.equal(confidenceFor("person-verna-arlene-bakke", childId), "verified");
    assert.equal(confidenceFor("person-edmond-p-buquet-1919", childId), "probable");
  }
  for (const childId of [
    "person-russell-j-comeaux",
    "person-allen-paul-comeaux-jr",
    "person-peggy-comeaux",
    "person-priscilla-comeaux",
  ] as const) {
    assert.equal(confidenceFor("person-rita-leblanc-1928", childId), "verified");
    assert.equal(confidenceFor("person-allen-comeaux-1925", childId), "probable");
  }
});

test("first-cousin parent assignments preserve direct versus documentary-inferred support", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const cousinIds = new Set<PersonId>([
    "person-paige-bartholomew",
    "person-sean-mcrae",
    "person-conrad-miller",
    "person-rustie-lynn-comeaux",
    "person-rhyan-comeaux",
    "person-dexter-babineaux",
    "person-gerard-comeaux",
    "person-casey-comeaux",
    "person-brandi-comeaux",
  ]);
  const cousinParentEdges = relationships.filter(
    (relationship) =>
      relationship.type === "parent-child" && cousinIds.has(relationship.childId),
  );

  assert.equal(cousinParentEdges.length, 11);
  assert.deepEqual(
    cousinParentEdges
      .filter(({ confidence }) => confidence === "verified")
      .map(({ id }) => id)
      .sort(),
    [
      "relationship-richard-mcrae-parent-paige-bartholomew",
      "relationship-richard-mcrae-parent-sean-mcrae",
    ],
  );
  assert.ok(cousinParentEdges.every((edge) =>
    evidenceProvenanceKinds(edge).includes("documented"),
  ));
  assert.ok(cousinParentEdges.every((edge) =>
    !evidenceProvenanceKinds(edge).includes("family-confirmed"),
  ));

  const sidney = familyGraph.people.find(({ id }) => id === "person-sidney-paul-roger");
  assert.ok(sidney && "idAliases" in sidney);
  assert.deepEqual(sidney.idAliases, ["person-sid-roger"]);
  assert.equal(
    sidney?.alternateNames.find(({ name }) => name === "Sid Roger")?.confidence,
    "verified",
  );
  assert.ok(!cousinIds.has("person-sidney-paul-roger"));
  assert.ok(!familyGraph.people.some(({ id }) =>
    ["person-lauren-dugas", "person-collin-adkisson"].includes(id),
  ));
});

test("Priscilla's two reported spouses remain separate probable identities", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const priscillaSpouses = relationships.flatMap((relationship) =>
    relationship.type === "spouse" &&
    relationship.personIds.includes("person-priscilla-comeaux")
      ? [relationship]
      : [],
  );
  assert.deepEqual(
    priscillaSpouses
      .flatMap(({ personIds }) => personIds.filter((id) => id !== "person-priscilla-comeaux"))
      .sort(),
    ["person-karlon", "person-tippy-leblanc"],
  );
  assert.ok(priscillaSpouses.every(({ confidence }) => confidence === "probable"));
});

test("living sibling birth data is privacy-minimized and uncertainty-preserving", () => {
  const siblingIds = new Set<PersonId>([
    "person-sidney-paul-roger",
    "person-edmond-paul-buquet",
    "person-gina-buquet",
  ]);
  const siblingBirths = familyGraph.events.filter(
    (event) =>
      event.type === "birth" &&
      event.personIds.some((id) => siblingIds.has(id)),
  );

  assert.deepEqual(
    siblingBirths.map(({ id, date }) => ({ id, date })),
    [
      { id: "event-edmond-paul-buquet-birth", date: { kind: "year", year: 1987 } },
      { id: "event-gina-buquet-birth", date: { kind: "year", year: 1990 } },
    ],
  );
  assert.ok(siblingBirths.every(({ date }) => date.kind !== "exact"));

  const gina = familyGraph.people.find(({ id }) => id === "person-gina-buquet");
  assert.equal(gina?.canonicalName, "Gina Buquet");
  assert.equal(gina?.alternateNames.find(({ name }) => name === "Gina Renee Buquet")?.confidence, "unresolved");
});

test("Michael's wife and daughters are family-confirmed without exact public birth dates", () => {
  const relationships: readonly Relationship[] = foundationRelationships;
  const familyIds = new Set<PersonId>([
    "person-karla-vannessa-contreras-buquet",
    "person-chloe-eloise-buquet",
    "person-jolie-renee-buquet",
  ]);
  const familyRelationships = relationships.filter((relationship) =>
    relationship.type === "parent-child"
      ? familyIds.has(relationship.childId)
      : relationship.personIds.some((id) => familyIds.has(id)),
  );

  assert.equal(familyRelationships.length, 5);
  assert.ok(familyRelationships.every(({ confidence }) => confidence === "verified"));
  assert.ok(
    familyRelationships.every((relationship) =>
      evidenceProvenanceKinds(relationship).includes("family-confirmed"),
    ),
  );

  const births = familyGraph.events.filter(
    (event) => event.type === "birth" && event.personIds.some((id) => familyIds.has(id)),
  );
  assert.deepEqual(
    births.map(({ id, date }) => ({ id, date })),
    [
      { id: "event-karla-contreras-buquet-birth", date: { kind: "year", year: 1989 } },
      { id: "event-chloe-buquet-birth", date: { kind: "year", year: 2019 } },
      { id: "event-jolie-buquet-birth", date: { kind: "year", year: 2022 } },
    ],
  );
  assert.ok(births.every(({ date }) => date.kind !== "exact"));
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
