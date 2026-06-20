import type { Skill, StarNode } from "../types";

export const radarSkills: Skill[] = [
  { name: "ML/AI", value: 85 },
  { name: "Security/Crypto", value: 80 },
  { name: "Backend", value: 78 },
  { name: "NLP", value: 75 },
  { name: "Research", value: 88 },
];

export const starNodes: StarNode[] = [
  // ML cluster
  { id: "sklearn", label: "Scikit-learn", cluster: "ml", x: 18, y: 28 },
  { id: "numpy", label: "NumPy", cluster: "ml", x: 24, y: 18 },
  { id: "pandas", label: "Pandas", cluster: "ml", x: 12, y: 38 },
  { id: "regression", label: "Regression Models", cluster: "ml", x: 28, y: 44 },
  { id: "dqi", label: "Custom Scoring Systems", cluster: "ml", x: 20, y: 52 },
  { id: "groq", label: "Groq API", cluster: "ml", x: 10, y: 20 },

  // CV / Spatial cluster
  { id: "opencv", label: "OpenCV", cluster: "cv", x: 58, y: 18 },
  { id: "svgparse", label: "SVG Parsing", cluster: "cv", x: 68, y: 10 },
  { id: "networkx", label: "NetworkX", cluster: "cv", x: 50, y: 12 },
  { id: "spatial", label: "Spatial Analysis", cluster: "cv", x: 64, y: 28 },
  { id: "floorplan", label: "Floorplan Feature Extraction", cluster: "cv", x: 74, y: 20 },

  // Security / Crypto cluster
  { id: "falcon512", label: "Falcon-512 / FN-DSA", cluster: "crypto", x: 80, y: 55 },
  { id: "liboqs", label: "liboqs", cluster: "crypto", x: 88, y: 45 },
  { id: "pqc", label: "Post-Quantum Crypto", cluster: "crypto", x: 76, y: 42 },
  { id: "datamatrix", label: "DataMatrix Barcodes", cluster: "crypto", x: 85, y: 65 },
  { id: "wireprotocol", label: "Wire Protocol Design", cluster: "crypto", x: 78, y: 72 },
  { id: "hsm", label: "HSM Simulation", cluster: "crypto", x: 90, y: 58 },
  { id: "ecdsa", label: "ECDSA", cluster: "crypto", x: 72, y: 62 },

  // Backend cluster
  { id: "fastapi", label: "FastAPI", cluster: "backend", x: 55, y: 70 },
  { id: "microservices", label: "Microservices", cluster: "backend", x: 48, y: 78 },
  { id: "redis", label: "Redis", cluster: "backend", x: 62, y: 80 },
  { id: "postgresql", label: "PostgreSQL", cluster: "backend", x: 70, y: 75 },
  { id: "s3", label: "AWS S3", cluster: "backend", x: 58, y: 88 },
  { id: "razorpay", label: "Razorpay API", cluster: "backend", x: 44, y: 85 },
  { id: "jwt", label: "JWT Auth", cluster: "backend", x: 66, y: 88 },
  { id: "pytest", label: "pytest", cluster: "backend", x: 76, y: 84 },

  // NLP / Legal AI cluster
  { id: "spacy", label: "spaCy", cluster: "nlp", x: 22, y: 70 },
  { id: "ner", label: "Named Entity Recognition", cluster: "nlp", x: 14, y: 60 },
  { id: "doccano", label: "Doccano", cluster: "nlp", x: 30, y: 78 },
  { id: "pymupdf", label: "PyMuPDF", cluster: "nlp", x: 20, y: 82 },
  { id: "legalai", label: "Legal NLP", cluster: "nlp", x: 10, y: 72 },
  { id: "finetuning", label: "NER Fine-tuning", cluster: "nlp", x: 34, y: 68 },

  // Research cluster
  { id: "archintel", label: "ArchIntel", cluster: "research", x: 42, y: 35 },
  { id: "railwaypq", label: "Railway PQ-Auth", cluster: "research", x: 50, y: 44 },
  { id: "adversarial", label: "Adversarial Attacks (AV)", cluster: "research", x: 36, y: 48 },
  { id: "paperwriting", label: "Research Paper Writing", cluster: "research", x: 44, y: 55 },
  { id: "svnit", label: "SVNIT Internship", cluster: "research", x: 52, y: 30 },
];