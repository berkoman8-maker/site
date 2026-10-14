/* =====================================================
   FOOTBALL.JS — GlitchGrid Futbol
   - F tuşu: topa yakınken top çal
   - Düzeltilmiş oyuncu hızı
   - Gelişmiş Bot AI (gerçekten oynayan)
===================================================== */
if (!GZ.requireAuth()) throw '';
const ME = GZ.currentUser();
GZ.renderNavbar('football');

const IS_MOBILE = () => localStorage.getItem('gz_device') === 'mobile' || window.innerWidth <= 768;

/* ══════════════════════════════════════════════════
   AYARLAR & MOD
══════════════════════════════════════════════════ */
let CFG = { time:60, goals:0, field:'green', diff:'medium', mode:'1v1' };
let selectedMode = '1v1';

document.querySelectorAll('#opt-time   .opt-btn').forEach(b=>b.addEventListener('click',()=>{setOpt('opt-time',b);   CFG.time  =+b.dataset.val;}));
document.querySelectorAll('#opt-goals  .opt-btn').forEach(b=>b.addEventListener('click',()=>{setOpt('opt-goals',b);  CFG.goals =+b.dataset.val;}));
document.querySelectorAll('#opt-diff   .opt-btn').forEach(b=>b.addEventListener('click',()=>{setOpt('opt-diff',b);   CFG.diff  = b.dataset.val;}));
document.querySelectorAll('#opt-field  .opt-btn').forEach(b=>b.addEventListener('click',()=>{setOpt('opt-field',b);  CFG.field = b.dataset.val;}));

function setOpt(g,b){ document.querySelectorAll(`#${g} .opt-btn`).forEach(x=>x.classList.remove('active')); b.classList.add('active'); }

function selectMode(mode, el) {
  selectedMode = mode; CFG.mode = mode;
  document.querySelectorAll('.mode-card').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  updateControlsBoard(mode);
}
function updateControlsBoard(mode) {
  const b = document.querySelector('.ctrl-player.ctrl-blue .ctrl-name');
  const r = document.querySelector('.ctrl-player.ctrl-red  .ctrl-name');
  const m = MODES[mode] || MODES['1v1'];
  if (b) b.textContent = `Sen${m.blue>1?` +${m.blue-1} Bot`:''}`;
  if (r) r.textContent = `${m.red} Bot`;
}

const MODES = {
  '1v1':   { blue:1, red:1,  playerCount:2  },
  '1vBOT': { blue:1, red:1,  playerCount:2  },
  '3v3':   { blue:3, red:3,  playerCount:6  },
  '5v5':   { blue:5, red:5,  playerCount:10 },
  '6v6':   { blue:6, red:6,  playerCount:12 },
};

/* ══════════════════════════════════════════════════
   LOBİ
══════════════════════════════════════════════════ */
let activeLobbyId  = null;
let lobbyPollTimer = null;

function refreshLobbies() {
  const c = document.getElementById('lobby-list');
  if (!c) return;
  const list = Object.values(GZ.getLobbies());
  c.innerHTML = '';
  if (!list.length) { c.innerHTML='<p class="no-lobbies-msg">Henüz lobi yok.</p>'; return; }
  list.forEach(lobby => {
    const full = lobby.players.length >= (MODES[lobby.settings?.mode||'1v1']?.playerCount||2);
    const row  = document.createElement('div');
    row.className = 'lobby-row';
    row.innerHTML = `
      <div class="lobby-row-info">
        <div class="lobby-row-name">
          ${lobby.password?'<i class="fa-solid fa-lock lobby-lock-icon"></i>':''}
          ${escHtml(lobby.name)}
          <span class="mode-pill">${lobby.settings?.mode||'1v1'}</span>
        </div>
        <div class="lobby-row-sub">Host: ${escHtml(lobby.host)} &bull; ${(lobby.settings?.time||60)/60}dk</div>
      </div>
      <div class="lobby-row-actions">
        <span class="player-count-badge">${lobby.players.length}/${MODES[lobby.settings?.mode||'1v1']?.playerCount||2}</span>
        ${full ? '<span class="lobby-full-badge">DOLU</span>'
               : `<button class="btn btn-primary btn-sm" onclick="quickJoin('${lobby.id}',${!!lobby.password})">Katıl</button>`}
      </div>`;
    c.appendChild(row);
  });
}

function createLobby() {
  const name = document.getElementById('create-name').value.trim();
  if (!name) { gz_toast('Lobi adı girin!','error'); return; }
  const id = GZ.createLobby({
    name,
    password: document.getElementById('create-pass').value,
    host: ME.username,
    settings: { time:CFG.time, goals:CFG.goals, fieldColor:CFG.field, diff:CFG.diff, mode:selectedMode }
  });
  activeLobbyId = id;
  showWaitingRoom(id);
}

function quickJoin(id, locked) {
  if (locked) {
    const pass = prompt('Şifre:');
    if (pass === null) return;
    if (GZ.getLobby(id)?.password !== pass) { gz_toast('Şifre yanlış!','error'); return; }
  }
  const res = GZ.joinLobby(id, ME.username);
  if (!res.ok) { gz_toast(res.msg,'error'); return; }
  activeLobbyId = id;
  showWaitingRoom(id);
}

function joinLobbyById() {
  const id = document.getElementById('join-id').value.trim();
  if (!id) { gz_toast('Lobi ID girin!','error'); return; }
  const res = GZ.joinLobby(id, ME.username);
  if (!res.ok) { gz_toast(res.msg,'error'); return; }
  activeLobbyId = id;
  showWaitingRoom(id);
}

function showWaitingRoom(id) {
  showScreen('screen-waiting');
  renderWaitingRoom(id);
  startLobbyPoll(id);
}

