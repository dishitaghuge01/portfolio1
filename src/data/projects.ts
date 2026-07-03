export interface Project {
  title:            string;
  description:      string;
  bullets:          string[];
  techStack:        string[];
  liveLink:         string;
  githubLink:       string;
  imagePlaceholder: string;
  spreadIndex:      number;   // which spread this project belongs to
}

export const projects: Project[] = [
  {
    title: 'Railway PQ-Auth',
    description:
      'A post-quantum cryptographic authentication system for printed Indian Railway tickets. ' +
      'Designed a custom wire protocol to pack a Falcon-512 signature and a public key fingerprint are encoded into a DataMatrix barcode.',
    bullets: [
      'Built 4 independent FastAPI microservices (Signing Authority, HSM Simulator, Ticket Issuer, Verifier) with a CLI driving the full ticket lifecycle',
      'Engineered a binary wire format with a 3-byte magic header to pack PQC signatures within DataMatrix capacity constraints',
      'Wrote 32 unit tests covering signature generation, verification, tamper detection, and encoding edge cases',
      'It is an upgrade to Railway-Auth <a href="https://github.com/dishitaghuge01/railway-auth-demo" target="_blank" rel="noreferrer">GitHub repo</a>',
    ],
    techStack: ['Python', 'FastAPI', 'Falcon-512', 'liboqs', 'DataMatrix', 'pytest'],
    liveLink: '#',
    githubLink: 'https://github.com/dishitaghuge01/railway-pq-auth-demo',
    imagePlaceholder: '#0d1a2e',
    spreadIndex: 3,
  },
  {
    title: 'ArchIntel',
    description:
      'An ML pipeline that evaluates architectural floorplan quality from SVG inputs using a custom ' +
      'Design Quality Index, a 5-dimension weighted score covering spatial efficiency, circulation flow, ' +
      'room proportionality, natural light, and structural balance.',
    bullets: [
      'Parses SVG floorplans to extract spatial features, then runs regression models trained on a 1000+ floorplan dataset to score each DQI dimension',
      'Models graph-based spatial syntax using NetworkX to quantify connectivity and circulation flow between rooms',
      'Serves predictions and LLM-generated design feedback via FastAPI integrated with the Groq API',
      'End-to-end pipeline from raw SVG ingestion → feature extraction → scoring → NLP explanation, accessible via REST',
    ],
    techStack: ['Python', 'scikit-learn', 'NetworkX', 'OpenCV', 'FastAPI', 'Groq API'],
    liveLink: '#',
    githubLink: 'https://github.com/dishitaghuge01/ArchIntel',
    imagePlaceholder: '#1a2a1a',
    spreadIndex: 3,
  },
  {
    title: 'Nexus Storage',
    description:
      'A multi-tenant cloud storage platform with direct-to-S3 presigned uploads, ' +
      'Redis-backed real-time usage metering, and automated billing triggered by consumption thresholds. ' +
      'Handles per-tenant isolation, background metering workers, and Razorpay invoice generation.',
    bullets: [
      'Presigned S3 URL flow for direct client-to-cloud uploads, bypassing server bandwidth bottlenecks entirely',
      'Redis-backed event metering pipeline with background workers tracking per-tenant storage usage in real time',
      'Razorpay integration for automated invoice generation triggered by metered usage thresholds',
      'Full-stack: React 18 + TypeScript + Tailwind + React Query frontend with JWT-based multi-tenant auth',
    ],
    techStack: ['Python', 'FastAPI', 'AWS S3', 'Redis', 'PostgreSQL', 'React', 'TypeScript'],
    liveLink: '#',
    githubLink: 'https://github.com/dishitaghuge01/cloud_storage_billing_engine',
    imagePlaceholder: '#0d1f2d',
    spreadIndex: 4,
  },
  {
    title: 'High Court NER',
    description:
      'An NLP pipeline for named entity extraction from Indian High Court judgements — ' +
      'a domain where off-the-shelf models fail due to specialised legal vocabulary. ' +
      'Covers PDF ingestion, preprocessing, and a Doccano annotation workflow feeding a fine-tuned spaCy NER model.',
    bullets: [
      'Ingests raw High Court PDFs and strips legal boilerplate, citations, and formatting artifacts before entity extraction',
      'Custom entity schema for the legal domain: judges, petitioners, respondents, case numbers, statutes, and dates',
      'Annotation pipeline built on Doccano to produce gold-standard training data for fine-tuning spaCy\'s NER component',
      'Targets a real data gap — Indian legal NLP has almost no labeled datasets, making this both a tool and a dataset contribution',
    ],
    techStack: ['Python', 'spaCy', 'Doccano', 'PyMuPDF', 'pandas'],
    liveLink: '#',
    githubLink: 'https://github.com/dishitaghuge01/high-court-ner-pipeline',
    imagePlaceholder: '#1a1a0d',
    spreadIndex: 4,
  },
];