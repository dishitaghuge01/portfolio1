/**
 * similarity.ts
 *
 * Pure functions for semantic similarity search over the pre-computed
 * embedding space (see src/data/embeddingSpace.json). Used by the live
 * query feature on Spread 1's Embedding Space visualization.
 *
 * No side effects, no external dependencies — fully unit-testable in
 * isolation.
 */

export interface EmbeddingNode {
  id: string
  label: string
  cluster: string
  type: 'skill' | 'project'
  x: number
  y: number
  vector: number[]
}

export interface ScoredNode {
  node: EmbeddingNode
  score: number
}

/**
 * Standard cosine similarity: dot(a, b) / (||a|| * ||b||).
 * Returns 0 if either vector has zero magnitude, to avoid division by zero.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `cosineSimilarity: vector length mismatch (a.length=${a.length}, b.length=${b.length}). ` +
        'Both vectors must come from the same embedding model.'
    )
  }

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
  if (magnitude === 0) {
    return 0
  }

  return dot / magnitude
}

/**
 * Scores every node against the query vector and returns the topK
 * highest-scoring nodes, sorted descending by score. Does not mutate
 * the input `nodes` array.
 */
export function findNearestNeighbors(
  queryVector: number[],
  nodes: EmbeddingNode[],
  topK: number = 3
): ScoredNode[] {
  const scored: ScoredNode[] = nodes.map((node) => ({
    node,
    score: cosineSimilarity(queryVector, node.vector),
  }))

  scored.sort((x, y) => y.score - x.score)

  return scored.slice(0, topK)
}

/**
 * Computes a similarity-weighted average position across the given
 * neighbors, so higher-similarity nodes pull the centroid more strongly
 * toward themselves. Falls back to the center of the 0-100 coordinate
 * space ({ x: 50, y: 50 }) if there are no neighbors or if the scores
 * sum to zero.
 */
export function computeWeightedCentroid(neighbors: ScoredNode[]): { x: number; y: number } {
  if (neighbors.length === 0) {
    return { x: 50, y: 50 }
  }

  let weightedX = 0
  let weightedY = 0
  let totalWeight = 0

  for (const { node, score } of neighbors) {
    weightedX += node.x * score
    weightedY += node.y * score
    totalWeight += score
  }

  if (totalWeight === 0) {
    return { x: 50, y: 50 }
  }

  return {
    x: weightedX / totalWeight,
    y: weightedY / totalWeight,
  }
}

/**
 * Returns true if the top neighbor's score exceeds `threshold`. Used by the
 * UI to decide whether to show "no strong matches" versus rendering the
 * query node and connection lines.
 */
export function hasStrongMatch(neighbors: ScoredNode[], threshold: number = 0.2): boolean {
  const topScore = neighbors[0]?.score
  return topScore !== undefined && topScore > threshold
}