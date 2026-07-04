import React, { useEffect, useRef, useState } from 'react';
import { useBook } from '../../contexts/BookContext';
import { spreadsMeta } from '../../data/spreads';
import { spreadRegistry } from '../../registry/spreadRegistry';
import BookPage from './BookPage';
import BookSpine from './BookSpine';
import SpreadCounter from './SpreadCounter';
import styles from './Book.module.css';

const WHEEL_COOLDOWN_MS = 800;
const MIDPOINT_MS = 300;

type RegistryEntry = { left: React.ComponentType | null; right: React.ComponentType | null } | null;
const getEntry = (totalSpreads: number, spreadIndex: number): RegistryEntry => {
  if (spreadIndex < 1 || spreadIndex > totalSpreads) return null;
  return spreadRegistry[spreadIndex] ?? null;
};

const Book: React.FC = () => {
  const {
    currentSpread,
    targetSpread,
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

  // ── Two-finger swipe detection (wheel deltaX) ────────────────────────────────
  const bookRef = useRef<HTMLDivElement>(null);
  const isWheelCoolingRef = useRef(false);

  useEffect(() => {
    const bookDiv = bookRef.current;
    if (!bookDiv) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaX) < 30) return;
      if (isWheelCoolingRef.current) return;

      e.preventDefault();

      isWheelCoolingRef.current = true;
      if (e.deltaX > 0) nextSpread();
      else prevSpread();

      setTimeout(() => {
        isWheelCoolingRef.current = false;
      }, WHEEL_COOLDOWN_MS);
    };

    bookDiv.addEventListener('wheel', handleWheel, { passive: false });
    return () => bookDiv.removeEventListener('wheel', handleWheel);
  }, [nextSpread, prevSpread]);

  // ── One-time hint toast ───────────────────────────────────────────────────────
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('bookHintSeen')) return;

    setShowHint(true);
    const hideTimer = setTimeout(() => {
      setShowHint(false);
      sessionStorage.setItem('bookHintSeen', '1');
    }, 4000);

    return () => clearTimeout(hideTimer);
  }, []);

  // ── Swipe hint text — Spread 1 only ──────────────────────────────────────────
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  useEffect(() => {
    if (currentSpread !== 1) {
      setShowSwipeHint(false);
      return;
    }

    const showTimer = setTimeout(() => {
      setShowSwipeHint(true);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, [currentSpread]);

  useEffect(() => {
    if (!showSwipeHint) return;

    const autoHideTimer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 8000);

    return () => clearTimeout(autoHideTimer);
  }, [showSwipeHint]);

  useEffect(() => {
    if (isFlipping) {
      setShowSwipeHint(false);
    }
  }, [isFlipping]);

  const leftDisabled  = currentSpread === 1           || isFlipping;
  const rightDisabled = currentSpread === totalSpreads || isFlipping;

  // ── Four-slot content model, swapped at the 300ms midpoint ───────────────────
  //
  // A flip has four distinct content pieces, but only two BookPage slots:
  //   0°→90°   left shows CURRENT spread's left   (static while right folds away)
  //            right shows CURRENT spread's right (outgoing, animating away)
  //   90°→180° left shows NEXT spread's left       (incoming, animating in)
  //            right shows NEXT spread's right     (static, newly revealed)
  //
  // So each BookPage slot shows two different pieces of content over the
  // course of one flip — switched via a setTimeout at the 300ms midpoint,
  // entirely independent of when BookContext flips `currentSpread` (600ms).
  // This is tracked as React state (not derived inline) so the swap is a
  // real, scheduled event rather than something recomputed from props that
  // can drift out of sync with the animation's actual visual midpoint.
  const [leftContent, setLeftContent]   = useState<React.ComponentType | null>(null);
  const [rightContent, setRightContent] = useState<React.ComponentType | null>(null);
  const [leftSpreadShown, setLeftSpreadShown]   = useState(currentSpread);
  const [rightSpreadShown, setRightSpreadShown] = useState(currentSpread);

  const midpointTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle: always reflect currentSpread's own left/right directly.
  useEffect(() => {
    if (isFlipping) return;

    const entry = getEntry(totalSpreads, currentSpread);
    setLeftContent(() => entry?.left ?? null);
    setRightContent(() => entry?.right ?? null);
    setLeftSpreadShown(currentSpread);
    setRightSpreadShown(currentSpread);
  }, [currentSpread, isFlipping, totalSpreads]);

  // Flip start: schedule the midpoint swap to next spread's content at 300ms.
  useEffect(() => {
    if (!isFlipping) return;

    if (midpointTimerRef.current !== null) {
      clearTimeout(midpointTimerRef.current);
    }

    const nextSpreadIndex = targetSpread;
    const nextEntry = getEntry(totalSpreads, nextSpreadIndex);

    midpointTimerRef.current = setTimeout(() => {
      // Both slots swap to the next spread's content at 90° — left becomes
      // the incoming page's left, right becomes the newly-revealed right.
      setLeftContent(() => nextEntry?.left ?? null);
      setRightContent(() => nextEntry?.right ?? null);
      setLeftSpreadShown(nextSpreadIndex);
      setRightSpreadShown(nextSpreadIndex);
      midpointTimerRef.current = null;
    }, MIDPOINT_MS);

    return () => {
      if (midpointTimerRef.current !== null) {
        clearTimeout(midpointTimerRef.current);
        midpointTimerRef.current = null;
      }
    };
  }, [isFlipping, flipDirection, currentSpread, targetSpread, totalSpreads]);

  const DisplayLeftComponent  = leftContent;
  const DisplayRightComponent = rightContent;

  const leftIcon  = spreadsMeta[leftSpreadShown - 1]?.icon  ?? '📄';
  const rightIcon = spreadsMeta[rightSpreadShown - 1]?.icon ?? '📄';

  return (
    <div className={styles.scene}>
      <div className={styles.wrapper}>
        {/* Physical book */}
        <div ref={bookRef} className={styles.book}>

          {/* Left page — key only changes when currentSpread changes (600ms
              after a flip completes), which remounts this BookPage exactly
              once per return visit, at the right time. That remount is what
              naturally re-triggers Spread1Left's intro animation on mount —
              no animationKey prop or visit-count tracking needed. */}
          <BookPage
            key={`left-${currentSpread}`}
            side="left"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            {DisplayLeftComponent ? (
              <DisplayLeftComponent />
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>{leftIcon}</span>
                <span className={styles.placeholderLabel}>
                  Spread {leftSpreadShown} · Left
                </span>
              </div>
            )}
          </BookPage>

          {/* Right page */}
          <BookPage
            key={`right-${currentSpread}`}
            side="right"
            isFlipping={isFlipping}
            flipDirection={flipDirection}
          >
            {DisplayRightComponent ? (
              <DisplayRightComponent />
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>{rightIcon}</span>
                <span className={styles.placeholderLabel}>
                  Spread {rightSpreadShown} · Right
                </span>
              </div>
            )}
          </BookPage>

          {/* Decorative spine divider */}
          <BookSpine />

          {/* Click zones — thin 40px edge strips, content never blocked */}
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

          {/* Swipe hint — Spread 1 only, fades in after a delay */}
          {currentSpread === 1 && (
            <div
              className={[
                styles.swipeHint,
                showSwipeHint ? styles.swipeHintVisible : '',
              ].join(' ')}
              aria-hidden={!showSwipeHint}
            >
              two-finger swipe to flip →
            </div>
          )}
        </div>
      </div>

      {/* Page counter below the book */}
      <SpreadCounter current={currentSpread} total={totalSpreads} />

      {/* One-time hint toast */}
      <div
        className={[styles.hintToast, showHint ? styles.hintVisible : ''].join(' ')}
        aria-hidden={!showHint}
      >
        ← → keys · swipe · click edges to flip
      </div>
    </div>
  );
};

export default Book;