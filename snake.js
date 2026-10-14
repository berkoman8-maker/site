/* =====================================================
   SNAKE.JS — GlitchGrid Yılan (Google Snake tarzı)
   - Smooth grid hareketi
   - Animasyonlu yılan karakteri (göz kırpma, dil)
   - Özel yemler, seviye, tema, mobil swipe+dpad
   - Lobi: 2 kişi aynı klavyede veya solo
===================================================== */
if (!GZ.requireAuth()) throw '';
const ME_S = GZ.currentUser();
GZ.renderNavbar('snake');

/* ══ AYARLAR ══ */
let CFG = { speed:10, gridSize:20, theme:'classic', wallMode:'death' };

document.querySelectorAll('#speed-opts  .opt-btn').forEach(b=>b.addEventListener('click',()=>{ setOpt('speed-opts',b);  CFG.speed    =+b.dataset.val; }));
document.querySelectorAll('#size-opts   .opt-btn').forEach(b=>b.addEventListener('click',()=>{ setOpt('size-opts',b);   CFG.gridSize =+b.dataset.val; }));
document.querySelectorAll('#theme-opts  .opt-btn').forEach(b=>b.addEventListener('click',()=>{ setOpt('theme-opts',b);  CFG.theme    = b.dataset.val; }));
document.querySelectorAll('#wall-opts   .opt-btn').forEach(b=>b.addEventListener('click',()=>{ setOpt('wall-opts',b);   CFG.wallMode = b.dataset.val; }));
function setOpt(g,b){ document.querySelectorAll(`#${g} .opt-btn`).forEach(x=>x.classList.remove('active')); b.classList.add('active'); }

/* ══ TEMALAR (Google Snake renk paleti ilhamı) ══ */
const THEMES = {
  classic:{
    bg:'#0a1a0a', grid1:'#0d1f0d', grid2:'#0c1e0c',
    head:'#4ade80', body:'#22c55e', bodyDark:'#16a34a', tail:'#14532d',
    border:'#86efac', eyeWhite:'#fff', eyePupil:'#14532d',
    food:'#ef4444', foodGlow:'rgba(239,68,68,.55)',
    special:'#f59e0b', specialGlow:'rgba(245,158,11,.55)',
    wallColor:'rgba(74,222,128,.25)',
  },
  neon:{
    bg:'#07070f', grid1:'#0d0d1a', grid2:'#0c0c18',
    head:'#d946ef', body:'#a855f7', bodyDark:'#7c3aed', tail:'#4c1d95',
    border:'#f0abfc', eyeWhite:'#fff', eyePupil:'#4c1d95',
    food:'#06b6d4', foodGlow:'rgba(6,182,212,.55)',
    special:'#f472b6', specialGlow:'rgba(244,114,182,.55)',
    wallColor:'rgba(168,85,247,.25)',
  },
  lava:{
    bg:'#1a0800', grid1:'#220b00', grid2:'#1e0a00',
    head:'#fb923c', body:'#f97316', bodyDark:'#c2410c', tail:'#7c2d12',
    border:'#fdba74', eyeWhite:'#fff', eyePupil:'#7c2d12',
    food:'#facc15', foodGlow:'rgba(250,204,21,.55)',
    special:'#f87171', specialGlow:'rgba(248,113,113,.55)',
    wallColor:'rgba(249,115,22,.25)',
  },
  ice:{
    bg:'#050e1f', grid1:'#071228', grid2:'#061020',
    head:'#7dd3fc', body:'#38bdf8', bodyDark:'#0284c7', tail:'#075985',
    border:'#bae6fd', eyeWhite:'#fff', eyePupil:'#075985',
    food:'#f472b6', foodGlow:'rgba(244,114,182,.55)',
    special:'#a5f3fc', specialGlow:'rgba(165,243,252,.55)',
    wallColor:'rgba(56,189,248,.25)',
  },
};

/* ══ YEM TİPLERİ ══ */
const FOOD_TYPES = [
  { type:'apple',  emoji:'🍎', label:'Elma',     points:10, chance:.50, effect:null      },
  { type:'cherry', emoji:'🍒', label:'Kiraz',    points:15, chance:.18, effect:null      },
  { type:'star',   emoji:'⭐', label:'Yıldız',   points:30, chance:.10, effect:'gold'   },
  { type:'bolt',   emoji:'⚡', label:'Hız',      points:15, chance:.08, effect:'speed'  },
  { type:'ice',    emoji:'🧊', label:'Buz',      points:15, chance:.07, effect:'slow'   },
  { type:'gem',    emoji:'💎', label:'2x',       points:5,  chance:.05, effect:'2x'     },
  { type:'scissors',emoji:'✂️',label:'Kısalt',  points:20, chance:.02, effect:'shrink' },
];

