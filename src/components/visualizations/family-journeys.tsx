"use client"

import * as React from "react"
import { select } from "d3-selection"
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom"
import { ArrowUpRight, ChevronRight, LocateFixed, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"

import { PersonDetailPanel } from "@/components/people/person-detail-panel"
import { Button } from "@/components/ui/button"
import { ExploreViewToggle } from "@/components/visualizations/explore-view-toggle"
import { TimeNavigator } from "@/components/visualizations/time-navigator"
import { useElementWidth } from "@/components/visualizations/use-element-width"
import { useRafZoomTransform } from "@/components/visualizations/use-raf-zoom-transform"
import { familyGraph, familyGraphQueries } from "@/data"
import { familyPlaceMapAnchors } from "@/data/geography/place-map-anchors"
import {
  buildFamilyJourneyModel,
  clusterJourneyPoints,
  formatTimelineDate,
  layoutFamilyJourneyMap,
  uniqueJourneyPlaceId,
  type BoundaryFeatureCollection,
  type FamilyJourneyMapLayout,
  type FamilyJourneyScope,
  type JourneyMovement,
  type JourneyPlacePoint,
  type JourneyPointCluster,
} from "@/lib/visualization"
import { cn } from "@/lib/utils"
import { useExploreActions, useExploreState } from "@/state"
import type { MovementClassification, PersonId } from "@/types"

const scopeOptions: readonly { readonly value: FamilyJourneyScope; readonly label: string }[] = [
  { value: "all", label: "All family" },
  { value: "maternal", label: "Maternal" },
  { value: "paternal", label: "Paternal" },
  { value: "selected", label: "Selected person" },
]

const emptyBoundaries: BoundaryFeatureCollection = { type: "FeatureCollection", features: [] }

function boundaryDataUrl(file: string): string {
  if (typeof document === "undefined") return `/data/${file}`
  return new URL(`data/${file}`, document.baseURI).toString()
}

function movementLabel(classification: MovementClassification): string {
  if (classification === "documented-migration-move") return "Documented movement"
  if (classification === "strongly-inferred-move") return "Strongly inferred movement"
  return "Known endpoints · route unknown"
}

function movementDescription(movement: JourneyMovement): string {
  const from = movement.fromPlaces.map(({ modernName }) => modernName).join(" / ")
  const to = movement.toPlaces.map(({ modernName }) => modernName).join(" / ")
  return `${from} to ${to}`
}

function clusterAriaLabel(cluster: JourneyPointCluster): string {
  const placeCount = new Set(cluster.points.flatMap(({ places }) => places.map(({ id }) => id))).size
  const anchorNames = cluster.points.map(({ anchorLabel }) => anchorLabel)
  const certainty =
    cluster.certainty === "mixed" ? "documented and probable locations" : `${cluster.certainty} locations`
  const route = cluster.unknownRouteEventIds.length
    ? ". One or more paired endpoints have an unknown route; no route line is drawn"
    : ""
  return `${anchorNames.join(", ")}. ${placeCount} mapped ${placeCount === 1 ? "place" : "places"}. ${certainty}${route}.`
}

function PlaceMark({
  cluster,
  active,
  onActivate,
}: {
  readonly cluster: JourneyPointCluster
  readonly active: boolean
  readonly onActivate: () => void
}) {
  const probable = cluster.certainty === "probable"
  const mixed = cluster.certainty === "mixed"
  const placeCount = new Set(cluster.points.flatMap(({ places }) => places.map(({ id }) => id))).size
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={clusterAriaLabel(cluster)}
      aria-pressed={active}
      data-map-mark
      className="cursor-pointer outline-none"
      transform={`translate(${cluster.x} ${cluster.y})`}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onActivate()
        }
      }}
    >
      <circle r={22} fill="transparent" />
      {cluster.unknownRouteEventIds.length > 0 && (
        <circle
          r={11}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {(mixed || active) && (
        <circle
          r={active ? 9 : 8}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={active ? 2 : 1}
          strokeDasharray={mixed ? "3 2" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <circle
        r={probable ? 5.5 : 5}
        fill={probable ? "var(--card)" : "var(--primary)"}
        stroke="var(--primary)"
        strokeWidth={probable ? 1.5 : 1}
        strokeDasharray={probable ? "2 2" : undefined}
        opacity={cluster.timeState === "indeterminate" ? 0.58 : 1}
        vectorEffect="non-scaling-stroke"
      />
      {placeCount > 1 && (
        <text
          x={8}
          y={-8}
          fill="var(--foreground)"
          className="text-[0.5625rem] font-bold"
          paintOrder="stroke"
          stroke="var(--background)"
          strokeWidth={3}
          aria-hidden="true"
        >
          {placeCount}
        </text>
      )}
    </g>
  )
}

const JourneyMapMarks = React.memo(function JourneyMapMarks({
  layout,
  clusters,
  activeClusterId,
  onActivate,
}: {
  readonly layout: FamilyJourneyMapLayout
  readonly clusters: readonly JourneyPointCluster[]
  readonly activeClusterId: string | null
  readonly onActivate: (cluster: JourneyPointCluster) => void
}) {
  return (
    <>
      <g aria-hidden="true">
        {layout.countryPaths.map((path, index) => (
          <path
            key={`country-${index}`}
            d={path}
            fill="var(--surface-subtle)"
            stroke="var(--border)"
            strokeWidth={0.8}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {layout.subdivisionPaths.map((path, index) => (
          <path
            key={`subdivision-${index}`}
            d={path}
            fill="none"
            stroke="var(--border)"
            strokeWidth={0.55}
            strokeOpacity={0.75}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {layout.movements.map((movement) =>
          movement.path ? (
            <path
              key={movement.event.id}
              d={movement.path}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={movement.classification === "documented-migration-move" ? 1.8 : 1.5}
              strokeDasharray={
                movement.classification === "strongly-inferred-move" ? "7 5" : undefined
              }
              strokeOpacity={movement.timeState === "indeterminate" ? 0.36 : 0.7}
              vectorEffect="non-scaling-stroke"
            />
          ) : null,
        )}
      </g>
      {clusters.map((cluster) => (
        <PlaceMark
          key={cluster.id}
          cluster={cluster}
          active={activeClusterId === cluster.id}
          onActivate={() => onActivate(cluster)}
        />
      ))}
    </>
  )
})

export function FamilyJourneys() {
  const { selectedPerson, selectedBranch, selectedYear, selectedPlace, evidenceMode } = useExploreState()
  const { focusPersonInTree, selectBranch, selectPerson, selectPlace } = useExploreActions()
  const [personPanelOpen, setPersonPanelOpen] = React.useState(false)
  const personPanelTriggerRef = React.useRef<HTMLElement | SVGElement | null>(null)
  const [scope, setScope] = React.useState<FamilyJourneyScope>(() => {
    if (selectedBranch === "maternal" || selectedBranch === "paternal") return selectedBranch
    return selectedPerson ? "selected" : "all"
  })
  const [countryBoundaries, setCountryBoundaries] =
    React.useState<BoundaryFeatureCollection>(emptyBoundaries)
  const [subdivisionBoundaries, setSubdivisionBoundaries] =
    React.useState<BoundaryFeatureCollection>(emptyBoundaries)
  const [boundaryError, setBoundaryError] = React.useState(false)
  const [activeClusterId, setActiveClusterId] = React.useState<string | null>(null)
  const [viewportRef, viewportWidth] = useElementWidth<HTMLDivElement>(960)
  const viewportHeight = viewportWidth < 640 ? 480 : 580
  const svgRef = React.useRef<SVGSVGElement>(null)
  const zoomBehaviorRef = React.useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [transform, scheduleTransform] = useRafZoomTransform()

  React.useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(boundaryDataUrl("ne-110m-admin-0-countries.geojson")).then((response) => {
        if (!response.ok) throw new Error("Country boundary data could not be loaded.")
        return response.json() as Promise<BoundaryFeatureCollection>
      }),
      fetch(boundaryDataUrl("ne-110m-admin-1-states-provinces.geojson")).then((response) => {
        if (!response.ok) throw new Error("Subdivision boundary data could not be loaded.")
        return response.json() as Promise<BoundaryFeatureCollection>
      }),
    ])
      .then(([countries, subdivisions]) => {
        if (cancelled) return
        setCountryBoundaries(countries)
        setSubdivisionBoundaries(subdivisions)
        setBoundaryError(false)
      })
      .catch(() => {
        if (!cancelled) setBoundaryError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const model = React.useMemo(
    () =>
      buildFamilyJourneyModel(
        familyGraph,
        familyPlaceMapAnchors,
        { scope, selectedPersonId: selectedPerson, selectedYear },
        familyGraphQueries,
      ),
    [scope, selectedPerson, selectedYear],
  )
  const layout = React.useMemo(
    () =>
      layoutFamilyJourneyMap(
        model,
        countryBoundaries,
        subdivisionBoundaries,
        viewportWidth,
        viewportHeight,
        familyPlaceMapAnchors,
      ),
    [countryBoundaries, model, subdivisionBoundaries, viewportHeight, viewportWidth],
  )
  const selectedName = selectedPerson
    ? familyGraphQueries.personById(selectedPerson)?.canonicalName
    : undefined
  const sharedSelectedAnchorId = selectedPlace
    ? familyPlaceMapAnchors.find(({ placeId }) => placeId === selectedPlace)?.anchorId
    : undefined
  const clusters = React.useMemo(
    () => clusterJourneyPoints(layout.points, (viewportWidth < 640 ? 52 : 46) / transform.k),
    [layout.points, transform.k, viewportWidth],
  )
  const sharedSelectedClusterId = sharedSelectedAnchorId
    ? clusters.find(({ points }) => points.some(({ anchorId }) => anchorId === sharedSelectedAnchorId))?.id
    : undefined
  const validActiveClusterId =
    activeClusterId && clusters.some(({ id }) => id === activeClusterId) ? activeClusterId : null
  const shownClusterId = validActiveClusterId ?? sharedSelectedClusterId ?? null
  const activeCluster = clusters.find(({ id }) => id === shownClusterId)
  const activeClusterPoints = activeCluster?.points ?? []
  const activeClusterPlaces = [...new Map(
    activeClusterPoints.flatMap(({ places }) => places).map((place) => [place.id, place]),
  ).values()].sort((a, b) => a.modernName.localeCompare(b.modernName))
  const activeClusterEvents = new Set(activeClusterPoints.flatMap(({ events }) => events.map(({ id }) => id)))
  const selectedPointInCluster = selectedPlace
    ? activeClusterPoints.find(({ places }) => places.some(({ id }) => id === selectedPlace))
    : undefined
  const selectedPlaceRecord = selectedPlace
    ? familyGraph.places.find(({ id }) => id === selectedPlace)
    : undefined

  const applyTransform = React.useCallback((nextTransform: ZoomTransform) => {
    const element = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (element && behavior) select(element).call(behavior.transform, nextTransform)
  }, [])

  React.useEffect(() => {
    const element = svgRef.current
    if (!element) return
    const selection = select(element)
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 9])
      .duration(0)
      .filter((event) => {
        const target = event.target instanceof Element ? event.target : null
        return !target?.closest("[data-map-mark]") && (!event.ctrlKey || event.type === "wheel") && !event.button
      })
      .on("zoom", (event) => scheduleTransform(event.transform))
    selection.call(behavior)
    zoomBehaviorRef.current = behavior
    return () => {
      selection.on(".zoom", null)
      zoomBehaviorRef.current = null
    }
  }, [scheduleTransform])

  const chooseScope = (nextScope: FamilyJourneyScope) => {
    if (nextScope === "selected" && !selectedPerson) return
    setScope(nextScope)
    selectBranch(nextScope === "maternal" || nextScope === "paternal" ? nextScope : null)
    setActiveClusterId(null)
    selectPlace(null)
  }

  const activatePoint = (point: JourneyPlacePoint) => {
    const cluster = clusters.find(({ points }) => points.some(({ anchorId }) => anchorId === point.anchorId))
    setActiveClusterId(cluster?.id ?? null)
    selectPlace(uniqueJourneyPlaceId(point.places))
  }

  const activateCluster = React.useCallback((cluster: JourneyPointCluster) => {
    setActiveClusterId(cluster.id)
    const places = new Map(cluster.points.flatMap(({ places: pointPlaces }) => pointPlaces).map((place) => [place.id, place]))
    selectPlace(uniqueJourneyPlaceId([...places.values()]))
  }, [selectPlace])

  const openPersonDetails = (personId: PersonId, trigger: HTMLElement | SVGElement) => {
    personPanelTriggerRef.current = trigger
    selectPerson(personId)
    setPersonPanelOpen(true)
  }

  const showPersonInTree = (personId: PersonId) => {
    focusPersonInTree(personId)
    setPersonPanelOpen(false)
  }

  return (
    <section id="family-journeys" aria-labelledby="family-journeys-heading" className="border-y bg-card">
      <div className="page-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.55fr)] lg:items-end">
          <div>
            <p className="editorial-label mb-4">Journeys / V1</p>
            <h2 id="family-journeys-heading" className="editorial-heading">
              Place the evidence, not the route we imagine.
            </h2>
            <p id="family-journeys-description" className="editorial-copy mt-5 max-w-2xl">
              Supported family locations sit on published geographic boundaries. Movement lines are
              schematic, and disconnected rings mark known endpoints whose route is unknown.
            </p>
          </div>
          <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            Drag empty space to pan, pinch or use the controls to zoom, and select a marker to inspect
            the claims sharing its cartographic anchor.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-y py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <ExploreViewToggle />
            <span className="hidden h-5 border-l sm:block" aria-hidden="true" />
            <div role="group" aria-label="Family journey scope" className="flex flex-wrap gap-1.5">
              {scopeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={scope === option.value ? "secondary" : "ghost"}
                  size="sm"
                  aria-pressed={scope === option.value}
                  aria-label={
                    option.value === "selected" && selectedName
                      ? `Selected person: ${selectedName}`
                      : option.label
                  }
                  disabled={option.value === "selected" && !selectedPerson}
                  title={
                    option.value === "selected" && !selectedPerson
                      ? "Select a person in another view first"
                      : undefined
                  }
                  onClick={() => chooseScope(option.value)}
                >
                  {option.label}
                  {option.value === "selected" && selectedName && (
                    <span className="hidden sm:inline">: {selectedName}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => {
                const element = svgRef.current
                const behavior = zoomBehaviorRef.current
                if (element && behavior) select(element).call(behavior.scaleBy, 0.8)
              }}
            >
              <ZoomOut aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => {
                const element = svgRef.current
                const behavior = zoomBehaviorRef.current
                if (element && behavior) select(element).call(behavior.scaleBy, 1.25)
              }}
            >
              <ZoomIn aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyTransform(zoomIdentity)}>
              <RotateCcw aria-hidden="true" />
              Reset view
            </Button>
          </div>
        </div>

        <TimeNavigator label="Filter family journeys by year" />

        {selectedPlaceRecord && !sharedSelectedClusterId && (
          <p className="mt-4 border-l-2 border-primary pl-3 text-xs leading-5 text-muted-foreground" role="status">
            <span className="font-semibold text-foreground">{selectedPlaceRecord.modernName}</span>{" "}
            is selected, but it has no mapped record in the current family scope or year.
          </p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div
            ref={viewportRef}
            className="relative min-w-0 overflow-hidden rounded-md border bg-background"
            style={{ height: viewportHeight }}
          >
            <svg
              ref={svgRef}
              role="img"
              aria-label="Map of supported family locations and movements"
              aria-describedby="family-journeys-description"
              width="100%"
              height="100%"
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="block touch-none cursor-grab active:cursor-grabbing"
            >
              <rect width={layout.width} height={layout.height} fill="var(--background)" />
              <g transform={transform.toString()}>
                <JourneyMapMarks
                  layout={layout}
                  clusters={clusters}
                  activeClusterId={shownClusterId}
                  onActivate={activateCluster}
                />
              </g>
            </svg>

            {countryBoundaries.features.length === 0 && !boundaryError && (
              <p className="absolute inset-x-4 top-4 text-xs text-muted-foreground" role="status">
                Loading published map boundaries…
              </p>
            )}
            {boundaryError && (
              <p className="absolute inset-x-4 top-4 border bg-card p-3 text-xs text-muted-foreground" role="status">
                Boundary context could not be loaded. The supported place markers remain available in
                the structured list below.
              </p>
            )}
            {clusters.length === 0 && countryBoundaries.features.length > 0 && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center"
                aria-hidden="true"
              >
                <div className="max-w-xs rounded-md border bg-card/95 p-4 shadow-sm">
                  <LocateFixed className="mx-auto size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">No mapped locations for this scope</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Choose another family scope or person to inspect supported map evidence.
                  </p>
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute right-3 bottom-3 rounded-sm border bg-card/95 px-2.5 py-1.5 text-[0.625rem] font-medium tracking-[0.05em] text-muted-foreground uppercase">
              Pan · Zoom · Inspect
            </div>
          </div>

          <aside className="border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5" aria-live="polite">
            {activeCluster ? (
              <>
                <p className="editorial-label">Selected map anchor</p>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">
                  {activeClusterPoints.length === 1
                    ? activeClusterPoints[0].anchorLabel
                    : `${activeClusterPoints.length} nearby anchors`}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {activeClusterEvents.size} supported {activeClusterEvents.size === 1 ? "record" : "records"}
                  {activeCluster.timeState === "indeterminate" && selectedYear !== null
                    ? ` with dates unresolved for ${selectedYear}`
                    : selectedYear !== null
                      ? ` active or possible in ${selectedYear}`
                      : " across all years"}
                  .
                </p>
                <ul className="mt-5 divide-y border-t">
                  {activeClusterPlaces.map((place) => (
                    <li key={place.id} className="py-3">
                      <button
                        type="button"
                        aria-pressed={selectedPlace === place.id}
                        className={cn(
                          "w-full text-left text-sm font-medium hover:text-primary",
                          selectedPlace === place.id && "text-primary",
                        )}
                        onClick={() => selectPlace(place.id)}
                      >
                        {place.modernName}
                      </button>
                      <p className="mt-1 text-[0.6875rem] leading-4 text-muted-foreground">
                        {place.precision.replaceAll("-", " ")}
                        {(evidenceMode === "evidence" || place.confidence !== "verified") && ` · ${place.confidence}`}
                      </p>
                      <Link
                        href={`/places/${place.id}`}
                        className="mt-2 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-primary hover:underline"
                      >
                        View place
                        <ArrowUpRight aria-hidden="true" className="size-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.6875rem] leading-5 text-muted-foreground">
                  {selectedPointInCluster
                    ? selectedPointInCluster.precisionNotes.join(" ")
                    : activeClusterPoints.length === 1
                      ? activeClusterPoints[0].precisionNotes.join(" ")
                      : "Nearby display anchors are grouped so their full-size touch targets do not overlap. Select a place above to retain that canonical place in shared Explore context."}
                </p>
                {activeCluster.unknownRouteEventIds.length > 0 && (
                  <p className="mt-4 border-l-2 border-muted-foreground pl-3 text-xs leading-5 text-muted-foreground">
                    This anchor participates in a known-location pair whose route is unknown. No path
                    is drawn between the endpoints.
                  </p>
                )}
              </>
            ) : clusters.length > 0 ? (
              <div className="flex min-h-40 flex-col justify-center">
                <LocateFixed aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-4 text-sm font-medium">Select a place marker</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  A marker may group several canonical places that share the same honest map anchor.
                </p>
              </div>
            ) : (
              <div className="flex min-h-40 flex-col justify-center" role="status">
                <LocateFixed aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-4 text-sm font-medium">No mapped locations for this scope</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  The atlas does not invent a location for a person or branch without supported map
                  evidence. Choose another scope, or review any supported unplotted places in the
                  structured list below.
                </p>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[0.6875rem] leading-5 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            Documented location
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-full border border-dashed border-primary bg-card" aria-hidden="true" />
            Probable location
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-7 bg-primary" aria-hidden="true" />
            Documented movement · schematic path
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-7 border-t border-dashed border-primary" aria-hidden="true" />
            Strongly inferred movement · schematic path
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-full border border-dashed border-muted-foreground" aria-hidden="true" />
            Known endpoint · route unknown · no path
          </span>
        </div>

        <details className="mt-9 border-t pt-5">
          <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-medium marker:hidden">
            <ChevronRight aria-hidden="true" className="size-4 text-primary" />
            Browse mapped places and movements as a list
          </summary>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
            This is the non-spatial equivalent of the map. Selecting a person updates the same Explore
            context used by the tree and timeline.
          </p>

          <div className="mt-7 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="editorial-label">Mapped locations</h3>
              <ul className="mt-3 divide-y border-t">
                {model.points.map((point) => (
                  <li key={point.anchorId} className="py-4">
                    <button
                      type="button"
                      className="font-medium hover:text-primary"
                      onClick={() => activatePoint(point)}
                    >
                      {point.anchorLabel}
                    </button>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {point.places.map(({ modernName }) => modernName).join(" · ")} · {point.certainty}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {point.people.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          aria-pressed={selectedPerson === person.id}
                          className={cn(
                            "text-xs underline decoration-border underline-offset-4 hover:text-primary",
                            selectedPerson === person.id && "font-semibold text-primary",
                          )}
                          onClick={(event) => openPersonDetails(person.id, event.currentTarget)}
                        >
                          {person.canonicalName}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="editorial-label">Movement evidence</h3>
              <ol className="mt-3 divide-y border-t">
                {model.movements.map((movement) => (
                  <li key={movement.event.id} className="py-4">
                    <p className="text-xs font-semibold tracking-[0.06em] text-primary uppercase">
                      {movementLabel(movement.classification)}
                    </p>
                    <p className="mt-2 text-sm font-medium">{movementDescription(movement)}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {movement.people.map(({ canonicalName }) => canonicalName).join(" · ")} · {formatTimelineDate(movement.event.date)}
                    </p>
                    {movement.classification === "separate-known-locations-route-unknown" && (
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        These are separate observations. No travel path or intermediate stop is asserted.
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {model.unmappedPlaces.length > 0 && (
            <div className="mt-9 border-t pt-5">
              <h3 className="editorial-label">Supported, not plotted</h3>
              <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
                These historical places remain in the canonical graph, but the archive does not support
                a modern map anchor precise enough for this view.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {model.unmappedPlaces.map((place) => (
                  <li key={place.id}>{place.modernName}</li>
                ))}
              </ul>
            </div>
          )}
        </details>

        <p className="mt-8 text-[0.6875rem] leading-5 text-muted-foreground">
          Boundary context: Natural Earth 1:110m Admin 0 countries and Admin 1 states/provinces,
          version 5.1.x. Cartographic anchors are display references only and do not alter genealogy
          evidence or place precision.
        </p>

        <PersonDetailPanel
          personId={selectedPerson}
          open={personPanelOpen}
          onOpenChange={setPersonPanelOpen}
          onShowInTree={showPersonInTree}
          returnFocusRef={personPanelTriggerRef}
        />
      </div>
    </section>
  )
}
