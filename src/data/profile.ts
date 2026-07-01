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
    company: "Dept. of CSE, SVNIT Surat",
    role: "Research Intern (under Dr. Balu Parne)",
    location: "Surat, India",
    duration: "May 2026 – July 2026",
    bullets: [
      "Designed a post-quantum ticket authentication architecture using Falcon-padded-512 (FIPS 206/FN-DSA) across four Python microservices, replacing ECDSA P-256 while keeping verification under 1% of ticket-processing latency.",
      "Evaluated DataMatrix ECC200 capacity with libdmtx, showing ML-DSA-44 exceeds the 1556-byte limit and Falcon-padded-512 is the only NIST-track scheme suitable for offline barcode authentication.",
      "Built an attack-defense model for fabrication, cloning, tampering, and impersonation, showing cloning requires audit-layer UUID deduplication beyond cryptographic verification.",
      "Co-authored an IEEE paper showing post-quantum migration."
    ]
  },
  {
    company: "63 Moons Technologies Ltd.",
    role: "Machine Learning Intern",
    location: "Mumbai, India",
    duration: "June–July 2025",
    bullets: [
      "Built a Legal Entity Extraction (NER) pipeline using spaCy and Doccano for 1,000+ High Court judgments, reducing manual processing by 70%.",
      "Contributed to District Court APIs, Judicial Gateway, LegalGPT, and a Whisper + Azure speech-to-text pipeline processing 500+ legal audio files.",
      "Implemented LangChain-based RAG pipelines with ChromaDB, improving LLM query response time by 30%."
    ]
  }
];
export const achievements = [
  { icon: "⬡", title: "Smart India Hackathon 2025", subtitle: "Finalist — DNABERT, UMAP & HDBSCAN" },
  { icon: "✦", title: "High Recommendation", subtitle: "Order of Zenith — Maharashtra Legislative Assembly" },
  { icon: "◈", title: "Special Mention", subtitle: "YCCExMUN — AIPPM Committee" },
  { icon: "◉", title: "Goethe Zertifikat A1", subtitle: "German Language · 81%" },
  { icon: "⬢", title: "Joint Treasurer", subtitle: "C.O.S.M.O.S. CSE Dept · 2025–26" },
];