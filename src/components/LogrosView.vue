<template>
  <div class="flex-1 px-8 pb-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div v-for="l in logros" :key="l.nombre" class="rounded-3xl p-6 card-shadow text-center border"
        :class="l.ok ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200 opacity-60 grayscale'">
        <div class="mb-4 flex justify-center"><Ic :n="l.ok ? l.icono : 'lock'" class="w-14 h-14" /></div>
        <h3 class="font-black text-gray-800 mb-1">{{ l.nombre }}</h3>
        <p class="text-xs text-gray-500">{{ l.desc }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import Ic from '../components/Ic.vue';
import { useUsuario } from '../composables/useUsuario';
const { usuario } = useUsuario();
const logros = computed(() => {
  const st = usuario.value.stats;
  return [
    { icono: 'star', nombre: 'Primer Paso', desc: 'Completa tu primer quiz.', ok: st.quizzes >= 1 },
    { icono: 'flame', nombre: 'En Racha', desc: 'Mantén 3 días seguidos.', ok: usuario.value.racha >= 3 },
    { icono: 'quiz', nombre: 'Cerebrito', desc: '100% en un quiz.', ok: st.perfectos >= 1 },
    { icono: 'bug', nombre: 'Cazabugs', desc: 'Atrapa 10 bugs.', ok: st.bugs >= 10 },
    { icono: 'target', nombre: 'Francotirador', desc: 'Acierta 10 blancos.', ok: st.blancos >= 10 },
    { icono: 'racer', nombre: 'Piloto Veloz', desc: 'Gana una carrera.', ok: st.carreras >= 1 },
    { icono: 'keyboard', nombre: 'Dedos Veloces', desc: 'Gana carrera de teclas.', ok: st.teclas >= 1 },
  ];
});
</script>