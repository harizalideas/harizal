'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { birthdaySynth } from './AudioSynth';

export default function CoucouMochi({
  recipientName = 'Harizal',
  isIslandExpanded = false,
  onToggleExpand,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // States
  const [mood, setMood] = useState('waving'); // 'happy', 'waving', 'excited', 'dizzy', 'blown'
  const [pokeCount, setPokeCount] = useState(0);
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [hatStyle, setHatStyle] = useState(0); // 0: Party cone, 1: Golden Crown, 2: Birthday Star
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [speechBubble, setSpeechBubble] = useState('Hai! Selamat Ulang Tahun! 🎉');

  // Interactive animation refs
  const stateRef = useRef({
    // Coordinates
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    lookX: 0,
    lookY: 0,
    targetLookX: 0,
    targetLookY: 0,
    // Physics
    scaleX: 1,
    scaleY: 1,
    vx: 0,
    vy: 0,
    tilt: 0,
    targetTilt: 0,
    // Eyes & Face
    open: 1,
    blinkTimer: 0,
    isBlinking: false,
    dizzyAngle: 0,
    // Waving
    wavePhase: 0,
    isWaving: true,
    blushAlpha: 0.6,
    // Candle flame
    flameFlicker: 0,
    smokeParticles: [],
    // Pokes
    rapidPokes: 0,
    lastPokeTime: 0,
    // Hat
    hatWobble: 0,
  });

  // Confetti trigger
  const triggerConfetti = useCallback((originX = 0.5, originY = 0.6) => {
    if (typeof window === 'undefined') return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#FF5A5F', '#FFD166', '#06D6A0', '#118AB2', '#7928CA', '#FF4081'],
    });
  }, []);

  // Super-confetti explosion when candle is blown
  const triggerBirthdayExplosion = useCallback(() => {
    if (typeof window === 'undefined') return;
    const duration = 3000;
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

  // Poke interaction handler
  const handleMochiPoke = useCallback((e) => {
    e?.stopPropagation?.();
    const now = Date.now();
    const st = stateRef.current;

    // Squash & Stretch
    st.scaleX = 1.35;
    st.scaleY = 0.68;
    st.hatWobble = (Math.random() - 0.5) * 0.4;

    // Check rapid pokes
    if (now - st.lastPokeTime < 500) {
      st.rapidPokes += 1;
    } else {
      st.rapidPokes = 1;
    }
    st.lastPokeTime = now;
    setPokeCount((c) => c + 1);

    if (st.rapidPokes >= 6) {
      // Dizzy reaction!
      setMood('dizzy');
      setSpeechBubble('Wah pusing! Hehe aduh! 💫');
      if (soundEnabled) birthdaySynth.playPop(300);
      setTimeout(() => {
        setMood('happy');
        setSpeechBubble(`Selamat Ulang Tahun, ${recipientName}! ❤️`);
        st.rapidPokes = 0;
      }, 2500);
    } else {
      setMood('excited');
      const phrases = [
        `Hehehe geli! 😄`,
        `Selamat Ulang Tahun ya! 🎂`,
        `Semoga makin sukses! ✨`,
        `Panjang umur & bahagia! 💖`,
        `Mochi sayang kamu! 🐾`,
      ];
      setSpeechBubble(phrases[Math.floor(Math.random() * phrases.length)]);
      if (soundEnabled) birthdaySynth.playPop(480 + Math.random() * 120);

      // Trigger micro confetti occasionally on poke
      if (st.rapidPokes % 2 === 0) {
        triggerConfetti(0.5, 0.45);
      }

      setTimeout(() => {
        setMood('waving');
      }, 1500);
    }
  }, [recipientName, soundEnabled, triggerConfetti]);

  // Blow candle handler
  const handleBlowCandle = useCallback(() => {
    if (isCandleBlown) {
      // Relight candle
      setIsCandleBlown(false);
      setSpeechBubble('Lilin dinyalakan lagi! Bikin harapan lagi ya! 🕯️✨');
      if (soundEnabled) birthdaySynth.playPop(600);
      return;
    }

    setIsCandleBlown(true);
    setSpeechBubble('Horeee! Tiup lilin berhasil! Semoga semua doa terkabul! 🎉🎂');
    if (soundEnabled) birthdaySynth.playBlow();

    // Generate smoke puffs
    const st = stateRef.current;
    for (let i = 0; i < 18; i++) {
      st.smokeParticles.push({
        x: 0,
        y: 12,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.2 - Math.random() * 1.8,
        radius: 3 + Math.random() * 4,
        alpha: 0.8,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    }

    triggerBirthdayExplosion();
  }, [isCandleBlown, soundEnabled, triggerBirthdayExplosion]);

  // Toggle birthday melody
  const handleToggleMusic = useCallback(() => {
    if (isPlayingMusic) {
      birthdaySynth.stopBirthdayTune();
      setIsPlayingMusic(false);
      setSpeechBubble('Musik dijeda 🎵');
    } else {
      setIsPlayingMusic(true);
      setSpeechBubble('🎶 Happy Birthday to You~! 🎶');
      birthdaySynth.playBirthdayTune(
        () => {
          // Pulse Mochi to beat
          stateRef.current.scaleX = 1.08;
          stateRef.current.scaleY = 0.94;
          stateRef.current.tilt = (Math.random() - 0.5) * 0.15;
        },
        () => {
          setIsPlayingMusic(false);
          setSpeechBubble(`Horeee! Selamat Ulang Tahun, ${recipientName}! 🥳`);
          triggerBirthdayExplosion();
        }
      );
    }
  }, [isPlayingMusic, recipientName, triggerBirthdayExplosion]);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Handle high DPI display
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
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

      if (clientX !== undefined && clientY !== undefined) {
        const mx = clientX - (rect.left + rect.width / 2);
        const my = clientY - (rect.top + rect.height / 2);

        // Normalize look target between -1 and 1
        const maxDist = 200;
        stateRef.current.targetLookX = Math.max(-1, Math.min(1, mx / maxDist));
        stateRef.current.targetLookY = Math.max(-1, Math.min(1, my / maxDist));
        stateRef.current.targetTilt = stateRef.current.targetLookX * 0.08;
      }
    };

    const handlePointerLeave = () => {
      stateRef.current.targetLookX = 0;
      stateRef.current.targetLookY = 0;
      stateRef.current.targetTilt = 0;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Helper: Coucou Squircle Path (Lamé Curve n = 3.2)
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

    // Helper: Rounded Rectangle
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
      const cy = H / 2 + (isIslandExpanded ? 8 : 0);

      const st = stateRef.current;

      // Spring physics for squash & stretch
      st.scaleX += (1 - st.scaleX) * 0.14;
      st.scaleY += (1 - st.scaleY) * 0.14;
      st.tilt += (st.targetTilt - st.tilt) * 0.1;
      st.hatWobble *= 0.92;

      // Smooth eye damping
      st.lookX += (st.targetLookX - st.lookX) * 0.12;
      st.lookY += (st.targetLookY - st.lookY) * 0.12;

      // Natural blinking
      st.blinkTimer += dt;
      if (!st.isBlinking && st.blinkTimer > 2.8 + Math.random() * 2) {
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

      // Waving hand & floating idle
      st.wavePhase += dt * 5.5;
      const idleFloatY = Math.sin(time * 0.0022) * 4;

      // Dizzy rotation if applicable
      if (mood === 'dizzy') {
        st.dizzyAngle += dt * 6;
      }

      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // --- DRAW AMBIENT HALO (Coucou Golden Warm Glow) ---
      const haloGradient = ctx.createRadialGradient(cx, cy + idleFloatY, 30, cx, cy + idleFloatY, 150);
      haloGradient.addColorStop(0, 'rgba(255, 214, 153, 0.28)');
      haloGradient.addColorStop(0.6, 'rgba(255, 180, 100, 0.08)');
      haloGradient.addColorStop(1, 'rgba(255, 180, 100, 0)');
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(cx, cy + idleFloatY, 150, 0, Math.PI * 2);
      ctx.fill();

      // --- SAVE TRANSFORMS FOR MOCHI BODY ---
      ctx.save();
      ctx.translate(cx, cy + idleFloatY);
      ctx.rotate(st.tilt + Math.sin(st.wavePhase * 0.5) * 0.02);
      ctx.scale(st.scaleX, st.scaleY);

      const hb = 82; // body height
      const hw = (hb / 2) * 1.34; // squircle width aspect ratio 1.34
      const hh = hb / 2;

      // --- 1. LEFT HAND (Holds Sparkler/Balloon string or rest) ---
      const handRadius = hb * 0.15;
      const leftHandX = -hw - hb * 0.18;
      const leftHandY = hh * 0.45 + Math.sin(st.wavePhase * 0.6) * 2;

      ctx.save();
      ctx.translate(leftHandX, leftHandY);
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

      // Mini festive sparkler in left hand
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-12, -26);
      ctx.stroke();
      // Sparkler tip star
      const sparkTime = time * 0.01;
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(-12, -26, 2.5 + Math.sin(sparkTime) * 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- 2. RIGHT HAND (Coucou Waving Animation) ---
      const rHandLen = hb * 0.42;
      const rHandThickness = hb * 0.22;
      const rHandX = hw + hb * 0.18;
      const rHandY = hh * 0.15;
      const waveAngle = -0.65 + Math.sin(st.wavePhase * 1.4) * 0.35; // waves smoothly!

      ctx.save();
      ctx.translate(rHandX, rHandY + Math.sin(st.wavePhase * 1.4 + 0.8) * 3);
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

      // --- 3. MOCHI BODY (Soft Cream Squircle) ---
      const bodySquircle = createSquirclePath(hw, hh);

      // Subtle drop shadow under squircle
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.18)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.fill(bodySquircle);
      ctx.restore();

      // Body Gradient: Pristine soft porcelain/milk texture
      const bodyGrad = ctx.createLinearGradient(hw * 0.4, -hh, -hw * 0.4, hh);
      bodyGrad.addColorStop(0, '#FCFDFE');
      bodyGrad.addColorStop(0.7, '#EFF1F5');
      bodyGrad.addColorStop(1, '#E2E6EE');
      ctx.fillStyle = bodyGrad;
      ctx.fill(bodySquircle);

      // Inner Ambient Shading
      ctx.save();
      ctx.clip(bodySquircle);
      const innerShade = ctx.createLinearGradient(0, hh, 0, hh - 18);
      innerShade.addColorStop(0, 'rgba(200, 208, 224, 0.3)');
      innerShade.addColorStop(1, 'rgba(200, 208, 224, 0)');
      ctx.fillStyle = innerShade;
      ctx.fill(bodySquircle);

      // --- 4. ROSY CHEEKS (Blushing) ---
      const blushY = hh * 0.22;
      const blushSpacing = hw * 0.62;
      const blushRadius = 9;
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

      // --- 5. EYES (Coucou Characteristic Tracking Eyes) ---
      const eyeRadius = hb * 0.082;
      const eyeSpacing = hb * 0.26;
      const eyeLookX = st.lookX * hw * 0.35;
      const eyeLookY = st.lookY * hh * 0.26 + hh * 0.08;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(dir * eyeSpacing + eyeLookX, eyeLookY);

        if (mood === 'dizzy') {
          // Dizzy swirl
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
          // Happy arch eyes (^ ^)
          ctx.strokeStyle = '#18191D';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(0, eyeRadius * 0.4, eyeRadius * 1.1, Math.PI * 1.15, Math.PI * 1.85);
          ctx.stroke();
        } else {
          // Default Coucou deep glossy eyes with natural blink
          ctx.scale(1, Math.max(0.12, st.open));
          ctx.fillStyle = '#141518';
          ctx.beginPath();
          ctx.arc(0, 0, eyeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Cute glossy shine / specular highlight
          if (st.open > 0.4) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-eyeRadius * 0.32, -eyeRadius * 0.32, eyeRadius * 0.32, 0, Math.PI * 2);
            ctx.fill();

            // Tiny secondary sparkle
            ctx.beginPath();
            ctx.arc(eyeRadius * 0.25, eyeRadius * 0.25, eyeRadius * 0.15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      });

      // --- 6. CUTE MOUTH ---
      ctx.save();
      ctx.translate(eyeLookX * 0.3, hh * 0.35 + eyeLookY * 0.2);
      ctx.strokeStyle = '#18191D';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (mood === 'excited' || mood === 'waving') {
        // Joyful open smile
        ctx.arc(0, -2, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();
        // Tiny cute tongue
        ctx.fillStyle = '#FF6B8B';
        ctx.beginPath();
        ctx.arc(0, 3, 3.2, 0, Math.PI);
        ctx.fill();
      } else {
        // Gentle relaxed smile
        ctx.arc(0, -3, 4.5, 0.3, Math.PI - 0.3);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore(); // end squircle clipping for eyes/face

      // --- 7. BIRTHDAY PARTY ACCESSORIES ON MOCHI HEAD ---
      ctx.save();
      ctx.translate(0, -hh + 3);
      ctx.rotate(st.hatWobble);

      if (hatStyle === 0) {
        // Festive Striped Birthday Cone Hat
        const hatH = 46;
        const hatBaseW = 34;

        // Hat triangle
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

        // Hat decorative diagonal stripes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(4, -26);
        ctx.moveTo(-4, -4);
        ctx.lineTo(10, -18);
        ctx.stroke();

        // Golden fluffy pom-pom at tip
        const pomTime = time * 0.006;
        const pomY = -hatH - 2 + Math.sin(pomTime) * 1.5;
        ctx.fillStyle = '#FFE066';
        ctx.beginPath();
        ctx.arc(0, pomY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-1.5, pomY - 1.5, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (hatStyle === 1) {
        // Golden King's Birthday Crown
        const crownW = 42;
        const crownH = 24;
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

        // Jewels on Crown peaks
        [-crownW / 2, 0, crownW / 2].forEach((x, i) => {
          const gemCols = ['#EF4444', '#3B82F6', '#10B981'];
          ctx.fillStyle = gemCols[i];
          ctx.beginPath();
          ctx.arc(x, i === 1 ? -crownH : -crownH * 0.8, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Giant Party Bow & Sparkle Star
        ctx.fillStyle = '#EC4899';
        // Left loop
        ctx.beginPath();
        ctx.ellipse(-14, -8, 12, 7, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Right loop
        ctx.beginPath();
        ctx.ellipse(14, -8, 12, 7, 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Center knot
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(0, -8, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.restore(); // end Mochi translation

      // --- 8. MINI BIRTHDAY CAKE & FLICKERING CANDLE (Bottom Foreground) ---
      const cakeX = cx;
      const cakeY = cy + hh + 28;

      // Cake Plate
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.ellipse(cakeX, cakeY + 16, 44, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cake Base (Chocolate Strawberry layers)
      const cakeGrad = ctx.createLinearGradient(cakeX - 32, cakeY, cakeX + 32, cakeY);
      cakeGrad.addColorStop(0, '#F472B6');
      cakeGrad.addColorStop(0.5, '#FB7185');
      cakeGrad.addColorStop(1, '#E11D48');
      ctx.fillStyle = cakeGrad;
      roundedRect(cakeX - 30, cakeY - 6, 60, 20, 6);
      ctx.fill();

      // Cream Frosting Drippings
      ctx.fillStyle = '#FFF1F2';
      roundedRect(cakeX - 32, cakeY - 8, 64, 9, 5);
      ctx.fill();

      // Candle
      const candleW = 6;
      const candleH = 20;
      const candleY = cakeY - 8 - candleH;
      ctx.fillStyle = '#38BDF8';
      roundedRect(cakeX - candleW / 2, candleY, candleW, candleH, 2);
      ctx.fill();
      // Candle spiral
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cakeX - candleW / 2, candleY + 4);
      ctx.lineTo(cakeX + candleW / 2, candleY + 10);
      ctx.stroke();

      // Wick
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cakeX, candleY);
      ctx.lineTo(cakeX, candleY - 4);
      ctx.stroke();

      // Flickering Flame or Smoke
      if (!isCandleBlown) {
        const flameNoise = Math.sin(time * 0.015) * 1.5;
        const flameY = candleY - 12;

        // Flame warm aura
        const flameGlow = ctx.createRadialGradient(cakeX, flameY, 2, cakeX, flameY, 24);
        flameGlow.addColorStop(0, 'rgba(255, 200, 50, 0.6)');
        flameGlow.addColorStop(1, 'rgba(255, 120, 0, 0)');
        ctx.fillStyle = flameGlow;
        ctx.beginPath();
        ctx.arc(cakeX, flameY, 24, 0, Math.PI * 2);
        ctx.fill();

        // Inner Flame
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.moveTo(cakeX - 4, flameY + 6);
        ctx.quadraticCurveTo(cakeX - 5 + flameNoise, flameY - 2, cakeX + flameNoise * 0.5, flameY - 9);
        ctx.quadraticCurveTo(cakeX + 5 + flameNoise, flameY - 2, cakeX + 4, flameY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(cakeX - 2.5, flameY + 5);
        ctx.quadraticCurveTo(cakeX - 3, flameY, cakeX, flameY - 6);
        ctx.quadraticCurveTo(cakeX + 3, flameY, cakeX + 2.5, flameY + 5);
        ctx.closePath();
        ctx.fill();
      } else {
        // Smoke Particles simulation
        for (let i = st.smokeParticles.length - 1; i >= 0; i--) {
          const p = st.smokeParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.radius += 0.08;
          p.alpha -= 0.015;
          p.life++;

          ctx.fillStyle = `rgba(180, 190, 205, ${Math.max(0, p.alpha)})`;
          ctx.beginPath();
          ctx.arc(cakeX + p.x, candleY - 4 + p.y, p.radius, 0, Math.PI * 2);
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
  }, [isIslandExpanded, mood, hatStyle, isCandleBlown]);

  return (
    <div ref={containerRef} className="mochi-canvas-wrapper">
      {/* Dynamic Speech Bubble */}
      <div
        className="mochi-speech-bubble"
        onClick={() => {
          if (soundEnabled) birthdaySynth.playGiggle();
          setMood('excited');
          triggerConfetti(0.5, 0.4);
        }}
        title="Klik untuk mendengar suara Mochi!"
      >
        <span className="bubble-text">{speechBubble}</span>
        <div className="bubble-tail" />
      </div>

      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="mochi-canvas"
        onClick={handleMochiPoke}
        title="Sentuh / klik Mochi untuk berinteraksi!"
      />

      {/* Quick Interactive Actions */}
      <div className="mochi-controls">
        <button
          type="button"
          className="btn-interactive"
          onClick={handleBlowCandle}
          title={isCandleBlown ? 'Nyalakan lagi lilinnya' : 'Tiup lilin ulang tahun!'}
        >
          {isCandleBlown ? '🕯️ Nyalakan Lilin' : '🎂 Tiup Lilin!'}
        </button>

        <button
          type="button"
          className="btn-interactive"
          onClick={handleToggleMusic}
          title="Putar / Jeda Lagu Selamat Ulang Tahun"
        >
          {isPlayingMusic ? '⏸️ Jeda Lagu' : '🎵 Lagu Ultah'}
        </button>

        <button
          type="button"
          className="btn-interactive"
          onClick={() => {
            setHatStyle((prev) => (prev + 1) % 3);
            if (soundEnabled) birthdaySynth.playPop(550);
          }}
          title="Ganti Topi Pesta Mochi"
        >
          👑 Ganti Topi
        </button>

        <button
          type="button"
          className="btn-interactive"
          onClick={() => {
            triggerBirthdayExplosion();
            if (soundEnabled) birthdaySynth.playChimeSuccess();
          }}
          title="Hamburkan Konfeti!"
        >
          🎉 Konfeti
        </button>
      </div>

      <p className="hint-text">
        ✨ <em>Tip: Sentuh atau klik Mochi untuk mencoleknya! Cobalah colek berkali-kali untuk melihat reaksi lucunya.</em>
      </p>
    </div>
  );
}
