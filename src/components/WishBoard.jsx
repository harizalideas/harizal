'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from './AudioSynth';

const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Keluarga & Sahabat',
    text: 'Selamat ulang tahun Harizal! Semoga panjang umur, selalu diberikan kesehatan, kelimpahan rezeki, serta kebahagiaan dunia akhirat! 🤲🌟',
    time: 'Hari ini',
  },
  {
    id: 2,
    name: 'Rekan Kreatif & Tech Squad',
    text: 'Barakallahu fii umrik! Sukses terus untuk setiap proyek, inovasi, dan mimpi-mimpi besarnya! Terus berkarya dan menginspirasi! 🚀💻',
    time: 'Hari ini',
  },
  {
    id: 3,
    name: 'Mochi (Coucou)',
    text: 'Horeee selamat ulang tahun! Jangan lupa tersenyum setiap hari ya, Mochi selalu siap nemenin kamu di layar! 🐾🎂',
    time: 'Baru saja',
  },
];

export default function WishBoard({ recipientName = 'Harizal' }) {
  const [wishes, setWishes] = useState(DEFAULT_WISHES);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  // Load stored wishes on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('harizal_birthday_wishes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
        }
      }
    } catch {}
  }, []);

  const handleAddWish = (e) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newWish = {
      id: Date.now(),
      name: author.trim(),
      text: message.trim(),
      time: 'Baru saja',
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('harizal_birthday_wishes', JSON.stringify(updated));
    } catch {}

    setAuthor('');
    setMessage('');

    birthdaySynth.playChimeSuccess();
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#FF5A5F', '#FFD166', '#06D6A0', '#118AB2', '#7928CA'],
    });
  };

  const handleOpenGift = () => {
    setIsGiftOpen(true);
    birthdaySynth.playChimeSuccess();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="features-grid">
      {/* 1. Interactive Wish Wall */}
      <div className="card-item glass-panel">
        <div className="card-icon-box">💌</div>
        <h3 className="card-title">Papan Doa & Harapan</h3>
        <p className="card-desc">
          Tinggalkan pesan ucapan hangat dan doa terbaik untuk {recipientName} di hari spesialnya ini.
        </p>

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

        <form onSubmit={handleAddWish} className="wish-form">
          <input
            type="text"
            className="input-glass"
            placeholder="Nama Anda..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={35}
            required
          />
          <textarea
            className="input-glass"
            rows={2}
            placeholder={`Tulis doa untuk ${recipientName}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={250}
            required
          />
          <button type="submit" className="btn-interactive btn-primary" style={{ justifyContent: 'center' }}>
            💌 Kirim Ucapan & Doa
          </button>
        </form>
      </div>

      {/* 2. Interactive Surprise Gift Box */}
      <div className="card-item glass-panel">
        <div className="card-icon-box">🎁</div>
        <h3 className="card-title">Kado Spesial Hari Ini</h3>
        <p className="card-desc">
          Ada sebuah kejutan spesial yang disiapkan khusus untuk {recipientName}. Ketuk kado di bawah untuk membukanya!
        </p>

        <div className="gift-box-wrapper" onClick={handleOpenGift} title="Klik untuk membuka kado!">
          <div className="gift-box-icon">🎁</div>
          <button type="button" className="btn-interactive btn-primary" style={{ marginTop: '16px' }}>
            ✨ Buka Kado Kejutan
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center' }}>
            🎂 Setiap detik adalah berkah, setiap tahun adalah babak baru penuh keajaiban.
          </p>
        </div>
      </div>

      {/* Modal Kado Terbuka */}
      {isGiftOpen && (
        <div className="modal-overlay" onClick={() => setIsGiftOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsGiftOpen(false)}
            >
              ✕
            </button>

            <div style={{ fontSize: '56px', marginBottom: '14px' }}>🏆👑🎂</div>

            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', color: '#FDE047' }}>
              Selamat Ulang Tahun, {recipientName}!
            </h2>

            <p style={{ color: '#E2E8F0', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              Selamat melangkah ke usia yang baru! Semoga langkahmu senantiasa dipenuhi keberkahan, kemudahan dalam setiap urusan, kesehatan yang paripurna, keluarga yang bahagia, serta dikelilingi orang-orang yang tulus mendukungmu.
            </p>

            <div
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px dashed rgba(251, 191, 36, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FBBF24', marginBottom: '4px' }}>
                🌟 KODE KEBERUNTUNGAN HARI INI
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.05em' }}>
                HARI-BAHAGIA-{new Date().getFullYear()}
              </div>
            </div>

            <button
              type="button"
              className="btn-interactive btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                birthdaySynth.playChimeSuccess();
                confetti({
                  particleCount: 80,
                  spread: 90,
                  origin: { y: 0.5 },
                });
                setIsGiftOpen(false);
              }}
            >
              Terima Kasih Banyak! 💖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
