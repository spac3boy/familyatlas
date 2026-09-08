"use client"

import * as React from "react"
import { select } from "d3-selection"
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom"
import { ChevronRight, FoldHorizontal, RotateCcw, UnfoldHorizontal, ZoomIn, ZoomOut } from "lucide-react"

import { PersonDetailPanel } from "@/components/people/person-detail-panel"
import { ConfidenceMark } from "@/components/research/confidence-mark"
import { Button } from "@/components/ui/button"
import { ExploreViewToggle } from "@/components/visualizations/explore-view-toggle"
import { familyGraph } from "@/data"
import {
  buildFamilyTreeHierarchy,
  defaultExpandedPersonIds,
  layoutFamilyTree,
  type FamilyTreeLayout,
  type FamilyTreeLayoutNode,
  type FamilyTreeScope,
} from "@/lib/visualization"
import { cn } from "@/lib/utils"
import { useExploreActions, useExploreState } from "@/state"
import type { Confidence, PersonId } from "@/types"

const INITIAL_VISIBLE_GENERATIONS = 3

const scopeOptions: readonly { readonly value: FamilyTreeScope; readonly label: string }[] = [
  { value: "all", label: "All family" },
  { value: "paternal", label: "Paternal" },
  { value: "maternal", label: "Maternal" },
  { value: "selected", label: "Selected person" },
]

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

function fitTransform(layout: FamilyTreeLayout, viewportWidth: number, viewportHeight: number) {
  const padding = viewportWidth < 640 ? 24 : 40
  const minimumReadableScale = viewportWidth < 640 ? 0.72 : 0.35
  const scale = Math.min(
    1,
    Math.max(
      minimumReadableScale,
      Math.min(
        (viewportWidth - padding * 2) / layout.width,
        (viewportHeight - padding * 2) / layout.height,
      ),
    ),
  )
  return zoomIdentity
    .translate(
      Math.max(padding, (viewportWidth - layout.width * scale) / 2),
      Math.max(padding, (viewportHeight - layout.height * scale) / 2),
    )
    .scale(scale)
}

function edgeDash(confidence: Confidence): string | undefined {
  if (confidence === "probable") return "6 5"
  if (confidence === "unresolved") return "2 4"
  return undefined
}

function nodeAriaLabel(node: FamilyTreeLayoutNode): string {
  const date = node.dateLabel ? ` ${node.dateLabel}.` : ""
  const ancestry = node.hasParents
    ? node.expanded
      ? " Known parents are shown. Press Left Arrow to collapse them."
      : " Known parents are hidden. Press Right Arrow to reveal them."
    : " No parents are represented beyond this person in the current tree."
  return `${node.canonicalName}.${date} ${node.confidence} confidence.${ancestry}`
}

interface TreeNodeProps {
  readonly node: FamilyTreeLayoutNode
  readonly nodeWidth: number
  readonly nodeHeight: number
  readonly selected: boolean
  readonly showConfidence: boolean
  readonly onSelect: (personId: PersonId) => void
  readonly onToggle: (personId: PersonId) => void
}

