"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ExploreViewToggle } from "@/components/visualizations/explore-view-toggle"
import { TimeNavigator } from "@/components/visualizations/time-navigator"
import { familyGraph, familyGraphQueries } from "@/data"
import {
  buildFamilyTimelineModel,
  buildTimeSelectionEffects,
  formatTimelineDate,
  layoutFamilyTimeline,
  type FamilyTimelineLayoutEvent,
  type FamilyTimelineScope,
} from "@/lib/visualization"
import { cn } from "@/lib/utils"
import { useExploreActions, useExploreState } from "@/state"
import type { Event, PersonId } from "@/types"

const scopeOptions: readonly { readonly value: FamilyTimelineScope; readonly label: string }[] = [
  { value: "all", label: "All family" },
  { value: "paternal", label: "Paternal" },
  { value: "maternal", label: "Maternal" },
  { value: "selected", label: "Selected person" },
]

const eventLabels: Readonly<Record<Event["type"], string>> = {
  birth: "Birth",
  baptism: "Baptism",
  residence: "Residence",
  census: "Census",
  marriage: "Marriage",
  migration: "Movement",
  military: "Military service",
  occupation: "Occupation",
  death: "Death",
  burial: "Burial",
  other: "Other event",
}

function useElementWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(960)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => setWidth(Math.max(1, element.getBoundingClientRect().width))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

function eventName(event: Event) {
  return event.title ?? eventLabels[event.type]
}

