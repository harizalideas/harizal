'use client';

import React, { useState, useRef, useEffect } from 'react';
import CoucouMochi from '@/components/CoucouMochi';
import DynamicNotch from '@/components/DynamicNotch';
import WishBoard from '@/components/WishBoard';
import FloatingBalloons from '@/components/FloatingBalloons';

export default function GreetingExperience({
  recipientName = 'Nurlaila',
  senderName = 'Harizal & Berlian Sekeluarga',
  photoUrl = '/kado/nurlaila.jpeg',
  tagline = 'HARI SPESIAL PENUH CINTA',
}) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

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

  useEffect(() => {
    const handleFirstTouch = () => {
      // Prime audio on mobile interaction
    };
    window.addEventListener('touchstart', handleFirstTouch, { once: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  return (
    <div className="mobile-app-container">
      {/* Hidden Audio element */}
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
          <span>{tagline.toUpperCase()}</span>
          <span>✨</span>
        </div>

        <h1 className="hero-title">
          Selamat Ulang Tahun, {recipientName}! 🎂
        </h1>

        <div className="hero-subtitle">
          Doa &amp; Ucapan Hangat Penuh Kasih
        </div>

        <div className="hero-family-tag">
          Dari {senderName} ❤️
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

        {/* Heartfelt Letter, Surprise Gift (3D Lanyard) & Wish Board */}
        <WishBoard
          recipientName={recipientName}
          senderName={senderName}
          photoUrl={photoUrl}
        />
      </section>

      {/* Footer */}
      <footer className="footer-wrap">
        <p style={{ marginBottom: '6px', fontWeight: '600', color: '#F1F5F9' }}>
          Dipersembahkan dengan segenap cinta &amp; doa untuk {recipientName} 🌸✨
        </p>
        <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '12px' }}>
          {senderName} · 2026
        </p>
        <div>
          <a
            href="/"
            style={{
              fontSize: '12px',
              color: '#38BDF8',
              textDecoration: 'none',
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'inline-block',
            }}
          >
            ✨ Buat Ucapan Seperti Ini Untuk Orang Tersayangmu →
          </a>
        </div>
      </footer>
    </div>
  );
}
