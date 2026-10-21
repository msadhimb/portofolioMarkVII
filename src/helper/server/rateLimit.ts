type RateLimitBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitBucket>()
const MAX_BUCKETS = 10_000

export const isRateLimited = (
  key: string,
  limit = 60,
  windowMs = 60_000
): boolean => {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size > MAX_BUCKETS) buckets.clear()
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (bucket.count >= limit) return true

  bucket.count += 1
  return false
}
