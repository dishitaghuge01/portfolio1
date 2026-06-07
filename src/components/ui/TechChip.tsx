import React from 'react';
import styles from './TechChip.module.css';

interface TechChipProps {
  name: string;
}

const TechChip: React.FC<TechChipProps> = ({ name }) => (
  <span className={styles.chip}>{name}</span>
);

export default TechChip;