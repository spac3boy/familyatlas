import type { Metadata } from "next"

import { PlaceDirectory } from "@/components/places/place-directory"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPlaceIndexGroups } from "@/lib/genealogy/place-profile"

const placeGroups = buildPlaceIndexGroups(familyGraph, familyGraphQueries)

export const metadata: Metadata = {
  title: "Places",
  description: "Browse source-supported family places at their documented geographic precision.",
}

export default function PlacesPage() {
  return <PlaceDirectory groups={placeGroups} />
}
