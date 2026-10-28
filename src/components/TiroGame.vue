<template>
  <div class="flex-1 px-8 pb-8 flex justify-center mt-4">
    <div class="w-full max-w-3xl">
      <button @click="$emit('salir')" class="text-sm font-bold text-gray-500 hover:text-brandOrange mb-4"><Ic n="back" /> Salir</button>
      <div class="bg-white rounded-3xl p-8 card-shadow border border-gray-100">
        <div class="flex justify-between items-center mb-5">
          <span class="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">Ronda {{ Math.min(t.n + 1, t.lista.length) }} de {{ t.lista.length }}</span>
          <span class="font-bold text-sm"><Ic n="clock" /> {{ t.tiempo }}s · {{ t.puntos }} XP</span>
        </div>
        <template v-if="!t.fin">
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div class="h-full bg-gradient-to-r from-red-500 via-orange-400 to-green-400 transition-all duration-1000 ease-linear" :style="{ width: t.tiempo * 10 + '%' }"></div>
          </div>
          <p class="text-sm text-gray-500 font-semibold mb-2">Dispara al resultado correcto:</p>
          <div class="bg-gray-900 text-orange-300 font-mono font-bold rounded-xl p-4 text-lg overflow-x-auto">{{ lista[t.n]?.q }}</div>
          <div class="arena relative h-72 mt-5 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-orange-50 border border-orange-100">
            <button v-for="(b, i) in t.blancos" :key="t.n + '-' + i" @click="disparar(i)" class="blanco absolute"
              :class="b.estado" :style="{ left: b.x + '%', top: b.y + '%', '--dur': b.dur + 's' }"><span>{{ b.t }}</span></button>
          </div>
        </template>
        <div v-else class="text-center py-4">
          <div class="text-6xl mb-3"><Ic n="target" /></div>
          <h2 class="text-2xl font-black text-gray-800 mb-1">{{ t.aciertos }} blancos acertados</h2>
          <p class="text-gray-500 font-semibold mb-6">Ganaste +{{ t.puntos }} XP.</p>
          <button @click="reiniciar" class="bg-brandOrange text-white font-black py-2 px-6 rounded-xl mr-2">Jugar de nuevo</button>
          <button @click="$emit('salir')" class="bg-gray-800 text-white font-black py-2 px-6 rounded-xl">Salir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import Ic from '../components/Ic.vue';
import { TIRO_DATA, mezclar } from '../data/quizData';
import { useUsuario } from '../composables/useUsuario';

defineEmits(['salir']);
const { sumarXP } = useUsuario();
const lista = ref([]);
const t = ref({ n: 0, vidas: 3, puntos: 0, aciertos: 0, tiempo: 10, blancos: [], bloqueado: false, fin: false });
let timer = null, pausa = null;

function armarRonda() {
  const r = lista.value[t.value.n], xs = mezclar([4, 28, 52, 76]);
  t.value.blancos = mezclar([r.ok, ...r.mal]).map((txt, i) => ({
    t: txt, esOk: txt === r.ok, estado: '', x: xs[i], y: 8 + Math.random() * 45, dur: (2 + Math.random() * 1.8).toFixed(1),
  }));
  t.value.tiempo = 10; t.value.bloqueado = false;
}
function iniciar() {
  clearInterval(timer); clearTimeout(pausa);
  lista.value = mezclar(TIRO_DATA).slice(0, 6);
  t.value = { n: 0, vidas: 3, puntos: 0, aciertos: 0, tiempo: 10, blancos: [], bloqueado: false, fin: false };
  armarRonda();
  timer = setInterval(() => {
    const x = t.value;
    if (x.fin || x.bloqueado) return;
    if (--x.tiempo <= 0) resolver(-1);
  }, 1000);
}
function resolver(i) {
  const x = t.value;
  x.bloqueado = true;
  x.blancos.forEach((b, k) => { if (b.esOk) b.estado = 'ok'; else if (k === i) b.estado = 'mal'; });
  if (i >= 0 && x.blancos[i].esOk) { const p = 10 + Math.max(0, x.tiempo); x.puntos += p; x.aciertos++; sumarXP(p, 'blancos'); }
  else x.vidas--;
  pausa = setTimeout(() => {
    if (x.vidas === 0 || x.n === lista.value.length - 1) { x.fin = true; clearInterval(timer); return; }
    x.n++; armarRonda();
  }, 1000);
}
function disparar(i) { if (!t.value.bloqueado && !t.value.fin) resolver(i); }
function reiniciar() { iniciar(); }

iniciar();
onUnmounted(() => { clearInterval(timer); clearTimeout(pausa); });
</script>