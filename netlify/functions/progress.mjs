// Backend de recompensas: POST /api/progress
// Identifica al jugador con una cookie anónima y guarda su progreso en Netlify Blobs.
import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { applyAction, initialProgress } from '../../public/economy-rules.js';

const COOKIE = 'eq_sid';
const PROJECT = process.env.FIREBASE_PROJECT_ID || 'eduquest-20d0e';
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
// Devuelve el uid de Firebase, null si no hay token, o 'invalid' si el token es falso/caducado.
async function uidFrom(req) {
  const h = req.headers.get('authorization') || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(h.slice(7), JWKS, { issuer: 'https://securetoken.google.com/' + PROJECT, audience: PROJECT });
    return payload.sub || 'invalid';
  } catch { return 'invalid'; }
}
const UUID = /^[0-9a-f-]{36}$/i;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

function readCookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

const cleanStats = (s) => {
  const out = {};
  for (const k of ['quizzes', 'perfectos', 'bugs', 'blancos', 'carreras', 'teclas', 'canastas']) {
    const v = Number(s?.[k]);
    out[k] = Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), 100000) : 0;
  }
  return out;
};

async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);

  let action;
  try { action = await req.json(); } catch { return json({ error: 'Petición no válida.' }, 400); }
  if (!action || typeof action.type !== 'string') return json({ error: 'Petición no válida.' }, 400);

  const uid = await uidFrom(req);
  if (uid === 'invalid') return json({ error: 'Sesión no válida. Vuelve a iniciar sesión.' }, 401);
  let sid = uid ? 'u_' + uid : readCookie(req, COOKIE);
  const isNew = !sid || (!uid && !UUID.test(sid));
  if (isNew) sid = randomUUID();
  const setCookie = uid ? '' : `${COOKIE}=${sid}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${new URL(req.url).protocol === 'https:' ? '; Secure' : ''}`;
  const headers = uid ? {} : { 'Set-Cookie': setCookie };

  const store = getStore({ name: 'eduquest-progress', consistency: 'strong' });
  let record = await store.get(sid, { type: 'json' });

  try {
    if (action.type === 'init') {
      if (!record) {
        const xp = Math.min(Math.max(parseInt(action.legacyXP, 10) || 0, 0), 100000);
        record = { progress: initialProgress(xp, cleanStats(action.legacyStats)), done: [] };
        await store.setJSON(sid, record);
      }
      return json({ progress: record.progress }, 200, headers);
    }

    if (!record) return json({ error: 'Progreso no iniciado.' }, 400, headers);

    // Idempotencia: si el requestId ya se procesó, devuelve el estado actual.
    const rid = typeof action.requestId === 'string' ? action.requestId.slice(0, 64) : null;
    if (rid && record.done.includes(rid)) return json({ progress: record.progress, loot: null }, 200, headers);

    const { progress, loot } = applyAction(record.progress, action);
    record = { progress, done: rid ? [...record.done, rid].slice(-50) : record.done };
    await store.setJSON(sid, record);
    return json({ progress, loot }, 200, headers);
  } catch (e) {
    return json({ error: e.message || 'No se pudo guardar el progreso.' }, 400, headers);
  }
}

export default async (req) => {
  try { return await handler(req); }
  catch (e) {
    console.error('progress error:', e);
    return json({ error: 'El servidor de progreso falló: ' + (e.message || 'error desconocido') }, 500);
  }
};

export const config = { path: '/api/progress' };