function renderWaitingRoom(id) {
  const lobby = GZ.getLobby(id);
  if (!lobby) { backToMenu(); return; }
  const mode   = lobby.settings?.mode||'1v1';
  const needed = MODES[mode]?.playerCount||2;
  document.getElementById('wait-lobby-name').textContent = lobby.name;
  document.getElementById('wait-lobby-id').textContent   = 'ID: '+id;
  document.getElementById('wait-share-id').textContent   = id;
  document.getElementById('wait-mode').textContent       = mode;
  document.getElementById('wait-time').textContent       = (lobby.settings?.time||60)/60+' dk';
  document.getElementById('wait-goals').textContent      = lobby.settings?.goals>0?lobby.settings.goals+' Gol':'Sınırsız';
  document.getElementById('wait-diff').textContent       = lobby.settings?.diff||'medium';
  const pList = document.getElementById('waiting-players-list');
  if (pList) {
    pList.innerHTML = '';
    for (let i=0; i<Math.min(needed,4); i++) {
      const p = lobby.players[i];
      const d = document.createElement('div');
      d.className = 'wait-player-slot';
      d.innerHTML = `
        <div class="wait-avatar ${p?'filled':''}" style="${p?`background:linear-gradient(135deg,${i===0?'#1d4ed8,#3b82f6':'#b91c1c,#ef4444'})`:''}">
          ${p?p.slice(0,2).toUpperCase():'?'}
        </div>
        <div class="wait-name">${p||'Bekleniyor...'}</div>
        ${lobby.host===p?'<div class="wait-badge host-badge">HOST</div>':''}`;
      pList.appendChild(d);
    }
    if (needed>4) {
      const extra=document.createElement('div');
      extra.style.cssText='text-align:center;color:var(--muted2);font-size:.8rem;padding:.5rem';
      extra.textContent=`+${needed-4} slot (botlar dolduracak)`;
      pList.appendChild(extra);
    }
  }
  const canStart = lobby.players.length>=1 && lobby.host===ME.username;
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.disabled = !canStart;
    document.getElementById('start-hint').textContent = canStart?''  :'(Host başlatabilir)';
  }
}

function startLobbyPoll(id) {
  clearInterval(lobbyPollTimer);
  lobbyPollTimer = setInterval(() => {
    const lobby = GZ.getLobby(id);
    if (!lobby) { clearInterval(lobbyPollTimer); backToMenu(); return; }
    renderWaitingRoom(id);
    if (lobby.status==='playing' && lobby.host!==ME.username) {
      clearInterval(lobbyPollTimer);
      launchGame(lobby.settings?.mode||'1v1', lobby.settings, true);
    }
  }, 1500);
}

function leaveLobby() {
  clearInterval(lobbyPollTimer);
  if (activeLobbyId) GZ.leaveLobby(activeLobbyId, ME.username);
  activeLobbyId = null;
  showScreen('screen-lobby'); refreshLobbies();
}

function copyLobbyId() {
  const id = document.getElementById('wait-share-id').textContent;
  navigator.clipboard?.writeText(id).then(()=>gz_toast('Kopyalandı!','success')).catch(()=>gz_toast('ID: '+id,'info'));
}

function startGameFromLobby() {
  const lobby = GZ.getLobby(activeLobbyId);
  if (!lobby) return;
  const lobbies = GZ.getLobbies();
  lobbies[activeLobbyId].status = 'playing';
  GZ.saveLobbies(lobbies);
  clearInterval(lobbyPollTimer);
  launchGame(lobby.settings?.mode||'1v1', lobby.settings, false);
}

function startSoloGame() {
  launchGame(selectedMode, { time:CFG.time, goals:CFG.goals, fieldColor:CFG.field, diff:CFG.diff, mode:selectedMode }, false);
}

/* ══════════════════════════════════════════════════
   CANVAS & FİZİK SABİTLERİ
══════════════════════════════════════════════════ */
const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
let W = 0, H = 0;

/* ── Düzeltilmiş sabitler ── */
const B_R       = 13;
const GOAL_D    = 32;
const GH_RATIO  = 0.32;
const B_FRIC    = 0.985;
const B_BOUNCE  = 0.60;
/* Oyuncu hızı — eskiden çok yüksekti, şimdi Haxball hissine yakın */
const P_MAX_SPD = 4.2;   // max hız
const P_ACCEL   = 0.45;  // ivme (her frame eklenir)
const P_FRIC    = 0.84;  // sürtünme (1'e yakın = kaygan, 0'a yakın = hemen durur)
/* Şut */
const SHOOT_MAX  = 17;
const POWER_RATE = 2.5;
const POWER_DRAIN= 1.8;

/* ── Oyun state ── */
let players = [], ball = null;
let blueScore=0, redScore=0, blueGoals=0, redGoals=0;
let timeLeft=60, paused=false, running=false;
let goalCD=0, goalAnim=0, lastGoalTeam='red';
let timerInt=null, rafId=null;
let currentSettings=null, currentMode='1v1';
let p1Power=0, p2Power=0, p1Charging=false, p2Charging=false;

/* ── Klavye ── */
const K = {};
window.addEventListener('keydown', e => {
  K[e.key] = true;
  if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.key)) e.preventDefault();
});
window.addEventListener('keyup', e => { K[e.key] = false; });

const FIELD_PALETTES = {
  green:  ['#1a3d1a','#1e4820'],
  blue:   ['#0a1f3a','#0c2a4a'],
  purple: ['#150b30','#1e1040'],
  dark:   ['#0a0a0a','#111'],
};

/* ══════════════════════════════════════════════════
   BOT AI — Tamamen Yeniden Yazıldı
   Roller: kaleci, defans, orta, forvet
══════════════════════════════════════════════════ */
const BOT_PROFILES = {
  easy:    { speed:2.6,  sight:160, shootRange:85,  passDist:120, dribble:0.3, shootAcc:0.45, tackleRange:28 },
  medium:  { speed:3.6,  sight:260, shootRange:140, passDist:180, dribble:0.6, shootAcc:0.70, tackleRange:32 },
  hard:    { speed:4.8,  sight:400, shootRange:200, passDist:250, dribble:0.8, shootAcc:0.88, tackleRange:36 },
  godlike: { speed:5.8,  sight:999, shootRange:280, passDist:400, dribble:0.95,shootAcc:0.97, tackleRange:40 },
};

