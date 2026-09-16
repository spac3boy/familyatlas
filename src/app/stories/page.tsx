import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpenText } from "lucide-react"

import heroNorwayCoast from "@/assets/family-atlas-hero-norway-coast.jpg"
import { EditorialHero } from "@/components/layout/editorial-hero"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Stories",
  description: "Family stories being gathered from reviewed records and family recollections.",
}

export default function StoriesPage() {
  return (
    <>
      <EditorialHero
        image={heroNorwayCoast}
        imagePosition="center 54%"
        eyebrow="Narrative collection"
        title="Stories"
        aside={
          <p className="max-w-sm text-sm leading-6">
            We&apos;re bringing records, places, and family recollections together into stories worth
            passing on.
          </p>
        }
      />

      <div className="page-shell pb-16 sm:pb-20 lg:pb-24">
        <section
          className="mt-14 border-y py-12 sm:mt-16 sm:py-16"
          aria-labelledby="stories-empty-heading"
        >
          <BookOpenText aria-hidden="true" className="size-5 text-primary" />
          <h2 id="stories-empty-heading" className="mt-5 text-2xl font-[560] tracking-[-0.03em]">
            Our stories are still coming together.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Profiles, places, and records are already here to explore. As we verify more details—and
            hear more family memories—we&apos;ll turn them into fuller stories.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/people" className={cn(buttonVariants(), "gap-2")}>
              Explore family profiles
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/research" className={buttonVariants({ variant: "outline" })}>
              See what we&apos;re still learning
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
