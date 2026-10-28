<template>
  <div class="flex-1 px-8 pb-8 flex items-center justify-center">
    <div class="bg-white rounded-3xl p-10 card-shadow border border-gray-100 max-w-lg w-full text-center">
      <div class="text-6xl mb-4"><Ic n="trophy" /></div>
      <h2 class="text-3xl font-black text-gray-800 mb-2">¡Reto Completado!</h2>
      <p class="text-gray-500 font-semibold">¡Sigue así, campeón!</p>
      <button @click="$emit('volver')" class="mt-8 w-full bg-gray-800 text-white font-black py-3 rounded-xl hover:bg-gray-900 transition">Volver al Dashboard</button>
    </div>
  </div>
</template>
<script setup>
import Ic from '../components/Ic.vue';
defineEmits(['volver']);
</script>