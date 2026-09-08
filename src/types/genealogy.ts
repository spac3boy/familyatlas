/**
 * Canonical, application-facing genealogy contracts.
 *
 * These types describe normalized data. They do not authorize the application
 * to parse research prose at runtime or to promote research candidates into the
 * accepted family graph.
 */

export const confidenceValues = ["verified", "probable", "unresolved"] as const;
export type Confidence = (typeof confidenceValues)[number];

/** Research disposition is intentionally separate from evidentiary confidence. */
export const researchStatusValues = [
  "accepted",
  "research-only-candidate",
  "rejected",
  "unattached",
  "contextual",
  "unresolved",
] as const;
export type ResearchStatus = (typeof researchStatusValues)[number];

export type PersonId = `${"person" | "candidate"}-${string}`;
export type RelationshipId = `relationship-${string}`;
export type EventId = `event-${string}`;
export type PlaceId = `${"place" | "candidate-place"}-${string}`;
export type SourceId = `SRC-${string}`;

export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];

interface HistoricalDateBase {
  /** The source wording, retained when normalization would hide useful nuance. */
  readonly originalText?: string;
  readonly note?: string;
}

export interface ExactHistoricalDate extends HistoricalDateBase {
  readonly kind: "exact";
  /** Proleptic Gregorian YYYY-MM-DD. Preserve a source calendar in `note`. */
  readonly value: string;
}

export interface YearHistoricalDate extends HistoricalDateBase {
  readonly kind: "year";
  readonly year: number;
}

export type HistoricalDatePoint = ExactHistoricalDate | YearHistoricalDate;

export interface CircaHistoricalDate extends HistoricalDateBase {
  readonly kind: "circa";
  readonly value: HistoricalDatePoint;
  readonly toleranceYears?: number;
}

export interface BeforeHistoricalDate extends HistoricalDateBase {
  readonly kind: "before";
  readonly value: HistoricalDatePoint;
}

export interface AfterHistoricalDate extends HistoricalDateBase {
  readonly kind: "after";
  readonly value: HistoricalDatePoint;
}

export interface RangeHistoricalDate extends HistoricalDateBase {
  readonly kind: "range";
  readonly start: HistoricalDatePoint;
  readonly end: HistoricalDatePoint;
}

export interface UnknownHistoricalDate extends HistoricalDateBase {
  readonly kind: "unknown";
}

export type HistoricalDate =
  | ExactHistoricalDate
  | YearHistoricalDate
  | CircaHistoricalDate
  | BeforeHistoricalDate
  | AfterHistoricalDate
  | RangeHistoricalDate
  | UnknownHistoricalDate;

export interface SourceReference {
  readonly sourceId: SourceId;
  /** Page, image, household, entry, or other source-local locator. */
  readonly locator?: string;
  readonly note?: string;
}

/** Link normalized records back to the human-readable archive. */
export interface ResearchReference {
  readonly file: string;
  /** Original packet claim/event handle; it is provenance, not a global ID. */
  readonly originalId?: string;
}

/**
 * How a claim is supported, independently of how confidently the research
 * accepts it. A claim may carry more than one provenance kind.
 */
export const evidenceProvenanceKindValues = ["family-confirmed", "documented"] as const;
export type EvidenceProvenanceKind = (typeof evidenceProvenanceKindValues)[number];

export interface EvidenceProvenance {
  readonly kind: EvidenceProvenanceKind;
  /** The subset of the entity's sources that provides this kind of support. */
  readonly sourceRefs: NonEmptyReadonlyArray<SourceReference>;
  readonly note?: string;
}

export interface EvidenceBackedEntity {
  readonly confidence: Confidence;
  readonly researchStatus: ResearchStatus;
  readonly sourceRefs: NonEmptyReadonlyArray<SourceReference>;
  /** Optional during incremental migration; absence means not yet classified. */
  readonly provenance?: NonEmptyReadonlyArray<EvidenceProvenance>;
  readonly researchRefs?: readonly ResearchReference[];
  readonly notes?: readonly string[];
}

export const alternateNameTypeValues = [
  "maiden",
  "married",
  "nickname",
  "spelling",
  "source-form",
  "other",
] as const;
export type AlternateNameType = (typeof alternateNameTypeValues)[number];

export interface AlternateName {
  readonly name: string;
  readonly type: AlternateNameType;
  readonly confidence: Confidence;
  readonly sourceRefs: NonEmptyReadonlyArray<SourceReference>;
  readonly provenance?: NonEmptyReadonlyArray<EvidenceProvenance>;
  readonly note?: string;
}

export interface Person extends EvidenceBackedEntity {
  readonly id: PersonId;
  /** Preferred research-supported display/indexing name, not a claim of birth name. */
  readonly canonicalName: string;
  readonly alternateNames: readonly AlternateName[];
  /** Superseded stable IDs that resolve to this person. */
  readonly idAliases?: readonly PersonId[];
  /** Explicit same-name non-equivalences established by the research archive. */
  readonly distinctFromPersonIds?: readonly PersonId[];
}

