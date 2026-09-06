import type { Relationship } from "@/types";

export const foundationRelationships = [
  {
    id: "relationship-aubin-buquet-parent-michael-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-aubin-buquet",
    childId: "person-michael-buquet",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
    ],
    researchRefs: [
      { file: "research/people/00-immediate-family.md", originalId: "claim-aubin-buquet-002" },
      { file: "research/people/00-immediate-family.md", originalId: "claim-michael-buquet-002" },
    ],
    notes: [
      "Family-provided; no direct birth record was reviewed.",
      "The parent-child role is supported, but a biological/adoptive/legal subtype was not separately documented.",
    ],
  },
  {
    id: "relationship-paulette-comeaux-parent-michael-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-paulette-comeaux",
    childId: "person-michael-buquet",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      {
        sourceId: "SRC-RITA-OBIT-ADVERTISER",
        note: "Corroborates the descendant group but not this exact link.",
      },
    ],
    researchRefs: [
      { file: "research/people/00-immediate-family.md", originalId: "claim-paulette-comeaux-002" },
      { file: "research/people/00-immediate-family.md", originalId: "claim-michael-buquet-003" },
    ],
    notes: [
      "Family-provided; no direct birth record was reviewed.",
      "The parent-child role is supported, but a biological/adoptive/legal subtype was not separately documented.",
    ],
  },
  {
    id: "relationship-edmond-buquet-parent-aubin-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-edmond-p-buquet-1919",
    childId: "person-aubin-buquet",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-EDMOND-EVE-OBITUARY" },
    ],
    researchRefs: [
      { file: "research/people/edmond-p-buquet.md", originalId: "claim-edmond-p-buquet-013" },
    ],
    notes: [
      "Michael supplies the parent chain; obituary evidence places Aubin in the family, but no direct parentage record was reviewed.",
      "The parent-child role is supported, but a biological/adoptive/legal subtype was not separately documented.",
    ],
  },
  {
    id: "relationship-verna-bakke-parent-aubin-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-verna-arlene-bakke",
    childId: "person-aubin-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
    ],
    researchRefs: [
      {
        file: "research/people/verna-arlene-bakke-buquet.md",
        originalId: "claim-verna-arlene-bakke-017",
      },
    ],
    notes: [
      "Verna's obituary directly lists Aubin as her child.",
      "The source does not separately document a biological/adoptive/legal subtype.",
    ],
  },
  {
    id: "relationship-rita-leblanc-parent-paulette-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-rita-leblanc-1928",
    childId: "person-paulette-comeaux",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
    researchRefs: [
      { file: "research/people/rita-leblanc.md", originalId: "claim-rita-leblanc-019" },
    ],
    notes: [
      "Rita's obituary explicitly names Paulette among her daughters.",
      "The source does not separately document a biological/adoptive/legal subtype.",
    ],
  },
  {
    id: "relationship-allen-comeaux-parent-paulette-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-comeaux-1925",
    childId: "person-paulette-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      {
        sourceId: "SRC-RITA-OBIT-ADVERTISER",
        note: "Verifies Rita's maternity, not Allen's paternity.",
      },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
    ],
    researchRefs: [
      { file: "research/people/allen-comeaux.md", originalId: "claim-allen-comeaux-019" },
    ],
    notes: [
      "Family-provided and convergent; no direct Allen parentage record was reviewed.",
      "The parent-child role is supported, but a biological/adoptive/legal subtype was not separately documented.",
    ],
  },
  {
    id: "relationship-edmond-buquet-spouse-verna-bakke",
    type: "spouse",
    personIds: ["person-edmond-p-buquet-1919", "person-verna-arlene-bakke"],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-EDMOND-EVE-OBITUARY" },
    ],
    researchRefs: [
      { file: "research/people/edmond-p-buquet.md", originalId: "claim-edmond-p-buquet-012" },
      {
        file: "research/people/verna-arlene-bakke-buquet.md",
        originalId: "claim-verna-arlene-bakke-014",
      },
    ],
    notes: ["Relationship is secure; marriage date and place remain unknown."],
  },
  {
    id: "relationship-allen-comeaux-spouse-rita-leblanc",
    type: "spouse",
    personIds: ["person-allen-comeaux-1925", "person-rita-leblanc-1928"],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
      {
        sourceId: "SRC-RITA-OBIT-ADVERTISER",
        note: "Provides convergent surname and descendant evidence but does not expressly name Allen as spouse.",
      },
    ],
    researchRefs: [
      { file: "research/people/rita-leblanc.md", originalId: "claim-rita-leblanc-014" },
      { file: "research/people/allen-comeaux.md", originalId: "claim-allen-comeaux-014" },
    ],
    notes: ["No original civil or Catholic marriage record was located."],
  },
] as const satisfies readonly Relationship[];
