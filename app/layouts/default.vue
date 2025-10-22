<template>
  <div class="app-container">
    <LayoutHeader />

    <main class="app-main">
      <div class="container-fluid">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Load Bootstrap JavaScript for tooltips, popovers, etc.
onMounted(() => {
  if (process.client) {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }
});
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
