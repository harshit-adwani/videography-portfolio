import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure directories exist
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'public', 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const postersDir = path.join(uploadsDir, 'posters');
const avatarsDir = path.join(uploadsDir, 'avatars');
const brandLogosDir = path.join(uploadsDir, 'brands');

[dataDir, uploadsDir, videosDir, postersDir, avatarsDir, brandLogosDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const projectsFilePath = path.join(dataDir, 'projects.json');
const brandsFilePath = path.join(dataDir, 'brands.json');
const profileFilePath = path.join(dataDir, 'profile.json');
const authFilePath = path.join(dataDir, 'auth.json');

// Initialize auth.json if not present
if (!fs.existsSync(authFilePath)) {
  fs.writeFileSync(authFilePath, JSON.stringify({ passcode: 'cinema2026' }, null, 2));
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// --- MULTER STORAGE CONFIGURATIONS ---
const makeStorage = (destFolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destFolder);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const cleanName = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
      cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
    },
  });

const uploadVideo = multer({ storage: makeStorage(videosDir) });
const uploadPoster = multer({ storage: makeStorage(postersDir) });
const uploadAvatar = multer({ storage: makeStorage(avatarsDir) });
const uploadBrandLogo = multer({ storage: makeStorage(brandLogosDir) });

// Helper to read/write JSON safely
const readJson = (file, defaultVal = []) => {
  try {
    if (!fs.existsSync(file)) return defaultVal;
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultVal;
  }
};

const writeJson = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
};

// --- FILE UPLOAD ENDPOINTS ---
app.post('/api/upload/video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }
  const relativeUrl = `/uploads/videos/${req.file.filename}`;
  res.json({ url: relativeUrl, filename: req.file.filename });
});

app.post('/api/upload/poster', uploadPoster.single('poster'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No poster file provided' });
  }
  const relativeUrl = `/uploads/posters/${req.file.filename}`;
  res.json({ url: relativeUrl, filename: req.file.filename });
});

app.post('/api/upload/avatar', uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No avatar file provided' });
  }
  const relativeUrl = `/uploads/avatars/${req.file.filename}`;
  res.json({ url: relativeUrl, filename: req.file.filename });
});

app.post('/api/upload/brand-logo', uploadBrandLogo.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No brand logo file provided' });
  }
  const relativeUrl = `/uploads/brands/${req.file.filename}`;
  res.json({ url: relativeUrl, filename: req.file.filename });
});

