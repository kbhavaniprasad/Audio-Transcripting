const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');
const fetch   = require('node-fetch');
const FormData = require('form-data');
const upload  = require('../middleware/upload');

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// ─────────────────────────────────────────────
// POST /api/audio/upload
// 1. Multer stores the file on disk
// 2. We forward it as multipart to the n8n webhook
// 3. We return the webhook response to the client
// ─────────────────────────────────────────────
router.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No audio file received.' });
  }

  const { originalname, filename, mimetype, size, path: filePath } = req.file;

  console.log(`[UPLOAD] ${originalname}  (${(size / 1024).toFixed(1)} KB, ${mimetype})`);

  try {
    // ── Forward to n8n webhook ──
    const form = new FormData();
    form.append('audio', fs.createReadStream(filePath), {
      filename: originalname,
      contentType: mimetype,
    });
    form.append('filename', originalname);
    form.append('size',     String(size));
    form.append('type',     mimetype);

    console.log(`[N8N]  → Forwarding to ${N8N_WEBHOOK_URL}`);

    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method:  'POST',
      body:    form,
      headers: form.getHeaders(),
    });

    const responseText = await webhookResponse.text();
    console.log(`[N8N]  ← Status ${webhookResponse.status}`);

    let webhookData;
    try {
      webhookData = JSON.parse(responseText);
    } catch {
      // If n8n returns plain text, wrap it
      webhookData = { message: responseText };
    }

    if (!webhookResponse.ok) {
      return res.status(502).json({
        success: false,
        error:   `Webhook returned ${webhookResponse.status}`,
        detail:  webhookData,
      });
    }

    // ── Success ──
    return res.status(200).json({
      success:  true,
      file: {
        originalName: originalname,
        storedName:   filename,
        mimeType:     mimetype,
        sizeBytes:    size,
      },
      result: webhookData,
    });

  } catch (err) {
    console.error('[ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error:   err.message || 'Internal server error',
    });
  } finally {
    // Optionally delete the temp file after forwarding
    fs.unlink(filePath, () => {});
  }
});

// ─────────────────────────────────────────────
// GET /api/audio/health
// Quick health check
// ─────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    status:      'ok',
    webhook:     N8N_WEBHOOK_URL,
    timestamp:   new Date().toISOString(),
  });
});

module.exports = router;
