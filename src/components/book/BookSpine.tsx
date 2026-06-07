import React from 'react';
import styles from './BookSpine.module.css';

const BookSpine: React.FC = () => (
  <div className={styles.spine} aria-hidden="true">
    <div className={styles.glow} />
  </div>
);

export default BookSpine;