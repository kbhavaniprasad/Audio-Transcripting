import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, AudioWaveform, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AIProcessingScreen({ file }) {
  const [progress, setProgress] = useState(7);
  const [status, setStatus] = useState('uploading');
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Particle system for ambient AI effect
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let offset = 0;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height);
      
      const bars = 60;
      const barWidth = width / bars;
      const centerY = height / 2;

      for (let i = 0; i < bars; i++) {
        const frequency = (i / bars) * Math.PI * 4;
        const amplitude = Math.sin((offset + i) * 0.1) * 
                         Math.sin(frequency) * 
                         (status === 'processing' ? 25 : 15);
        
        const barHeight = Math.abs(amplitude);
        const x = i * barWidth;
        
        const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.9)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, centerY - barHeight, barWidth - 2, barHeight * 2);
      }

      offset += 0.15;
      animationRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status]);

  // Simulate progress
  useEffect(() => {
    if (progress >= 100) {
      setStatus('complete');
      return;
    }

    const timer = setTimeout(() => {
      setProgress(prev => {
        const increment = Math.random() * 5 + 2;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 30 && status === 'uploading') {
          setStatus('processing');
        }
        if (newProgress >= 90 && status === 'processing') {
          setStatus('analyzing');
        }
        
        return newProgress;
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [progress, status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: Upload,
          text: 'Uploading Audio',
          color: 'rgb(59, 130, 246)',
          bgColor: 'rgba(59, 130, 246, 0.1)',
        };
      case 'processing':
        return {
          icon: AudioWaveform,
          text: 'AI Processing Audio',
          color: 'rgb(147, 51, 234)',
          bgColor: 'rgba(147, 51, 234, 0.1)',
        };
      case 'analyzing':
        return {
          icon: Sparkles,
          text: 'Analyzing Patterns',
          color: 'rgb(236, 72, 153)',
          bgColor: 'rgba(236, 72, 153, 0.1)',
        };
      case 'complete':
        return {
          icon: CheckCircle2,
          text: 'Analysis Complete',
          color: 'rgb(34, 197, 94)',
          bgColor: 'rgba(34, 197, 94, 0.1)',
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Processing',
          color: 'rgb(59, 130, 246)',
          bgColor: 'rgba(59, 130, 246, 0.1)',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Animated particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: 'rgba(147, 197, 253, 0.6)',
              opacity: p.opacity,
              boxShadow: '0 0 10px rgba(147, 197, 253, 0.5)',
              transition: 'all 0.05s linear',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 20px',
          background: 'rgba(147, 197, 253, 0.1)',
          border: '0.5px solid rgba(147, 197, 253, 0.3)',
          borderRadius: '20px',
          marginBottom: '1rem',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgb(147, 197, 253)',
            boxShadow: '0 0 12px rgb(147, 197, 253)',
            animation: 'pulseDot 2s infinite',
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'rgb(147, 197, 253)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            AI Assistant
          </span>
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.95)',
          margin: '0 0 8px',
        }}>
          Audio Evaluation Agent
        </h1>
        
        {file && (
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
          }}>
            {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* Main visualization area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Progress ring with icon */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
        }}>
          {/* Outer glow */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${statusConfig.color}20 0%, transparent 70%)`,
            animation: 'pulseRing 3s infinite',
          }} />
          
          {/* Progress ring */}
          <svg
            width="200"
            height="200"
            style={{
              transform: 'rotate(-90deg)',
              position: 'absolute',
              inset: 0,
            }}
          >
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke={statusConfig.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
                filter: `drop-shadow(0 0 8px ${statusConfig.color})`,
              }}
            />
          </svg>
          
          {/* Center icon */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <div style={{
              padding: '16px',
              borderRadius: '50%',
              background: statusConfig.bgColor,
              border: `0.5px solid ${statusConfig.color}40`,
              animation: status !== 'complete' ? 'float 3s infinite' : 'none',
            }}>
              <StatusIcon
                size={32}
                style={{
                  color: statusConfig.color,
                  strokeWidth: 2,
                }}
              />
            </div>
            
            <div style={{
              fontSize: '28px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.95)',
            }}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Status text */}
        <div style={{
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: statusConfig.color,
            marginBottom: '4px',
          }}>
            {statusConfig.text}
          </div>
          <div style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '12px',
          }}>
            {status === 'complete' 
              ? 'Ready to review results' 
              : 'Please wait while we process your audio'}
          </div>
          {status !== 'complete' && (
            <div style={{
              fontSize: '12px',
              color: 'rgba(250, 204, 21, 0.7)',
              background: 'rgba(250, 204, 21, 0.08)',
              border: '1px solid rgba(250, 204, 21, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              maxWidth: '400px',
            }}>
              ⏱️ Processing may take up to 5 minutes. Please keep this window open.
            </div>
          )}
        </div>

        {/* Waveform visualization */}
        <div style={{
          width: '100%',
          minWidth: '400px',
          maxWidth: '500px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '0.5px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1rem',
          }}>
            <AudioWaveform size={16} style={{ color: 'rgba(147, 197, 253, 0.8)' }} />
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Audio Waveform Analysis
            </span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={500}
            height={100}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* Action button */}
        {status === 'complete' && (
          <button
            onClick={() => {}}
            style={{
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              background: 'rgb(59, 130, 246)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s',
              animation: 'fadeIn 0.5s',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
          >
            View Results →
          </button>
        )}

      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes pulseRing {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </motion.div>
  );
}
