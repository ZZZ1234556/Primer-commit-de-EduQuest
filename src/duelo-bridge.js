// Multijugador: conecta Firestore con index.html (expone window.EduDuelo).
import { doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebase.js';

const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin letras que se confunden (I, L, O, 0, 1)
const codigoAleatorio = () => Array.from({ length: 4 }, () => ALFABETO[Math.floor(Math.random() * ALFABETO.length)]).join('');
const salaRef = (code) => doc(db, 'duelos', code);
const jugadorRef = (code, uid) => doc(db, 'duelos', code, 'jugadores', uid);
const nuevoJugador = (nombre, avatar) => ({ nombre, avatar, puntos: 0, aciertos: 0, ultimaResp: -1 });

window.EduDuelo = {
  async crear(uid, nombre, avatar, preguntas) {
    for (let i = 0; i < 6; i++) {
      const code = codigoAleatorio();
      if ((await getDoc(salaRef(code))).exists()) continue;
      await setDoc(salaRef(code), { host: uid, estado: 'espera', preguntas, idx: 0, creado: Date.now(), expira: Timestamp.fromMillis(Date.now() + 24 * 3600 * 1000) });
      await setDoc(jugadorRef(code, uid), nuevoJugador(nombre, avatar));
      return code;
    }
    throw new Error('No se pudo crear la sala. Intenta otra vez.');
  },
  async unirse(code, uid, nombre, avatar) {
    code = String(code || '').trim().toUpperCase();
    const snap = await getDoc(salaRef(code));
    if (!snap.exists()) throw new Error('Esa sala no existe. Revisa el código.');
    if (snap.data().estado !== 'espera') throw new Error('Esa partida ya empezó o se cerró.');
    await setDoc(jugadorRef(code, uid), nuevoJugador(nombre, avatar));
    return code;
  },
  escuchar(code, alSala, alosJugadores) {
    const u1 = onSnapshot(salaRef(code), (s) => alSala(s.exists() ? s.data() : null));
    const u2 = onSnapshot(collection(db, 'duelos', code, 'jugadores'), (q) => alosJugadores(q.docs.map((d) => ({ uid: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  },
  actualizarSala: (code, datos) => updateDoc(salaRef(code), datos),
  actualizarJugador: (code, uid, datos) => updateDoc(jugadorRef(code, uid), datos),
  salirJugador: (code, uid) => deleteDoc(jugadorRef(code, uid)),
  cerrarSala: (code) => updateDoc(salaRef(code), { estado: 'cerrada' }),
};
