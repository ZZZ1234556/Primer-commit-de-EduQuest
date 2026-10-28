export const catalog = [
  // Siempre disponibles
  { id: 'potion', name: 'Poción de impulso', type: 'potion', icon: 'bulb', price: 100, rarity: 'CONSUMIBLE', boost: 5, always: true, desc: 'Duplica los próximos 5 premios de XP. Se activa al usarla.' },
  { id: 'chest', name: 'Cofre de suministros', type: 'chest', icon: 'folder', price: 160, rarity: 'SORPRESA', always: true, desc: 'Incluye 40–90 de oro y una poción o accesorio aleatorio. Duplicados: +80 de oro.' },
  // Consumible rotativo
  { id: 'potion-mega', name: 'Elixir mega', type: 'potion', icon: 'flame', price: 220, rarity: 'ÉPICO', boost: 10, desc: 'Duplica los próximos 10 premios de XP. Se activa al usarlo.' },
  // Marcos
  { id: 'frame-mint', name: 'Menta suave', type: 'frame', icon: 'gem', price: 90, rarity: 'COMÚN', desc: 'Marco verde menta, fresco y limpio.' },
  { id: 'frame-rose', name: 'Rubor rosa', type: 'frame', icon: 'heart', price: 90, rarity: 'COMÚN', desc: 'Marco rosa suave para tu avatar.' },
  { id: 'frame-lime', name: 'Circuito de élite', type: 'frame', icon: 'gem', price: 180, rarity: 'RARO', desc: 'Marco verde de circuito para tu avatar.' },
  { id: 'frame-fire', name: 'Aura de fuego', type: 'frame', icon: 'flame', price: 200, rarity: 'RARO', desc: 'Un marco ardiente que no pasa desapercibido.' },
  { id: 'frame-ice', name: 'Escarcha eterna', type: 'frame', icon: 'spark', price: 200, rarity: 'RARO', desc: 'Marco helado con destellos azules.' },
  { id: 'frame-neon', name: 'Neón violeta', type: 'frame', icon: 'spark', price: 300, rarity: 'ÉPICO', desc: 'Marco de neón que brilla en la oscuridad.' },
  { id: 'frame-gold', name: 'Corona solar', type: 'frame', icon: 'spark', price: 350, rarity: 'ÉPICO', desc: 'Un marco dorado para destacar en tu perfil.' },
  { id: 'frame-rainbow', name: 'Arcoíris', type: 'frame', icon: 'star', price: 600, rarity: 'LEGENDARIO', desc: 'Marco multicolor animado. Solo para los mejores.' },
  // Títulos
  { id: 'title-bug', name: 'Cazador de bugs', type: 'title', icon: 'bug', price: 150, rarity: 'RARO', desc: 'Título que presume tu puntería contra los errores.' },
  { id: 'title-speed', name: 'Rayo del teclado', type: 'title', icon: 'keyboard', price: 150, rarity: 'RARO', desc: 'Título para los dedos más rápidos.' },
  { id: 'title', name: 'Leyenda del código', type: 'title', icon: 'trophy', price: 240, rarity: 'ÉPICO', desc: 'Título exclusivo debajo de tu nombre.' },
  { id: 'title-sage', name: 'Sabio del quiz', type: 'title', icon: 'book', price: 260, rarity: 'ÉPICO', desc: 'Título para quien nunca falla una pregunta.' },
  { id: 'title-champ', name: 'Campeón de EduQuest', type: 'title', icon: 'medal', price: 500, rarity: 'LEGENDARIO', desc: 'El título más difícil de conseguir.' },
  // Avatares
  { id: 'avatar-robot', name: 'Robo-Mate', type: 'avatar', icon: 'user', price: 140, rarity: 'RARO', img: '/avatars/robot.svg', desc: 'Un robot amigable listo para estudiar contigo.' },
  { id: 'avatar-fox', name: 'Zorro Pixel', type: 'avatar', icon: 'user', price: 140, rarity: 'RARO', img: '/avatars/fox.svg', desc: 'Un zorro astuto en estilo pixel.' },
  { id: 'avatar', name: 'Guardián de la arena', type: 'avatar', icon: 'user', price: 120, rarity: 'RARO', img: '/avatars/guardian.svg', desc: 'Desbloquea y equipa el avatar exclusivo Guardián.' },
  { id: 'avatar-astro', name: 'Astro-Cadete', type: 'avatar', icon: 'user', price: 260, rarity: 'ÉPICO', img: '/avatars/astro.svg', desc: 'Explorador espacial con casco de burbuja.' },
  { id: 'avatar-dragon', name: 'Dragón Byte', type: 'avatar', icon: 'user', price: 450, rarity: 'LEGENDARIO', img: '/avatars/dragon.svg', desc: 'Un dragón de código con escamas de bits.' },
];

