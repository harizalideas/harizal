'use client';

import React, { useState, useRef } from 'react';
import WarpText from '@/components/WarpText';
import FloatingBalloons from '@/components/FloatingBalloons';
import confetti from 'canvas-confetti';

export default function LandingHomePage() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'edit'

  // Form State: Create
  const [createForm, setCreateForm] = useState({
    recipient_name: '',
    sender_name: '',
    email: '',
    password: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('/kado/nurlaila.jpeg');
  const fileInputRef = useRef(null);

  // Form State: Edit
  const [editAuth, setEditAuth] = useState({
    email: '',
    password: '',
  });
  const [loggedInGreeting, setLoggedInGreeting] = useState(null);
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState(null);
  const editFileInputRef = useRef(null);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Handle Photo Selection for Create
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // Handle Photo Selection for Edit
  const handleEditPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditPhotoFile(file);
      const url = URL.createObjectURL(file);
      setEditPhotoPreview(url);
    }
  };

  // Submit: Create New Greeting
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('recipient_name', createForm.recipient_name);
      data.append('sender_name', createForm.sender_name);
      data.append('email', createForm.email);
      data.append('password', createForm.password);
      if (photoFile) {
        data.append('photo', photoFile);
      }

      const res = await fetch('/api/greeting/create', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal membuat kartu ucapan.');
      }

      setSuccessData({
        title: '🎉 Kartu Ucapan Berhasil Dibuat!',
        message: `Pengalaman ucapan spesial untuk ${result.recipientName} sudah online dan siap dibagikan! Akses edit juga telah dikirimkan ke email ${createForm.email}.`,
        url: result.greetingUrl,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit: Edit Login
  const handleEditLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/greeting/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editAuth.email,
          password: editAuth.password,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal memuat kartu ucapan.');
      }

      setLoggedInGreeting(result.greeting);
      setEditPhotoPreview(result.greeting.photo_url || '/kado/nurlaila.jpeg');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit: Update Greeting
  const handleUpdateGreeting = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('email', editAuth.email);
      data.append('password', editAuth.password);
      data.append('recipient_name', loggedInGreeting.recipient_name);
      data.append('sender_name', loggedInGreeting.sender_name);
      data.append('current_photo_url', loggedInGreeting.photo_url || '');
      data.append('slug', loggedInGreeting.slug || '');
      if (editPhotoFile) {
        data.append('photo', editPhotoFile);
      }

      const res = await fetch('/api/greeting/edit', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal memperbarui kartu ucapan.');
      }

      setSuccessData({
        title: '✨ Perubahan Berhasil Disimpan!',
        message: `Kartu ucapan untuk ${result.greeting.recipient_name} telah berhasil diperbarui dan konfirmasi dikirimkan ke email Anda.`,
        url: result.greetingUrl,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (successData?.url) {
      navigator.clipboard.writeText(successData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mobile-app-container" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <FloatingBalloons />

      {/* Top Branding Bar */}
      <header style={{ textAlign: 'center', paddingTop: '20px', marginBottom: '8px' }}>
        <div className="badge-family" style={{ margin: '0 auto 12px' }}>
          <span>✨</span>
          <span>PLATFORM KARTU INTERAKTIF MASA DEPAN</span>
          <span>🌸</span>
        </div>
      </header>

      {/* Hero WarpText Display */}
      <section className="landing-hero">
        <div className="warptext-wrapper">
          <WarpText
            text={'sampaikan ucapan\nmenjadi pengalaman'}
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            lens="bulge"
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            chromatic={0.35}
            idleDrift={0.25}
            ripple={true}
            clickRipple={true}
            intro={true}
            fontSize="clamp(1.75rem, 6vw, 3.2rem)"
            fontWeight={800}
            fontFamily="Outfit, sans-serif"
            style={{ width: '100%', height: '240px' }}
            color="#FFFFFF"
            letterSpacing="-0.04em"
            lineHeight={1.1}
          />
        </div>

        <p className="landing-sub">
          Sulap kartu ucapan biasa menjadi petualangan 3D interaktif dengan animasi Coucou Mochi &amp; Frame Kartu Gantung (Lanyard) 3D yang berkesan selamanya.
        </p>

        {/* Tab Switcher */}
        <div className="tab-switch-container">
          <button
            type="button"
            className={`tab-switch-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('create');
              setErrorMessage('');
            }}
          >
            <span>🎁</span>
            <span>Buat Baru</span>
          </button>
          <button
            type="button"
            className={`tab-switch-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('edit');
              setErrorMessage('');
            }}
          >
            <span>✏️</span>
            <span>Edit Yang Pernah Dibuat</span>
          </button>
        </div>
      </section>

      {/* Error Banner */}
      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            marginBottom: '18px',
            textAlign: 'center',
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="glass-panel" style={{ padding: '24px 18px', marginBottom: '24px' }}>
        {/* TAB 1: BUAT BARU */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '4px' }}>
                🎉 Formulir Pembuatan Kartu Baru
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                Isi data di bawah untuk meracik pengalaman kartu ucapan spesialmu.
              </p>
            </div>

            {/* Untuk siapa ucapan anda */}
            <div>
              <label className="form-label">
                🎂 Untuk siapa ucapan anda :
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Nurlaila"
                className="form-input"
                value={createForm.recipient_name}
                onChange={(e) => setCreateForm({ ...createForm, recipient_name: e.target.value })}
              />
            </div>

            {/* Dari siapa ucapan diberikan */}
            <div>
              <label className="form-label">
                💌 Dari siapa ucapan diberikan :
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Harizal & Berlian Sekeluarga"
                className="form-input"
                value={createForm.sender_name}
                onChange={(e) => setCreateForm({ ...createForm, sender_name: e.target.value })}
              />
            </div>

            {/* Upload foto yang menjadi kado */}
            <div>
              <label className="form-label">
                📸 Upload foto yang menjadi kado :
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoSelect}
              />
              <div
                className="file-upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview Kado" className="preview-thumbnail" />
                ) : (
                  <div style={{ fontSize: '32px' }}>📷</div>
                )}
                <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '600' }}>
                  {photoFile ? photoFile.name : 'Pilih Foto Kado (Nurlaila/Foto Kenangan)'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Ketuk untuk mengganti foto kado dalam 3D Lanyard
                </div>
              </div>
            </div>

            {/* Email anda */}
            <div>
              <label className="form-label">
                📧 Email anda :
              </label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                className="form-input"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                *Akses akun dan tautan kartu ucapan akan dikirimkan ke email ini.
              </span>
            </div>

            {/* Password anda */}
            <div>
              <label className="form-label">
                🔑 Password anda :
              </label>
              <input
                type="password"
                required
                placeholder="Buat password untuk edit nanti"
                className="form-input"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                *Digunakan jika suatu saat ingin mengubah foto atau ucapan.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-action"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Meracik Pengalaman 3D...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Buat Pengalaman Ucapan Sekarang</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: EDIT YANG PERNAH DIBUAT */}
        {activeTab === 'edit' && (
          <div>
            {!loggedInGreeting ? (
              <form onSubmit={handleEditLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '4px' }}>
                    🔐 Masuk ke Akun Kartu Anda
                  </h2>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                    Masukkan email dan password yang Anda gunakan saat membuat kartu ucapan.
                  </p>
                </div>

                <div>
                  <label className="form-label">📧 Email anda :</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    className="form-input"
                    value={editAuth.email}
                    onChange={(e) => setEditAuth({ ...editAuth, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">🔑 Password anda :</label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password akun Anda"
                    className="form-input"
                    value={editAuth.password}
                    onChange={(e) => setEditAuth({ ...editAuth, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary-action"
                >
                  {isLoading ? 'Memeriksa Akun...' : '🔑 Buka & Edit Kartu Ucapan'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleUpdateGreeting} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC' }}>
                      ✏️ Edit Kartu Ucapan
                    </h2>
                    <span style={{ fontSize: '12px', color: '#38BDF8' }}>
                      Slug: /{loggedInGreeting.slug}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoggedInGreeting(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#94A3B8',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Keluar
                  </button>
                </div>

                {/* Edit Recipient Name */}
                <div>
                  <label className="form-label">🎂 Untuk siapa ucapan anda :</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={loggedInGreeting.recipient_name}
                    onChange={(e) =>
                      setLoggedInGreeting({ ...loggedInGreeting, recipient_name: e.target.value })
                    }
                  />
                </div>

                {/* Edit Sender Name */}
                <div>
                  <label className="form-label">💌 Dari siapa ucapan diberikan :</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={loggedInGreeting.sender_name}
                    onChange={(e) =>
                      setLoggedInGreeting({ ...loggedInGreeting, sender_name: e.target.value })
                    }
                  />
                </div>

                {/* Edit Photo */}
                <div>
                  <label className="form-label">📸 Foto Kado (3D Lanyard) :</label>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleEditPhotoSelect}
                  />
                  <div
                    className="file-upload-dropzone"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    {editPhotoPreview && (
                      <img src={editPhotoPreview} alt="Foto Kado" className="preview-thumbnail" />
                    )}
                    <div style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '600' }}>
                      {editPhotoFile ? editPhotoFile.name : 'Ketuk untuk ganti foto kado'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary-action"
                >
                  {isLoading ? 'Menyimpan Perubahan...' : '💾 Simpan Perubahan Kartu'}
                </button>

                <a
                  href={`/${loggedInGreeting.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38BDF8',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                  }}
                >
                  🚀 Buka Halaman Kartu Saat Ini →
                </a>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Success Modal */}
      {successData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉✨</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FDE047', marginBottom: '8px' }}>
              {successData.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '18px' }}>
              {successData.message}
            </p>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '16px',
                wordBreak: 'break-all',
                fontSize: '13px',
                color: '#38BDF8',
                fontWeight: '600',
              }}
            >
              {successData.url}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={copyToClipboard}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: copied ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✅ Tersalin!' : '📋 Salin Tautan'}
              </button>

              <a
                href={successData.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F43F5E, #EC4899)',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🚀 Buka Sekarang
              </a>
            </div>

            <button
              type="button"
              onClick={() => setSuccessData(null)}
              style={{
                marginTop: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Tutup Modal
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-wrap">
        <p style={{ marginBottom: '6px', fontWeight: '600', color: '#F1F5F9' }}>
          Harizal · Sampaikan Ucapan Menjadi Pengalaman ✨
        </p>
        <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '8px' }}>
          Kartu interaktif beranimasi 3D Lanyard &amp; Coucou Mochi
        </p>
        <div style={{ fontSize: '11px', color: '#64748B' }}>
          Email notifikasi dikirimkan dari harizal@official.id
        </div>
      </footer>
    </div>
  );
}
