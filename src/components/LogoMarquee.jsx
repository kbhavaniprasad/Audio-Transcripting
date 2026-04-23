import React from 'react';

// Placeholder SVG logos as brand-style marks
const logos = [
  // OpenAI-style
  { name: 'OpenAI', svg: (
    <svg viewBox="0 0 40 40" fill="currentColor" width="32" height="32">
      <path d="M20 2C10.06 2 2 10.06 2 20s8.06 18 18 18 18-8.06 18-18S29.94 2 20 2zm0 4c7.73 0 14 6.27 14 14s-6.27 14-14 14S6 27.73 6 20 12.27 6 20 6zm0 4a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14z"/>
    </svg>
  )},
  // Stripe-style
  { name: 'Stripe', svg: (
    <svg viewBox="0 0 40 40" fill="currentColor" width="36" height="36">
      <rect x="4" y="15" width="32" height="4" rx="2"/>
      <rect x="4" y="22" width="24" height="4" rx="2"/>
      <rect x="4" y="8" width="20" height="4" rx="2"/>
    </svg>
  )},
  // AWS-style
  { name: 'AWS', svg: (
    <svg viewBox="0 0 40 40" fill="currentColor" width="38" height="38">
      <path d="M20 4L4 14v12l16 10 16-10V14L20 4zm0 4.4l12 7.6-12 7.6L8 16 20 8.4zM6 17.8l13 8.2v8.6L6 26.4V17.8zm28 0v8.6l-13 8.2V26l13-8.2z"/>
    </svg>
  )},
  // Google-style
  { name: 'Google', svg: (
    <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="3"/>
      <path d="M20 20h10M20 20v-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )},
  // Vercel-style
  { name: 'Vercel', svg: (
    <svg viewBox="0 0 40 40" fill="currentColor" width="32" height="32">
      <polygon points="20,6 36,34 4,34"/>
    </svg>
  )},
  // GitHub-style
  { name: 'GitHub', svg: (
    <svg viewBox="0 0 40 40" fill="currentColor" width="32" height="32">
      <path d="M20 4C11.16 4 4 11.16 4 20c0 7.08 4.59 13.09 10.95 15.21.8.15 1.09-.35 1.09-.77 0-.38-.01-1.39-.02-2.73-4.45.97-5.39-2.14-5.39-2.14-.73-1.85-1.78-2.34-1.78-2.34-1.45-.99.11-.97.11-.97 1.61.11 2.45 1.65 2.45 1.65 1.43 2.44 3.74 1.74 4.65 1.33.15-1.03.56-1.74 1.02-2.14-3.55-.4-7.28-1.77-7.28-7.9 0-1.74.62-3.17 1.64-4.28-.16-.41-.71-2.02.16-4.22 0 0 1.34-.43 4.38 1.63A15.24 15.24 0 0120 11.7c1.35.01 2.71.18 3.98.54 3.04-2.06 4.38-1.63 4.38-1.63.87 2.2.32 3.81.16 4.22 1.02 1.11 1.64 2.54 1.64 4.28 0 6.14-3.74 7.49-7.3 7.89.58.5 1.09 1.48 1.09 2.99 0 2.16-.02 3.9-.02 4.43 0 .43.29.93 1.1.77C31.41 33.09 36 27.08 36 20c0-8.84-7.16-16-16-16z"/>
    </svg>
  )},
  // Figma-style
  { name: 'Figma', svg: (
    <svg viewBox="0 0 40 40" fill="currentColor" width="28" height="28">
      <circle cx="26" cy="20" r="6"/>
      <path d="M14 32c0-3.31 2.69-6 6-6h6v6a6 6 0 01-12 0zM20 8h6a6 6 0 010 12h-6V8zM8 14a6 6 0 0112 0v6H8v-6zM8 26a6 6 0 1112 0v6H14a6 6 0 01-6-6z"/>
    </svg>
  )},
];

export default function LogoMarquee() {
  const doubled = [...logos, ...logos];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
    }}>
      <div className="marquee-track">
        {doubled.map((logo, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'rgba(255,255,255,0.4)',
              filter: 'grayscale(100%)',
              opacity: 0.4,
              whiteSpace: 'nowrap',
            }}
            title={logo.name}
          >
            {logo.svg}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