// ---- Tienda rotativa: cambia cada 5 horas (igual para todos los jugadores) ----
export const ROTATION_MS = 5 * 60 * 60 * 1000;
export const ROTATION_SIZE = 6;
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shopOffer(now = Date.now()) {
  const slot = Math.floor(now / ROTATION_MS);
  const rnd = seeded(Math.imul(slot, 2654435761));
  const pool = catalog.filter(i => !i.always);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { slot, endsAt: (slot + 1) * ROTATION_MS, items: [...catalog.filter(i => i.always), ...pool.slice(0, ROTATION_SIZE)] };
}
export function milestones(xp) {
  const count = Math.max(12, Math.ceil((xp + 500) / 250));
  return Array.from({ length: count }, (_, i) => ({ id: String((i + 1) * 250), xp: (i + 1) * 250, chest: i % 2 === 1, gold: 75 + Math.floor(i / 4) * 25 }));
}
export const achievements = [
  { id: 'first', icon: 'star', name: 'Primer paso', desc: 'Completa un quiz.', stat: 'quizzes', target: 1, gold: 60 },
  { id: 'xp500', icon: 'rocket', name: 'Calentando motores', desc: 'Consigue 500 XP.', stat: 'xp', target: 500, gold: 80 },
  { id: 'quiz5', icon: 'book', name: 'Estudiante constante', desc: 'Completa 5 quizzes.', stat: 'quizzes', target: 5, gold: 90 },
  { id: 'perfect', icon: 'quiz', name: 'Sin fallos', desc: 'Consigue un quiz perfecto.', stat: 'perfectos', target: 1, gold: 120 },
  { id: 'bugs', icon: 'bug', name: 'Cazabugs', desc: 'Atrapa 10 bugs.', stat: 'bugs', target: 10, gold: 100 },
  { id: 'aim', icon: 'target', name: 'Puntería de élite', desc: 'Acierta 10 blancos.', stat: 'blancos', target: 10, gold: 100 },
  { id: 'race', icon: 'racer', name: 'Pole position', desc: 'Gana una carrera de código.', stat: 'carreras', target: 1, gold: 100 },
  { id: 'keys', icon: 'keyboard', name: 'Teclado de acero', desc: 'Gana una carrera de teclas.', stat: 'teclas', target: 1, gold: 100 },
  { id: 'xp', icon: 'flame', name: 'Imparable', desc: 'Consigue 2.000 XP.', stat: 'xp', target: 2000, gold: 200 },
  { id: 'perfect5', icon: 'medal', name: 'Mente brillante', desc: 'Consigue 5 quizzes perfectos.', stat: 'perfectos', target: 5, gold: 200 },
  { id: 'bugs50', icon: 'bug', name: 'Exterminador', desc: 'Atrapa 50 bugs.', stat: 'bugs', target: 50, gold: 200 },
  { id: 'aim50', icon: 'target', name: 'Francotirador', desc: 'Acierta 50 blancos.', stat: 'blancos', target: 50, gold: 200 },
  { id: 'race5', icon: 'car', name: 'Piloto veterano', desc: 'Gana 5 carreras de código.', stat: 'carreras', target: 5, gold: 180 },
  { id: 'keys5', icon: 'keyboard', name: 'Dedos veloces', desc: 'Gana 5 carreras de teclas.', stat: 'teclas', target: 5, gold: 180 },
  { id: 'quiz20', icon: 'pad', name: 'Maratón de saber', desc: 'Completa 20 quizzes.', stat: 'quizzes', target: 20, gold: 220 },
  { id: 'hoop1', icon: 'ball', name: 'Primera canasta', desc: 'Anota una canasta en Baloncesto de Código.', stat: 'canastas', target: 1, gold: 100 },
  { id: 'hoop25', icon: 'ball', name: 'Máximo anotador', desc: 'Anota 25 canastas.', stat: 'canastas', target: 25, gold: 250 },
  { id: 'xp5000', icon: 'trophy', name: 'Leyenda viviente', desc: 'Consigue 5.000 XP.', stat: 'xp', target: 5000, gold: 400 },
  { id: 'xp10000', icon: 'gem', name: 'Élite de EduQuest', desc: 'Consigue 10.000 XP.', stat: 'xp', target: 10000, gold: 700 },
];
export function initialProgress(xp = 0, stats = {}) {
  return { xp, gold: 150, chests: 1, inventory: {}, equipped: { frame: '', title: '', avatar: '' }, boost: 0, claimed: [], achievements: [], stats, requests: [] };
}
export function applyAction(state, action, random = Math.random, now = Date.now()) {
  const p = structuredClone(state);
  let loot = null;
  const fail = (message) => { throw new Error(message); };
  if (action.type === 'award') {
    if (!Number.isInteger(action.xp) || action.xp < 0 || action.xp > 500 || ![null, 'quizzes', 'bugs', 'blancos', 'carreras', 'teclas', 'canastas'].includes(action.stat ?? null)) fail('Premio no válido.');
    const multiplier = p.boost > 0 && action.xp > 0 ? 2 : 1;
    p.xp += action.xp * multiplier;
    if (multiplier === 2) p.boost--;
    p.gold += Math.ceil(action.xp / 5);
    if (action.stat) p.stats[action.stat] = (p.stats[action.stat] || 0) + 1;
    if (action.stat === 'quizzes' && action.perfect === true) p.stats.perfectos = (p.stats.perfectos || 0) + 1;
  } else if (action.type === 'claim') {
    const m = milestones(p.xp).find(m => m.id === action.id);
    if (!m || p.xp < m.xp || p.claimed.includes(m.id)) fail('Esta recompensa todavía no está disponible o ya fue reclamada.');
    p.claimed.push(m.id);
    if (m.chest) p.chests++; else p.gold += m.gold;
  } else if (action.type === 'achievement') {
    const a = achievements.find(a => a.id === action.id);
    if (!a || (a.stat === 'xp' ? p.xp : p.stats[a.stat] || 0) < a.target || p.achievements.includes(a.id)) fail('Logro no disponible.');
    p.achievements.push(a.id); p.gold += a.gold;
  } else if (action.type === 'buy') {
    const item = catalog.find(i => i.id === action.id);
    if (!item) fail('Objeto desconocido.');
    if (!shopOffer(now).items.some(i => i.id === item.id) && !shopOffer(now - 120000).items.some(i => i.id === item.id)) fail('Este objeto ya no está en la tienda. Vuelve cuando rote.');
    if (p.gold < item.price) fail('Necesitas más oro para comprar este objeto.');
    if (!['potion', 'chest'].includes(item.type) && p.inventory[item.id]) fail('Ya tienes este accesorio.');
    p.gold -= item.price;
    if (item.type === 'chest') p.chests++; else p.inventory[item.id] = (p.inventory[item.id] || 0) + 1;
  } else if (action.type === 'equip') {
    const item = catalog.find(i => i.id === action.id);
    if (!item || !p.inventory[item.id] || !['frame', 'title', 'avatar'].includes(item.type)) fail('No tienes este accesorio.');
    p.equipped[item.type] = p.equipped[item.type] === item.id ? '' : item.id;
  } else if (action.type === 'potion') {
    const pot = catalog.find(i => i.id === (action.id || 'potion') && i.type === 'potion');
    if (!pot || !p.inventory[pot.id] || p.boost > 0) fail('Necesitas una poción y ningún impulso activo.');
    p.inventory[pot.id]--; p.boost = pot.boost;
  } else if (action.type === 'open') {
    if (p.chests < 1) fail('No tienes cofres disponibles.');
    p.chests--;
    const gold = 40 + Math.floor(random() * 51);
    const drops = ['potion', ...catalog.filter(i => !i.always && i.type !== 'potion').map(i => i.id)];
    const id = drops[Math.floor(random() * drops.length)];
    const duplicate = id !== 'potion' && !!p.inventory[id];
    p.gold += gold + (duplicate ? 80 : 0);
    if (!duplicate) p.inventory[id] = (p.inventory[id] || 0) + 1;
    loot = { gold: gold + (duplicate ? 80 : 0), item: catalog.find(i => i.id === id).name, duplicate };
  } else fail('Acción desconocida.');
  return { progress: p, loot };
}
