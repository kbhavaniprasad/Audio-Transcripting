import React from 'react';
import { motion } from 'framer-motion';

// Placeholder brand icons as inline SVG
const icons = [
  // Waveform icon
  <svg key="wave" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12h3M5 8v8M8 6v12M11 9v6M14 4v16M17 7v10M20 10v4M23 12h-3" />
  </svg>,
  // Cloud icon
  <svg key="cloud" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
  </svg>,
  // CPU icon
  <svg key="cpu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </svg>,
];

const badges = [
  { label: 'AI-Powered Analysis', icon: icons[0] },
  { label: 'Cloud Processing', icon: icons[1] },
  { label: 'Real-time Engine', icon: icons[2] },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function BadgeRow() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      {badges.map((b) => (
        <motion.div
          key={b.label}
          variants={item}
          className="glass flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white/70"
        >
          <span className="text-purple-400">{b.icon}</span>
          <span>Integrated with</span>
          <span className="text-white/90">{b.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
