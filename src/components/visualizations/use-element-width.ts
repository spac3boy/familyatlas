"use client"

import * as React from "react"

/**
 * Observe a visualization container without turning sub-pixel ResizeObserver
 * noise into repeated layout work. Measurements are rounded and coalesced to
 * one React update per animation frame.
 */
export function useElementWidth<T extends HTMLElement>(initialWidth: number) {
  const ref = React.useRef<T>(null)
  const frameRef = React.useRef<number | null>(null)
  const [width, setWidth] = React.useState(initialWidth)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        const nextWidth = Math.max(1, Math.round(element.getBoundingClientRect().width))
        setWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth))
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      observer.disconnect()
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [])

  return [ref, width] as const
}
