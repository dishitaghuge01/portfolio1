import React, { useEffect, useRef } from 'react';
import { useBook } from '../../contexts/BookContext';
import { spreadsMeta } from '../../data/spreads';
import BookPage from './BookPage';
import BookSpine from './BookSpine';
import SpreadCounter from './SpreadCounter';
import Spread1Left from '../spreads/Spread1Left';
import Spread1Right from '../spreads/Spread1Right';
import { Spread2Left, Spread2Right } from '../spreads/Spread2';
import ProjectPage from '../spreads/ProjectPage';
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

  // Track how many times spread 1 has been entered — passed as animationKey
  // so Spread1Left re-runs its intro animation on each return visit.
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

  const leftDisabled  = currentSpread === 1            || isFlipping;
  const rightDisabled = currentSpread === totalSpreads || isFlipping;

  return (
    <div className={styles.scene}>
      <div className={styles.wrapper}>
        {/* Physical book */}
        <div className={styles.book}>
          {/* Left page */}
          <BookPage
            side="left"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            {currentSpread === 1 ? (
              <Spread1Left animationKey={spread1VisitCount.current} />
            ) : currentSpread === 2 ? (
              <Spread2Left />
            ) : currentSpread === 3 ? (
              <ProjectPage projectIndex={0} />
            ) : currentSpread === 4 ? (
              <ProjectPage projectIndex={2} />
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
            side="right"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            {currentSpread === 1 ? (
              <Spread1Right />
            ) : currentSpread === 2 ? (
              <Spread2Right />
            ) : currentSpread === 3 ? (
              <ProjectPage projectIndex={1} />
            ) : currentSpread === 4 ? (
              <ProjectPage projectIndex={3} />
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