function TreeNode({ node, nodeWidth, nodeHeight, selected, showConfidence, onSelect, onToggle }: TreeNodeProps) {
  const activate = () => onSelect(node.personId)
  const toggle = () => node.hasParents && onToggle(node.personId)

  return (
    <g
      role="treeitem"
      aria-label={nodeAriaLabel(node)}
      aria-level={node.generation + 1}
      aria-selected={selected}
      aria-expanded={node.hasParents ? node.expanded : undefined}
      tabIndex={0}
      data-tree-node
      className="family-tree-node cursor-pointer outline-none"
      transform={`translate(${node.x} ${node.y - nodeHeight / 2})`}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          activate()
        } else if (event.key === "ArrowRight" && node.hasParents && !node.expanded) {
          event.preventDefault()
          toggle()
        } else if (event.key === "ArrowLeft" && node.hasParents && node.expanded) {
          event.preventDefault()
          toggle()
        }
      }}
    >
      <rect
        className="family-tree-node-surface"
        width={nodeWidth}
        height={nodeHeight}
        rx={4}
        fill={selected ? "var(--accent)" : "var(--card)"}
        stroke={selected ? "var(--primary)" : "transparent"}
      />
      <line
        x1={0.5}
        x2={0.5}
        y1={8}
        y2={nodeHeight - 8}
        stroke={selected ? "var(--primary)" : "var(--border)"}
        strokeWidth={selected ? 2 : 1}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={0}
        x2={nodeWidth}
        y1={nodeHeight - 0.5}
        y2={nodeHeight - 0.5}
        stroke="var(--border)"
        vectorEffect="non-scaling-stroke"
      />

      <text x={12} y={node.nameLines.length === 1 ? 27 : 20} fill="var(--foreground)">
        {node.nameLines.map((line, index) => (
          <tspan
            key={`${node.occurrenceId}-name-${index}`}
            x={12}
            dy={index === 0 ? 0 : 16}
            className="text-[0.8125rem] font-semibold"
          >
            {line}
          </tspan>
        ))}
      </text>
      {(node.dateLabel || showConfidence) && (
        <text
          x={12}
          y={node.nameLines.length === 1 ? 49 : 57}
          fill="var(--muted-foreground)"
          className="text-[0.625rem] tracking-[0.04em] uppercase"
        >
          {[node.dateLabel, showConfidence ? node.confidence : undefined].filter(Boolean).join(" · ")}
        </text>
      )}

      {node.hasParents && (
        <g
          aria-hidden="true"
          data-tree-node
          className="family-tree-expand-control"
          transform={`translate(${nodeWidth + 10} ${nodeHeight / 2})`}
          onClick={(event) => {
            event.stopPropagation()
            toggle()
          }}
        >
          <circle r={10} fill="var(--background)" stroke="var(--border)" />
          <path
            d={node.expanded ? "M -4 0 H 4" : "M -4 0 H 4 M 0 -4 V 4"}
            stroke="var(--primary)"
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      )}
    </g>
  )
}

