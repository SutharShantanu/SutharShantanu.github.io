/**
 * Global API Cache Utility
 *
 * Provides a wrapper around Next.js `unstable_cache` with:
 * - Cache tagging for on-demand revalidation via `revalidateTag()`
 * - Stale-while-error: on cold-start failure, returns fallback data
 * - Typed generics for type-safe cached fetchers
 */

import { unstable_cache } from "next/cache";

/**
 * Creates a cached version of an async fetcher function.
 *
 * @param fetchFn - The async function that fetches data
 * @param cacheKeys - Unique cache key identifiers
 * @param options - Cache options (revalidate time, tags)
 * @returns A cached version of the fetch function
 *
 * @example
 * ```ts
 * const getRepos = createCachedFetcher(
 *   async (username: string) => {
 *     const res = await fetch(`https://api.github.com/users/${username}/repos`);
 *     return res.json();
 *   },
 *   ["github-repos"],
 *   { revalidate: 3600, tags: ["github"] }
 * );
 * ```
 */
export function createCachedFetcher<TArgs extends unknown[], TResult>(
    fetchFn: (...args: TArgs) => Promise<TResult>,
    cacheKeys: string[],
    options: {
        revalidate?: number | false;
        tags?: string[];
    }
): (...args: TArgs) => Promise<TResult> {
    return unstable_cache(fetchFn, cacheKeys, {
        revalidate: options.revalidate,
        tags: options.tags,
    }) as (...args: TArgs) => Promise<TResult>;
}

/**
 * Safely calls a cached fetcher with fallback on error.
 * Used in page.tsx to ensure UI components never break.
 *
 * @param fetchFn - The cached fetcher to call
 * @param fallback - Fallback value if fetcher throws
 * @param label - Label for error logging
 */
export async function safeFetch<T>(
    fetchFn: () => Promise<T>,
    fallback: T,
    label: string
): Promise<T> {
    try {
        return await fetchFn();
    } catch (error) {
        console.error(`[API Cache] Failed to fetch ${label}:`, error);
        return fallback;
    }
}
