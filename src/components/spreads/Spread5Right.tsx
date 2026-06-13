import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import styles from './Spread5Right.module.css';
import { education, experience } from '../../data/profile';

// ── Component ─────────────────────────────────────────────────────────────────
const Spread5Right: React.FC = () => (
  <div className={styles.page}>

    {/* ① Education */}
    <div>
      <p className={styles.sectionLabel}>Education</p>
      {education.map((item) => (
        <GlassCard key={item.institution} padding="md">
          <div className={styles.eduInner}>
            <p className={styles.eduInstitution}>{item.institution}</p>
            <p className={styles.eduDegree}>{item.degree}</p>
            <p className={styles.eduMinor}>{item.minor}</p>
            <p className={styles.eduMeta}>{item.location} · {item.duration}</p>
            <span className={styles.cgpaBadge}>CGPA {item.cgpa}</span>
          </div>
        </GlassCard>
      ))}
    </div>

    {/* ② Experience */}
    <div>
      <p className={styles.sectionLabel}>Experience</p>
      {experience.map((item) => (
        <GlassCard key={item.company} padding="md">
          <div className={styles.expInner}>
            <p className={styles.expCompany}>{item.company}</p>
            <p className={styles.expRole}>{item.role}</p>
            <p className={styles.expMeta}>{item.location} · {item.duration}</p>

            <hr className={styles.expDivider} />

            <div className={styles.bulletList}>
              {item.bullets.map((text, i) => (
                <div key={i} className={styles.bullet}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <p className={styles.bulletText}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>

  </div>
);

export default Spread5Right;