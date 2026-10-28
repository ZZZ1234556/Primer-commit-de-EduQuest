<template>
  <header class="relative z-30 h-20 px-4 sm:px-8 flex items-center justify-between w-full">
    <div class="flex items-center gap-3 cursor-pointer">
      <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 -rotate-6 rounded-xl flex items-center justify-center text-white font-black italic text-lg">E</div>
      <h2 class="text-xl font-black text-gray-800">EduQuest</h2>
    </div>
    <div class="relative">
      <button @click="abierto = !abierto" class="flex items-center gap-3 bg-white rounded-2xl pl-2 pr-4 py-2 border border-gray-200 shadow-sm hover:border-brandOrange transition">
        <img :src="usuario.avatar" class="w-10 h-10 rounded-full object-cover border-2 border-orange-200" />
        <div class="text-left leading-tight hidden sm:block">
          <p class="font-black text-sm text-gray-800">{{ usuario.nombre }}</p>
          <p class="text-[11px] text-gray-400 font-bold">Nivel {{ nivelActual }} · {{ rango }}</p>
        </div>
      </button>
      <div v-if="abierto" class="fixed inset-0" @click="abierto = false"></div>
      <div v-if="abierto" class="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl p-2">
        <a @click="cerrar" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition">
          <Ic n="door" /> Cerrar Sesión
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import Ic from './Ic.vue';
import { useUsuario } from '../composables/useUsuario';
const { usuario, nivelActual, rango, cerrarSesion } = useUsuario();
const abierto = ref(false);
function cerrar() { cerrarSesion(); abierto.value = false; }
</script>