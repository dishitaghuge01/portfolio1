export interface SocialLink {
  platform: "github" | "linkedin" | "gmail";
  url: string;
  label: string;
}

export interface TechTag {
  name: string;
}

export interface Project {
  id: string;
  title: string;
  spreadIndex: number; // which spread (3–6)
  description: string;
  techStack: TechTag[];
  liveLink: string;
  imagePlaceholder: string; // color string for placeholder circle
}

export interface Skill {
  name: string;
  value: number; // 0–100
}

export interface Publication {
  title: string;
  venue: string;
  year: number;
  link: string;
}

export interface StarNode {
  id: string;
  label: string;
  cluster: "ml" | "cv" | "backend" | "data" | "research";
  x: number; // 0–100 (percentage)
  y: number; // 0–100
}

export interface SpreadMeta {
  index: number;
  title: string;
  icon: string; // emoji or lucide icon name
}

export type Theme = "dark" | "light";