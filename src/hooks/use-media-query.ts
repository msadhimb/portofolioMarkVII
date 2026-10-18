"use client"

import * as React from "react"

/**
 * Baca media query dengan `useSyncExternalStore` — tanpa `setState` di dalam
 * effect (memicu cascading render). Aman untuk SSR: default `false` sampai
 * snapshot client terbaca.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query]
  )

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** True untuk perangkat sentuh (tanpa hover) — iPhone, iPad, dst. */
export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)")
}

/** True ketika pengguna meminta reduced motion di level OS. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/**
 * "Mobile" untuk keperluan komposisi motion: layar sempit ATAU perangkat
 * sentuh (landscape iPhone ~844–932px dan tablet lolos dari cek lebar saja).
 */
export function useIsMobileViewport(): boolean {
  const narrow = useMediaQuery("(max-width: 768px)")
  const coarse = useIsCoarsePointer()
  return narrow || coarse
}
