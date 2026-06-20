import React from 'react';
import styles from './Spread5Right.module.css';

const EXP_BULLETS = [
  'Built end-to-end Legal Entity Extraction pipeline using spaCy and Doccano, processing 1,000+ High Court judgments with 85% F1-score',
  'Implemented LangChain RAG workflows with ChromaDB, improving LLM query response time by 30%',
  'Contributed to speech-to-text pipeline using Whisper and Azure, processing 500+ audio files',
  'Worked with FastAPI, PostgreSQL, Redis, Kafka, Docker, and Kubernetes',
];

const Spread5Right: React.FC = () => (
  <div className={styles.page}>

    {/* ① Education */}
    <div>
      <p className={styles.sectionLabel}>Education</p>
      <div className={styles.eduCard}>
        <div className={styles.cgpaBlock}>
          <p className={styles.cgpaNumber}>9.01</p>
          <p className={styles.cgpaLabel}>CGPA</p>
        </div>

        <div className={styles.vDivider} aria-hidden="true" />

        <div className={styles.eduDetails}>
          <p className={styles.eduInstitution}>Yeshwantrao Chavan College of Engineering</p>
          <p className={styles.eduDegree}>B.Tech Computer Science &amp; Engineering</p>
          <p className={styles.eduMinor}>Minor in Robotics &amp; CIM</p>
          <p className={styles.eduMeta}>Nagpur, India · 2023–2027</p>
        </div>
      </div>
    </div>

    {/* ② Experience */}
    <div>
      <p className={styles.sectionLabel}>Experience</p>
      <div className={styles.expCard}>
        <p className={styles.expCompany}>63 Moons Technologies Ltd.</p>
        <p className={styles.expRole}>Machine Learning Intern</p>
        <p className={styles.expMeta}>Mumbai, India · June–July 2025</p>

        <div className={styles.bulletList}>
          {EXP_BULLETS.map((text, i) => (
            <div key={i} className={styles.bullet}>
              <span className={styles.bulletDot} aria-hidden="true" />
              <p className={styles.bulletText}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default Spread5Right;