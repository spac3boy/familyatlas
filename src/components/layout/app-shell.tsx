import type * as React from "react"

import { SiteHeader } from "@/components/layout/site-header"
import { familySearchIndex } from "@/data"
import { ExploreStateProvider } from "@/state"

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ExploreStateProvider>
      <div className="min-h-svh">
        <a
          href="#main-content"
          className="fixed top-3 left-3 z-[70] -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0 motion-reduce:transition-none"
        >
          Skip to content
        </a>
        <SiteHeader searchIndex={familySearchIndex} />
        <main id="main-content" tabIndex={-1} className="min-h-[calc(100svh-4rem)]">
          {children}
        </main>
      </div>
    </ExploreStateProvider>
  )
}
