/* =====================================================
   XOX.JS — GlitchGrid Tic-Tac-Toe
   Modlar: vs AI (4 zorluk), Aynı Cihaz, Online Lobi
===================================================== */
if (!GZ.requireAuth()) throw '';
const ME_X = GZ.currentUser();
GZ.renderNavbar('xox');

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
let board     = Array(9).fill(null); // null | 'X' | 'O'
let currentTurn = 'X';
let gameMode  = null;   // 'ai' | 'local' | 'online'
let mySymbol  = 'X';
let aiDiff    = 'medium';
let gameOver  = false;

let scores    = {X:0, O:0, draw:0};
let round     = 1;

let activeLobbyId = null;
let pollTimer     = null;
let mySlot        = null; // 1 veya 2

/* ══════════════════════════════════════════════════
   NAVİGASYON
══════════════════════════════════════════════════ */
function showXoxScreen(id) {
  document.querySelectorAll('.xox-screen').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
  document.getElementById('xox-result-overlay')?.classList.add('hidden');
}

/* ══════════════════════════════════════════════════
   MENÜ
══════════════════════════════════════════════════ */
function startVsAI() {
  document.getElementById('xox-ai-opts').classList.toggle('hidden');
  document.getElementById('xox-online-opts').classList.add('hidden');
}
function showOnlineMenu() {
  document.getElementById('xox-online-opts').classList.toggle('hidden');
  document.getElementById('xox-ai-opts').classList.add('hidden');
  refreshXoxLobbies();
}
function startLocal() {
  gameMode  = 'local';
  mySymbol  = 'X';
  scores    = {X:0,O:0,draw:0};
  round     = 1;
  initGame('Oyuncu 1','Oyuncu 2','X','O');
}
function setAIDiff(btn) {
  document.querySelectorAll('#xox-ai-opts .opt-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  aiDiff = btn.dataset.val;
}
function pickSymbol(sym) {
  mySymbol = sym;
  document.getElementById('pick-x').classList.toggle('active', sym==='X');
  document.getElementById('pick-o').classList.toggle('active', sym==='O');
}
function launchVsAI() {
  gameMode = 'ai';
  scores   = {X:0,O:0,draw:0};
  round    = 1;
  const aiSym = mySymbol==='X'?'O':'X';
  initGame(ME_X.username,'🤖 Yapay Zeka', mySymbol, aiSym);
  /* AI ilk oynuyor mu? */
  if (currentTurn !== mySymbol) setTimeout(aiMove,600);
}

/* ══════════════════════════════════════════════════
   OYUN BAŞLAT
══════════════════════════════════════════════════ */
function initGame(p1Name, p2Name, p1Sym, p2Sym) {
  board       = Array(9).fill(null);
  currentTurn = 'X';
  gameOver    = false;

  showXoxScreen('xox-game');
  buildBoard();
  updateScoreboard(p1Name, p2Name, p1Sym, p2Sym);
  updateTurnIndicator();
  clearWinLine();
}

function buildBoard() {
  const boardEl = document.getElementById('xox-board');
  boardEl.innerHTML = '';
  const ghost = currentTurn==='X'?'✕':'◯';
  for (let i=0; i<9; i++) {
    const cell = document.createElement('div');
    cell.className  = 'xox-cell';
    cell.dataset.i  = i;
    cell.dataset.ghost = currentTurn==='X'?'✕':'◯';
    cell.addEventListener('click',  ()=>cellClick(i));
    cell.addEventListener('touchend', e=>{e.preventDefault(); cellClick(i);}, {passive:false});
    boardEl.appendChild(cell);
  }
}

function updateScoreboard(p1Name, p2Name, p1Sym, p2Sym) {
  document.getElementById('xox-p1-name').textContent   = p1Name;
  document.getElementById('xox-p2-name').textContent   = p2Name;
  document.getElementById('xox-p1-sym').textContent    = p1Sym==='X'?'✕':'◯';
  document.getElementById('xox-p2-sym').textContent    = p2Sym==='X'?'✕':'◯';
  document.getElementById('xox-p1-sym').className      = 'xox-sym '+(p1Sym==='X'?'x-sym':'o-sym');
  document.getElementById('xox-p2-sym').className      = 'xox-sym '+(p2Sym==='X'?'x-sym':'o-sym');
  document.getElementById('xox-p1-score').textContent  = scores[p1Sym]||0;
  document.getElementById('xox-p2-score').textContent  = scores[p2Sym]||0;
  document.getElementById('xox-round-info').textContent= `Tur ${round}`;
}

function updateTurnIndicator() {
  const ind = document.getElementById('xox-turn-ind');
  if (!ind) return;
  ind.textContent = currentTurn==='X' ? '✕ oynuyor' : '◯ oynuyor';
  ind.style.color = currentTurn==='X' ? 'var(--primary2)' : 'var(--cyan)';
  /* Ghost güncelle */
  document.querySelectorAll('.xox-cell:not(.taken)').forEach(c=>{
    c.dataset.ghost = currentTurn==='X'?'✕':'◯';
  });
}

/* ══════════════════════════════════════════════════
   HAMLE
══════════════════════════════════════════════════ */
function cellClick(i) {
  if (gameOver || board[i]) return;
  /* Online modda sadece kendi sıran */
  if (gameMode==='online' && currentTurn !== (mySlot===1?'X':'O')) return;

  makeMove(i, currentTurn);

  if (gameMode==='online') {
    /* Lobi'ye hamlemi kaydet */
    saveXoxMove(activeLobbyId, i, currentTurn);
  }
}

function makeMove(i, sym) {
  if (board[i] || gameOver) return;
  board[i] = sym;

  const cell = document.querySelector(`.xox-cell[data-i="${i}"]`);
  if (cell) {
    cell.textContent = sym==='X' ? '✕' : '◯';
    cell.classList.add('taken', sym==='X'?'x-cell':'o-cell');
  }

  const win = checkWin(board, sym);
  if (win) {
    gameOver = true;
    highlightWin(win);
    scores[sym]++;
    setTimeout(()=>showResult(sym, win, false), 600);
    return;
  }
  if (board.every(c=>c)) {
    gameOver=true;
    scores.draw++;
    setTimeout(()=>showResult(null, null, true), 400);
    return;
  }

  currentTurn = sym==='X'?'O':'X';
  updateTurnIndicator();

  if (gameMode==='ai' && currentTurn !== mySymbol) {
    setTimeout(aiMove, 500+Math.random()*300);
  }
}

/* ══════════════════════════════════════════════════
   KAZANMA KONTROLÜ
══════════════════════════════════════════════════ */
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // yatay
  [0,3,6],[1,4,7],[2,5,8], // dikey
  [0,4,8],[2,4,6],          // çapraz
];

