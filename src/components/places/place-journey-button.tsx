"use client"

import { Map } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useExploreActions } from "@/state"
import type { PlaceId } from "@/types"

export function PlaceJourneyButton({ placeId }: Readonly<{ placeId: PlaceId }>) {
  const router = useRouter()
  const { selectPlace, setActiveView } = useExploreActions()

  const showJourney = () => {
    selectPlace(placeId)
    setActiveView("journeys")
    router.push("/#family-explore")
  }

  return (
    <Button type="button" variant="outline" onClick={showJourney}>
      <Map aria-hidden="true" />
      Show in Journeys
    </Button>
  )
}
