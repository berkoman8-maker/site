/* =====================================================
   SW-REGISTER.JS — Service Worker Kayıt + Güncelleme
===================================================== */
(function () {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(reg => {
      console.log('[GlitchGrid] SW kayıtlı:', reg.scope);

      /* Yeni SW bulunursa kullanıcıya bildir */
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            /* Yeni versiyon hazır → sayfayı otomatik yenile */
            console.log('[GlitchGrid] Yeni versiyon bulundu, sayfa yenileniyor...');
            newWorker.postMessage('SKIP_WAITING');
          }
        });
      });
    })
    .catch(err => console.warn('[GlitchGrid] SW kaydı başarısız:', err));

  /* SW kontrolü el değiştirince sayfayı yenile */
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
})();
