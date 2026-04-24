require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const audioRoutes = require('./routes/audioRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS ────────────────────────────────────
// Allow the React dev server (Vite default: 5173),
// any localhost port during development,
// and the deployed Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://audio-transcripting.vercel.app',   // ← deployed Vercel frontend
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Body parsers ─────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger ───────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}]  ${req.method}  ${req.url}`);
  next();
});

// ── Routes ───────────────────────────────────
app.use('/api/audio', audioRoutes);

// ── Root ping ────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'Audio Analysis API',
    version: '1.0.0',
    endpoints: {
      upload:  'POST /api/audio/upload',
      health:  'GET  /api/audio/health',
    },
  });
});

// ── Global error handler ─────────────────────
app.use((err, _req, res, _next) => {
  // Multer errors (file too large, wrong type, etc.)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large. Maximum size is 50 MB.' });
  }
  if (err.message?.startsWith('Unsupported file type')) {
    return res.status(415).json({ success: false, error: err.message });
  }
  console.error('[UNHANDLED]', err.message);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// ── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ┌──────────────────────────────────────┐');
  console.log(`  │  Audio Analysis Server                │`);
  console.log(`  │  Listening on  http://localhost:${PORT}  │`);
  console.log(`  │  Webhook  →  n8n                      │`);
  console.log('  └──────────────────────────────────────┘');
  console.log('');
});
