import type {
  Confidence,
  NonEmptyReadonlyArray,
  ParentChildRelationship,
  PersonId,
  Relationship,
  RelationshipId,
  SourceReference,
} from "@/types";

function parentChild(
  id: RelationshipId,
  parentId: PersonId,
  childId: PersonId,
  confidence: Confidence,
  sourceRefs: NonEmptyReadonlyArray<SourceReference>,
  originalId: string,
): ParentChildRelationship {
  return {
    id,
    type: "parent-child",
    parentage: "unknown",
    parentId,
    childId,
    confidence,
    researchStatus: "accepted",
    sourceRefs,
    researchRefs: [{ file: originalId.startsWith("claim-verna-") ? v : e, originalId }],
    notes: ["The parent-child link is supported, but a biological, adoptive, or legal subtype was not separately documented."],
  };
}

function couple(
  id: RelationshipId,
  personIds: readonly [PersonId, PersonId],
  confidence: Confidence,
  sourceRefs: NonEmptyReadonlyArray<SourceReference>,
  originalId: string,
  owner: string,
  type: "spouse" | "partner" = "spouse",
): Relationship {
  return { id, type, personIds, confidence, researchStatus: "accepted", sourceRefs, researchRefs: [{ file: owner, originalId }] };
}

const e = "research/people/edmond-p-buquet.md";
const v = "research/people/verna-arlene-bakke-buquet.md";

