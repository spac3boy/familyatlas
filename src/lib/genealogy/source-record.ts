import type {
  Event,
  GenealogyGraph,
  Person,
  Place,
  Relationship,
  Source,
  SourceId,
  SourceReference,
} from "@/types";

export interface SourceRecordModel {
  readonly source: Source;
  readonly people: readonly Person[];
  readonly places: readonly Place[];
  readonly events: readonly Event[];
  readonly relationships: readonly Relationship[];
}

const referencesSource = (
  references: readonly SourceReference[],
  sourceIds: ReadonlySet<SourceId>,
): boolean => references.some(({ sourceId }) => sourceIds.has(sourceId));

const relationshipPeople = (relationship: Relationship): readonly string[] =>
  relationship.type === "parent-child"
    ? [relationship.parentId, relationship.childId]
    : relationship.personIds;

export function buildSourceRecordModel(
  graph: GenealogyGraph,
  sourceId: SourceId,
): SourceRecordModel | undefined {
  const source = graph.sources.find(
    (candidate) =>
      candidate.researchStatus === "accepted"
      && (candidate.id === sourceId || candidate.idAliases?.includes(sourceId)),
  );
  if (!source) return undefined;

  const sourceIds = new Set<SourceId>([source.id, ...source.idAliases ?? []]);
  const events = graph.events.filter(
    (event) => event.researchStatus === "accepted" && referencesSource(event.sourceRefs, sourceIds),
  );
  const relationships = graph.relationships.filter(
    (relationship) =>
      relationship.researchStatus === "accepted"
      && referencesSource(relationship.sourceRefs, sourceIds),
  );

  const personIds = new Set<string>();
  for (const person of graph.people) {
    if (person.researchStatus !== "accepted") continue;
    if (
      referencesSource(person.sourceRefs, sourceIds)
      || person.alternateNames.some(({ sourceRefs }) => referencesSource(sourceRefs, sourceIds))
    ) {
      personIds.add(person.id);
    }
  }
  events.forEach(({ personIds: ids }) => ids.forEach((id) => personIds.add(id)));
  relationships.forEach((relationship) =>
    relationshipPeople(relationship).forEach((id) => personIds.add(id)),
  );

  const placeIds = new Set<string>();
  for (const place of graph.places) {
    if (place.researchStatus === "accepted" && referencesSource(place.sourceRefs, sourceIds)) {
      placeIds.add(place.id);
    }
  }
  for (const event of events) {
    if (event.placeId) placeIds.add(event.placeId);
    event.migration?.fromPlaceIds.forEach((id) => placeIds.add(id));
    event.migration?.toPlaceIds.forEach((id) => placeIds.add(id));
  }

  return {
    source,
    people: graph.people
      .filter((person) => personIds.has(person.id) && person.researchStatus === "accepted")
      .sort((first, second) => first.canonicalName.localeCompare(second.canonicalName)),
    places: graph.places
      .filter((place) => placeIds.has(place.id) && place.researchStatus === "accepted")
      .sort((first, second) => first.modernName.localeCompare(second.modernName)),
    events: [...events].sort((first, second) => (first.title ?? first.type).localeCompare(second.title ?? second.type)),
    relationships,
  };
}
