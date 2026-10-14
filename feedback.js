/* =====================================================
   FEEDBACK.JS — Geri Bildirim Widget
   Her sayfada görünür, submit GZFeedback'e kaydeder
===================================================== */

(function initFeedbackWidget() {
  let selectedType   = 'bug';
  let selectedRating = 0;

  /* ── Buton ── */
  const btn = document.createElement('button');
  btn.id = 'gz-feedback-btn';
  btn.innerHTML = '<i class="fa-solid fa-comment-dots"></i> Geri Bildirim';
  btn.onclick = openFeedback;
  document.body.appendChild(btn);

  /* ── Modal HTML ── */
  const modal = document.createElement('div');
  modal.id    = 'gz-feedback-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="feedback-card pop-in">
      <h3>
        💬 Geri Bildirim
        <button class="feedback-close" onclick="closeFeedback()">✕</button>
      </h3>

      <div class="form-field" style="margin-bottom:.75rem">
        <label style="font-size:.8rem;color:var(--muted2);font-weight:700;display:block;margin-bottom:.4rem">TÜR</label>
        <div class="feedback-types">
          <button class="fb-type-btn active" onclick="setFbType('bug',this)">🐛 Hata</button>
          <button class="fb-type-btn"        onclick="setFbType('suggestion',this)">💡 Öneri</button>
          <button class="fb-type-btn"        onclick="setFbType('other',this)">📝 Diğer</button>
        </div>
      </div>

      <div class="form-field" style="margin-bottom:.75rem">
        <label style="font-size:.8rem;color:var(--muted2);font-weight:700;display:block;margin-bottom:.4rem">BAŞLIK</label>
        <div class="input-wrap">
          <i class="fa-solid fa-heading input-icon"></i>
          <input class="gz-input" id="fb-title" placeholder="Kısaca özetle..." maxlength="60"/>
        </div>
      </div>

      <div class="form-field" style="margin-bottom:.75rem">
        <label style="font-size:.8rem;color:var(--muted2);font-weight:700;display:block;margin-bottom:.4rem">DETAY</label>
        <textarea class="gz-textarea" id="fb-message" placeholder="Ne oldu? Nasıl tekrarlanır? Ne istiyorsun?"></textarea>
      </div>

      <div class="form-field" style="margin-bottom:1.1rem">
        <label style="font-size:.8rem;color:var(--muted2);font-weight:700;display:block;margin-bottom:.4rem;text-align:center">SİTEYİ DEĞERLENDİR</label>
        <div class="feedback-stars" id="fb-stars">
          <span class="fb-star" onclick="setFbRating(1)">⭐</span>
          <span class="fb-star" onclick="setFbRating(2)">⭐</span>
          <span class="fb-star" onclick="setFbRating(3)">⭐</span>
          <span class="fb-star" onclick="setFbRating(4)">⭐</span>
          <span class="fb-star" onclick="setFbRating(5)">⭐</span>
        </div>
      </div>

      <button class="btn btn-primary btn-full" onclick="submitFeedback()">
        <i class="fa-solid fa-paper-plane"></i> Gönder
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  /* Modal dışına tıklayınca kapat */
  modal.addEventListener('click', e => { if (e.target === modal) closeFeedback(); });

  /* ── Public ── */
  window.openFeedback  = () => { modal.style.display = 'flex'; };
  window.closeFeedback = () => { modal.style.display = 'none'; };

  window.setFbType = (type, el) => {
    selectedType = type;
    modal.querySelectorAll('.fb-type-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  };

  window.setFbRating = (r) => {
    selectedRating = r;
    modal.querySelectorAll('.fb-star').forEach((s, i) => {
      s.classList.toggle('active', i < r);
    });
  };

  window.submitFeedback = () => {
    const title   = document.getElementById('fb-title').value.trim();
    const message = document.getElementById('fb-message').value.trim();
    if (!title)   { gz_toast('Başlık girin!', 'error'); return; }
    if (!message) { gz_toast('Detay girin!', 'error'); return; }

    GZFeedback.submit(selectedType, title, message, selectedRating);
    gz_toast('Geri bildirim gönderildi! Teşekkürler 🙏', 'success');
    closeFeedback();
    document.getElementById('fb-title').value   = '';
    document.getElementById('fb-message').value = '';
    selectedRating = 0;
    modal.querySelectorAll('.fb-star').forEach(s => s.classList.remove('active'));
  };
})();
