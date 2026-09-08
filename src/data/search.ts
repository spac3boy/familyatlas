import { familyGraph } from "@/data/family-graph";
import { buildGlobalSearchIndex } from "@/lib/genealogy/global-search";

/** Serializable search projection built only from the canonical application graph. */
export const familySearchIndex = buildGlobalSearchIndex(familyGraph);
