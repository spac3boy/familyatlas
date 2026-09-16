"use client"

import { Map } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useExploreActions } from "@/state"
import type { PlaceId } from "@/types"

export function PlaceJourneyButton({
  placeId,
  placeName,
}: Readonly<{ placeId: PlaceId; placeName: string }>) {
  const router = useRouter()
  const { showPlaceInJourneys } = useExploreActions()

  const showJourney = () => {
    showPlaceInJourneys(placeId)
    router.push("/#family-explore")
  }

  return (
    <Button type="button" variant="outline" onClick={showJourney}>
      <Map aria-hidden="true" />
      See {placeName} on the map
    </Button>
  )
}
