"use client"

import * as React from "react"
import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Drawer = DrawerPrimitive.Root
const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerClose = DrawerPrimitive.Close
const DrawerTitle = DrawerPrimitive.Title
const DrawerDescription = DrawerPrimitive.Description

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-foreground/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-md border border-b-0 bg-card text-card-foreground shadow-sm transition-transform duration-200 outline-none data-ending-style:translate-y-full data-starting-style:translate-y-full motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        {children}
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Portal>
  )
}

function DrawerCloseButton({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      aria-label="Close panel"
      data-slot="drawer-close"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
        className,
      )}
      {...props}
    >
      <X aria-hidden="true" className="size-4" />
    </DrawerPrimitive.Close>
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
}
