'use client';

import React from 'react';
import MusicPlayer from './MusicPlayer';

export default function DynamicNotch({
  isMusicPlaying,
  onToggleMusic,
  recipientName = 'Nurlaila',
}) {
  return (
    <div className="notch-container">
      <div className="dynamic-island">
        <div className="island-avatar">🎂</div>

        <div className="island-text">
          <span>Hari Bahagia {recipientName} ✨</span>
        </div>

        <MusicPlayer isPlaying={isMusicPlaying} onTogglePlay={onToggleMusic} />
      </div>
    </div>
  );
}
