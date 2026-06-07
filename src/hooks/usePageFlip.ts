import { useCallback, useMemo, useState } from 'react'

export function usePageFlip(totalPages: number) {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0)

  const canGoPrevious = useMemo(() => currentSpreadIndex > 0, [currentSpreadIndex])
  const canGoNext = useMemo(() => currentSpreadIndex < totalPages - 1, [currentSpreadIndex, totalPages])

  const goPrevious = useCallback(() => {
    setCurrentSpreadIndex((index) => Math.max(0, index - 1))
  }, [])

  const goNext = useCallback(() => {
    setCurrentSpreadIndex((index) => Math.min(totalPages - 1, index + 1))
  }, [totalPages])

  return {
    currentSpreadIndex,
    canGoPrevious,
    canGoNext,
    goPrevious,
    goNext,
  }
}
