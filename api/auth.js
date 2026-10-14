import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let passcode = '';
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      passcode = body?.passcode || '';
    } catch {
      passcode = req.body?.passcode || '';
    }

    let validPass = 'cinema2026';
    try {
      const authPath = path.join(process.cwd(), 'data', 'auth.json');
      if (fs.existsSync(authPath)) {
        const fileContent = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
        validPass = fileContent.passcode || validPass;
      }
    } catch (e) {
      console.error(e);
    }

    if (passcode === validPass) {
      return res.status(200).json({ success: true, token: 'session_' + Date.now() });
    }
    return res.status(401).json({ error: 'Invalid passcode' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
