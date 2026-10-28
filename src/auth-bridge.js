// Conecta Firebase Auth con index.html (que usa Vue por CDN).
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth } from './firebase.js';

const api = {
  onChange: (cb) => onAuthStateChanged(auth, cb),
  login: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
  async register(email, pass, nombre) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    try { await updateProfile(cred.user, { displayName: nombre }); } catch {}
    return cred;
  },
  logout: () => signOut(auth),
  reset: (email) => sendPasswordResetEmail(auth, email),
  token: async () => (auth.currentUser ? auth.currentUser.getIdToken() : null),
};
window.EduAuth = api;
window.__eduAuthResolve(api);
