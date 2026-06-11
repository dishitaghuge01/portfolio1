import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import TechChip from '../../components/ui/TechChip';
import { projects } from '../../data/projects';
import styles from './Spread3Right.module.css';

const DETAIL_TEXT =
  'Analyzed 5,000+ floor plans using computer vision-based SVG parsing for room ' +
  'segmentation, spatial graph construction, and geometric feature extraction. ' +
  'Engineered 25 spatial features to quantify layout efficiency and built an ' +
  'LLM-powered assistant using RAG to generate actionable design improvement suggestions.';

const STATS = [
  { number: '5,000+', label: 'Floor Plans Analyzed' },
  { number: '25',     label: 'Spatial Features'     },
  { number: '85%',    label: 'Accuracy Score'       },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
const Spread3Right: React.FC = () => {
  const project = projects[0];

  return (
    <div className={styles.page}>
      {/* ① Spread label */}
      <p className={styles.spreadLabel}>Project 01</p>

      {/* ② Title */}
      <h2 className={styles.title}>{project.title}</h2>

      {/* ③ Divider */}
      <hr className={styles.divider} />

      {/* ④ Description card */}
      <GlassCard padding="md">
        <div className={styles.descBlock}>
          <p className={styles.descText}>{project.description}</p>
          <p className={styles.descText}>{DETAIL_TEXT}</p>
        </div>
      </GlassCard>

      {/* ⑤ Tech stack */}
      <div className={styles.techBlock}>
        <p className={styles.techLabel}>Tech Stack</p>
        <div className={styles.chipRow}>
          {project.techStack.map((tech) => (
            <TechChip key={tech.name} name={tech.name} />
          ))}
        </div>
      </div>

      {/* ⑥ Stats row */}
      <div className={styles.statsRow}>
        {STATS.map(({ number, label }) => (
          <GlassCard key={label} padding="sm" style={{ flex: 1 }}>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>{number}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Spread3Right;