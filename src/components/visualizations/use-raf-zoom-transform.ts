"use client"

import * as React from "react"
import { zoomIdentity, type ZoomTransform } from "d3-zoom"

/**
 * Keep D3 gesture sampling separate from React rendering. The latest transform
 * is committed at most once per animation frame, while React remains the owner
 * of the transform applied to rendered SVG.
 */
export function useRafZoomTransform(initialTransform: ZoomTransform = zoomIdentity) {
  const [transform, setTransform] = React.useState(initialTransform)
  const pendingTransformRef = React.useRef(initialTransform)
  const frameRef = React.useRef<number | null>(null)

  const scheduleTransform = React.useCallback((nextTransform: ZoomTransform) => {
    pendingTransformRef.current = nextTransform
    if (frameRef.current !== null) return

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      const next = pendingTransformRef.current
      setTransform((current) =>
        current.x === next.x && current.y === next.y && current.k === next.k ? current : next,
      )
    })
  }, [])

  React.useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    },
    [],
  )

  return [transform, scheduleTransform] as const
}
