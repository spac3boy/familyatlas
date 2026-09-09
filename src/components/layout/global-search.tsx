"use client"

import * as React from "react"
import {
  ArrowRight,
  FileText,
  MapPin,
  Tags,
  UserRound,
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  searchGlobalIndex,
  type GlobalSearchEntry,
  type GlobalSearchKind,
} from "@/lib/genealogy/global-search"

const groupLabels: Readonly<Record<GlobalSearchKind, string>> = {
  person: "People",
  place: "Places",
  surname: "Surnames",
  source: "Sources",
}

const groupIcons = {
  person: UserRound,
  place: MapPin,
  surname: Tags,
  source: FileText,
} as const

export function GlobalSearch({
  index,
  open,
  onOpenChange,
  finalFocus,
}: Readonly<{
  index: readonly GlobalSearchEntry[]
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: () => HTMLElement | null
}>) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const results = React.useMemo(() => searchGlobalIndex(index, query), [index, query])
  const grouped = React.useMemo(
    () => (["person", "place", "surname", "source"] as const)
      .map((kind) => ({ kind, entries: results.filter((entry) => entry.kind === kind) }))
      .filter(({ entries }) => entries.length > 0),
    [results],
  )

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase("en-US") !== "k" || (!event.metaKey && !event.ctrlKey)) return
      event.preventDefault()
      onOpenChange(!open)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onOpenChange, open])

  const setDialogOpen = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) setQuery("")
  }

  const navigate = (entry: GlobalSearchEntry) => {
    setDialogOpen(false)
    router.push(entry.href)
  }

  return (
    <Dialog open={open} onOpenChange={setDialogOpen}>
      <DialogContent
        showCloseButton={false}
        finalFocus={finalFocus}
        className="overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search Family Atlas</DialogTitle>
        <DialogDescription className="sr-only">
          Search canonical people, places, recorded surnames, and source records.
        </DialogDescription>
        <Command label="Search Family Atlas" shouldFilter={false} loop>
          <CommandInput
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search people, places, surnames, sources…"
            aria-label="Search Family Atlas"
          />
          <CommandList aria-label="Search results">
            {!query.trim() ? (
              <div className="px-4 py-12 text-center text-sm leading-6 text-muted-foreground">
                Start typing a person, place, recorded surname, source title, repository, or stable ID.
              </div>
            ) : grouped.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No canonical records found for “{query.trim()}”.
              </div>
            ) : (
              grouped.map(({ kind, entries }) => (
                <CommandGroup key={kind} heading={groupLabels[kind]}>
                  {entries.map((entry) => {
                    const Icon = groupIcons[entry.kind]
                    return (
                      <CommandItem
                        key={entry.id}
                        value={entry.id}
                        onSelect={() => navigate(entry)}
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{entry.title}</span>
                          <span className="mt-0.5 block truncate text-[0.6875rem] text-muted-foreground">
                            {entry.description}
                          </span>
                        </span>
                        <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))
            )}
          </CommandList>
          <div className="flex items-center justify-between border-t px-4 py-2 text-[0.625rem] text-muted-foreground">
            <span>↑↓ Select · Enter Open</span>
            <span>Esc Close</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
