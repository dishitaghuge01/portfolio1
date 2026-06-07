import { useMemo } from 'react'
import type { ComponentType } from 'react'
import { usePageFlip } from '../../hooks/usePageFlip'
import { useTheme } from '../../hooks/useTheme'
import { bookSpreads } from '../../data/bookContent'
import { SpreadOne } from '../spreads/SpreadOne'
import { SpreadTwo } from '../spreads/SpreadTwo'
import { GlassPanel } from '../ui/GlassPanel'
import type { BookSpreadProps } from '../../types/book'
import '../../styles/glass.css'

const spreadComponents = [SpreadOne, SpreadTwo]

export function BookEngine() {
  const { theme, toggleTheme } = useTheme()
  const { currentSpreadIndex, canGoNext, canGoPrevious, goNext, goPrevious } = usePageFlip(bookSpreads.length)

  const SpreadComponent = useMemo(
    () => spreadComponents[currentSpreadIndex] as ComponentType<BookSpreadProps>,
    [currentSpreadIndex],
  )

  return (
    <main className={`book-engine theme-${theme}`}>
      <GlassPanel className="book-shell">
        <div className="book-header">
          <h1>Portfolio Book</h1>
          <button className="glass-button" type="button" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
        </div>

        <SpreadComponent spread={bookSpreads[currentSpreadIndex]} />

        <div className="book-navigation">
          <button className="glass-button" type="button" onClick={goPrevious} disabled={!canGoPrevious}>
            Previous
          </button>
          <span>
            Spread {currentSpreadIndex + 1} / {bookSpreads.length}
          </span>
          <button className="glass-button" type="button" onClick={goNext} disabled={!canGoNext}>
            Next
          </button>
        </div>
      </GlassPanel>
    </main>
  )
}