export const relationshipTypeValues = ["parent-child", "spouse", "partner"] as const;
export type RelationshipType = (typeof relationshipTypeValues)[number];

export const parentageTypeValues = [
  "biological",
  "adoptive",
  "step",
  "social",
  "unknown",
] as const;
export type ParentageType = (typeof parentageTypeValues)[number];

interface RelationshipBase extends EvidenceBackedEntity {
  readonly id: RelationshipId;
}

export interface ParentChildRelationship extends RelationshipBase {
  readonly type: "parent-child";
  readonly parentage: ParentageType;
  readonly parentId: PersonId;
  readonly childId: PersonId;
}

export interface CoupleRelationship extends RelationshipBase {
  readonly type: "spouse" | "partner";
  /** Pair order has no semantic meaning. */
  readonly personIds: readonly [PersonId, PersonId];
}

export type Relationship = ParentChildRelationship | CoupleRelationship;

export const eventTypeValues = [
  "birth",
  "baptism",
  "residence",
  "census",
  "marriage",
  "migration",
  "military",
  "occupation",
  "death",
  "burial",
  "other",
] as const;
export type EventType = (typeof eventTypeValues)[number];

export const movementClassificationValues = [
  "documented-migration-move",
  "strongly-inferred-move",
  "separate-known-locations-route-unknown",
] as const;
export type MovementClassification = (typeof movementClassificationValues)[number];

export interface MigrationDetails {
  readonly classification: MovementClassification;
  readonly fromPlaceIds: NonEmptyReadonlyArray<PlaceId>;
  readonly toPlaceIds: NonEmptyReadonlyArray<PlaceId>;
}

export interface Event extends EvidenceBackedEntity {
  readonly id: EventId;
  readonly type: EventType;
  readonly title?: string;
  readonly personIds: NonEmptyReadonlyArray<PersonId>;
  readonly relationshipIds?: readonly RelationshipId[];
  /** Unknown is explicit; an absent date is not allowed. */
  readonly date: HistoricalDate;
  readonly placeId?: PlaceId;
  readonly migration?: MigrationDetails;
  readonly description?: string;
}

export const locationPrecisionValues = [
  "exact-documented-location",
  "town-city",
  "parish-county",
  "state-province-region",
  "country",
  "probable-location",
  "mentioned-insufficient-precision",
] as const;
export type LocationPrecision = (typeof locationPrecisionValues)[number];

export interface Place extends EvidenceBackedEntity {
  readonly id: PlaceId;
  readonly modernName: string;
  readonly historicalNames: readonly string[];
  readonly alternateNames?: readonly string[];
  readonly settlement?: string;
  readonly parishCounty?: string;
  readonly stateProvinceRegion?: string;
  readonly country?: string;
  readonly precision: LocationPrecision;
  readonly parentPlaceId?: PlaceId;
  readonly idAliases?: readonly PlaceId[];
}

export const sourceCategoryValues = [
  "census",
  "civil-birth",
  "baptism-church",
  "marriage",
  "death",
  "obituary",
  "cemetery-burial",
  "military",
  "immigration",
  "naturalization",
  "directory",
  "newspaper",
  "genealogy-database",
  "family-provided",
  "other-primary",
  "secondary",
  "other",
] as const;
export type SourceCategory = (typeof sourceCategoryValues)[number];

export const evidenceClassValues = [
  "primary",
  "secondary",
  "family-provided",
  "derivative",
  "unknown",
] as const;
export type EvidenceClass = (typeof evidenceClassValues)[number];

export const inspectionStatusValues = [
  "directly-inspected",
  "transcription-inspected",
  "index-only",
  "referenced-not-inspected",
  "unknown",
] as const;
export type InspectionStatus = (typeof inspectionStatusValues)[number];

export interface Source {
  readonly id: SourceId;
  readonly title: string;
  readonly category: SourceCategory;
  readonly recordType?: string;
  readonly date?: HistoricalDate;
  readonly jurisdiction?: string;
  readonly repository?: string;
  readonly urls: readonly string[];
  readonly citationHandles: readonly string[];
  readonly evidenceClass: EvidenceClass;
  readonly inspectionStatus: InspectionStatus;
  readonly researchStatus: ResearchStatus;
  readonly reliabilityNotes?: readonly string[];
  readonly contradictionNotes?: readonly string[];
  readonly idAliases?: readonly SourceId[];
  readonly researchRefs?: readonly ResearchReference[];
}

/** The single normalized graph consumed by application code. */
export interface GenealogyGraph {
  readonly schemaVersion: 1;
  readonly people: readonly Person[];
  readonly relationships: readonly Relationship[];
  readonly events: readonly Event[];
  readonly places: readonly Place[];
  readonly sources: readonly Source[];
}
