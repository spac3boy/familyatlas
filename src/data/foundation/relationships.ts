import type { Relationship, RelationshipId } from "@/types";

const C24_CLOSE_FAMILY_SOURCE_ID = "SRC-C24-MICHAEL-CLOSE-FAMILY-CONFIRMATION" as const;

const c24ConfirmedRelationshipIds = new Set<RelationshipId>([
  "relationship-verna-bakke-parent-michael-buquet-edmond-child",
  "relationship-edmond-buquet-parent-michael-buquet-edmond-child",
  "relationship-verna-bakke-parent-cathy-buquet",
  "relationship-edmond-buquet-parent-cathy-buquet",
  "relationship-rita-leblanc-parent-russell-j-comeaux",
  "relationship-allen-comeaux-parent-russell-j-comeaux",
  "relationship-rita-leblanc-parent-allen-paul-comeaux-jr",
  "relationship-allen-comeaux-parent-allen-paul-comeaux-jr",
  "relationship-rita-leblanc-parent-peggy-comeaux",
  "relationship-allen-comeaux-parent-peggy-comeaux",
  "relationship-rita-leblanc-parent-priscilla-comeaux",
  "relationship-allen-comeaux-parent-priscilla-comeaux",
  "relationship-cathy-buquet-parent-paige-bartholomew",
  "relationship-cathy-buquet-parent-sean-mcrae",
  "relationship-peggy-comeaux-parent-conrad-miller",
  "relationship-russell-comeaux-parent-rustie-lynn-comeaux",
  "relationship-russell-comeaux-parent-rhyan-comeaux",
  "relationship-priscilla-comeaux-parent-dexter-babineaux",
  "relationship-allen-paul-comeaux-jr-parent-gerard-comeaux",
  "relationship-allen-paul-comeaux-jr-parent-casey-comeaux",
  "relationship-allen-paul-comeaux-jr-parent-brandi-comeaux",
]);

