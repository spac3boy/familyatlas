import type { ReactNode } from "react"
import type { StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

const sizeStyles = {
  home: {
    section: "min-h-[34rem] sm:min-h-[38rem] lg:min-h-[42rem]",
    shell: "min-h-[34rem] py-12 sm:min-h-[38rem] sm:py-16 lg:min-h-[42rem] lg:py-20",
    description: "text-xl leading-8 sm:text-2xl sm:leading-9",
  },
  page: {
    section: "min-h-[24rem] sm:min-h-[28rem] lg:min-h-[32rem]",
    shell: "min-h-[24rem] py-12 sm:min-h-[28rem] sm:py-16 lg:min-h-[32rem] lg:py-18",
    description: "text-lg leading-8 sm:text-xl",
  },
} as const

interface EditorialHeroProps {
  readonly image: StaticImageData
  readonly eyebrow: string
  readonly title: string
  readonly description?: string
  readonly aside: ReactNode
  readonly size?: keyof typeof sizeStyles
  readonly imagePosition?: string
  readonly overlayClassName?: string
}

export function EditorialHero({
  image,
  eyebrow,
  title,
  description,
  aside,
  size = "page",
  imagePosition = "center",
  overlayClassName,
}: EditorialHeroProps) {
  const styles = sizeStyles[size]

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b bg-cover bg-scroll md:bg-fixed motion-reduce:bg-scroll",
        styles.section,
      )}
      style={{ backgroundImage: `url("${image.src}")`, backgroundPosition: imagePosition }}
    >
      <div
        aria-hidden="true"
        className={cn("absolute inset-0 bg-primary/65", overlayClassName)}
      />

      <div className={cn("page-shell relative z-10 flex items-end", styles.shell)}>
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:gap-20">
          <div>
            <p className="editorial-label mb-6 text-primary-foreground/80">{eyebrow}</p>
            <h1 className="editorial-display max-w-4xl text-primary-foreground">{title}</h1>
            {description && (
              <p
                className={cn(
                  "mt-7 max-w-2xl text-primary-foreground/90",
                  styles.description,
                )}
              >
                {description}
              </p>
            )}
          </div>

          <div className="border-t border-primary-foreground/35 pt-6 text-primary-foreground/85 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            {aside}
          </div>
        </div>
      </div>
    </section>
  )
}
