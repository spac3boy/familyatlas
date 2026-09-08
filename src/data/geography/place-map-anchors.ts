import type { PlaceId } from "@/types";

export type MapAnchorPrecision =
  | "settlement-reference"
  | "administrative-reference"
  | "regional-reference";

/**
 * Visualization-only geographic anchors for canonical places.
 *
 * Coordinates position a supported place on a small-scale map; they are not
 * genealogy evidence and never upgrade the place's canonical precision. Exact
 * sites without inspected coordinates deliberately use a broader named anchor.
 */
export interface PlaceMapAnchor {
  readonly placeId: PlaceId;
  readonly anchorId: string;
  /** GeoJSON order: longitude, latitude. */
  readonly coordinates: readonly [number, number];
  readonly precision: MapAnchorPrecision;
  readonly anchorLabel: string;
  readonly precisionNote: string;
}

const settlement = (
  placeId: PlaceId,
  anchorId: string,
  coordinates: readonly [number, number],
  anchorLabel: string,
  precisionNote = "Shown at the named settlement, not as a street-level point.",
): PlaceMapAnchor => ({
  placeId,
  anchorId,
  coordinates,
  precision: "settlement-reference",
  anchorLabel,
  precisionNote,
});

const administrative = (
  placeId: PlaceId,
  anchorId: string,
  coordinates: readonly [number, number],
  anchorLabel: string,
  precisionNote: string,
): PlaceMapAnchor => ({
  placeId,
  anchorId,
  coordinates,
  precision: "administrative-reference",
  anchorLabel,
  precisionNote,
});

const regional = (
  placeId: PlaceId,
  anchorId: string,
  coordinates: readonly [number, number],
  anchorLabel: string,
  precisionNote: string,
): PlaceMapAnchor => ({
  placeId,
  anchorId,
  coordinates,
  precision: "regional-reference",
  anchorLabel,
  precisionNote,
});

