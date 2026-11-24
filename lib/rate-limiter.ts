// Sliding-window rate limiter
// In production with multiple serverless instances, this in-memory cache provides
// per-instance protection. For distributed rate-limiting across multi-region serverless,
// Upstash Redis can be plugged in as an adapter.

export interface RateLimitResult {
    allowed: boolean
    limit: number
    remaining: number
    resetTime: number // Unix timestamp (ms)
    retryAfterSeconds: number
}

export class RateLimiter {
    private limits = new Map<string, { timestamps: number[] }>()
    private readonly defaultMaxRequests: number
    private readonly defaultWindowMs: number

    constructor(defaultMaxRequests = 5, defaultWindowMs = 15 * 60 * 1000) {
        this.defaultMaxRequests = defaultMaxRequests
        this.defaultWindowMs = defaultWindowMs
    }

    /**
     * Check if a request from this identifier is allowed under the sliding window.
     */
    check(
        identifier: string,
        maxRequests = this.defaultMaxRequests,
        windowMs = this.defaultWindowMs
    ): RateLimitResult {
        const now = Date.now()
        const windowStart = now - windowMs

        // Evict stale keys when map grows
        if (this.limits.size > 1000) {
            this.cleanup(windowMs)
        }

        const entry = this.limits.get(identifier) || { timestamps: [] }
        // Keep only timestamps within the current sliding window
        const validTimestamps = entry.timestamps.filter((t) => t > windowStart)

        if (validTimestamps.length >= maxRequests) {
            const earliest = validTimestamps[0]
            const resetTime = earliest + windowMs
            const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000))

            this.limits.set(identifier, { timestamps: validTimestamps })

            return {
                allowed: false,
                limit: maxRequests,
                remaining: 0,
                resetTime,
                retryAfterSeconds,
            }
        }

        validTimestamps.push(now)
        this.limits.set(identifier, { timestamps: validTimestamps })

        const earliest = validTimestamps[0]
        const resetTime = earliest + windowMs
        const remaining = Math.max(0, maxRequests - validTimestamps.length)

        return {
            allowed: true,
            limit: maxRequests,
            remaining,
            resetTime,
            retryAfterSeconds: 0,
        }
    }

    /**
     * Backwards-compatible check method.
     */
    isAllowed(identifier: string): { allowed: boolean; resetTime?: number } {
        const res = this.check(identifier)
        return {
            allowed: res.allowed,
            resetTime: res.allowed ? undefined : res.resetTime,
        }
    }

    /**
     * Remaining seconds until rate-limit bucket resets.
     */
    getRemainingTime(identifier: string): number {
        const now = Date.now()
        const entry = this.limits.get(identifier)
        if (!entry || entry.timestamps.length === 0) return 0
        const earliest = entry.timestamps[0]
        const remaining = earliest + this.defaultWindowMs - now
        return Math.max(0, Math.ceil(remaining / 1000))
    }

    /**
     * Clean up expired entries across the map.
     */
    cleanup(maxAgeMs = this.defaultWindowMs): void {
        const now = Date.now()
        for (const [key, entry] of this.limits.entries()) {
            const filtered = entry.timestamps.filter((t) => now - t < maxAgeMs)
            if (filtered.length === 0) {
                this.limits.delete(key)
            } else {
                this.limits.set(key, { timestamps: filtered })
            }
        }
    }

    /**
     * Reset limits (for testing or manual administrative clearing).
     */
    reset(key?: string): void {
        if (key) {
            this.limits.delete(key)
        } else {
            this.limits.clear()
        }
    }
}

// 5 submissions per 15 minutes per IP
export const rateLimiter = new RateLimiter(5, 15 * 60 * 1000)

// 3 submissions per 30 minutes per target recipient email (prevents email bombing/flooding)
export const emailRateLimiter = new RateLimiter(3, 30 * 60 * 1000)
