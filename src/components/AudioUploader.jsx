import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://audio-analysis-89ns.onrender.com';
const API_URL    = `${BASE_URL}/api/audio/upload`;
const HEALTH_URL = `${BASE_URL}/api/audio/health`;

const WaveformBars = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '28px' }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} className="wave-bar" style={{ height: `${10 + (i % 4) * 6}px` }} />
    ))}
  </div>
);

const Spinner = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'spin 0.8s linear infinite' }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0110 10" stroke="url(#sg)" />
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
);

export default function AudioUploader({ onResult }) {
  const [file, setFile]           = useState(null);
  const [dragging, setDragging]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Analyzing Audio…');
  const [error, setError]         = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking' | 'ready' | 'offline'
  const inputRef = useRef(null);

  // ── Warm up the Render free-tier server on mount ──
  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      try {
        const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(15000) });
        if (!cancelled) setServerStatus(res.ok ? 'ready' : 'offline');
      } catch {
        if (!cancelled) setServerStatus('offline');
      }
    };
    ping();
    return () => { cancelled = true; };
  }, []);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith('audio/')) {
      setError('Please upload a valid audio file (MP3, WAV, OGG, M4A…)');
      return;
    }
    setError('');
    setFile(f);
  }, []);

  const onDrop      = useCallback((e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }, [handleFile]);
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select an audio file first.'); return; }
    setLoading(true);
    setError('');
    setLoadingMsg('Uploading audio…');

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('filename', file.name);
    formData.append('size', String(file.size));
    formData.append('type', file.type);

    // Retry once if server is cold-starting (network error only)
    const attemptFetch = async (attempt = 1) => {
      try {
        return await fetch(API_URL, { method: 'POST', body: formData });
      } catch (networkErr) {
        if (attempt < 2) {
          setLoadingMsg('Server is waking up, retrying…');
          await new Promise(r => setTimeout(r, 4000));
          return attemptFetch(attempt + 1);
        }
        throw networkErr;
      }
    };

    try {
      const response = await attemptFetch();
      const data     = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      console.log('[n8n raw result]', JSON.stringify(data.result, null, 2));
      const result = Array.isArray(data.result) ? data.result[0] : data.result;
      setServerStatus('ready');
      onResult(result, file);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingMsg('Analyzing Audio…');
    }
  };

  const clearFile = () => {
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // Server status pill
  const statusPill = {
    checking: { color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.25)', label: '⏳ Checking server…' },
    ready:    { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',  label: '● Server ready' },
    offline:  { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)',label: '⚠ Server offline / waking up' },
  }[serverStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}
    >
      {/* Server status */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 16,
      }}>
        <span style={{
          padding: '4px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
          color: statusPill.color, background: statusPill.bg, border: `1px solid ${statusPill.border}`,
          transition: 'all 0.4s',
        }}>
          {statusPill.label}
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={dragging ? 'drop-active' : ''}
        style={{
          border: `1px dashed ${dragging ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: '16px',
          padding: '28px',
          background: dragging ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.025)',
          cursor: file ? 'default' : 'pointer',
          transition: 'all 0.25s ease',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.9)" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: 6 }}>Drop your audio file here</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>or click to browse · MP3, WAV, OGG, M4A supported</p>
            </motion.div>
          ) : (
            <motion.div key="file" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <WaveformBars />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: 3 }}>
                  {formatSize(file.size)} · {file.type || 'audio'}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.5)', padding: '6px 10px',
                  cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
              >✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 10, paddingLeft: 4, display: 'flex', alignItems: 'flex-start', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={loading || !file}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', marginTop: 14, padding: '14px', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.2)',
          background: file && !loading ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)' : 'rgba(255,255,255,0.05)',
          color: file && !loading ? '#fff' : 'rgba(255,255,255,0.3)',
          fontSize: '0.9375rem', fontWeight: 600, cursor: file && !loading ? 'pointer' : 'not-allowed',
          letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'Inter, sans-serif', transition: 'all 0.25s ease',
          boxShadow: file && !loading ? '0 4px 24px rgba(139,92,246,0.35)' : 'none',
        }}
      >
        {loading ? (
          <><Spinner />{loadingMsg}</>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Submit for Analysis
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