/* Bot rolü — takımdaki sıraya göre */
function getBotRole(teamIdx, teamSize) {
  if (teamSize === 1) return 'attacker';
  if (teamSize === 2) return teamIdx === 0 ? 'defender' : 'attacker';
  if (teamSize === 3) return ['defender','midfielder','attacker'][teamIdx] || 'midfielder';
  if (teamSize >= 4)  return ['keeper','defender','midfielder','attacker'][Math.min(teamIdx,3)];
  return 'midfielder';
}

/* Her role göre baz pozisyon oranı [x, y] — mavi takım için, kırmızı ayna */
const ROLE_POSITIONS = {
  keeper:     [0.08, 0.5],
  defender:   [0.22, 0.5],
  midfielder: [0.42, 0.5],
  attacker:   [0.65, 0.5],
};

function updateBot(p) {
  if (!ball || goalCD > 0) return;

  const prof = p._profile || BOT_PROFILES.medium;
  const role = p._role || 'midfielder';
  const isBlue = p.team === 'blue';
  const atkGoalX  = isBlue ? W + GOAL_D/2 : -GOAL_D/2;
  const defGoalX  = isBlue ? -GOAL_D/2    : W + GOAL_D/2;
  const gH   = H * GH_RATIO;
  const gY1  = (H - gH) / 2;
  const gY2  = (H + gH) / 2;
  const goalCenterY = H / 2;

  const ballDist = Math.hypot(ball.x - p.x, ball.y - p.y);
  const iHaveBall = ball.owner === p;

  /* Takım arkadaşları */
  const teammates = players.filter(t => t.team === p.team && t !== p);
  const enemies   = players.filter(t => t.team !== p.team);

  /* Topun kim üzerinde olduğunu bul */
  const ballOwnerTeam = ball.owner?.team || null;

  let tx = p._homeX;
  let ty = p._homeY;

  /* ─── TOPUM VARSA: sürükle + şut ─── */
  if (iHaveBall) {
    const distToGoal = Math.hypot(atkGoalX - p.x, goalCenterY - p.y);

    /* Kale açısını hesapla */
    const angleToGoal = Math.atan2(goalCenterY - p.y, atkGoalX - p.x);

    if (distToGoal < prof.shootRange && Math.random() < prof.shootAcc * 0.06) {
      /* Şut at */
      const spread = (1 - prof.shootAcc) * 0.4;
      const aimA   = angleToGoal + (Math.random()-0.5) * spread * 2;
      ball.owner   = null;
      p.hasBall    = false;
      ball.vx      = Math.cos(aimA) * SHOOT_MAX * 0.85;
      ball.vy      = Math.sin(aimA) * SHOOT_MAX * 0.85;
      clampBall(SHOOT_MAX);
      redGoals++; // istatistik değil, şut sayacı
    } else {
      /* Kaleye doğru sürükle */
      const dribbleAngle = angleToGoal + (Math.random()-0.5) * (1-prof.dribble) * 0.5;
      tx = p.x + Math.cos(dribbleAngle) * 60;
      ty = p.y + Math.sin(dribbleAngle) * 60;
    }

  /* ─── TOPUM YOK, TOP YAKINDA ─── */
  } else if (ballDist < prof.sight) {

    if (ballOwnerTeam === p.team || ball.owner === null) {
      /* ── HÜCUM: topa git ── */
      if (role === 'attacker' || role === 'midfielder') {
        /* Topun arkasından geç: kaleyi arkana al, topun ön tarafına konumlan */
        const behindBallAngle = Math.atan2(ball.y - goalCenterY, ball.x - atkGoalX);
        tx = ball.x + Math.cos(behindBallAngle) * (p.r + B_R + 8);
        ty = ball.y + Math.sin(behindBallAngle) * (p.r + B_R + 8);
      } else if (role === 'defender' || role === 'keeper') {
        /* Savunma: kendi kalemizi koru */
        const lerpX = defGoalX + (ball.x - defGoalX) * 0.35;
        const lerpY = ball.y;
        tx = isBlue ? Math.min(lerpX, W*0.35) : Math.max(lerpX, W*0.65);
        ty = Math.max(gY1 + gH*0.1, Math.min(gY2 - gH*0.1, lerpY));
      }
    } else {
      /* ── RAKIP TOPLU: baskı/blok ── */
      if (role === 'attacker') {
        /* Rakibi sık */
        tx = ball.owner?.x ?? ball.x;
        ty = ball.owner?.y ?? ball.y;
      } else if (role === 'midfielder') {
        /* Araya gir */
        tx = (ball.x + atkGoalX) * 0.5;
        ty = ball.y;
      } else {
        /* Savunma çizgisini tut */
        const sx = isBlue ? W*0.25 : W*0.75;
        tx = sx;
        ty = ball.y * 0.5 + H*0.5 * 0.5;
      }
    }

  /* ─── TOP UZAKTA: baz pozisyona dön ── */
  } else {
    /* Takım topundaysa biraz öne çık */
    const possession = ball.owner?.team === p.team || (!ball.owner && isBlue === (ball.x < W*0.5));
    const offsetX    = possession ? 0.1 : -0.05;
    const basePosX   = ROLE_POSITIONS[role][0] + offsetX;
    tx = isBlue ? W * basePosX : W * (1 - basePosX);
    ty = p._homeY + (ball.y - H*0.5) * 0.25; // yatayda topa göre biraz kaydır
  }

  /* ─── Sınır: sahada kal ── */
  tx = Math.max(p.r+4, Math.min(W-p.r-4, tx));
  ty = Math.max(p.r+4, Math.min(H-p.r-4, ty));

  /* ─── Hareketi uygula ── */
  const dx = tx - p.x, dy = ty - p.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 3) {
    const spd = Math.min(prof.speed * 0.42, dist * 0.12);
    p.vx += (dx / dist) * spd;
    p.vy += (dy / dist) * spd;
  }

  /* Hız sınırla */
  clampSpeed(p, prof.speed);
}