/* ══ CANVAS ══ */
const canvas = document.getElementById('snakeCanvas');
const ctx    = canvas.getContext('2d');

let GRID, CELL;

/* ══ OYUN STATE ══ */
let snake, dir, nextDir, food, specialFood;
let score, level, eaten;
let running, paused;
let loopTimer, animFrameId;
let speedMult=1, doubleScore=false, effectTimer=null;
let frameCount=0, blinkTimer=0, tongueOut=false, tongueTimer=0;

/* Smooth hareket için interpolasyon */
let progress   = 0;   // 0→1 arası adım ilerlemesi
let lastStep   = 0;   // son step zamanı (ms)
let stepInterval = 100; // ms, hıza göre güncellenir

/* Touch */
let touchStartX=0, touchStartY=0;

/* ══ BAŞLAT ══ */
function startSnake() {
  showSnakeScreen('snake-game');

  GRID = CFG.gridSize;
  const wrap = canvas.parentElement;
  const size = Math.min((wrap.clientWidth||560), 560);
  CELL = Math.floor(size / GRID);
  canvas.width  = GRID * CELL;
  canvas.height = GRID * CELL;
  canvas.style.width  = '';
  canvas.style.height = '';

  const sx = Math.floor(GRID/2), sy = Math.floor(GRID/2);
  snake    = [{x:sx,y:sy},{x:sx-1,y:sy},{x:sx-2,y:sy}];
  dir      = {x:1,y:0};
  nextDir  = {x:1,y:0};
  score=0; level=1; eaten=0; frameCount=0;
  blinkTimer=0; tongueOut=false; tongueTimer=0;
  running=true; paused=false;
  speedMult=1; doubleScore=false;
  clearTimeout(effectTimer); specialFood=null;

  stepInterval = getInterval();
  lastStep     = performance.now();
  progress     = 0;

  placeFood();
  updateHUD();

  cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(drawLoop);

  document.getElementById('snake-best').textContent = getHighScore();
}

function getInterval() { return Math.round(1000 / (CFG.speed * speedMult)); }

function showSnakeMenu() {
  cancelAnimationFrame(animFrameId);
  running=false;
  showSnakeScreen('snake-menu');
  renderHighScores();
}

function showSnakeScreen(id) {
  document.querySelectorAll('.snake-screen').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
}

/* ══ DRAW LOOP (requestAnimationFrame — smooth) ══ */
function drawLoop(now) {
  if (!running) return;
  animFrameId = requestAnimationFrame(drawLoop);
  if (paused) return;

  const elapsed = now - lastStep;
  progress = Math.min(elapsed / stepInterval, 1);

  /* Animasyon sayaçları */
  blinkTimer++;
  tongueTimer++;
  if (blinkTimer > 180) blinkTimer=0;
  if (tongueTimer > 40 && tongueTimer < 55) tongueOut=true; else tongueOut=false;
  if (tongueTimer > 90) tongueTimer=0;

  /* Bir adım tamamlandıysa oyun mantığını çalıştır */
  if (elapsed >= stepInterval) {
    lastStep   = now - (elapsed % stepInterval);
    progress   = 0;
    gameStep();
  }

  draw(progress);
}

/* ══ OYUN MANTIĞI ══ */
function gameStep() {
  if (!running || paused) return;
  dir = {...nextDir};

  let nx = snake[0].x + dir.x;
  let ny = snake[0].y + dir.y;

  /* Duvar */
  if (CFG.wallMode === 'wrap') {
    nx = (nx+GRID)%GRID; ny = (ny+GRID)%GRID;
  } else {
    if (nx<0||nx>=GRID||ny<0||ny>=GRID) { endSnake(); return; }
  }

  /* Kendine çarpma */
  if (snake.some(s=>s.x===nx&&s.y===ny)) { endSnake(); return; }

  snake.unshift({x:nx,y:ny});

  let ate = false;
  if (food && nx===food.x && ny===food.y) {
    ate=true;
    score += food.points*(doubleScore?2:1);
    eaten++;
    applyEffect(food.effect);
    placeFood();
    if (eaten % 5 === 0) {
      level++;
      /* Her 5 yemde hızlan */
      stepInterval = Math.max(60, getInterval() - level*2);
    }
  }
  if (specialFood && nx===specialFood.x && ny===specialFood.y) {
    ate=true;
    score += specialFood.points*(doubleScore?2:1);
    eaten++;
    applyEffect(specialFood.effect);
    specialFood=null;
  }

  if (!ate) snake.pop();

  frameCount++;
  if (frameCount%45===0 && !specialFood) placeSpecialFood();

  updateHUD();
}

