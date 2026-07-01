import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
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
  rowKey: string | number;
  title: string;
  subtitle: string;
  onActivate: () => void;
}

const TocRow: React.FC<RowProps> = ({ rowKey, title, subtitle, onActivate }) => (
  <GlassCard
    key={rowKey}
    className={styles.entry}
    padding="sm"
    hoverable
    onClick={onActivate}
  >
    <div className={styles.cardInner}>
      <div className={styles.bulletDot} aria-hidden="true" />
      <div className={styles.textBlock}>
        <p className={styles.achievementTitle}>{title}</p>
        <p className={styles.achievementSubtitle}>{subtitle}</p>
      </div>
    </div>
  </GlassCard>
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
      <div className={styles.list}>
        {/* Project rows — one per project */}
        {projects.map((project) => {
          const techSubtitle = project.techStack.slice(0, 3).join(' · ');
          return (
            <TocRow
              key={project.title}
              rowKey={project.title}
              title={project.title}
              subtitle={techSubtitle}
              onActivate={() => goToSpread(project.spreadIndex)}
            />
          );
        })}

        {/* Non-project spread entries (Research, Closing, etc.) */}
        {metaEntries.map((entry) => (
          <TocRow
            key={entry.index}
            rowKey={entry.index}
            title={entry.title}
            subtitle={SPREAD_SUBTITLES[entry.index] ?? entry.subtitle ?? ''}
            onActivate={() => goToSpread(entry.index)}
          />
        ))}
      </div>
    </div>
  );
};