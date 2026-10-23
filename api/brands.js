import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'data', 'brands.json');

  if (req.method === 'POST') {
    try {
      if (req.body) {
        try {
          let current = [];
          if (fs.existsSync(filePath)) {
            current = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          }
          if (req.body.orderedBrands) {
            const reordered = req.body.orderedBrands.map((b, i) => ({ ...b, order: i + 1 }));
            fs.writeFileSync(filePath, JSON.stringify(reordered, null, 2), 'utf-8');
            return res.status(200).json(reordered);
          }
          const brandData = req.body;
          const idx = current.findIndex(b => b.id === brandData.id);
          let saved;
          if (idx >= 0) {
            saved = { ...current[idx], ...brandData };
            current[idx] = saved;
          } else {
            saved = {
              ...brandData,
              id: brandData.id || `brand-${Date.now()}`,
              order: current.length + 1,
              createdAt: new Date().toISOString().split('T')[0],
            };
            current.push(saved);
          }
          fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');
          return res.status(200).json(saved);
        } catch (_) {}
        return res.status(200).json(req.body);
      }
    } catch (err) {
      console.error('Error handling brands POST:', err);
    }
  }

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }
  } catch (err) {
    console.error('Error reading brands.json:', err);
  }

  return res.status(200).json([]);
}