function checkWin(b, sym) {
  return WIN_LINES.find(line => line.every(i=>b[i]===sym)) || null;
}

function highlightWin(line) {
  line.forEach(i=>{
    document.querySelector(`.xox-cell[data-i="${i}"]`)?.classList.add('win-cell');
  });
  drawWinLine(line);
}

function drawWinLine(line) {
  const cvs = document.getElementById('xox-line-canvas');
  if (!cvs) return;
  const boardEl = document.getElementById('xox-board');
  cvs.width  = boardEl.offsetWidth;
  cvs.height = boardEl.offsetHeight;
  const ctx  = cvs.getContext('2d');
  ctx.clearRect(0,0,cvs.width,cvs.height);

  const getCellCenter = (i) => {
    const cell = document.querySelector(`.xox-cell[data-i="${i}"]`);
    if (!cell) return {x:0,y:0};
    const br = cell.getBoundingClientRect();
    const bb = boardEl.getBoundingClientRect();
    return { x: br.left-bb.left+br.width/2, y: br.top-bb.top+br.height/2 };
  };

  const a = getCellCenter(line[0]);
  const b = getCellCenter(line[2]);

  ctx.strokeStyle = 'rgba(245,158,11,.85)';
  ctx.lineWidth   = 5;
  ctx.lineCap     = 'round';
  ctx.shadowColor = 'rgba(245,158,11,.5)';
  ctx.shadowBlur  = 12;

  /* Animasyonlu çizgi */
  let prog = 0;
  const draw = () => {
    prog = Math.min(prog+0.08, 1);
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x+(b.x-a.x)*prog, a.y+(b.y-a.y)*prog);
    ctx.stroke();
    if (prog<1) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

function clearWinLine() {
  const cvs=document.getElementById('xox-line-canvas');
  if (!cvs) return;
  const ctx=cvs.getContext('2d');
  ctx.clearRect(0,0,cvs.width,cvs.height);
}

/* ══════════════════════════════════════════════════
   SONUÇ
══════════════════════════════════════════════════ */
function showResult(winner, line, isDraw) {
  const overlay = document.getElementById('xox-result-overlay');
  const emoji   = document.getElementById('xox-result-emoji');
  const title   = document.getElementById('xox-result-title');
  const sub     = document.getElementById('xox-result-sub');
  const reward  = document.getElementById('xox-result-reward');

  let rewardCoins=0;

  if (isDraw) {
    emoji.textContent = '🤝';
    title.textContent = 'Berabere!';
    sub.textContent   = 'Kimse kazanamadı.';
    rewardCoins=5;
  } else if (gameMode==='ai') {
    const iWon = winner===mySymbol;
    emoji.textContent = iWon?'🏆':'💀';
    title.textContent = iWon?'Kazandın!':'Kaybettin!';
    sub.textContent   = iWon?'Yapay zekayı yendin!':'Yapay zeka kazandı.';
    if (iWon){ rewardCoins = aiDiff==='perfect'?50:aiDiff==='hard'?30:aiDiff==='medium'?15:8; }
    /* İstatistik kaydet */
    recordXoxResult(iWon, isDraw);
  } else if (gameMode==='local') {
    emoji.textContent = '🏆';
    title.textContent = `${winner==='X'?'✕ Oyuncu 1':'◯ Oyuncu 2'} Kazandı!`;
    sub.textContent   = '';
    rewardCoins=5;
  } else if (gameMode==='online') {
    const iWon = winner===(mySlot===1?'X':'O');
    emoji.textContent = iWon?'🏆':isDraw?'🤝':'💀';
    title.textContent = iWon?'Kazandın!':isDraw?'Berabere!':'Kaybettin!';
    sub.textContent   = '';
    if (iWon) rewardCoins=20;
    recordXoxResult(iWon, isDraw);
  }

  if (rewardCoins>0) {
    GZ.addBalance(rewardCoins);
    GZ.addXP(rewardCoins*2);
    reward.textContent=`+${rewardCoins} 🪙 kazandın!`;
    if (!isDraw) gz_confetti(['#f59e0b','#a855f7','#22c55e']);
  } else { reward.textContent=''; }

  overlay.classList.remove('hidden');
}

function recordXoxResult(won, draw) {
  const u = GZ.currentUser(); if(!u) return;
  u.stats = u.stats||{};
  u.stats.xoxGames = (u.stats.xoxGames||0)+1;
  if (won)  u.stats.xoxWins  = (u.stats.xoxWins||0)+1;
  if (draw) u.stats.xoxDraws = (u.stats.xoxDraws||0)+1;
  GZ.saveCurrentUser(u);
}

/* ══════════════════════════════════════════════════
   SONRAKI TUR / ÇIKIŞ
══════════════════════════════════════════════════ */
function xoxNewRound() {
  round++;
  document.getElementById('xox-result-overlay').classList.add('hidden');

  board     = Array(9).fill(null);
  /* Tur başlangıcında kazanan başlar (X X olarak devam) */
  currentTurn = 'X';
  gameOver  = false;

  buildBoard();
  clearWinLine();
  updateTurnIndicator();

  const p1sym = gameMode==='ai'?mySymbol:'X';
  const p2sym = p1sym==='X'?'O':'X';
  const p1n   = gameMode==='ai'?ME_X.username:gameMode==='online'?ME_X.username:'Oyuncu 1';
  const p2n   = gameMode==='ai'?'🤖 Yapay Zeka':gameMode==='online'?'Rakip':'Oyuncu 2';
  updateScoreboard(p1n,p2n,p1sym,p2sym);

  if (gameMode==='ai' && currentTurn!==mySymbol) setTimeout(aiMove,600);
}

function xoxQuit() {
  clearInterval(pollTimer);
  if (activeLobbyId) deleteXoxLobby(activeLobbyId);
  activeLobbyId=null; mySlot=null;
  document.getElementById('xox-result-overlay').classList.add('hidden');
  document.getElementById('xox-ai-opts').classList.add('hidden');
  document.getElementById('xox-online-opts').classList.add('hidden');
  showXoxScreen('xox-menu');
  renderXoxStats();
}

/* ══════════════════════════════════════════════════
   YAPAY ZEKA
══════════════════════════════════════════════════ */
function aiMove() {
  if (gameOver) return;
  const aiSym = mySymbol==='X'?'O':'X';
  const idx   = getBestMove(board, aiSym, aiDiff);
  if (idx !== null) makeMove(idx, aiSym);
}

function getBestMove(b, aiSym, diff) {
  const humanSym = aiSym==='X'?'O':'X';

  if (diff==='easy') {
    /* Tamamen rastgele */
    const free = b.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
    return free.length ? free[Math.floor(Math.random()*free.length)] : null;
  }
  if (diff==='medium') {
    /* %50 akıllı, %50 rastgele */
    if (Math.random()<0.5) return smartMove(b,aiSym,humanSym);
    const free=b.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
    return free.length?free[Math.floor(Math.random()*free.length)]:null;
  }
  if (diff==='hard') {
    /* Kazanacaksa yap, blok atacaksa at, sonra akıllı */
    return smartMove(b,aiSym,humanSym);
  }
  /* perfect: minimax */
  return minimax(b, aiSym, humanSym, true).index;
}

function smartMove(b, aiSym, humanSym) {
  /* 1. Kazanabilecek hamle */
  for(let i=0;i<9;i++){
    if(!b[i]){const t=[...b];t[i]=aiSym;if(checkWin(t,aiSym)) return i;}
  }
  /* 2. İnsanı blokla */
  for(let i=0;i<9;i++){
    if(!b[i]){const t=[...b];t[i]=humanSym;if(checkWin(t,humanSym)) return i;}
  }
  /* 3. Merkez */
  if(!b[4]) return 4;
  /* 4. Köşe */
  const corners=[0,2,6,8].filter(i=>!b[i]);
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  /* 5. Kenar */
  const edges=[1,3,5,7].filter(i=>!b[i]);
  if(edges.length) return edges[Math.floor(Math.random()*edges.length)];
  return null;
}

function minimax(b, aiSym, humanSym, isMax) {
  if (checkWin(b,aiSym))   return {score:10};
  if (checkWin(b,humanSym))return {score:-10};
  const free=b.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
  if(!free.length) return {score:0};

  let best={score:isMax?-Infinity:Infinity,index:null};
  for(const i of free){
    const nb=[...b]; nb[i]=isMax?aiSym:humanSym;
    const res=minimax(nb,aiSym,humanSym,!isMax);
    if((isMax&&res.score>best.score)||((!isMax)&&res.score<best.score)){
      best={score:res.score,index:i};
    }
  }
  return best;
}

/* ══════════════════════════════════════════════════
   ONLİNE LOBİ SİSTEMİ (localStorage)
══════════════════════════════════════════════════ */
const XOX_LOBBY_KEY = 'gz_xox_lobbies';

function getXoxLobbies(){ try{return JSON.parse(localStorage.getItem(XOX_LOBBY_KEY)||'{}');}catch{return{};} }
function saveXoxLobbies(d){ localStorage.setItem(XOX_LOBBY_KEY,JSON.stringify(d)); }

function createXoxLobby() {
  const name = document.getElementById('xox-lobby-name').value.trim()||`${ME_X.username}'in Lobisi`;
  const pass = document.getElementById('xox-lobby-pass').value;
  const lobbies=getXoxLobbies();
  const id='XL'+Date.now();
  lobbies[id]={
    id, name, password:pass||'',
    players:[ME_X.username],
    host:ME_X.username,
    board:Array(9).fill(null),
    turn:'X', status:'waiting',
    moves:[], createdAt:Date.now()
  };
  saveXoxLobbies(lobbies);
  activeLobbyId=id; mySlot=1;
  showXoxWaiting(id);
}

function refreshXoxLobbies() {
  const c=document.getElementById('xox-lobby-list'); if(!c) return;
  const lobbies=getXoxLobbies();
  const list=Object.values(lobbies).filter(l=>l.status==='waiting');
  c.innerHTML='';
  if(!list.length){c.innerHTML='<p class="no-lobbies-msg">Lobi yok.</p>';return;}
  list.forEach(l=>{
    const full=l.players.length>=2;
    const row=document.createElement('div');
    row.className='lobby-row';
    row.innerHTML=`
      <div class="lobby-row-info">
        <div class="lobby-row-name">${l.password?'<i class="fa-solid fa-lock lobby-lock-icon"></i>':''} ${escH(l.name)}</div>
        <div class="lobby-row-sub">Host: ${escH(l.host)}</div>
      </div>
      <div class="lobby-row-actions">
        <span class="player-count-badge">${l.players.length}/2</span>
        ${full?'<span class="lobby-full-badge">DOLU</span>'
              :`<button class="btn btn-primary btn-sm" onclick="joinXoxLobby('${l.id}',${!!l.password})">Katıl</button>`}
      </div>`;
    c.appendChild(row);
  });
}

function joinXoxById() {
  const id=document.getElementById('xox-join-id').value.trim();
  if(!id){gz_toast('ID girin!','error');return;}
  joinXoxLobby(id, !!getXoxLobbies()[id]?.password);
}

function joinXoxLobby(id, locked) {
  if(locked){
    const pass=prompt('Lobi şifresi:'); if(pass===null) return;
    if(getXoxLobbies()[id]?.password!==pass){gz_toast('Şifre yanlış!','error');return;}
  }
  const lobbies=getXoxLobbies(), lobby=lobbies[id];
  if(!lobby){gz_toast('Lobi bulunamadı.','error');return;}
  if(lobby.status!=='waiting'){gz_toast('Lobi dolu veya oyun başladı.','error');return;}
  if(lobby.players.length>=2){gz_toast('Lobi dolu!','error');return;}
  if(!lobby.players.includes(ME_X.username)) lobby.players.push(ME_X.username);
  saveXoxLobbies(lobbies);
  activeLobbyId=id; mySlot=2;
  showXoxWaiting(id);
}

function deleteXoxLobby(id){
  const d=getXoxLobbies(); delete d[id]; saveXoxLobbies(d);
}

function showXoxWaiting(id) {
  showXoxScreen('xox-waiting');
  renderXoxWaiting(id);
  startXoxPoll(id);
}

function renderXoxWaiting(id) {
  const l=getXoxLobbies()[id]; if(!l) return;
  document.getElementById('xox-wait-title').textContent=l.name;
  document.getElementById('xox-share-id').textContent=id;
  document.getElementById('xox-wait-sub').textContent=l.players.length<2?'Rakip bekleniyor...':'Hazır!';

  const pWrap=document.getElementById('xox-wait-players');
  pWrap.innerHTML='';
  [0,1].forEach(i=>{
    const p=l.players[i];
    const d=document.createElement('div'); d.className='xox-wait-slot';
    d.innerHTML=`
      <div class="xox-wait-av ${p?'filled':''}" style="${p?`background:linear-gradient(135deg,${i===0?'#7c3aed,#a855f7':'#0891b2,#06b6d4'})`:''}">
        ${p?p.slice(0,2).toUpperCase():'?'}
      </div>
      <div class="xox-wait-name">${p||'Bekleniyor...'}</div>
      ${l.host===p?'<div class="wait-badge host-badge">HOST</div>':''}`;
    pWrap.appendChild(d);
  });

  const canStart=l.players.length===2&&l.host===ME_X.username;
  const btn=document.getElementById('xox-start-btn');
  if(btn) btn.disabled=!canStart;
}

function copyXoxId(){
  const id=document.getElementById('xox-share-id').textContent;
  navigator.clipboard?.writeText(id).then(()=>gz_toast('Kopyalandı!','success')).catch(()=>gz_toast('ID: '+id,'info'));
}

function startXoxPoll(id){
  clearInterval(pollTimer);
  pollTimer=setInterval(()=>{
    const l=getXoxLobbies()[id]; if(!l){clearInterval(pollTimer);xoxQuit();return;}
    renderXoxWaiting(id);
    /* Host başlattı, ben 2. oyuncuyum */
    if(l.status==='playing'&&l.host!==ME_X.username){
      clearInterval(pollTimer); launchOnlineGame(id);
    }
    /* Hamle geldi mi? */
    if(l.status==='playing'&&gameMode==='online'&&!gameOver){
      syncOnlineBoard(l);
    }
  },800);
}

function startXoxFromLobby(){
  const lobbies=getXoxLobbies(), l=lobbies[activeLobbyId];
  if(!l||l.players.length<2){gz_toast('Rakip gerekli!','error');return;}
  l.status='playing'; l.board=Array(9).fill(null); l.turn='X'; l.moves=[];
  saveXoxLobbies(lobbies);
  clearInterval(pollTimer);
  launchOnlineGame(activeLobbyId);
}

function launchOnlineGame(id){
  const l=getXoxLobbies()[id]; if(!l) return;
  gameMode='online';
  mySlot= l.host===ME_X.username?1:2;
  mySymbol= mySlot===1?'X':'O';
  scores={X:0,O:0,draw:0}; round=1;
  const p1n=l.players[0]||'P1', p2n=l.players[1]||'P2';
  initGame(p1n,p2n,'X','O');
  startXoxPoll(id);
}

function leaveXoxLobby(){
  clearInterval(pollTimer);
  const lobbies=getXoxLobbies(), l=lobbies[activeLobbyId];
  if(l){
    l.players=l.players.filter(p=>p!==ME_X.username);
    if(!l.players.length) delete lobbies[activeLobbyId];
    else{ l.host=l.players[0]; saveXoxLobbies(lobbies); }
    saveXoxLobbies(lobbies);
  }
  activeLobbyId=null; mySlot=null;
  showXoxScreen('xox-menu');
}

function saveXoxMove(id,idx,sym){
  const lobbies=getXoxLobbies(),l=lobbies[id]; if(!l) return;
  l.board[idx]=sym; l.turn=sym==='X'?'O':'X';
  l.moves.push({idx,sym,by:ME_X.username,at:Date.now()});
  saveXoxLobbies(lobbies);
}

function syncOnlineBoard(l){
  /* Diğer oyuncunun hamlesini board'a uygula */
  l.board.forEach((v,i)=>{
    if(v && !board[i] && !gameOver){
      board[i]=v;
      const cell=document.querySelector(`.xox-cell[data-i="${i}"]`);
      if(cell&&!cell.classList.contains('taken')){
        cell.textContent=v==='X'?'✕':'◯';
        cell.classList.add('taken',v==='X'?'x-cell':'o-cell');
      }
      const win=checkWin(board,v);
      if(win){gameOver=true;highlightWin(win);scores[v]++;setTimeout(()=>showResult(v,win,false),500);return;}
      if(board.every(c=>c)){gameOver=true;scores.draw++;setTimeout(()=>showResult(null,null,true),300);return;}
      currentTurn=v==='X'?'O':'X';
      updateTurnIndicator();
    }
  });
}

/* ══════════════════════════════════════════════════
   İSTATİSTİKLER
══════════════════════════════════════════════════ */
function renderXoxStats(){
  const bar=document.getElementById('xox-stats-bar'); if(!bar) return;
  const u=GZ.currentUser(); if(!u){bar.innerHTML='';return;}
  const s=u.stats||{};
  const games=s.xoxGames||0, wins=s.xoxWins||0, draws=s.xoxDraws||0;
  if(!games){bar.innerHTML='';return;}
  const wr=games>0?Math.round((wins/games)*100):0;
  bar.innerHTML=`
    <div class="xox-stat"><div class="xox-stat-val">${games}</div><div class="xox-stat-label">Oyun</div></div>
    <div class="xox-stat"><div class="xox-stat-val" style="color:var(--green)">${wins}</div><div class="xox-stat-label">Galibiyet</div></div>
    <div class="xox-stat"><div class="xox-stat-val" style="color:var(--muted2)">${draws}</div><div class="xox-stat-label">Beraberlik</div></div>
    <div class="xox-stat"><div class="xox-stat-val" style="color:var(--gold)">${wr}%</div><div class="xox-stat-label">Kazanma %</div></div>`;
}

function escH(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ══ INIT ══ */
showXoxScreen('xox-menu');
renderXoxStats();
