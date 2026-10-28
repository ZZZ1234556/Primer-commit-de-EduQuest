<template>
  <div class="flex-1 px-8 pb-8">
    <div class="bg-white rounded-3xl p-8 card-shadow max-w-2xl border border-gray-100">
      <h3 class="text-xl font-black text-gray-800 mb-6">Perfil de Usuario</h3>
      <div class="flex items-center gap-6 mb-8">
        <div class="w-24 h-24 rounded-full bg-orange-100 border-4 border-white shadow-sm overflow-hidden">
          <img :src="usuario.avatar" class="w-full h-full object-cover" />
        </div>
        <label class="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 px-4 rounded-xl hover:bg-gray-50 shadow-sm inline-block">
          <Ic n="folder" /> Cambiar Foto
          <input type="file" accept="image/*" @change="subir" class="hidden" />
        </label>
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
        <input v-model="usuario.nombre" @change="guardarUsuario" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold text-gray-800 focus:outline-none focus:border-brandOrange" />
      </div>
    </div>
  </div>
</template>
<script setup>
import Ic from '../components/Ic.vue';
import { useUsuario } from '../composables/useUsuario';
const { usuario, guardarUsuario } = useUsuario();
function subir(e) {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = (ev) => { usuario.value.avatar = ev.target.result; guardarUsuario(); };
  r.readAsDataURL(file);
}
</script>