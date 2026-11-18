import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'data', 'projects.json');

  // Helper to load current file projects
  const readProjects = () => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Could not read projects.json:', e);
    }
    return [];
  };

  if (req.method === 'POST') {
    try {
      if (req.body) {
        const current = readProjects();

        // Check if reordering
        if (req.body.orderedProjects && Array.isArray(req.body.orderedProjects)) {
          const reordered = req.body.orderedProjects.map((p, i) => ({ ...p, order: i + 1 }));
          try {
            fs.writeFileSync(filePath, JSON.stringify(reordered, null, 2), 'utf-8');
          } catch (_) {}
          return res.status(200).json(reordered);
        }

        const projectData = req.body;
        const idx = current.findIndex(p => p.id === projectData.id);
        let saved;
        if (idx >= 0) {
          saved = { ...current[idx], ...projectData };
          current[idx] = saved;
        } else {
          saved = {
            ...projectData,
            id: projectData.id || `proj-${Date.now()}`,
            order: current.length + 1,
            createdAt: new Date().toISOString().split('T')[0],
          };
          current.push(saved);
        }

        try {
          fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');
        } catch (_) {}
        return res.status(200).json(saved);
      }
    } catch (err) {
      console.error('Error handling projects POST:', err);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const urlId = urlParts.length > 2 && urlParts[urlParts.length - 1] !== 'projects' ? urlParts[urlParts.length - 1] : null;
      const targetId = req.query?.id || (typeof req.body === 'object' && req.body?.id) || urlId;

      if (targetId) {
        const current = readProjects();
        const filtered = current.filter(p => p.id !== targetId);
        try {
          fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
        } catch (_) {}
        return res.status(200).json({ success: true, id: targetId });
      }
    } catch (err) {
      console.error('Error handling projects DELETE:', err);
    }
  }

  // GET
  const projects = readProjects();
  return res.status(200).json(projects);
}
