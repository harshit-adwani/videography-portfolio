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

  if (req.method === 'POST') {
    try {
      if (req.body) {
        let current = [];
        if (fs.existsSync(filePath)) {
          current = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        if (req.body.orderedProjects) {
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

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }
  } catch (err) {
    console.error('Error reading projects.json:', err);
  }

  return res.status(200).json([]);
}
