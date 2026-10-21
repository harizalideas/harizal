'use client';

import React, { useState } from 'react';
import CoucouMochi from '@/components/CoucouMochi';
import DynamicNotch from '@/components/DynamicNotch';
import WishBoard from '@/components/WishBoard';
import FloatingBalloons from '@/components/FloatingBalloons';

export default function HomePage() {
  const [recipientName, setRecipientName] = useState('Harizal');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Floating Balloons */}
      <FloatingBalloons />

      {/* Top Apple Mac Notch / Dynamic Island */}
      <DynamicNotch
        isExpanded={isIslandExpanded}
        onToggle={() => setIsIslandExpanded((prev) => !prev)}
        recipientName={recipientName}
      />

      {/* Main Hero Header */}
      <section className="hero-section">
        <div className="badge-birthday">
          <span>🎂</span>
          <span>HARI SPESIAL ULANG TAHUN</span>
          <span>✨</span>
        </div>

        <h1 className="hero-title">
          Selamat Ulang Tahun,{' '}
          {isEditingName ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              autoFocus
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid #FDE047',
                borderRadius: '8px',
                color: '#FDE047',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textAlign: 'center',
                width: 'auto',
                maxWidth: '300px',
                display: 'inline-block',
                outline: 'none',
              }}
            />
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              style={{ cursor: 'pointer', borderBottom: '2px dashed rgba(253, 224, 71, 0.4)' }}
              title="Klik untuk mengubah nama jika diinginkan"
            >
              {recipientName}!
            </span>
          )}
        </h1>

        <p className="hero-subtitle">
          Selamat bertambah usia! Semoga panjang umur, senantiasa dilimpahkan kesehatan, kebahagiaan, kemudahan dalam setiap langkah, serta terkabul segala impian dan cita-cita.
        </p>

        {/* Coucou Mochi Interactive Stage */}
        <div className="mochi-stage-container">
          <div className="glass-panel" style={{ padding: '24px 16px 20px' }}>
            <CoucouMochi
              recipientName={recipientName}
              isIslandExpanded={isIslandExpanded}
              onToggleExpand={() => setIsIslandExpanded((prev) => !prev)}
            />
          </div>
        </div>

        {/* Interactive Wish Board and Gift Box */}
        <WishBoard recipientName={recipientName} />
      </section>

      {/* Footer */}
      <footer className="footer-wrap">
        <p style={{ marginBottom: '8px' }}>
          Dibuat dengan segenap doa terbaik untuk{' '}
          <strong style={{ color: '#F8FAFC' }}>{recipientName}</strong> 🎂🎉
        </p>
        <p style={{ fontSize: '12px', opacity: 0.75 }}>
          Animasi karakter Mochi terinspirasi dari proyek open-source{' '}
          <a
            href="https://github.com/louis-cfm/coucou"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Coucou (Louis Raillé)
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
