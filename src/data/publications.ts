export interface ResearchPaper {
  id: string;
  title: string;
  status: 'under-review' | 'in-progress';
  description: string;
  tags: string[];
  progressPercent?: number;
  expectedVenue?: string;
  link?: string;
}

export const papers: ResearchPaper[] = [
  {
    id: 'ArchIntel-paper',
    title: 'ArchIntel: Graph-Based Spatial Syntax for Multi-Dimensional Floorplan Quality Scoring',
    status: 'under-review',
    description:
      'Proposes a graph-theoretic framework for encoding architectural floor plans as ' +
      'spatial syntax graphs, extracting 25 multi-dimensional quality metrics across ' +
      'circulation, zoning, adjacency, and spatial syntax dimensions to produce a ' +
      'unified Design Quality Index (DQI).',
    tags: ['Computer Vision', 'Graph ML', 'Spatial AI', 'Architecture'],
    link: '#',
  },
  {
    id: 'pqc-paper',
    title:
      'Post-Quantum Cryptographic Authentication and Anti-Forgery Framework for ' +
      'Printed Indian Railways Tickets',
    status: 'in-progress',
    description:
      'Designs a quantum-resistant authentication system for physical railway tickets ' +
      'using lattice-based cryptography and steganographic anti-forgery markers, ' +
      'resilient against both classical and quantum adversaries.',
    tags: ['Post-Quantum Cryptography', 'Lattice Cryptography', 'Network Security'],
    progressPercent: 45,
    expectedVenue: 'IEEE Security & Privacy 2026',
  },
];