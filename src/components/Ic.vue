<template>
  <svg class="ic" aria-hidden="true"><use :href="`#i-${n}`" /></svg>
</template>
<script setup>
defineProps({ n: { type: String, required: true } });
</script>