import fs from 'fs';
import path from 'path';
import { isRedisConfigured, redisGet, redisSet } from './_redis.js';

const REDIS_KEY = 'cine_portfolio:brands';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const usingRedis = isRedisConfigured();
  res.setHeader('X-Storage-Mode', usingRedis ? 'redis' : 'static');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'data', 'brands.json');

  const readFileBrands = () => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Could not read brands.json:', e);
    }
    return [];
  };

  const writeFileBrands = (data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (_) {
      // Read-only filesystem on Vercel serverless — safe to ignore
    }
  };

  const readBrands = async () => {
    if (usingRedis) {
      const cached = await redisGet(REDIS_KEY);
      if (Array.isArray(cached)) {
        return cached;
      }
      // First run: seed Redis from bundled brands.json
      const seed = readFileBrands();
      if (seed.length > 0) {
        await redisSet(REDIS_KEY, seed);
      }
      return seed;
    }
    return readFileBrands();
  };

  const writeBrands = async (data) => {
    if (usingRedis) {
      await redisSet(REDIS_KEY, data);
    }
    writeFileBrands(data);
  };

  const parseBody = () => {
    if (!req.body) return null;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  };

  if (req.method === 'POST') {
    try {
      const body = parseBody();
      if (body) {
        // Bulk sync from client local cache to cloud
        if (body.syncAll && Array.isArray(body.syncAll)) {
          await writeBrands(body.syncAll);
          return res.status(200).json(body.syncAll);
        }

        const current = await readBrands();

        // Check if reordering
        if (body.orderedBrands && Array.isArray(body.orderedBrands)) {
          const reordered = body.orderedBrands.map((b, i) => ({ ...b, order: i + 1 }));
          await writeBrands(reordered);
          return res.status(200).json(reordered);
        }

        const brandData = body;
        const idx = current.findIndex((b) => b.id === brandData.id);
        let saved;
        if (idx >= 0) {
          saved = { ...current[idx], ...brandData };
          current[idx] = saved;
        } else {
          saved = {
            ...brandData,
            id: brandData.id || `brand-${Date.now()}`,
            order: current.length + 1,
            createdAt: brandData.createdAt || new Date().toISOString().split('T')[0],
          };
          current.push(saved);
        }

        await writeBrands(current);
        return res.status(200).json(saved);
      }
    } catch (err) {
      console.error('Error handling brands POST:', err);
      return res.status(500).json({ error: 'Failed to save brand' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const body = parseBody();
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const urlId =
        urlParts.length > 2 && urlParts[urlParts.length - 1] !== 'brands'
          ? urlParts[urlParts.length - 1]
          : null;
      const targetId = req.query?.id || (typeof body === 'object' && body?.id) || urlId;

      if (targetId) {
        const current = await readBrands();
        const filtered = current.filter((b) => b.id !== targetId);
        await writeBrands(filtered);
        return res.status(200).json({ success: true, id: targetId });
      }
    } catch (err) {
      console.error('Error handling brands DELETE:', err);
      return res.status(500).json({ error: 'Failed to delete brand' });
    }
  }

  // GET
  const brands = await readBrands();
  return res.status(200).json(brands);
}
