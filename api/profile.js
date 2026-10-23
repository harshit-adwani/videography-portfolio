import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'data', 'profile.json');

  if (req.method === 'POST') {
    try {
      if (req.body) {
        try {
          fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
        } catch (_) {}
        return res.status(200).json(req.body);
      }
    } catch (err) {
      console.error('Error handling profile POST:', err);
    }
  }

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }
  } catch (err) {
    console.error('Error reading profile.json:', err);
  }

  return res.status(200).json({});
}
