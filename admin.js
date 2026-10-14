/* =====================================================
   ADMIN.JS — GlitchGrid Admin Panel
   Şifreler, IP/Cihaz, Geri Bildirimler dahil
===================================================== */

function checkAdminSession() {
  if (GZ.getAdminSession()) {
    document.getElementById('admin-login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    initPanel();
  }
}

function doAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('adm-user').value.trim();
  const pass = document.getElementById('adm-pass').value;
  const err  = document.getElementById('adm-err');
  const res  = GZ.adminLogin(user, pass);
  if (!res.ok) { err.textContent = res.msg; err.classList.remove('hidden'); return; }
  err.classList.add('hidden');
  gz_toast('Giriş başarılı!', 'success');
  setTimeout(() => {
    document.getElementById('admin-login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    initPanel();
  }, 400);
}

function adminLogout() {
  GZ.clearAdminSession();
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('admin-login-screen').classList.remove('hidden');
}

function toggleAdminPass() {
  const inp = document.getElementById('adm-pass');
  const ico = document.getElementById('adm-eye');
  if (inp.type === 'password') { inp.type = 'text'; ico.className = 'fa-solid fa-eye-slash'; }
  else { inp.type = 'password'; ico.className = 'fa-solid fa-eye'; }
}

function initPanel() {
  switchTab('dashboard', document.querySelector('[data-tab="dashboard"]'));
  startClock();
}

function startClock() {
  const el = document.getElementById('topbar-time');
  const tick = () => { if (el) el.textContent = new Date().toLocaleTimeString('tr-TR'); };
  tick(); setInterval(tick, 1000);
}

/* ── Tab ── */
const TAB_TITLES = {
  dashboard:'Dashboard', players:'Oyuncular', lobbies:'Lobiler',
  inventory:'Envanterler', feedback:'Geri Bildirimler', cases:'Kasa Yönetimi', settings:'Ayarlar'
};

function switchTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.remove('hidden');
  if (btn) btn.classList.add('active');
  document.getElementById('topbar-title').textContent = TAB_TITLES[id] || id;
  if (id === 'dashboard')  renderDashboard();
  if (id === 'players')    renderPlayersTable();
  if (id === 'lobbies')    renderLobbiesTab();
  if (id === 'inventory')  renderInventoryTab();
  if (id === 'feedback')   renderFeedbackTab();
  if (id === 'cases')      { renderAdminCaseList(); }
  if (id === 'settings')   renderSettings();
}

/* ══════════════════════════════════
   DASHBOARD
══════════════════════════════════ */
function renderDashboard() {
  const users   = GZ.getUsers();
  const lobbies = GZ.getLobbies();
  const list    = Object.values(users);
  const feedbacks = GZFeedback.getAll();

  const totalBal   = list.reduce((s,u)=>s+(u.balance||0),0);
  const totalCases = list.reduce((s,u)=>s+(u.stats?.casesOpened||0),0);
  const totalGames = list.reduce((s,u)=>s+(u.stats?.footballGames||0),0);
  const bannedCnt  = list.filter(u=>u.banned).length;
  const openFB     = feedbacks.filter(f=>f.status==='open').length;

  const cards = [
    { icon:'👥', label:'Toplam Oyuncu',  val:list.length,                           bg:'rgba(124,58,237,.15)' },
    { icon:'🪙', label:'Toplam Bakiye',  val:totalBal.toLocaleString('tr-TR')+' 🪙', bg:'rgba(245,158,11,.15)' },
    { icon:'📦', label:'Açılan Case',    val:totalCases.toLocaleString('tr-TR'),     bg:'rgba(168,85,247,.15)' },
    { icon:'⚽', label:'Oynanan Maç',    val:totalGames.toLocaleString('tr-TR'),     bg:'rgba(34,197,94,.15)'  },
    { icon:'🏟', label:'Aktif Lobi',     val:Object.keys(lobbies).length,            bg:'rgba(6,182,212,.15)'  },
    { icon:'🚫', label:'Banlı Oyuncu',   val:bannedCnt,                              bg:'rgba(239,68,68,.15)'  },
    { icon:'💬', label:'Açık Bildirim',  val:openFB,                                 bg:'rgba(249,168,212,.15)'},
  ];

  document.getElementById('dash-stats').innerHTML = cards.map(c=>`
    <div class="stat-card">
      <div class="sc-icon" style="background:${c.bg}">${c.icon}</div>
      <div><div class="sc-val">${c.val}</div><div class="sc-label">${c.label}</div></div>
    </div>`).join('');

  const sorted = [...list].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,6);
  renderDashList('recent-users', sorted, u=>({ name:u.username, val:new Date(u.createdAt||0).toLocaleDateString('tr-TR'), cls:'' }));
  const rich = [...list].sort((a,b)=>(b.balance||0)-(a.balance||0)).slice(0,6);
  renderDashList('rich-users', rich, u=>({ name:u.username, val:(u.balance||0).toLocaleString('tr-TR')+' 🪙', cls:'' }));
  const casers = [...list].sort((a,b)=>(b.stats?.casesOpened||0)-(a.stats?.casesOpened||0)).slice(0,6);
  renderDashList('case-users', casers, u=>({ name:u.username, val:(u.stats?.casesOpened||0)+' case', cls:'cyan' }));
  const champs = [...list].sort((a,b)=>(b.stats?.footballWins||0)-(a.stats?.footballWins||0)).slice(0,6);
  renderDashList('win-users', champs, u=>({ name:u.username, val:(u.stats?.footballWins||0)+' galibiyet', cls:'green' }));
}

