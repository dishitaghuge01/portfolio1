/**
 * embeddingModel.ts
 *
 * Lazily loads a ~25MB quantized ONNX sentence-embedding model
 * (Xenova/all-MiniLM-L6-v2) directly in the browser via @xenova/transformers.
 * Powers the live semantic search in the Embedding Space visualization
 * (Spread 1) of the book portfolio.
 *
 * The model is fetched from the HuggingFace CDN on first use and is then
 * cached by the browser automatically via the Cache API (handled internally
 * by transformers.js) — subsequent loads in the same browser are instant.
 */

import { pipeline, env } from '@xenova/transformers'

// Always fetch models from the HuggingFace CDN. There are no local model
// files bundled with this project, so local resolution must stay disabled.
env.allowLocalModels = false

export type ModelLoadState = 'idle' | 'loading' | 'ready' | 'error'

let currentState: ModelLoadState = 'idle'
const listeners = new Set<(state: ModelLoadState) => void>()

export function subscribeModelState(callback: (state: ModelLoadState) => void): () => void {
  listeners.add(callback)
  callback(currentState) // immediately call with current state
  return () => listeners.delete(callback)
}

function setState(state: ModelLoadState) {
  currentState = state
  listeners.forEach((cb) => cb(state))
}

export function getModelState(): ModelLoadState {
  return currentState
}

// Singleton: caches the in-flight or completed pipeline-loading promise so
// the model is only ever instantiated once, no matter how many callers ask.
let extractorPromise: Promise<any> | null = null

async function getExtractor() {
  if (!extractorPromise) {
    setState('loading')
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true,
    })
      .then((extractor) => {
        setState('ready')
        return extractor
      })
      .catch((err) => {
        setState('error')
        extractorPromise = null // allow retry on next call
        throw err
      })
  }
  return extractorPromise
}

/**
 * Fire-and-forget warm-up. Triggers the model load without requiring a
 * query and without waiting for completion. Safe to call multiple times —
 * the singleton in getExtractor() ensures the actual load only happens once.
 * Intended to be called proactively (e.g. from a component after a short
 * idle delay) rather than on first user interaction, so the model is
 * already warm by the time it's needed.
 */
export function preloadModel(): void {
  getExtractor().catch(() => {
    // Errors are already reflected via setState('error'); swallow here
    // since this is a background warm-up with no caller awaiting it.
  })
}

/**
 * Embeds a text query into a 384-dimensional vector using mean pooling and
 * L2 normalization (both handled internally by the feature-extraction
 * pipeline via the `pooling` and `normalize` options).
 */
export async function embedQuery(text: string): Promise<number[]> {
  const extractor = await getExtractor()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data as Float32Array)
}