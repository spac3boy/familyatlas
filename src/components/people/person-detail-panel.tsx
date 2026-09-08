"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  LocateFixed,
  Map,
  Network,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ConfidenceMark, ProvenanceMarks } from "@/components/research/confidence-mark"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { familyGraph, familyGraphQueries } from "@/data"
import { buildPersonDetailModel, type PersonDetailRelative } from "@/lib/genealogy/person-detail"
import { evidenceProvenanceKinds } from "@/lib/genealogy/evidence"
import { cn } from "@/lib/utils"
import { useExploreActions } from "@/state"
import type { Confidence, PersonId } from "@/types"

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)"

function subscribeToDesktopQuery(callback: () => void) {
  const query = window.matchMedia(DESKTOP_MEDIA_QUERY)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

const getDesktopSnapshot = () => window.matchMedia(DESKTOP_MEDIA_QUERY).matches
const getServerDesktopSnapshot = () => false

function useDesktopPanel() {
  return React.useSyncExternalStore(
    subscribeToDesktopQuery,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  )
}

function confidenceLabel(confidence: Confidence) {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1)
}

function RelativeList({
  label,
  relatives,
}: Readonly<{ label: string; relatives: readonly PersonDetailRelative[] }>) {
  if (relatives.length === 0) return null

  return (
    <div>
      <dt className="editorial-label">{label}</dt>
      <dd className="mt-2 space-y-1.5">
        {relatives.map(({ person, relationship }) => (
          <div key={relationship.id} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{person.canonicalName}</span>
            <span className="flex flex-wrap items-center justify-end gap-2">
              {relationship.type !== "parent-child" && (
                <span className="text-xs text-muted-foreground">
                  {relationship.type === "partner" ? "Partner" : "Spouse"}
                </span>
              )}
              <ProvenanceMarks kinds={evidenceProvenanceKinds(relationship)} />
            </span>
          </div>
        ))}
      </dd>
    </div>
  )
}

