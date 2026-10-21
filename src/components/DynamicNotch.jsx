'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from './AudioSynth';

export default function DynamicNotch({
  isExpanded,
  onToggle,
  recipientName = 'Harizal',
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard?.writeText(url);
      setCopied(true);
      birthdaySynth.playChimeSuccess();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.1 },
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="notch-container">
      <div
        className={`dynamic-island ${isExpanded ? 'expanded' : ''}`}
        onClick={onToggle}
        title="Klik untuk membuka / menutup Dynamic Island"
      >
        <div className="island-avatar">🎂</div>

        <div className="island-text">
          {isExpanded ? (
            <span>Selamat Ulang Tahun, {recipientName}! 🎉✨</span>
          ) : (
            <span>Mochi: Hari Spesial {recipientName}</span>
          )}
        </div>

        <div className="island-tag">
          {isExpanded ? 'Ketuk untuk ciutkan' : 'Special Day'}
        </div>

        {isExpanded && (
          <button
            type="button"
            className="btn-interactive"
            style={{ padding: '4px 12px', fontSize: '12px', marginLeft: '6px' }}
            onClick={handleShare}
          >
            {copied ? '✅ Disalin!' : '🔗 Bagikan'}
          </button>
        )}
      </div>
    </div>
  );
}
