"use client"

import { ExploreViewToggle } from "@/components/visualizations/explore-view-toggle"
import { familyGraph } from "@/data"
import {
  buildFamilyPatternsModel,
  type PatternKey,
  type PatternSegment,
} from "@/lib/visualization"
import { cn } from "@/lib/utils"

const model = buildFamilyPatternsModel(familyGraph)

const segmentStyles: Readonly<Record<PatternKey, string>> = {
  maternal: "bg-primary",
  paternal: "bg-foreground/70",
  both: "bg-primary/45",
  verified: "bg-primary",
  probable: "bg-foreground/45 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_4px,var(--card)_4px,var(--card)_6px)]",
  unresolved: "border border-foreground/40 bg-transparent",
  "birthplace-supported": "bg-primary",
  "birth-without-place": "bg-foreground/35",
  "birth-not-recorded": "border border-foreground/25 bg-transparent",
}

function PatternLegend({ segments }: Readonly<{ segments: readonly PatternSegment[] }>) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {segments.map((segment) => (
        <li key={segment.key} className="flex items-center gap-2">
          <span className={cn("size-2.5 shrink-0", segmentStyles[segment.key])} aria-hidden="true" />
          <span>
            {segment.label} <span className="tabular-nums text-foreground">{segment.count}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function StackedBar({
  segments,
  label,
}: Readonly<{ segments: readonly PatternSegment[]; label: string }>) {
  return (
    <div
      role="img"
      aria-label={`${label}: ${segments.map(({ label: segmentLabel, count }) => `${segmentLabel} ${count}`).join(", ")}`}
      className="flex h-3 w-full overflow-hidden bg-muted"
    >
      {segments.map((segment) => (
        <span
          key={segment.key}
          className={cn("h-full min-w-0", segmentStyles[segment.key])}
          style={{ width: `${segment.width}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function FamilyPatterns() {
  const generationLegend = [
    { key: "maternal" as const, label: "Maternal", count: model.generations.reduce((sum, row) => sum + (row.segments.find(({ key }) => key === "maternal")?.count ?? 0), 0), width: 0 },
    { key: "paternal" as const, label: "Paternal", count: model.generations.reduce((sum, row) => sum + (row.segments.find(({ key }) => key === "paternal")?.count ?? 0), 0), width: 0 },
    { key: "both" as const, label: "Both branches", count: model.generations.reduce((sum, row) => sum + (row.segments.find(({ key }) => key === "both")?.count ?? 0), 0), width: 0 },
  ].filter(({ count }) => count > 0)

  return (
    <section id="family-patterns" aria-labelledby="family-patterns-heading" className="border-y bg-card">
      <div className="page-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.55fr)] lg:items-end">
          <div>
            <p className="editorial-label mb-4">Patterns / V1</p>
            <h2 id="family-patterns-heading" className="editorial-heading">
              See what the archive can support.
            </h2>
            <p className="editorial-copy mt-5 max-w-2xl">
              These views count accepted records and make missing evidence visible. They describe
              the current archive, not the size or completeness of the biological family.
            </p>
          </div>
          <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            No chart treats an unknown birthplace as zero, fills an absent ancestor slot, or turns
            a probable record into a verified one.
          </p>
        </div>

        <div className="mt-10 border-y py-4">
          <ExploreViewToggle />
        </div>

        <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:gap-16">
          <article aria-labelledby="ancestor-pattern-heading">
            <p className="editorial-label mb-3">Structure</p>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
              <div>
                <h3 id="ancestor-pattern-heading" className="text-xl font-medium tracking-tight">
                  Recorded ancestors by generation
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {model.recordedAncestors} unique accepted ancestor identities connected to
                  Michael by supported parent-child paths.
                </p>
              </div>
              <p className="text-3xl font-medium tabular-nums tracking-[-0.04em]">{model.recordedAncestors}</p>
            </div>
            <div className="mt-7 space-y-4">
              {model.generations.map((row) => (
                <div key={row.generation} className="grid grid-cols-[7.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)_2.5rem]">
                  <span className="truncate text-muted-foreground">{row.label}</span>
                  <StackedBar segments={row.segments} label={row.label} />
                  <span className="text-right font-medium tabular-nums">{row.total}</span>
                </div>
              ))}
            </div>
            <PatternLegend segments={generationLegend} />
            <p className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground">
              Bar length compares represented identities across generations. It is not a percentage
              of expected ancestor slots, and probable paths remain included as probable evidence.
            </p>
          </article>

          <article aria-labelledby="birthplace-pattern-heading">
            <p className="editorial-label mb-3">Missingness</p>
            <div className="border-b pb-5">
              <h3 id="birthplace-pattern-heading" className="text-xl font-medium tracking-tight">
                Birthplace evidence coverage
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A completeness check across all {model.birthplaceEvidence.total} accepted people,
                before attempting any geographic comparison.
              </p>
            </div>
            <div className="mt-7">
              <StackedBar segments={model.birthplaceEvidence.segments} label="Birthplace evidence coverage" />
              <PatternLegend segments={model.birthplaceEvidence.segments} />
            </div>
            <p className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground">
              Supported birthplace evidence currently represents {model.birthplaceEvidence.distinctSupportedPlaces}{" "}
              distinct canonical places. That sample is too sparse and too mixed in precision for
              a responsible birthplace-distribution ranking.
            </p>
          </article>
        </div>

        <article aria-labelledby="confidence-pattern-heading" className="mt-16 border-t pt-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="editorial-label mb-3">Evidence</p>
              <h3 id="confidence-pattern-heading" className="text-xl font-medium tracking-tight">
                Confidence across accepted records
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Each row is its own record type and its own whole. The mix is an inventory of
                research states, not an overall reliability score.
              </p>
            </div>
            <div className="space-y-5">
              {model.confidence.map((row) => (
                <div key={row.entityType}>
                  <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-medium">{row.label}</span>
                    <span className="tabular-nums text-muted-foreground">{row.total} records</span>
                  </div>
                  <StackedBar segments={row.segments} label={`${row.label} confidence`} />
                  <PatternLegend segments={row.segments.filter(({ count }) => count > 0)} />
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside aria-labelledby="not-charted-heading" className="mt-16 border-t pt-10">
          <p className="editorial-label mb-3">Restraint</p>
          <h3 id="not-charted-heading" className="text-lg font-medium tracking-tight">
            Not charted yet
          </h3>
          <dl className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-3">
            {model.excluded.map((item) => (
              <div key={item.id}>
                <dt className="text-sm font-medium">{item.label}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.reason}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
