import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

type SanityLikeClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>;
};

/**
 * If env vars are present, use a real client.
 * If not, export a no-op client so pages can compile and render gracefully.
 */
const fallbackClient: SanityLikeClient = {
  fetch: async <T>() => ([] as unknown as T),
};

export const client: SanityLikeClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : fallbackClient;

export default client;