/* ══════════════════════════════════════════════════
   OYUNCU FABRIKASI & FORMASYON
══════════════════════════════════════════════════ */
function makePlayer(x, y, color, dark, label, isBot, team) {
  return { x, y, vx:0, vy:0, color, dark, label, isBot, team,
           hasBall:false, trail:[], r:22 };
}

function getFormation(mode, team) {
  const count = MODES[mode]?.[team==='blue'?'blue':'red'] || 1;
  const xBase  = team==='blue' ? [0.10,0.18,0.28,0.38,0.48,0.56] : [0.90,0.82,0.72,0.62,0.52,0.44];
  const yPositions = {
    1: [0.50],
    2: [0.35,0.65],
    3: [0.25,0.50,0.75],
    4: [0.20,0.40,0.60,0.80],
    5: [0.18,0.35,0.50,0.65,0.82],
    6: [0.15,0.28,0.42,0.58,0.72,0.85],
  };
  const ys = yPositions[count] || yPositions[1];
  return ys.map((y, i) => ({ x: W * xBase[Math.min(i, xBase.length-1)], y: H * y }));
}

/* ══════════════════════════════════════════════════
   OYUNU BAŞLAT
══════════════════════════════════════════════════ */
function launchGame(mode, settings, isClient) {
  currentMode     = mode;
  currentSettings = settings || {};
  showScreen('screen-game');

  document.getElementById('sb-name1').textContent = '🔵 Mavi';
  document.getElementById('sb-name2').textContent = '🔴 Kırmızı';
  document.getElementById('sb-mode-badge').textContent = mode;

  blueScore=redScore=blueGoals=redGoals=0;
  timeLeft  = settings?.time || 60;
  paused=false; running=true;
  p1Power=p2Power=0; p1Charging=p2Charging=false;
  updateScoreUI(); updateTimerUI();

  if (IS_MOBILE()) {
    document.getElementById('touch-controls')?.classList.add('active');
    const ts = document.getElementById('touch-shoot-btns');
    if (ts) ts.style.display='block';
    const ge = document.getElementById('screen-game');
    if (ge) ge.style.paddingBottom='150px';
  }

  clearInterval(timerInt);
  timerInt = setInterval(()=>{ if(!running||paused) return; timeLeft--; updateTimerUI(); if(timeLeft<=0) endMatch(); }, 1000);

  cancelAnimationFrame(rafId);
  requestAnimationFrame(()=>{ doResize(); initPlayers(mode, settings?.diff||'medium'); resetBall(); loop(); });
}

function doResize() {
  const wrap  = canvas.parentElement;
  const availW = (wrap.clientWidth||window.innerWidth||360);
  W = Math.min(availW, IS_MOBILE() ? availW : 940);
  H = Math.round(W * (IS_MOBILE() ? 0.56 : 0.52));
  const maxH = IS_MOBILE() ? Math.round(window.innerHeight * 0.48) : H;
  if (H > maxH) { H = maxH; W = Math.round(H / (IS_MOBILE() ? 0.56 : 0.52)); }
  canvas.width=W; canvas.height=H;
  canvas.style.width=''; canvas.style.height='';
}

function initPlayers(mode, diff) {
  players = [];
  const profile  = BOT_PROFILES[diff] || BOT_PROFILES.medium;
  const modeInfo = MODES[mode] || MODES['1v1'];

  const bluePos = getFormation(mode,'blue');
  const redPos  = getFormation(mode,'red');

  bluePos.forEach((pos, i) => {
    const isHuman = i === 0; // mavi takımın ilk oyuncusu her zaman insan
    const label   = isHuman ? ME.username.slice(0,3).toUpperCase() : `B${i+1}`;
    const p = makePlayer(pos.x, pos.y, '#3b82f6', '#1d4ed8', label, !isHuman, 'blue');
    p._profile = profile;
    p._homeX   = pos.x; p._homeY = pos.y;
    p._wanderT = Math.random()*Math.PI*2;
    p._role    = getBotRole(i, modeInfo.blue);
    players.push(p);
  });

  redPos.forEach((pos, i) => {
    const p = makePlayer(pos.x, pos.y, '#ef4444', '#b91c1c', `R${i+1}`, true, 'red');
    p._profile = profile;
    p._homeX   = pos.x; p._homeY = pos.y;
    p._wanderT = Math.random()*Math.PI*2;
    p._role    = getBotRole(i, modeInfo.red);
    players.push(p);
  });
}

function resetBall() {
  ball = { x:W/2, y:H/2, vx:(Math.random()>.5?1:-1)*1.5, vy:(Math.random()-.5)*1.5, rot:0, trail:[], owner:null };
  goalCD = 0;
  players.forEach(p => { p.x=p._homeX; p.y=p._homeY; p.vx=0; p.vy=0; p.hasBall=false; p.trail=[]; });
}

/* ══════════════════════════════════════════════════
   GAME LOOP
══════════════════════════════════════════════════ */
function loop() {
  if (!running) return;
  rafId = requestAnimationFrame(loop);
  if (!paused) { update(); draw(); }
}