export function FamilyTree() {
  const { selectedPerson, selectedBranch, evidenceMode } = useExploreState()
  const { selectBranch, selectPerson, setActiveView } = useExploreActions()
  const [personPanelOpen, setPersonPanelOpen] = React.useState(false)
  const [scope, setScope] = React.useState<FamilyTreeScope>(() => {
    if (selectedBranch === "maternal" || selectedBranch === "paternal") return selectedBranch
    return "all"
  })
  const treeRootId = scope === "selected" ? selectedPerson : null
  const hierarchyOptions = React.useMemo(
    () => ({ scope, selectedPersonId: treeRootId }),
    [scope, treeRootId],
  )
  const [expandedPersonIds, setExpandedPersonIds] = React.useState<ReadonlySet<PersonId>>(() =>
    defaultExpandedPersonIds(familyGraph, { scope: "all", selectedPersonId: null }),
  )
  const [viewportRef, viewportWidth] = useElementWidth<HTMLDivElement>()
  const viewportHeight = viewportWidth < 640 ? 560 : 640
  const svgRef = React.useRef<SVGSVGElement>(null)
  const zoomBehaviorRef = React.useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [transform, setTransform] = React.useState<ZoomTransform>(zoomIdentity)

  const treeLayout = React.useMemo(() => {
    const root = buildFamilyTreeHierarchy(familyGraph, {
      ...hierarchyOptions,
      expandedPersonIds,
    })
    return layoutFamilyTree(root, familyGraph.events, {
      rowGap: viewportWidth < 640 ? 80 : 84,
      generationGap: viewportWidth < 640 ? 204 : 224,
      nodeWidth: viewportWidth < 640 ? 168 : 184,
      nodeHeight: 68,
    })
  }, [expandedPersonIds, hierarchyOptions, viewportWidth])

  const applyTransform = React.useCallback((nextTransform: ZoomTransform) => {
    const element = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!element || !behavior) return
    select(element).call(behavior.transform, nextTransform)
  }, [])

  const resetView = React.useCallback(() => {
    applyTransform(fitTransform(treeLayout, viewportWidth, viewportHeight))
  }, [applyTransform, treeLayout, viewportHeight, viewportWidth])

  React.useEffect(() => {
    const element = svgRef.current
    if (!element) return
    const selection = select(element)
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2.5])
      .duration(0)
      .filter((event) => {
        const target = event.target instanceof Element ? event.target : null
        return !target?.closest("[data-tree-node]") && (!event.ctrlKey || event.type === "wheel") && !event.button
      })
      .on("zoom", (event) => setTransform(event.transform))
    selection.call(behavior)
    zoomBehaviorRef.current = behavior
    return () => {
      selection.on(".zoom", null)
      zoomBehaviorRef.current = null
    }
  }, [])

  React.useEffect(() => {
    resetView()
  }, [resetView])

  const selectScope = (nextScope: FamilyTreeScope) => {
    if (nextScope === "selected" && !selectedPerson) return
    setScope(nextScope)
    selectBranch(nextScope === "maternal" || nextScope === "paternal" ? nextScope : null)
    setExpandedPersonIds(
      defaultExpandedPersonIds(
        familyGraph,
        { scope: nextScope, selectedPersonId: nextScope === "selected" ? selectedPerson : null },
        INITIAL_VISIBLE_GENERATIONS,
      ),
    )
  }

  const handleSelectPerson = (personId: PersonId) => {
    selectPerson(personId)
    setPersonPanelOpen(true)
    if (scope === "selected") {
      setExpandedPersonIds(
        defaultExpandedPersonIds(
          familyGraph,
          { scope: "selected", selectedPersonId: personId },
          INITIAL_VISIBLE_GENERATIONS,
        ),
      )
    }
  }

  const showPersonInTree = (personId: PersonId) => {
    selectPerson(personId)
    selectBranch(null)
    setActiveView("tree")
    setScope("selected")
    setExpandedPersonIds(
      defaultExpandedPersonIds(
        familyGraph,
        { scope: "selected", selectedPersonId: personId },
        INITIAL_VISIBLE_GENERATIONS,
      ),
    )
    setPersonPanelOpen(false)
  }

  const togglePerson = (personId: PersonId) => {
    setExpandedPersonIds((current) => {
      const next = new Set(current)
      if (next.has(personId)) next.delete(personId)
      else next.add(personId)
      return next
    })
  }

  const showAllGenerations = () =>
    setExpandedPersonIds(new Set(familyGraph.people.map(({ id }) => id)))
  const collapseAncestry = () =>
    setExpandedPersonIds(
      defaultExpandedPersonIds(familyGraph, hierarchyOptions, INITIAL_VISIBLE_GENERATIONS),
    )

  const selectedName = selectedPerson
    ? familyGraph.people.find(({ id }) => id === selectedPerson)?.canonicalName
    : undefined
  const visiblePeople = React.useMemo(() => {
    const byId = new Map<PersonId, FamilyTreeLayoutNode>()
    for (const node of treeLayout.nodes) {
      const existing = byId.get(node.personId)
      if (!existing || node.generation < existing.generation) byId.set(node.personId, node)
    }
    return [...byId.values()].sort(
      (first, second) =>
        first.generation - second.generation ||
        first.canonicalName.localeCompare(second.canonicalName),
    )
  }, [treeLayout.nodes])

  return (
    <section id="family-tree" aria-labelledby="family-tree-heading" className="border-y bg-card">
      <div className="page-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.55fr)] lg:items-end">
          <div>
            <p className="editorial-label mb-4">Family tree / V1</p>
            <h2 id="family-tree-heading" className="editorial-heading">
              Follow the known ancestry.
            </h2>
            <p id="family-tree-description" className="editorial-copy mt-5 max-w-2xl">
              Every line is a source-backed parent-child relationship from the canonical family
              graph. Dashed lines indicate probable or unresolved links.
            </p>
          </div>
          <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            Drag empty space to pan, use the zoom controls, and select a name for shared context.
            The plus and minus controls reveal or fold known parents.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-y py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <ExploreViewToggle />
            <span className="hidden h-5 border-l sm:block" aria-hidden="true" />
            <div role="group" aria-label="Family tree scope" className="flex flex-wrap gap-1.5">
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
                      ? "Select a person in the tree first"
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

          <div className="flex flex-wrap items-center gap-1.5">
            <Button type="button" variant="ghost" size="sm" onClick={showAllGenerations}>
              <UnfoldHorizontal aria-hidden="true" />
              Show all
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={collapseAncestry}>
              <FoldHorizontal aria-hidden="true" />
              Fold older
            </Button>
            <span className="mx-1 hidden h-5 border-l sm:block" aria-hidden="true" />
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
            <Button type="button" variant="outline" size="sm" onClick={resetView}>
              <RotateCcw aria-hidden="true" />
              Reset view
            </Button>
          </div>
        </div>

        {selectedName && (
          <p className="mt-4 text-xs leading-5 text-muted-foreground" aria-live="polite">
            Selected person: <span className="font-semibold text-foreground">{selectedName}</span>
          </p>
        )}

        <div
          ref={viewportRef}
          className="relative mt-5 overflow-hidden rounded-md border bg-background"
          style={{ height: viewportHeight }}
        >
          <svg
            ref={svgRef}
            role="tree"
            aria-label="Known family ancestry"
            aria-describedby="family-tree-description"
            width="100%"
            height="100%"
            className="block touch-none cursor-grab active:cursor-grabbing"
          >
            <rect width="100%" height="100%" fill="var(--background)" />
            <g transform={transform.toString()}>
              <g aria-hidden="true">
                {treeLayout.edges.map((edge) => (
                  <path
                    key={edge.occurrenceId}
                    d={edge.path}
                    fill="none"
                    stroke="var(--muted-foreground)"
                    strokeWidth={1.25}
                    strokeDasharray={edgeDash(edge.confidence)}
                    strokeOpacity={edge.confidence === "verified" ? 0.62 : 0.72}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
              {treeLayout.nodes.map((node) => (
                <TreeNode
                  key={node.occurrenceId}
                  node={node}
                  nodeWidth={treeLayout.nodeWidth}
                  nodeHeight={treeLayout.nodeHeight}
                  selected={selectedPerson === node.personId}
                  showConfidence={evidenceMode === "evidence" || node.confidence !== "verified"}
                  onSelect={handleSelectPerson}
                  onToggle={togglePerson}
                />
              ))}
            </g>
          </svg>

          <div className="pointer-events-none absolute right-3 bottom-3 rounded-sm border bg-card/95 px-2.5 py-1.5 text-[0.625rem] font-medium tracking-[0.05em] text-muted-foreground uppercase">
            Pan · Zoom · Select
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.6875rem] leading-5 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-7 bg-muted-foreground" aria-hidden="true" />
            Verified relationship
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-7 border-t border-dashed border-muted-foreground" aria-hidden="true" />
            Probable or unresolved relationship
          </span>
        </div>

        <details className="mt-8 border-t pt-5">
          <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-medium marker:hidden">
            <ChevronRight aria-hidden="true" className="size-4 text-primary" />
            Browse visible people as a list
          </summary>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
            This list is an equivalent non-spatial way to select anyone currently shown in the
            tree. Generation numbers begin with the person at the tree root.
          </p>
          <ul className="mt-5 grid border-t sm:grid-cols-2 lg:grid-cols-3">
            {visiblePeople.map((person) => (
              <li key={person.personId} className="border-b sm:odd:border-r lg:border-r lg:nth-[3n]:border-r-0">
                <button
                  type="button"
                  aria-pressed={selectedPerson === person.personId}
                  className={cn(
                    "flex min-h-14 w-full items-center justify-between gap-4 px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                    selectedPerson === person.personId && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleSelectPerson(person.personId)}
                >
                  <span>
                    <span className="block font-medium">{person.canonicalName}</span>
                    {person.dateLabel && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {person.dateLabel}
                      </span>
                    )}
                    <ConfidenceMark confidence={person.confidence} className="mt-1" />
                  </span>
                  <span className="shrink-0 text-[0.625rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    Gen {person.generation}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </details>

        <PersonDetailPanel
          personId={selectedPerson}
          open={personPanelOpen}
          onOpenChange={setPersonPanelOpen}
          onShowInTree={showPersonInTree}
        />
      </div>
    </section>
  )
}
