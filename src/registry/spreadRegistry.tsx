import React from 'react';
import Spread1Left from '../components/spreads/Spread1Left';
import Spread1Right from '../components/spreads/Spread1Right';
import { Spread2Left, Spread2Right } from '../components/spreads/Spread2';
import ProjectPage from '../components/spreads/ProjectPage';
import Spread5Left from '../components/spreads/Spread5Left';
import Spread5Right from '../components/spreads/Spread5Right';
import Spread6Left from '../components/spreads/Spread6Left';
import AchievementsPage from '../components/spreads/AchievementsPage';

// ── Zero-prop wrappers ────────────────────────────────────────────────────────
// Registry components must be zero-prop React.ComponentType.
// Spread1Left's animationKey is driven by remounting the parent BookPage (key prop),
// so the default value of 0 is fine here — the useEffect re-fires on remount.
const Spread1LeftWrapper: React.FC = () => <Spread1Left animationKey={0} />;

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
  { left: React.ComponentType; right: React.ComponentType | null }
> = {
  1: { left: Spread1LeftWrapper, right: Spread1Right   },
  2: { left: Spread2Left,        right: Spread2Right   },
  3: { left: Project0,           right: Project1       },
  4: { left: Project2,           right: Project3       },
  5: { left: Spread5Left,       right: Spread5Right   },
  6: { left: AchievementsPage,  right: Spread6Left    },
  7: { left: null,              right: null           },
};