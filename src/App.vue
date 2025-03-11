<script setup lang="ts">
import ScratchGrid from './components/ScratchGrid.vue';
</script>

<template>
  <header>
    <img class="logo" src="@/assets/images/logo.webp" alt="Krasloten" />
  </header>

  <div class="layout">
    <main>
      <ScratchGrid />
    </main>
  </div>
</template>

<style lang="scss">
header {
  display: flex;
  justify-content: center;
}
.logo {
  width: 400px;
  height: auto;
}
</style>