/* ══════════════════════════════════════════════════
   UPDATE
══════════════════════════════════════════════════ */
function update() {
  if (goalCD > 0) { goalCD--; if (goalAnim>0) goalAnim--; return; }
  if (goalAnim > 0) goalAnim--;

  /* İnsan oyuncu 1 (Mavi — WASD) */
  const human1 = players.find(p => !p.isBot && p.team==='blue');
  const human2 = players.find(p => !p.isBot && p.team==='red');

  if (human1) {
    if (K['w']||K['W']) human1.vy -= P_ACCEL;
    if (K['s']||K['S']) human1.vy += P_ACCEL;
    if (K['a']||K['A']) human1.vx -= P_ACCEL;
    if (K['d']||K['D']) human1.vx += P_ACCEL;
    /* F = top çalma */
    if (K['f']||K['F']) trySteal(human1);
    /* Space = şut şarjı */
    p1Charging = !!(K[' ']);
    if (p1Charging) p1Power = Math.min(100, p1Power + POWER_RATE);
    else            p1Power = Math.max(0,   p1Power - POWER_DRAIN);
  }

  if (human2) {
    if (K['ArrowUp'])    human2.vy -= P_ACCEL;
    if (K['ArrowDown'])  human2.vy += P_ACCEL;
    if (K['ArrowLeft'])  human2.vx -= P_ACCEL;
    if (K['ArrowRight']) human2.vx += P_ACCEL;
    /* / = top çalma (p2) */
    if (K['/']) trySteal(human2);
    p2Charging = !!(K['Enter']);
    if (p2Charging) p2Power = Math.min(100, p2Power + POWER_RATE);
    else            p2Power = Math.max(0,   p2Power - POWER_DRAIN);
  }

  updatePowerBars();

  /* Botlar */
  players.forEach(p => { if (p.isBot) updateBot(p); });

  /* Tüm oyuncuları hareket ettir */
  players.forEach(p => {
    clampSpeed(p, p.isBot ? (p._profile?.speed||3.5) : P_MAX_SPD);
    p.trail.push({x:p.x,y:p.y}); if (p.trail.length>8) p.trail.shift();
    p.x += p.vx; p.y += p.vy;
    /* Sürtünme — oyuncuya özel */
    const fr = p.isBot ? 0.80 : P_FRIC;
    p.vx *= fr; p.vy *= fr;
    if (Math.abs(p.vx)<0.05) p.vx=0;
    if (Math.abs(p.vy)<0.05) p.vy=0;
    wallPlayer(p);
  });

  /* Top hareketi */
  if (ball.owner) {
    const ow  = ball.owner;
    const fwd = ow.team==='blue' ? 1 : -1;
    ball.x = ow.x + fwd*(ow.r + B_R + 2);
    ball.y = ow.y;
    ball.vx=0; ball.vy=0;
    ball.rot += 0.06 * fwd;
  } else {
    ball.trail.push({x:ball.x,y:ball.y}); if (ball.trail.length>15) ball.trail.shift();
    ball.x += ball.vx; ball.y += ball.vy;
    ball.vx *= B_FRIC; ball.vy *= B_FRIC;
    ball.rot += ball.vx*0.055;
    if (Math.abs(ball.vx)<0.02) ball.vx=0;
    if (Math.abs(ball.vy)<0.02) ball.vy=0;
    wallBall();
  }

  players.forEach(p => handlePlayerBall(p));
  handleAllPlayerCollisions();
  checkGoal();
}

/* ── F tuşu: Top Çalma ── */
function trySteal(p) {
  if (!ball || ball.owner === p) return;
  if (!ball.owner) return; // sahipsiz top zaten temas ile alınır

  /* Sadece rakip topa yakınsa çalabilir */
  if (ball.owner.team === p.team) return;

  const dist = Math.hypot(ball.x - p.x, ball.y - p.y);
  const stealRange = p.r + B_R + 18; // biraz geniş alan

  if (dist < stealRange) {
    /* Animasyon: eski sahibi seke */
    const prev = ball.owner;
    prev.vx -= (p.x - prev.x) * 0.08;
    prev.vy -= (p.y - prev.y) * 0.08;
    prev.hasBall = false;

    /* Topu al */
    ball.owner  = p;
    p.hasBall   = true;
    gz_toast('Top çalındı! 🔄', 'info');
  }
}

/* ── Güç barları ── */
function updatePowerBars() {
  const b1=document.getElementById('power-bar-1'), b2=document.getElementById('power-bar-2');
  if (b1) b1.style.width=p1Power+'%';
  if (b2) b2.style.width=p2Power+'%';
}

function clampSpeed(obj, max) {
  const s=Math.hypot(obj.vx,obj.vy); if(s>max){ obj.vx=obj.vx/s*max; obj.vy=obj.vy/s*max; }
}

function wallPlayer(p) {
  if (p.y-p.r<0)     { p.y=p.r;     p.vy*=-.35; }
  if (p.y+p.r>H)     { p.y=H-p.r;   p.vy*=-.35; }
  if (p.x-p.r<0)     { p.x=p.r;     p.vx*=-.35; }
  if (p.x+p.r>W)     { p.x=W-p.r;   p.vx*=-.35; }
}

function wallBall() {
  const gH=H*GH_RATIO, gY1=(H-gH)/2, gY2=(H+gH)/2;
  if(ball.y-B_R<0)   { ball.y=B_R;   ball.vy*=-B_BOUNCE; }
  if(ball.y+B_R>H)   { ball.y=H-B_R; ball.vy*=-B_BOUNCE; }
  if(ball.x-B_R<0)   { if(!(ball.y>gY1&&ball.y<gY2)){ ball.x=B_R;   ball.vx*=-B_BOUNCE; } }
  if(ball.x+B_R>W)   { if(!(ball.y>gY1&&ball.y<gY2)){ ball.x=W-B_R; ball.vx*=-B_BOUNCE; } }
  goalPostBounce(0,gY1,gY2); goalPostBounce(W,gY1,gY2);
}
function goalPostBounce(gx,gY1,gY2) {
  [[gx,gY1],[gx,gY2]].forEach(([px,py])=>{
    const dx=ball.x-px, dy=ball.y-py, d=Math.hypot(dx,dy);
    if(d<B_R+6&&d>0){ const nx=dx/d,ny=dy/d,dot=ball.vx*nx+ball.vy*ny;
      ball.vx-=2*dot*nx*.7; ball.vy-=2*dot*ny*.7; ball.x=px+nx*(B_R+6); ball.y=py+ny*(B_R+6); }
  });
}
function clampBall(max) { const s=Math.hypot(ball.vx,ball.vy); if(s>max){ ball.vx=ball.vx/s*max; ball.vy=ball.vy/s*max; } }

