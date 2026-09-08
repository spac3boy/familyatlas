export const researchQuestionClassifications = [
  "potentially-answerable-online",
  "likely-requires-archival-local-records",
  "requires-family-knowledge",
  "blocked-by-inaccessible-records",
  "genuinely-unknown",
] as const

export type ResearchQuestionClassification = (typeof researchQuestionClassifications)[number]

export const researchQuestionGroups = [
  "Immediate family",
  "Rita LeBlanc branch",
  "Allen Comeaux branch",
  "Edmond Buquet branch",
  "Verna Bakke branch",
  "Cross-family identity",
  "Geography and migration",
  "Sources",
] as const

export type ResearchQuestionGroup = (typeof researchQuestionGroups)[number]

export interface NormalizedResearchQuestion {
  readonly id: `research-question-${string}`
  readonly group: ResearchQuestionGroup
  readonly question: string
  readonly classification: ResearchQuestionClassification
  readonly nextEvidence: string
  readonly researchFile: string
}

/**
 * A reviewed application-facing selection from research/open-questions.md.
 * The website imports this normalized data; it never parses the Markdown archive.
 */
export const normalizedResearchQuestions = [
  {
    id: "research-question-karla-ancestry",
    group: "Immediate family",
    question: "Who are the supported ancestors on Karla Contreras-Buquet's paternal and maternal lines?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family information from Karla or Michael, followed by source review under the existing research methodology.",
    researchFile: "research/family-intake/spouse-children.md",
  },
  {
    id: "research-question-michael-vitals",
    group: "Immediate family",
    question: "What are Michael Buquet’s birth date and birthplace?",
    classification: "requires-family-knowledge",
    nextEvidence: "Michael’s own information or a family-held record.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-aubin-biography",
    group: "Immediate family",
    question: "What are Aubin Buquet’s birth details, middle name, residences, and occupation?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family knowledge and records belonging specifically to Michael’s father—not Aubin Vincent Buquet.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-aubin-paulette-status",
    group: "Immediate family",
    question: "What was the relationship or marriage status of Aubin Buquet and Paulette Comeaux?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family knowledge or a marriage record; supported co-parenthood does not prove a marriage.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-paulette-names",
    group: "Immediate family",
    question: "What is the chronology behind Paulette’s Comeaux, Buquet, and Wheeler name forms?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family knowledge and marriage records connecting the documented name forms.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-lucuis-parents",
    group: "Rita LeBlanc branch",
    question: "Who were Lucuis LeBlanc’s parents, and what were his vital and burial details?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "Rita’s 1928 baptism, Lucuis’s marriage or death record, obituary, or succession.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-rita-middle-name",
    group: "Rita LeBlanc branch",
    question: "Did Rita have a middle name or the initial M?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "An original birth or baptism record; family recollection and a compiled tree disagree.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-rita-allen-marriage",
    group: "Rita LeBlanc branch",
    question: "When and where did Rita LeBlanc marry Allen Comeaux?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "An original civil or Catholic marriage record.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-rita-1930-census",
    group: "Rita LeBlanc branch",
    question: "What was Rita’s 1930 census household?",
    classification: "potentially-answerable-online",
    nextEvidence: "A manual image search using locality and documented name variants.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-allen-name",
    group: "Allen Comeaux branch",
    question: "Was Paul Allen’s legal middle name, and did he use Sr. during life?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "The 1925 birth or baptism record and family-held signed documents.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-allen-burial",
    group: "Allen Comeaux branch",
    question: "Where was Allen Comeaux buried?",
    classification: "potentially-answerable-online",
    nextEvidence: "An Allen-specific cemetery record or obituary; relatives’ burials cannot supply the answer.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-joesette-identity",
    group: "Allen Comeaux branch",
    question: "What was Joesette R. Comeaux’s birth surname and full identity?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "The Jules–Joesette marriage, children’s baptisms, death certificate, or obituary.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-jules-parents",
    group: "Allen Comeaux branch",
    question: "Who were Jules Comeaux’s parents?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "An original baptism, marriage, death, obituary, or succession record; mixed Jules identities remain excluded.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-edmond-middle-initial",
    group: "Edmond Buquet branch",
    question: "What does Edmond Buquet’s middle initial P represent?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "A birth, baptism, marriage, Social Security, or family record.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-edmond-vitals",
    group: "Edmond Buquet branch",
    question: "Where was Edmond born, and what were his exact death place and burial?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "Vital, obituary, funeral-home, and cemetery records; Dulac origin and Houma last residence are not event places.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-edmond-occupation",
    group: "Edmond Buquet branch",
    question: "What was Edmond’s occupation, and did he work at Buquet Canning Company?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family knowledge corroborated by company, census, directory, or Social Security records.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-francois-origin",
    group: "Edmond Buquet branch",
    question: "Where in France was François Michel Jacques born, and who were his parents?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "A Louisiana record identifying a commune or parents before searching French records; Saint-Malo remains retracted.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-verna-marriage",
    group: "Verna Bakke branch",
    question: "When and where did Verna Bakke marry Edmond Buquet?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "A civil license and return, church register, announcement, or family document.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-verna-move",
    group: "Verna Bakke branch",
    question: "When and why did Verna move from Minnesota to Louisiana?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family knowledge, marriage records, directories, censuses, military records, or letters; the route and cause remain unknown.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-verna-navy",
    group: "Verna Bakke branch",
    question: "What were Verna’s Navy service dates, unit, station, and assignments?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "Her Official Military Personnel File, separation document, Navy Nurse Corps roster, or VA file.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-bakke-birth-conflicts",
    group: "Verna Bakke branch",
    question: "What are the correct birth years for Oscar Paul Bakke and Martin H. Bakke?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "Original Minnesota death records and Wisconsin or Minnesota birth and baptism records.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-bud-identities",
    group: "Cross-family identity",
    question: "Do the separate Edmond “Bud” and Bud Buquet obituary references identify any of the same people?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family knowledge and records mapping each grandchild through the intermediate parent; the current identities remain separate.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-gina-details",
    group: "Cross-family identity",
    question: "Is Gina Buquet Nevils’s middle name Renee?",
    classification: "requires-family-knowledge",
    nextEvidence: "Michael's confirmation, a family-held record, or another privacy-appropriate direct record.",
    researchFile: "research/family-intake/siblings-needed.md",
  },
  {
    id: "research-question-cousin-parent-mapping",
    group: "Cross-family identity",
    question: "Can the probable Cathy, Peggy, Russell, Priscilla, and Allen Jr. cousin-parent assignments be directly confirmed?",
    classification: "requires-family-knowledge",
    nextEvidence: "Michael or another close relative's confirmation, or directly inspected records that expressly name each parent-child pair.",
    researchFile: "research/family-intake/cousins.md",
  },
  {
    id: "research-question-rhyan-ryan-identity",
    group: "Cross-family identity",
    question: "Do Rhyan Comeaux, Ryan Comeaux, and Ryan Earl Comeaux identify the same person?",
    classification: "requires-family-knowledge",
    nextEvidence: "Family confirmation or direct inspection of the later Brasseaux-family obituaries and an identifying family record.",
    researchFile: "research/family-intake/cousins.md",
  },
  {
    id: "research-question-beau-sejours",
    group: "Geography and migration",
    question: "Where was Beau Sejours, and what kind of facility was it?",
    classification: "potentially-answerable-online",
    nextEvidence: "A facility directory, obituary context, or local record identifying the institution and locality.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-port-royal-modern",
    group: "Geography and migration",
    question: "What is the defensible modern equivalent of historical Port Royal, Acadia?",
    classification: "potentially-answerable-online",
    nextEvidence: "Authoritative historical geography; the application preserves the historical place until equivalence is documented.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-francois-route",
    group: "Geography and migration",
    question: "What was François Michel Jacques Buquet’s France-to-Louisiana route and first residence?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "Passenger, naturalization, church, land, or succession records; two endpoints do not establish a route.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-original-records",
    group: "Sources",
    question: "Which derivative or compiled claims can be upgraded by inspecting their underlying original records?",
    classification: "likely-requires-archival-local-records",
    nextEvidence: "Prioritize civil, sacramental, census, military, land, and cemetery images named in the source inventory.",
    researchFile: "research/open-questions.md",
  },
  {
    id: "research-question-citation-handles",
    group: "Sources",
    question: "Can public destination URLs be recovered for sources preserved only as ChatGPT citation handles?",
    classification: "blocked-by-inaccessible-records",
    nextEvidence: "Reacquire the original result or underlying record without presenting an internal handle as a public citation.",
    researchFile: "research/open-questions.md",
  },
] as const satisfies readonly NormalizedResearchQuestion[]

