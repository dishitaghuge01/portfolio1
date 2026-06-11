import React from 'react';
import TechChip from '../../components/ui/TechChip';
import { projects } from '../../data/projects';
import { spreadsMeta } from '../../data/spreads';
import styles from './ProjectPage.module.css';

interface ProjectPageProps {
  projectIndex: number;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectIndex }) => {
  const project = projects[projectIndex];
  if (!project) return null;

  const spreadEntry = spreadsMeta.find((s) => s.index === project.spreadIndex);
  const icon        = spreadEntry?.icon ?? '📄';

  // Zero-padded project number: "01", "02", etc.
  const numLabel = `0${projectIndex + 1}`;

  return (
    <div className={styles.page}>
      {/* ── Top half: media zone ───────────────────────────────────────────── */}
      <div
        className={styles.mediaZone}
        style={{ backgroundColor: project.imagePlaceholder }}
      >
        {/* GitHub pill — top left */}
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.cornerPill} ${styles.pillTopLeft}`}
          aria-label={`${project.title} GitHub repository`}
        >
          GitHub ↗
        </a>

        {/* Live demo pill — top right */}
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.cornerPill} ${styles.pillTopRight}`}
          aria-label={`${project.title} live demo`}
        >
          LIVE DEMO ↗
        </a>

        {/* Centered icon + watermark */}
        <div className={styles.mediaContent}>
          <span className={styles.mediaIcon}>{icon}</span>
          <span className={styles.mediaWatermark}>{project.title}</span>
        </div>
      </div>

      {/* ── Bottom half: detail zone ───────────────────────────────────────── */}
      <div className={styles.detailZone}>
        {/* Row 1 — number badge + title */}
        <div className={styles.titleRow}>
          <span className={styles.numberBadge}>{numLabel}</span>
          <h3 className={styles.projectTitle}>{project.title}</h3>
        </div>

        {/* Row 2 — description */}
        <p className={styles.description}>{project.description}</p>

        {/* Row 3 — tech chips */}
        <div className={styles.chipRow}>
          {project.techStack.map((tech) => (
            <TechChip key={tech} name={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;