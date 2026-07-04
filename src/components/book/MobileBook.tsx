import React, { useEffect, useRef, useState } from 'react';
import { useBook } from '../../contexts/BookContext';
import { spreadsMeta } from '../../data/spreads';
import { spreadRegistry } from '../../registry/spreadRegistry';
import BookPage from './BookPage';
import SpreadCounter from './SpreadCounter';
import styles from './MobileBook.module.css';

const WHEEL_COOLDOWN_MS = 800;
const MIDPOINT_MS = 300;
const SWIPE_THRESHOLD_PX = 50;

type PageComponent = React.ComponentType | null;

// Resolves which component (if any) renders at a given 1-indexed page number.
// Page 1 = spread 1 left, page 2 = spread 1 right, page 3 = spread 2 left, etc.
const getPageComponent = (totalPages: number, page: number): PageComponent => {
  if (page < 1 || page > totalPages) return null;
  const spreadIndex = Math.ceil(page / 2);
  const side: 'left' | 'right' = page % 2 === 1 ? 'left' : 'right';
  const entry = spreadRegistry[spreadIndex];
  if (!entry) return null;
  return (side === 'left' ? entry.left : entry.right) ?? null;
};

const MobileBook: React.FC = () => {
  const {
    currentPage,
    targetPage,
    totalPages,
    currentPageSide,
    nextPage,
    prevPage,
    isFlipping,
    flipDirection,
  } = useBook();

  // Keyboard navigation (also useful when testing at narrow desktop widths)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  const pageRef = useRef<HTMLDivElement>(null);
  const isWheelCoolingRef = useRef(false);

  // Two-finger trackpad swipe — relevant when testing in a narrow browser window
  useEffect(() => {
    const pageDiv = pageRef.current;
    if (!pageDiv) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaX) < 30) return;
      if (isWheelCoolingRef.current) return;

      e.preventDefault();

      isWheelCoolingRef.current = true;
      if (e.deltaX > 0) nextPage();
      else prevPage();

      setTimeout(() => {
        isWheelCoolingRef.current = false;
      }, WHEEL_COOLDOWN_MS);
    };

    pageDiv.addEventListener('wheel', handleWheel, { passive: false });
    return () => pageDiv.removeEventListener('wheel', handleWheel);
  }, [nextPage, prevPage]);

  // Touch swipe — the primary navigation gesture on real mobile devices
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const pageDiv = pageRef.current;
    if (!pageDiv) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const startX = touchStartXRef.current;
      touchStartXRef.current = null;
      if (startX === null) return;

      const endX = e.changedTouches[0]?.clientX ?? startX;
      const deltaX = endX - startX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

      // Swipe left (finger moves right→left) = advance, like turning a page forward
      if (deltaX < 0) nextPage();
      else prevPage();
    };

    pageDiv.addEventListener('touchstart', handleTouchStart, { passive: true });
    pageDiv.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      pageDiv.removeEventListener('touchstart', handleTouchStart);
      pageDiv.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextPage, prevPage]);

  const prevDisabled = currentPage === 1          || isFlipping;
  const nextDisabled = currentPage === totalPages || isFlipping;

  // ── Single-slot content model, swapped at the 300ms midpoint ─────────────────
  // Mirrors Book.tsx's two-slot approach, but there's only one visible page here.
  const [displayedContent, setDisplayedContent] = useState<PageComponent>(null);
  const [displayedPage, setDisplayedPage] = useState(currentPage);
  const midpointTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle: always reflect currentPage's own content directly.
  useEffect(() => {
    if (isFlipping) return;

    setDisplayedContent(() => getPageComponent(totalPages, currentPage));
    setDisplayedPage(currentPage);
  }, [currentPage, isFlipping, totalPages]);

  // Flip start: schedule the midpoint swap to the target page's content at 300ms.
  useEffect(() => {
    if (!isFlipping) return;

    if (midpointTimerRef.current !== null) {
      clearTimeout(midpointTimerRef.current);
    }

    midpointTimerRef.current = setTimeout(() => {
      setDisplayedContent(() => getPageComponent(totalPages, targetPage));
      setDisplayedPage(targetPage);
      midpointTimerRef.current = null;
    }, MIDPOINT_MS);

    return () => {
      if (midpointTimerRef.current !== null) {
        clearTimeout(midpointTimerRef.current);
        midpointTimerRef.current = null;
      }
    };
  }, [isFlipping, flipDirection, targetPage, totalPages]);

  const DisplayComponent = displayedContent;
  const displayedSpreadIndex = Math.ceil(displayedPage / 2);
  const displayedSide: 'left' | 'right' = displayedPage % 2 === 1 ? 'left' : 'right';
  const pageIcon = spreadsMeta[displayedSpreadIndex - 1]?.icon ?? '📄';

  return (
    <div className={styles.mobileScene}>
      <div ref={pageRef} className={styles.mobilePage}>
        {/* NOTE: `side` is intentionally currentPageSide (fixed for the whole
            600ms flip, since context only updates it once the flip completes) —
            NOT the midpoint-swapped displayedSide. BookPage's isIncoming/
            isOutgoing logic depends on side staying constant through a flip. */}
        <BookPage
          side={currentPageSide}
          isFlipping={isFlipping}
          flipDirection={flipDirection}
          className={styles.fullWidthPage}
        >
          {DisplayComponent ? (
            <DisplayComponent />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>{pageIcon}</span>
              <span className={styles.placeholderLabel}>
                Page {displayedPage} · {displayedSide === 'left' ? 'Left' : 'Right'}
              </span>
            </div>
          )}
        </BookPage>

        {/* Click zones — thin edge strips, content never blocked */}
        <div
          className={[
            styles.clickZone,
            styles.clickZoneLeft,
            prevDisabled ? styles.zoneDisabled : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={prevDisabled ? undefined : prevPage}
          role="button"
          aria-label="Previous page"
          tabIndex={prevDisabled ? -1 : 0}
          onKeyDown={
            prevDisabled
              ? undefined
              : (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    prevPage();
                  }
                }
          }
        />
        <div
          className={[
            styles.clickZone,
            styles.clickZoneRight,
            nextDisabled ? styles.zoneDisabled : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={nextDisabled ? undefined : nextPage}
          role="button"
          aria-label="Next page"
          tabIndex={nextDisabled ? -1 : 0}
          onKeyDown={
            nextDisabled
              ? undefined
              : (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    nextPage();
                  }
                }
          }
        />
      </div>

      <SpreadCounter current={currentPage} total={totalPages} />
    </div>
  );
};

export default MobileBook;