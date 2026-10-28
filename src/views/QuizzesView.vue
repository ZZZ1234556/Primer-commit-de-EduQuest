<template>
  <div class="flex-1 px-8 pb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="card in cards" :key="card.v" @click="$emit('iniciar', card.v)"
        class="bg-white rounded-3xl p-6 card-shadow border border-gray-100 cursor-pointer hover:border-brandOrange transition">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl" :class="card.color"><Ic :n="card.icono" /></div>
        <h3 class="text-xl font-black text-gray-800 mb-2">{{ card.titulo }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ card.desc }}</p>
        <div class="flex items-center gap-2 text-xs font-bold text-brandOrange"><Ic n="play" /> {{ card.accion }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Ic from '../components/Ic.vue';
defineEmits(['iniciar']);
const cards = [
  { v: 'quiz',    icono: 'code',     color: 'bg-blue-100 text-blue-500',     titulo: 'Programación Básica', desc: 'HTML, CSS y JavaScript.', accion: 'Comenzar Quiz' },
  { v: 'bugs',    icono: 'bug',      color: 'bg-orange-100 text-orange-500', titulo: 'Escáner de Bugs',     desc: 'Escanea y toca la línea con el error.', accion: 'Mini juego' },
  { v: 'carrera', icono: 'racer',    color: 'bg-green-100 text-green-500',   titulo: 'Carrera de Código',   desc: 'Acierta para acelerar.', accion: 'Mini juego' },
  { v: 'teclas',  icono: 'keyboard', color: 'bg-purple-100 text-purple-500', titulo: 'Carrera de Teclas',   desc: 'Escribe código sin fallar.', accion: 'Mini juego' },
  { v: 'tiro',    icono: 'target',   color: 'bg-red-100 text-red-500',       titulo: 'Tiro al Blanco',      desc: 'Dispara al resultado correcto.', accion: 'Mini juego' },
];
</script>