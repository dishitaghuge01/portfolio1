import React, { useEffect } from 'react';
import { useBook } from '../../contexts/BookContext';
import { spreadsMeta } from '../../data/spreads';
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
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>{spreadIcon}</span>
              <span className={styles.placeholderLabel}>
                Spread {currentSpread} · Left
              </span>
            </div>
          </BookPage>

          {/* Right page */}
          <BookPage
            side="right"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>{spreadIcon}</span>
              <span className={styles.placeholderLabel}>
                Spread {currentSpread} · Right
              </span>
            </div>
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