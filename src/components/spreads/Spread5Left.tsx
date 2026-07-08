import React from 'react';
import { papers } from '../../data/publications';
import type { ResearchPaper } from '../../data/publications';
import styles from './Spread5Left.module.css';

const skillGroups = [
  { label: 'AI/ML & NLP', items: ['spaCy', 'LangChain', 'Whisper', 'OCR', 'RAG', 'Anaconda'] },
  { label: 'Web & Backend', items: ['FastAPI', 'Node.js', 'Express', 'React', 'Next.js'] },
  { label: 'Databases', items: ['PostgreSQL', 'ChromaDB', 'Neo4j'] },
  { label: 'DevOps & Cloud', items: ['Docker', 'Kubernetes', 'CI/CD', 'Azure'] },
  { label: 'Languages', items: ['Python', 'C', 'C++', 'Java', 'JavaScript'] },
  { label: 'Tools', items: ['Doccano', 'Jupyter'] },
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
      {!isUnderReview && (
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

    {/* Skills & Tools */}
    <div>
      <p className={styles.sectionLabel}>SKILLS &amp; TOOLS</p>
      <div className={styles.skillGroups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <span className={styles.skillGroupLabel}>{group.label}</span>
            <div className={styles.skillGroupItems}>
              {group.items.map((item) => (
                <span key={item} className={styles.chip}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default Spread5Left;