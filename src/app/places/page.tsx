import { PlaceDirectory } from "@/components/places/place-directory"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPlaceIndexGroups } from "@/lib/genealogy/place-profile"

const placeGroups = buildPlaceIndexGroups(familyGraph, familyGraphQueries)

export default function PlacesPage() {
  return <PlaceDirectory groups={placeGroups} />
}
