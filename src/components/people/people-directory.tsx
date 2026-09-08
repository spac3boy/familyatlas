"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, RotateCcw } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  buildPeopleDirectoryOptions,
  filterPeopleDirectory,
  formatRecordedSurnameLabel,
  type PeopleDirectoryFilters,
  type PeopleDirectoryRecord,
} from "@/lib/genealogy/people-directory"
import type { BranchClassification } from "@/lib/genealogy/queries"
import type { Confidence, PlaceId } from "@/types"

const initialFilters: PeopleDirectoryFilters = {
  branch: "all",
  surname: "",
  generation: null,
  birthplace: null,
  confidence: "all",
}

function branchLabel(branch: BranchClassification): string | undefined {
  if (branch === "maternal") return "Maternal"
  if (branch === "paternal") return "Paternal"
  if (branch === "both") return "Maternal and paternal"
  if (branch === "self") return "Reference person"
  return undefined
}

function confidenceSummary(states: readonly Confidence[]): string | undefined {
  if (states.length === 1 && states[0] === "verified") return undefined
  return states.join(" / ")
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: Readonly<{
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}>) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="editorial-label block">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full min-w-0 rounded-sm border bg-card px-3 text-sm text-foreground shadow-none outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
      >
        {children}
      </select>
    </label>
  )
}

export function PeopleDirectory({ records }: Readonly<{ records: readonly PeopleDirectoryRecord[] }>) {
  const searchParams = useSearchParams()
  const [localFilters, setFilters] = React.useState<PeopleDirectoryFilters>(initialFilters)
  const options = React.useMemo(() => buildPeopleDirectoryOptions(records), [records])
  const requestedSurname = searchParams.get("surname") ?? ""
  const surname = options.surnames.some(({ value }) => value === requestedSurname)
    ? requestedSurname
    : ""
  const filters = React.useMemo(
    () => ({ ...localFilters, surname }),
    [localFilters, surname],
  )

  const setSurname = (surname: string) => {
    const url = new URL(window.location.href)
    if (surname) url.searchParams.set("surname", surname)
    else url.searchParams.delete("surname")
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    const url = new URL(window.location.href)
    url.searchParams.delete("surname")
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }
  const filteredRecords = React.useMemo(
    () => filterPeopleDirectory(records, filters),
    [filters, records],
  )
  const activeFilterCount = [
    filters.branch !== "all",
    Boolean(filters.surname),
    filters.generation !== null,
    filters.birthplace !== null,
    filters.confidence !== "all",
  ].filter(Boolean).length

  return (
    <>
      <section aria-labelledby="people-filters-heading" className="mt-14 border-y bg-surface-subtle py-5 sm:mt-18 sm:py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="people-filters-heading" className="text-sm font-semibold">Filter the directory</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Surnames are recorded name forms; birthplace requires an explicit birth-event location.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={activeFilterCount === 0}
            onClick={clearFilters}
          >
            <RotateCcw aria-hidden="true" />
            Clear filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            id="people-branch-filter"
            label="Branch"
            value={filters.branch}
            onChange={(branch) => setFilters((current) => ({
              ...current,
              branch: branch as PeopleDirectoryFilters["branch"],
            }))}
          >
            <option value="all">All branches</option>
            <option value="maternal">Maternal</option>
            <option value="paternal">Paternal</option>
          </FilterSelect>

          <FilterSelect
            id="people-surname-filter"
            label="Surname"
            value={filters.surname}
            onChange={setSurname}
          >
            <option value="">All recorded surnames</option>
            {options.surnames.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            id="people-generation-filter"
            label="Generation"
            value={filters.generation?.toString() ?? ""}
            onChange={(generation) => setFilters((current) => ({
              ...current,
              generation: generation ? Number(generation) : null,
            }))}
          >
            <option value="">All generations</option>
            {options.generations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            id="people-birthplace-filter"
            label="Birthplace"
            value={filters.birthplace ?? ""}
            onChange={(birthplace) => setFilters((current) => ({
              ...current,
              birthplace: birthplace ? birthplace as PlaceId : null,
            }))}
          >
            <option value="">All documented birthplaces</option>
            {options.birthplaces.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            id="people-confidence-filter"
            label="Person confidence"
            value={filters.confidence}
            onChange={(confidence) => setFilters((current) => ({
              ...current,
              confidence: confidence as PeopleDirectoryFilters["confidence"],
            }))}
          >
            <option value="all">All confidence states</option>
            {options.confidences.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </FilterSelect>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-b py-4 text-xs text-muted-foreground" aria-live="polite">
        <p>
          <span className="font-semibold text-foreground tabular-nums">{filteredRecords.length}</span>
          {` ${filteredRecords.length === 1 ? "person" : "people"}`}
        </p>
        <p className="hidden sm:block">Generation counts parent-child steps from Michael.</p>
      </div>

      {filteredRecords.length > 0 ? (
        <ul>
          {filteredRecords.map((record) => {
            const branch = branchLabel(record.branch)
            const matchedSurname = filters.surname
              ? record.surnames.find(({ value }) => value === filters.surname)
              : undefined
            const surnameConfidence = matchedSurname
              ? confidenceSummary(matchedSurname.confidenceStates)
              : undefined
            return (
              <li key={record.person.id} className="border-b">
                <Link
                  href={`/people/${record.person.id}`}
                  className="group grid gap-3 py-5 transition-colors hover:bg-accent sm:px-3 lg:grid-cols-[minmax(13rem,1.15fr)_minmax(11rem,0.9fr)_minmax(11rem,1fr)_auto] lg:items-center lg:gap-6"
                >
                  <span className="min-w-0">
                    <span className="block font-[560] group-hover:text-primary">
                      {record.person.canonicalName}
                    </span>
                    {record.lifespan && (
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground tabular-nums">
                        {record.lifespan}
                      </span>
                    )}
                    {matchedSurname && (
                      <span className="mt-1 block text-[0.6875rem] leading-5 text-muted-foreground">
                        Recorded surname form: {formatRecordedSurnameLabel(matchedSurname)}
                        {surnameConfidence ? ` · name evidence: ${surnameConfidence}` : ""}
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 text-xs leading-5 text-muted-foreground">
                    <span className="block text-foreground">{record.relationshipLabel}</span>
                    <span className="mt-1 block">
                      Generation {record.generation}{branch ? ` · ${branch}` : ""}
                    </span>
                  </span>

                  {record.birthplaces.length > 0 ? (
                    <span className="min-w-0 text-xs leading-5 text-muted-foreground">
                      <span className="editorial-label mb-1 block lg:sr-only">Birthplace evidence</span>
                      {record.birthplaces.map((birthplace) => {
                        const confidence = confidenceSummary(birthplace.confidenceStates)
                        return (
                          <span key={birthplace.placeId} className="block">
                            <span className="text-foreground">{birthplace.label}</span>
                            {confidence ? ` · location evidence: ${confidence}` : ""}
                          </span>
                        )
                      })}
                    </span>
                  ) : (
                    <span className="hidden lg:block" aria-hidden="true" />
                  )}

                  <span className="flex items-center justify-between gap-3 lg:justify-end">
                    <Badge variant={record.person.confidence}>{record.person.confidence}</Badge>
                    <ArrowRight aria-hidden="true" className="size-4 text-primary" />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="border-b py-12 text-center">
          <p className="text-sm font-medium">No people match these supported fields.</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Clear one or more filters to return to the full accepted directory.
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-5" onClick={() => setFilters(initialFilters)}>
            <RotateCcw aria-hidden="true" />
            Clear filters
          </Button>
        </div>
      )}
    </>
  )
}
