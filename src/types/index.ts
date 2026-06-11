// ── Theme ─────────────────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light';

// ── Spread metadata ───────────────────────────────────────────────────────────
export interface SpreadMeta {
  index: number;
  title: string;
  icon: string;
  subtitle: string;
}

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
  title:            string;
  description:      string;
  techStack:        string[];
  liveLink:         string;
  githubLink:       string;   // added — repo URL or "#" placeholder
  imagePlaceholder: string;
  spreadIndex:      number;
}