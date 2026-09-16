import type { Metadata } from "next"

import heroFrance from "@/assets/family-atlas-hero-france.jpg"
import { EditorialHero } from "@/components/layout/editorial-hero"
import { PlaceDirectory } from "@/components/places/place-directory"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPlaceIndexGroups } from "@/lib/genealogy/place-profile"

const placeGroups = buildPlaceIndexGroups(familyGraph, familyGraphQueries)

export const metadata: Metadata = {
  title: "Places",
  description: "Browse source-supported family places at their documented geographic precision.",
}

export default function PlacesPage() {
  return (
    <>
      <EditorialHero
        image={heroFrance}
        imagePosition="center 46%"
        eyebrow="Places in our family story"
        title="Places"
        aside={
          <p className="max-w-sm text-sm leading-6">
            These places are connected to our family through records and recollections. When all we
            know is a parish, county, or region, we leave it at that.
          </p>
        }
      />
      <PlaceDirectory groups={placeGroups} />
    </>
  )
}
