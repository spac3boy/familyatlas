import type {
  EvidenceProvenance,
  EvidenceProvenanceKind,
  Relationship,
} from "@/types";

export interface ProvenanceBearingClaim {
  readonly provenance?: readonly EvidenceProvenance[];
}

/** Return explicitly classified claim provenance without inferring it from source category. */
export function evidenceProvenanceKinds(
  claim: ProvenanceBearingClaim,
): readonly EvidenceProvenanceKind[] {
  return [...new Set((claim.provenance ?? []).map(({ kind }) => kind))];
}

/**
 * Return only provenance kinds shared by every edge in a relationship path.
 * An empty path has no derived provenance.
 */
export function sharedRelationshipProvenanceKinds(
  relationships: readonly Relationship[],
): readonly EvidenceProvenanceKind[] {
  if (relationships.length === 0) return [];
  const [first, ...rest] = relationships;
  return evidenceProvenanceKinds(first).filter((kind) =>
    rest.every((relationship) => evidenceProvenanceKinds(relationship).includes(kind)),
  );
}
