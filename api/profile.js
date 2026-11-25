import fs from 'fs';
import path from 'path';
import { isRedisConfigured, redisGet, redisSet } from './_redis.js';

const REDIS_KEY = 'cine_portfolio:profile';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const usingRedis = isRedisConfigured();
  res.setHeader('X-Storage-Mode', usingRedis ? 'redis' : 'static');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'data', 'profile.json');

  const readFileProfile = () => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Error reading profile.json:', e);
    }
    return {};
  };

  const writeFileProfile = (data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (_) {
      // Read-only filesystem on Vercel serverless — safe to ignore
    }
  };

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body) {
        if (usingRedis) {
          await redisSet(REDIS_KEY, body);
        }
        writeFileProfile(body);
        return res.status(200).json(body);
      }
    } catch (err) {
      console.error('Error handling profile POST:', err);
      return res.status(500).json({ error: 'Failed to save profile' });
    }
  }

  // GET
  if (usingRedis) {
    const cached = await redisGet(REDIS_KEY);
    if (cached && cached.name) {
      return res.status(200).json(cached);
    }
    // First run: seed Redis from bundled profile.json
    const seed = readFileProfile();
    if (seed && seed.name) {
      await redisSet(REDIS_KEY, seed);
    }
    return res.status(200).json(seed);
  }

  return res.status(200).json(readFileProfile());
}
