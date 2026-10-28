window.createRewards = function(Vue, usuario) {
  const { ref, computed } = Vue;
  const progress = ref(null), catalog = ref([]), achievements = ref([]), busy = ref(false), error = ref(''), notice = ref(''), loot = ref(null), opening = ref(false), chestDialog = ref(false);
  const now = ref(Date.now()), rulesReady = ref(false);
  setInterval(() => { now.value = Date.now(); }, 30000);
  let rules, queue = [], running = false, initPromise;
  const offer = computed(() => rulesReady.value ? rules.shopOffer(now.value) : { items: [], endsAt: 0, slot: 0 });
  const shopCountdown = computed(() => {
    const ms = Math.max(0, offer.value.endsAt - now.value);
    const h = Math.floor(ms / 3600000), m = Math.ceil((ms % 3600000) / 60000);
    return h > 0 ? h + ' h ' + (m === 60 ? 0 : m) + ' min' : m + ' min';
  });
  const itemOf = (id) => id ? catalog.value.find(i => i.id === id) : undefined;
  const ready = computed(() => !!progress.value && !busy.value && !error.value);
  const path = computed(() => rules && progress.value ? rules.milestones(progress.value.xp) : []);
  const next = computed(() => path.value.find(m => m.xp > (progress.value?.xp || 0)));
  let local = false;
  const lsKey = () => 'eduquest_progress' + (window.__eduUid ? ':' + window.__eduUid : '');
  function apply(data) {
    progress.value = data.progress;
    usuario.value.xp = data.progress.xp;
    return data;
  }
  // Modo sin servidor: mismas reglas, guardado en este navegador.
  function localRequest(action) {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(lsKey())); } catch {}
    try {
      if (action.type === 'init') {
        if (!saved) {
          const xp = Math.min(Math.max(parseInt(action.legacyXP, 10) || 0, 0), 100000);
          saved = rules.initialProgress(xp, action.legacyStats || {});
          localStorage.setItem(lsKey(), JSON.stringify(saved));
        }
        return apply({ progress: saved });
      }
      if (!saved) throw new Error('Progreso no iniciado.');
      const { progress: next, loot } = rules.applyAction(saved, action);
      localStorage.setItem(lsKey(), JSON.stringify(next));
      return apply({ progress: next, loot });
    } catch (e) { e.status = 400; throw e; }
  }
  async function request(action) {
    if (!local) {
      try {
        let token = null;
        try { token = window.EduAuth ? await window.EduAuth.token() : null; } catch {}
        const response = await fetch('/api/progress', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(action) });
        const raw = await response.text();
        let data = null;
        try { data = raw ? JSON.parse(raw) : null; } catch {}
        if (response.ok && data && data.progress) return apply(data);
        if (data && data.error && response.status === 400) { const failure = new Error(data.error); failure.status = 400; throw failure; }
        // Sin respuesta útil (404, 500, vacío, HTML...): usar modo local.
      } catch (e) { if (e.status === 400) throw e; }
      local = true;
    }
    return localRequest(action);
  }
  function reset() { progress.value = null; queue = []; running = false; initPromise = null; local = false; error.value = ''; }
  async function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      busy.value = true; error.value = '';
      try {
        const rulesUrl = '/economy-rules.js'; rules = await import(/* @vite-ignore */ rulesUrl);
        catalog.value = rules.catalog; achievements.value = rules.achievements; rulesReady.value = true;
        await request({ type: 'init', legacyXP: usuario.value.xp, legacyStats: usuario.value.stats });
      } catch (e) { error.value = e.message || 'No hay conexión con el progreso.'; }
      finally { busy.value = false; initPromise = null; }
    })();
    return initPromise;
  }
  async function flush() {
    if (running) return;
    running = true; busy.value = true; error.value = '';
    try {
      if (!progress.value) { await init(); busy.value = true; if (!progress.value) return; }
      while (queue.length) {
        const action = queue[0];
        const data = await request(action);
        queue.shift();
        if (action.type === 'open') {
          loot.value = data.loot;
          opening.value = true;
          chestDialog.value = true;
          setTimeout(() => { opening.value = false; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1500);
        } else if (action.type !== 'award') {
          notice.value = action.type === 'buy' ? 'Compra guardada. Tu objeto está en el inventario.' : action.type === 'potion' ? '¡Impulso activado! Próximos 5 premios de XP al doble.' : action.type === 'equip' ? 'Perfil actualizado.' : '¡Recompensa guardada en tu inventario!';
        }
      }
    } catch (e) {
      if (e.status === 400) { queue.shift(); await init(); }
      error.value = e.message || 'No hay conexión. Tu acción está pendiente; pulsa Reintentar.';
    }
    finally { running = false; busy.value = false; }
  }
  function act(type, id) {
    if (!ready.value) return;
    notice.value = '';
    queue.push({ type, id, requestId: crypto.randomUUID() });
    flush();
  }
  function award(xp, stat, perfect = false) {
    queue.push({ type: 'award', xp, stat: stat || null, perfect, requestId: crypto.randomUUID() });
    flush();
  }
  async function retry() { error.value = ''; if (!progress.value) await init(); if (queue.length) await flush(); }
  function achievementValue(a) { return a.stat === 'xp' ? progress.value?.xp || 0 : progress.value?.stats[a.stat] || 0; }
  return { offer, shopCountdown, itemOf, progress, catalog, achievements, busy, error, notice, loot, opening, chestDialog, ready, path, next, init, reset, act, award, retry, achievementValue };
};
