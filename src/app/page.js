'use client';

import React, { useState, useRef, useEffect } from 'react';
import CoucouMochi from '@/components/CoucouMochi';
import DynamicNotch from '@/components/DynamicNotch';
import WishBoard from '@/components/WishBoard';
import FloatingBalloons from '@/components/FloatingBalloons';

export default function HomePage() {
  const [recipientName] = useState('Nurlaila');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // Toggle MP3 music
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch(() => {
          // Autoplay policy prevented immediate playback
        });
    }
  };

  // Optional: Listen for first touch on screen to optionally prime audio
  useEffect(() => {
    const handleFirstTouch = () => {
      // Audio element initialized on user gesture
    };
    window.addEventListener('touchstart', handleFirstTouch, { once: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  return (
    <div className="mobile-app-container">
      {/* Hidden Audio element for the user's specific MP3 */}
      <audio
        ref={audioRef}
        src="/audio/happy-birthday.mp3"
        preload="auto"
        loop
        onEnded={() => setIsMusicPlaying(false)}
      />

      {/* Floating Background Balloons */}
      <FloatingBalloons />

      {/* Apple Dynamic Island Top Bar */}
      <DynamicNotch
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        recipientName={recipientName}
      />

      {/* Hero Header */}
      <section className="hero-section">
        <div className="badge-family">
          <span>🌸</span>
          <span>HARI SPESIAL UNTUK NURLAILA</span>
          <span>✨</span>
        </div>

        <h1 className="hero-title">
          Selamat Ulang Tahun, {recipientName}! 🎂
        </h1>

        <div className="hero-subtitle">
          Doa &amp; Ucapan Hangat Penuh Kasih
        </div>

        <div className="hero-family-tag">
          Dari Harizal &amp; Berlian Sekeluarga ❤️
        </div>

        {/* Coucou Mochi Interactive Stage */}
        <div className="mochi-stage-container">
          <div className="glass-panel" style={{ padding: '18px 12px 16px' }}>
            <CoucouMochi
              recipientName={recipientName}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={toggleMusic}
            />
          </div>
        </div>

        {/* Heartfelt Letter, Surprise Gift & Wish Board */}
        <WishBoard recipientName={recipientName} />
      </section>

      {/* Footer */}
      <footer className="footer-wrap">
        <p style={{ marginBottom: '6px', fontWeight: '600', color: '#F1F5F9' }}>
          Dipersembahkan dengan segenap cinta &amp; doa untuk Nurlaila 🌸✨
        </p>
        <p style={{ color: '#94A3B8', fontSize: '12px' }}>
          Keluarga Harizal &amp; Berlian · 2026
        </p>
      </footer>
    </div>
  );
}
