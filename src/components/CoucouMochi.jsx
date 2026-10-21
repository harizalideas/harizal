'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from './AudioSynth';

export default function CoucouMochi({
  recipientName = 'Nurlaila',
  isMusicPlaying = false,
  onToggleMusic,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // States
  const [mood, setMood] = useState('waving');
  const [pokeCount, setPokeCount] = useState(0);
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [hatStyle, setHatStyle] = useState(0); // 0: Party cone, 1: Golden Crown, 2: Birthday Bow
  const [speechBubble, setSpeechBubble] = useState(`Hai ${recipientName}! Selamat Ulang Tahun! 🎉`);

  // Animation refs
  const stateRef = useRef({
    lookX: 0,
    lookY: 0,
    targetLookX: 0,
    targetLookY: 0,
    scaleX: 1,
    scaleY: 1,
    tilt: 0,
    targetTilt: 0,
    open: 1,
    blinkTimer: 0,
    isBlinking: false,
    dizzyAngle: 0,
    wavePhase: 0,
    smokeParticles: [],
    rapidPokes: 0,
    lastPokeTime: 0,
    hatWobble: 0,
  });

  const triggerConfetti = useCallback((originX = 0.5, originY = 0.55) => {
    if (typeof window === 'undefined') return;
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#FF5A5F', '#FFD166', '#06D6A0', '#118AB2', '#7928CA', '#FF4081'],
    });
  }, []);

  const triggerBirthdayExplosion = useCallback(() => {
    if (typeof window === 'undefined') return;
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8E72'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#A78BFA', '#F472B6', '#38BDF8', '#FCD34D'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleMochiPoke = useCallback((e) => {
    e?.stopPropagation?.();
    const now = Date.now();
    const st = stateRef.current;

    // Squash & Stretch spring physics
    st.scaleX = 1.32;
    st.scaleY = 0.72;
    st.hatWobble = (Math.random() - 0.5) * 0.45;

    if (now - st.lastPokeTime < 500) {
      st.rapidPokes += 1;
    } else {
      st.rapidPokes = 1;
    }
    st.lastPokeTime = now;
    setPokeCount((c) => c + 1);

    birthdaySynth.playPop(480 + Math.random() * 120);

    if (st.rapidPokes >= 5) {
      setMood('dizzy');
      setSpeechBubble('Aduh Mochi pusing dicolek terus! Hehe 💫');
      setTimeout(() => {
        setMood('happy');
        setSpeechBubble(`Selamat Ulang Tahun ya ${recipientName}! ❤️`);
        st.rapidPokes = 0;
      }, 2500);
    } else {
      setMood('excited');
      const phrases = [
        `Hehehe geli! Selamat Ultah ${recipientName}! 🎂`,
        `Dari Mas Harizal & Mba Berlian! 💖`,
        `Kak Nurlaila sudah seperti keluarga kami! ✨`,
        `Semoga panjang umur & bahagia selalu! 🤲`,
        `Mochi sayang Kak Nurlaila! 🐾`,
      ];
      setSpeechBubble(phrases[Math.floor(Math.random() * phrases.length)]);

      if (st.rapidPokes % 2 === 0) {
        triggerConfetti(0.5, 0.45);
      }

      setTimeout(() => {
        setMood('waving');
      }, 1600);
    }
  }, [recipientName, triggerConfetti]);

  const handleBlowCandle = useCallback(() => {
    if (isCandleBlown) {
      setIsCandleBlown(false);
      setSpeechBubble('Lilin dinyalakan lagi! Yuk bikin doa baru 🕯️✨');
      birthdaySynth.playPop(620);
      return;
    }

    setIsCandleBlown(true);
    setSpeechBubble(`Horeee! Lilin padam! Doa ${recipientName} terkabul! 🎉🎂`);
    birthdaySynth.playBlow();

    // Start music if not yet playing
    if (!isMusicPlaying && onToggleMusic) {
      onToggleMusic();
    }

    // Smoke puff
    const st = stateRef.current;
    for (let i = 0; i < 20; i++) {
      st.smokeParticles.push({
        x: 0,
        y: 12,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -1.2 - Math.random() * 2,
        radius: 3 + Math.random() * 4,
        alpha: 0.85,
        life: 0,
        maxLife: 40 + Math.random() * 25,
      });
    }

    triggerBirthdayExplosion();
  }, [isCandleBlown, isMusicPlaying, onToggleMusic, recipientName, triggerBirthdayExplosion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Pointer movement tracking
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

      if (clientX !== undefined && clientY !== undefined) {
        const mx = clientX - (rect.left + rect.width / 2);
        const my = clientY - (rect.top + rect.height / 2);

        const maxDist = 180;
        stateRef.current.targetLookX = Math.max(-1, Math.min(1, mx / maxDist));
        stateRef.current.targetLookY = Math.max(-1, Math.min(1, my / maxDist));
        stateRef.current.targetTilt = stateRef.current.targetLookX * 0.08;
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Lamé Curve n = 3.2 Squircle
    const createSquirclePath = (hw, hh) => {
      const n = 3.2;
      const path = new Path2D();
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const px = hw * Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n);
        const py = hh * Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n);
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      }
      path.closePath();
      return path;
    };

    const roundedRect = (x, y, w, h, r) => {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const cx = W / 2;
      const cy = H / 2;

      const st = stateRef.current;

      // Spring physics
      st.scaleX += (1 - st.scaleX) * 0.15;
      st.scaleY += (1 - st.scaleY) * 0.15;
      st.tilt += (st.targetTilt - st.tilt) * 0.1;
      st.hatWobble *= 0.92;

      // Eye damping
      st.lookX += (st.targetLookX - st.lookX) * 0.14;
      st.lookY += (st.targetLookY - st.lookY) * 0.14;

      // Blinking
      st.blinkTimer += dt;
      if (!st.isBlinking && st.blinkTimer > 2.6 + Math.random() * 2) {
        st.isBlinking = true;
        st.blinkTimer = 0;
      }
      if (st.isBlinking) {
        st.open = Math.max(0.1, Math.sin(st.blinkTimer * 18));
        if (st.blinkTimer > 0.18) {
          st.isBlinking = false;
          st.open = 1;
          st.blinkTimer = 0;
        }
      }

      // Waving & float
      st.wavePhase += dt * 5.5;
      const idleFloatY = Math.sin(time * 0.0022) * 3.5;

      if (mood === 'dizzy') {
        st.dizzyAngle += dt * 6;
      }

      ctx.clearRect(0, 0, W, H);

      // Ambient warm glow
      const haloGradient = ctx.createRadialGradient(cx, cy + idleFloatY, 25, cx, cy + idleFloatY, 140);
      haloGradient.addColorStop(0, 'rgba(255, 214, 153, 0.32)');
      haloGradient.addColorStop(0.6, 'rgba(255, 180, 100, 0.08)');
      haloGradient.addColorStop(1, 'rgba(255, 180, 100, 0)');
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(cx, cy + idleFloatY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Transform Mochi body
      ctx.save();
      ctx.translate(cx, cy + idleFloatY);
      ctx.rotate(st.tilt + Math.sin(st.wavePhase * 0.5) * 0.02);
      ctx.scale(st.scaleX, st.scaleY);

      const hb = 78;
      const hw = (hb / 2) * 1.34;
      const hh = hb / 2;

      // Left hand (Sparkler)
      const handRadius = hb * 0.15;
      ctx.save();
      ctx.translate(-hw - hb * 0.16, hh * 0.45);
      const lHandGrad = ctx.createLinearGradient(0, -handRadius, 0, handRadius);
      lHandGrad.addColorStop(0, '#FFFFFF');
      lHandGrad.addColorStop(1, '#E2E5EB');
      ctx.fillStyle = lHandGrad;
      ctx.beginPath();
      ctx.arc(0, 0, handRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sparkler stick
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, -22);
      ctx.stroke();
      // Tip star
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(-10, -22, 2.5 + Math.sin(time * 0.01) * 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right hand (Coucou Wave)
      const rHandLen = hb * 0.42;
      const rHandThickness = hb * 0.22;
      const waveAngle = -0.65 + Math.sin(st.wavePhase * 1.4) * 0.35;

      ctx.save();
      ctx.translate(hw + hb * 0.16, hh * 0.15 + Math.sin(st.wavePhase * 1.4 + 0.8) * 2.5);
      ctx.rotate(waveAngle);
      const rHandGrad = ctx.createLinearGradient(0, -rHandThickness / 2, 0, rHandThickness / 2);
      rHandGrad.addColorStop(0, '#FFFFFF');
      rHandGrad.addColorStop(1, '#E2E5EB');
      ctx.fillStyle = rHandGrad;
      roundedRect(-rHandLen / 2, -rHandThickness / 2, rHandLen, rHandThickness, rHandThickness / 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Mochi Body (Squircle)
      const bodySquircle = createSquirclePath(hw, hh);

      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.2)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.fill(bodySquircle);
      ctx.restore();

      const bodyGrad = ctx.createLinearGradient(hw * 0.4, -hh, -hw * 0.4, hh);
      bodyGrad.addColorStop(0, '#FCFDFE');
      bodyGrad.addColorStop(0.7, '#EFF1F5');
      bodyGrad.addColorStop(1, '#E2E6EE');
      ctx.fillStyle = bodyGrad;
      ctx.fill(bodySquircle);

      // Blushing Cheeks
      const blushY = hh * 0.22;
      const blushSpacing = hw * 0.62;
      const blushRadius = 8.5;
      const blushAlpha = mood === 'excited' || mood === 'waving' ? 0.75 : 0.45;

      [-1, 1].forEach((dir) => {
        const bg = ctx.createRadialGradient(
          dir * blushSpacing,
          blushY,
          1,
          dir * blushSpacing,
          blushY,
          blushRadius
        );
        bg.addColorStop(0, `rgba(255, 110, 140, ${blushAlpha})`);
        bg.addColorStop(1, 'rgba(255, 110, 140, 0)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(dir * blushSpacing, blushY, blushRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Eyes
      const eyeRadius = hb * 0.082;
      const eyeSpacing = hb * 0.26;
      const eyeLookX = st.lookX * hw * 0.35;
      const eyeLookY = st.lookY * hh * 0.26 + hh * 0.08;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * eyeSpacing + eyeLookX, eyeLookY);

        if (mood === 'dizzy') {
          ctx.rotate(st.dizzyAngle * dir);
          ctx.strokeStyle = '#18191D';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 4; a += 0.1) {
            const r = (a / (Math.PI * 4)) * eyeRadius * 1.3;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        } else if (mood === 'excited') {
          ctx.strokeStyle = '#18191D';
          ctx.lineWidth = 2.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(0, eyeRadius * 0.4, eyeRadius * 1.1, Math.PI * 1.15, Math.PI * 1.85);
          ctx.stroke();
        } else {
          ctx.scale(1, Math.max(0.12, st.open));
          ctx.fillStyle = '#141518';
          ctx.beginPath();
          ctx.arc(0, 0, eyeRadius, 0, Math.PI * 2);
          ctx.fill();

          if (st.open > 0.4) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-eyeRadius * 0.32, -eyeRadius * 0.32, eyeRadius * 0.32, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(eyeRadius * 0.25, eyeRadius * 0.25, eyeRadius * 0.15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      });

      // Smile
      ctx.save();
      ctx.translate(eyeLookX * 0.3, hh * 0.35 + eyeLookY * 0.2);
      ctx.strokeStyle = '#18191D';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (mood === 'excited' || mood === 'waving') {
        ctx.arc(0, -2, 5.5, 0.2, Math.PI - 0.2);
        ctx.stroke();
        ctx.fillStyle = '#FF6B8B';
        ctx.beginPath();
        ctx.arc(0, 2.5, 3, 0, Math.PI);
        ctx.fill();
      } else {
        ctx.arc(0, -2.5, 4, 0.3, Math.PI - 0.3);
        ctx.stroke();
      }
      ctx.restore();

      // Hat / Accessories on Head
      ctx.save();
      ctx.translate(0, -hh + 3);
      ctx.rotate(st.hatWobble);

      if (hatStyle === 0) {
        // Striped Party Cone Hat
        const hatH = 44;
        const hatBaseW = 32;
        const hatGrad = ctx.createLinearGradient(-hatBaseW / 2, 0, hatBaseW / 2, -hatH);
        hatGrad.addColorStop(0, '#FF4B72');
        hatGrad.addColorStop(0.5, '#FF8A00');
        hatGrad.addColorStop(1, '#FFDE59');

        ctx.fillStyle = hatGrad;
        ctx.beginPath();
        ctx.moveTo(-hatBaseW / 2, 0);
        ctx.lineTo(0, -hatH);
        ctx.lineTo(hatBaseW / 2, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-9, -9);
        ctx.lineTo(4, -25);
        ctx.moveTo(-3, -3);
        ctx.lineTo(9, -17);
        ctx.stroke();

        // Pom-pom
        const pomY = -hatH - 2 + Math.sin(time * 0.006) * 1.5;
        ctx.fillStyle = '#FFE066';
        ctx.beginPath();
        ctx.arc(0, pomY, 5.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (hatStyle === 1) {
        // Golden Princess Crown
        const crownW = 38;
        const crownH = 22;
        const crGrad = ctx.createLinearGradient(-crownW / 2, 0, crownW / 2, -crownH);
        crGrad.addColorStop(0, '#F59E0B');
        crGrad.addColorStop(0.5, '#FDE047');
        crGrad.addColorStop(1, '#D97706');

        ctx.fillStyle = crGrad;
        ctx.beginPath();
        ctx.moveTo(-crownW / 2, 0);
        ctx.lineTo(-crownW / 2, -crownH * 0.8);
        ctx.lineTo(-crownW / 4, -crownH * 0.4);
        ctx.lineTo(0, -crownH);
        ctx.lineTo(crownW / 4, -crownH * 0.4);
        ctx.lineTo(crownW / 2, -crownH * 0.8);
        ctx.lineTo(crownW / 2, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Cute Party Bow
        ctx.fillStyle = '#EC4899';
        ctx.beginPath();
        ctx.ellipse(-12, -7, 10, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -7, 10, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(0, -7, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.restore(); // end Mochi body

      // Mini Birthday Cake & Candle
      const cakeX = cx;
      const cakeY = cy + hh + 25;

      // Plate
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.ellipse(cakeX, cakeY + 14, 40, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cake Base
      const cakeGrad = ctx.createLinearGradient(cakeX - 28, cakeY, cakeX + 28, cakeY);
      cakeGrad.addColorStop(0, '#F472B6');
      cakeGrad.addColorStop(0.5, '#FB7185');
      cakeGrad.addColorStop(1, '#E11D48');
      ctx.fillStyle = cakeGrad;
      roundedRect(cakeX - 26, cakeY - 5, 52, 18, 5);
      ctx.fill();

      // Frosting
      ctx.fillStyle = '#FFF1F2';
      roundedRect(cakeX - 28, cakeY - 7, 56, 8, 4);
      ctx.fill();

      // Candle
      const candleW = 5;
      const candleH = 18;
      const candleY = cakeY - 7 - candleH;
      ctx.fillStyle = '#38BDF8';
      roundedRect(cakeX - candleW / 2, candleY, candleW, candleH, 2);
      ctx.fill();

      // Wick
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cakeX, candleY);
      ctx.lineTo(cakeX, candleY - 3);
      ctx.stroke();

      // Flame or Smoke
      if (!isCandleBlown) {
        const flameNoise = Math.sin(time * 0.015) * 1.4;
        const flameY = candleY - 10;

        const flameGlow = ctx.createRadialGradient(cakeX, flameY, 2, cakeX, flameY, 22);
        flameGlow.addColorStop(0, 'rgba(255, 200, 50, 0.6)');
        flameGlow.addColorStop(1, 'rgba(255, 120, 0, 0)');
        ctx.fillStyle = flameGlow;
        ctx.beginPath();
        ctx.arc(cakeX, flameY, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.moveTo(cakeX - 3.5, flameY + 5);
        ctx.quadraticCurveTo(cakeX - 4 + flameNoise, flameY - 2, cakeX + flameNoise * 0.5, flameY - 8);
        ctx.quadraticCurveTo(cakeX + 4 + flameNoise, flameY - 2, cakeX + 3.5, flameY + 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(cakeX - 2, flameY + 4);
        ctx.quadraticCurveTo(cakeX - 2.5, flameY, cakeX, flameY - 5);
        ctx.quadraticCurveTo(cakeX + 2.5, flameY, cakeX + 2, flameY + 4);
        ctx.closePath();
        ctx.fill();
      } else {
        // Smoke particles
        for (let i = st.smokeParticles.length - 1; i >= 0; i--) {
          const p = st.smokeParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.radius += 0.07;
          p.alpha -= 0.018;
          p.life++;

          ctx.fillStyle = `rgba(180, 190, 205, ${Math.max(0, p.alpha)})`;
          ctx.beginPath();
          ctx.arc(cakeX + p.x, candleY - 3 + p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          if (p.life > p.maxLife || p.alpha <= 0) {
            st.smokeParticles.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [mood, hatStyle, isCandleBlown]);

  return (
    <div ref={containerRef} className="mochi-canvas-wrapper">
      {/* Speech Bubble */}
      <div
        className="mochi-speech-bubble"
        onClick={handleMochiPoke}
        title="Sentuh untuk menyapa!"
      >
        <span>{speechBubble}</span>
        <div className="bubble-tail" />
      </div>

      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="mochi-canvas"
        onClick={handleMochiPoke}
        title="Sentuh Mochi!"
      />

      {/* Quick Action Buttons */}
      <div className="mochi-controls">
        <button
          type="button"
          className="btn-interactive btn-primary"
          onClick={handleBlowCandle}
        >
          {isCandleBlown ? '🕯️ Nyalakan Lilin' : '🎂 Tiup Lilin!'}
        </button>

        <button
          type="button"
          className="btn-interactive"
          onClick={onToggleMusic}
        >
          {isMusicPlaying ? '⏸️ Jeda Lagu' : '🎵 Lagu Ultah'}
        </button>

        <button
          type="button"
          className="btn-interactive"
          onClick={() => {
            setHatStyle((prev) => (prev + 1) % 3);
            birthdaySynth.playPop(550);
          }}
        >
          👑 Ganti Topi
        </button>

        <button
          type="button"
          className="btn-interactive"
          onClick={() => {
            triggerBirthdayExplosion();
            birthdaySynth.playChimeSuccess();
          }}
        >
          🎉 Hujan Konfeti
        </button>
      </div>

      <p className="hint-text">
        ✨ <em>Sentuh Mochi di layar ponselmu untuk mencolek dan membuatnya tersenyum gembira!</em>
      </p>
    </div>
  );
}
