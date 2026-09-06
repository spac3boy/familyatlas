import { maternalAncestorEvents } from "@/data/ancestry/maternal/events";
import { maternalAncestorPeople } from "@/data/ancestry/maternal/people";
import { maternalAncestorRelationships } from "@/data/ancestry/maternal/relationships";
import { maternalAncestorSources } from "@/data/ancestry/maternal/sources";
import { paternalAncestorEvents } from "@/data/ancestry/paternal/events";
import { paternalAncestorPeople } from "@/data/ancestry/paternal/people";
import { paternalAncestorRelationships } from "@/data/ancestry/paternal/relationships";
import { paternalAncestorSources } from "@/data/ancestry/paternal/sources";
import { ancestryPlaces } from "@/data/ancestry/places";
import { foundationEvents } from "@/data/foundation/events";
import { foundationPeople } from "@/data/foundation/people";
import { foundationPlaces } from "@/data/foundation/places";
import { foundationRelationships } from "@/data/foundation/relationships";
import { foundationSources } from "@/data/foundation/sources";
import type { GenealogyGraph } from "@/types";

/**
 * The single application-facing family graph.
 *
 * The reviewed seven-person foundation and C5 direct ancestry are composed here.
 * Product code must not create parallel genealogy data.
 */
export const familyGraph = {
  schemaVersion: 1,
  people: [...foundationPeople, ...maternalAncestorPeople, ...paternalAncestorPeople],
  relationships: [
    ...foundationRelationships,
    ...maternalAncestorRelationships,
    ...paternalAncestorRelationships,
  ],
  events: [...foundationEvents, ...maternalAncestorEvents, ...paternalAncestorEvents],
  places: [...foundationPlaces, ...ancestryPlaces],
  sources: [...foundationSources, ...maternalAncestorSources, ...paternalAncestorSources],
} as const satisfies GenealogyGraph;
