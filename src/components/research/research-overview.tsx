import {
  Archive,
  ArrowRight,
  BookOpenText,
  ChevronRight,
  Database,
  FileQuestion,
  FileText,
} from "lucide-react"
import Link from "next/link"

import { ConfidenceMark, confidencePresentation } from "@/components/research/confidence-mark"
import { EvidenceModeToggle } from "@/components/research/evidence-mode"
import { Badge } from "@/components/ui/badge"
import {
  normalizedResearchQuestions,
  researchArchiveCoverage,
  researchMethodology,
  researchQuestionGroups,
} from "@/data/research"
import type {
  ResearchConclusion,
  ResearchConclusionKind,
  ResearchOverviewModel,
} from "@/lib/genealogy/research-overview"
import type { Confidence } from "@/types"

const navigation = [
  ["methodology", "Methodology"],
  ["coverage", "Coverage"],
  ["conclusions", "Conclusions"],
  ["open-questions", "Open questions"],
  ["source-inventory", "Sources"],
] as const

const kindLabels: Readonly<Record<ResearchConclusionKind, string>> = {
  person: "People",
  relationship: "Relationships",
  event: "Events",
  place: "Places",
}

const classificationLabels = {
  "potentially-answerable-online": "Potentially answerable online",
  "likely-requires-archival-local-records": "Likely requires archival or local records",
  "requires-family-knowledge": "Requires family knowledge",
  "blocked-by-inaccessible-records": "Blocked by inaccessible records",
  "genuinely-unknown": "Genuinely unknown at present",
} as const

function sentenceCase(value: string) {
  return value
    .split("-")
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() : word.charAt(0)) + word.slice(1))
    .join(" ")
}

