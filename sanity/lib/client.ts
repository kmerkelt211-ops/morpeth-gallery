import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

type SanityLikeClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>
}

/**
 * If env vars are present, use a real client.
 * If not, export a no-op client so pages can compile and render gracefully.
 */
const fallbackClient: SanityLikeClient = {
  fetch: async <T>() => ([] as unknown as T),
}

export const client: SanityLikeClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'published',
    })
  : fallbackClient

export default client
