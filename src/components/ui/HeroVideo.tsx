'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';

interface HeroVideoProps {
  posterSrc: string;
  videoSrc?: string;
  alt: string;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  posterSrc,
  videoSrc = '/videos/hero-kitchen.mp4',
  alt,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled
      });
    }
  }, [videoSrc]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {/* Visual Container with Smooth Slow Zoom-In Motion */}
      <div
        className={`relative w-full h-full transform-gpu ${
          isPlaying ? 'animate-cinematic-zoom' : 'scale-105'
        }`}
      >
        {/* Crisp Luxury Kitchen Image Poster */}
        <Image
          src={posterSrc}
          alt={alt}
          fill
          priority
          unoptimized
          className={`object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="100vw"
        />

        {/* Ambient HTML5 Video Player */}
        {videoSrc && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onPlaying={() => setVideoLoaded(true)}
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Subtle Bottom Gradient for High-Contrast White & Orange Highlight Text */}
      <div
        className="absolute bottom-0 inset-x-0 h-64 sm:h-80 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"
        aria-hidden="true"
      />

      {/* Motion Pause/Play Toggle Button */}
      <div className="pointer-events-auto absolute bottom-4 left-4 z-30">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-[#FFAA4F] cursor-pointer flex items-center gap-1.5 text-xs shadow-md"
          aria-label={isPlaying ? 'Pause ambient video motion' : 'Play ambient video motion'}
          title={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5 text-[#FFAA4F]" aria-hidden="true" />
              <span className="hidden sm:inline font-semibold text-[11px]">Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span className="hidden sm:inline font-semibold text-[11px]">Play</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
