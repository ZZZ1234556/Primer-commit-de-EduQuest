<template>
  <div class="flex-1 px-8 pb-8 flex justify-center mt-4">
    <div class="w-full max-w-3xl">
      <button @click="$emit('salir')" class="text-sm font-bold text-gray-500 hover:text-brandOrange mb-4"><Ic n="back" /> Salir</button>
      <div class="bg-white rounded-3xl p-8 card-shadow border border-gray-100">
        <div class="flex justify-between items-center mb-5">
          <span class="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">Código {{ Math.min(bug.n + 1, bug.lista.length) }} de {{ bug.lista.length }}</span>
          <span class="font-bold text-sm">
            <ic v-for="n in 3" :key="n" :n="n <= bug.vidas ? 'heart' : 'heart-off'" class="w-5 h-5" />
            <span class="ml-3 font-black text-brandOrange">{{ bug.puntos }} XP</span>
          </span>
        </div>
        <template v-if="!bug.fin">
          <h2 class="text-xl font-black text-gray-800 mb-4">Escanea el código y toca la línea con el error</h2>
          <div :key="bug.n" class="scan-box relative bg-gray-900 rounded-2xl p-3 font-mono text-sm overflow-x-auto">
            <span v-if="bug.elegida !== null && bug.elegida === bugActual.bug" class="xp-float">+15 XP</span>
            <button v-for="(l, i) in bugActual.lineas" :key="bug.n + '-' + i" @click="elegir(i)" :disabled="bug.elegida !== null"
              class="linea-in block w-full text-left px-3 py-2 rounded-lg whitespace-pre transition" :style="{ animationDelay: i * 70 + 'ms' }" :class="lineaClase(i)">
              <span class="text-gray-500 mr-3 select-none">{{ i + 1 }}</span>{{ l }}
            </button>
          </div>
          <div v-if="bug.elegida !== null" class="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-sm font-bold" :class="bug.elegida === bugActual.bug ? 'text-green-500' : 'text-red-500'">
              {{ bug.elegida === bugActual.bug ? '¡Bug atrapado! +15 XP. ' : 'Ahí no era. ' }}{{ bugActual.nota }}
            </p>
            <button @click="siguiente" class="bg-brandOrange text-white font-black py-2 px-6 rounded-xl shadow hover:bg-orange-600 transition w-full sm:w-auto">
              {{ bug.vidas === 0 || bug.n === bug.lista.length - 1 ? 'Terminar' : 'Siguiente' }}
            </button>
          </div>
        </template>
        <div v-else class="text-center py-4">
          <div class="text-6xl mb-3"><Ic n="bug" /></div>
          <h2 class="text-2xl font-black text-gray-800 mb-1">{{ bug.encontrados }} bugs atrapados</h2>
          <p class="text-gray-500 font-semibold mb-6">Ganaste +{{ bug.puntos }} XP.</p>
          <button @click="reiniciar" class="bg-brandOrange text-white font-black py-2 px-6 rounded-xl shadow mr-2">Jugar de nuevo</button>
          <button @click="$emit('salir')" class="bg-gray-800 text-white font-black py-2 px-6 rounded-xl shadow">Salir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Ic from '../components/Ic.vue';
import { BUGS_DATA, mezclar } from '../data/quizData';
import { useUsuario } from '../composables/useUsuario';

defineEmits(['salir']);
const { sumarXP } = useUsuario();
const bug = ref(nuevo());
function nuevo() { return { lista: mezclar(BUGS_DATA).slice(0, 6), n: 0, vidas: 3, puntos: 0, encontrados: 0, elegida: null, fin: false }; }
const bugActual = computed(() => bug.value.lista[bug.value.n] || { lineas: [] });

function elegir(i) {
  const b = bug.value;
  if (b.elegida !== null) return;
  b.elegida = i;
  if (i === bugActual.value.bug) { b.puntos += 15; b.encontrados++; sumarXP(15, 'bugs'); }
  else b.vidas--;
}
function siguiente() {
  const b = bug.value;
  if (b.vidas === 0 || b.n === b.lista.length - 1) { b.fin = true; return; }
  b.n++; b.elegida = null;
}
function lineaClase(i) {
  const b = bug.value;
  if (b.elegida === null) return 'text-gray-100 hover:bg-gray-700';
  if (i === bugActual.value.bug) return 'bg-green-500/25 text-green-300 pulse-ok';
  return i === b.elegida ? 'bg-red-500/30 text-red-300 shake-bad' : 'text-gray-500';
}
function reiniciar() { bug.value = nuevo(); }
</script>