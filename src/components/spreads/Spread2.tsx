import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { useBook } from '../../contexts/BookContext';
import styles from './Spread2.module.css';

const TOC_ENTRIES = [
  { title: 'Education & Experience', subtitle: 'Institution and Internships', spreadIndex: 2, side: 'right' as const },
  { title: 'Railway PQ-Auth', subtitle: 'Post-Quantum Authentication for Indian Railways', spreadIndex: 3, side: 'left' as const },
  { title: 'ArchIntel', subtitle: 'Graph AI that scores residential floorplans for design quality', spreadIndex: 3, side: 'right' as const },
  { title: 'Nexus Storage', subtitle: 'Multi-tenant cloud storage with real-time usage billing', spreadIndex: 4, side: 'left' as const },
  { title: 'High Court NER', subtitle: 'Named entity extraction from Indian judicial documents', spreadIndex: 4, side: 'right' as const },
  { title: 'Research & Skills', subtitle: 'Research, credentials, and technical depth', spreadIndex: 5, side: 'left' as const },
  { title: 'Achievements', subtitle: 'Recognition, competitions, and reach', spreadIndex: 5, side: 'right' as const },
];

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
    style={{ cursor: 'pointer' }}
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

// ── Right page ────────────────────────────────────────────────────────────────
const Spread2ToC: React.FC = () => {
  const { goToSpread } = useBook();

  return (
    <div className={styles.rightPage}>
      <div className={styles.tocHeader}>
        <p className={styles.tocLabel}>INDEX</p>
        <h2 className={styles.tocTitle}>Table of Contents</h2>
        <hr className={styles.tocRule} />
      </div>

      <div className={styles.list}>
        {TOC_ENTRIES.map((entry) => (
          <TocRow
            key={entry.title}
            rowKey={entry.title}
            title={entry.title}
            subtitle={entry.subtitle}
            onActivate={() => goToSpread(entry.spreadIndex, entry.side)}
          />
        ))}
      </div>
    </div>
  );
};

export { Spread2ToC };