// --- PROJECTS CRUD ---
app.get('/api/projects', (req, res) => {
  const projects = readJson(projectsFilePath, []);
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const currentProjects = readJson(projectsFilePath, []);
  const projectData = req.body;

  if (!projectData.title) {
    return res.status(400).json({ error: 'Project title is required' });
  }

  let savedProject;
  const existingIdx = currentProjects.findIndex((p) => p.id === projectData.id);

  if (existingIdx >= 0) {
    // Update existing
    savedProject = {
      ...currentProjects[existingIdx],
      ...projectData,
      slug:
        projectData.slug ||
        projectData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
    };
    currentProjects[existingIdx] = savedProject;
  } else {
    // Create new
    const id = projectData.id || `proj-${Date.now()}`;
    savedProject = {
      id,
      title: projectData.title,
      slug:
        projectData.slug ||
        projectData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      category: projectData.category || 'Commercial',
      client: projectData.client || '',
      year: projectData.year || new Date().getFullYear().toString(),
      runtime: projectData.runtime || '01:00',
      aspectRatio: projectData.aspectRatio || '16:9',
      roles: projectData.roles?.length ? projectData.roles : ['Director', 'Editor'],
      cameraGear: projectData.cameraGear || 'Cinema Camera Rig',
      editingSoftware: projectData.editingSoftware || 'DaVinci Resolve Studio',
      videoUrl: projectData.videoUrl || '',
      previewUrl: projectData.previewUrl || projectData.videoUrl || '',
      posterUrl:
        projectData.posterUrl ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      description: projectData.description || '',
      links: projectData.links || [],
      featured: projectData.featured ?? false,
      isPublished: projectData.isPublished ?? true,
      order: currentProjects.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    currentProjects.push(savedProject);
  }

  writeJson(projectsFilePath, currentProjects);
  res.json(savedProject);
});

app.delete('/api/projects/:id', (req, res) => {
  const currentProjects = readJson(projectsFilePath, []);
  const filtered = currentProjects.filter((p) => p.id !== req.params.id);
  writeJson(projectsFilePath, filtered);
  res.json({ success: true, count: filtered.length });
});

app.post('/api/projects/reorder', (req, res) => {
  const { orderedProjects } = req.body;
  if (Array.isArray(orderedProjects)) {
    const reordered = orderedProjects.map((p, idx) => ({ ...p, order: idx + 1 }));
    writeJson(projectsFilePath, reordered);
    return res.json(reordered);
  }
  res.status(400).json({ error: 'orderedProjects array required' });
});

// --- BRANDS & CREATORS CRUD ---
app.get('/api/brands', (req, res) => {
  const brands = readJson(brandsFilePath, []);
  res.json(brands);
});

app.post('/api/brands', (req, res) => {
  const currentBrands = readJson(brandsFilePath, []);
  const brandData = req.body;

  if (!brandData.name) {
    return res.status(400).json({ error: 'Brand name is required' });
  }

  const existingIdx = currentBrands.findIndex((b) => b.id === brandData.id);
  let savedBrand;

  if (existingIdx >= 0) {
    savedBrand = {
      ...currentBrands[existingIdx],
      ...brandData,
    };
    currentBrands[existingIdx] = savedBrand;
  } else {
    const id = brandData.id || `brand-${Date.now()}`;
    savedBrand = {
      id,
      name: brandData.name,
      category: brandData.category || 'Brand Partner',
      role: brandData.role || 'Videographer & Editor',
      badge: brandData.badge || 'Collaborator',
      logoUrl: brandData.logoUrl || '',
      iconType: brandData.iconType || 'building',
      description: brandData.description || '',
      deliverables: Array.isArray(brandData.deliverables) ? brandData.deliverables : [],
      websiteUrl: brandData.websiteUrl || '',
      featured: brandData.featured ?? false,
      isPublished: brandData.isPublished ?? true,
      order: currentBrands.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    currentBrands.push(savedBrand);
  }

  writeJson(brandsFilePath, currentBrands);
  res.json(savedBrand);
});

app.delete('/api/brands/:id', (req, res) => {
  const currentBrands = readJson(brandsFilePath, []);
  const filtered = currentBrands.filter((b) => b.id !== req.params.id);
  writeJson(brandsFilePath, filtered);
  res.json({ success: true, count: filtered.length });
});

app.post('/api/brands/reorder', (req, res) => {
  const { orderedBrands } = req.body;
  if (Array.isArray(orderedBrands)) {
    const reordered = orderedBrands.map((b, idx) => ({ ...b, order: idx + 1 }));
    writeJson(brandsFilePath, reordered);
    return res.json(reordered);
  }
  res.status(400).json({ error: 'orderedBrands array required' });
});

// --- PROFILE ENDPOINTS ---
app.get('/api/profile', (req, res) => {
  const profile = readJson(profileFilePath, {});
  res.json(profile);
});

app.post('/api/profile', (req, res) => {
  const newProfile = req.body;
  writeJson(profileFilePath, newProfile);
  res.json(newProfile);
});

// --- AUTH ENDPOINTS ---
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const auth = readJson(authFilePath, { passcode: 'cinema2026' });
  if (password === auth.passcode) {
    return res.json({ authenticated: true, token: 'cinema_admin_session_valid' });
  }
  res.status(401).json({ authenticated: false, error: 'Invalid passcode' });
});

app.post('/api/auth/change-password', (req, res) => {
  const { newPass } = req.body;
  if (!newPass || newPass.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }
  writeJson(authFilePath, { passcode: newPass });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🎬 Cinematic Portfolio Backend Engine running on http://localhost:${PORT}`);
});
