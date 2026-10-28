<template>
  <div class="flex-1 px-8 pb-8 flex justify-center mt-4">
    <div class="w-full max-w-3xl">
      <button @click="$emit('salir')" class="text-sm font-bold text-gray-500 hover:text-brandOrange mb-4 flex items-center gap-1">
        <Ic n="back" /> Salir del Quiz
      </button>
      <div class="bg-white rounded-3xl p-8 card-shadow border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <span class="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">Pregunta {{ idx + 1 }} de {{ preguntas.length }}</span>
          <span class="font-black text-brandOrange">{{ puntos }} XP</span>
        </div>
        <h2 class="text-2xl font-black text-gray-800 mb-8">{{ pregunta?.pregunta }}</h2>
        <div class="space-y-3">
          <button v-for="(op, i) in pregunta?.opciones" :key="i" @click="elegir(i)" :disabled="sel !== null"
            class="w-full text-left p-4 rounded-xl border-2 font-bold transition-all duration-200 flex items-center gap-4"
            :class="clase(i)">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
              :class="sel === null ? 'bg-gray-100 text-gray-500' : (i === pregunta.correcta ? 'bg-green-500 text-white' : (i === sel ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'))">
              {{ String.fromCharCode(65 + i) }}
            </div>
            {{ op }}
          </button>
        </div>
        <div v-if="sel !== null" class="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm font-bold" :class="acierto ? 'text-green-500' : 'text-red-500'">
            {{ acierto ? '¡Excelente! Has ganado 10 XP.' : 'Incorrecto. Era: ' + pregunta.opciones[pregunta.correcta] }}
          </p>
          <button @click="siguiente" class="bg-brandOrange text-white font-black py-2 px-6 rounded-xl shadow hover:bg-orange-600 transition w-full sm:w-auto">
            {{ idx === preguntas.length - 1 ? 'Ver Resultados' : 'Siguiente' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Ic from '../components/Ic.vue';
import { PREGUNTAS_DATA, mezclar } from '../data/quizData';
import { useUsuario } from '../composables/useUsuario';

const emit = defineEmits(['salir', 'fin']);
const { usuario, sumarXP, registrarActividad, guardarUsuario } = useUsuario();

const preguntas = ref([]);
const idx = ref(0);
const puntos = ref(0);
const sel = ref(null);
const aciertos = ref(0);

const pregunta = computed(() => preguntas.value[idx.value]);
const acierto = computed(() => sel.value === pregunta.value?.correcta);

onMounted(() => { preguntas.value = mezclar(PREGUNTAS_DATA); });

function clase(i) {
  if (sel.value === null) return 'border-gray-200 hover:border-brandOrange hover:bg-orange-50 text-gray-700';
  if (i === pregunta.value.correcta) return 'border-green-500 bg-green-50 text-green-700';
  if (i === sel.value) return 'border-red-500 bg-red-50 text-red-700';
  return 'border-gray-200 opacity-50 text-gray-400';
}

function elegir(i) {
  if (sel.value !== null) return;
  sel.value = i;
  if (i === pregunta.value.correcta) { puntos.value += 10; aciertos.value++; }
}

function siguiente() {
  if (idx.value < preguntas.value.length - 1) {
    idx.value++; sel.value = null;
  } else {
    sumarXP(puntos.value, 'quizzes');
    if (aciertos.value === preguntas.value.length) usuario.value.stats.perfectos++;
    registrarActividad(); guardarUsuario();
    emit('fin');
  }
}
</script>