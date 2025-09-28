/**
 * API Response Caching Composable
 *
 * Provides intelligent caching for API responses with configurable TTL.
 * Reduces server load and improves user experience by caching responses
 * for 5-10 minutes depending on the data type.
 */
export interface CacheConfig {
	ttl?: number; // Time to live in milliseconds
	key?: string; // Custom cache key
	force?: boolean; // Force refresh cache
}

interface CachedResponse<T = any> {
	data: T;
	timestamp: number;
	ttl: number;
}

export const useApiCache = () => {
	// In-memory cache store
	const cache = new Map<string, CachedResponse>();

	// Default TTL values (in milliseconds)
	const DEFAULT_TTL = {
		tools: 7 * 60 * 1000, // 7 minutes for tools list
		categories: 10 * 60 * 1000, // 10 minutes for categories (rarely change)
		submissions: 5 * 60 * 1000, // 5 minutes for admin submissions
		featured: 8 * 60 * 1000, // 8 minutes for featured tools
		contact: 5 * 60 * 1000, // 5 minutes for contact submissions
	} as const;

	/**
	 * Generate cache key from URL and parameters
	 */
	const generateCacheKey = (
		url: string,
		params?: Record<string, any>
	): string => {
		const baseKey = url.replace(/^https?:\/\/[^\/]+/, ""); // Remove domain
		if (!params) return baseKey;

		// Sort params for consistent keys
		const sortedParams = Object.keys(params)
			.sort()
			.reduce((acc, key) => {
				if (
					params[key] !== undefined &&
					params[key] !== null &&
					params[key] !== ""
				) {
					acc[key] = params[key];
				}
				return acc;
			}, {} as Record<string, any>);

		const paramString = new URLSearchParams(sortedParams).toString();
		return paramString ? `${baseKey}?${paramString}` : baseKey;
	};

	/**
	 * Check if cached data is still valid
	 */
	const isValid = (cachedItem: CachedResponse): boolean => {
		return Date.now() - cachedItem.timestamp < cachedItem.ttl;
	};

	/**
	 * Get data from cache if valid
	 */
	const getFromCache = <T>(key: string): T | null => {
		const cached = cache.get(key);
		if (!cached) return null;

		if (isValid(cached)) {
			return cached.data as T;
		}

		// Clean up expired cache
		cache.delete(key);
		return null;
	};

	/**
	 * Store data in cache
	 */
	const setCache = <T>(key: string, data: T, ttl: number): void => {
		cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl,
		});

		// Clean up old cache entries periodically
		if (cache.size > 100) {
			const now = Date.now();
			for (const [cacheKey, cached] of cache.entries()) {
				if (now - cached.timestamp > cached.ttl) {
					cache.delete(cacheKey);
				}
			}
		}
	};

	/**
	 * Determine appropriate TTL based on endpoint
	 */
	const getTTL = (url: string, customTtl?: number): number => {
		if (customTtl) return customTtl;

		if (url.includes("/tools")) return DEFAULT_TTL.tools;
		if (url.includes("/categories")) return DEFAULT_TTL.categories;
		if (url.includes("/submissions")) return DEFAULT_TTL.submissions;
		if (url.includes("/featured")) return DEFAULT_TTL.featured;
		if (url.includes("/contact")) return DEFAULT_TTL.contact;

		return DEFAULT_TTL.tools; // Default fallback
	};

	/**
	 * Cached API fetch with automatic cache management
	 */
	const cachedFetch = async <T = any>(
		url: string,
		options?: any,
		config?: CacheConfig
	): Promise<T> => {
		const { ttl: customTtl, key: customKey, force = false } = config || {};

		// Only cache GET requests
		const method = options?.method?.toUpperCase() || "GET";
		if (method !== "GET") {
			return await $fetch<T>(url, options);
		}

		const cacheKey = customKey || generateCacheKey(url, options?.params);
		const ttl = getTTL(url, customTtl);

		// Return cached data if available and not forcing refresh
		if (!force) {
			const cached = getFromCache<T>(cacheKey);
			if (cached) {
				return cached;
			}
		}

		// Fetch fresh data
		try {
			const data = await $fetch<T>(url, options);
			setCache(cacheKey, data, ttl);
			return data;
		} catch (error) {
			// If fetch fails, try to return stale cache as fallback
			const staleCache = cache.get(cacheKey);
			if (staleCache) {
				console.warn("Using stale cache due to fetch error:", error);
				return staleCache.data as T;
			}
			throw error;
		}
	};

	/**
	 * Clear cache entries matching pattern
	 */
	const clearCache = (pattern?: string | RegExp): void => {
		if (!pattern) {
			cache.clear();
			return;
		}

		const regex =
			typeof pattern === "string"
				? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
				: pattern;

		for (const [key] of cache.entries()) {
			if (regex.test(key)) {
				cache.delete(key);
			}
		}
	};

	/**
	 * Invalidate cache for specific endpoints
	 */
	const invalidateCache = (endpoint: string): void => {
		clearCache(endpoint);
	};

	/**
	 * Get cache stats for debugging
	 */
	const getCacheStats = () => {
		const stats = {
			totalEntries: cache.size,
			validEntries: 0,
			expiredEntries: 0,
			cacheKeys: [] as string[],
		};

		const now = Date.now();
		for (const [key, cached] of cache.entries()) {
			stats.cacheKeys.push(key);
			if (now - cached.timestamp < cached.ttl) {
				stats.validEntries++;
			} else {
				stats.expiredEntries++;
			}
		}

		return stats;
	};

	// Cleanup expired cache entries every 5 minutes
	if (process.client) {
		setInterval(() => {
			const now = Date.now();
			for (const [key, cached] of cache.entries()) {
				if (now - cached.timestamp > cached.ttl) {
					cache.delete(key);
				}
			}
		}, 5 * 60 * 1000);
	}

	return {
		cachedFetch,
		clearCache,
		invalidateCache,
		getCacheStats,
		DEFAULT_TTL,
	};
};
