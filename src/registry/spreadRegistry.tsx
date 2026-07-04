import React from 'react';
import Spread1Left from '../components/spreads/Spread1Left';
import EmbeddingSpace from '../components/spreads/EmbeddingSpace';
import { Spread2ToC } from '../components/spreads/Spread2';
import ProjectPage from '../components/spreads/ProjectPage';
import Spread5Left from '../components/spreads/Spread5Left';
import Spread5Right from '../components/spreads/Spread5Right';
import AchievementsPage from '../components/spreads/AchievementsPage';

// ── Zero-prop wrappers ────────────────────────────────────────────────────────
// Registry components must be zero-prop React.ComponentType.
// Spread1Left takes no props at all — its intro animation runs once per
// mount, naturally, and Book.tsx remounts it via a changing `key` whenever
// the user returns to spread 1.
const Spread1LeftWrapper: React.FC = () => <Spread1Left />;

// ProjectPage wrappers — one per project slot
const Project0: React.FC = () => <ProjectPage projectIndex={0} />;
const Project1: React.FC = () => <ProjectPage projectIndex={1} />;
const Project2: React.FC = () => <ProjectPage projectIndex={2} />;
const Project3: React.FC = () => <ProjectPage projectIndex={3} />;

// ── Registry ──────────────────────────────────────────────────────────────────
// null for `right` means the right page renders the default placeholder.
//
// HOW TO ADD A NEW PROJECT:
// 1. Add project data to src/data/projects.ts
// 2. Add a wrapper here: const Project4: React.FC = () => <ProjectPage projectIndex={4} />;
// 3. Add it to a spread below (right of an existing spread, or a new spread entry)
// 4. Add the spread to spreadsMeta in src/data/spreads.ts
// 5. That's it — the book, ToC, and counter all update automatically.
export const spreadRegistry: Record<
  number,
  { left: React.ComponentType | null; right: React.ComponentType | null }
> = {
  1: { left: Spread1LeftWrapper, right: EmbeddingSpace },
  2: { left: Spread2ToC,         right: Spread5Right },
  3: { left: Project0,           right: Project1 },
  4: { left: Project2,           right: Project3 },
  5: { left: Spread5Left,        right: AchievementsPage },
};