import React, { useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { starNodes } from '../../data/skills';
import type { StarNode } from '../../types';
import styles from './Spread1Right.module.css';

/* ── Cluster → CSS variable mapping ─────────────────────────────────────────── */
type Cluster = StarNode['cluster'];

const CLUSTER_COLOR: Record<Cluster, string> = {
  ml:       'var(--cluster-ml)',
  cv:       'var(--cluster-cv)',
  backend:  'var(--cluster-backend)',
  data:     'var(--cluster-data)',
  research: 'var(--cluster-research)',
  crypto:   'var(--cluster-crypto)',
  nlp:      'var(--cluster-nlp)',
};

/* ── Cluster label positions and display names ───────────────────────────────── */
const CLUSTER_LABELS: { cluster: Cluster; label: string; x: number; y: number }[] = [
  { cluster: 'ml',       label: 'ML',       x: 18, y: 12 },
  { cluster: 'cv',       label: 'CV',       x: 60, y: 10 },
  { cluster: 'backend',  label: 'BACKEND',  x: 78, y: 58 },
  { cluster: 'data',     label: 'DATA',     x: 38, y: 88 },
  { cluster: 'research', label: 'RESEARCH', x: 50, y: 38 },
  { cluster: 'crypto',   label: 'CRYPTO',   x: 82, y: 62 },
  { cluster: 'nlp',      label: 'NLP',      x: 18, y: 72 },
];

/* ── Component ───────────────────────────────────────────────────────────────── */
const Spread1Right: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      {/* ① Starfield */}
      <GlassCard padding="none" className={styles.starfieldCard}>
        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Embedding space visualisation"
        >
          {/* ── Corner labels ───────────────────────────────────────────────── */}
          <text
            x="2"
            y="4"
            fontSize="3.5"
            fill="var(--text-muted)"
            fontFamily="DM Sans, sans-serif"
            fontWeight="500"
          >
            Embedding Space
          </text>
          <text
            x="2"
            y="8"
            fontSize="2.5"
            fill="var(--text-muted)"
            fontFamily="DM Sans, sans-serif"
          >
            ↗ hover to explore
          </text>

          {/* ── Cluster labels ───────────────────────────────────────────────── */}
          {CLUSTER_LABELS.map(({ cluster, label, x, y }) => (
            <text
              key={cluster}
              x={x}
              y={y}
              fontSize="2.8"
              fill={CLUSTER_COLOR[cluster]}
              fontFamily="DM Sans, sans-serif"
              fontWeight="600"
              letterSpacing="0.08"
              opacity="0.4"
              style={{ textTransform: 'uppercase' }}
            >
              {label}
            </text>
          ))}

          {/* ── Star nodes ───────────────────────────────────────────────────── */}
          {starNodes.map((node, index) => {
            const color      = CLUSTER_COLOR[node.cluster];
            const isHovered  = hoveredNode === node.id;
            const floatDuration = `${(index % 4) + 3}s`;
            const floatDelay    = `${(index % 7) * -0.6}s`; // stagger starts

            return (
              <g
                key={node.id}
                style={{
                  animationName:            'float',
                  animationDuration:        floatDuration,
                  animationDelay:           floatDelay,
                  animationTimingFunction:  'ease-in-out',
                  animationIterationCount:  'infinite',
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Glow halo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={2.5}
                  fill={color}
                  opacity={0.15}
                  className={styles.nodeGlow}
                />

                {/* Main node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={0.8}
                  fill={color}
                  className={[
                    styles.nodeCircle,
                    isHovered ? styles.nodeCircleHovered : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />

                {/* Hover label */}
                {isHovered && (
                  <text
                    x={node.x}
                    y={node.y - 2}
                    fontSize="3"
                    fill="var(--text-primary)"
                    fontFamily="DM Sans, sans-serif"
                    textAnchor="middle"
                    className={styles.nodeLabel}
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </GlassCard>

      {/* ② Search bar */}
      <input
        type="text"
        className={styles.searchBar}
        placeholder="Query the embedding space..."
        aria-label="Query the embedding space"
        readOnly
      />
    </div>
  );
};

export default Spread1Right;