export const familyPlaceMapAnchors = [
  administrative(
    "place-us-la-louisiana",
    "anchor-louisiana",
    [-91.96, 30.98],
    "Louisiana",
    "State-level reference point; no landing place is implied.",
  ),
  settlement("place-us-la-carencro", "anchor-carencro", [-92.05, 30.32], "Carencro"),
  settlement("place-us-la-cankton", "anchor-cankton", [-92.11, 30.35], "Cankton"),
  administrative(
    "place-us-la-lafayette-parish-ward-one",
    "anchor-lafayette-parish",
    [-92.06, 30.21],
    "Lafayette Parish",
    "Parish reference point; the historical Ward One boundary and address are not reconstructed.",
  ),
  settlement("place-us-la-dulac", "anchor-dulac", [-90.71, 29.39], "Dulac"),
  settlement("place-us-la-houma", "anchor-houma", [-90.72, 29.6], "Houma"),
  settlement(
    "place-us-la-evangeline-oaks-guest-house",
    "anchor-carencro",
    [-92.05, 30.32],
    "Carencro",
    "The named facility is documented; it is shown at Carencro because an inspected address coordinate is not preserved.",
  ),
  settlement(
    "place-us-la-st-peter-catholic-cemetery-carencro",
    "anchor-carencro",
    [-92.05, 30.32],
    "Carencro",
    "The named cemetery is documented; it is shown at Carencro rather than as an unverified plot coordinate.",
  ),
  settlement(
    "place-us-la-terrebonne-memorial-park",
    "anchor-houma",
    [-90.72, 29.6],
    "Houma",
    "The cemetery is documented in Houma; no plot coordinate is represented.",
  ),
  settlement("place-us-la-grand-coteau", "anchor-grand-coteau", [-92.05, 30.42], "Grand Coteau"),
  settlement("place-us-la-st-martinville", "anchor-st-martinville", [-91.83, 30.13], "St. Martinville"),
  administrative(
    "place-us-la-terrebonne-parish",
    "anchor-terrebonne-parish",
    [-90.82, 29.33],
    "Terrebonne Parish",
    "Parish-level reference point; no settlement or parcel is implied.",
  ),
  administrative(
    "place-us-la-bayou-terrebonne",
    "anchor-terrebonne-parish",
    [-90.82, 29.33],
    "Terrebonne Parish",
    "The waterway is documented, but its relevant segment and parcel coordinates are unresolved.",
  ),
  settlement("place-us-la-thibodaux", "anchor-thibodaux", [-90.82, 29.8], "Thibodaux"),
  administrative(
    "place-us-la-magnolia-cemetery-terrebonne",
    "anchor-terrebonne-parish",
    [-90.82, 29.33],
    "Terrebonne Parish",
    "The cemetery is documented only to Terrebonne Parish in the archive; no municipality or plot is implied.",
  ),
  settlement("place-us-mn-spring-grove", "anchor-spring-grove", [-91.64, 43.56], "Spring Grove"),
  administrative(
    "place-us-mn-wilmington-township",
    "anchor-wilmington-township",
    [-91.57, 43.46],
    "Wilmington Township",
    "Township-level reference point; no household address or parcel is implied.",
  ),
  administrative(
    "place-us-mn-houston-county",
    "anchor-houston-county",
    [-91.5, 43.67],
    "Houston County",
    "County-level reference point; no settlement is implied.",
  ),
  settlement("place-us-mn-caledonia", "anchor-caledonia", [-91.5, 43.63], "Caledonia"),
  administrative(
    "place-us-mn-old-trinity-cemetery",
    "anchor-houston-county",
    [-91.5, 43.67],
    "Houston County",
    "The cemetery is documented only to the Spring Grove/Houston County area in the archive.",
  ),
  settlement(
    "place-us-mn-hans-bakke-farm-west-spring-grove",
    "anchor-spring-grove",
    [-91.64, 43.56],
    "Spring Grove area",
    "The farm is described as four miles west of Spring Grove; no guessed parcel point is plotted.",
  ),
  administrative(
    "place-us-wi-wisconsin",
    "anchor-wisconsin",
    [-89.6, 44.6],
    "Wisconsin",
    "State-level reference point; no narrower birthplace is implied.",
  ),
  settlement("place-us-wi-milwaukee", "anchor-milwaukee", [-87.91, 43.04], "Milwaukee"),
  settlement(
    "place-us-wi-muskego-area",
    "anchor-muskego",
    [-88.14, 42.91],
    "Muskego area",
    "Settlement-area reference point; historical land and county boundaries remain unresolved.",
  ),
  administrative(
    "place-us-wi-racine-county-area",
    "anchor-racine-county",
    [-87.95, 42.73],
    "Racine County area",
    "County-area reference point; no town or parcel is implied.",
  ),
  regional(
    "place-no-norway",
    "anchor-norway",
    [8.47, 60.47],
    "Norway",
    "Country-level reference point; no parish or port is implied.",
  ),
  settlement("place-no-ringebu", "anchor-ringebu", [10.17, 61.53], "Ringebu"),
  regional(
    "place-no-gudbrandsdalen",
    "anchor-gudbrandsdalen",
    [9.93, 61.3],
    "Gudbrandsdalen",
    "Traditional-region reference point; no municipality is implied.",
  ),
  settlement("place-no-tinn", "anchor-tinn", [8.59, 59.83], "Tinn"),
  settlement("place-no-verdal", "anchor-verdal", [11.48, 63.79], "Verdal"),
  settlement("place-no-inderoy", "anchor-inderoy", [11.3, 63.87], "Inderøy"),
  regional(
    "place-fr-brittany",
    "anchor-brittany",
    [-3, 48.2],
    "Brittany",
    "Region-level reference point; no birthplace settlement is implied.",
  ),
  regional(
    "place-fr-france",
    "anchor-france",
    [2.21, 46.23],
    "France",
    "Country-level reference point; no port, route, or Saint-Malo origin is implied.",
  ),
] as const satisfies readonly PlaceMapAnchor[];