/* ── Oyuncu-Top temas ── */
function handlePlayerBall(p) {
  if (!ball) return;
  const dx=ball.x-p.x, dy=ball.y-p.y, dist=Math.hypot(dx,dy), minD=p.r+B_R;

  if (dist < minD+4) {
    /* Rakip çalma denemesi — temas mesafesinde otomatik çalma */
    if (ball.owner && ball.owner.team !== p.team) {
      const relSpd = Math.hypot(p.vx-ball.owner.vx, p.vy-ball.owner.vy);
      /* Daha gerçekçi: hıza göre değil, temas mesafesine göre */
      if (dist < p.r + B_R + 4 && relSpd > 1.5) {
        ball.owner.hasBall = false;
        ball.owner = null;
        ball.vx = (p.vx*0.8 + (dx/Math.max(dist,1))*3);
        ball.vy = (p.vy*0.8 + (dy/Math.max(dist,1))*3);
        clampBall(16);
      }
      return;
    }
    if (ball.owner && ball.owner !== p) return;

    if (dist < minD) {
      if (p.isBot) {
        /* Bot şutu: owner olduğunda updateBot zaten şut kararı verir */
        if (!ball.owner) { ball.owner=p; p.hasBall=true; }
      } else {
        /* İnsan: Space basılıysa şut, değilse kontrol */
        const isP1     = p.team==='blue';
        const charging = isP1 ? p1Charging : p2Charging;
        const power    = isP1 ? p1Power    : p2Power;

        if (charging && power > 5) {
          const force = (power/100) * SHOOT_MAX;
          ball.owner  = null; p.hasBall=false;
          ball.vx     = (dx/Math.max(dist,1)) * force + p.vx;
          ball.vy     = (dy/Math.max(dist,1)) * force + p.vy;
          clampBall(SHOOT_MAX+2);
          if (isP1) p1Power=0; else p2Power=0;
        } else if (!charging) {
          ball.owner=p; p.hasBall=true;
        }
        if (!ball.owner) { const ov=minD-dist; ball.x+=(dx/Math.max(dist,1))*ov; ball.y+=(dy/Math.max(dist,1))*ov; }
      }
    }
  } else if (ball.owner===p) { ball.owner=null; p.hasBall=false; }
}

function handleAllPlayerCollisions() {
  for(let i=0;i<players.length;i++) for(let j=i+1;j<players.length;j++) {
    const a=players[i], b=players[j];
    const dx=b.x-a.x, dy=b.y-a.y, dist=Math.hypot(dx,dy), minD=a.r+b.r;
    if(dist<minD&&dist>0){
      const nx=dx/dist,ny=dy/dist,ov=(minD-dist)/2;
      a.x-=nx*ov; a.y-=ny*ov; b.x+=nx*ov; b.y+=ny*ov;
      const dvx=a.vx-b.vx,dvy=a.vy-b.vy,dot=dvx*nx+dvy*ny;
      if(dot>0){ a.vx-=dot*nx*.7; a.vy-=dot*ny*.7; b.vx+=dot*nx*.7; b.vy+=dot*ny*.7; }
    }
  }
}

/* ── Gol ── */
function checkGoal() {
  if(goalCD>0) return;
  const gH=H*GH_RATIO, gY1=(H-gH)/2, gY2=(H+gH)/2;
  if(ball.x-B_R < -GOAL_D && ball.y>gY1 && ball.y<gY2) {
    redScore++; redGoals++; triggerGoal('red');
    const lim=currentSettings?.goals||0; if(lim>0&&redScore>=lim){setTimeout(endMatch,1600);return;}
    setTimeout(resetBall,1500); goalCD=90;
  }
  if(ball.x+B_R > W+GOAL_D && ball.y>gY1 && ball.y<gY2) {
    blueScore++; blueGoals++; triggerGoal('blue');
    const lim=currentSettings?.goals||0; if(lim>0&&blueScore>=lim){setTimeout(endMatch,1600);return;}
    setTimeout(resetBall,1500); goalCD=90;
  }
}

function triggerGoal(team) {
  lastGoalTeam=team; goalAnim=80; updateScoreUI();
  const txt=document.getElementById('goal-text'); if(txt) txt.textContent=team==='blue'?'🔵 Mavi GOL!':'🔴 Kırmızı GOL!';
  const ban=document.getElementById('goal-banner'); if(ban){ban.classList.remove('hidden');setTimeout(()=>ban.classList.add('hidden'),1400);}
}
function updateScoreUI(){ document.getElementById('sb-score1').textContent=blueScore; document.getElementById('sb-score2').textContent=redScore; }
function updateTimerUI(){ const el=document.getElementById('sb-timer'); if(el){el.textContent=timeLeft;el.classList.toggle('danger',timeLeft<=10);} }

/* ══════════════════════════════════════════════════
   ÇİZİM
══════════════════════════════════════════════════ */
function draw() {
  ctx.clearRect(0,0,W,H);
  drawField();
  if (ball) { drawTrail(ball.trail,B_R,'rgba(255,255,255,.08)'); drawBall(); }
  players.forEach(p => { drawTrail(p.trail,p.r,p.color+'18'); drawPlayer(p,ball?.owner===p); });
}