/* ══ YEM ══ */
function pickFoodType(forSpecial) {
  const pool = forSpecial ? FOOD_TYPES.filter(f=>f.type!=='apple'&&f.type!=='cherry') : FOOD_TYPES;
  let r=Math.random(), cum=0;
  for (const ft of pool){ cum+=ft.chance; if(r<=cum) return ft; }
  return pool[0];
}

function randomFreeCell() {
  let pos, tries=0;
  do {
    pos={x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID)};
    tries++;
  } while(snake.some(s=>s.x===pos.x&&s.y===pos.y) && tries<300);
  return pos;
}

function placeFood() {
  const pos=randomFreeCell(), ft=pickFoodType(false);
  food={...pos,...ft};
}

function placeSpecialFood() {
  const pos=randomFreeCell(), ft=pickFoodType(true);
  specialFood={...pos,...ft};
  setTimeout(()=>{specialFood=null;},7000);
}

function applyEffect(effect) {
  clearTimeout(effectTimer);
  if (!effect) return;
  switch(effect){
    case 'speed':
      speedMult=1.9; stepInterval=getInterval();
      gz_toast('⚡ Turbo! 5sn','info');
      effectTimer=setTimeout(()=>{speedMult=1;stepInterval=getInterval();},5000);
      break;
    case 'slow':
      speedMult=0.45; stepInterval=getInterval();
      gz_toast('🧊 Yavaşladın! 4sn','info');
      effectTimer=setTimeout(()=>{speedMult=1;stepInterval=getInterval();},4000);
      break;
    case 'shrink':
      const rm=Math.min(4,snake.length-2);
      for(let i=0;i<rm;i++) snake.pop();
      gz_toast('✂️ Kısaldın!','info');
      break;
    case '2x':
      doubleScore=true;
      gz_toast('💎 2x Puan! 10sn','gold');
      effectTimer=setTimeout(()=>{doubleScore=false;},10000);
      break;
    case 'gold':
      gz_toast('⭐ Bonus!','gold');
      break;
  }
}

/* ══ ÇİZİM ══ */
function draw(interp) {
  const T = THEMES[CFG.theme]||THEMES.classic;

  /* Arka plan */
  ctx.fillStyle=T.bg;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  /* Checkerboard grid (Google Snake tarzı) */
  for(let x=0;x<GRID;x++) for(let y=0;y<GRID;y++){
    ctx.fillStyle=(x+y)%2===0?T.grid1:T.grid2;
    ctx.fillRect(x*CELL,y*CELL,CELL,CELL);
  }

  /* Duvar kenarı */
  ctx.strokeStyle=T.wallColor;
  ctx.lineWidth=3;
  ctx.strokeRect(1,1,canvas.width-2,canvas.height-2);

  /* Yılan — interpolasyon ile smooth */
  drawSnake(T, interp);

  /* Yemler */
  if (food) drawFoodItem(food,T,false,interp);
  if (specialFood) drawFoodItem(specialFood,T,true,interp);
}

function drawSnake(T, interp) {
  const len = snake.length;

  snake.forEach((seg, i) => {
    const isHead = i===0;
    const isTail = i===len-1;

    /* İnterpolasyon: kafa son pozisyon → şimdiki adım arası */
    let drawX = seg.x*CELL;
    let drawY = seg.y*CELL;

    if (isHead && len>1) {
      const prev = snake[1];
      drawX = (prev.x + (seg.x-prev.x)*interp)*CELL;
      drawY = (prev.y + (seg.y-prev.y)*interp)*CELL;
    } else if (isTail && len>2) {
      const prev = snake[len-2];
      drawX = (seg.x + (prev.x-seg.x)*(1-interp))*CELL;
      drawY = (seg.y + (prev.y-seg.y)*(1-interp))*CELL;
    }

    const cx=drawX+CELL/2, cy=drawY+CELL/2;
    const r = isHead ? CELL*0.46 : CELL*0.40;

    /* Renk: kafadan kuyruğa gradient */
    const t = i/len;
    const col = isHead ? T.head : (t<0.5 ? T.body : T.bodyDark);

    /* Glow (sadece kafa) */
    if (isHead) {
      ctx.shadowColor = T.head;
      ctx.shadowBlur  = 12;
    } else {
      ctx.shadowBlur = 0;
    }

    /* Segment çiz */
    ctx.fillStyle = col;
    ctx.globalAlpha = isTail ? 0.6+0.4*interp : 1;
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur=0;

    /* Kenar çizgi */
    ctx.strokeStyle = isHead ? T.border : 'rgba(0,0,0,.2)';
    ctx.lineWidth   = isHead ? 2 : 1;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();

    ctx.globalAlpha=1;

    if (isHead) drawHeadDetails(drawX, drawY, T);
  });
}

