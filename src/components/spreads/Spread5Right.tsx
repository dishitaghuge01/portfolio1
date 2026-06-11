import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import styles from './Spread5Right.module.css';

// ── Experience bullet points ──────────────────────────────────────────────────
const EXP_BULLETS = [
  'Built end-to-end Legal Entity Extraction pipeline using spaCy and Doccano, processing 1,000+ High Court judgments with 85% F1-score',
  'Implemented LangChain RAG workflows with ChromaDB, improving LLM query response time by 30%',
  'Contributed to speech-to-text pipeline using Whisper and Azure, processing 500+ audio files',
  'Worked with FastAPI, PostgreSQL, Redis, Kafka, Docker, and Kubernetes',
];

// ── Achievements data ─────────────────────────────────────────────────────────
const achievements = [
  { icon: '⬡', title: 'Smart India Hackathon 2025',  subtitle: 'Finalist — DNABERT, UMAP & HDBSCAN' },
  { icon: '✦', title: 'High Recommendation',          subtitle: 'Order of Zenith — Maharashtra Legislative Assembly' },
  { icon: '◈', title: 'Special Mention',              subtitle: 'YCCExMUN — AIPPM Committee' },
  { icon: '◉', title: 'Goethe Zertifikat A1',         subtitle: 'German Language · 81%' },
  { icon: '⬢', title: 'Joint Treasurer',              subtitle: 'C.O.S.M.O.S. CSE Dept · 2025–26' },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Spread5Right: React.FC = () => (
  <div className={styles.page}>

    {/* ① Education */}
    <div>
      <p className={styles.sectionLabel}>Education</p>
      <GlassCard padding="md">
        <div className={styles.eduInner}>
          <p className={styles.eduInstitution}>Yeshwantrao Chavan College of Engineering</p>
          <p className={styles.eduDegree}>B.Tech Computer Science &amp; Engineering</p>
          <p className={styles.eduMinor}>Minor in Robotics &amp; CIM</p>
          <p className={styles.eduMeta}>Nagpur, India · 2023–2027</p>
          <span className={styles.cgpaBadge}>CGPA 9.01</span>
        </div>
      </GlassCard>
    </div>

    {/* ② Experience */}
    <div>
      <p className={styles.sectionLabel}>Experience</p>
      <GlassCard padding="md">
        <div className={styles.expInner}>
          <p className={styles.expCompany}>63 Moons Technologies Ltd.</p>
          <p className={styles.expRole}>Machine Learning Intern</p>
          <p className={styles.expMeta}>Mumbai, India · June–July 2025</p>

          <hr className={styles.expDivider} />

          <div className={styles.bulletList}>
            {EXP_BULLETS.map((text, i) => (
              <div key={i} className={styles.bullet}>
                <span className={styles.bulletDot} aria-hidden="true" />
                <p className={styles.bulletText}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>

    {/* ③ Achievements */}
    <div>
      <p className={styles.sectionLabel}>Achievements</p>
      <div className={styles.achievementList}>
        {achievements.map((a) => (
          <GlassCard key={a.title} padding="sm" hoverable>
            <div className={styles.achievementCardInner}>
              <div className={styles.achievementIcon}>{a.icon}</div>
              <div className={styles.achievementText}>
                <p className={styles.achievementTitle}>{a.title}</p>
                <p className={styles.achievementSubtitle}>{a.subtitle}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>

  </div>
);

export default Spread5Right;