'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ParallaxBlueprintProps {
  variant?: 'white' | 'slate';
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
  children: React.ReactNode;
}

export const ParallaxBlueprintSection: React.FC<ParallaxBlueprintProps> = ({
  variant = 'white',
  className = '',
  id,
  'aria-labelledby': ariaLabelledby,
  children,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    // Respect OS-level reduced motion accessibility setting
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setOffsetY(0);
      return;
    }

    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        // Section-relative scroll offset ensures smooth contained parallax
        const relativeOffset = (rect.top - window.innerHeight / 2) * 0.12;
        setOffsetY(relativeOffset);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const isWhite = variant === 'white';

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`relative overflow-hidden ${
        isWhite ? 'bg-white' : 'bg-slate-50'
      } ${className}`}
    >
      {/* 1. Parallax Blueprint Image Layer (20% Opacity) */}
      <div
        className="absolute inset-x-0 -top-36 -bottom-36 pointer-events-none z-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url('/images/architectural-blueprint.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '1000px auto',
          backgroundPosition: 'center top',
          transform: `translate3d(0, ${offsetY}px, 0)`,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* 2. Solid Center Soft-Edged Layer (Guarantees 100% Text Readability) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: isWhite
            ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 4%, rgba(255,255,255,0.92) 10%, #ffffff 16%, #ffffff 84%, rgba(255,255,255,0.92) 90%, rgba(255,255,255,0.4) 96%, transparent 100%)'
            : 'linear-gradient(to right, transparent 0%, rgba(248,250,252,0.4) 4%, rgba(248,250,252,0.92) 10%, #f8fafc 16%, #f8fafc 84%, rgba(248,250,252,0.92) 90%, rgba(248,250,252,0.4) 96%, transparent 100%)',
          maxWidth: '1600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        aria-hidden="true"
      />

      {/* 3. Section Content Layer */}
      <div className="relative z-10">{children}</div>
    </section>
  );
};