function drawHeadDetails(bx, by, T) {
  const cx=bx+CELL/2, cy=by+CELL/2;
  const R=CELL*0.46;

  /* Parlaklık (Google Snake tarzı) */
  const shine=ctx.createRadialGradient(cx-R*.3,cy-R*.3,0,cx,cy,R);
  shine.addColorStop(0,'rgba(255,255,255,.35)');
  shine.addColorStop(.5,'rgba(255,255,255,0)');
  ctx.fillStyle=shine; ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fill();

  /* Göz pozisyonları yön göre */
  const eyeR=R*.2;
  const eyePairs=getEyePos(cx,cy,R,dir);
  eyePairs.forEach(([ex,ey])=>{
    /* Göz beyazı */
    ctx.fillStyle=T.eyeWhite;
    ctx.beginPath(); ctx.arc(ex,ey,eyeR,0,Math.PI*2); ctx.fill();
    /* Göz bebeği (yöne bak) */
    ctx.fillStyle=T.eyePupil;
    ctx.beginPath(); ctx.arc(ex+dir.x*eyeR*.45,ey+dir.y*eyeR*.45,eyeR*.52,0,Math.PI*2); ctx.fill();
    /* Göz kırpma */
    if (blinkTimer>170) {
      ctx.fillStyle=T.head;
      ctx.fillRect(ex-eyeR,ey-eyeR*.25,eyeR*2,eyeR*.6);
    }
  });

  /* Dil */
  if (tongueOut) {
    ctx.strokeStyle='#ef4444';
    ctx.lineWidth=2;
    ctx.lineCap='round';
    const lx=cx+dir.x*R*1.25, ly=cy+dir.y*R*1.25;
    ctx.beginPath(); ctx.moveTo(cx+dir.x*R*.9, cy+dir.y*R*.9);
    ctx.lineTo(lx,ly); ctx.stroke();
    const fork=R*.28;
    const px=-dir.y, py=dir.x;
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+dir.x*fork+px*fork*.6,ly+dir.y*fork+py*fork*.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+dir.x*fork-px*fork*.6,ly+dir.y*fork-py*fork*.6); ctx.stroke();
  }
}

function getEyePos(cx,cy,R,d) {
  const off=R*.5, side=R*.52;
  if (d.x===1)  return [[cx+off,cy-side],[cx+off,cy+side]];
  if (d.x===-1) return [[cx-off,cy-side],[cx-off,cy+side]];
  if (d.y===1)  return [[cx-side,cy+off],[cx+side,cy+off]];
  return [[cx-side,cy-off],[cx+side,cy-off]];
}

function drawFoodItem(f,T,isSpecial,interp) {
  const bx=f.x*CELL, by=f.y*CELL;
  const cx=bx+CELL/2, cy=by+CELL/2;
  const pulse=1+Math.sin(performance.now()*0.006)*(isSpecial?.15:.07);

  /* Glow */
  const gc=ctx.createRadialGradient(cx,cy,0,cx,cy,CELL);
  gc.addColorStop(0,isSpecial?T.specialGlow:T.foodGlow);
  gc.addColorStop(1,'transparent');
  ctx.fillStyle=gc; ctx.fillRect(bx-CELL*.3,by-CELL*.3,CELL*1.6,CELL*1.6);

  /* Emoji */
  ctx.save();
  ctx.translate(cx,cy);
  ctx.scale(pulse,pulse);
  ctx.font=`${CELL*.68}px sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(f.emoji||'🍎',0,0);
  ctx.restore();
}

/* ══ HUD ══ */
function updateHUD() {
  document.getElementById('snake-score').textContent=score;
  document.getElementById('snake-level').textContent=level;
  const best=Math.max(score,getHighScore());
  document.getElementById('snake-best').textContent=best;
}

/* ══ OYUN SONU ══ */
function endSnake() {
  running=false;
  cancelAnimationFrame(animFrameId);

  /* Ölüm animasyonu */
  let flashCount=0;
  const flashId=setInterval(()=>{
    ctx.fillStyle=`rgba(239,68,68,${flashCount%2===0?.45:0})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(++flashCount>=6) clearInterval(flashId);
  },80);

  setTimeout(()=>{
    saveScore(score);
    const reward=Math.floor(score/10)*5;
    if(reward>0){ GZ.addBalance(reward); GZ.addXP(Math.floor(score/5)); }

    document.getElementById('go-score').textContent  = score;
    document.getElementById('go-best').textContent   = getHighScore();
    document.getElementById('go-length').textContent = snake.length;
    document.getElementById('go-level').textContent  = level;
    const ge=document.getElementById('snake-go-emoji');
    ge.textContent = score>500?'🏆':score>200?'😎':score>50?'😅':'💀';
    const gt=document.getElementById('snake-go-title');
    gt.textContent = score>500?'EFSANEVİ!':score>200?'HARIKA!':score>50?'FENA DEĞİL!':'OYUN BİTTİ!';
    document.getElementById('go-reward').textContent=reward>0?`+${reward} 🪙 kazandın!`:'';
    showSnakeScreen('snake-gameover');
    if(score>200) gz_confetti(['#22c55e','#4ade80','#f59e0b']);
  },600);
}

