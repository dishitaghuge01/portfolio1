import React from 'react';
import styles from './SpreadCounter.module.css';

interface SpreadCounterProps {
  current: number;
  total: number;
}

const SpreadCounter: React.FC<SpreadCounterProps> = ({ current, total }) => (
  <p className={styles.counter} aria-label={`Page ${current} of ${total}`}>
    <span className={styles.current}>{current}</span>
    <span className={styles.muted}> / {total}</span>
  </p>
);

export default SpreadCounter;