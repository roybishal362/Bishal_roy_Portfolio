import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onComplete?: () => void; }

export default function GridCurtainTransition({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);
  const [startExit, setStartExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTextVisible(true), 400);
    const t2 = setTimeout(() => setStartExit(true), 2800);
    const t3 = setTimeout(() => { setIsVisible(false); onComplete?.(); }, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', background: '#050508', overflow: 'hidden' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.8 }} />

          {/* Glow orb */}
          <motion.div
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Curtain columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', height: '100%', position: 'relative', zIndex: 2 }}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                style={{ background: '#050508', height: '100%', borderRight: '1px solid rgba(99,102,241,0.05)' }}
                initial={{ y: 0 }}
                animate={startExit ? { y: '-100%' } : { y: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: startExit ? i * 0.08 : 0 }}
              />
            ))}
          </div>

          {/* Text */}
          <motion.div
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}
            initial={{ opacity: 0, y: 24 }}
            animate={startExit ? { opacity: 0, y: -24 } : textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 'clamp(40px,7vw,88px)', letterSpacing: '-0.04em', color: '#f0f0f8', marginBottom: 12, lineHeight: 1 }}>
              Bishal <span style={{ color: '#6366f1' }}>Roy</span>
            </h1>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 'clamp(10px,1.5vw,14px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6b6b8a' }}>
              AI · ML Engineer · Researcher
            </p>
            <motion.div
              style={{ width: 48, height: 2, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', margin: '16px auto 0', borderRadius: 99 }}
              initial={{ scaleX: 0 }}
              animate={textVisible && !startExit ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
