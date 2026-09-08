import type { Person } from "@/types";

export const foundationPeople = [
  {
    id: "person-michael-buquet",
    canonicalName: "Michael Buquet",
    alternateNames: [],
    distinctFromPersonIds: ["person-michael-buquet-edmond-child"],
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
  {
    id: "person-sidney-paul-roger",
    canonicalName: "Sidney Paul Roger",
    alternateNames: [
      {
        name: "Sid Roger",
        type: "nickname",
        confidence: "verified",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-VERNA-OBITUARY" },
        ],
        provenance: [
          {
            kind: "documented",
            sourceRefs: [
              { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
              { sourceId: "SRC-VERNA-OBITUARY" },
            ],
          },
        ],
        note: "C20D resolves the obituary-recorded Sid Roger as Michael's already normalized brother Sidney Paul Roger.",
      },
    ],
    idAliases: ["person-sid-roger"],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-C20B-MICHAEL-SIBLINGS" },
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-VERNA-OBITUARY" },
    ],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael directly identifies Sidney as his brother.",
      },
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-VERNA-OBITUARY" },
        ],
        note: "Both grandparent obituaries independently name Sid Roger among their grandchildren.",
      },
    ],
    researchRefs: [
      { file: "research/family-intake/siblings-needed.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: [
      "Michael identifies Sidney as his maternal half brother: they share Paulette and have different fathers.",
      "Sidney's father is not named or normalized; parentage subtype remains unknown.",
      "Living person; sensitive biographical details are intentionally omitted.",
    ],
  },
  {
    id: "person-michael-buquet-edmond-child",
    canonicalName: "Michael Buquet",
    alternateNames: [],
    distinctFromPersonIds: ["person-michael-buquet"],
    confidence: "verified",
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
        note: "Verna's obituary names her son Michael, and Eve's obituary names nephew Michael in the same family group.",
      },
    ],
    researchRefs: [{ file: "research/branches/paternal-ancestors.md" }],
    notes: [
      "Distinct from the Family Atlas reference person Michael Buquet, whom Verna's obituary separately names as a grandson.",
      "Living status and personal biographical details are not established in the normalized record.",
      "No spouse or child structure is established.",
    ],
  },
  {
    id: "person-cathy-buquet",
    canonicalName: "Cathy B. McRae",
    alternateNames: [],
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
    notes: [
      "The middle initial, birth surname, spouse identity, and personal biographical details remain unresolved.",
      "Working parent links to Paige Bartholomew and Sean McRae are preserved separately at probable confidence.",
    ],
  },
  {
    id: "person-russell-j-comeaux",
    canonicalName: "Russell J. Comeaux",
    alternateNames: [
      {
        name: "Russell J. “Rooster” Comeaux",
        type: "nickname",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
        provenance: [
          {
            kind: "documented",
            sourceRefs: [{ sourceId: "SRC-RITA-OBIT-ADVERTISER" }],
          },
        ],
      },
    ],
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
        note: "The Rita and Philomene obituaries independently preserve Russell in the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: [
      "Living status, dates, spouse, and personal biographical details are not established.",
      "Working parent links to Rustie Lynn and Rhyan are preserved separately at probable confidence.",
    ],
  },
  {
    id: "person-allen-paul-comeaux-jr",
    canonicalName: "Allen Paul Comeaux Jr.",
    alternateNames: [],
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
        note: "The Rita and Philomene obituaries independently preserve Allen Jr. in the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: [
      "Living status, dates, places, and personal biographical details are not established.",
      "Working parent links to Gerard, Casey, and Brandi are preserved separately at probable confidence.",
    ],
  },
  {
    id: "person-peggy-comeaux",
    canonicalName: "Peggy C. Miller",
    alternateNames: [
      {
        name: "Peggy Comeaux Miller",
        type: "source-form",
        confidence: "verified",
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
          },
        ],
      },
    ],
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
        note: "The Rita and Philomene obituaries independently preserve Peggy in the same child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: [
      "Living status, dates, places, and personal biographical details are not established.",
      "The working parent link to Conrad is preserved separately at probable confidence.",
    ],
  },
  {
    id: "person-priscilla-comeaux",
    canonicalName: "Priscilla C. Babineaux",
    alternateNames: [
      {
        name: "Priscilla LeBlanc",
        type: "source-form",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-PHILOMENE-OBIT" }],
        provenance: [
          {
            kind: "documented",
            sourceRefs: [{ sourceId: "SRC-PHILOMENE-OBIT" }],
          },
        ],
        note: "2015 obituary form; it does not establish why or when the surname changed.",
      },
    ],
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
        note: "The two obituaries preserve different surname and spouse presentations for the same member of Rita's child group.",
      },
    ],
    researchRefs: [{ file: "research/branches/maternal-ancestors.md" }],
    notes: [
      "The 2015 and 2017 surname and spouse forms are retained without inferring a chronology.",
      "No relationship is inferred between either reported spouse and Dexter Babineaux.",
      "The working parent link to Dexter is preserved separately at probable confidence.",
      "Living status, dates, places, and personal biographical details are not established.",
    ],
  },
  {
    id: "person-monica",
    canonicalName: "Monica",
    alternateNames: [],
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
    notes: ["Surname, dates, places, and other biographical details are unresolved."],
  },
  {
    id: "person-clarence-miller",
    canonicalName: "Clarence Miller",
    alternateNames: [],
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
    notes: ["Dates, places, and other biographical details are unresolved."],
  },
  {
    id: "person-karlon",
    canonicalName: "Karlon",
    alternateNames: [],
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
      "Surname, dates, places, and other biographical details are unresolved.",
      "Karlon is not assumed to be the same person as Tippy LeBlanc.",
    ],
  },
  {
    id: "person-tippy-leblanc",
    canonicalName: "Tippy LeBlanc",
    alternateNames: [],
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
      "Dates, places, and other biographical details are unresolved.",
      "Tippy is not assumed to be the same person as Karlon.",
    ],
  },
  {
    id: "person-edmond-paul-buquet",
    canonicalName: "Edmond Paul Buquet",
    alternateNames: [
      {
        name: "Edmond “Bud” Paul Buquet",
        type: "nickname",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        provenance: [
          {
            kind: "family-confirmed",
            sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
          },
        ],
      },
    ],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
    provenance: [
      {
        kind: "family-confirmed",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael directly identifies Edmond as his brother.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: [
      "Living person; sensitive biographical details are intentionally omitted.",
      "Distinct from Michael's grandfather Edmond P. Buquet (1919–1986).",
    ],
  },
  {
    id: "person-gina-buquet",
    canonicalName: "Gina Buquet",
    alternateNames: [
      {
        name: "Gina Nevils",
        type: "married",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        provenance: [
          {
            kind: "family-confirmed",
            sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
          },
        ],
      },
      {
        name: "Gina Renee Buquet",
        type: "source-form",
        confidence: "unresolved",
        sourceRefs: [{ sourceId: "SRC-C20B-MICHAEL-SIBLINGS" }],
        note: "Michael supplied this form but expressly said the middle name is uncertain.",
      },
    ],
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
        note: "Michael directly identifies Gina as his sister and Gina Nevils as her current name.",
      },
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-A1-GINA-WAYNE-STATE-BIO" },
          { sourceId: "SRC-A1-GINA-MERCYHURST-BIO" },
        ],
        note: "Institutional biographies independently identify Gina and the same parental constellation.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/siblings-needed.md" }],
    notes: [
      "Living person; sensitive biographical details are intentionally omitted.",
      "The middle name remains unresolved and is not part of the canonical name.",
    ],
  },
  {
    id: "person-richard-russell-mcrae",
    canonicalName: "Richard Russell McRae",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
        note: "A 2026 memorial identifies Richard and directly names his children Paige and Sean.",
      },
    ],
    researchRefs: [{ file: "research/family-intake/cousins.md" }],
    notes: [
      "Only the parent-child relationships reported by the memorial are normalized.",
      "No spouse relationship with Cathy B. McRae is inferred from public-record association evidence.",
    ],
  },
  {
    id: "person-paige-bartholomew",
    canonicalName: "Paige Bartholomew",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" },
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
        note: "Verna's obituary identifies Paige as a grandchild; Richard's memorial identifies her as his child; association evidence supports the working Cathy branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/paternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: [
      "Cathy's maternity remains probable and is represented on the relationship rather than assumed from Paige's identity.",
      "Potentially living person; dates, places, and sensitive biographical details are intentionally omitted.",
    ],
  },
  {
    id: "person-sean-mcrae",
    canonicalName: "Sean McRae",
    alternateNames: [
      {
        name: "Sean “Rusty” McRae",
        type: "nickname",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
        provenance: [
          {
            kind: "documented",
            sourceRefs: [{ sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" }],
          },
        ],
      },
    ],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-VERNA-OBITUARY" },
      { sourceId: "SRC-RICHARD-MCRAE-MEMORIAL-2026" },
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
        note: "Verna's obituary identifies Sean as a grandchild; Richard's memorial identifies him as his child; association evidence supports the working Cathy branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/paternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: [
      "Cathy's maternity remains probable and is represented on the relationship rather than assumed from Sean's identity.",
      "Potentially living person; dates, places, and sensitive biographical details are intentionally omitted.",
    ],
  },
  {
    id: "person-conrad-miller",
    canonicalName: "Conrad Miller",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary identifies Conrad as a grandchild; the later research handoff supports the working Peggy branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: ["Potentially living person; dates, places, and sensitive biographical details are intentionally omitted."],
  },
  {
    id: "person-rustie-lynn-comeaux",
    canonicalName: "Rustie Lynn Comeaux",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary identifies Rustie Lynn as a grandchild; the later research handoff supports the working Russell branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: [
      "Later surnames were not supplied and are not invented or normalized.",
      "Potentially living person; dates, places, and sensitive biographical details are intentionally omitted.",
    ],
  },
  {
    id: "person-rhyan-comeaux",
    canonicalName: "Rhyan Comeaux",
    alternateNames: [
      {
        name: "Ryan Comeaux",
        type: "source-form",
        confidence: "unresolved",
        sourceRefs: [{ sourceId: "SRC-C20D-MATERNAL-CORROBORATION" }],
        provenance: [
          {
            kind: "documented",
            sourceRefs: [{ sourceId: "SRC-C20D-MATERNAL-CORROBORATION" }],
          },
        ],
        note: "Later obituary form; identity with Rita's obituary-recorded Rhyan requires family or direct-source confirmation.",
      },
      {
        name: "Ryan Earl Comeaux",
        type: "source-form",
        confidence: "unresolved",
        sourceRefs: [{ sourceId: "SRC-C20D-MATERNAL-CORROBORATION" }],
        provenance: [
          {
            kind: "documented",
            sourceRefs: [{ sourceId: "SRC-C20D-MATERNAL-CORROBORATION" }],
          },
        ],
        note: "Later obituary form; it is retained as a possible variant, not a proved identity merge.",
      },
    ],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary directly preserves the Rhyan form and identifies the person as her grandchild.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: [
      "Ryan and Ryan Earl remain unresolved possible name variants pending family confirmation or direct source inspection.",
      "Potentially living person; dates, places, and sensitive biographical details are intentionally omitted.",
    ],
  },
  {
    id: "person-dexter-babineaux",
    canonicalName: "Dexter Babineaux",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary identifies Dexter as a grandchild; the later research handoff supports the working Priscilla branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: [
      "No father is inferred from Priscilla's reported spouse history or Dexter's surname.",
      "Potentially living person; dates, places, and sensitive biographical details are intentionally omitted.",
    ],
  },
  {
    id: "person-gerard-comeaux",
    canonicalName: "Gerard Comeaux",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary identifies Gerard as a grandchild; the later research handoff supports the working Allen Jr. branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: ["Potentially living person; dates, places, and sensitive biographical details are intentionally omitted."],
  },
  {
    id: "person-casey-comeaux",
    canonicalName: "Casey Comeaux",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary identifies Casey as a grandchild; the later research handoff supports the working Allen Jr. branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: ["Potentially living person; dates, places, and sensitive biographical details are intentionally omitted."],
  },
  {
    id: "person-brandi-comeaux",
    canonicalName: "Brandi Comeaux",
    alternateNames: [],
    confidence: "verified",
    researchStatus: "accepted",
    sourceRefs: [
      { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
      { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
    ],
    provenance: [
      {
        kind: "documented",
        sourceRefs: [
          { sourceId: "SRC-RITA-OBIT-ADVERTISER" },
          { sourceId: "SRC-C20D-MATERNAL-CORROBORATION" },
        ],
        note: "Rita's obituary identifies Brandi as a grandchild; the later research handoff supports the working Allen Jr. branch.",
      },
    ],
    researchRefs: [
      { file: "research/branches/maternal-ancestors.md" },
      { file: "research/family-intake/cousins.md" },
    ],
    notes: ["Potentially living person; dates, places, and sensitive biographical details are intentionally omitted."],
  },
  {
    id: "person-karla-vannessa-contreras-buquet",
    canonicalName: "Karla Vannessa Contreras-Buquet",
    alternateNames: [
      {
        name: "Karla Vannessa Contreras",
        type: "maiden",
        confidence: "verified",
        sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
        provenance: [
          {
            kind: "family-confirmed",
            sourceRefs: [{ sourceId: "SRC-FAMILY-MICHAEL-SPOUSE-CHILDREN" }],
          },
        ],
      },
    ],
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
    notes: [
      "Living person; sensitive biographical details are intentionally omitted.",
      "Karla's ancestry is intentionally deferred until family information or other supported evidence is supplied.",
    ],
  },
  {
    id: "person-chloe-eloise-buquet",
    canonicalName: "Chloé Eloise Buquet",
    alternateNames: [],
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
    notes: ["Living minor; sensitive biographical details are intentionally omitted."],
  },
  {
    id: "person-jolie-renee-buquet",
    canonicalName: "Jolie Renee Buquet",
    alternateNames: [],
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
    notes: ["Living minor; sensitive biographical details are intentionally omitted."],
  },
] as const satisfies readonly Person[];
