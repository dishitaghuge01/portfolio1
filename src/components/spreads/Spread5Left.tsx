import React from 'react';
import { papers } from '../../data/publications';
import type { ResearchPaper } from '../../data/publications';
import styles from './Spread5Left.module.css';

const FOCUS_AREAS = [
  'Latent Space Analysis',
  'Spatial AI',
  'Legal NLP',
  'Graph Embeddings',
  'Post-Quantum Security',
  'Generative Models',
  'Applied Computer Vision',
];

// ── Single paper card ─────────────────────────────────────────────────────────
const PaperCard: React.FC<{ paper: ResearchPaper }> = ({ paper }) => {
  const isUnderReview = paper.status === 'under-review';

  return (
    <div
      className={[
        styles.paperCard,
        !isUnderReview ? styles.paperCardInProgress : '',
      ].join(' ')}
    >
      {/* Size A — status word */}
      <span
        className={[
          styles.statusWord,
          !isUnderReview ? styles.statusWordInProgress : '',
        ].join(' ')}
      >
        {isUnderReview ? 'Under Review' : 'In Progress'}
      </span>

      {/* Size B — title */}
      <h3 className={styles.paperTitle}>{paper.title}</h3>

      {/* Size C — description */}
      <p className={styles.bodyText}>{paper.description}</p>

      {/* Size C — tags */}
      <p className={styles.tagsLine}>{paper.tags.join(' · ')}</p>

      {/* Size C — conditional footer */}
      {isUnderReview ? (
        <a
          href={paper.link ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.previewLink}
        >
          Preview Draft →
        </a>
      ) : (
        <>
          <div className={styles.timelineTrack}>
            <div
              className={styles.timelineFill}
              style={{ width: `${paper.progressPercent ?? 0}%` }}
            />
          </div>
          <p className={styles.timelineMeta}>
            {paper.progressPercent}% · Targeting {paper.expectedVenue}
          </p>
        </>
      )}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const Spread5Left: React.FC = () => (
  <div className={styles.page}>

    {/* Header */}
    <div>
      <p className={styles.sectionLabel}>Research &amp; Writing</p>
      <hr className={styles.rule} />
    </div>

    {/* Papers list */}
    <div className={styles.papersList}>
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>

    {/* Focus areas */}
    <div>
      <p className={styles.sectionLabel}>Focus Areas</p>
      <div className={styles.chipRow}>
        {FOCUS_AREAS.map((area) => (
          <span key={area} className={styles.chip}>{area}</span>
        ))}
      </div>
    </div>

  </div>
);

export default Spread5Left;