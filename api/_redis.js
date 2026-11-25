/**
 * Lightweight Upstash Redis / Vercel KV REST client (zero external dependencies).
 * Automatically detects UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * or KV_REST_API_URL / KV_REST_API_TOKEN from environment variables.
 */

function getRedisCredentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

export function isRedisConfigured() {
  return getRedisCredentials() !== null;
}

export async function redisGet(key) {
  const creds = getRedisCredentials();
  if (!creds) return null;

  try {
    const res = await fetch(creds.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', key]),
    });

    if (!res.ok) {
      console.warn(`[Redis] GET ${key} failed with status ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (data && typeof data.result === 'string') {
      return JSON.parse(data.result);
    }
    return data?.result ?? null;
  } catch (err) {
    console.warn(`[Redis] GET ${key} error:`, err);
    return null;
  }
}

export async function redisSet(key, value) {
  const creds = getRedisCredentials();
  if (!creds) return false;

  try {
    const res = await fetch(creds.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', key, JSON.stringify(value)]),
    });

    if (!res.ok) {
      console.warn(`[Redis] SET ${key} failed with status ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Redis] SET ${key} error:`, err);
    return false;
  }
}
