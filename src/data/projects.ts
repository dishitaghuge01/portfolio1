import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "archiintel",
    title: "ArchiIntel",
    spreadIndex: 3,
    description: "Automated floorplan vectorization and structural analysis.",
    techStack: [
      { name: "PyTorch" },
      { name: "OpenCV" },
      { name: "CUDA" },
    ],
    liveLink: "#",
    imagePlaceholder: "#2a4a6b",
  },
  {
    id: "genesis",
    title: "GENESIS",
    spreadIndex: 4,
    description: "Generative engine for synthetic architectural datasets.",
    techStack: [
      { name: "Transformers" },
      { name: "HuggingFace" },
      { name: "FastAPI" },
    ],
    liveLink: "#",
    imagePlaceholder: "#3b2a6b",
  },
  {
    id: "nexus-storage",
    title: "Nexus Storage",
    spreadIndex: 5,
    description: "Distributed high-throughput storage for ML model checkpoints.",
    techStack: [
      { name: "Go" },
      { name: "Kubernetes" },
      { name: "S3 API" },
    ],
    liveLink: "#",
    imagePlaceholder: "#1a5a4a",
  },
  {
    id: "global-ontology",
    title: "Global Ontology Engine",
    spreadIndex: 6,
    description: "Mapping the world's structural knowledge via graph embeddings.",
    techStack: [
      { name: "Knowledge Graphs" },
      { name: "Neo4j" },
      { name: "LLMs" },
    ],
    liveLink: "#",
    imagePlaceholder: "#5a3a1a",
  },
];