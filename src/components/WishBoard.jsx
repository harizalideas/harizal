'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from './AudioSynth';

const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Berlian & Harizal ❤️',
    text: 'Selamat ulang tahun Nurlaila sayang! Makasih udah selalu jadi sahabat terbaik dan keluarga buat kami. Sehat terus, bahagia selalu, dan lancar semua urusannya ya! 🤲🌸',
    time: 'Hari ini',
  },
  {
    id: 2,
    name: 'Keluarga Besar Harizal & Berlian',
    text: 'Barakallahu fii umrik Nurlaila! Semoga di usia yang baru ini Allah limpahkan berkah berlipat ganda, rezeki melimpah, serta kebahagiaan dunia akhirat! 🌟🎂',
    time: 'Hari ini',
  },
  {
    id: 3,
    name: 'Mochi (Coucou)',
    text: 'Horeee selamat ulang tahun Kak Nurlaila! Mochi ikut seneng banget hari ini! Jangan lupa tersenyum yaa! 🐾✨',
    time: 'Baru saja',
  },
];

export default function WishBoard({ recipientName = 'Nurlaila' }) {
  const [wishes, setWishes] = useState(DEFAULT_WISHES);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nurlaila_birthday_wishes');
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
      localStorage.setItem('nurlaila_birthday_wishes', JSON.stringify(updated));
    } catch {}

    setAuthor('');
    setMessage('');

    birthdaySynth.playChimeSuccess();
    confetti({
      particleCount: 75,
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
    <div style={{ width: '100%' }}>
      {/* 1. Special Heartfelt Letter from Harizal & Berlian */}
      <div className="special-letter-card glass-panel">
        <div className="letter-header">
          <div className="letter-avatar-couple">💌</div>
          <div>
            <div className="letter-title">Pesan Hangat Dari Kami</div>
            <div className="letter-subtitle">Harizal & Berlian Sekeluarga</div>
          </div>
        </div>

        <div className="letter-body">
          <p>
            <strong>Untuk Nurlaila Tersayang,</strong>
          </p>
          <p>
            Di hari yang penuh kebahagiaan ini, kami sekeluarga ingin mengucapkan <em>Selamat Ulang Tahun</em> yang paling hangat dan penuh berkah.
          </p>
          <p>
            Bagi kami (Harizal & Berlian), Nurlaila bukan sekadar sahabat, tapi sudah menjadi bagian dari keluarga kami sendiri yang begitu berharga dan kami sayangi.
          </p>
          <p>
            Terima kasih atas segala tawa, ketulusan, dan kebaikan yang selalu mengalir selama ini. Semoga Allah SWT senantiasa menganugerahkan kesehatan, umur yang penuh berkah, kebahagiaan lahir batin, kelapangan rezeki, serta kemudahan dalam menggapai setiap impian dan cita-cita Nurlaila.
          </p>
        </div>

        <div className="letter-signature">
          Peluk hangat & doa tulus, Harizal & Berlian ❤️
        </div>
      </div>

      {/* 2. Interactive Surprise Gift Box */}
      <div className="gift-card glass-panel">
        <div className="gift-box-icon">🎁</div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
          Kado Kejutan Untuk Nurlaila
        </h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px', lineHeight: '1.5' }}>
          Ada sebuah kartu penghargaan & doa spesial yang disiapkan khusus untuk Nurlaila. Ketuk tombol di bawah untuk membukanya!
        </p>

        <button
          type="button"
          className="btn-interactive btn-primary"
          style={{ width: '100%', maxWidth: '280px' }}
          onClick={handleOpenGift}
        >
          ✨ Buka Kado Kejutan!
        </button>
      </div>

      {/* 3. Wish Wall & Personal Prayer */}
      <div className="wish-card glass-panel">
        <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌸</span>
          <span>Papan Doa & Harapan</span>
        </h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '14px', lineHeight: '1.5' }}>
          Tinggalkan doa indah untuk Nurlaila atau tulis harapan pribadimu di hari ulang tahun ini:
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
            placeholder="Nama Pengirim..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={35}
            required
          />
          <textarea
            className="input-glass"
            rows={2}
            placeholder="Tulis doa atau harapan terbaik..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={250}
            required
          />
          <button
            type="submit"
            className="btn-interactive btn-primary"
            style={{ width: '100%', marginTop: '4px' }}
          >
            💌 Kirim Doa & Harapan
          </button>
        </form>
      </div>

      {/* Surprise Modal */}
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

            <div style={{ fontSize: '50px', marginBottom: '10px' }}>👑🌸💖</div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#FDE047' }}>
              Selamat Ulang Tahun, {recipientName}!
            </h2>

            <p style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
              "Sahabat sejati adalah keluarga yang kita pilih dengan hati. Semoga di usiamu yang baru ini, setiap langkahmu dipenuhi keberkahan, senyumanmu selalu merekah, dan hari-harimu selalu dikelilingi cinta kasih."
            </p>

            <div
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px dashed rgba(251, 191, 36, 0.4)',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#FBBF24', marginBottom: '3px' }}>
                🌟 KARTU PENGHARGAAN KELUARGA
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFF' }}>
                SAHABAT TERBAIK SEPANJANG MASA
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                Diberikan dengan penuh kasih oleh Harizal & Berlian
              </div>
            </div>

            <button
              type="button"
              className="btn-interactive btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                birthdaySynth.playChimeSuccess();
                confetti({
                  particleCount: 80,
                  spread: 85,
                  origin: { y: 0.5 },
                });
                setIsGiftOpen(false);
              }}
            >
              Aamiin, Terima Kasih Banyak! 💖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
