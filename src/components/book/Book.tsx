import React, { useEffect, useRef } from 'react';
import { useBook } from '../../contexts/BookContext';
import { spreadsMeta } from '../../data/spreads';
import { spreadRegistry } from '../../registry/spreadRegistry';
import BookPage from './BookPage';
import BookSpine from './BookSpine';
import SpreadCounter from './SpreadCounter';
import styles from './Book.module.css';

const Book: React.FC = () => {
  const {
    currentSpread,
    totalSpreads,
    nextSpread,
    prevSpread,
    isFlipping,
    flipDirection,
  } = useBook();

  // Track how many times spread 1 is entered.
  // Instead of passing animationKey as a prop (registry components are zero-prop),
  // we pass it as the React `key` on the left BookPage — forcing a full remount
  // of its children (including Spread1LeftWrapper) on each return visit, which
  // re-triggers the animation useEffect naturally.
  const spread1VisitCount = useRef(0);
  const prevSpreadRef     = useRef<number | null>(null);

  useEffect(() => {
    if (currentSpread === 1 && prevSpreadRef.current !== 1) {
      spread1VisitCount.current += 1;
    }
    prevSpreadRef.current = currentSpread;
  }, [currentSpread]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSpread();
      if (e.key === 'ArrowLeft') prevSpread();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSpread, prevSpread]);

  const spreadIcon = spreadsMeta[currentSpread - 1]?.icon ?? '📄';

  const leftDisabled  = currentSpread === 1           || isFlipping;
  const rightDisabled = currentSpread === totalSpreads || isFlipping;

  // Look up registered components for the current spread
  const entry          = spreadRegistry[currentSpread];
  const LeftComponent  = entry?.left  ?? null;
  const RightComponent = entry?.right ?? null;

  return (
    <div className={styles.scene}>
      <div className={styles.wrapper}>
        {/* Physical book */}
        <div className={styles.book}>

          {/* Left page — keyed so spread 1 remounts on each visit */}
          <BookPage
            key={
              currentSpread === 1
                ? `spread1-${spread1VisitCount.current}`
                : `spread-${currentSpread}-left`
            }
            side="left"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            {LeftComponent ? (
              <LeftComponent />
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>{spreadIcon}</span>
                <span className={styles.placeholderLabel}>
                  Spread {currentSpread} · Left
                </span>
              </div>
            )}
          </BookPage>

          {/* Right page */}
          <BookPage
            key={`spread-${currentSpread}-right`}
            side="right"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            {RightComponent ? (
              <RightComponent />
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>{spreadIcon}</span>
                <span className={styles.placeholderLabel}>
                  Spread {currentSpread} · Right
                </span>
              </div>
            )}
          </BookPage>

          {/* Decorative spine divider */}
          <BookSpine />

          {/* Click zones — absolutely positioned over the book, z-index: 30 */}
          <div
            className={[
              styles.clickZone,
              styles.clickZoneLeft,
              leftDisabled ? styles.zoneDisabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={leftDisabled ? undefined : prevSpread}
            role="button"
            aria-label="Previous spread"
            tabIndex={leftDisabled ? -1 : 0}
            onKeyDown={
              leftDisabled
                ? undefined
                : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      prevSpread();
                    }
                  }
            }
          />
          <div
            className={[
              styles.clickZone,
              styles.clickZoneRight,
              rightDisabled ? styles.zoneDisabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={rightDisabled ? undefined : nextSpread}
            role="button"
            aria-label="Next spread"
            tabIndex={rightDisabled ? -1 : 0}
            onKeyDown={
              rightDisabled
                ? undefined
                : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      nextSpread();
                    }
                  }
            }
          />
        </div>
      </div>

      {/* Page counter below the book */}
      <SpreadCounter current={currentSpread} total={totalSpreads} />
    </div>
  );
};

export default Book;