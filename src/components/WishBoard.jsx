'use client';

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from './AudioSynth';
import Lanyard from './Lanyard';
import { getGreetingContext } from '@/lib/relationships';

export default function WishBoard({
  recipientName = 'Nurlaila',
  senderName = 'Harizal & Berlian Sekeluarga',
  photoUrl = '/kado/nurlaila.jpeg',
  relationship = 'parent_to_child',
  slug = '',
}) {
  const context = useMemo(() => {
    return getGreetingContext(relationship, recipientName, senderName);
  }, [relationship, recipientName, senderName]);

  const [wishes, setWishes] = useState(context.defaultWishes);
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmittedWish, setLastSubmittedWish] = useState('');

  const storageKey = useMemo(() => {
    const safeKey = (slug || recipientName).toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `birthday_wishes_${safeKey}`;
  }, [slug, recipientName]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
          return;
        }
      }
      setWishes(context.defaultWishes);
    } catch {
      setWishes(context.defaultWishes);
    }
  }, [storageKey, context.defaultWishes]);

  const handleSendHope = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const wishText = message.trim();
    const newWish = {
      id: Date.now(),
      name: `${recipientName} ✨`,
      text: wishText,
      time: 'Baru saja dipanjatkan',
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    setLastSubmittedWish(wishText);
    setMessage('');

    birthdaySynth.playChimeSuccess();
    confetti({
      particleCount: 100,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#FF5A5F', '#FFD166', '#06D6A0', '#118AB2', '#7928CA', '#FF4081'],
    });

    setShowSuccessModal(true);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 1. Special Heartfelt Letter tailored to relationship */}
      <div className="special-letter-card glass-panel">
        <div className="letter-header">
          <div className="letter-avatar-couple">💌</div>
          <div>
            <div className="letter-title">{context.letterTitle}</div>
            <div className="letter-subtitle">{senderName}</div>
          </div>
        </div>

        <div className="letter-body">
          <p>
            <strong>{context.letterGreeting}</strong>
          </p>
          {context.letterParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="letter-signature">
          {context.letterSignature}
        </div>
      </div>

      {/* 2. Interactive Surprise Gift: 3D Lanyard Frame of recipient */}
      <div className="gift-card glass-panel" style={{ overflow: 'hidden', padding: '20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '24px' }}>🎁</span>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FDE047' }}>
            Kado Spesial: Frame Lanyard 3D
          </h3>
        </div>

        <p style={{ fontSize: '13px', color: '#CBD5E1', marginBottom: '14px', textAlign: 'center', lineHeight: '1.5' }}>
          Kado foto kenangan istimewa {recipientName} dalam frame kartu gantung 3D interaktif.
        </p>

        {/* 3D Lanyard Stage */}
        <div
          style={{
            width: '100%',
            height: '460px',
            position: 'relative',
            borderRadius: '18px',
            background: 'radial-gradient(circle at 50% 30%, rgba(30, 36, 52, 0.7), rgba(10, 12, 18, 0.95))',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6), 0 10px 25px rgba(0, 0, 0, 0.4)',
            marginBottom: '12px',
            overflow: 'hidden',
          }}
        >
          <Lanyard
            frontImage={photoUrl || '/images/placeholder-card.svg'}
            backImage={photoUrl || '/images/placeholder-card.svg'}
            cardColor="#1A1D26"
            strapColor="#E11D48"
            metal="gold"
            finish="glossy"
            orientation="portrait"
            size={0.68}
            gravity={0.9}
            breeze={0.4}
            elasticity={0.6}
            damping={0.45}
            interactive={true}
          />

          {/* Floating hint badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '11.5px',
              color: '#FDE047',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            👆 Sentuh, tarik &amp; putar foto {recipientName}!
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', lineHeight: '1.4' }}>
          ✨ <em>Kartu ini bisa ditarik, diayunkan, dan disentuh untuk membalikkan posisi foto secara 3D realtime!</em>
        </p>
      </div>

      {/* 3. Section Sampaikan Harapan & Doa (Dinamis Sesuai Data) */}
      <div className="wish-card glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🌸</span>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC' }}>
            Sampaikan Harapan &amp; Doa {recipientName}
          </h3>
        </div>
        
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px', lineHeight: '1.5' }}>
          Di usia yang baru ini, tuliskan impian, cita-cita, dan doa yang {recipientName} panjatkan kepada Allah SWT:
        </p>

        {/* Input Form Dinamis */}
        <form onSubmit={handleSendHope} className="wish-form">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 77, 121, 0.15)',
              border: '1px solid rgba(255, 77, 121, 0.3)',
              color: '#FF6584',
              fontSize: '12px',
              fontWeight: '600',
              width: 'fit-content',
              marginBottom: '4px',
            }}
          >
            <span>✍️</span>
            <span>Harapan dari: {recipientName}</span>
          </div>

          <textarea
            className="input-glass"
            rows={3}
            placeholder={`Tuliskan harapan dan doa ${recipientName} di sini (kesehatan, kelapangan rezeki, cita-cita yang ingin dicapai)...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={300}
            required
            style={{ resize: 'none', lineHeight: '1.5' }}
          />

          <button
            type="submit"
            className="btn-interactive btn-primary"
            style={{ width: '100%', marginTop: '6px', fontSize: '14.5px', padding: '12px 16px' }}
          >
            ✨ Kirim Harapan
          </button>
        </form>

        {/* Daftar Doa & Harapan Dinamis Sesuai Data */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#FDE047', marginBottom: '10px' }}>
            📖 Kumpulan Doa &amp; Harapan:
          </div>

          <div className="wish-list">
            {wishes.map((w) => (
              <div key={w.id} className="wish-item">
                <div className="wish-author">
                  <span>{w.name}</span>
                  <span className="wish-time">{w.time}</span>
                </div>
                <p className="wish-text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL RESPON DINAMIS: "Semoga harapan dan doa [Nama] terwujud, Amin" */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              ✕
            </button>

            <div style={{ fontSize: '54px', marginBottom: '12px' }}>🤲✨💖</div>

            <h2 style={{ fontSize: '21px', fontWeight: '800', marginBottom: '12px', color: '#FDE047', lineHeight: '1.3' }}>
              Semoga harapan dan doa {recipientName} terwujud, Amin
            </h2>

            {lastSubmittedWish && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>
                  Doa yang baru saja dipanjatkan:
                </div>
                <p style={{ color: '#E2E8F0', fontSize: '13.5px', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{lastSubmittedWish}"
                </p>
              </div>
            )}

            <p style={{ color: '#CBD5E1', fontSize: '13.5px', lineHeight: '1.55', marginBottom: '20px' }}>
              Kami ({senderName}) ikut mengaminkan dari lubuk hati yang terdalam. Semoga Allah mudahkan dan kabulkan setiap bait doa {recipientName}! 🌸✨
            </p>

            <button
              type="button"
              className="btn-interactive btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={() => {
                birthdaySynth.playChimeSuccess();
                confetti({
                  particleCount: 70,
                  spread: 80,
                  origin: { y: 0.6 },
                });
                setShowSuccessModal(false);
              }}
            >
              Aamiin Ya Rabbal Alamin 🤲❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
