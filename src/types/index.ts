// ── Theme ─────────────────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light';

// ── Spread metadata ───────────────────────────────────────────────────────────
export interface SpreadMeta {
  index: number;
  title: string;
  icon: string;
  subtitle: string;
}

// ── Skills ────────────────────────────────────────────────────────────────────
export interface Skill {
  name:  string;
  value: number;
}

export interface StarNode {
  id:      string;
  label:   string;
  cluster: 'ml' | 'cv' | 'crypto' | 'backend' | 'nlp' | 'research' | 'data';
  x:       number;
  y:       number;
}

// ── Social ────────────────────────────────────────────────────────────────────
export interface SocialLink {
  platform: 'github' | 'linkedin' | 'gmail';
  url:      string;
  label:    string;
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