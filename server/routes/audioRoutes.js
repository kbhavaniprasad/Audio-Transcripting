const express  = require('express');
const router   = express.Router();
const fetch    = require('node-fetch');
const FormData = require('form-data');
const upload   = require('../middleware/upload');

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// ── Warn at startup if webhook URL is missing ──
if (!N8N_WEBHOOK_URL) {
  console.warn('[WARN]  N8N_WEBHOOK_URL is not set in environment variables!');
  console.warn('[WARN]  POST /api/audio/upload will return 503 until it is configured.');
}

// ─────────────────────────────────────────────
// POST /api/audio/upload
// 1. Multer stores the file in memory (Buffer)
// 2. We forward it as multipart to the n8n webhook
// 3. We return the webhook response to the client
// ─────────────────────────────────────────────
router.post('/upload', upload.single('audio'), async (req, res) => {

  // ── Guard: no file ──
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No audio file received.' });
  }

  // ── Guard: webhook URL not configured ──
  if (!N8N_WEBHOOK_URL) {
    return res.status(503).json({
      success: false,
      error:   'Webhook not configured. Set N8N_WEBHOOK_URL in environment variables.',
    });
  }

  const { originalname, mimetype, size, buffer } = req.file;

  console.log(`[UPLOAD] ${originalname}  (${(size / 1024).toFixed(1)} KB, ${mimetype})`);
  console.log(`[N8N]  → Forwarding to ${N8N_WEBHOOK_URL}`);

  // ── AbortController for 60-second timeout ──
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 60_000);

  try {
    // ── Build multipart form ──
    const form = new FormData();
    form.append('data', buffer, {
      filename:    originalname,
      contentType: mimetype,
      knownLength: size,
    });
    form.append('filename', originalname);
    form.append('size',     String(size));
    form.append('type',     mimetype);

    // ── Forward to n8n ──
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method:  'POST',
      body:    form,
      headers: form.getHeaders(),
      signal:  controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await webhookResponse.text();
    console.log(`[N8N]  ← Status ${webhookResponse.status}  body: ${responseText.slice(0, 200)}`);

    let webhookData;
    try {
      webhookData = JSON.parse(responseText);
    } catch {
      webhookData = { message: responseText };
    }

    // ── Webhook returned an error status ──
    if (!webhookResponse.ok) {
      console.error(`[N8N]  Webhook error ${webhookResponse.status}:`, webhookData);

      // ngrok returns 502 when the tunnel is offline (no local process connected)
      const isNgrokDown = webhookResponse.status === 502 || webhookResponse.status === 503;
      const errorMsg = isNgrokDown
        ? 'ngrok tunnel is offline. Start ngrok on your machine: ngrok http 5678 --domain=ruthenic-lucy-expositorially.ngrok-free.dev'
        : `Webhook returned HTTP ${webhookResponse.status}. Make sure n8n workflow is activated (not just in test mode).`;

      return res.status(502).json({
        success: false,
        error:   errorMsg,
        detail:  webhookData,
      });
    }

    // ── Success ──
    return res.status(200).json({
      success: true,
      file: {
        originalName: originalname,
        mimeType:     mimetype,
        sizeBytes:    size,
      },
      result: webhookData,
    });

  } catch (err) {
    clearTimeout(timeoutId);

    // Timeout error
    if (err.name === 'AbortError') {
      console.error('[ERROR] Webhook request timed out after 60s');
      return res.status(504).json({
        success: false,
        error:   'Webhook timed out (60 s). Your n8n instance may be offline or the ngrok tunnel has expired.',
      });
    }

    // Network / DNS error (e.g. expired ngrok URL)
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.type === 'system') {
      console.error('[ERROR] Cannot reach webhook:', err.message);
      return res.status(502).json({
        success: false,
        error:   'Cannot reach the n8n webhook. The ngrok tunnel may have expired — please restart ngrok and update N8N_WEBHOOK_URL.',
        detail:  err.message,
      });
    }

    console.error('[ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error:   err.message || 'Internal server error',
    });
  }
});

// ─────────────────────────────────────────────
// GET /api/audio/health
// ─────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    status:      'ok',
    webhookSet:  !!N8N_WEBHOOK_URL,
    webhook:     N8N_WEBHOOK_URL || 'NOT SET',
    timestamp:   new Date().toISOString(),
  });
});

module.exports = router;