function renderDashList(elId, list, mapper) {
  const el = document.getElementById(elId);
  if (!list.length) { el.innerHTML='<p class="text-muted" style="font-size:.82rem;padding:.5rem">Veri yok.</p>'; return; }
  el.innerHTML = list.map((u,i)=>{
    const m=mapper(u);
    return `<div class="dash-row" onclick="openPlayerModal('${escHtml(u.username)}')">
      <span class="dash-row-rank">${i+1}</span>
      <div class="dash-row-av">${u.username.slice(0,2).toUpperCase()}</div>
      <span class="dash-row-name">${escHtml(u.username)}</span>
      <span class="dash-row-val ${m.cls}">${m.val}</span>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════
   OYUNCULAR TABLOSU — ŞİFRE + IP + CİHAZ
══════════════════════════════════ */
function renderPlayersTable() {
  const search = (document.getElementById('player-search')?.value||'').toLowerCase();
  const users  = GZ.getUsers();
  let list     = Object.values(users);
  if (search) list = list.filter(u=>u.username.toLowerCase().includes(search));
  list.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));

  document.getElementById('player-count').textContent = list.length + ' oyuncu';

  const tbody = document.getElementById('players-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="12" class="empty-table-msg">Oyuncu bulunamadı.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((u,i)=>{
    const deviceIcon = u.deviceType==='mobile' ? '📱' : u.deviceType==='desktop' ? '🖥️' : '❓';
    const ip         = u.lastIp || '—';
    const lastLogin  = u.lastLogin ? new Date(u.lastLogin).toLocaleString('tr-TR') : '—';
    return `
    <tr>
      <td><span style="color:var(--muted2);font-size:.78rem">${i+1}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:.5rem">
          <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--cyan));
               display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:900;color:#fff;flex-shrink:0">
            ${u.username.slice(0,2).toUpperCase()}
          </div>
          <b>${escHtml(u.username)}</b>
        </div>
      </td>
      <td style="font-family:monospace;font-size:.78rem;color:var(--muted2);max-width:120px;overflow:hidden;text-overflow:ellipsis" title="${escHtml(u.password||'')}">
        <span style="cursor:pointer;background:var(--bg3);border:1px solid var(--border);border-radius:5px;padding:.15rem .5rem"
              onclick="togglePassword(this,'${escHtml(u.password||'')}')">••••••</span>
      </td>
      <td style="font-size:.78rem;color:var(--cyan)">${ip}</td>
      <td style="font-size:1rem;text-align:center">${deviceIcon}</td>
      <td>Lv.${u.level||1}</td>
      <td class="gold-text">${(u.balance||0).toLocaleString('tr-TR')} 🪙</td>
      <td>${u.stats?.casesOpened||0}</td>
      <td style="color:var(--green)">${u.stats?.footballWins||0}</td>
      <td>
        <span class="status-badge ${u.banned?'status-banned':'status-active'}">
          ${u.banned?'🚫 Banlı':'✅ Aktif'}
        </span>
      </td>
      <td style="color:var(--muted2);font-size:.72rem;white-space:nowrap">${lastLogin}</td>
      <td>
        <div class="action-btns">
          <button class="tbl-btn tbl-btn-info"   onclick="openPlayerModal('${escHtml(u.username)}')">Detay</button>
          <button class="tbl-btn tbl-btn-warn"   onclick="adminGiveBalance('${escHtml(u.username)}')">+Bakiye</button>
          <button class="tbl-btn ${u.banned?'tbl-btn-green':'tbl-btn-danger'}"
                  onclick="${u.banned?'unbanUser':'banUser'}('${escHtml(u.username)}')">
            ${u.banned?'Unban':'Ban'}
          </button>
          <button class="tbl-btn tbl-btn-danger" onclick="deleteUser('${escHtml(u.username)}')">Sil</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* Şifre göster/gizle */
function togglePassword(el, pass) {
  if (el.dataset.shown === '1') {
    el.textContent = '••••••';
    el.dataset.shown = '0';
  } else {
    el.textContent = pass || '(boş)';
    el.dataset.shown = '1';
  }
}

/* Oyuncu tablosuna başlık güncelle */
(function patchPlayerTableHeader() {
  const thead = document.querySelector('#players-table thead tr');
  if (!thead) return;
  thead.innerHTML = `
    <th>#</th><th>Kullanıcı</th><th>Şifre</th><th>IP</th>
    <th>Cihaz</th><th>Lv</th><th>Bakiye</th><th>Case</th>
    <th>Galibiyet</th><th>Durum</th><th>Son Giriş</th><th>İşlemler</th>
  `;
})();

/* ══════════════════════════════════
   LOBİLER
══════════════════════════════════ */
function renderLobbiesTab() {
  const lobbies = GZ.getLobbies();
  const list    = Object.values(lobbies);
  const tbody   = document.getElementById('lobbies-tbody');
  const empty   = document.getElementById('lobbies-empty');

  if (!list.length) { tbody.innerHTML=''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  tbody.innerHTML = list.map(l=>`
    <tr>
      <td><code style="font-size:.72rem;color:var(--cyan)">${l.id}</code></td>
      <td><b>${escHtml(l.name)}</b></td>
      <td>${escHtml(l.host)}</td>
      <td>${l.players.map(p=>`<span>${escHtml(p)}</span>`).join(', ')} (${l.players.length}/2)</td>
      <td>${(l.settings?.time||60)/60} dk</td>
      <td>${l.settings?.goals>0?l.settings.goals+' gol':'Sınırsız'}</td>
      <td><span class="status-badge ${l.status==='playing'?'status-playing':'status-waiting'}">${l.status==='playing'?'🎮 Oyunda':'⌛ Bekliyor'}</span></td>
      <td>${l.password?'🔒 Evet':'🔓 Hayır'}</td>
      <td><button class="tbl-btn tbl-btn-danger" onclick="adminDeleteLobby('${l.id}')">Sil</button></td>
    </tr>`).join('');
}

function adminDeleteLobby(id) {
  if (!confirm('Bu lobiyi silmek istediğine emin misin?')) return;
  GZ.deleteLobby(id); gz_toast('Lobi silindi.','success'); renderLobbiesTab();
}

/* ══════════════════════════════════
   ENVANTERLER
══════════════════════════════════ */
const RARITY_COLORS_ADM = {
  common:'#64748b',uncommon:'#22c55e',rare:'#3b82f6',
  epic:'#a855f7',legendary:'#f59e0b',ancient:'#ef4444',contraband:'#ff6ef7'
};

function renderInventoryTab() {
  const search = (document.getElementById('inv-search')?.value||'').toLowerCase();
  let list = Object.values(GZ.getUsers()).filter(u=>(u.inventory||[]).length>0);
  if (search) list = list.filter(u=>u.username.toLowerCase().includes(search));

  const container = document.getElementById('inventory-panels');
  if (!list.length) { container.innerHTML='<p class="text-muted" style="padding:2rem;text-align:center">Envanterde eşya bulunamadı.</p>'; return; }

  container.innerHTML = list.map(u=>{
    const inv=u.inventory||[], total=inv.reduce((s,i)=>s+i.value,0);
    const items = inv.slice(0,20).map(item=>`
      <div class="adm-inv-item" style="border-color:${RARITY_COLORS_ADM[item.rarity]||'#444'}">
        <span class="adm-inv-emoji">${item.emoji}</span>
        <span class="adm-inv-name">${escHtml(item.name)}</span>
        <span class="adm-inv-val">${item.value.toLocaleString('tr-TR')} 🪙</span>
      </div>`).join('');
    const more = inv.length>20?`<div class="adm-inv-item" style="opacity:.6">+${inv.length-20}</div>`:'';
    return `
      <div class="inv-user-panel">
        <div class="inv-user-head">
          <div class="dash-row-av">${u.username.slice(0,2).toUpperCase()}</div>
          <span class="inv-user-name">${escHtml(u.username)}</span>
          <span class="inv-user-count">${inv.length} eşya — ${total.toLocaleString('tr-TR')} 🪙</span>
        </div>
        <div class="inv-items-grid">${items}${more}</div>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════
   GERİ BİLDİRİMLER
══════════════════════════════════ */
const FB_TYPE_LABELS  = { bug:'🐛 Hata', suggestion:'💡 Öneri', other:'📝 Diğer' };
const FB_STATUS_LABELS= { open:'🔴 Açık', read:'🟡 Okundu', resolved:'🟢 Çözüldü' };
const STARS = r => r>0 ? '⭐'.repeat(r) : '—';

function renderFeedbackTab() {
  const typeFilter   = document.getElementById('fb-filter-type')?.value || 'all';
  const statusFilter = document.getElementById('fb-filter-status')?.value || 'all';
  let list = GZFeedback.getAll();
  if (typeFilter   !== 'all') list = list.filter(f=>f.type===typeFilter);
  if (statusFilter !== 'all') list = list.filter(f=>f.status===statusFilter);

  const container = document.getElementById('feedback-list');
  const empty     = document.getElementById('feedback-empty');

  if (!list.length) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  container.innerHTML = list.map(f=>`
    <div style="background:var(--card);border:1px solid var(--border2);border-radius:14px;
                padding:1.25rem;margin-bottom:.85rem;transition:border-color .2s"
         id="fb-${f.id}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.5rem;flex-wrap:wrap">
            <span style="font-weight:700;font-size:.9rem">${FB_TYPE_LABELS[f.type]||f.type}</span>
            <span style="background:var(--bg3);border:1px solid var(--border);border-radius:5px;
                         padding:.15rem .5rem;font-size:.72rem;color:var(--muted2)">${escHtml(f.username)}</span>
            <span style="font-size:.75rem;color:var(--muted)">${new Date(f.time).toLocaleString('tr-TR')}</span>
            <span style="font-size:.82rem">${STARS(f.rating)}</span>
          </div>
          <div style="font-size:1rem;font-weight:700;color:var(--text);margin-bottom:.35rem">${escHtml(f.title)}</div>
          <div style="font-size:.88rem;color:var(--muted2);line-height:1.6">${escHtml(f.message)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.4rem;flex-shrink:0">
          <span style="font-size:.72rem;font-weight:700;padding:.2rem .6rem;border-radius:5px;
                       background:${f.status==='open'?'rgba(239,68,68,.15)':f.status==='read'?'rgba(245,158,11,.15)':'rgba(34,197,94,.15)'};
                       color:${f.status==='open'?'var(--red)':f.status==='read'?'var(--gold)':'var(--green)'}">
            ${FB_STATUS_LABELS[f.status]||f.status}
          </span>
          <div style="display:flex;gap:.35rem;flex-wrap:wrap;justify-content:flex-end">
            <button class="tbl-btn tbl-btn-info"  onclick="setFbStatus(${f.id},'read')">Okundu</button>
            <button class="tbl-btn tbl-btn-green" onclick="setFbStatus(${f.id},'resolved')">Çözüldü</button>
            <button class="tbl-btn tbl-btn-danger" onclick="deleteFeedback(${f.id})">Sil</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function setFbStatus(id, status) {
  GZFeedback.setStatus(id, status); renderFeedbackTab();
  gz_toast(`Durum "${status}" olarak işaretlendi.`, 'success');
}
function deleteFeedback(id) {
  if (!confirm('Bu geri bildirimi silmek istediğine emin misin?')) return;
  GZFeedback.delete(id); renderFeedbackTab();
  gz_toast('Silindi.', 'success');
}

/* ══════════════════════════════════
   AYARLAR
══════════════════════════════════ */
function renderSettings() {
  const users   = GZ.getUsers();
  const lobbies = GZ.getLobbies();
  const list    = Object.values(users);
  const totalInv= list.reduce((s,u)=>s+(u.inventory||[]).length,0);
  document.getElementById('sys-info').innerHTML = [
    ['Toplam Oyuncu',     list.length],
    ['Aktif Lobi',        Object.keys(lobbies).length],
    ['Toplam Envanter',   totalInv+' eşya'],
    ['Geri Bildirim',     GZFeedback.getAll().length],
    ['localStorage KB',   (new Blob([JSON.stringify(localStorage)]).size/1024).toFixed(1)+' KB'],
    ['Tarih',             new Date().toLocaleDateString('tr-TR')],
    ['Saat',              new Date().toLocaleTimeString('tr-TR')],
  ].map(([k,v])=>`
    <div class="sys-info-row"><span>${k}</span><span>${v}</span></div>`).join('');
}

function giveBalance() {
  const username=document.getElementById('give-user').value.trim();
  const amount=parseInt(document.getElementById('give-amount').value);
  if (!username||!amount||amount<1){gz_toast('Kullanıcı ve miktar girin!','error');return;}
  const users=GZ.getUsers(), user=users[username];
  if(!user){gz_toast('Oyuncu bulunamadı.','error');return;}
  user.balance=(user.balance||0)+amount;
  GZ.saveUsers(users);
  gz_toast(`${username} kullanıcısına ${amount.toLocaleString()} 🪙 verildi!`,'gold');
  document.getElementById('give-user').value='';
  document.getElementById('give-amount').value='';
}

function adminGiveBalance(username) {
  const amount=parseInt(prompt(`${username} kullanıcısına kaç 🪙 vermek istiyorsun?`));
  if(!amount||amount<1) return;
  const users=GZ.getUsers();
  if(!users[username]){gz_toast('Oyuncu bulunamadı.','error');return;}
  users[username].balance=(users[username].balance||0)+amount;
  GZ.saveUsers(users);
  gz_toast(`${username} → +${amount.toLocaleString()} 🪙`,'gold');
  renderPlayersTable();
}

function deleteUser(username) {
  const uname=username||document.getElementById('del-user')?.value?.trim();
  if(!uname){gz_toast('Kullanıcı adı girin!','error');return;}
  if(!confirm(`"${uname}" silinecek! Geri alınamaz!`)) return;
  const users=GZ.getUsers();
  if(!users[uname]){gz_toast('Oyuncu bulunamadı.','error');return;}
  delete users[uname];
  GZ.saveUsers(users);
  gz_toast(`${uname} silindi.`,'success');
  if(document.getElementById('del-user')) document.getElementById('del-user').value='';
  renderPlayersTable(); renderDashboard();
}

function banUser(username) {
  const users=GZ.getUsers();if(!users[username])return;
  users[username].banned=true;GZ.saveUsers(users);
  gz_toast(`${username} banlandi. 🚫`,'error');renderPlayersTable();
}
function unbanUser(username) {
  const users=GZ.getUsers();if(!users[username])return;
  users[username].banned=false;GZ.saveUsers(users);
  gz_toast(`${username} banı kaldırıldı. ✅`,'success');renderPlayersTable();
}
function clearAllLobbies() {
  const cnt=Object.keys(GZ.getLobbies()).length;
  if(!confirm(`${cnt} lobiyi silmek istediğine emin misin?`))return;
  GZ.saveLobbies({});gz_toast('Tüm lobiler silindi.','success');renderLobbiesTab();
}
function resetAllStats() {
  if(!confirm('TÜM oyuncuların istatistikleri sıfırlanacak!'))return;
  const users=GZ.getUsers();
  Object.values(users).forEach(u=>{u.stats={casesOpened:0,footballWins:0,footballGames:0,totalGoals:0,totalEarned:0,rebirths:0};});
  GZ.saveUsers(users);gz_toast('Sıfırlandı.','info');renderDashboard();
}

/* ══════════════════════════════════
   OYUNCU DETAY MODAL — IP + CİHAZ + ŞİFRE
══════════════════════════════════ */
function openPlayerModal(username) {
  const users=GZ.getUsers(), u=users[username];
  if(!u) return;
  document.getElementById('modal-title').textContent='👤 '+u.username;

  const inv=u.inventory||[], invTotal=inv.reduce((s,i)=>s+i.value,0);
  const xpNeeded=(u.level||1)*500;
  const xpPct=Math.min(100,Math.round(((u.xp||0)/xpNeeded)*100));
  const deviceIcon=u.deviceType==='mobile'?'📱':u.deviceType==='desktop'?'🖥️':'❓';
  const lastLogin=u.lastLogin?new Date(u.lastLogin).toLocaleString('tr-TR'):'—';
  const loginHistory=u.loginHistory||[];

  const invHtml=inv.slice(0,12).map(item=>`
    <div class="adm-inv-item" style="border-color:${RARITY_COLORS_ADM[item.rarity]||'#444'}">
      <span class="adm-inv-emoji">${item.emoji}</span>
      <span class="adm-inv-name" style="font-size:.62rem">${escHtml(item.name)}</span>
      <span class="adm-inv-val">${item.value.toLocaleString()}🪙</span>
    </div>`).join('');

  const historyHtml = loginHistory.length ? loginHistory.slice(0,5).map(h=>`
    <div style="display:flex;gap:.65rem;align-items:center;padding:.4rem .65rem;
                background:var(--bg3);border-radius:7px;font-size:.75rem;color:var(--muted2);margin-bottom:.3rem">
      <span>${h.device==='mobile'?'📱':'🖥️'}</span>
      <span style="flex:1">${new Date(h.time).toLocaleString('tr-TR')}</span>
      <span style="color:var(--cyan)">${h.ip||'IP yok'}</span>
    </div>`).join('') : '<p style="font-size:.78rem;color:var(--muted)">Giriş geçmişi yok.</p>';

  document.getElementById('modal-body').innerHTML = `
    <!-- Temel istatistikler -->
    <div class="modal-stat-grid">
      <div class="modal-stat"><div class="modal-stat-label">Bakiye</div>
        <div class="modal-stat-val" style="color:var(--gold)">${(u.balance||0).toLocaleString('tr-TR')} 🪙</div></div>
      <div class="modal-stat"><div class="modal-stat-label">Seviye</div>
        <div class="modal-stat-val">Lv.${u.level||1}</div></div>
      <div class="modal-stat"><div class="modal-stat-label">XP</div>
        <div class="modal-stat-val">${u.xp||0}/${xpNeeded}</div></div>
      <div class="modal-stat"><div class="modal-stat-label">Rebirth</div>
        <div class="modal-stat-val" style="color:var(--gold)">${u.rebirth||0}x</div></div>
      <div class="modal-stat"><div class="modal-stat-label">Açılan Case</div>
        <div class="modal-stat-val">${u.stats?.casesOpened||0}</div></div>
      <div class="modal-stat"><div class="modal-stat-label">Galibiyet</div>
        <div class="modal-stat-val" style="color:var(--green)">${u.stats?.footballWins||0}</div></div>
    </div>

    <!-- Güvenlik bilgileri -->
    <div style="background:var(--bg3);border-radius:12px;padding:.85rem;margin-bottom:1rem">
      <div style="font-size:.72rem;font-weight:700;color:var(--muted2);letter-spacing:1px;margin-bottom:.6rem">🔐 GÜVENLİK</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;font-size:.82rem">
        <div><span style="color:var(--muted2)">Şifre: </span>
          <span style="font-family:monospace;cursor:pointer;background:var(--bg2);padding:.1rem .4rem;border-radius:4px"
                onclick="this.textContent=this.textContent==='••••••'?'${escHtml(u.password||'')}':'••••••'">••••••</span>
        </div>
        <div><span style="color:var(--muted2)">Son IP: </span>
          <span style="color:var(--cyan)">${u.lastIp||'—'}</span></div>
        <div><span style="color:var(--muted2)">Cihaz: </span>
          <span>${deviceIcon} ${u.deviceType||'—'}</span></div>
        <div><span style="color:var(--muted2)">Durum: </span>
          <span style="color:${u.banned?'var(--red)':'var(--green)'}">${u.banned?'🚫 Banlı':'✅ Aktif'}</span></div>
        <div style="grid-column:1/-1"><span style="color:var(--muted2)">Son Giriş: </span>${lastLogin}</div>
        <div style="grid-column:1/-1;font-size:.7rem;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
             title="${escHtml(u.userAgent||'')}">
          UA: ${escHtml((u.userAgent||'').slice(0,60))}${u.userAgent?.length>60?'…':''}
        </div>
      </div>
    </div>

    <!-- Giriş geçmişi -->
    <div style="margin-bottom:1rem">
      <div style="font-size:.72rem;font-weight:700;color:var(--muted2);letter-spacing:1px;margin-bottom:.5rem">📋 GİRİŞ GEÇMİŞİ (Son 5)</div>
      ${historyHtml}
    </div>

    <!-- Envanter özeti -->
    ${inv.length>0?`
    <div style="font-size:.78rem;font-weight:700;color:var(--text);margin-bottom:.5rem">
      🎒 Envanter (${inv.length} eşya — ${invTotal.toLocaleString()} 🪙)
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(85px,1fr));gap:.4rem;margin-bottom:1rem">
      ${invHtml}
      ${inv.length>12?`<div class="adm-inv-item" style="opacity:.5;display:flex;align-items:center;justify-content:center;font-size:.72rem">+${inv.length-12}</div>`:''}
    </div>`:''}

    <!-- Aksiyonlar -->
    <div style="display:flex;gap:.6rem;flex-wrap:wrap">
      <button class="btn btn-gold btn-sm" onclick="adminGiveBalance('${escHtml(username)}');closeModal()">+Bakiye</button>
      <button class="btn btn-sm ${u.banned?'btn-green':'btn-red'}"
              onclick="${u.banned?'unbanUser':'banUser'}('${escHtml(username)}');closeModal();renderPlayersTable()">
        ${u.banned?'✅ Unban':'🚫 Ban'}
      </button>
      <button class="btn btn-red btn-sm" onclick="deleteUser('${escHtml(username)}');closeModal()">
        <i class="fa-solid fa-trash"></i> Sil
      </button>
    </div>
  `;
  document.getElementById('player-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('player-modal').classList.add('hidden'); }
document.getElementById('player-modal')?.addEventListener('click', function(e) { if (e.target===this) closeModal(); });

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ── Başlat ── */
checkAdminSession();


/* ══════════════════════════════════════════════════
   KASA YÖNETİMİ
══════════════════════════════════════════════════ */

const TIER_LABELS = {
  basic:'Temel', premium:'Premium', elite:'Elit', legendary:'Efsanevi',
  ultra:'Ultra', mythic:'Mitik', divine:'İlahi', special:'Özel', event:'Etkinlik'
};

const RARITY_LIST = ['common','uncommon','rare','epic','legendary','ancient','contraband'];
const RARITY_NAMES = {
  common:'Normal', uncommon:'Nadir', rare:'Epik', epic:'Süper Epik',
  legendary:'Efsanevi', ancient:'Antik', contraband:'Yasaklı'
};

let editingCaseId = null; // düzenleme modunda hangi kasa
let caseItemsTemp = [];   // form'daki geçici eşya listesi

/* Admin kasalarını getir */
function getAdminCases() {
  try { return JSON.parse(localStorage.getItem('gz_admin_cases') || '[]'); }
  catch { return []; }
}
function saveAdminCases(list) {
  localStorage.setItem('gz_admin_cases', JSON.stringify(list));
}

/* Tab açılınca render et */
const _origST_cases = switchTab;
// switchTab zaten admin.js içinde tanımlı, override yapamayız
// Bunun yerine tab-cases içeriğini initPanel'de ekle
// admin.js'deki switchTab fonksiyonuna 'cases' dalı ekleyelim
// — bunu sonundaki init çağrısında değiştireceğiz

/* Eşya Ekle (form'a satır ekler) */
function addCaseItem(item) {
  const idx  = caseItemsTemp.length;
  const data = item || { name:'', emoji:'✨', rarity:'common', value:100 };
  caseItemsTemp.push(data);

  const container = document.getElementById('ca-items-list');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'ca-item-row';
  row.id = 'ca-item-' + idx;
  row.innerHTML = `
    <input class="gz-input" style="width:28%" placeholder="Eşya adı" value="${escHtml(data.name)}"
           oninput="caseItemsTemp[${idx}].name=this.value"/>
    <input class="gz-input" style="width:8%;text-align:center" placeholder="🎁" value="${escHtml(data.emoji)}"
           oninput="caseItemsTemp[${idx}].emoji=this.value"/>
    <select class="gz-input" style="width:22%;padding-left:.5rem"
            onchange="caseItemsTemp[${idx}].rarity=this.value">
      ${RARITY_LIST.map(r=>`<option value="${r}" ${r===data.rarity?'selected':''}>${RARITY_NAMES[r]}</option>`).join('')}
    </select>
    <input class="gz-input" style="width:22%" type="number" min="1" placeholder="Değer" value="${data.value}"
           oninput="caseItemsTemp[${idx}].value=+this.value"/>
    <button class="tbl-btn tbl-btn-danger" onclick="removeCaseItem(${idx})" style="flex-shrink:0">✕</button>
  `;
  container.appendChild(row);
}

function removeCaseItem(idx) {
  caseItemsTemp.splice(idx, 1);
  renderCaseItemRows();
}

function renderCaseItemRows() {
  const container = document.getElementById('ca-items-list');
  if (!container) return;
  container.innerHTML = '';
  const savedItems = [...caseItemsTemp];
  caseItemsTemp = [];
  savedItems.forEach(item => addCaseItem(item));
}

/* Kasayı kaydet */
function saveAdminCase() {
  const name  = document.getElementById('ca-name')?.value.trim();
  const emoji = document.getElementById('ca-emoji')?.value.trim() || '📦';
  const price = parseInt(document.getElementById('ca-price')?.value) || 0;
  const desc  = document.getElementById('ca-desc')?.value.trim() || '';
  const tier  = document.getElementById('ca-tier')?.value || 'elite';
  const glow  = document.getElementById('ca-glow')?.value.trim() || 'rgba(124,58,237,.4)';

  if (!name)        { gz_toast('Kasa adı girin!', 'error'); return; }
  if (price < 1)    { gz_toast('Geçerli bir fiyat girin!', 'error'); return; }
  if (caseItemsTemp.length < 3) { gz_toast('En az 3 eşya gerekli!', 'error'); return; }

  const invalidItem = caseItemsTemp.find(it => !it.name || !it.value || it.value < 1);
  if (invalidItem)  { gz_toast('Tüm eşyaların adı ve değeri olmalı!', 'error'); return; }

  const cases = getAdminCases();
  const id    = editingCaseId || ('admin_' + Date.now());

  const caseObj = {
    id, tier, tierLabel: TIER_LABELS[tier] || 'ÖZEL',
    name, emoji, price,
    glowColor: glow,
    desc,
    items: caseItemsTemp.map(it => ({ ...it })),
    _adminCreated: true,
  };

  const existIdx = cases.findIndex(c => c.id === id);
  if (existIdx >= 0) cases[existIdx] = caseObj;
  else               cases.push(caseObj);

  saveAdminCases(cases);
  gz_toast(`"${name}" kasası kaydedildi! ✅`, 'success');
  clearCaseForm();
  renderAdminCaseList();
}

/* Formu temizle */
function clearCaseForm() {
  editingCaseId = null;
  caseItemsTemp = [];
  ['ca-name','ca-emoji','ca-price','ca-desc','ca-glow'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sel = document.getElementById('ca-tier');
  if (sel) sel.value = 'elite';
  const container = document.getElementById('ca-items-list');
  if (container) container.innerHTML = '';
}

/* Admin kasa listesini render et */
function renderAdminCaseList() {
  const cases = getAdminCases();
  const container = document.getElementById('admin-case-list');
  const countEl   = document.getElementById('admin-case-count');
  if (!container) return;
  if (countEl) countEl.textContent = cases.length + ' kasa';

  if (!cases.length) {
    container.innerHTML = '<p class="empty-table-msg">Henüz admin kasası yok.</p>';
    return;
  }

  container.innerHTML = cases.map(c => `
    <div class="admin-case-row" style="border-left:3px solid ${c.glowColor||'var(--primary)'}">
      <div class="acr-icon">${c.emoji}</div>
      <div class="acr-info">
        <div class="acr-name">${escHtml(c.name)}</div>
        <div class="acr-sub">
          <span class="case-card-tier tier-${c.tier}" style="font-size:.6rem">${c.tierLabel}</span>
          <span style="color:var(--gold);font-size:.78rem">${(c.price||0).toLocaleString('tr-TR')} 🪙</span>
          <span style="color:var(--muted2);font-size:.72rem">${(c.items||[]).length} eşya</span>
        </div>
      </div>
      <div class="acr-actions">
        <button class="tbl-btn tbl-btn-info"   onclick="editAdminCase('${c.id}')">Düzenle</button>
        <button class="tbl-btn tbl-btn-danger" onclick="deleteAdminCase('${c.id}')">Sil</button>
      </div>
    </div>
  `).join('');
}

/* Kasayı düzenle */
function editAdminCase(id) {
  const cases = getAdminCases();
  const c     = cases.find(x => x.id === id);
  if (!c) return;

  editingCaseId = id;
  document.getElementById('ca-name').value  = c.name  || '';
  document.getElementById('ca-emoji').value = c.emoji || '📦';
  document.getElementById('ca-price').value = c.price || 0;
  document.getElementById('ca-desc').value  = c.desc  || '';
  document.getElementById('ca-tier').value  = c.tier  || 'elite';
  document.getElementById('ca-glow').value  = c.glowColor || '';

  caseItemsTemp = [];
  const container = document.getElementById('ca-items-list');
  if (container) container.innerHTML = '';
  (c.items || []).forEach(item => addCaseItem(item));

  gz_toast(`"${c.name}" düzenleniyor...`, 'info');
  // Forma scroll
  document.getElementById('ca-name')?.scrollIntoView({ behavior:'smooth' });
}

/* Kasayı sil */
function deleteAdminCase(id) {
  const cases = getAdminCases();
  const c     = cases.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`"${c.name}" kasasını silmek istediğine emin misin?`)) return;
  const updated = cases.filter(x => x.id !== id);
  saveAdminCases(updated);
  gz_toast(`"${c.name}" silindi.`, 'success');
  if (editingCaseId === id) clearCaseForm();
  renderAdminCaseList();
}

/* Tab geçişinde kasa yönetimini yükle */
const _origSwitchTabAdmin = switchTab;
// switchTab'ı extend edelim (admin.js'deki mevcut fonksiyon üzerine)
// Mevcut switchTab'a cases dalı ekleyelim
const __switchTabOriginal = window.switchTab || switchTab;
window.switchTab = function(id, btn) {
  __switchTabOriginal(id, btn);
  if (id === 'cases') {
    renderAdminCaseList();
    // İlk eşya satırını ekle
    if (caseItemsTemp.length === 0 && !document.querySelector('#ca-items-list .ca-item-row')) {
      addCaseItem();
    }
  }
};
