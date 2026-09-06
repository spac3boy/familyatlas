import type { Person } from "@/types";

export const foundationPeople = [
  {
    id: "person-michael-buquet",
    canonicalName: "Michael Buquet",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-RITA-OBIT-ADVERTISER", note: "Names Michael among Rita's grandchildren." },
    ],
    researchRefs: [{ file: "research/people/00-immediate-family.md" }],
    notes: ["Reference person for the Family Atlas archive."],
  },
  {
    id: "person-aubin-buquet",
    canonicalName: "Aubin Buquet",
    alternateNames: [],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
      { sourceId: "SRC-VERNA-OBITUARY", note: "Names Aubin among Verna's children." },
    ],
    researchRefs: [{ file: "research/people/00-immediate-family.md" }],
    notes: [
      "Michael's father; distinct from the older ancestor Aubin Vincent Buquet (1887–1953).",
      "No middle name or initial is supported.",
    ],
  },
  {
    id: "person-paulette-comeaux",
    canonicalName: "Paulette Comeaux",
    alternateNames: [
      {
        name: "Paulette Comeaux Buquet",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-A1-PAULETTE-LAFAYETTE" }],
        note: "Recorded form only; relationship and surname chronology are not inferred.",
      },
      {
        name: "Paulette Wheeler",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-A1-GINA-MERCYHURST-BIO" }],
        note: "Recorded form only; the cause and timing of the surname are unknown.",
      },
      {
        name: "Paulette Comeaux Wheeler",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
        note: "Obituary form; it does not establish a complete marital history.",
      },
    ],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
    ],
    researchRefs: [{ file: "research/people/00-immediate-family.md" }],
    notes: [
      "Comeaux is the family-supplied birth surname.",
      "Later recorded surnames do not establish marriage dates or a relationship chronology.",
    ],
  },
  {
    id: "person-edmond-p-buquet-1919",
    canonicalName: "Edmond P. Buquet",
    alternateNames: [
      {
        name: "Edmond Buquet",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
          { sourceId: "SRC-EDMOND-DEATH-DIRECTORY" },
        ],
      },
      {
        name: "Edmond “Bud” Buquet",
        type: "nickname",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
      },
      {
        name: "Edmund Buquet",
        type: "spelling",
        confidence: "unresolved",
        sourceRefs: [{ sourceId: "SRC-FAMILY-EXPLAIN-CHAT" }],
        note: "One family-message spelling; Edmond is supported by the other evidence.",
      },
    ],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-EDMOND-DEATH-DIRECTORY" },
      { sourceId: "SRC-EDMOND-EVE-OBITUARY" },
      { sourceId: "SRC-VERNA-OBITUARY" },
    ],
    researchRefs: [
      { file: "research/people/edmond-p-buquet.md", originalId: "claim-edmond-p-buquet-100" },
    ],
    notes: ["The accessible evidence does not expand the middle initial P."],
  },
  {
    id: "person-verna-arlene-bakke",
    canonicalName: "Verna Arlene Bakke Buquet",
    alternateNames: [
      {
        name: "Verna Arlene Bakke",
        type: "maiden",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-VERNA-OBITUARY" },
          { sourceId: "SRC-VERNA-VETERANS-BURIAL" },
        ],
      },
      {
        name: "Verna Buquet",
        type: "married",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
          { sourceId: "SRC-VERNA-OBITUARY" },
        ],
      },
      {
        name: "Verna B. Buquet",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-VERNA-OBITUARY" }],
      },
    ],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-VERNA-VETERANS-BURIAL" },
    ],
    researchRefs: [{ file: "research/people/verna-arlene-bakke-buquet.md" }],
    notes: ["Bakke is independently supported as her maiden surname."],
  },
  {
    id: "person-rita-leblanc-1928",
    canonicalName: "Rita LeBlanc",
    alternateNames: [
      {
        name: "Rita Leblanc",
        type: "spelling",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-RITA-FUNERAL-NOTICE" },
        ],
      },
      {
        name: "Rita Leblanc Comeaux",
        type: "married",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-RITA-FUNERAL-NOTICE" },
        ],
      },
      {
        name: "Rita Comeaux",
        type: "married",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-RITA-FUNERAL-NOTICE" },
        ],
      },
      {
        name: "Rita M. LeBlanc",
        type: "source-form",
        confidence: "unresolved",
        sourceRefs: [{ sourceId: "SRC-ALLEN-RITA-TREE" }],
        note: "Compiled-tree form only; the initial is unexplained.",
      },
    ],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-RITA-FUNERAL-NOTICE" },
    ],
    researchRefs: [{ file: "research/people/rita-leblanc.md" }],
    notes: ["No middle name is established; the canonical name omits the unresolved M."],
  },
  {
    id: "person-allen-comeaux-1925",
    canonicalName: "Allen Paul Comeaux Sr.",
    alternateNames: [
      {
        name: "Allen Comeaux",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-A1-FAMILY-CURRENT" },
          { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
        ],
        note: "Family-provided name form.",
      },
      {
        name: "Allen Paul Comeaux",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-ALLEN-DEATH-INDEX-DIRECTORY" },
          { sourceId: "SRC-ALLEN-DEATH-INDEX-DAY" },
        ],
        note: "Verified as a recorded derivative/index form, not from an original birth record.",
      },
    ],
    confidence: "probable",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-A1-FAMILY-CURRENT" },
      { sourceId: "SRC-FAMILY-EXPLAIN-CHAT" },
      { sourceId: "SRC-ALLEN-DEATH-INDEX-DIRECTORY" },
      { sourceId: "SRC-ALLEN-DEATH-INDEX-DAY" },
      { sourceId: "SRC-ALLEN-RITA-TREE" },
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-ALLEN-CENSUS-PROFILE" },
    ],
    researchRefs: [
      { file: "research/people/allen-comeaux.md", originalId: "claim-allen-comeaux-090" },
    ],
    notes: [
      "Paul and Sr. are probable identity details because no original birth, baptism, or marriage record was reviewed.",
      "Do not merge with Allen Bernard Comeaux (1921–2022) or Allen Joseph Comeaux (1935–2020).",
    ],
  },
] as const satisfies readonly Person[];
