import React from 'react';
import { experience } from '../../data/profile';
import styles from './Spread5Right.module.css';

const Spread5Right: React.FC = () => (
  <div className={styles.page}>

    {/* ① Education */}
    <div>
      <p className={styles.sectionLabel}>Education</p>
      <div className={styles.eduCard}>
        <div className={styles.eduDetails}>
          <p className={styles.eduInstitution}>Yeshwantrao Chavan College of Engineering</p>
          <p className={styles.eduDegree}>B.Tech Computer Science &amp; Engineering</p>
          <p className={styles.eduMinor}>Minor in Robotics &amp; CIM</p>
          <p className={styles.eduMeta}>Nagpur, India · 2023–2027</p>
        </div>

        <div className={styles.vDivider} aria-hidden="true" />

        <div
          className={styles.cgpaBlock}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <p className={styles.cgpaNumber}>9.01</p>
          <p className={styles.cgpaLabel}>CGPA</p>
        </div>
      </div>
    </div>

    {/* ② Experience */}
    <div>
      <p className={styles.sectionLabel}>Experience</p>
      <div className={styles.expList}>
        {experience.map((exp, index) => (
          <div key={`${exp.company}-${index}`} className={styles.expCard}>
            <p className={styles.expCompany}>{exp.company}</p>
            <p className={styles.expRole}>{exp.role}</p>
            <p className={styles.expMeta}>{exp.location} · {exp.duration}</p>

            <div className={styles.bulletList}>
              {exp.bullets.map((text, bulletIndex) => (
                <div key={`${exp.company}-${bulletIndex}`} className={styles.bullet}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <p className={styles.bulletText}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default Spread5Right;