export const researchMethodology = [
  {
    title: "Evidence before narrative",
    description: "Separate what a source literally reports from identity matching and genealogical inference. Firsthand family confirmation and external documentation remain distinct and may support the same claim together.",
  },
  {
    title: "Uncertainty stays attached",
    description: "Verified, probable, and unresolved describe research confidence, while family-confirmed and documented describe provenance. Neither silently changes the other.",
  },
  {
    title: "Historical precision is preserved",
    description: "Exact, year-only, circa, before, after, range, and unknown dates remain distinct. Places use the narrowest supported geographic level.",
  },
  {
    title: "Routes require evidence",
    description: "Two locations at different dates never become a documented migration route without a source that describes the move.",
  },
  {
    title: "False leads remain guardrails",
    description: "Rejected, unattached, and research-only candidates stay outside accepted lineage and cannot donate facts to similar names.",
  },
  {
    title: "Research and product data stay separate",
    description: "The human-readable archive is reviewed into typed application data. The website never parses research prose at runtime.",
  },
] as const

export const researchArchiveCoverage = {
  status: "Ready for normalization with unresolved claims preserved",
  genealogicallyRelevantIdentities: 104,
  proposedSources: 87,
  representedPlaces: 53,
  movementEntries: 12,
  normalizedScope: "Accepted direct ancestral graph",
  archiveNote: "Archive totals include collateral, contextual, unresolved, unattached, and rejected research material that is intentionally absent from the accepted application graph.",
  researchFile: "research/manifest.json",
} as const
