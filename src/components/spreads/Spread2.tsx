import React from 'react';
import { spreadsMeta } from '../../data/spreads';
import { useBook } from '../../contexts/BookContext';
import styles from './Spread2.module.css';

// ── Left page ─────────────────────────────────────────────────────────────────
export const Spread2Left: React.FC = () => (
  <div className={styles.leftPage}>
    {/* Top block — label, rule, heading, description */}
    <div className={styles.topBlock}>
      <div>
        <p className={styles.indexLabel}>Index</p>
        <hr className={styles.rule} />
      </div>

      <h2 className={styles.heading}>
        Table of<br />Contents
      </h2>

      <p className={styles.description}>
        A curated collection of work, research, and capabilities.
      </p>
    </div>

    {/* Bottom note */}
    <p className={styles.bottomNote}>Click any entry to navigate →</p>
  </div>
);

// ── Right page ────────────────────────────────────────────────────────────────
export const Spread2Right: React.FC = () => {
  const { goToSpread } = useBook();

  // Spreads 3–9 only
  const entries = spreadsMeta.filter((s) => s.index >= 3 && s.index <= 9);

  return (
    <div className={styles.rightPage}>
      {entries.map((entry) => (
        <div
          key={entry.index}
          className={styles.entry}
          onClick={() => goToSpread(entry.index)}
          role="button"
          tabIndex={0}
          aria-label={`Go to spread ${entry.index}: ${entry.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goToSpread(entry.index);
            }
          }}
        >
          {/* Icon */}
          <div className={styles.iconCircle}>{entry.icon}</div>

          {/* Title + subtitle */}
          <div className={styles.entryText}>
            <span className={styles.entryTitle}>{entry.title}</span>
            <span className={styles.entrySubtitle}>
              {spreadsMeta.find((s) => s.index === entry.index)?.subtitle ?? ''}
            </span>
          </div>

          {/* Page number */}
          <span className={styles.pageNumber}>{entry.index}</span>
        </div>
      ))}
    </div>
  );
};