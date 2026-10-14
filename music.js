/* =====================================================
   MUSIC.JS — Web Audio API ile Prosedürel Müzik
   Tamamen telifsiz: kod üretimi, dış kaynak yok
===================================================== */

const GZMusic = (() => {
  let ctx = null, masterGain = null;
  let running = false;
  let vol = 0.18;
  let seqTimeout = null;
  let uiEl = null;

  /* ── Ses bağlamı başlat ── */
  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol, ctx.currentTime);
    masterGain.connect(ctx.destination);
  }

  /* ── Tek nota çal ── */
  function playNote(freq, start, dur, type = 'sine', gainVal = 0.12) {
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type      = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

    gain.gain.setValueAtTime(0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + start + 0.02);
    gain.gain.linearRampToValueAtTime(gainVal * 0.6, ctx.currentTime + start + dur * 0.6);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur + 0.05);
  }

  /* ── Ambient pad (uzun drone sesler) ── */
  function playPad(freq, start, dur) {
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type  = 'sawtooth'; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.type = 'sine';     osc2.frequency.setValueAtTime(freq * 1.005, ctx.currentTime);

    filter.type            = 'lowpass';
    filter.frequency.value = 600;
    filter.Q.value         = 1.2;

    gain.gain.setValueAtTime(0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + start + 1.5);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + start + dur - 1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);

    osc.connect(filter); osc2.connect(filter);
    filter.connect(gain); gain.connect(masterGain);
    osc.start(ctx.currentTime + start);   osc.stop(ctx.currentTime + start + dur);
    osc2.start(ctx.currentTime + start);  osc2.stop(ctx.currentTime + start + dur);
  }

  /* ── Bas nota ── */
  function playBass(freq, start, dur) {
    playNote(freq, start, dur, 'triangle', 0.08);
  }

  /* ── Ambient perküsyon (hafif tıkırtı) ── */
  function playClick(start, vol = 0.04) {
    if (!ctx) return;
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8);
    }
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    gain.gain.setValueAtTime(vol, ctx.currentTime + start);
    src.connect(gain); gain.connect(masterGain);
    src.start(ctx.currentTime + start);
  }

  /* ── Nota frekansları ── */
  const NOTE = {
    C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
    C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
    C5:523.25, D5:587.33, E5:659.26, G5:784.00,
    Bb3:233.08, Bb4:466.16, F3s:185.00, Ab3:207.65, Ab4:415.30,
  };

  /* ── Looplu ambient sekans (16 bar ≈ 32 saniye) ── */
  const LOOP_DUR = 32;

  /* Sekans 1 — huzurlu, space-ambient */
  const SEQ_1 = [
    /* Pad'lar */
    () => { playPad(NOTE.C3, 0, 8);  playPad(NOTE.G3, 0.5, 8); },
    () => { playPad(NOTE.A3, 8, 8);  playPad(NOTE.E3, 8.5, 8); },
    () => { playPad(NOTE.F3, 16, 8); playPad(NOTE.C3, 16.5, 8); },
    () => { playPad(NOTE.G3, 24, 8); playPad(NOTE.D3, 24.5, 8); },

    /* Melodi */
    () => {
      const mel = [
        [NOTE.E4,0,.4],[NOTE.G4,.5,.4],[NOTE.A4,1,.6],[NOTE.G4,2,.4],
        [NOTE.E4,3,.4],[NOTE.C4,4,.5],[NOTE.D4,5,.4],[NOTE.E4,6,.6],
        [NOTE.G4,8,.4],[NOTE.A4,9,.4],[NOTE.C5,10,.8],[NOTE.B4,11.2,.4],
        [NOTE.A4,12,.4],[NOTE.G4,13,.4],[NOTE.E4,14,.8],
        [NOTE.G4,16,.4],[NOTE.A4,17,.4],[NOTE.C5,18,.6],[NOTE.A4,19,.4],
        [NOTE.G4,20,.4],[NOTE.E4,21,.6],[NOTE.D4,22,.4],[NOTE.C4,23,.8],
        [NOTE.E4,24,.4],[NOTE.G4,25,.4],[NOTE.A4,26,.8],[NOTE.G4,27.2,.4],
        [NOTE.E4,28,.4],[NOTE.C4,29,.4],[NOTE.D4,30,.4],[NOTE.E4,31,.8],
      ];
      mel.forEach(([f,s,d]) => playNote(f, s, d, 'sine', 0.07));
    },

    /* Bas */
    () => {
      [[NOTE.C3,0,1.5],[NOTE.C3,2,1.5],[NOTE.A3,4,1.5],[NOTE.A3,6,1.5],
       [NOTE.F3,8,1.5],[NOTE.F3,10,1.5],[NOTE.G3,12,1.5],[NOTE.G3,14,1.5],
       [NOTE.C3,16,1.5],[NOTE.C3,18,1.5],[NOTE.F3,20,1.5],[NOTE.G3,22,1.5],
       [NOTE.C3,24,1.5],[NOTE.A3,26,1.5],[NOTE.F3,28,1.5],[NOTE.G3,30,1.5],
      ].forEach(([f,s,d]) => playBass(f, s, d));
    },

    /* Tıkırtı */
    () => {
      for (let i = 0; i < 32; i += 2) playClick(i, 0.025);
    },
  ];

  /* Sekans 2 — biraz daha enerjik, oyun hissi */
  const SEQ_2 = [
    () => { playPad(NOTE.A3, 0, 8);  playPad(NOTE.E3, 0.8, 8); },
    () => { playPad(NOTE.F3, 8, 8);  playPad(NOTE.C3, 8.8, 8); },
    () => { playPad(NOTE.G3, 16, 8); playPad(NOTE.D3, 16.8, 8); },
    () => { playPad(NOTE.A3, 24, 8); playPad(NOTE.C3, 24.5, 8); },

    () => {
      const mel2 = [
        [NOTE.A4,0,.35],[NOTE.C5,0.5,.35],[NOTE.E5,1,.7],[NOTE.D5,2,.35],
        [NOTE.C5,3,.35],[NOTE.A4,4,.7],[NOTE.G4,5,.35],[NOTE.A4,6,.7],
        [NOTE.C5,8,.35],[NOTE.E5,9,.35],[NOTE.G5,10,.9],[NOTE.E5,11.2,.35],
        [NOTE.D5,12,.35],[NOTE.C5,13,.35],[NOTE.A4,14,.9],
        [NOTE.G4,16,.35],[NOTE.A4,17,.35],[NOTE.C5,18,.7],[NOTE.A4,19,.35],
        [NOTE.G4,20,.35],[NOTE.E4,21,.7],[NOTE.D4,22,.35],[NOTE.E4,23,.7],
        [NOTE.A4,24,.35],[NOTE.C5,25,.35],[NOTE.E5,26,.9],[NOTE.D5,27.2,.35],
        [NOTE.C5,28,.35],[NOTE.A4,29,.35],[NOTE.G4,30,.35],[NOTE.A4,31,.9],
      ];
      mel2.forEach(([f,s,d]) => playNote(f, s, d, 'triangle', 0.065));
    },

    () => {
      [[NOTE.A3,0,1],[NOTE.A3,1.5,1],[NOTE.F3,4,1],[NOTE.F3,5.5,1],
       [NOTE.G3,8,1],[NOTE.G3,9.5,1],[NOTE.A3,12,1],[NOTE.A3,13.5,1],
       [NOTE.C3,16,1],[NOTE.C3,17.5,1],[NOTE.G3,20,1],[NOTE.A3,22,1],
       [NOTE.A3,24,1],[NOTE.F3,26,1],[NOTE.G3,28,1],[NOTE.A3,30,1],
      ].forEach(([f,s,d]) => playBass(f, s, d));
    },

    () => {
      for (let i = 0; i < 32; i += 1) {
        if (i % 2 === 0) playClick(i, 0.03);
        else             playClick(i, 0.012);
      }
    },
  ];

  const SEQS = [SEQ_1, SEQ_2];
  let seqIdx = 0;

  function playLoop() {
    if (!running || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const seq = SEQS[seqIdx % SEQS.length];
    seq.forEach(fn => fn());
    seqIdx++;
    seqTimeout = setTimeout(playLoop, (LOOP_DUR - 0.1) * 1000);
  }

  /* ── Public API ── */
  return {
    start() {
      init();
      if (running) return;
      running = true;
      if (ctx.state === 'suspended') ctx.resume();
      playLoop();
      this.updateUI();
    },
    stop() {
      running = false;
      clearTimeout(seqTimeout);
      if (masterGain) masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        if (ctx) { ctx.close(); ctx = null; masterGain = null; }
      }, 1200);
      this.updateUI();
    },
    toggle() {
      running ? this.stop() : this.start();
    },
    setVolume(v) {
      vol = Math.max(0, Math.min(1, v));
      if (masterGain) masterGain.gain.setValueAtTime(vol, ctx.currentTime);
    },
    isPlaying() { return running; },
    createUI() {
      if (document.getElementById('gz-music-btn')) return;
      const wrap = document.createElement('div');
      wrap.id = 'gz-music-wrap';
      wrap.innerHTML = `
        <button id="gz-music-btn" onclick="GZMusic.toggle()" title="Müzik aç/kapat">
          <span id="gz-music-icon">🎵</span>
        </button>
        <input id="gz-music-vol" type="range" min="0" max="100" value="18"
               oninput="GZMusic.setVolume(this.value/100)"
               title="Ses seviyesi"/>
      `;
      document.body.appendChild(wrap);
      uiEl = wrap;

      /* Kullanıcı etkileşiminde otomatik başlat */
      const autoStart = () => {
        if (!running && localStorage.getItem('gz_music') !== 'off') {
          GZMusic.start();
        }
        document.removeEventListener('click', autoStart);
        document.removeEventListener('touchstart', autoStart);
      };
      document.addEventListener('click', autoStart, { once: true });
      document.addEventListener('touchstart', autoStart, { once: true });

      /* Daha önce kapatıldıysa ikonu güncelle */
      if (localStorage.getItem('gz_music') === 'off') {
        document.getElementById('gz-music-icon').textContent = '🔇';
      }
    },
    updateUI() {
      const icon = document.getElementById('gz-music-icon');
      if (!icon) return;
      icon.textContent = running ? '🎵' : '🔇';
      localStorage.setItem('gz_music', running ? 'on' : 'off');
    }
  };
})();

/* Sayfa yüklenince UI oluştur */
document.addEventListener('DOMContentLoaded', () => GZMusic.createUI());