const foundationRelationshipClaims = [
  {
    id: "relationship-aubin-buquet-parent-michael-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-aubin-buquet",
    childId: "person-michael-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-A1-FAMILY-CURRENT" }],
        note: "Michael directly identifies Aubin as his father.",
      },
    ],
    researchRefs: [
      { file: "research/people/00-immediate-family.md", originalId: "claim-aubin-buquet-002" },
      { file: "research/people/00-immediate-family.md", originalId: "claim-michael-buquet-002" },
    ],
    notes: [
      "Michael's firsthand family confirmation establishes the parent-child role; no direct birth record was reviewed.",
      "The parent-child role is supported, but a biological/adoptive/legal subtype was not separately documented.",
    ],
  },
  {
    id: "relationship-paulette-comeaux-parent-michael-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-paulette-comeaux",
    childId: "person-michael-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      {
        sourceId: "SRC-RITA-OBIT-ADVERTISER",
        note: "Corroborates the descendant group but not this exact link.",
      },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-A1-FAMILY-CURRENT" }],
        note: "Michael directly identifies Paulette as his mother.",
      },
    ],
    researchRefs: [
      { file: "research/people/00-immediate-family.md", originalId: "claim-paulette-comeaux-002" },
      { file: "research/people/00-immediate-family.md", originalId: "claim-michael-buquet-003" },
    ],
    notes: [
      "Michael's firsthand family confirmation establishes the parent-child role; no direct birth record was reviewed.",
      "The parent-child role is supported, but a biological/adoptive/legal subtype was not separately documented.",
    ],
  },
  {
    id: "relationship-edmond-buquet-parent-aubin-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-edmond-p-buquet-1919",
    childId: "person-aubin-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-EDMOND-EVE-OBITUARY" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-A1-FAMILY-CURRENT" }],
        note: "Michael directly identifies Edmond as his paternal grandfather and Aubin as his father.",
      },
    ],
    researchRefs: [
      { file: "research/people/edmond-p-buquet.md", originalId: "claim-edmond-p-buquet-013" },
    ],
    notes: [
      "Michael's firsthand family confirmation establishes the parent chain; obituary evidence places Aubin in the family, but no direct parentage record was reviewed.",
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
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-A1-FAMILY-CURRENT" }],
        note: "Michael directly identifies Verna as his paternal grandmother and Aubin as his father.",
      },
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
        note: "Verna's obituary directly lists Aubin as her child.",
      },
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
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-A1-FAMILY-CURRENT" }],
        note: "Michael directly identifies Rita as his maternal grandmother and Paulette as his mother.",
      },
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
        note: "Rita's obituary directly names Paulette among her daughters.",
      },
    ],
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
    confidence: "verified",
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
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-A1-FAMILY-CURRENT" }],
        note: "Michael directly identifies Allen as his maternal grandfather and Paulette as his mother.",
      },
    ],
    researchRefs: [
      { file: "research/people/allen-comeaux.md", originalId: "claim-allen-comeaux-019" },
    ],
    notes: [
      "Michael's firsthand family confirmation establishes the parent chain; no direct Allen parentage record was reviewed.",
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
    id: "relationship-verna-bakke-parent-michael-buquet-edmond-child",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-verna-arlene-bakke",
    childId: "person-michael-buquet-edmond-child",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
        note: "Verna's obituary directly lists Michael among her children.",
      },
    ],
    researchRefs: [{ file: "research/branches/paternal-ancestors.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-edmond-buquet-parent-michael-buquet-edmond-child",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-edmond-p-buquet-1919",
    childId: "person-michael-buquet-edmond-child",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-EDMOND-EVE-OBITUARY" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-VERNA-OBITUARY" },
          { sourceId: "SRC-EDMOND-EVE-OBITUARY" },
        ],
        note: "The obituary family group supports Edmond's paternity indirectly; no direct parentage record was inspected.",
      },
    ],
    researchRefs: [{ file: "research/branches/paternal-ancestors.md" }],
    notes: [
      "Documentary evidence for Edmond's parent role remains indirect; Michael's later family confirmation establishes the relationship role.",
    ],
  },
  {
    id: "relationship-verna-bakke-parent-cathy-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-verna-arlene-bakke",
    childId: "person-cathy-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
        note: "Verna's obituary directly lists Cathy B. McRae among her children.",
      },
    ],
    researchRefs: [{ file: "research/branches/paternal-ancestors.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-edmond-buquet-parent-cathy-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-edmond-p-buquet-1919",
    childId: "person-cathy-buquet",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
        note: "The obituary family group supports Edmond's paternity indirectly; no direct parentage record was inspected.",
      },
    ],
    researchRefs: [{ file: "research/branches/paternal-ancestors.md" }],
    notes: [
      "Documentary evidence for Edmond's parent role remains indirect; Michael's later family confirmation establishes the relationship role.",
    ],
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
  {
    id: "relationship-rita-leblanc-parent-russell-j-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-rita-leblanc-1928",
    childId: "person-russell-j-comeaux",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-PHILOMENE-OBIT" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-PHILOMENE-OBIT" },
        ],
        note: "Rita's obituary directly lists Russell as her son; Philomene's obituary independently preserves the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-allen-comeaux-parent-russell-j-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-comeaux-1925",
    childId: "person-russell-j-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-ALLEN-RITA-TREE" },
        ],
        note: "The Allen-Rita couple evidence and Rita's child list support paternity indirectly; no direct parentage record was inspected.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["Documentary evidence for Allen's parent role remains indirect; Michael's later family confirmation establishes the relationship role."],
  },
  {
    id: "relationship-rita-leblanc-parent-allen-paul-comeaux-jr",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-rita-leblanc-1928",
    childId: "person-allen-paul-comeaux-jr",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-PHILOMENE-OBIT" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-PHILOMENE-OBIT" },
        ],
        note: "Rita's obituary directly lists Allen Jr. as her son; Philomene's obituary independently preserves the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-allen-comeaux-parent-allen-paul-comeaux-jr",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-comeaux-1925",
    childId: "person-allen-paul-comeaux-jr",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-ALLEN-RITA-TREE" },
        ],
        note: "The Allen-Rita couple evidence and Rita's child list support paternity indirectly; no direct parentage record was inspected.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["Documentary evidence for Allen's parent role remains indirect; Michael's later family confirmation establishes the relationship role."],
  },
  {
    id: "relationship-rita-leblanc-parent-peggy-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-rita-leblanc-1928",
    childId: "person-peggy-comeaux",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-PHILOMENE-OBIT" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-PHILOMENE-OBIT" },
        ],
        note: "Rita's obituary directly lists Peggy as her daughter; Philomene's obituary independently preserves the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-allen-comeaux-parent-peggy-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-comeaux-1925",
    childId: "person-peggy-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-ALLEN-RITA-TREE" },
        ],
        note: "The Allen-Rita couple evidence and Rita's child list support paternity indirectly; no direct parentage record was inspected.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["Documentary evidence for Allen's parent role remains indirect; Michael's later family confirmation establishes the relationship role."],
  },
  {
    id: "relationship-rita-leblanc-parent-priscilla-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-rita-leblanc-1928",
    childId: "person-priscilla-comeaux",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-PHILOMENE-OBIT" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-PHILOMENE-OBIT" },
        ],
        note: "Rita's obituary directly lists Priscilla as her daughter; Philomene's obituary independently preserves the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-allen-comeaux-parent-priscilla-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-comeaux-1925",
    childId: "person-priscilla-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-ALLEN-RITA-TREE" },
        ],
        note: "The Allen-Rita couple evidence and Rita's child list support paternity indirectly; no direct parentage record was inspected.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["Documentary evidence for Allen's parent role remains indirect; Michael's later family confirmation establishes the relationship role."],
  },
  {
    id: "relationship-allen-paul-comeaux-jr-spouse-monica",
    type: "spouse",
    personIds: ["person-allen-paul-comeaux-jr", "person-monica"],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-PHILOMENE-OBIT" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-PHILOMENE-OBIT" }],
        note: "Philomene's 2015 obituary reports Monica as Allen Jr.'s wife.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["No marriage event, surname, or chronology is established."],
  },
  {
    id: "relationship-peggy-comeaux-spouse-clarence-miller",
    type: "spouse",
    personIds: ["person-peggy-comeaux", "person-clarence-miller"],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-PHILOMENE-OBIT" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-PHILOMENE-OBIT" },
        ],
        note: "Both obituaries report Clarence as Peggy's husband.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: ["No marriage event or chronology is established."],
  },
  {
    id: "relationship-priscilla-comeaux-spouse-karlon",
    type: "spouse",
    personIds: ["person-priscilla-comeaux", "person-karlon"],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-PHILOMENE-OBIT" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-PHILOMENE-OBIT" }],
        note: "Philomene's 2015 obituary reports Karlon as Priscilla LeBlanc's husband.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: [
      "No marriage event or chronology is established.",
      "Karlon is not assumed to be the same person as Tippy LeBlanc.",
    ],
  },
  {
    id: "relationship-priscilla-comeaux-spouse-tippy-leblanc",
    type: "spouse",
    personIds: ["person-priscilla-comeaux", "person-tippy-leblanc"],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
        note: "Rita's 2017 obituary reports Tippy LeBlanc as Priscilla C. Babineaux's husband.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: [
      "No marriage event or chronology is established.",
      "Tippy is not assumed to be the same person as Karlon.",
      "No parentage for Dexter Babineaux is inferred from this relationship.",
    ],
  },
  {
    id: "relationship-cathy-buquet-parent-paige-bartholomew",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-cathy-buquet",
    childId: "person-paige-bartholomew",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-VERNA-OBITUARY", note: "Establishes Paige as Verna's grandchild but does not map her parent." },
      { sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026", note: "Directly identifies Richard as Paige's parent, not Cathy." },
      { sourceId: "SRC-MCRAE-PUBLIC-RECORD-ASSOCIATIONS" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-VERNA-OBITUARY" },
          { sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" },
          { sourceId: "SRC-MCRAE-PUBLIC-RECORD-ASSOCIATIONS" },
        ],
        note: "Multiple documentary associations support the working parent placement, but no preserved source directly names Cathy as Paige's mother.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["The documentary parent placement is indirect; Michael's later family confirmation establishes Cathy's parent role."],
  },
  {
    id: "relationship-richard-mcrae-parent-paige-bartholomew",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-richard-russell-mcrae",
    childId: "person-paige-bartholomew",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
        note: "Richard's 2026 memorial directly identifies Paige as his child.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-cathy-buquet-parent-sean-mcrae",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-cathy-buquet",
    childId: "person-sean-mcrae",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-VERNA-OBITUARY", note: "Establishes Sean as Verna's grandchild but does not map his parent." },
      { sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026", note: "Directly identifies Richard as Sean's parent, not Cathy." },
      { sourceId: "SRC-MCRAE-PUBLIC-RECORD-ASSOCIATIONS" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-VERNA-OBITUARY" },
          { sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" },
          { sourceId: "SRC-MCRAE-PUBLIC-RECORD-ASSOCIATIONS" },
        ],
        note: "Multiple documentary associations support the working parent placement, but no preserved source directly names Cathy as Sean's mother.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["The documentary parent placement is indirect; Michael's later family confirmation establishes Cathy's parent role."],
  },
  {
    id: "relationship-richard-mcrae-parent-sean-mcrae",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-richard-russell-mcrae",
    childId: "person-sean-mcrae",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
        note: "Richard's 2026 memorial directly identifies Sean “Rusty” McRae as his child.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["The source does not separately document a biological/adoptive/legal subtype."],
  },
  {
    id: "relationship-peggy-comeaux-parent-conrad-miller",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-peggy-comeaux",
    childId: "person-conrad-miller",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Conrad as Rita's grandchild without mapping his parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure, surname evidence, and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["Michael later confirmed Peggy's parent role; Clarence Miller's parentage is not inferred."],
  },
  {
    id: "relationship-russell-comeaux-parent-rustie-lynn-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-russell-j-comeaux",
    childId: "person-rustie-lynn-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Rustie Lynn as Rita's grandchild without mapping her parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["Michael later confirmed Russell's parent role; the earlier documentary reconstruction remains attached."],
  },
  {
    id: "relationship-russell-comeaux-parent-rhyan-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-russell-j-comeaux",
    childId: "person-rhyan-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Rhyan as Rita's grandchild without mapping the parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["Michael later confirmed Russell's parent role; Ryan/Ryan Earl identity forms remain unresolved."],
  },
  {
    id: "relationship-priscilla-comeaux-parent-dexter-babineaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-priscilla-comeaux",
    childId: "person-dexter-babineaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Dexter as Rita's grandchild without mapping his parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure, surname evidence, and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: [
      "Michael later confirmed Priscilla's parent role; neither Karlon nor Tippy LeBlanc is inferred as Dexter's father.",
    ],
  },
  {
    id: "relationship-allen-paul-comeaux-jr-parent-gerard-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-paul-comeaux-jr",
    childId: "person-gerard-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Gerard as Rita's grandchild without mapping his parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["Michael later confirmed Allen Jr.'s parent role; Monica's parentage is not inferred."],
  },
  {
    id: "relationship-allen-paul-comeaux-jr-parent-casey-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-paul-comeaux-jr",
    childId: "person-casey-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Casey as Rita's grandchild without mapping the parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["Michael later confirmed Allen Jr.'s parent role; Monica's parentage is not inferred."],
  },
  {
    id: "relationship-allen-paul-comeaux-jr-parent-brandi-comeaux",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-allen-paul-comeaux-jr",
    childId: "person-brandi-comeaux",
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Identifies Brandi as Rita's grandchild without mapping the parent." },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "The parent assignment is reconstructed from obituary structure and later corroborating family records.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: ["Michael later confirmed Allen Jr.'s parent role; Monica's parentage is not inferred."],
  },
  {
    id: "relationship-paulette-comeaux-parent-sidney-paul-roger",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-paulette-comeaux",
    childId: "person-sidney-paul-roger",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael identifies Sidney as his brother through their shared mother, Paulette.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: [
      "Michael identifies Sidney as his maternal half brother and states that they have different fathers.",
      "Only the confirmed shared-parent edge is normalized; Sidney's father is not named, and the parentage subtype is not specified.",
    ],
  },
  {
    id: "relationship-aubin-buquet-parent-edmond-paul-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-aubin-buquet",
    childId: "person-edmond-paul-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael identifies Edmond as his brother through their shared father, Aubin.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-paulette-comeaux-parent-edmond-paul-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-paulette-comeaux",
    childId: "person-edmond-paul-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael identifies Edmond as his brother through their shared mother, Paulette.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-aubin-buquet-parent-gina-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-aubin-buquet",
    childId: "person-gina-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-C20B-MICHAEL-SIBLINGS" },
      { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
      { sourceId: "SRC-A1-GINA-MERCYHURST-BIO" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael identifies Gina as his sister through their shared father, Aubin.",
      },
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
          { sourceId: "SRC-A1-GINA-MERCYHURST-BIO" },
        ],
        note: "Both institutional biographies name Aubin as Gina's parent.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-paulette-comeaux-parent-gina-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-paulette-comeaux",
    childId: "person-gina-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-C20B-MICHAEL-SIBLINGS" },
      { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
      { sourceId: "SRC-A1-GINA-MERCYHURST-BIO" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael identifies Gina as his sister through their shared mother, Paulette.",
      },
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
          { sourceId: "SRC-A1-GINA-MERCYHURST-BIO" },
        ],
        note: "The institutional biographies name Paulette Comeaux or Paulette Wheeler as Gina's parent.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-michael-buquet-spouse-karla-contreras-buquet",
    type: "spouse",
    personIds: ["person-michael-buquet", "person-karla-vannessa-contreras-buquet"],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
        note: "Michael directly identifies Karla as his wife.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/spouse-children.md" }],
    notes: ["No marriage date or place is normalized from this statement."],
  },
  {
    id: "relationship-michael-buquet-parent-chloe-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-michael-buquet",
    childId: "person-chloe-eloise-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
        note: "Michael directly identifies Chloé as his daughter.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/spouse-children.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-karla-contreras-buquet-parent-chloe-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-karla-vannessa-contreras-buquet",
    childId: "person-chloe-eloise-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
        note: "Michael identifies Chloé as his and Karla's daughter.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/spouse-children.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-michael-buquet-parent-jolie-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-michael-buquet",
    childId: "person-jolie-renee-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
        note: "Michael directly identifies Jolie as his daughter.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/spouse-children.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
  {
    id: "relationship-karla-contreras-buquet-parent-jolie-buquet",
    type: "parent-child",
    parentage: "unknown",
    parentId: "person-karla-vannessa-contreras-buquet",
    childId: "person-jolie-renee-buquet",
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
        note: "Michael identifies Jolie as his and Karla's daughter.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/spouse-children.md" }],
    notes: ["The parent-child role is confirmed; its biological/adoptive/legal subtype is not specified."],
  },
] as const satisfies readonly Relationship[];

export const foundationRelationships: readonly Relationship[] = foundationRelationshipClaims.map(
  (relationship) => {
    if (!c24ConfirmedRelationshipIds.has(relationship.id)) return relationship;
    const claim: Relationship = relationship;

    return {
      ...claim,
      confidence: "verified",
      sourceRefs: [...claim.sourceRefs, { sourceId: C24_CLOSE_FAMILY_SOURCE_ID }],
      provenance: [
        {
          kind: "family-confirmed",
          sourceRefs: [{ sourceId: C24_CLOSE_FAMILY_SOURCE_ID }],
          note: "Michael's C24 instruction confirms this previously supplied close-family relationship from firsthand family knowledge.",
        },
        ...(claim.provenance ?? []),
      ],
      researchRefs: [
        ...(claim.researchRefs ?? []),
        { file: "research/family-intake/close-family-confirmations.md" },
      ],
    };
  },
);
