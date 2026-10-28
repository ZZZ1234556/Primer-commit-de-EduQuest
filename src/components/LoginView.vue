<template>
  <div class="fixed inset-0 login-bg flex items-center justify-center p-4 z-50 overflow-hidden">
    <span class="floaty absolute top-[8%] left-[8%] text-6xl"><Ic n="star" /></span>
    <span class="floaty absolute top-[18%] right-[10%] text-5xl" style="animation-delay:-1.5s"><Ic n="rocket" /></span>
    <span class="floaty absolute bottom-[14%] left-[12%] text-5xl" style="animation-delay:-2.5s"><Ic n="bulb" /></span>
    <span class="floaty absolute bottom-[10%] right-[14%] text-6xl" style="animation-delay:-0.8s"><Ic n="pad" /></span>

    <div class="pop-card bg-white rounded-3xl p-8 max-w-md w-full relative z-10">
      <div class="text-center mb-6">
        <div class="wiggle w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-3xl mx-auto flex items-center justify-center text-white font-black italic text-4xl mb-3 border-4 border-gray-800">E</div>
        <h1 class="text-3xl font-black text-gray-800">¡Hola, futuro crack! <Ic n="confetti" /></h1>
        <p class="text-gray-600 font-bold mt-1">Inicia sesión con tu correo y contraseña.</p>
      </div>

      <form @submit.prevent="entrar" class="space-y-5">
        <div>
          <label class="block text-sm font-black text-gray-700 mb-2">Correo electrónico <Ic n="pencil" /></label>
          <input v-model="email" type="email" required placeholder="correo@ejemplo.com"
            class="w-full bg-yellow-50 border-2 border-gray-800 rounded-xl p-3 text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-brandOrange transition" />
        </div>

        <div>
          <label class="block text-sm font-black text-gray-700 mb-2">Contraseña <Ic n="pad" /></label>
          <input v-model="password" type="password" required placeholder="Tu contraseña secreta"
            class="w-full bg-yellow-50 border-2 border-gray-800 rounded-xl p-3 text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-brandOrange transition" />
        </div>

        <p v-if="errorMessage" class="text-red-500 font-bold text-sm text-center">{{ errorMessage }}</p>

        <button type="submit" class="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-black py-3.5 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0_#1f2937] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1f2937] active:translate-y-1 active:shadow-none transition text-lg">
          ¡Vamos a jugar! <Ic n="rocket" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Ic from './Ic.vue';
import { useUsuario } from '../composables/useUsuario';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const { usuario, usuarioLogueado, guardarUsuario } = useUsuario();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function entrar() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    usuario.value.nombre = userCredential.user.email.split('@')[0];
    usuarioLogueado.value = true;
    guardarUsuario();
  } catch (error) {
    errorMessage.value = 'Correo o contraseña incorrectos.';
  }
}
</script>