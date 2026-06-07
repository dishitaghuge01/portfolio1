import React from 'react';
import styles from './GlassCircle.module.css';

interface GlassCircleProps {
  size?: number;
  children?: React.ReactNode;
  placeholderColor?: string;
  imageSrc?: string;
}

const GlassCircle: React.FC<GlassCircleProps> = ({
  size = 260,
  children,
  placeholderColor = '#1a2a3a',
  imageSrc,
}) => {
  const wrapperStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: imageSrc ? undefined : placeholderColor,
  };

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className={styles.image}
          draggable={false}
        />
      ) : (
        children
      )}

      {/* Glass ring overlay — always on top */}
      <span className={styles.ring} aria-hidden="true" />
    </div>
  );
};

export default GlassCircle;