<template>
  <div class="flex-1 px-4 sm:px-8 pb-8 flex justify-center mt-4">
    <div class="w-full max-w-4xl">
      <button @click="$emit('salir')" class="text-sm font-bold text-gray-500 hover:text-brandOrange mb-4"><Ic n="back" /> Salir</button>
      <div class="bg-white rounded-3xl p-5 sm:p-8 card-shadow border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <span class="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">Velocidad {{ car.nivel }}</span>
          <span class="font-black text-sm text-brandOrange">{{ car.aciertos }} aciertos</span>
        </div>
        <div class="relative rounded-2xl overflow-hidden border-4 border-gray-800 mb-5">
          <div v-for="(l, k) in carriles" :key="k" class="carril relative h-16 border-b-2 border-gray-800 last:border-b-0"
            :style="{ '--v': l.yo ? (1.2 / (0.6 + car.nivel)).toFixed(2) + 's' : '0.5s' }">
            <div class="absolute top-1/2 flex items-center" :style="{ left: l.p + '%', transform: 'translate(-' + l.p + '%, -50%)' }">
              <ic :n="l.e" class="w-20 h-10" :class="l.c" />
            </div>
          </div>
          <div class="meta"></div>
        </div>
        <template v-if="!car.fin">
          <div class="bg-gray-900 rounded-xl p-4 mb-3 font-mono text-base sm:text-xl leading-relaxed whitespace-pre-wrap break-all">
            <span v-for="(ch, i) in chars" :key="i" :class="tcClase(i)">{{ ch }}</span>
          </div>
          <input ref="inp" v-model="car.escrito" @input="escribir" @paste.prevent @drop.prevent :disabled="car.cuenta > 0"
            autocomplete="off" spellcheck="false" placeholder="Escribe el código aquí..."
            class="w-full bg-yellow-50 border-2 border-gray-800 rounded-xl p-3 font-mono font-bold text-gray-800 focus:outline-none focus:border-brandOrange" />
        </template>
        <div v-else class="text-center py-2">
          <h2 class="text-2xl font-black text-gray-800 mb-1">¡Llegaste en {{ car.pos }}º lugar!</h2>
          <p class="text-gray-500 font-semibold mb-5">+{{ car.xp }} XP</p>
          <button @click="iniciar" class="bg-brandOrange text-white font-black py-2 px-6 rounded-xl mr-2">Correr otra vez</button>
          <button @click="$emit('salir')" class="bg-gray-800 text-white font-black py-2 px-6 rounded-xl">Salir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import Ic from '../components/Ic.vue';
import { TECLEO_DATA, mezclar } from '../data/quizData';
import { useUsuario } from '../composables/useUsuario';

defineEmits(['salir']);
const { sumarXP } = useUsuario();
const VEL = [0.9, 1.5, 2.1, 2.8, 3.6, 4.5];
const inp = ref(null);
const car = ref({ yo: 0, bots: [0, 0], nivel: 1, cuenta: 3, fin: false, pos: 0, xp: 0, aciertos: 0, q: '', escrito: '', prev: 0, malo: false, racha: 0, pool: [], k: 0 });
const carriles = computed(() => [
  { e: 'car', c: 'text-sky-500', p: car.value.bots[0] },
  { e: 'car', c: 'text-emerald-500', p: car.value.bots[1] },
  { e: 'racer', c: 'text-orange-500', p: car.value.yo, yo: true },
]);
const chars = computed(() => (car.value.q || '').split(''));
let timer = null, acum = 0;

function tcClase(i) {
  const c = car.value, e = c.escrito || '';
  if (i < e.length) return e[i] === c.q[i] ? 'tc-ok' : 'tc-bad';
  return i === e.length ? 'tc-cur' : 'tc-pend';
}
function siguiente() {
  const c = car.value;
  if (c.k >= c.pool.length) { c.pool = mezclar(TECLEO_DATA); c.k = 0; }
  c.q = c.pool[c.k++]; c.escrito = ''; c.prev = 0; c.malo = false;
}
function escribir() {
  const c = car.value;
  if (c.cuenta > 0 || c.fin) { c.escrito = ''; c.prev = 0; return; }
  const ok = c.q.startsWith(c.escrito), nuevas = c.escrito.length - c.prev;
  if (nuevas > 0) {
    if (ok) {
      const antes = Math.floor(c.racha / 8);
      c.racha += nuevas; c.aciertos += nuevas;
      c.nivel = Math.min(5, c.nivel + Math.floor(c.racha / 8) - antes);
    } else if (!c.malo) c.nivel = Math.max(0, c.nivel - 2), c.racha = 0;
  }
  c.malo = !ok; c.prev = c.escrito.length;
  if (c.escrito === c.q) siguiente();
}
function tick() {
  const c = car.value, dt = 0.05;
  if (c.fin) return;
  if (c.cuenta > 0) {
    acum += dt;
    if (acum >= 0.8) { acum = 0; if (--c.cuenta === 0) nextTick(() => inp.value?.focus()); }
    return;
  }
  c.yo = Math.min(100, c.yo + VEL[c.nivel] * dt);
  [2.1, 2.7].forEach((v, k) => {
    if (c.bots[k] >= 100) return;
    c.bots[k] = Math.min(100, c.bots[k] + v * dt * (0.8 + Math.random() * 0.4));
  });
  if (c.yo >= 100) terminar();
}
function terminar() {
  const c = car.value;
  c.fin = true; clearInterval(timer);
  c.pos = 1 + c.bots.filter(b => b >= 100).length;
  c.xp = [40, 25, 10][c.pos - 1] + Math.floor(c.aciertos / 10);
  sumarXP(c.xp, c.pos === 1 ? 'teclas' : null);
}
function iniciar() {
  clearInterval(timer);
  car.value = { yo: 0, bots: [0, 0], nivel: 1, cuenta: 3, fin: false, pos: 0, xp: 0, aciertos: 0, q: '', escrito: '', prev: 0, malo: false, racha: 0, pool: mezclar(TECLEO_DATA), k: 0 };
  siguiente(); acum = 0; timer = setInterval(tick, 50);
}

onMounted(iniciar);
onUnmounted(() => clearInterval(timer));
</script>