function ConclusionList({ conclusions }: Readonly<{ conclusions: readonly ResearchConclusion[] }>) {
  return (
    <ul className="divide-y border-t">
      {conclusions.map((conclusion) => (
        <li key={conclusion.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
          <div>
            {conclusion.href ? (
              <Link href={conclusion.href} className="font-medium leading-6 hover:text-primary hover:underline">
                {conclusion.title}
              </Link>
            ) : (
              <p className="font-medium leading-6">{conclusion.title}</p>
            )}
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{conclusion.detail}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-mono text-[0.625rem] text-muted-foreground">
              {conclusion.sourceIds.length} {conclusion.sourceIds.length === 1 ? "source" : "sources"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ConclusionRegister({
  confidence,
  conclusions,
}: Readonly<{ confidence: Confidence; conclusions: readonly ResearchConclusion[] }>) {
  return (
    <section className="border-t py-8 sm:py-10">
      <div className="grid gap-5 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
        <div>
          <ConfidenceMark confidence={confidence} alwaysVisible />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {confidencePresentation[confidence].description}
          </p>
        </div>
        <div>
          <p className="text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground tabular-nums">{conclusions.length}</strong> accepted canonical {conclusions.length === 1 ? "claim" : "claims"}
          </p>
          <div className="mt-5 space-y-2">
            {(Object.keys(kindLabels) as ResearchConclusionKind[]).map((kind) => {
              const matching = conclusions.filter((conclusion) => conclusion.kind === kind)
              if (matching.length === 0) return null
              return (
                <details key={kind} className="group border-y bg-card px-4 open:pb-4">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 text-sm font-medium marker:hidden">
                    <ChevronRight aria-hidden="true" className="size-4 text-primary transition-transform motion-reduce:transition-none" />
                    <span>{kindLabels[kind]}</span>
                    <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">{matching.length}</span>
                  </summary>
                  <ConclusionList conclusions={matching} />
                </details>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ResearchOverview({ model }: Readonly<{ model: ResearchOverviewModel }>) {
  const { coverage } = model
  const coverageRows = [
    ["People", coverage.people],
    ["Relationships", coverage.relationships],
    ["Events", coverage.events],
    ["Places", coverage.places],
  ] as const

  return (
    <article>
      <header className="page-shell pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24">
        <div className="grid items-end gap-9 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div>
            <p className="editorial-label">Evidence trail</p>
            <h1 className="editorial-display mt-5">Research</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              See what the atlas establishes, what remains probable, and where the record still stops.
            </p>
          </div>
          <div className="border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
            <p className="text-sm leading-6 text-muted-foreground">
              Evidence Mode reveals verified confidence marks alongside the uncertainty that is always kept visible.
            </p>
            <EvidenceModeToggle className="mt-5" />
          </div>
        </div>
      </header>

      <nav aria-label="Research sections" className="border-y bg-card">
        <div className="page-shell flex flex-wrap gap-x-6 gap-y-1 py-3">
          {navigation.map(([id, label]) => (
            <Link key={id} href={`#${id}`} className="py-2 text-xs font-semibold text-muted-foreground hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <section id="methodology" className="page-shell scroll-mt-24 py-14 sm:py-18" aria-labelledby="methodology-heading">
        <div className="grid gap-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="editorial-label">01</p>
            <h2 id="methodology-heading" className="mt-3 text-xl font-[560]">Methodology</h2>
          </div>
          <div>
            <div className="grid border-t sm:grid-cols-2">
              {researchMethodology.map(({ title, description }, index) => (
                <div key={title} className={`border-b py-6 ${index % 2 === 0 ? "sm:pr-7" : "sm:border-l sm:pl-7"}`}>
                  <BookOpenText aria-hidden="true" className="size-4 text-primary" />
                  <h3 className="mt-4 font-[560]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              The complete human-readable method remains in <span className="font-mono">research/README.md</span>. This page uses only reviewed application data at runtime.
            </p>
          </div>
        </div>
      </section>

      <section id="coverage" className="scroll-mt-24 border-y bg-surface-subtle" aria-labelledby="coverage-heading">
        <div className="page-shell py-14 sm:py-18">
          <div className="grid gap-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="editorial-label">02</p>
              <h2 id="coverage-heading" className="mt-3 text-xl font-[560]">Research coverage</h2>
            </div>
            <div>
              <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {coverageRows.map(([label, counts]) => (
                  <div key={label} className="bg-background p-5">
                    <p className="editorial-label">{label}</p>
                    <p className="mt-3 text-3xl font-[560] tracking-[-0.04em] tabular-nums">{counts.total}</p>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      {counts.verified} verified · {counts.probable} probable{counts.unresolved ? ` · ${counts.unresolved} unresolved` : ""}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-7 border-t pt-7 sm:grid-cols-2">
                <div>
                  <p className="editorial-label">Accepted application graph</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {coverage.sources} normalized sources support the accepted direct-ancestor graph. {coverage.directlyInspectedSources} were directly inspected, {coverage.sourcesWithPublicUrls} retain public URLs, and {coverage.sourcesWithContradictions} preserve contradiction notes.
                  </p>
                </div>
                <div>
                  <p className="editorial-label">Human research archive</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    The A11 handoff records {researchArchiveCoverage.genealogicallyRelevantIdentities} genealogically relevant identities, {researchArchiveCoverage.proposedSources} proposed sources or source sets, {researchArchiveCoverage.representedPlaces} represented places, and {researchArchiveCoverage.movementEntries} movement entries.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{researchArchiveCoverage.archiveNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="conclusions" className="page-shell scroll-mt-24 py-14 sm:py-18" aria-labelledby="conclusions-heading">
        <div className="grid gap-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="editorial-label">03</p>
            <h2 id="conclusions-heading" className="mt-3 text-xl font-[560]">Conclusions</h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Every register below is generated from accepted canonical entities. A probable claim remains usable context, but never becomes verified through repetition or visual prominence.
            </p>
            <div className="mt-8">
              <ConclusionRegister confidence="verified" conclusions={model.conclusions.verified} />
              <ConclusionRegister confidence="probable" conclusions={model.conclusions.probable} />
            </div>
          </div>
        </div>
      </section>

      <section id="open-questions" className="scroll-mt-24 border-y bg-surface-subtle" aria-labelledby="questions-heading">
        <div className="page-shell py-14 sm:py-18">
          <div className="grid gap-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="editorial-label">04</p>
              <h2 id="questions-heading" className="mt-3 text-xl font-[560]">Unresolved questions</h2>
              <ConfidenceMark confidence="unresolved" alwaysVisible className="mt-5" />
            </div>
            <div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                These questions were deliberately normalized from the archive. They are not generated from empty branches or guessed missing relatives.
              </p>

              {model.conclusions.unresolved.length > 0 && (
                <details className="mt-7 border-y bg-card px-4 open:pb-4">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 text-sm font-medium marker:hidden">
                    <ChevronRight aria-hidden="true" className="size-4 text-primary transition-transform motion-reduce:transition-none" />
                    Canonical unresolved claims
                    <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">{model.conclusions.unresolved.length}</span>
                  </summary>
                  <ConclusionList conclusions={model.conclusions.unresolved} />
                </details>
              )}

              <div className="mt-8 space-y-10">
                {researchQuestionGroups.map((group) => {
                  const questions = normalizedResearchQuestions.filter((question) => question.group === group)
                  if (questions.length === 0) return null
                  return (
                    <section key={group} aria-labelledby={`question-group-${group.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}>
                      <h3 id={`question-group-${group.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`} className="editorial-label">{group}</h3>
                      <ul className="mt-4 divide-y border-t">
                        {questions.map((question) => (
                          <li key={question.id} className="py-5">
                            <div className="flex gap-3">
                              <FileQuestion aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                              <div>
                                <p className="font-medium leading-6">{question.question}</p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.nextEvidence}</p>
                                <p className="mt-2 text-[0.6875rem] font-medium text-muted-foreground">{classificationLabels[question.classification]}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="source-inventory" className="page-shell scroll-mt-24 py-14 sm:py-18" aria-labelledby="sources-heading">
        <div className="grid gap-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="editorial-label">05</p>
            <h2 id="sources-heading" className="mt-3 text-xl font-[560]">Source inventory</h2>
          </div>
          <div>
            <div className="flex gap-3 border-l-2 border-primary/30 pl-4 text-sm leading-6 text-muted-foreground">
              <Database aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
              <p>These {coverage.sources} records are the accepted normalized subset of the larger research inventory. Open a record for retrieval details, citation handles, reliability notes, and explicit graph references.</p>
            </div>
            <div className="mt-8 space-y-2">
              {model.sourceGroups.map((group) => (
                <details key={group.category} className="border-y bg-card px-4 open:pb-4">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 text-sm font-medium marker:hidden">
                    <ChevronRight aria-hidden="true" className="size-4 text-primary transition-transform motion-reduce:transition-none" />
                    {group.label}
                    <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">{group.sources.length}</span>
                  </summary>
                  <ul className="divide-y border-t">
                    {group.sources.map((source) => (
                      <li key={source.id} className="py-4">
                        <Link href={`/sources/${source.id}`} className="group flex items-start gap-3">
                          <FileText aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-6 group-hover:text-primary group-hover:underline">{source.title}</span>
                            <span className="mt-1 block break-all font-mono text-[0.625rem] leading-5 text-muted-foreground">{source.id}</span>
                            <span className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline">{sentenceCase(source.evidenceClass)}</Badge>
                              <Badge variant="neutral">{sentenceCase(source.inspectionStatus)}</Badge>
                              {source.contradictionNotes && source.contradictionNotes.length > 0 && <Badge variant="unresolved">○ Contradictions retained</Badge>}
                            </span>
                          </span>
                          <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-surface-subtle">
        <div className="page-shell flex gap-3 py-9 text-xs leading-5 text-muted-foreground">
          <Archive aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="max-w-2xl">
            <span className="font-medium text-foreground">research/</span> remains the human-readable evidence trail. The interface above is a reviewed projection from typed application data and does not scrape the archive.
          </p>
        </div>
      </footer>
    </article>
  )
}
