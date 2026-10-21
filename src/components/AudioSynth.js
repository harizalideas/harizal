// Web Audio API Synthesizer for interactive sounds without external assets
class BirthdaySynth {
  constructor() {
    this.ctx = null;
    this.isPlayingSong = false;
    this.songTimeout = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Cute squishy pop / boing sound when tapping Mochi
  playPop(freq = 440) {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Cute giggle / happy high chime
  playGiggle() {
    try {
      this.init();
      if (!this.ctx) return;
      const pitches = [587.33, 659.25, 783.99, 880]; // D5, E5, G5, A5
      const now = this.ctx.currentTime;
      pitches.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const start = now + i * 0.05;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.14);
      });
    } catch {}
  }

  // Candle blow puff & extinguish sparkle
  playBlow() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Noise buffer for gentle whoosh
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.38);

      // Chime sparkle
      setTimeout(() => this.playChimeSuccess(), 250);
    } catch {}
  }

  // Success sparkle
  playChimeSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.08;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch {}
  }

  // Play "Happy Birthday To You" marimba melody
  playBirthdayTune(onNote, onComplete) {
    this.init();
    if (!this.ctx) return;
    this.stopBirthdayTune();

    // Notes: [freq, durationInBeats]
    // Happy Birthday in C Major:
    // C4, C4, D4, C4, F4, E4
    // C4, C4, D4, C4, G4, F4
    // C4, C4, C5, A4, F4, E4, D4
    // Bb4, Bb4, A4, F4, G4, F4
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23,
          G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

    const melody = [
      { f: C4, d: 0.75 }, { f: C4, d: 0.25 }, { f: D4, d: 1 }, { f: C4, d: 1 }, { f: F4, d: 1 }, { f: E4, d: 2 },
      { f: C4, d: 0.75 }, { f: C4, d: 0.25 }, { f: D4, d: 1 }, { f: C4, d: 1 }, { f: G4, d: 1 }, { f: F4, d: 2 },
      { f: C4, d: 0.75 }, { f: C4, d: 0.25 }, { f: C5, d: 1 }, { f: A4, d: 1 }, { f: F4, d: 1 }, { f: E4, d: 1 }, { f: D4, d: 2 },
      { f: Bb4, d: 0.75 }, { f: Bb4, d: 0.25 }, { f: A4, d: 1 }, { f: F4, d: 1 }, { f: G4, d: 1 }, { f: F4, d: 2.5 }
    ];

    this.isPlayingSong = true;
    let accumulatedTime = 0;
    const beatDuration = 0.38; // seconds per beat

    melody.forEach((note, index) => {
      const startTime = accumulatedTime;
      const noteLength = note.d * beatDuration;
      accumulatedTime += noteLength;

      const timerId = setTimeout(() => {
        if (!this.isPlayingSong || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm marimba/bell timbre
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now);

        // Harmonic overtone
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(note.f * 2, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + noteLength * 0.95);

        gain2.gain.setValueAtTime(0.1, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + noteLength * 0.6);

        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(this.ctx.destination);
        gain2.connect(this.ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + noteLength);
        osc2.stop(now + noteLength);

        if (onNote) onNote(index, melody.length);
      }, startTime * 1000);

      this.songTimeout = timerId;
    });

    setTimeout(() => {
      this.isPlayingSong = false;
      if (onComplete) onComplete();
    }, accumulatedTime * 1000);
  }

  stopBirthdayTune() {
    this.isPlayingSong = false;
    if (this.songTimeout) {
      clearTimeout(this.songTimeout);
      this.songTimeout = null;
    }
  }
}

export const birthdaySynth = new BirthdaySynth();
