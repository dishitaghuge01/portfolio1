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
      "Designed a post-quantum ticket authentication architecture using Falcon-padded-512 across four Python microservices, replacing ECDSA P-256 with under 1% latency overhead.",
      "Co-authored an IEEE paper on post-quantum migration for large-scale ticketing infrastructure."
    ]
  },
  {
    company: "63 Moons Technologies Ltd.",
    role: "Machine Learning Intern",
    location: "Mumbai, India",
    duration: "June–July 2025",
    bullets: [
      "Built a Legal NER pipeline using spaCy and Doccano across 1,000+ High Court judgments, reducing manual processing by 70%.",
      "Implemented LangChain RAG pipelines with ChromaDB across LegalGPT and judicial audio systems, improving LLM query response time by 30%."
    ]
  }
];
export const achievements = [
  {
    title: "L&T CreaTech 2026 Winner",
    subtitle: "AI-driven Generative Design & Autonomous Construction"
  },
  {
    title: "Smart India Hackathon 2025",
    subtitle: "National Finalist · AI-powered eDNA Taxonomy System"
  },
  {
    title:"Amazon ML Summer School 2026"
  },
  {
    title: "Qualified GATE 2026",
    subtitle: "Score: 37.64/100"
  },
  {
    title: "Working President",
    subtitle: "C.O.S.M.O.S., CSE Department"
  },
  {
    title: "Goethe Zertifikat A1",
    subtitle: "German Language · 81%"
  }
]