import type { SocialLink } from "../types";

export const profile = {
  name: "Dishita Ghuge",
  title: "ML Engineer",
  tagline: "Building architectural intelligence through latent space analysis",
  avatar: null, // will be replaced with image path later
};

export const socialLinks: SocialLink[] = [
  {
    platform: "github",
    url: "https://github.com/dishitaghuge01",
    label: "GitHub",
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/dishitaghuge/",
    label: "LinkedIn",
  },
  {
    platform: "gmail",
    url: "mailto:ghugedishita@gmail.com",
    label: "Gmail",
  },
];

export const education = [
  {
    institution: "Yeshwantrao Chavan College of Engineering",
    degree: "B.Tech Computer Science & Engineering",
    minor: "Minor in Robotics & CIM",
    location: "Nagpur, India",
    duration: "2023–2027",
    cgpa: "9.01",
  },
];

export const experience = [
  {
    company: "63 Moons Technologies Ltd.",
    role: "Machine Learning Intern",
    location: "Mumbai, India",
    duration: "June–July 2025",
    bullets: [
      "Built end-to-end Legal Entity Extraction pipeline using spaCy and Doccano, processing 1,000+ High Court judgments with 85% F1-score",
      "Implemented LangChain RAG workflows with ChromaDB, improving LLM query response time by 30%",
      "Contributed to speech-to-text pipeline using Whisper and Azure, processing 500+ audio files",
      "Worked with FastAPI, PostgreSQL, Redis, Kafka, Docker, and Kubernetes",
    ],
  },
];

export const achievements = [
  { icon: "⬡", title: "Smart India Hackathon 2025", subtitle: "Finalist — DNABERT, UMAP & HDBSCAN" },
  { icon: "✦", title: "High Recommendation", subtitle: "Order of Zenith — Maharashtra Legislative Assembly" },
  { icon: "◈", title: "Special Mention", subtitle: "YCCExMUN — AIPPM Committee" },
  { icon: "◉", title: "Goethe Zertifikat A1", subtitle: "German Language · 81%" },
  { icon: "⬢", title: "Joint Treasurer", subtitle: "C.O.S.M.O.S. CSE Dept · 2025–26" },
];