function PersonDetailContent({
  personId,
  onShowInTree,
}: Readonly<{ personId: PersonId; onShowInTree: (personId: PersonId) => void }>) {
  const model = React.useMemo(
    () => buildPersonDetailModel(familyGraph, personId, familyGraphQueries),
    [personId],
  )
  const { setActiveView, selectPerson } = useExploreActions()
  const [actionStatus, setActionStatus] = React.useState("")

  if (!model) return null

  const chooseView = (view: "journeys" | "timeline", label: string) => {
    selectPerson(model.person.id)
    setActiveView(view)
    setActionStatus(`${model.person.canonicalName} is selected for the ${label} view.`)
  }

  return (
    <>
      <div className="border-b px-5 pt-5 pb-6 sm:px-6">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="editorial-label">{model.relationshipLabel}</p>
            <h2 className="mt-3 text-2xl leading-tight font-semibold tracking-[-0.025em] text-balance">
              {model.person.canonicalName}
            </h2>
            {model.lifespan && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{model.lifespan}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <ConfidenceMark confidence={model.confidence} suffix="confidence" />
          <Badge variant="outline">
            {model.sourceCount} {model.sourceCount === 1 ? "source" : "sources"}
          </Badge>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
        <section aria-labelledby="relationship-path-heading">
          <h3 id="relationship-path-heading" className="editorial-label">
            Relationship to Michael
          </h3>
          {model.relationshipPaths.length > 0 ? (
            <div className="mt-3 space-y-3">
              {model.relationshipPaths.map((path, pathIndex) => (
                <div key={path.people.map(({ id }) => id).join("-")}>
                  <ol
                    className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-6"
                    aria-label={`Relationship path ${pathIndex + 1}`}
                  >
                    {path.people.map((person, index) => (
                      <React.Fragment key={person.id}>
                        {index > 0 && (
                          <li aria-hidden="true" className="text-muted-foreground">
                            <ArrowRight className="size-3.5" />
                          </li>
                        )}
                        <li className={cn(index === path.people.length - 1 && "font-semibold")}>
                          {person.canonicalName}
                        </li>
                      </React.Fragment>
                    ))}
                  </ol>
                  <p
                    data-evidence-detail={path.confidence === "verified" ? "verified" : undefined}
                    className="mt-1 text-[0.6875rem] font-medium tracking-[0.04em] text-muted-foreground uppercase"
                  >
                    {confidenceLabel(path.confidence)} path
                  </p>
                  <ProvenanceMarks kinds={path.provenanceKinds} className="mt-2" />
                </div>
              ))}
              {model.relationshipPaths.length > 1 && (
                <p className="text-xs leading-5 text-muted-foreground">
                  The graph contains {model.relationshipPaths.length} equally short supported paths.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No accepted relationship path is currently established.
            </p>
          )}
        </section>

        <section className="mt-7 border-t pt-6" aria-labelledby="biography-heading">
          <h3 id="biography-heading" className="editorial-label">
            Research-supported biography
          </h3>
          <p className="mt-3 text-sm leading-6 text-foreground/90">{model.biography}</p>
        </section>

        {model.places.length > 0 && (
          <section className="mt-7 border-t pt-6" aria-labelledby="places-heading">
            <h3 id="places-heading" className="editorial-label">
              Important known places
            </h3>
            <ul className="mt-3 space-y-3">
              {model.places.map(({ place, eventTypes }) => (
                <li key={place.id} className="flex gap-3">
                  <Map aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{place.modernName}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {eventTypes.join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(model.parents.length > 0 ||
          model.spousesAndPartners.length > 0 ||
          model.children.length > 0) && (
          <section className="mt-7 border-t pt-6" aria-labelledby="family-heading">
            <h3 id="family-heading" className="editorial-label">
              Immediate relationships
            </h3>
            <dl className="mt-4 grid gap-5">
              <RelativeList label="Parents" relatives={model.parents} />
              <RelativeList label="Spouse / partner" relatives={model.spousesAndPartners} />
              <RelativeList label="Children" relatives={model.children} />
            </dl>
          </section>
        )}
      </div>

      <div className="border-t bg-card px-5 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onShowInTree(model.person.id)}
          >
            <Network aria-hidden="true" />
            Show in tree
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => chooseView("journeys", "journeys")}
          >
            <LocateFixed aria-hidden="true" />
            Show journey
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => chooseView("timeline", "timeline")}
          >
            <Clock3 aria-hidden="true" />
            Show timeline
          </Button>
          <Link
            href={`/people/${model.person.id}`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <BookOpenText aria-hidden="true" />
            View full biography
          </Link>
        </div>
        <p className="mt-3 min-h-5 text-xs leading-5 text-muted-foreground" aria-live="polite">
          {actionStatus}
        </p>
      </div>
    </>
  )
}

export interface PersonDetailPanelProps {
  readonly personId: PersonId | null
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onShowInTree: (personId: PersonId) => void
}

export function PersonDetailPanel({
  personId,
  open,
  onOpenChange,
  onShowInTree,
}: PersonDetailPanelProps) {
  const desktop = useDesktopPanel()
  if (!personId) return null

  if (desktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[min(29rem,calc(100%-2rem))]">
          <div className="absolute top-4 right-4 z-10">
            <SheetCloseButton aria-label="Close person details" />
          </div>
          <SheetTitle className="sr-only">Person details</SheetTitle>
          <SheetDescription className="sr-only">
            Research-supported details and relationship path for the selected family member.
          </SheetDescription>
          <PersonDetailContent key={personId} personId={personId} onShowInTree={onShowInTree} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="absolute top-3 right-4 z-10">
          <DrawerCloseButton aria-label="Close person details" />
        </div>
        <DrawerTitle className="sr-only">Person details</DrawerTitle>
        <DrawerDescription className="sr-only">
          Research-supported details and relationship path for the selected family member.
        </DrawerDescription>
        <PersonDetailContent key={personId} personId={personId} onShowInTree={onShowInTree} />
      </DrawerContent>
    </Drawer>
  )
}
