import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import styles from './Spread6Left.module.css';

const CONTACT_ROWS = [
  { badge: 'gm', label: 'ghugedishita@gmail.com',       href: 'mailto:ghugedishita@gmail.com' },
  { badge: 'in', label: 'linkedin.com/in/dishita-ghuge', href: 'https://linkedin.com/in/dishita-ghuge' },
  { badge: 'gh', label: 'github.com/dishita-ghuge',      href: 'https://github.com/dishita-ghuge' },
];

const Spread6Left: React.FC = () => (
  <div className={styles.page}>

    {/* Top label */}
    <p className={styles.finLabel}>Fin</p>

    {/* Middle — statement + contact */}
    <div className={styles.middle}>
      <span className={styles.decorSymbol} aria-hidden="true">✦</span>

      <h2 className={styles.mainStatement}>Thank you for reading.</h2>

      <p className={styles.subStatement}>
        I build things that sit at the intersection of machine intelligence
        and the physical world. If that resonates — let's talk.
      </p>

      <div className={styles.contactCard}>
        <GlassCard padding="md" hoverable>
          <div className={styles.contactInner}>
            {CONTACT_ROWS.map(({ badge, label, href }) => (
              <a
                key={badge}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className={styles.contactRow}
              >
                <span className={styles.contactBadge}>{badge}</span>
                <span className={styles.contactText}>{label}</span>
              </a>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>

    {/* Bottom credit */}
    <p className={styles.credit}>Dishita Ghuge · 2025</p>

  </div>
);

export default Spread6Left;