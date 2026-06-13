import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { achievements } from '../../data/profile';
import styles from './AchievementsPage.module.css';

const AchievementsPage: React.FC = () => (
  <div className={styles.page}>

    {/* Header */}
    <div className={styles.header}>
      <p className={styles.sectionLabel}>Achievements &amp; Leadership</p>
      <hr className={styles.rule} />
    </div>

    {/* Achievements list */}
    <div className={styles.list}>
      {achievements.map((item) => (
        <GlassCard key={item.title} padding="sm" hoverable>
          <div className={styles.cardInner}>
            <div className={styles.iconCircle}>{item.icon}</div>
            <div className={styles.textBlock}>
              <p className={styles.achievementTitle}>{item.title}</p>
              <p className={styles.achievementSubtitle}>{item.subtitle}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>

    {/* Placeholder note — naturally hidden when list fills the page */}
    <p className={styles.bottomNote}>More achievements incoming —</p>

  </div>
);

export default AchievementsPage;