function drawField() {
  const fieldColor = currentSettings?.fieldColor || CFG?.field || 'green';
  const pal = FIELD_PALETTES[fieldColor] || FIELD_PALETTES.green;
  const gH=H*GH_RATIO, gY1=(H-gH)/2, gY2=(H+gH)/2;

  /* Çim şeritleri */
  for(let x=0;x<W;x+=80){ ctx.fillStyle=(Math.floor(x/80)%2===0)?pal[0]:pal[1]; ctx.fillRect(x,0,80,H); }

  /* Yatay çizgi dokusu */
  ctx.globalAlpha=.025; for(let y=0;y<H;y+=8){ ctx.fillStyle='#fff'; ctx.fillRect(0,y,W,1); } ctx.globalAlpha=1;

  /* Orta çizgi */
  ctx.setLineDash([10,8]); ctx.strokeStyle='rgba(255,255,255,.22)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();

  /* Orta daire */
  ctx.setLineDash([]); ctx.beginPath(); ctx.arc(W/2,H/2,Math.min(W,H)*.13,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(W/2,H/2,4,0,Math.PI*2); ctx.fill();

  /* Ceza sahaları */
  const pW=W*.12, pH=H*.5, pY=(H-pH)/2;
  ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.strokeRect(0,pY,pW,pH); ctx.strokeRect(W-pW,pY,pW,pH);

  /* Kaleler */
  ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(-GOAL_D,gY1,GOAL_D,gH); ctx.fillRect(W,gY1,GOAL_D,gH);
  drawNet(-GOAL_D,gY1,GOAL_D,gH); drawNet(W,gY1,GOAL_D,gH);
  ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.setLineDash([]);
  drawGoalLine(0,gY1,gY2,false); drawGoalLine(W,gY1,gY2,true);

  /* Saha çerçevesi */
  ctx.strokeStyle='rgba(255,255,255,.38)'; ctx.lineWidth=3; ctx.strokeRect(1,1,W-2,H-2); ctx.lineWidth=1;

  /* Gol renk flaşı */
  if(goalAnim>0){const a=(goalAnim/80)*0.25;ctx.fillStyle=lastGoalTeam==='blue'?`rgba(59,130,246,${a})`:`rgba(239,68,68,${a})`;ctx.fillRect(0,0,W,H);}
}

function drawNet(x,y,w,h){ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;for(let i=0;i<=w;i+=10){ctx.beginPath();ctx.moveTo(x+i,y);ctx.lineTo(x+i,y+h);ctx.stroke();}for(let j=0;j<=h;j+=12){ctx.beginPath();ctx.moveTo(x,y+j);ctx.lineTo(x+w,y+j);ctx.stroke();}}
function drawGoalLine(gx,gY1,gY2,right){ctx.beginPath();ctx.moveTo(gx,gY1);ctx.lineTo(gx+(right?GOAL_D:-GOAL_D),gY1);ctx.lineTo(gx+(right?GOAL_D:-GOAL_D),gY2);ctx.lineTo(gx,gY2);ctx.stroke();}
function drawTrail(trail,r,color){trail.forEach((pt,i)=>{const t=i/trail.length;ctx.globalAlpha=t*.38;ctx.fillStyle=color;ctx.beginPath();ctx.arc(pt.x,pt.y,r*t*.58,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;}

function drawPlayer(p, hasBall) {
  const R=p.r;
  /* Gölge */
  ctx.globalAlpha=.2; ctx.fillStyle='#000';
  ctx.beginPath(); ctx.ellipse(p.x,p.y+R+3,R*.8,R*.2,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  /* Top sahipliği halkası */
  if(hasBall){ const pulse=.65+Math.sin(Date.now()*.014)*.35; ctx.strokeStyle=p.color; ctx.lineWidth=2.8; ctx.globalAlpha=pulse; ctx.beginPath(); ctx.arc(p.x,p.y,R+8,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }
  /* Glow */
  const gl=ctx.createRadialGradient(p.x,p.y,R*.2,p.x,p.y,R*2.2); gl.addColorStop(0,p.color+'42'); gl.addColorStop(1,'transparent');
  ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(p.x,p.y,R*2.2,0,Math.PI*2); ctx.fill();
  /* Gövde */
  const bg=ctx.createRadialGradient(p.x-R*.3,p.y-R*.3,R*.1,p.x,p.y,R); bg.addColorStop(0,lighten(p.color,55)); bg.addColorStop(1,p.dark);
  ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(p.x,p.y,R,0,Math.PI*2); ctx.fill();
  /* Kenar */
  ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(p.x,p.y,R,0,Math.PI*2); ctx.stroke();
  /* Parlaklık */
  const sh=ctx.createRadialGradient(p.x-R*.32,p.y-R*.32,0,p.x,p.y,R); sh.addColorStop(0,'rgba(255,255,255,.32)'); sh.addColorStop(.5,'transparent');
  ctx.fillStyle=sh; ctx.beginPath(); ctx.arc(p.x,p.y,R,0,Math.PI*2); ctx.fill();
  /* Yüz */
  ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.beginPath(); ctx.arc(p.x-R*.3,p.y-R*.24,R*.17,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(p.x+R*.3,p.y-R*.24,R*.17,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath(); ctx.arc(p.x-R*.3,p.y-R*.24,R*.085,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(p.x+R*.3,p.y-R*.24,R*.085,0,Math.PI*2); ctx.fill();
  /* Bot rozeti */
  if(p.isBot){ ctx.fillStyle='rgba(0,0,0,.55)'; ctx.beginPath(); ctx.arc(p.x+R*.72,p.y-R*.72,R*.3,0,Math.PI*2); ctx.fill(); ctx.font=`${R*.28}px sans-serif`; ctx.textAlign='center'; ctx.fillText('🤖',p.x+R*.72,p.y-R*.57); }
  /* İsim */
  ctx.font=`bold ${Math.max(7,R*.36)}px Rajdhani,sans-serif`; ctx.textAlign='center';
  const tw=ctx.measureText(p.label).width+6;
  ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(p.x-tw/2,p.y-R-18,tw,13);
  ctx.fillStyle='#fff'; ctx.fillText(p.label,p.x,p.y-R-8); ctx.textAlign='left';
}

function drawBall() {
  const R=B_R,x=ball.x,y=ball.y;
  ctx.globalAlpha=.2; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(x,y+R+2,R*.9,R*.2,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.save(); ctx.translate(x,y); ctx.rotate(ball.rot);
  ctx.fillStyle='#f0f0f0'; ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(0,0,R*.32,0,Math.PI*2); ctx.fill();
  [0,72,144,216,288].forEach(deg=>{const rad=(deg-18)*Math.PI/180;ctx.beginPath();ctx.arc(Math.cos(rad)*R*.65,Math.sin(rad)*R*.65,R*.2,0,Math.PI*2);ctx.fill();});
  const sh=ctx.createRadialGradient(-R*.3,-R*.3,0,0,0,R);sh.addColorStop(0,'rgba(255,255,255,.42)');sh.addColorStop(.5,'transparent');
  ctx.fillStyle=sh;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();
  ctx.restore();ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.stroke();
}

/* ══════════════════════════════════════════════════
   MAÇ SONU
══════════════════════════════════════════════════ */
function endMatch() {
  running=false; clearInterval(timerInt); cancelAnimationFrame(rafId);
  const blueWon=blueScore>redScore, draw=blueScore===redScore;
  GZ.recordFootballGame(blueWon, blueGoals);
  let reward=0;
  if(blueWon) reward=50+blueScore*15;
  else if(draw) reward=20;
  if(reward>0){ GZ.addBalance(reward); gz_toast(`${blueWon?'🏆 Kazandın!':'🤝 Berabere!'} +${reward}🪙`,blueWon?'gold':'info'); }
  GZ.addXP(blueWon?100:draw?40:20);
  if(activeLobbyId){ GZ.deleteLobby(activeLobbyId); activeLobbyId=null; }
  hideTouchPad();
  let winner,trophy;
  if(blueWon){winner='🔵 Mavi Takım Kazandı!';trophy='🏆';}
  else if(!draw){winner='🔴 Kırmızı Takım Kazandı!';trophy='🏆';}
  else{winner='Berabere!';trophy='🤝';}
  document.getElementById('go-trophy').textContent=trophy;
  document.getElementById('go-winner').textContent=winner;
  document.getElementById('go-score').textContent=`${blueScore} — ${redScore}`;
  document.getElementById('go-details').innerHTML=`<div class="go-detail">Mod: <b>${currentMode}</b></div>${reward>0?`<div class="go-detail">💰 <b>+${reward}🪙</b></div>`:''}`;
  showScreen('screen-gameover');
  if(blueWon) gz_confetti(['#3b82f6','#f59e0b','#22c55e']);
}

function rematch(){ launchGame(currentMode,currentSettings,false); }
function abandonGame(){
  running=false; clearInterval(timerInt); cancelAnimationFrame(rafId);
  hideTouchPad();
  if(activeLobbyId){ GZ.deleteLobby(activeLobbyId); activeLobbyId=null; }
  backToMenu();
}
function hideTouchPad(){
  document.getElementById('touch-controls')?.classList.remove('active');
  const ts=document.getElementById('touch-shoot-btns'); if(ts) ts.style.display='none';
  const ge=document.getElementById('screen-game'); if(ge) ge.style.paddingBottom='';
}

/* ══════════════════════════════════════════════════
   EKRAN YÖNETİMİ
══════════════════════════════════════════════════ */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>{s.classList.add('hidden');s.style.display='';});
  const el=document.getElementById(id); if(!el) return;
  el.classList.remove('hidden');
  if(id==='screen-game') el.style.display='flex';
}
function backToMenu(){
  clearInterval(lobbyPollTimer); clearInterval(timerInt); cancelAnimationFrame(rafId);
  running=false; activeLobbyId=null;
  showScreen('screen-lobby'); refreshLobbies();
}
function togglePause(){
  paused=!paused;
  document.getElementById('pause-btn').textContent=paused?'▶ Devam':'⏸ Durdur';
  document.getElementById('pause-overlay').classList.toggle('hidden',!paused);
}

/* ══════════════════════════════════════════════════
   MOBİL DOKUNMATIK
══════════════════════════════════════════════════ */
const TOUCH_MAP={
  'tc-p1-up':'w','tc-p1-down':'s','tc-p1-left':'a','tc-p1-right':'d','tc-p1-shoot':' ',
  'tc-p2-up':'ArrowUp','tc-p2-down':'ArrowDown','tc-p2-left':'ArrowLeft','tc-p2-right':'ArrowRight','tc-p2-shoot':'Enter',
};
function bindTouchControls(){
  Object.entries(TOUCH_MAP).forEach(([elId,key])=>{
    const el=document.getElementById(elId); if(!el) return;
    const press  =e=>{e.preventDefault();K[key]=true; el.classList.add('pressed');};
    const release=e=>{e.preventDefault();K[key]=false;el.classList.remove('pressed');};
    el.addEventListener('touchstart', press,   {passive:false});
    el.addEventListener('touchend',   release, {passive:false});
    el.addEventListener('touchcancel',release, {passive:false});
    el.addEventListener('mousedown',  press);
    el.addEventListener('mouseup',    release);
    el.addEventListener('mouseleave', release);
  });
}
document.addEventListener('touchmove',e=>{if(running)e.preventDefault();},{passive:false});
window.addEventListener('resize',()=>{
  if(running){ doResize(); players.forEach(p=>{p.x=Math.max(p.r,Math.min(W-p.r,p.x));p.y=Math.max(p.r,Math.min(H-p.r,p.y));}); if(ball){ball.x=Math.max(B_R,Math.min(W-B_R,ball.x));ball.y=Math.max(B_R,Math.min(H-B_R,ball.y));} }
});

/* ── Yardımcı ── */
function lighten(hex,amt){if(!hex.startsWith('#'))return hex;return `rgb(${Math.min(255,parseInt(hex.slice(1,3),16)+amt)},${Math.min(255,parseInt(hex.slice(3,5),16)+amt)},${Math.min(255,parseInt(hex.slice(5,7),16)+amt)})`;}
function darken(hex){if(!hex.startsWith('#'))return hex;return `rgb(${Math.max(0,parseInt(hex.slice(1,3),16)-40)},${Math.max(0,parseInt(hex.slice(3,5),16)-40)},${Math.max(0,parseInt(hex.slice(5,7),16)-40)})`;}
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ── Init ── */
bindTouchControls();
showScreen('screen-lobby');
refreshLobbies();
document.getElementById('ctrl-p1-init').textContent = ME.username.slice(0,2).toUpperCase();
document.getElementById('ctrl-p1-name').textContent  = ME.username;
