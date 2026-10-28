<template>
  <div class="min-h-screen flex">
    <SpriteSvg />
    <LoginView v-if="!usuarioLogueado" />
    <template v-else>
      <AppHeader />
      <main class="flex-1 w-full flex flex-col min-h-screen">
        <DashboardView v-if="vista === 'dashboard'" @ir="ir" />
        <QuizzesView v-else-if="vista === 'quizzes' && !jugando" @iniciar="abrirJuego" />
        <QuizGame v-else-if="jugando" @salir="jugando = false" @fin="vista = 'resultados'" />
        <BugsGame v-else-if="vista === 'bugs'" @salir="salirMini" />
        <TiroGame v-else-if="vista === 'tiro'" @salir="salirMini" />
        <CarreraGame v-else-if="vista === 'carrera'" @salir="salirMini" />
        <TeclasGame v-else-if="vista === 'teclas'" @salir="salirMini" />
        <ResultadosView v-else-if="vista === 'resultados'" @volver="vista = 'dashboard'" />
        <LogrosView v-else-if="vista === 'logros'" />
        <AjustesView v-else-if="vista === 'ajustes'" />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsuario } from './composables/useUsuario';
import SpriteSvg from './components/SpriteSvg.vue';
import LoginView from './components/LoginView.vue';
import AppHeader from './components/AppHeader.vue';
import DashboardView from './views/DashboardView.vue';
import QuizzesView from './views/QuizzesView.vue';
import QuizGame from './views/QuizGame.vue';
import BugsGame from './views/BugsGame.vue';
import TiroGame from './views/TiroGame.vue';
import CarreraGame from './views/CarreraGame.vue';
import TeclasGame from './views/TeclasGame.vue';
import ResultadosView from './views/ResultadosView.vue';
import LogrosView from './views/LogrosView.vue';
import AjustesView from './views/AjustesView.vue';

const { usuarioLogueado, cargarUsuario } = useUsuario();
const vista = ref('dashboard');
const jugando = ref(false);

function ir(v) { 
  jugando.value = false; 
  if (v === 'quiz') { jugando.value = true; } 
  else { vista.value = v; } 
}
function abrirJuego(v) { 
  if (v === 'quiz') { jugando.value = true; } 
  else { vista.value = v; } 
}
function salirMini() { vista.value = 'quizzes'; }

onMounted(cargarUsuario);
</script>