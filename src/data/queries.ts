import { familyGraph } from "@/data/family-graph";
import { createGenealogyQueries } from "@/lib/genealogy/queries";

/** Pre-indexed public queries for the single canonical Family Atlas graph. */
export const familyGraphQueries = createGenealogyQueries(familyGraph);
