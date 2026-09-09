import type {
  Confidence,
  NonEmptyReadonlyArray,
  ParentChildRelationship,
  PersonId,
  Relationship,
  RelationshipId,
  SourceReference,
} from "@/types";

const owner = "research/people/rita-leblanc.md";
const allenOwner = "research/people/allen-comeaux.md";

function parentChild(
  id: RelationshipId,
  parentId: PersonId,
  childId: PersonId,
  confidence: Confidence,
  sourceRefs: NonEmptyReadonlyArray<SourceReference>,
  originalId: string,
  researchFile: string = owner,
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
    researchRefs: [{ file: researchFile, originalId }],
    notes: ["The parent-child link is supported, but a biological, adoptive, or legal subtype was not separately documented."],
  };
}

function couple(
  id: RelationshipId,
  personIds: readonly [PersonId, PersonId],
  confidence: Confidence,
  sourceRefs: NonEmptyReadonlyArray<SourceReference>,
  originalId: string,
  type: "spouse" | "partner" = "spouse",
  researchFile: string = owner,
): Relationship {
  return {
    id,
    type,
    personIds,
    confidence,
    researchStatus: "accepted",
    sourceRefs,
    researchRefs: [{ file: researchFile, originalId }],
  };
}

export const maternalAncestorRelationships = [
  parentChild("relationship-lucuis-leblanc-parent-rita-leblanc", "person-lucuis-leblanc", "person-rita-leblanc-1928", "verified", [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }], "claim-rita-leblanc-010"),
  parentChild("relationship-euchariste-dugas-parent-rita-leblanc", "person-euchariste-dugas", "person-rita-leblanc-1928", "verified", [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }], "claim-rita-leblanc-011"),
  parentChild("relationship-jules-comeaux-parent-allen-comeaux", "person-jules-comeaux-1888", "person-allen-comeaux-1925", "verified", [{ sourceId: "SRC-ALLEN-CENSUS-PROFILE" }], "claim-allen-comeaux-010", allenOwner),
  parentChild("relationship-joesette-r-parent-allen-comeaux", "person-joesette-r", "person-allen-comeaux-1925", "verified", [{ sourceId: "SRC-ALLEN-CENSUS-PROFILE" }], "claim-allen-comeaux-011", allenOwner),
  parentChild("relationship-moise-dugas-parent-euchariste-dugas", "person-moise-j-dugas", "person-euchariste-dugas", "probable", [{ sourceId: "SRC-EMMA-MILLER-FS" }], "claim-rita-leblanc-101"),
  parentChild("relationship-emma-miller-parent-euchariste-dugas", "person-emma-miller-1883", "person-euchariste-dugas", "probable", [{ sourceId: "SRC-EMMA-MILLER-FS" }], "claim-rita-leblanc-101"),
  parentChild("relationship-marcel-dugas-parent-moise-dugas", "person-marcel-dugas-1848", "person-moise-j-dugas", "probable", [{ sourceId: "SRC-MARCEL-DUGAS-FS" }], "claim-rita-leblanc-102"),
  parentChild("relationship-marie-plaisance-parent-moise-dugas", "person-marie-ruffin-plaisance", "person-moise-j-dugas", "probable", [{ sourceId: "SRC-MARCEL-DUGAS-FS" }], "claim-rita-leblanc-102"),
  parentChild("relationship-marcellin-dugas-parent-marcel-dugas", "person-marcellin-dugas-1804", "person-marcel-dugas-1848", "probable", [{ sourceId: "SRC-MARCEL-DUGAS-FS" }, { sourceId: "SRC-MARCELLIN-GENEALOGY" }], "claim-rita-leblanc-103"),
  parentChild("relationship-melanie-boudreaux-parent-marcel-dugas", "person-melanie-boudreaux", "person-marcel-dugas-1848", "probable", [{ sourceId: "SRC-MARCEL-DUGAS-FS" }, { sourceId: "SRC-MARCELLIN-GENEALOGY" }], "claim-rita-leblanc-103"),
  parentChild("relationship-joseph-simon-dugas-parent-marcellin-dugas", "person-joseph-simon-dugas-1769", "person-marcellin-dugas-1804", "probable", [{ sourceId: "SRC-MARCELLIN-BAPTISM-TRANSCRIPTION" }, { sourceId: "SRC-MARCELLIN-GENEALOGY" }], "claim-rita-leblanc-104"),
  parentChild("relationship-celeste-dugas-parent-marcellin-dugas", "person-celeste-dugas-1778", "person-marcellin-dugas-1804", "probable", [{ sourceId: "SRC-MARCELLIN-BAPTISM-TRANSCRIPTION" }, { sourceId: "SRC-MARCELLIN-GENEALOGY" }], "claim-rita-leblanc-104"),
  parentChild("relationship-charles-dugas-parent-joseph-simon-dugas", "person-charles-dugas-1737", "person-joseph-simon-dugas-1769", "probable", [{ sourceId: "SRC-MARCELLIN-BAPTISM-TRANSCRIPTION" }, { sourceId: "SRC-JOSEPH-SIMON-GENEALOGY" }], "claim-rita-leblanc-105"),
  parentChild("relationship-marguerite-granger-parent-joseph-simon-dugas", "person-marguerite-granger-1740", "person-joseph-simon-dugas-1769", "probable", [{ sourceId: "SRC-MARCELLIN-BAPTISM-TRANSCRIPTION" }, { sourceId: "SRC-JOSEPH-SIMON-GENEALOGY" }], "claim-rita-leblanc-105"),
  parentChild("relationship-claude-dugas-1702-parent-charles-dugas", "person-claude-dugas-1702", "person-charles-dugas-1737", "probable", [{ sourceId: "SRC-CLAUDE-1677-GENEALOGY" }, { sourceId: "SRC-ABRAHAM-GENEALOGY-A" }], "claim-rita-leblanc-106"),
  parentChild("relationship-anne-hebert-parent-charles-dugas", "person-anne-hebert", "person-charles-dugas-1737", "probable", [{ sourceId: "SRC-CLAUDE-1677-GENEALOGY" }, { sourceId: "SRC-ABRAHAM-GENEALOGY-A" }], "claim-rita-leblanc-106"),
  parentChild("relationship-claude-dugas-1677-parent-claude-dugas-1702", "person-claude-dugas-1677", "person-claude-dugas-1702", "probable", [{ sourceId: "SRC-CLAUDE-1677-GENEALOGY" }, { sourceId: "SRC-CLAUDE-1649-GENEALOGY" }], "claim-rita-leblanc-107"),
  parentChild("relationship-jeanne-bourg-parent-claude-dugas-1702", "person-jeanne-bourg", "person-claude-dugas-1702", "probable", [{ sourceId: "SRC-CLAUDE-1677-GENEALOGY" }, { sourceId: "SRC-CLAUDE-1649-GENEALOGY" }], "claim-rita-leblanc-107"),
  parentChild("relationship-claude-dugas-1649-parent-claude-dugas-1677", "person-claude-dugas-1649", "person-claude-dugas-1677", "probable", [{ sourceId: "SRC-CLAUDE-1649-GENEALOGY" }, { sourceId: "SRC-CENSUS-1698" }, { sourceId: "SRC-CENSUS-1701" }], "claim-rita-leblanc-108"),
  parentChild("relationship-francoise-bourgeois-parent-claude-dugas-1677", "person-francoise-bourgeois", "person-claude-dugas-1677", "probable", [{ sourceId: "SRC-CLAUDE-1649-GENEALOGY" }, { sourceId: "SRC-CLAUDE-1677-GENEALOGY" }], "claim-rita-leblanc-108"),
  parentChild("relationship-abraham-dugas-parent-claude-dugas-1649", "person-abraham-dugas-1616", "person-claude-dugas-1649", "probable", [{ sourceId: "SRC-CLAUDE-1649-GENEALOGY" }, { sourceId: "SRC-ABRAHAM-GENEALOGY-A" }, { sourceId: "SRC-ABRAHAM-GENEALOGY-B" }], "claim-rita-leblanc-109"),
  parentChild("relationship-marguerite-doucet-parent-claude-dugas-1649", "person-marguerite-doucet", "person-claude-dugas-1649", "probable", [{ sourceId: "SRC-CLAUDE-1649-GENEALOGY" }, { sourceId: "SRC-ABRAHAM-GENEALOGY-A" }], "claim-rita-leblanc-109"),
  parentChild("relationship-jean-dugas-parent-celeste-dugas", "person-jean-dugas", "person-celeste-dugas-1778", "probable", [{ sourceId: "SRC-MARCELLIN-BAPTISM-TRANSCRIPTION" }, { sourceId: "SRC-CELESTE-PARENTS" }], "claim-rita-leblanc-110"),
  parentChild("relationship-marguerite-dupuis-parent-celeste-dugas", "person-marguerite-dupuis", "person-celeste-dugas-1778", "probable", [{ sourceId: "SRC-MARCELLIN-BAPTISM-TRANSCRIPTION" }, { sourceId: "SRC-CELESTE-PARENTS" }], "claim-rita-leblanc-110"),
  parentChild("relationship-adolphe-miller-parent-emma-miller", "person-adolphe-miller-1849", "person-emma-miller-1883", "probable", [{ sourceId: "SRC-MILLER-ANCESTRY" }, { sourceId: "SRC-ST-CHARLES-INDEXED" }], "claim-rita-leblanc-111"),
  parentChild("relationship-marie-emma-boudreaux-parent-emma-miller", "person-marie-emma-boudreaux-1852", "person-emma-miller-1883", "probable", [{ sourceId: "SRC-MILLER-ANCESTRY" }, { sourceId: "SRC-ST-CHARLES-INDEXED" }, { sourceId: "SRC-EMMA-MILLER-FS" }], "claim-rita-leblanc-111"),
  parentChild("relationship-george-miller-parent-adolphe-miller", "person-george-charles-miller", "person-adolphe-miller-1849", "probable", [{ sourceId: "SRC-MILLER-ANCESTRY" }, { sourceId: "SRC-ST-CHARLES-INDEXED" }], "claim-rita-leblanc-112"),
  parentChild("relationship-pauline-savoie-parent-adolphe-miller", "person-pauline-savoie", "person-adolphe-miller-1849", "probable", [{ sourceId: "SRC-MILLER-ANCESTRY" }, { sourceId: "SRC-ST-CHARLES-INDEXED" }], "claim-rita-leblanc-112"),

  couple("relationship-jules-comeaux-partner-joesette-r", ["person-jules-comeaux-1888", "person-joesette-r"], "verified", [{ sourceId: "SRC-ALLEN-CENSUS-PROFILE" }], "claim-allen-comeaux-091", "partner", allenOwner),
  couple("relationship-moise-dugas-spouse-emma-miller", ["person-moise-j-dugas", "person-emma-miller-1883"], "probable", [{ sourceId: "SRC-EMMA-MILLER-FS" }], "claim-rita-leblanc-101"),
  couple("relationship-marcel-dugas-spouse-marie-plaisance", ["person-marcel-dugas-1848", "person-marie-ruffin-plaisance"], "probable", [{ sourceId: "SRC-MARCEL-DUGAS-FS" }], "claim-rita-leblanc-102"),
  couple("relationship-marcellin-dugas-spouse-melanie-boudreaux", ["person-marcellin-dugas-1804", "person-melanie-boudreaux"], "probable", [{ sourceId: "SRC-MARCEL-DUGAS-FS" }, { sourceId: "SRC-MARCELLIN-GENEALOGY" }], "claim-rita-leblanc-103"),
  couple("relationship-joseph-simon-dugas-spouse-celeste-dugas", ["person-joseph-simon-dugas-1769", "person-celeste-dugas-1778"], "probable", [{ sourceId: "SRC-JOSEPH-CELESTE-MARRIAGE" }], "claim-rita-leblanc-104"),
  couple("relationship-charles-dugas-spouse-marguerite-granger", ["person-charles-dugas-1737", "person-marguerite-granger-1740"], "probable", [{ sourceId: "SRC-JOSEPH-SIMON-GENEALOGY" }], "claim-rita-leblanc-105"),
  couple("relationship-claude-dugas-1702-spouse-anne-hebert", ["person-claude-dugas-1702", "person-anne-hebert"], "probable", [{ sourceId: "SRC-CLAUDE-1677-GENEALOGY" }], "claim-rita-leblanc-106"),
  couple("relationship-claude-dugas-1677-spouse-jeanne-bourg", ["person-claude-dugas-1677", "person-jeanne-bourg"], "probable", [{ sourceId: "SRC-CLAUDE-1677-GENEALOGY" }], "claim-rita-leblanc-107"),
  couple("relationship-claude-dugas-1649-spouse-francoise-bourgeois", ["person-claude-dugas-1649", "person-francoise-bourgeois"], "probable", [{ sourceId: "SRC-CLAUDE-1649-GENEALOGY" }], "claim-rita-leblanc-108"),
  couple("relationship-abraham-dugas-spouse-marguerite-doucet", ["person-abraham-dugas-1616", "person-marguerite-doucet"], "probable", [{ sourceId: "SRC-ABRAHAM-GENEALOGY-A" }, { sourceId: "SRC-ABRAHAM-GENEALOGY-B" }], "claim-rita-leblanc-109"),
  couple("relationship-jean-dugas-spouse-marguerite-dupuis", ["person-jean-dugas", "person-marguerite-dupuis"], "probable", [{ sourceId: "SRC-CELESTE-PARENTS" }], "claim-rita-leblanc-110"),
  couple("relationship-adolphe-miller-spouse-marie-emma-boudreaux", ["person-adolphe-miller-1849", "person-marie-emma-boudreaux-1852"], "probable", [{ sourceId: "SRC-MILLER-ANCESTRY" }, { sourceId: "SRC-ST-CHARLES-INDEXED" }], "claim-rita-leblanc-111"),
  couple("relationship-george-miller-spouse-pauline-savoie", ["person-george-charles-miller", "person-pauline-savoie"], "probable", [{ sourceId: "SRC-MILLER-ANCESTRY" }, { sourceId: "SRC-ST-CHARLES-INDEXED" }], "claim-rita-leblanc-112"),
] as const satisfies readonly Relationship[];
