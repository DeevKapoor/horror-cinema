'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HorrorCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const checkIfMobile = () => {
      // Detect mobile or touchscreen device
      if (window.innerWidth <= 768 || 'ontouchstart' in window) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Initial check on mount
    checkIfMobile();

    // Listen for resize to adjust detection dynamically
    window.addEventListener('resize', checkIfMobile);

    if (!isMobile) {
      window.addEventListener('mousemove', updateMousePosition);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);

      // Hide default cursor on non-mobile devices
      document.body.style.cursor = 'none';
    }

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      if (!isMobile) {
        window.removeEventListener('mousemove', updateMousePosition);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);

        // Restore default cursor
        document.body.style.cursor = '';
      }
    };
  }, [isMobile]);

  if (isMobile) return null; // Remove the cursor for mobile devices

  return (
    <motion.div
      className="horror-cursor"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isClicking ? 2 : 1,
        rotate: isClicking ? 720 : 0,
      }}
      transition={{
        type: 'tween',
        duration: 0,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '32px',
        height: '32px',
        background: 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(50,0,0,1) 100%)',
        borderRadius: '50%',
        boxShadow: '0 0 30px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 10000,
        mixBlendMode: 'difference',
      }}
    >
      <motion.div
        className="cursor-trail"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,0,0,0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(15px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
