/* =====================================================
   AUTH.JS — GlitchGrid Hesap Sistemi (localStorage)
===================================================== */

/* ── Admin sabitleri ── */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Berkan123!';

const GZ = {
  // ── Tüm kullanıcıları al ──────────────────────────
  getUsers() {
    return JSON.parse(localStorage.getItem('gz_users') || '{}');
  },
  saveUsers(users) {
    localStorage.setItem('gz_users', JSON.stringify(users));
  },

  // ── Oturum ──────────────────────────────────────
  getSession() {
    return localStorage.getItem('gz_session') || null;
  },
  setSession(username) {
    localStorage.setItem('gz_session', username);
  },
  clearSession() {
    localStorage.removeItem('gz_session');
  },

  // ── Admin oturum ────────────────────────────────
  getAdminSession() {
    return localStorage.getItem('gz_admin_session') || null;
  },
  setAdminSession() {
    localStorage.setItem('gz_admin_session', '1');
  },
  clearAdminSession() {
    localStorage.removeItem('gz_admin_session');
  },

  // ── Aktif kullanıcı ─────────────────────────────
  currentUser() {
    const u = this.getSession();
    if (!u) return null;
    const users = this.getUsers();
    return users[u] || null;
  },

  // ── Kullanıcıyı güncelle ─────────────────────────
  saveCurrentUser(data) {
    const u = this.getSession();
    if (!u) return;
    const users = this.getUsers();
    users[u] = data;
    this.saveUsers(users);
  },

  // ── Kayıt ol ─────────────────────────────────────
  register(username, password) {
    username = username.trim();
    if (!username || !password) return { ok: false, msg: 'Kullanıcı adı ve şifre gerekli.' };
    if (username.length < 3)    return { ok: false, msg: 'Kullanıcı adı en az 3 karakter olmalı.' };
    if (username.length > 20)   return { ok: false, msg: 'Kullanıcı adı en fazla 20 karakter.' };
    if (password.length < 4)    return { ok: false, msg: 'Şifre en az 4 karakter olmalı.' };
    if (username.toLowerCase() === 'admin') return { ok: false, msg: 'Bu kullanıcı adı kullanılamaz.' };
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return { ok: false, msg: 'Sadece harf, rakam ve _ kullanabilirsin.' };

    const users = this.getUsers();
    if (users[username]) return { ok: false, msg: 'Bu kullanıcı adı zaten alınmış.' };

    users[username] = {
      username,
      password,
      createdAt: Date.now(),
      balance: 1000,
      level: 1,
      xp: 0,
      banned: false,
      rebirth: 0,
      inventory: [],
      stats: {
        casesOpened: 0,
        footballWins: 0,
        footballGames: 0,
        totalGoals: 0,
        totalEarned: 0,
        rebirths: 0,
      }
    };
    this.saveUsers(users);
    return { ok: true };
  },

  // ── Giriş yap ────────────────────────────────────
  login(username, password) {
    username = username.trim();
    const users = this.getUsers();
    const user = users[username];
    if (!user) return { ok: false, msg: 'Kullanıcı bulunamadı.' };
    if (user.password !== password) return { ok: false, msg: 'Şifre hatalı.' };
    if (user.banned) return { ok: false, msg: '🚫 Hesabın banlandı. Yetkili ile iletişime geç.' };
    this.setSession(username);

    // IP ve cihaz bilgisi kaydet
    this._recordLogin(username);

    return { ok: true, user };
  },

  // ── Login kaydı ──────────────────────────────────
  _recordLogin(username) {
    const users = this.getUsers();
    const user  = users[username];
    if (!user) return;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const device   = localStorage.getItem('gz_device') || (isMobile ? 'mobile' : 'desktop');
    const ua       = navigator.userAgent.slice(0, 120);

    user.lastLogin   = Date.now();
    user.deviceType  = device;
    user.userAgent   = ua;
    user.isMobile    = isMobile;

    // Login geçmişi (son 10)
    user.loginHistory = user.loginHistory || [];
    user.loginHistory.unshift({ time: Date.now(), device, ua: ua.slice(0,80) });
    if (user.loginHistory.length > 10) user.loginHistory.pop();

    users[username] = user;
    this.saveUsers(users);

    // IP'yi async al (public API)
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => {
        const u2 = this.getUsers();
        if (u2[username]) {
          u2[username].lastIp = d.ip;
          u2[username].loginHistory[0].ip = d.ip;
          this.saveUsers(u2);
        }
      })
      .catch(() => {});
  },

  // ── Admin giriş ──────────────────────────────────
  adminLogin(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      this.setAdminSession();
      return { ok: true };
    }
    return { ok: false, msg: 'Admin bilgileri hatalı.' };
  },

  // ── Çıkış yap ────────────────────────────────────
  logout() {
    this.clearSession();
    window.location.href = 'index.html';
  },

  // ── Koruma: giriş yapmamışsa yönlendir ──────────
  requireAuth() {
    if (!this.getSession()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  // ── Admin koruma ─────────────────────────────────
  requireAdmin() {
    if (!this.getAdminSession()) {
      window.location.href = 'admin.html';
      return false;
    }
    return true;
  },

  // ── Bakiye işlemleri ─────────────────────────────
  getBalance() {
    const u = this.currentUser();
    return u ? u.balance : 0;
  },
  addBalance(amount) {
    const u = this.currentUser();
    if (!u) return;
    u.balance = Math.max(0, (u.balance || 0) + amount);
    this.saveCurrentUser(u);
    this.refreshBalanceUI();
  },
  spendBalance(amount) {
    const u = this.currentUser();
    if (!u) return false;
    if (u.balance < amount) return false;
    u.balance -= amount;
    this.saveCurrentUser(u);
    this.refreshBalanceUI();
    return true;
  },
  refreshBalanceUI() {
    const el = document.getElementById('nav-balance-val');
    if (el) el.textContent = this.getBalance().toLocaleString('tr-TR');
  },

  // ── XP / Seviye ──────────────────────────────────
  addXP(amount) {
    const u = this.currentUser();
    if (!u) return;
    u.xp = (u.xp || 0) + amount;
    const needed = u.level * 500;
    if (u.xp >= needed) { u.xp -= needed; u.level++; }
    this.saveCurrentUser(u);
  },

  // ── Envanter ─────────────────────────────────────
  getInventory() {
    const u = this.currentUser();
    return u ? (u.inventory || []) : [];
  },
  addToInventory(item) {
    const u = this.currentUser();
    if (!u) return;
    u.inventory = u.inventory || [];
    u.inventory.push({ ...item, uid: Date.now() + Math.random() });
    u.stats.casesOpened = (u.stats.casesOpened || 0) + 1;
    this.saveCurrentUser(u);
  },
  removeFromInventory(uid) {
    const u = this.currentUser();
    if (!u) return null;
    const idx = u.inventory.findIndex(i => i.uid === uid);
    if (idx === -1) return null;
    const [item] = u.inventory.splice(idx, 1);
    this.saveCurrentUser(u);
    return item;
  },

  // ── Futbol istatistikleri ─────────────────────────
  recordFootballGame(won, goals) {
    const u = this.currentUser();
    if (!u) return;
    u.stats.footballGames = (u.stats.footballGames || 0) + 1;
    if (won) u.stats.footballWins = (u.stats.footballWins || 0) + 1;
    u.stats.totalGoals = (u.stats.totalGoals || 0) + goals;
    this.saveCurrentUser(u);
  },

  // ── Lobi işlemleri ───────────────────────────────
  getLobbies() {
    return JSON.parse(localStorage.getItem('gz_lobbies') || '{}');
  },
  saveLobbies(lobbies) {
    localStorage.setItem('gz_lobbies', JSON.stringify(lobbies));
  },
  createLobby(config) {
    const lobbies = this.getLobbies();
    const id = 'L' + Date.now();
    lobbies[id] = {
      id,
      name:       config.name,
      password:   config.password || '',
      host:       config.host,
      maxPlayers: 2,
      players:    [config.host],
      settings:   config.settings,
      status:     'waiting',
      createdAt:  Date.now(),
    };
    this.saveLobbies(lobbies);
    return id;
  },
  getLobby(id) {
    return this.getLobbies()[id] || null;
  },
  joinLobby(id, username) {
    const lobbies = this.getLobbies();
    const lobby = lobbies[id];
    if (!lobby) return { ok:false, msg:'Lobi bulunamadı.' };
    if (lobby.status !== 'waiting') return { ok:false, msg:'Lobi dolu veya oyun başladı.' };
    if (lobby.players.length >= 2) return { ok:false, msg:'Lobi dolu (2/2).' };
    if (!lobby.players.includes(username)) lobby.players.push(username);
    this.saveLobbies(lobbies);
    return { ok:true, lobby };
  },
  leaveLobby(id, username) {
    const lobbies = this.getLobbies();
    const lobby = lobbies[id];
    if (!lobby) return;
    lobby.players = lobby.players.filter(p => p !== username);
    if (lobby.players.length === 0) {
      delete lobbies[id];
    } else if (lobby.host === username) {
      lobby.host = lobby.players[0];
    }
    this.saveLobbies(lobbies);
  },
  deleteLobby(id) {
    const lobbies = this.getLobbies();
    delete lobbies[id];
    this.saveLobbies(lobbies);
  },

  // ── Navbar render ─────────────────────────────────
  renderNavbar(activePage) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const u = this.currentUser();
    const pages = [
      { id:'menu',    label:'Ana Menü',     href:'menu.html' },
      { id:'cases',   label:'Case Opening', href:'cases.html' },
      { id:'football',label:'Futbol',       href:'football.html' },
      { id:'snake',   label:'🐍 Yılan',     href:'snake.html' },
      { id:'xox',     label:'❌ XOX',       href:'xox.html' },
    ];
    const links = pages.map(p =>
      `<a href="${p.href}" class="nav-link${activePage===p.id?' active':''}">${p.label}</a>`
    ).join('');

    const initials = u ? u.username.slice(0,2).toUpperCase() : '??';
    navbar.innerHTML = `
      <div class="nav-brand gradient-text" onclick="window.location.href='menu.html'">GlitchGrid</div>
      <nav class="nav-links-row">${links}</nav>
      <div class="nav-right">
        <div class="nav-balance">🪙 <span id="nav-balance-val">${GZ.getBalance().toLocaleString('tr-TR')}</span></div>
        <div class="nav-user">
          <div class="nav-avatar">${initials}</div>
          <span>${u ? u.username : ''}</span>
        </div>
        <button class="nav-logout" onclick="GZ.logout()">Çıkış</button>
      </div>
    `;
  }
};

