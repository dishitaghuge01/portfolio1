export interface Project {
  title:            string;
  description:      string;
  techStack:        string[];
  liveLink:         string;
  githubLink:       string;
  imagePlaceholder: string;
  spreadIndex:      number;   // which spread this project belongs to
}

export const projects: Project[] = [
  {
    title:       'ArchiIntel',
    description:
      'A computer vision pipeline that parses architectural floor plans to extract ' +
      'spatial features and generate LLM-powered design improvement suggestions.',
    techStack:        ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'RAG', 'SVG Parsing'],
    liveLink:         '#',
    githubLink:       '#',
    imagePlaceholder: '#1a2a3a',
    spreadIndex:      3,
  },
  {
    title:       'NeuralSearch',
    description:
      'A semantic search engine leveraging transformer embeddings and approximate ' +
      'nearest-neighbour indexing to retrieve documents by conceptual similarity.',
    techStack:        ['Python', 'HuggingFace', 'FAISS', 'FastAPI', 'React', 'Docker'],
    liveLink:         '#',
    githubLink:       '#',
    imagePlaceholder: '#1a1a2e',
    spreadIndex:      3,
  },
  {
    title:       'CloudStore',
    description:
      'A distributed object-storage service with an S3-compatible API, built in Go ' +
      'and deployed on Kubernetes with automatic horizontal scaling.',
    techStack:        ['Go', 'Kubernetes', 'S3 API', 'gRPC', 'PostgreSQL', 'Helm'],
    liveLink:         '#',
    githubLink:       '#',
    imagePlaceholder: '#0d1f2d',
    spreadIndex:      4,
  },
  {
    title:       'GraphMind',
    description:
      'A knowledge-graph platform that ingests unstructured documents, extracts ' +
      'entities and relations via LLMs, and stores them in Neo4j for graph queries.',
    techStack:        ['Python', 'Neo4j', 'LangChain', 'GPT-4', 'Cypher', 'FastAPI'],
    liveLink:         '#',
    githubLink:       '#',
    imagePlaceholder: '#12192b',
    spreadIndex:      4,
  },
];