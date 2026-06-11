import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { papers } from '../../data/publications';
import type { ResearchPaper } from '../../data/publications';
import styles from './Spread5Left.module.css';

// ── Research interests ────────────────────────────────────────────────────────
const INTERESTS = [
  'Latent Space Analysis',
  'Spatial AI',
  'Legal NLP',
  'Graph Embeddings',
  'Post-Quantum Security',
  'Generative Models',
  'Applied Computer Vision',
];

// ── Paper card ────────────────────────────────────────────────────────────────
const PaperCard: React.FC<{ paper: ResearchPaper }> = ({ paper }) => {
  const isUnderReview = paper.status === 'under-review';

  return (
    <GlassCard padding="md" hoverable>
      <div className={styles.cardInner}>
        {/* Row 1 — status badge */}
        <span
          className={[
            styles.badge,
            isUnderReview ? styles.badgeUnderReview : styles.badgeInProgress,
          ].join(' ')}
        >
          {isUnderReview ? 'UNDER REVIEW' : 'IN PROGRESS'}
        </span>

        {/* Row 2 — title */}
        <h3 className={styles.paperTitle}>{paper.title}</h3>

        {/* Row 3 — description */}
        <p className={styles.paperDesc}>{paper.description}</p>

        {/* Row 4 — tags */}
        <div className={styles.tagsRow}>
          {paper.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {/* Row 5 — conditional action */}
        {isUnderReview ? (
          <a
            href={paper.link ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.previewLink}
          >
            Preview Draft ↗
          </a>
        ) : (
          <div className={styles.progressBlock}>
            <div className={styles.progressLabelRow}>
              <span className={styles.progressLabelText}>PROGRESS</span>
              <span className={styles.progressPercent}>{paper.progressPercent}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${paper.progressPercent ?? 0}%` }}
              />
            </div>
            {paper.expectedVenue && (
              <p className={styles.progressVenue}>{paper.expectedVenue}</p>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const Spread5Left: React.FC = () => (
  <div className={styles.page}>

    {/* ① Header */}
    <div>
      <p className={styles.sectionLabel}>Research &amp; Writing</p>
      <hr className={styles.rule} />
      <p className={styles.statement}>
        Bridging machine intelligence with physical systems — from architectural
        space to cryptographic security.
      </p>
    </div>

    {/* ② Papers list */}
    <div className={styles.papersList}>
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>

    {/* ③ Research interests */}
    <div>
      <p className={styles.sectionLabel}>Research Interests</p>
      <hr className={styles.rule} />
      <div className={styles.interestsRow}>
        {INTERESTS.map((interest) => (
          <GlassCard key={interest} padding="none">
            <span className={styles.interestChip}>{interest}</span>
          </GlassCard>
        ))}
      </div>
    </div>

  </div>
);

export default Spread5Left;