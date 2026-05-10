import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
/* ─── Processing stages ─────────────────────────────────── */
const STAGES = [
  { id: 1, label: 'Uploading Audio',          duration: 12 },
  { id: 2, label: 'Extracting Voice Patterns', duration: 20 },
  { id: 3, label: 'Transcribing Speech',       duration: 25 },
  { id: 4, label: 'Evaluating Pronunciation',  duration: 20 },
  { id: 5, label: 'Analyzing Fluency',         duration: 15 },
  { id: 6, label: 'Generating AI Report',      duration: 8  },
];

/* ─── Floating Particle ──────────────────────────────────── */
function Particle({ x, y, size, color, delay }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(1px)', pointerEvents: 'none',
      }}
      animate={{
        y: [0, -30, 0], x: [0, 10, -10, 0],
        opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1],
      }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── Neural Pulse Ring ──────────────────────────────────── */
function PulseRing({ size, delay, color }) {
  return (
    <motion.div
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: size, height: size, borderRadius: '50%',
        border: `1px solid ${color}`,
        transform: 'translate(-50%,-50%)', pointerEvents: 'none',
      }}
      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

/* ─── Rotating Ring ──────────────────────────────────────── */
function RotatingRing({ size, speed, color, dashes = 8, reverse = false }) {
  return (
    <motion.div
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: size, height: size, borderRadius: '50%',
        border: `1.5px dashed ${color}`,
        borderDasharray: `${dashes}px ${dashes}px`,
        transform: 'translate(-50%,-50%)', pointerEvents: 'none',
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ─── Neural Network SVG ─────────────────────────────────── */
function NeuralNetwork() {
  const nodes = [
    { x: 50, y: 50 }, { x: 30, y: 30 }, { x: 70, y: 30 },
    { x: 20, y: 55 }, { x: 80, y: 55 }, { x: 35, y: 72 },
    { x: 65, y: 72 }, { x: 50, y: 22 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[2,7],[1,3],[2,4],[5,6]];

  return (
    <svg width="140" height="140" viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <defs>
        <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#brainGrad)" strokeWidth="0.8" filter="url(#glow)"
          animate={{ opacity: [0.3, 1, 0.3], strokeWidth: [0.6, 1.2, 0.6] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.x} cy={n.y} r={i === 0 ? 4.5 : 2.5}
          fill={i === 0 ? '#a78bfa' : '#38bdf8'} filter="url(#glow)"
          animate={{ r: i === 0 ? [4.5, 6, 4.5] : [2.5, 3.5, 2.5], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8 + i * 0.2, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

/* ─── AI Brain Visualization ─────────────────────────────── */
function AIBrain() {
  return (
    <div style={{ position: 'relative', width: 280, height: 280, margin: '0 auto' }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.25) 0%, rgba(56,189,248,0.1) 60%, transparent 80%)',
        filter: 'blur(20px)', animation: 'brainPulse 2.5s ease-in-out infinite',
      }} />

      {/* Rotating rings */}
      <RotatingRing size={260} speed={14} color="rgba(139,92,246,0.35)" dashes={6} />
      <RotatingRing size={220} speed={10} color="rgba(56,189,248,0.35)" dashes={4} reverse />
      <RotatingRing size={180} speed={7}  color="rgba(167,139,250,0.4)"  dashes={8} />

      {/* Pulse rings */}
      <PulseRing size={160} delay={0}   color="rgba(139,92,246,0.6)" />
      <PulseRing size={160} delay={0.8} color="rgba(56,189,248,0.4)" />
      <PulseRing size={160} delay={1.6} color="rgba(167,139,250,0.3)" />

      {/* Core orb */}
      <motion.div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 130, height: 130, borderRadius: '50%',
        transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle at 35% 35%, rgba(167,139,250,0.9), rgba(56,189,248,0.6) 60%, rgba(14,165,233,0.3) 100%)',
        boxShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(56,189,248,0.3), inset 0 0 30px rgba(255,255,255,0.1)',
        backdropFilter: 'blur(4px)',
      }}
        animate={{ scale: [1, 1.06, 1], boxShadow: [
          '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(56,189,248,0.3)',
          '0 0 60px rgba(139,92,246,0.9), 0 0 120px rgba(56,189,248,0.5)',
          '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(56,189,248,0.3)',
        ]}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <NeuralNetwork />
      </motion.div>
    </div>
  );
}

/* ─── Stage Row ──────────────────────────────────────────── */
function StageRow({ stage, status }) {
  // status: 'pending' | 'active' | 'done'
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 10,
        background: status === 'active'
          ? 'rgba(139,92,246,0.12)'
          : status === 'done' ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${status === 'active' ? 'rgba(139,92,246,0.4)' : status === 'done' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.4s ease',
        marginBottom: 8,
      }}
    >
      {/* Icon */}
      <div style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: status === 'done' ? 'rgba(34,197,94,0.2)' : status === 'active' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)',
      }}>
        {status === 'done' ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        ) : status === 'active' ? (
          <motion.div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#38bdf8)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.8, repeat: Infinity }} />
        ) : (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        )}
      </div>

      {/* Label */}
      <span style={{
        fontSize: '0.8rem', fontWeight: status === 'active' ? 600 : 500,
        color: status === 'done' ? '#4ade80' : status === 'active' ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
        flex: 1, transition: 'color 0.3s',
      }}>
        {stage.label}
      </span>

      {/* Active indicator */}
      {status === 'active' && (
        <motion.span style={{ fontSize: '0.68rem', color: '#a78bfa', fontWeight: 600 }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}>
          LIVE
        </motion.span>
      )}
      {status === 'done' && (
        <span style={{ fontSize: '0.68rem', color: '#4ade80', fontWeight: 600 }}>DONE</span>
      )}
    </motion.div>
  );
}

