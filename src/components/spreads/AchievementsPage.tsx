import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { achievements } from '../../data/profile';
import styles from './AchievementsPage.module.css';

interface AchievementItem {
  title: string;
  subtitle?: string;
}

const AchievementsPage: React.FC = () => (
  <div className={styles.page}>

    {/* Header */}
    <div className={styles.header}>
      <p className={styles.sectionLabel}>Achievements &amp; Leadership</p>
      <hr className={styles.rule} />
    </div>

    {/* Achievements list */}
    <div className={styles.list}>
      {achievements.map((item: AchievementItem) => (
        <GlassCard key={item.title} padding="sm" hoverable>
          <div className={styles.cardInner}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                flexShrink: 0,
                marginTop: '6px',
              }}
            />
            <div className={styles.textBlock}>
              <p className={styles.achievementTitle}>{item.title}</p>
              {item.subtitle && (
                <p className={styles.achievementSubtitle}>{item.subtitle}</p>
              )}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>

    <div className={styles.closingBlock}>
      <p className={styles.closingText}>
        Always open to interesting problems and the people who work on them.
        <br />
        Let's talk.
      </p>
      <div className={styles.closingLinks}>
        <a href="https://linkedin.com/in/dishitaghuge" className={styles.closingIcon} aria-label="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5C4.98 2.12 6.1 1 7.48 1s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S4.98 4.88 4.98 3.5zM3 8.5h4v12H3v-12zm7.5 0h3.8v1.6h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05v6.4h-4v-5.7c0-1.36-.03-3.12-1.9-3.12-1.9 0-2.19 1.48-2.19 3.01v5.82h-4v-12z" />
          </svg>
        </a>
        <a href="https://github.com/dishitaghuge01" className={styles.closingIcon} aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0.5C5.38 0.5 0 5.88 0 12.5c0 5.3 3.44 9.8 8.21 11.38.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.14 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.61-5.48 5.91.43.37.81 1.1.81 2.22 0 1.6-.01 2.88-.01 3.27 0 .32.21.7.82.58C20.56 22.3 24 17.8 24 12.5 24 5.88 18.62.5 12 .5z" />
          </svg>
        </a>
        <a href="mailto:ghugedishita@gmail.com" className={styles.closingIcon} aria-label="Email">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.1l-8 5-8-5V6l8 5 8-5v2.1z" />
          </svg>
        </a>
      </div>
    </div>

  </div>
);

export default AchievementsPage;