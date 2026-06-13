import React from 'react';
import { spreadsMeta } from '../../data/spreads';
import { projects } from '../../data/projects';
import { useBook } from '../../contexts/BookContext';
import styles from './Spread2.module.css';

// ── Subtitles for non-project spreads (index >= 5) ───────────────────────────
const SPREAD_SUBTITLES: Record<number, string> = {
  5: 'Papers · Education · Achievements',
  6: 'Contact & Fin',
};

// ── Reusable row ──────────────────────────────────────────────────────────────
interface RowProps {
  rowKey:    string | number;
  icon:      React.ReactNode;
  title:     string;
  subtitle:  string;
  pageNum:   number;
  onActivate: () => void;
  ariaLabel: string;
}

const TocRow: React.FC<RowProps> = ({ rowKey, icon, title, subtitle, pageNum, onActivate, ariaLabel }) => (
  <div
    key={rowKey}
    className={styles.entry}
    onClick={onActivate}
    role="button"
    tabIndex={0}
    aria-label={ariaLabel}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    }}
  >
    <div className={styles.iconCircle}>{icon}</div>
    <div className={styles.entryText}>
      <span className={styles.entryTitle}>{title}</span>
      <span className={styles.entrySubtitle}>{subtitle}</span>
    </div>
    <span className={styles.pageNumber}>{pageNum}</span>
  </div>
);

// ── Left page ─────────────────────────────────────────────────────────────────
export const Spread2Left: React.FC = () => (
  <div className={styles.leftPage}>
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

    <p className={styles.bottomNote}>Click any entry to navigate →</p>
  </div>
);

// ── Right page ────────────────────────────────────────────────────────────────
export const Spread2Right: React.FC = () => {
  const { goToSpread } = useBook();

  // Non-project spreads: index >= 5
  const metaEntries = spreadsMeta.filter((s) => s.index >= 5);

  return (
    <div className={styles.rightPage}>
      {/* Project rows — one per project */}
      {projects.map((project) => {
        const techSubtitle = project.techStack.slice(0, 3).join(' · ');
        const initial      = project.title.charAt(0).toUpperCase();
        return (
          <TocRow
            key={project.title}
            rowKey={project.title}
            icon={initial}
            title={project.title}
            subtitle={techSubtitle}
            pageNum={project.spreadIndex}
            onActivate={() => goToSpread(project.spreadIndex)}
            ariaLabel={`Go to spread ${project.spreadIndex}: ${project.title}`}
          />
        );
      })}

      {/* Non-project spread entries (Research, Closing, etc.) */}
      {metaEntries.map((entry) => (
        <TocRow
          key={entry.index}
          rowKey={entry.index}
          icon={entry.icon}
          title={entry.title}
          subtitle={SPREAD_SUBTITLES[entry.index] ?? entry.subtitle ?? ''}
          pageNum={entry.index}
          onActivate={() => goToSpread(entry.index)}
          ariaLabel={`Go to spread ${entry.index}: ${entry.title}`}
        />
      ))}
    </div>
  );
};