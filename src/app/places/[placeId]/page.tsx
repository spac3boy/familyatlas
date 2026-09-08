import { notFound } from "next/navigation"

import { PlaceProfile } from "@/components/places/place-profile"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPlaceProfileModel, isPlaceId } from "@/lib/genealogy"

export const dynamicParams = false

export function generateStaticParams() {
  return familyGraph.places
    .filter(({ researchStatus }) => researchStatus === "accepted")
    .map(({ id }) => ({ placeId: id }))
}

export default async function PlacePage({
  params,
}: Readonly<{ params: Promise<{ placeId: string }> }>) {
  const { placeId } = await params
  if (!isPlaceId(placeId)) notFound()

  const profile = buildPlaceProfileModel(familyGraph, placeId, familyGraphQueries)
  if (!profile) notFound()

  return <PlaceProfile profile={profile} />
}
