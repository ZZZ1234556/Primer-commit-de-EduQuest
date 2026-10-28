<template>
  <div class="flex-1 px-4 sm:px-8 pb-8 flex justify-center mt-4">
    <div class="w-full max-w-4xl">
      <button @click="$emit('salir')" class="text-sm font-bold text-gray-500 hover:text-brandOrange mb-4"><Ic n="back" /> Salir</button>
      <div class="bg-white rounded-3xl p-5 sm:p-8 card-shadow border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <span class="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs"><Ic n="flag" /> Vas {{ 1 + car.bots.filter(b => b > car.yo).length }}º</span>
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
          <div v-if="car.cuenta > 0 || car.ya" class="absolute inset-0 z-10 flex items-center justify-center bg-black/25">
            <span :key="car.cuenta" class="cuenta">{{ car.cuenta > 0 ? car.cuenta : '¡YA!' }}</span>
          </div>
        </div>

        <template v-if="!car.fin">
          <div class="bg-gray-900 text-orange-300 font-mono font-bold rounded-xl p-4 text-base sm:text-lg overflow-x-auto mb-4">{{ car.q }}</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-for="(o, i) in car.opts" :key="i" @click="responder(i)" :disabled="car.sel !== null"
              class="text-left p-3 rounded-xl border-2 font-bold font-mono text-sm transition-all duration-150"
              :class="clase(i)">{{ o.t }}</button>
          </div>
        </template>
        <div v-else class="text-center py-2">
          <Ic n="medal" class="w-16 h-16 mx-auto text-yellow-400" />
          <h2 class="text-2xl font-black text-gray-800 mb-1">¡Llegaste en {{ car.pos }}º lugar!</h2>
          <p class="text-gray-500 font-semibold mb-5">+{{ car.xp }} XP · {{ car.aciertos }} aciertos</p>
          <button @click="reiniciar" class="bg-brandOrange text-white font-black py-2 px-6 rounded-xl mr-2">Correr otra vez</button>
          <button @click="$emit('salir')" class="bg-gray-800 text-white font-black py-2 px-6 rounded-xl">Salir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import Ic from '../components/Ic.vue';
import { TIRO_DATA, PREGUNTAS_DATA, mezclar } from '../data/quizData';
import { useUsuario } from '../composables/useUsuario';

defineEmits(['salir']);
const { sumarXP } = useUsuario();
const VEL = [0.9, 1.5, 2.1, 2.8, 3.6, 4.5];
const pool = () => mezclar([...TIRO_DATA, ...PREGUNTAS_DATA.map(p => ({ q: p.pregunta, ok: p.opciones[p.correcta], mal: p.opciones.filter((_, i) => i !== p.correcta) }))]);

const car = ref({ yo: 0, bots: [0, 0], nivel: 1, cuenta: 3, ya: false, fin: false, pos: 0, xp: 0, aciertos: 0, q: '', opts: [], sel: null, bloqueo: false, llegaron: [], pool: [], k: 0 });
const carriles = computed(() => [
  { e: 'car', c: 'text-sky-500', p: car.value.bots[0] },
  { e: 'car', c: 'text-emerald-500', p: car.value.bots[1] },
  { e: 'racer', c: 'text-orange-500', p: car.value.yo, yo: true },
]);
let timer = null, pausa = null, acum = 0;

function pregunta() {
  const c = car.value;
  if (c.k >= c.pool.length) { c.pool = pool(); c.k = 0; }
  const r = c.pool[c.k++];
  c.q = r.q; c.opts = mezclar([r.ok, ...r.mal]).map(t => ({ t, ok: t === r.ok })); c.sel = null; c.bloqueo = false;
}
function clase(i) {
  const c = car.value;
  if (c.sel === null) return 'border-gray-200 hover:border-brandOrange hover:bg-orange-50 text-gray-700';
  if (c.opts[i].ok) return 'border-green-500 bg-green-50 text-green-700';
  if (i === c.sel) return 'border-red-500 bg-red-50 text-red-700';
  return 'border-gray-200 opacity-40 text-gray-400';
}
function responder(i) {
  const c = car.value;
  if (c.bloqueo || c.cuenta > 0 || c.fin) return;
  c.sel = i; c.bloqueo = true;
  if (c.opts[i].ok) { c.nivel = Math.min(5, c.nivel + 1); c.aciertos++; }
  else c.nivel = Math.max(0, c.nivel - 2);
  pausa = setTimeout(() => { if (!c.fin) pregunta(); }, 700);
}
function tick() {
  const c = car.value, dt = 0.05;
  if (c.fin) return;
  if (c.cuenta > 0) {
    acum += dt;
    if (acum >= 0.8) { acum = 0; if (--c.cuenta === 0) { c.ya = true; setTimeout(() => (c.ya = false), 700); } }
    return;
  }
  c.yo = Math.min(100, c.yo + VEL[c.nivel] * dt);
  [2.1, 2.7].forEach((v, k) => {
    if (c.bots[k] >= 100) return;
    c.bots[k] = Math.min(100, c.bots[k] + v * dt * (0.8 + Math.random() * 0.4));
    if (c.bots[k] >= 100) c.llegaron.push(k);
  });
  if (c.yo >= 100) terminar();
}
function terminar() {
  const c = car.value;
  c.fin = true; clearInterval(timer);
  c.pos = c.llegaron.length + 1;
  c.xp = [40, 25, 10][c.pos - 1] + c.aciertos * 2;
  sumarXP(c.xp, c.pos === 1 ? 'carreras' : null);
}
function iniciar() {
  clearInterval(timer); clearTimeout(pausa);
  car.value = { yo: 0, bots: [0, 0], nivel: 1, cuenta: 3, ya: false, fin: false, pos: 0, xp: 0, aciertos: 0, q: '', opts: [], sel: null, bloqueo: false, llegaron: [], pool: pool(), k: 0 };
  pregunta(); acum = 0; timer = setInterval(tick, 50);
}
function reiniciar() { iniciar(); }

iniciar();
onUnmounted(() => { clearInterval(timer); clearTimeout(pausa); });
</script>