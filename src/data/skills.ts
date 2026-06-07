import type { Skill, StarNode } from "../types";

export const radarSkills: Skill[] = [
  { name: "ML", value: 90 },
  { name: "Computer Vision", value: 85 },
  { name: "Backend", value: 75 },
  { name: "Data Eng", value: 80 },
  { name: "Research", value: 88 },
];

export const starNodes: StarNode[] = [
  // ML cluster
  { id: "pytorch", label: "PyTorch", cluster: "ml", x: 20, y: 30 },
  { id: "transformers", label: "Transformers", cluster: "ml", x: 28, y: 18 },
  { id: "cuda", label: "CUDA", cluster: "ml", x: 15, y: 22 },
  { id: "sklearn", label: "Scikit-learn", cluster: "ml", x: 24, y: 42 },

  // CV cluster
  { id: "opencv", label: "OpenCV", cluster: "cv", x: 55, y: 20 },
  { id: "vectorization", label: "Vectorization", cluster: "cv", x: 65, y: 28 },
  { id: "segmentation", label: "Segmentation", cluster: "cv", x: 60, y: 12 },

  // Backend cluster
  { id: "fastapi", label: "FastAPI", cluster: "backend", x: 75, y: 65 },
  { id: "go", label: "Go", cluster: "backend", x: 82, y: 55 },
  { id: "kubernetes", label: "Kubernetes", cluster: "backend", x: 72, y: 75 },

  // Data cluster
  { id: "neo4j", label: "Neo4j", cluster: "data", x: 40, y: 72 },
  { id: "s3", label: "S3 API", cluster: "data", x: 32, y: 80 },
  { id: "graphs", label: "Knowledge Graphs", cluster: "data", x: 48, y: 82 },

  // Research cluster
  { id: "archiintel", label: "ArchiIntel", cluster: "research", x: 50, y: 45 },
  { id: "genesis", label: "GENESIS", cluster: "research", x: 58, y: 52 },
  { id: "ontology", label: "Ontology Engine", cluster: "research", x: 44, y: 55 },
];