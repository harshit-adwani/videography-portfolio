import fs from 'fs';
import path from 'path';
import { isRedisConfigured, redisGet, redisSet } from './_redis.js';

const REDIS_KEY = 'cine_portfolio:projects';

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

  const filePath = path.join(process.cwd(), 'data', 'projects.json');

  const readFileProjects = () => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Could not read projects.json:', e);
    }
    return [];
  };

  const writeFileProjects = (data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (_) {
      // Read-only filesystem on Vercel serverless — safe to ignore
    }
  };

  const readProjects = async () => {
    if (usingRedis) {
      const cached = await redisGet(REDIS_KEY);
      if (Array.isArray(cached)) {
        return cached;
      }
      // First run: seed Redis from bundled projects.json
      const seed = readFileProjects();
      if (seed.length > 0) {
        await redisSet(REDIS_KEY, seed);
      }
      return seed;
    }
    return readFileProjects();
  };

  const writeProjects = async (data) => {
    if (usingRedis) {
      await redisSet(REDIS_KEY, data);
    }
    writeFileProjects(data);
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
          await writeProjects(body.syncAll);
          return res.status(200).json(body.syncAll);
        }

        const current = await readProjects();

        // Check if reordering
        if (body.orderedProjects && Array.isArray(body.orderedProjects)) {
          const reordered = body.orderedProjects.map((p, i) => ({ ...p, order: i + 1 }));
          await writeProjects(reordered);
          return res.status(200).json(reordered);
        }

        const projectData = body;
        const idx = current.findIndex((p) => p.id === projectData.id);
        let saved;
        if (idx >= 0) {
          saved = { ...current[idx], ...projectData };
          current[idx] = saved;
        } else {
          saved = {
            ...projectData,
            id: projectData.id || `proj-${Date.now()}`,
            order: current.length + 1,
            createdAt: projectData.createdAt || new Date().toISOString().split('T')[0],
          };
          current.push(saved);
        }

        await writeProjects(current);
        return res.status(200).json(saved);
      }
    } catch (err) {
      console.error('Error handling projects POST:', err);
      return res.status(500).json({ error: 'Failed to save project' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const body = parseBody();
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const urlId =
        urlParts.length > 2 && urlParts[urlParts.length - 1] !== 'projects'
          ? urlParts[urlParts.length - 1]
          : null;
      const targetId = req.query?.id || (typeof body === 'object' && body?.id) || urlId;

      if (targetId) {
        const current = await readProjects();
        const filtered = current.filter((p) => p.id !== targetId);
        await writeProjects(filtered);
        return res.status(200).json({ success: true, id: targetId });
      }
    } catch (err) {
      console.error('Error handling projects DELETE:', err);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  // GET
  const projects = await readProjects();
  return res.status(200).json(projects);
}