function confidenceLabel(value: Event["confidence"]) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function TimelineEventMark({
  item,
  y,
  opacity,
}: Readonly<{ item: FamilyTimelineLayoutEvent; y: number; opacity: number }>) {
  const isPoint = item.extent.kind === "exact"
  const isCirca = item.extent.kind === "circa"
  const title = `${eventName(item.event)} — ${item.extent.label}. ${confidenceLabel(item.event.confidence)} confidence.`

  if (isPoint) {
    return (
      <circle
        cx={item.x1}
        cy={y}
        r={4}
        fill="var(--background)"
        stroke="var(--primary)"
        strokeWidth={2}
        opacity={opacity}
        vectorEffect="non-scaling-stroke"
      >
        <title>{title}</title>
      </circle>
    )
  }

  return (
    <g opacity={opacity}>
      <title>{title}</title>
      <line
        x1={item.x1}
        x2={item.x2}
        y1={y}
        y2={y}
        stroke="var(--primary)"
        strokeWidth={3}
        strokeLinecap={item.openStart || item.openEnd ? "butt" : "round"}
        strokeDasharray={isCirca ? "4 4" : undefined}
        vectorEffect="non-scaling-stroke"
      />
      {!item.openStart && (
        <line
          x1={item.x1}
          x2={item.x1}
          y1={y - 4}
          y2={y + 4}
          stroke="var(--primary)"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {!item.openEnd && (
        <line
          x1={item.x2}
          x2={item.x2}
          y1={y - 4}
          y2={y + 4}
          stroke="var(--primary)"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {item.openStart && (
        <path
          d={`M ${item.x1 + 7} ${y - 4} L ${item.x1} ${y} L ${item.x1 + 7} ${y + 4}`}
          fill="none"
          stroke="var(--primary)"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {item.openEnd && (
        <path
          d={`M ${item.x2 - 7} ${y - 4} L ${item.x2} ${y} L ${item.x2 - 7} ${y + 4}`}
          fill="none"
          stroke="var(--primary)"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  )
}

export function FamilyTimeline() {
  const { selectedPerson, selectedBranch, selectedYear, evidenceMode } = useExploreState()
  const { selectBranch, selectPerson } = useExploreActions()
  const [scope, setScope] = React.useState<FamilyTimelineScope>(() => {
    if (selectedBranch === "maternal" || selectedBranch === "paternal") return selectedBranch
    return selectedPerson ? "selected" : "all"
  })
  const [viewportRef, viewportWidth] = useElementWidth<HTMLDivElement>()
  const selectedName = selectedPerson
    ? familyGraph.people.find(({ id }) => id === selectedPerson)?.canonicalName
    : undefined
  const model = React.useMemo(
    () =>
      buildFamilyTimelineModel(familyGraph, {
        scope,
        selectedPersonId: selectedPerson,
      }),
    [scope, selectedPerson],
  )
  const layout = React.useMemo(
    () => layoutFamilyTimeline(model, viewportWidth, selectedYear),
    [model, selectedYear, viewportWidth],
  )
  const timeEffects = React.useMemo(
    () => buildTimeSelectionEffects(familyGraph, selectedYear, familyGraphQueries),
    [selectedYear],
  )
  const personTimeStates = React.useMemo(
    () => new Map(timeEffects.people.map((item) => [item.personId, item])),
    [timeEffects.people],
  )
  const eventTimeStates = React.useMemo(
    () => new Map(timeEffects.eventFilter.events.map((item) => [item.event.id, item.state])),
    [timeEffects.eventFilter.events],
  )

  const selectScope = (nextScope: FamilyTimelineScope) => {
    if (nextScope === "selected" && !selectedPerson) return
    setScope(nextScope)
    selectBranch(nextScope === "maternal" || nextScope === "paternal" ? nextScope : null)
  }

  const choosePerson = (personId: PersonId) => selectPerson(personId)

  return (
    <section id="family-timeline" aria-labelledby="family-timeline-heading" className="border-y bg-card">
      <div className="page-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.55fr)] lg:items-end">
          <div>
            <p className="editorial-label mb-4">Timeline / V1</p>
            <h2 id="family-timeline-heading" className="editorial-heading">
              Place each record in time.
            </h2>
            <p id="family-timeline-description" className="editorial-copy mt-5 max-w-2xl">
              Exact dates appear as points. Years, ranges, circa dates, and open-ended dates retain
              their documented uncertainty instead of becoming invented moments.
            </p>
          </div>
          <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            A lifespan line appears only when supported birth and death evidence both exist.
            Select any populated row to carry that person into the other Explore views.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-y py-4">
          <ExploreViewToggle />
          <span className="hidden h-5 border-l sm:block" aria-hidden="true" />
          <div role="group" aria-label="Family timeline scope" className="flex flex-wrap gap-1.5">
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
                    ? "Select a person from a populated timeline first"
                    : undefined
                }
                onClick={() => selectScope(option.value)}
              >
                {option.label}
                {option.value === "selected" && selectedName && (
                  <span className="hidden sm:inline">: {selectedName}</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <TimeNavigator label="Family timeline year" />

        {selectedName && (
          <p className="mt-4 text-xs leading-5 text-muted-foreground" aria-live="polite">
            Selected person: <span className="font-semibold text-foreground">{selectedName}</span>
          </p>
        )}

        <div
          ref={viewportRef}
          className="mt-5 max-w-full overflow-x-auto rounded-md border bg-background"
          tabIndex={0}
          aria-label="Scrollable family timeline"
        >
          {layout ? (
            <svg
              role="group"
              aria-label={`Family timeline with ${layout.rows.length} populated person rows`}
              aria-describedby="family-timeline-description"
              width={layout.width}
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="block max-w-none"
            >
              <rect width={layout.width} height={layout.height} fill="var(--background)" />
              {layout.selectedYearBand && (
                <g aria-hidden="true">
                  <rect
                    x={layout.selectedYearBand.x1}
                    y={layout.axisY}
                    width={Math.max(2, layout.selectedYearBand.x2 - layout.selectedYearBand.x1)}
                    height={layout.height - layout.axisY - 18}
                    fill="var(--accent)"
                  />
                  <line
                    x1={layout.selectedYearBand.x1}
                    x2={layout.selectedYearBand.x1}
                    y1={layout.axisY - 5}
                    y2={layout.height - 18}
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              )}
              <g aria-hidden="true">
                {layout.ticks.map((tick) => (
                  <g key={tick.date.toISOString()}>
                    <line
                      x1={tick.x}
                      x2={tick.x}
                      y1={layout.axisY}
                      y2={layout.height - 18}
                      stroke="var(--border)"
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={tick.x}
                      y={layout.axisY - 12}
                      textAnchor="middle"
                      fill="var(--muted-foreground)"
                      className="text-[0.625rem] font-semibold tracking-[0.06em]"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}
                <line
                  x1={layout.plotX1}
                  x2={layout.plotX2}
                  y1={layout.axisY}
                  y2={layout.axisY}
                  stroke="var(--muted-foreground)"
                  vectorEffect="non-scaling-stroke"
                />
              </g>

              {layout.rows.map((row) => {
                const isSelected = selectedPerson === row.person.id
                const temporalState = personTimeStates.get(row.person.id)
                return (
                  <g
                    key={row.person.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    data-time-state={temporalState?.state ?? "unfiltered"}
                    aria-label={`${row.person.canonicalName}. ${row.events.length} dated ${row.events.length === 1 ? "event" : "events"}${row.lifespan ? `. Supported lifespan: ${row.lifespan.label}` : ". No complete supported lifespan"}.${temporalState?.dim && selectedYear !== null ? ` Conclusively outside ${selectedYear}.` : ""}`}
                    className="cursor-pointer outline-none"
                    opacity={temporalState?.dim ? 0.28 : 1}
                    onClick={() => choosePerson(row.person.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        choosePerson(row.person.id)
                      }
                    }}
                  >
                    <rect
                      x={0}
                      y={row.y - 22}
                      width={layout.width}
                      height={44}
                      fill={isSelected ? "var(--accent)" : "transparent"}
                    />
                    <line
                      x1={0}
                      x2={layout.width}
                      y1={row.y + 22}
                      y2={row.y + 22}
                      stroke="var(--border)"
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={16}
                      y={row.y - 3}
                      fill="var(--foreground)"
                      className="text-[0.75rem] font-semibold"
                    >
                      {row.person.canonicalName}
                    </text>
                    <text
                      x={16}
                      y={row.y + 13}
                      fill="var(--muted-foreground)"
                      className="text-[0.5625rem] tracking-[0.05em] uppercase"
                    >
                      {row.events.length} {row.events.length === 1 ? "record" : "records"}
                    </text>
                    {row.lifespan && (
                      <g aria-hidden="true">
                        <title>{`Supported lifespan: ${row.lifespan.label}`}</title>
                        <line
                          x1={row.lifespan.possibleX1}
                          x2={row.lifespan.possibleX2}
                          y1={row.y}
                          y2={row.y}
                          stroke="var(--muted-foreground)"
                          strokeWidth={2}
                          strokeDasharray="3 4"
                          vectorEffect="non-scaling-stroke"
                        />
                        <line
                          x1={row.lifespan.supportedX1}
                          x2={row.lifespan.supportedX2}
                          y1={row.y}
                          y2={row.y}
                          stroke="var(--foreground)"
                          strokeWidth={2}
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    )}
                    <g aria-hidden="true">
                      {row.events.map((item) => {
                        const eventState = eventTimeStates.get(item.event.id)
                        const opacity =
                          selectedYear === null || eventState === "supported" || eventState === "possible"
                            ? 1
                            : eventState === "indeterminate"
                              ? 0.5
                              : 0.16
                        return (
                          <TimelineEventMark
                            key={item.event.id}
                            item={item}
                            y={row.y}
                            opacity={opacity}
                          />
                        )
                      })}
                    </g>
                  </g>
                )
              })}
            </svg>
          ) : (
            <div className="px-5 py-12 sm:px-8">
              <p className="text-sm font-medium">No dated events can be plotted for this scope.</p>
              <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
                The timeline does not estimate dates to fill an empty row. Choose another scope to
                view records with supported temporal evidence.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.6875rem] leading-5 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full border-2 border-primary" aria-hidden="true" />
            Exact date
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-7 bg-primary" aria-hidden="true" />
            Year or range
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-7 border-t-2 border-dashed border-primary" aria-hidden="true" />
            Circa interval
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-7 border-t-2 border-dashed border-muted-foreground" aria-hidden="true" />
            Possible lifespan extent
          </span>
        </div>

        <details className="mt-8 border-t pt-5">
          <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-medium marker:hidden">
            <ChevronRight aria-hidden="true" className="size-4 text-primary" />
            Browse plotted records as a list
          </summary>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
            This is the non-spatial equivalent of the timeline. Date wording and confidence are
            preserved from canonical data.
          </p>
          <div className="mt-5 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {model.rows.map((row) => (
              <article key={row.person.id} className="bg-card p-4">
                <button
                  type="button"
                  className={cn(
                    "text-left text-sm font-semibold underline-offset-4 hover:underline",
                    selectedPerson === row.person.id && "text-primary",
                  )}
                  aria-pressed={selectedPerson === row.person.id}
                  onClick={() => choosePerson(row.person.id)}
                >
                  {row.person.canonicalName}
                </button>
                {row.lifespan && (
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Supported lifespan: {row.lifespan.label}
                  </p>
                )}
                {personTimeStates.get(row.person.id)?.dim && selectedYear !== null && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Conclusively outside {selectedYear} based on known life dates
                  </p>
                )}
                <ul className="mt-3 space-y-2 border-t pt-3">
                  {row.datedEvents.map(({ event, extent }) => (
                    <li key={event.id} className="text-xs leading-5">
                      <span className="font-medium">{eventName(event)}</span>
                      <span className="text-muted-foreground">
                        {` · ${extent.label}`}
                        {(evidenceMode === "evidence" || event.confidence !== "verified") && ` · ${confidenceLabel(event.confidence)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </details>

        {model.undatedEvents.length > 0 && (
          <details className="mt-6 border-t pt-5">
            <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-medium marker:hidden">
              <ChevronRight aria-hidden="true" className="size-4 text-primary" />
              Records not plotted because their dates are unknown ({model.undatedEvents.length})
            </summary>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {model.undatedEvents.map((event) => (
                <li key={event.id} className="border px-3 py-2 text-xs leading-5">
                  <span className="font-medium">{eventName(event)}</span>
                  <span className="text-muted-foreground"> · {formatTimelineDate(event.date)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  )
}
