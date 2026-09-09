"use client"

import * as React from "react"
import { brushX, type BrushBehavior, type D3BrushEvent } from "d3-brush"
import { select } from "d3-selection"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useElementWidth } from "@/components/visualizations/use-element-width"
import { familyGraph, familyGraphQueries } from "@/data"
import {
  buildTimeSelectionEffects,
  deriveTimeNavigatorDomain,
  layoutTimeNavigator,
  navigatorSelectionForYear,
  navigatorYearFromSelection,
} from "@/lib/visualization"
import { useExploreActions, useExploreState } from "@/state"

export interface TimeNavigatorProps {
  readonly label?: string
}

export function TimeNavigator({ label = "Family time navigator" }: TimeNavigatorProps) {
  const { selectedYear } = useExploreState()
  const { selectYear } = useExploreActions()
  const [containerRef, measuredWidth] = useElementWidth<HTMLDivElement>(720)
  const keyboardRef = React.useRef<HTMLDivElement>(null)
  const brushRef = React.useRef<SVGGElement>(null)
  const brushBehaviorRef = React.useRef<BrushBehavior<unknown> | null>(null)
  const selectedYearRef = React.useRef(selectedYear)
  const domain = React.useMemo(
    () =>
      deriveTimeNavigatorDomain(
        familyGraph.events.filter(({ researchStatus }) => researchStatus === "accepted"),
      ),
    [],
  )
  const layout = React.useMemo(
    () => (domain ? layoutTimeNavigator(domain, measuredWidth) : undefined),
    [domain, measuredWidth],
  )
  const effects = React.useMemo(
    () => buildTimeSelectionEffects(familyGraph, selectedYear, familyGraphQueries),
    [selectedYear],
  )

  React.useEffect(() => {
    selectedYearRef.current = selectedYear
  }, [selectedYear])

  React.useEffect(() => {
    const element = brushRef.current
    if (!element || !domain || !layout) return
    const group = select(element)
    const behavior = brushX<unknown>()
      .extent([
        [layout.plotX1, 18],
        [layout.plotX2, 54],
      ])
      .handleSize(18)
      .touchable(true)
      .keyModifiers(false)
      .on("end.time-navigator", (event: D3BrushEvent<unknown>) => {
        if (!event.sourceEvent || !event.selection || !Array.isArray(event.selection)) return
        const [first, second] = event.selection
        if (typeof first !== "number" || typeof second !== "number") return
        selectYear(navigatorYearFromSelection(domain, layout.width, [first, second]))
      })

    group.call(behavior)
    brushBehaviorRef.current = behavior
    group.call(
      behavior.move,
      navigatorSelectionForYear(domain, layout.width, selectedYearRef.current),
    )
    return () => {
      group.on(".brush", null)
      brushBehaviorRef.current = null
    }
  }, [domain, layout, selectYear])

  React.useEffect(() => {
    const element = brushRef.current
    const behavior = brushBehaviorRef.current
    if (!element || !behavior || !domain || !layout) return
    select(element).call(
      behavior.move,
      navigatorSelectionForYear(domain, layout.width, selectedYear),
    )
  }, [domain, layout, selectedYear])

  if (!domain || !layout) return null

  const matchingEventCount = effects.eventFilter.matching.length
  const dimmedPersonCount = effects.people.filter(({ dim }) => dim).length
  const chooseKeyboardYear = (year: number) =>
    selectYear(Math.max(domain[0], Math.min(domain[1], year)))

  return (
    <section aria-labelledby="time-navigator-heading" className="mt-8 border bg-surface-subtle p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="editorial-label">Shared time context</p>
          <h3 id="time-navigator-heading" className="mt-2 text-base font-semibold tracking-[-0.015em]">
            {selectedYear === null ? "All years" : selectedYear}
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground" aria-live="polite">
            {selectedYear === null
              ? "No year filter is active. Dated and undated records remain available."
              : `${matchingEventCount} records are supported or possible in this year. ${dimmedPersonCount} people are conclusively outside it; incomplete life histories remain undimmed.`}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={selectedYear === null}
          onClick={() => selectYear(null)}
        >
          <X aria-hidden="true" />
          Clear year
        </Button>
      </div>

      <div ref={containerRef} className="mt-5 min-w-0">
        <div
          ref={keyboardRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={domain[0]}
          aria-valuemax={domain[1]}
          aria-valuenow={selectedYear ?? domain[1]}
          aria-valuetext={selectedYear === null ? "All years; no year selected" : String(selectedYear)}
          aria-describedby="time-navigator-instructions"
          data-selected-year={selectedYear ?? "all"}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          onPointerDown={() => keyboardRef.current?.focus()}
          onKeyDown={(event) => {
            let nextYear: number | null | undefined
            switch (event.key) {
              case "ArrowLeft":
              case "ArrowDown":
                nextYear = (selectedYear ?? domain[1] + 1) - 1
                break
              case "ArrowRight":
              case "ArrowUp":
                nextYear = (selectedYear ?? domain[0] - 1) + 1
                break
              case "PageDown":
                nextYear = (selectedYear ?? domain[1] + 10) - 10
                break
              case "PageUp":
                nextYear = (selectedYear ?? domain[0] - 10) + 10
                break
              case "Home":
                nextYear = domain[0]
                break
              case "End":
                nextYear = domain[1]
                break
              case "Delete":
              case "Backspace":
              case "Escape":
                nextYear = null
                break
              default:
                return
            }
            event.preventDefault()
            if (nextYear === null) selectYear(null)
            else chooseKeyboardYear(nextYear)
          }}
        >
          <svg
            role="img"
            aria-label={`${domain[0]} through ${domain[1]}`}
            width="100%"
            height={78}
            viewBox={`0 0 ${layout.width} 78`}
            className="block touch-none"
          >
            <line
              x1={layout.plotX1}
              x2={layout.plotX2}
              y1={36}
              y2={36}
              stroke="var(--muted-foreground)"
              vectorEffect="non-scaling-stroke"
            />
            <g aria-hidden="true">
              {layout.ticks.map(({ year, x }) => (
                <g key={year}>
                  <line
                    x1={x}
                    x2={x}
                    y1={31}
                    y2={43}
                    stroke="var(--muted-foreground)"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={x}
                    y={66}
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    className="text-[0.625rem] font-semibold tracking-[0.04em]"
                  >
                    {year}
                  </text>
                </g>
              ))}
            </g>
            <g ref={brushRef} className="time-navigator-brush" aria-hidden="true" />
          </svg>
        </div>
      </div>

      <p id="time-navigator-instructions" className="mt-3 text-[0.6875rem] leading-5 text-muted-foreground">
        Drag or tap-drag the scale. With the control focused, use arrow keys for one year,
        Page Up or Page Down for ten, Home or End for the bounds, and Escape or Delete to clear.
      </p>
    </section>
  )
}