/* ─── Waveform ───────────────────────────────────────────── */
function AnimatedWaveform() {
  const bars = 48;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: 60 }}>
      {[...Array(bars)].map((_, i) => {
        const h = 8 + Math.sin(i * 0.6) * 20 + Math.sin(i * 1.2) * 12;
        return (
          <motion.div key={i}
            style={{ width: 3, borderRadius: 2,
              background: `linear-gradient(180deg, #a78bfa, #38bdf8)`,
              boxShadow: '0 0 4px rgba(167,139,250,0.5)',
            }}
            animate={{ height: [`${h}px`, `${h * 2.2}px`, `${h}px`], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8 + (i % 5) * 0.15, repeat: Infinity, delay: i * 0.03, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

/* ─── Typing Text ────────────────────────────────────────── */
function TypingText({ text }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span style={{ fontFamily: 'monospace' }}>
      {displayed}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
    </span>
  );
}

/* ─── PARTICLES ──────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  color: ['rgba(139,92,246,0.7)', 'rgba(56,189,248,0.7)', 'rgba(167,139,250,0.7)', 'rgba(244,114,182,0.5)'][i % 4],
  delay: Math.random() * 3,
}));

/* ─── PROGRESS TICK ──────────────────────────────────────── */
function useProgress() {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Total weight = 100, distribute
    let accumulated = 0;
    let current = 0;
    const targets = STAGES.map(s => { accumulated += s.duration; return accumulated; });

    const iv = setInterval(() => {
      current = Math.min(current + 0.35, 96);
      setProgress(Math.round(current));

      // Which stage are we in?
      for (let i = 0; i < targets.length; i++) {
        if (current < targets[i]) { setStageIndex(i); break; }
      }
    }, 80);
    return () => clearInterval(iv);
  }, []);

  return { progress, stageIndex };
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function AIProcessingScreen({ file }) {
  const { progress, stageIndex } = useProgress();

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'linear-gradient(135deg, #020817 0%, #0a0f1e 40%, #050816 100%)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}
    >
      {/* CSS keyframes */}
      <style>{`
        @keyframes brainPulse { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes gridMove { 0%{background-position:0 0} 100%{background-position:40px 40px} }
      `}</style>

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(56,189,248,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        animation: 'gridMove 6s linear infinite',
      }} />

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Floating particles */}
      {PARTICLES.map(p => <Particle key={p.id} {...p} />)}

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: 28, paddingBottom: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}
        >
          <motion.div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a78bfa' }}
            animate={{ scale: [1, 1.5, 1], boxShadow: ['0 0 0px #a78bfa', '0 0 12px #a78bfa', '0 0 0px #a78bfa'] }}
            transition={{ duration: 1.2, repeat: Infinity }} />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #c4b5fd, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            <TypingText text="AI Processing Audio…" />
          </h1>
        </motion.div>
        {file && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div style={{
        position: 'relative', zIndex: 2, flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 320px 1fr', gap: 20,
        padding: '0 24px', maxWidth: 1100, margin: '0 auto', width: '100%', alignItems: 'start',
      }}>

        {/* ── LEFT: Stages ── */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: 20, backdropFilter: 'blur(20px)',
          }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(167,139,250,0.8)',
            marginBottom: 14, textTransform: 'uppercase' }}>Processing Stages</p>
          {STAGES.map((stage, i) => (
            <StageRow key={stage.id} stage={stage}
              status={i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'pending'} />
          ))}
        </motion.div>

        {/* ── CENTER: Brain ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
          <AIBrain />

          {/* Progress ring */}
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <svg width="100" height="100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <motion.circle cx="50" cy="50" r="42" fill="none"
                stroke="url(#pgGrad)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                transition={{ duration: 0.1 }}
              />
              <defs>
                <linearGradient id="pgGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <text x="50" y="47" textAnchor="middle" fontSize="18" fontWeight="800" fill="white">{progress}%</text>
              <text x="50" y="62" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">COMPLETE</text>
            </svg>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: 6 }}>
            {STAGES[Math.min(stageIndex, STAGES.length - 1)]?.label}
          </p>
        </div>

        {/* ── RIGHT: AI Animation ── */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
          <div style={{ flex: 1, position: 'relative', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at center, rgba(56,189,248,0.15) 0%, transparent 60%)',
              }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/robot.png"
                alt="AI Assistant Robot"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                  maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                  mixBlendMode: 'screen', pointerEvents: 'none'
                }}
              />
              
              {/* Face Processing Overlay */}
              <div style={{
                position: 'absolute', top: '26%', left: '50%', transform: 'translate(-50%, -50%)',
                display: 'flex', alignItems: 'center', gap: '5px',
                pointerEvents: 'none', height: '28px'
              }}>
                {[...Array(7)].map((_, i) => {
                  const symIdx = i <= 3 ? i : 6 - i;
                  const minH = 8 + symIdx * 3;
                  const maxH = 14 + symIdx * 5;
                  return (
                    <motion.div key={i}
                      style={{ 
                        width: 4, borderRadius: 2, 
                        background: '#22d3ee', 
                        boxShadow: '0 0 10px #06b6d4' 
                      }}
                      animate={{ height: [minH, maxH, minH] }}
                      transition={{ duration: 0.6 + symIdx * 0.15, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM: Waveform ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{
          position: 'relative', zIndex: 2, margin: '12px 24px 24px',
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '14px 24px', backdropFilter: 'blur(20px)',
          maxWidth: 1100, width: 'calc(100% - 48px)', marginLeft: 'auto', marginRight: 'auto',
        }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.3)', marginBottom: 8, textTransform: 'uppercase' }}>
          Audio Waveform Analysis
        </p>
        <AnimatedWaveform />
      </motion.div>
    </motion.div>
  );
}
