import { ref, computed } from 'vue';

const usuario = ref({
  nombre: 'Estudiante',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  xp: 1200, racha: 3, ranking: 12, ultimaFecha: '',
  stats: { quizzes: 0, perfectos: 0, bugs: 0, blancos: 0, carreras: 0, teclas: 0 },
});
const usuarioLogueado = ref(false);

const hoyStr = (d = new Date()) => d.toLocaleDateString('en-CA');

function registrarActividad() {
  const u = usuario.value, hoy = hoyStr();
  if (u.ultimaFecha === hoy) return;
  if (u.ultimaFecha)
    u.racha = u.ultimaFecha === hoyStr(new Date(Date.now() - 864e5)) ? u.racha + 1 : 1;
  u.ultimaFecha = hoy;
}

function sumarXP(n, stat) {
  usuario.value.xp += n;
  if (stat) usuario.value.stats[stat]++;
  registrarActividad();
  guardarUsuario();
}

function guardarUsuario() {
  localStorage.setItem('eduquest_user', JSON.stringify(usuario.value));
}

function cargarUsuario() {
  const saved = localStorage.getItem('eduquest_user');
  if (!saved) return;
  const g = JSON.parse(saved);
  usuario.value = { ...usuario.value, ...g, stats: { ...usuario.value.stats, ...(g.stats || {}) } };
  usuarioLogueado.value = true;
}

function cerrarSesion() {
  usuarioLogueado.value = false;
  localStorage.removeItem('eduquest_user');
}

const nivelActual = computed(() => Math.floor(usuario.value.xp / 100) + 1);
const rango = computed(() =>
  nivelActual.value < 3 ? 'Aprendiz' : nivelActual.value < 6 ? 'Explorador' : 'Maestro'
);

export function useUsuario() {
  return {
    usuario, usuarioLogueado, nivelActual, rango,
    sumarXP, guardarUsuario, cargarUsuario, cerrarSesion, registrarActividad,
  };
}