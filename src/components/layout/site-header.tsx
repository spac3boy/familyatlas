"use client"

import * as React from "react"
import { Library, Menu, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { GlobalSearch } from "@/components/layout/global-search"
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { GlobalSearchEntry } from "@/lib/genealogy/global-search"

const navigation = [
  { label: "Explore", href: "/" },
  { label: "People", href: "/people" },
  { label: "Places", href: "/places" },
  { label: "Stories", href: "/stories" },
  { label: "Research", href: "/research" },
] as const

function isCurrentPath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

function Brand() {
  return (
    <Link
      href="/"
      aria-label="Family Atlas home"
      className="inline-flex shrink-0 items-center gap-2.5 rounded-sm text-sm font-semibold tracking-[-0.01em]"
    >
      <Library aria-hidden="true" className="size-4 text-primary" strokeWidth={1.75} />
      <span>Family Atlas</span>
    </Link>
  )
}

function SearchAffordance({
  compact = false,
  onClick,
}: {
  readonly compact?: boolean
  readonly onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant={compact ? "ghost" : "outline"}
      size={compact ? "icon" : "sm"}
      onClick={onClick}
      aria-label="Search Family Atlas"
      title="Search Family Atlas (Command or Control K)"
      className={cn(!compact && "gap-2.5 text-muted-foreground")}
    >
      <Search aria-hidden="true" />
      {!compact && (
        <>
          <span>Search</span>
          <span className="border-l pl-2 text-[0.625rem] font-semibold tracking-[0.08em] uppercase opacity-75">
            ⌘ K
          </span>
        </>
      )}
    </Button>
  )
}

export function SiteHeader({
  searchIndex,
}: Readonly<{ searchIndex: readonly GlobalSearchEntry[] }>) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="page-shell flex h-16 items-center gap-5">
        <Brand />

        <nav aria-label="Primary navigation" className="ml-auto hidden items-stretch self-stretch lg:flex">
          {navigation.map((item) => {
            const current = isCurrentPath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  "after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-primary after:opacity-0",
                  current && "text-foreground after:opacity-100",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto hidden lg:block">
          <SearchAffordance onClick={() => setSearchOpen(true)} />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <SearchAffordance compact onClick={() => setSearchOpen(true)} />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent>
              <div className="flex h-16 items-center justify-between border-b px-5">
                <SheetTitle className="flex items-center gap-2.5 text-sm font-semibold">
                  <Library aria-hidden="true" className="size-4 text-primary" strokeWidth={1.75} />
                  Navigation
                </SheetTitle>
                <SheetCloseButton />
              </div>
              <SheetDescription className="sr-only">
                Primary navigation for Family Atlas
              </SheetDescription>

              <nav aria-label="Mobile navigation" className="flex flex-1 flex-col px-3 py-5">
                {navigation.map((item, index) => {
                  const current = isCurrentPath(pathname, item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-md px-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                        current && "bg-accent text-accent-foreground",
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              <div className="border-t p-5">
                <Button
                  type="button"
                  variant="outline"
                  aria-label="Search Family Atlas"
                  onClick={() => {
                    setMobileOpen(false)
                    setSearchOpen(true)
                  }}
                  className="w-full justify-start text-muted-foreground"
                >
                  <Search aria-hidden="true" />
                  Search the atlas
                  <span className="ml-auto text-[0.625rem] font-semibold tracking-[0.08em] uppercase">
                    ⌘ K
                  </span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <GlobalSearch index={searchIndex} open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
