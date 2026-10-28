<template>
  <div class="flex-1 px-8 pb-8 flex flex-col xl:flex-row gap-6">
    <div class="flex-1 flex flex-col gap-6">
      <div class="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 border-4 border-white card-shadow">
        <span class="wiggle absolute right-3 top-1 text-7xl"><Ic n="rocket" /></span>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-800 pr-20">¡Hola, {{ usuario.nombre }}! <Ic n="spark" /></h1>
        <p class="font-bold text-gray-700 mt-1">¿Listo para ganar XP hoy? <Ic n="flame" /> Llevas {{ usuario.racha }} días de racha.</p>
        <div class="mt-4 max-w-sm">
          <div class="flex justify-between text-xs font-black text-gray-700 mb-1">
            <span>Nivel {{ nivelActual }}</span><span>{{ usuario.xp % 100 }}/100 XP</span>
          </div>
          <div class="h-4 bg-white/70 rounded-full overflow-hidden border-2 border-white">
            <div class="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transition-all" :style="{ width: (usuario.xp % 100) + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-yellow-100 rounded-3xl p-5 card-shadow relative overflow-hidden">
          <p class="text-sm font-black text-yellow-800 mb-1">XP TOTAL</p>
          <h3 class="text-3xl font-black text-gray-800">{{ usuario.xp }}</h3>
          <span class="absolute -right-4 -bottom-4 text-7xl opacity-20"><Ic n="star" /></span>
        </div>
        <div class="bg-blue-50 rounded-3xl p-5 card-shadow relative overflow-hidden border border-blue-100">
          <p class="text-sm font-black text-blue-800 mb-1">NIVEL</p>
          <h3 class="text-3xl font-black text-gray-800">{{ nivelActual }}</h3>
          <p class="text-xs font-bold text-blue-600 mt-1">Rango: {{ rango }}</p>
          <span class="absolute -right-4 -bottom-4 text-7xl opacity-20"><Ic n="gem" /></span>
        </div>
        <div class="bg-red-50 rounded-3xl p-5 card-shadow relative overflow-hidden border border-red-100">
          <p class="text-sm font-black text-red-800 mb-1">RACHA</p>
          <h3 class="text-3xl font-black text-gray-800">{{ usuario.racha }} <span class="text-lg">días</span></h3>
          <span class="absolute -right-4 -bottom-4 text-7xl opacity-20"><Ic n="flame" /></span>
        </div>
        <div class="bg-orange-50 rounded-3xl p-5 card-shadow relative overflow-hidden border border-orange-100">
          <p class="text-sm font-black text-orange-800 mb-1">RANKING</p>
          <h3 class="text-3xl font-black text-gray-800">#{{ usuario.ranking }}</h3>
          <span class="absolute -right-4 -bottom-4 text-7xl opacity-20"><Ic n="badge" /></span>
        </div>
      </div>

      <div class="bg-gradient-to-r from-sky-300 to-indigo-300 rounded-3xl p-6 card-shadow border-4 border-white flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-black text-indigo-900 mb-1"><Ic n="dice" /> Reto del día</p>
          <h3 class="text-2xl font-black text-gray-800 mb-3">¡Elige tu juego y gana XP!</h3>
          <div class="flex flex-wrap gap-2">
            <button @click="$emit('ir', 'quizzes')" class="bg-white text-gray-800 font-black py-2 px-4 rounded-xl border-2 border-gray-800 hover:-translate-y-0.5 transition text-sm"><Ic n="quiz" /> Quiz</button>
            <button @click="$emit('ir', 'bugs')" class="bg-white text-gray-800 font-black py-2 px-4 rounded-xl border-2 border-gray-800 hover:-translate-y-0.5 transition text-sm"><Ic n="bug" /> Bugs</button>
            <button @click="$emit('ir', 'tiro')" class="bg-white text-gray-800 font-black py-2 px-4 rounded-xl border-2 border-gray-800 hover:-translate-y-0.5 transition text-sm"><Ic n="target" /> Tiro al blanco</button>
            <button @click="$emit('ir', 'teclas')" class="bg-white text-gray-800 font-black py-2 px-4 rounded-xl border-2 border-gray-800 hover:-translate-y-0.5 transition text-sm"><Ic n="keyboard" /> Teclas</button>
            <button @click="$emit('ir', 'carrera')" class="bg-white text-gray-800 font-black py-2 px-4 rounded-xl border-2 border-gray-800 hover:-translate-y-0.5 transition text-sm"><Ic n="racer" /> Carrera</button>
          </div>
        </div>
        <div class="hidden sm:block text-7xl wiggle"><Ic n="pad" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Ic from '../components/Ic.vue';
import { useUsuario } from '../composables/useUsuario';
defineEmits(['ir']);
const { usuario, nivelActual, rango } = useUsuario();
</script>