'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function MusicPlayer({ isPlaying, onTogglePlay }) {
  return (
    <button
      type="button"
      className={`music-toggle-btn ${isPlaying ? 'playing' : ''}`}
      onClick={onTogglePlay}
      title={isPlaying ? 'Jeda Musik' : 'Putar Musik Ulang Tahun'}
    >
      {isPlaying ? (
        <>
          <div className="sound-bars">
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
          </div>
          <span>Musik Aktif</span>
        </>
      ) : (
        <>
          <span>🎵 Putar Musik</span>
        </>
      )}
    </button>
  );
}
