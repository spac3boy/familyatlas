"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetTitle = SheetPrimitive.Title
const SheetDescription = SheetPrimitive.Description

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Popup>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-foreground/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(22rem,calc(100%-1rem))] flex-col border-l bg-card text-card-foreground shadow-sm transition-transform duration-200 outline-none data-ending-style:translate-x-full data-starting-style:translate-x-full motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  )
}

function SheetCloseButton({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return (
    <SheetPrimitive.Close
      aria-label="Close navigation"
      data-slot="sheet-close"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
        className,
      )}
      {...props}
    >
      <X aria-hidden="true" className="size-4" />
    </SheetPrimitive.Close>
  )
}

export {
  Sheet,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
}