/* ══ KONTROL ══ */
const DIRS = {
  ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
  w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0},
  W:{x:0,y:-1},S:{x:0,y:1},A:{x:-1,y:0},D:{x:1,y:0},
};
document.addEventListener('keydown',e=>{
  const nd=DIRS[e.key];
  if(nd){ e.preventDefault(); setNextDir(nd); return; }
  if([' ','Escape','p','P'].includes(e.key)){ e.preventDefault(); toggleSnakePause(); }
});
function setNextDir(nd){ if(nd.x!==-dir.x||nd.y!==-dir.y) nextDir=nd; }

function snakeTurn(direction) {
  if(!running) return;
  const map={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
  const nd=map[direction]; if(nd) setNextDir(nd);
}
function toggleSnakePause() {
  if(!running) return;
  paused=!paused;
  const btn=document.getElementById('snake-pause-btn');
  if(btn) btn.textContent=paused?'▶':'⏸';
  document.getElementById('snake-pause-overlay').classList.toggle('hidden',!paused);
  if(!paused){ lastStep=performance.now(); animFrameId=requestAnimationFrame(drawLoop); }
}
function quitSnake(){ cancelAnimationFrame(animFrameId); running=false; showSnakeMenu(); }

/* Swipe */
canvas.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;},{passive:true});
canvas.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-touchStartX, dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)<12&&Math.abs(dy)<12){ toggleSnakePause(); return; }
  if(Math.abs(dx)>Math.abs(dy)) snakeTurn(dx>0?'right':'left');
  else snakeTurn(dy>0?'down':'up');
},{passive:true});

/* ══ SKOR ══ */
function getHighScore(){ try{const a=JSON.parse(localStorage.getItem('gz_snake_scores')||'[]');return a.length?Math.max(...a.map(s=>s.score)):0;}catch{return 0;} }
function getAllScores(){ try{return JSON.parse(localStorage.getItem('gz_snake_scores')||'[]').sort((a,b)=>b.score-a.score);}catch{return[];} }
function saveScore(s){
  if(s<=0) return;
  const all=getAllScores(); all.push({score:s,name:ME_S.username,level,length:snake.length,date:Date.now()});
  localStorage.setItem('gz_snake_scores',JSON.stringify(all.sort((a,b)=>b.score-a.score).slice(0,10)));
  const u=GZ.currentUser(); if(u){u.stats=u.stats||{};u.stats.snakeBest=Math.max(u.stats.snakeBest||0,s);GZ.saveCurrentUser(u);}
}
function renderHighScores(){
  const wrap=document.getElementById('snake-highscores'); if(!wrap) return;
  const scores=getAllScores().slice(0,5);
  if(!scores.length){wrap.innerHTML='';return;}
  const medals=['🥇','🥈','🥉','4️⃣','5️⃣'];
  wrap.innerHTML=`<div class="snake-hs-title">EN YÜKSEK SKORLAR</div>`+
    scores.map((s,i)=>`<div class="snake-hs-row"><span class="snake-hs-rank">${medals[i]}</span><span class="snake-hs-name">${escH(s.name||'?')}</span><span style="font-size:.72rem;color:var(--muted2)">Lv.${s.level||1}</span><span class="snake-hs-score">${s.score}</span></div>`).join('');
}
function escH(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ══ INIT ══ */
showSnakeScreen('snake-menu');
renderHighScores();
