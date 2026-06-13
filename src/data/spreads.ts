/**
 * HOW TO ADD A NEW SPREAD / PROJECT:
 * 1. Add project data to src/data/projects.ts
 * 2. Add a zero-prop wrapper in src/registry/spreadRegistry.tsx:
 *      const Project4: React.FC = () => <ProjectPage projectIndex={4} />;
 * 3. Register it in spreadRegistry — either as the right page of an existing
 *    spread, or as a new spread entry:
 *      7: { left: Project4, right: null }
 * 4. Add the spread to spreadsMeta below (title, icon, index must match).
 * 5. That's it — the book, Table of Contents, and page counter all update
 *    automatically. No changes to Book.tsx needed.
 */

export interface SpreadMeta {
  index:    number;
  title:    string;
  icon:     string;
  subtitle?: string;
}

export const spreadsMeta: SpreadMeta[] = [
  { index: 1, title: 'Introduction',        icon: '◎',  subtitle: 'Profile & Embedding Space'         },
  { index: 2, title: 'Table of Contents',   icon: '≡',  subtitle: 'Navigation'                        },
  { index: 3, title: 'Projects I',          icon: '⬡',  subtitle: 'ArchiIntel · NeuralSearch'         },
  { index: 4, title: 'Projects II',         icon: '⬢',  subtitle: 'CloudStore · GraphMind'            },
  { index: 5, title: 'Research & Skills',   icon: '✦',  subtitle: 'Papers · Education · Achievements' },
  { index: 6, title: 'Achievements',         icon: '✦',  subtitle: 'Leadership & Recognition'          },
  { index: 7, title: 'Closing',              icon: '❋',  subtitle: ''                                  },
];