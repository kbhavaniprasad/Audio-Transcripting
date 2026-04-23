import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontWeight: 500,
          fontSize: '1.2rem',
          letterSpacing: '-0.03em',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>
        Synapse
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <a
          href="#"
          className="nav-active"
          style={{ fontSize: '0.875rem', color: '#fff', textDecoration: 'none', fontWeight: 500 }}
        >
          Features
        </a>
        <a
          href="#"
          style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
        >
          Insights
        </a>
        <a
          href="#"
          style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.35)',
            textDecoration: 'line-through',
            textDecorationColor: 'rgba(255,255,255,0.2)',
          }}
        >
          Case Studies
        </a>
      </div>

      {/* CTA */}
      <button
        style={{
          padding: '8px 20px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(180,180,180,0.06))',
          color: '#fff',
          fontSize: '0.8125rem',
          fontWeight: 500,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(255,255,255,0.18)';
          e.target.style.borderColor = 'rgba(255,255,255,0.35)';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(180,180,180,0.06))';
          e.target.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
      >
        Get Started for Free
      </button>
    </motion.nav>
  );
}
