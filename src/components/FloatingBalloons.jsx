'use client';

import React, { useMemo } from 'react';

export default function FloatingBalloons() {
  const balloons = useMemo(() => {
    const colors = [
      'radial-gradient(circle at 35% 35%, #FF758C, #FF4B72)',
      'radial-gradient(circle at 35% 35%, #FFDE59, #FF914D)',
      'radial-gradient(circle at 35% 35%, #70A6FF, #0056D2)',
      'radial-gradient(circle at 35% 35%, #7BE495, #22B573)',
      'radial-gradient(circle at 35% 35%, #D49BFF, #8E2DE2)',
    ];

    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: `${(i * 11 + 5) % 95}%`,
      bg: colors[i % colors.length],
      size: `${34 + (i * 7) % 24}px`,
      delay: `${(i * 1.8) % 8}s`,
      duration: `${11 + (i * 2.5) % 8}s`,
    }));
  }, []);

  return (
    <div className="balloons-container" aria-hidden="true">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            background: b.bg,
            width: b.size,
            height: `calc(${b.size} * 1.25)`,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </div>
  );
}