export const paternalAncestorRelationships = [
  parentChild("relationship-aubin-vincent-buquet-parent-edmond-buquet", "person-aubin-vincent-buquet-1887", "person-edmond-p-buquet-1919", "verified", [{ sourceId: "SRC-EDMOND-EVE-OBITUARY" }], "claim-edmond-p-buquet-010"),
  parentChild("relationship-lena-maronge-parent-edmond-buquet", "person-lena-maronge-1890", "person-edmond-p-buquet-1919", "verified", [{ sourceId: "SRC-EDMOND-EVE-OBITUARY" }], "claim-edmond-p-buquet-011"),
  parentChild("relationship-quentin-buquet-parent-aubin-vincent-buquet", "person-quentin-alcide-augustin-buquet", "person-aubin-vincent-buquet-1887", "probable", [{ sourceId: "SRC-EDMOND-AUBIN-GENEALOGY" }, { sourceId: "SRC-EDMOND-QUENTIN-GENEALOGY" }], "claim-edmond-p-buquet-091"),
  parentChild("relationship-jeanne-savoie-parent-aubin-vincent-buquet", "person-jeanne-octavie-savoie", "person-aubin-vincent-buquet-1887", "probable", [{ sourceId: "SRC-EDMOND-AUBIN-GENEALOGY" }, { sourceId: "SRC-EDMOND-QUENTIN-GENEALOGY" }], "claim-edmond-p-buquet-091"),
  parentChild("relationship-francois-luc-buquet-parent-quentin-buquet", "person-francois-luc-theodore-buquet", "person-quentin-alcide-augustin-buquet", "probable", [{ sourceId: "SRC-EDMOND-FRANCOIS-GENEALOGY" }, { sourceId: "SRC-EDMOND-QUENTIN-GENEALOGY" }], "claim-edmond-p-buquet-092"),
  parentChild("relationship-celeste-leblanc-parent-quentin-buquet", "person-celeste-felonise-leblanc", "person-quentin-alcide-augustin-buquet", "probable", [{ sourceId: "SRC-EDMOND-FRANCOIS-GENEALOGY" }, { sourceId: "SRC-EDMOND-CELESTE-INDEX" }], "claim-edmond-p-buquet-092"),
  parentChild("relationship-francois-michel-buquet-parent-francois-luc-buquet", "person-francois-michel-jacques-buquet", "person-francois-luc-theodore-buquet", "probable", [{ sourceId: "SRC-EDMOND-FRANCOIS-GENEALOGY" }, { sourceId: "SRC-EDMOND-MARIE-LOUISE-GENEALOGY" }], "claim-edmond-p-buquet-093"),
  parentChild("relationship-marie-anne-henry-parent-francois-luc-buquet", "person-marie-anne-henry", "person-francois-luc-theodore-buquet", "probable", [{ sourceId: "SRC-EDMOND-FRANCOIS-GENEALOGY" }, { sourceId: "SRC-EDMOND-MARIE-LOUISE-GENEALOGY" }], "claim-edmond-p-buquet-093"),
  parentChild("relationship-marcelin-savoie-parent-jeanne-savoie", "person-marcelin-tiburse-savoie", "person-jeanne-octavie-savoie", "probable", [{ sourceId: "SRC-EDMOND-MAGNOLIA-CEMETERY" }], "claim-edmond-p-buquet-094"),
  parentChild("relationship-malvina-bergeron-parent-jeanne-savoie", "person-malvina-bergeron", "person-jeanne-octavie-savoie", "probable", [{ sourceId: "SRC-EDMOND-MAGNOLIA-CEMETERY" }], "claim-edmond-p-buquet-094"),
  parentChild("relationship-oscar-bakke-parent-verna-bakke", "person-oscar-paul-bakke", "person-verna-arlene-bakke", "verified", [{ sourceId: "SRC-VERNA-OBITUARY" }, { sourceId: "SRC-VERNA-OSCAR-DEATH" }], "claim-verna-arlene-bakke-010"),
  parentChild("relationship-olga-doely-parent-verna-bakke", "person-olga-josephine-doely", "person-verna-arlene-bakke", "verified", [{ sourceId: "SRC-VERNA-OBITUARY" }, { sourceId: "SRC-VERNA-OLGA-DEATH" }], "claim-verna-arlene-bakke-011"),
  parentChild("relationship-martin-bakke-parent-oscar-bakke", "person-martin-h-bakke", "person-oscar-paul-bakke", "verified", [{ sourceId: "SRC-VERNA-OSCAR-DEATH" }], "claim-verna-arlene-bakke-091"),
  parentChild("relationship-olava-dukleth-parent-oscar-bakke", "person-olava-olausdatter-dukleth", "person-oscar-paul-bakke", "verified", [{ sourceId: "SRC-VERNA-OSCAR-DEATH" }], "claim-verna-arlene-bakke-091"),
  parentChild("relationship-hans-bakke-parent-martin-bakke", "person-hans-hansen-bakke-1801", "person-martin-h-bakke", "verified", [{ sourceId: "SRC-VERNA-MARTIN-DEATH" }], "claim-verna-arlene-bakke-092"),
  parentChild("relationship-ingeborg-skore-parent-martin-bakke", "person-ingeborg-skore", "person-martin-h-bakke", "verified", [{ sourceId: "SRC-VERNA-MARTIN-DEATH" }], "claim-verna-arlene-bakke-092"),
  parentChild("relationship-olaus-dukleth-parent-olava-dukleth", "person-olaus-paulsen-dukleth", "person-olava-olausdatter-dukleth", "probable", [{ sourceId: "SRC-VERNA-COMPILED-DUKLETH" }, { sourceId: "SRC-VERNA-OLD-TRINITY" }], "claim-verna-arlene-bakke-093"),
  parentChild("relationship-grethe-melhus-parent-olava-dukleth", "person-grethe-pauline-pedersdatter-melhus", "person-olava-olausdatter-dukleth", "probable", [{ sourceId: "SRC-VERNA-COMPILED-DUKLETH" }], "claim-verna-arlene-bakke-093"),
  parentChild("relationship-nicolai-doely-parent-olga-doely", "person-nicolai-ingvaldsen-doely", "person-olga-josephine-doely", "probable", [{ sourceId: "SRC-VERNA-COMPILED-DOELY" }, { sourceId: "SRC-VERNA-STYREK-DEATH", note: "Establishes the couple through another child, not Olga directly." }], "claim-verna-arlene-bakke-094"),
  parentChild("relationship-serine-roble-parent-olga-doely", "person-serine-roble", "person-olga-josephine-doely", "probable", [{ sourceId: "SRC-VERNA-COMPILED-DOELY" }, { sourceId: "SRC-VERNA-STYREK-DEATH", note: "Establishes the couple through another child, not Olga directly." }], "claim-verna-arlene-bakke-094"),
  parentChild("relationship-ingvald-doely-parent-nicolai-doely", "person-ingvald-throndsen-doely", "person-nicolai-ingvaldsen-doely", "probable", [{ sourceId: "SRC-VERNA-COMPILED-DOELY" }, { sourceId: "SRC-VERNA-OLD-TRINITY", note: "Collateral evidence for the older couple." }], "claim-verna-arlene-bakke-095"),
  parentChild("relationship-helene-blexrud-parent-nicolai-doely", "person-helene-blexrud", "person-nicolai-ingvaldsen-doely", "probable", [{ sourceId: "SRC-VERNA-COMPILED-DOELY" }, { sourceId: "SRC-VERNA-OLD-TRINITY", note: "Collateral evidence for the older couple." }], "claim-verna-arlene-bakke-095"),

  couple("relationship-aubin-vincent-buquet-spouse-lena-maronge", ["person-aubin-vincent-buquet-1887", "person-lena-maronge-1890"], "verified", [{ sourceId: "SRC-EDMOND-EVE-OBITUARY" }, { sourceId: "SRC-EDMOND-MAGNOLIA-CEMETERY" }], "claim-edmond-p-buquet-090", e),
  couple("relationship-quentin-buquet-spouse-jeanne-savoie", ["person-quentin-alcide-augustin-buquet", "person-jeanne-octavie-savoie"], "probable", [{ sourceId: "SRC-EDMOND-QUENTIN-GENEALOGY" }], "claim-edmond-p-buquet-091", e),
  couple("relationship-francois-luc-buquet-spouse-celeste-leblanc", ["person-francois-luc-theodore-buquet", "person-celeste-felonise-leblanc"], "probable", [{ sourceId: "SRC-EDMOND-FRANCOIS-GENEALOGY" }, { sourceId: "SRC-EDMOND-CELESTE-INDEX" }], "claim-edmond-p-buquet-092", e),
  couple("relationship-francois-michel-buquet-spouse-marie-anne-henry", ["person-francois-michel-jacques-buquet", "person-marie-anne-henry"], "probable", [{ sourceId: "SRC-EDMOND-FRANCOIS-GENEALOGY" }, { sourceId: "SRC-EDMOND-MARIE-LOUISE-GENEALOGY" }], "claim-edmond-p-buquet-093", e),
  couple("relationship-marcelin-savoie-partner-malvina-bergeron", ["person-marcelin-tiburse-savoie", "person-malvina-bergeron"], "probable", [{ sourceId: "SRC-EDMOND-MAGNOLIA-CEMETERY" }], "claim-edmond-p-buquet-094", e, "partner"),
  couple("relationship-oscar-bakke-spouse-olga-doely", ["person-oscar-paul-bakke", "person-olga-josephine-doely"], "verified", [{ sourceId: "SRC-VERNA-OBITUARY" }, { sourceId: "SRC-VERNA-COMPILED-BAKKE" }], "claim-verna-arlene-bakke-090", v),
  couple("relationship-martin-bakke-spouse-olava-dukleth", ["person-martin-h-bakke", "person-olava-olausdatter-dukleth"], "verified", [{ sourceId: "SRC-VERNA-OSCAR-DEATH" }, { sourceId: "SRC-VERNA-1900-CENSUS" }], "claim-verna-arlene-bakke-091", v),
  couple("relationship-hans-bakke-spouse-ingeborg-skore", ["person-hans-hansen-bakke-1801", "person-ingeborg-skore"], "verified", [{ sourceId: "SRC-VERNA-MARTIN-DEATH" }, { sourceId: "SRC-VERNA-SETTLER-HISTORY" }], "claim-verna-arlene-bakke-092", v),
  couple("relationship-olaus-dukleth-spouse-grethe-melhus", ["person-olaus-paulsen-dukleth", "person-grethe-pauline-pedersdatter-melhus"], "probable", [{ sourceId: "SRC-VERNA-COMPILED-DUKLETH" }], "claim-verna-arlene-bakke-093", v),
  couple("relationship-nicolai-doely-spouse-serine-roble", ["person-nicolai-ingvaldsen-doely", "person-serine-roble"], "probable", [{ sourceId: "SRC-VERNA-STYREK-DEATH" }, { sourceId: "SRC-VERNA-COMPILED-DOELY" }], "claim-verna-arlene-bakke-094", v),
  couple("relationship-ingvald-doely-partner-helene-blexrud", ["person-ingvald-throndsen-doely", "person-helene-blexrud"], "probable", [{ sourceId: "SRC-VERNA-OLD-TRINITY" }, { sourceId: "SRC-VERNA-COMPILED-DOELY" }], "claim-verna-arlene-bakke-095", v, "partner"),
] as const satisfies readonly Relationship[];
