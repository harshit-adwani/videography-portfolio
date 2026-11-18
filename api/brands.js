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

  const readBrands = () => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Could not read brands.json:', e);
    }
    return [];
  };

  if (req.method === 'POST') {
    try {
      if (req.body) {
        const current = readBrands();

        // Check if reordering
        if (req.body.orderedBrands && Array.isArray(req.body.orderedBrands)) {
          const reordered = req.body.orderedBrands.map((b, i) => ({ ...b, order: i + 1 }));
          try {
            fs.writeFileSync(filePath, JSON.stringify(reordered, null, 2), 'utf-8');
          } catch (_) {}
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

        try {
          fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');
        } catch (_) {}
        return res.status(200).json(saved);
      }
    } catch (err) {
      console.error('Error handling brands POST:', err);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const urlId = urlParts.length > 2 && urlParts[urlParts.length - 1] !== 'brands' ? urlParts[urlParts.length - 1] : null;
      const targetId = req.query?.id || (typeof req.body === 'object' && req.body?.id) || urlId;

      if (targetId) {
        const current = readBrands();
        const filtered = current.filter(b => b.id !== targetId);
        try {
          fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
        } catch (_) {}
        return res.status(200).json({ success: true, id: targetId });
      }
    } catch (err) {
      console.error('Error handling brands DELETE:', err);
    }
  }

  // GET
  const brands = readBrands();
  return res.status(200).json(brands);
}
