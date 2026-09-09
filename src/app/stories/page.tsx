import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpenText } from "lucide-react"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Stories",
  description: "Family Atlas stories will be published only from reviewed, supported research.",
}

export default function StoriesPage() {
  return (
    <div className="page-shell py-16 sm:py-20 lg:py-24">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="editorial-label">Narrative collection</p>
          <h1 className="editorial-display mt-5">Stories</h1>
        </div>
        <p className="border-t pt-5 text-sm leading-6 text-muted-foreground lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
          Family narratives will appear here only after the supporting research has been reviewed
          for evidence, uncertainty, and privacy.
        </p>
      </div>

      <section
        className="mt-14 border-y py-12 sm:mt-16 sm:py-16"
        aria-labelledby="stories-empty-heading"
      >
        <BookOpenText aria-hidden="true" className="size-5 text-primary" />
        <h2 id="stories-empty-heading" className="mt-5 text-2xl font-[560] tracking-[-0.03em]">
          No standalone stories are published yet.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          The family graph, profiles, places, and research evidence remain available while this
          narrative layer is intentionally unfinished. Nothing is generated merely to fill the page.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/#family-explore" className={cn(buttonVariants(), "gap-2")}>
            Explore the family
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/research" className={buttonVariants({ variant: "outline" })}>
            Review the research
          </Link>
        </div>
      </section>
    </div>
  )
}