/* Navbar link stili */
const _navStyle = document.createElement('style');
_navStyle.textContent = `
  .nav-links-row { display:flex; gap:.25rem; }
  .nav-link {
    color:var(--muted2); text-decoration:none;
    padding:.35rem .9rem; border-radius:7px;
    font-weight:700; font-size:.9rem;
    transition:all .2s;
  }
  .nav-link:hover, .nav-link.active {
    color:#fff; background:rgba(124,58,237,.22);
  }
  @media(max-width:600px){ .nav-links-row { display:none; } }
`;
document.head.appendChild(_navStyle);

/* Toast */
function gz_toast(msg, type='info') {
  let t = document.getElementById('gz-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'gz-toast';
    document.body.appendChild(t);
  }
  t.className = `${type}`;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2800);
}

/* Konfeti */
function gz_confetti(colors) {
  const cols = colors || ['#f59e0b','#a855f7','#22c55e','#ef4444','#06b6d4','#ff6ef7'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    const col = cols[Math.floor(Math.random() * cols.length)];
    c.style.cssText = `
      position:fixed; top:-10px; left:${Math.random()*100}%;
      width:${Math.random()*8+4}px; height:${Math.random()*8+4}px;
      background:${col}; border-radius:${Math.random()>.5?'50%':'2px'};
      pointer-events:none; z-index:9999;
      animation:confetti-fall ${Math.random()*2+1.5}s linear ${Math.random()*.8}s forwards;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
}

/* ══════════════════════════════════════════════════
   GERİ BİLDİRİM SİSTEMİ
══════════════════════════════════════════════════ */
const GZFeedback = {
  getAll() { return JSON.parse(localStorage.getItem('gz_feedback') || '[]'); },
  save(list) { localStorage.setItem('gz_feedback', JSON.stringify(list)); },

  submit(type, title, message, rating) {
    const u    = GZ.currentUser();
    const list = this.getAll();
    list.unshift({
      id:       Date.now(),
      username: u?.username || 'Anonim',
      type,     // bug | suggestion | other
      title,
      message,
      rating,   // 1-5
      status:   'open',  // open | read | resolved
      time:     Date.now(),
    });
    this.save(list);
  },

  setStatus(id, status) {
    const list = this.getAll();
    const item = list.find(f => f.id === id);
    if (item) item.status = status;
    this.save(list);
  },

  delete(id) {
    const list = this.getAll().filter(f => f.id !== id);
    this.save(list);
  }
};
