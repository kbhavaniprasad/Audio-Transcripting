import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function renderValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {value.map((v, i) => (
          <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.84rem', lineHeight: 1.7 }}>
            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="result-field" style={{ padding: '8px 12px' }}>
            <span style={{ color: 'rgba(139,92,246,0.9)', fontSize: '0.75rem', fontWeight: 500 }}>{k}</span>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.84rem', marginTop: 2 }}>{renderValue(v)}</p>
          </div>
        ))}
      </div>
    );
  }
  return String(value);
}

const icons = {
  transcript: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  analysis: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  summary: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  default: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

function getIcon(key) {
  const k = key.toLowerCase();
  if (k.includes('transcript') || k.includes('text') || k.includes('speech')) return icons.transcript;
  if (k.includes('analy') || k.includes('detect') || k.includes('score')) return icons.analysis;
  if (k.includes('summar') || k.includes('result') || k.includes('output')) return icons.summary;
  return icons.default;
}

export default function ResultDisplay({ result, file, onReset }) {
  if (!result) return null;

  // If n8n returned a plain string, wrap it so we can display it
  const normalized = typeof result === 'string' ? { output: result } : result;
  const entries = Object.entries(normalized);

  // Nothing to render
  if (entries.length === 0) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 40 }}>
        ✓ Workflow completed but returned no displayable data.<br />
        <small>Check the browser console for raw JSON.</small>
      </div>
    );
  }


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '20px',
          padding: '28px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(59,130,246,0.3))',
              border: '1px solid rgba(139,92,246,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,1)" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                Analysis Complete
              </h3>
              {file && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: 2 }}>
                  {file.name}
                </p>
              )}
            </div>
          </div>
          {/* Success badge */}
          <span style={{
            padding: '4px 12px',
            borderRadius: 999,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#4ade80',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            ✓ Success
          </span>
        </div>

        {/* Result fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map(([key, value], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.4, ease: 'easeOut' }}
              className="result-field"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: 'rgba(139,92,246,0.85)' }}>{getIcon(key)}</span>
                <span style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                whiteSpace: typeof value === 'string' ? 'pre-wrap' : 'normal',
              }}>
                {renderValue(value)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Raw JSON toggle */}
        <details style={{ marginTop: 16 }}>
          <summary style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            userSelect: 'none',
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            View raw JSON
          </summary>
          <pre style={{
            marginTop: 10,
            padding: '14px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#7dd3fc',
            fontSize: '0.75rem',
            overflowX: 'auto',
            lineHeight: 1.6,
          }}>
            {JSON.stringify(normalized, null, 2)}
          </pre>
        </details>

        {/* Reset button */}
        <motion.button
          onClick={onReset}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(255,255,255,0.08)';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(255,255,255,0.04)';
            e.target.style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          ↺ Upload Another File
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
