<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">My Watchlists</h5>
      <NuxtLink to="/watchlists" class="btn btn-sm btn-outline-primary">
        View All
      </NuxtLink>
    </div>
    <div class="card-body">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="watchlists.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-eye-slash fs-1 d-block mb-3"></i>
        <p>No watchlists yet. Create one to start tracking stocks!</p>
        <NuxtLink to="/watchlists" class="btn btn-primary">
          Create Watchlist
        </NuxtLink>
      </div>

      <div v-else class="list-group list-group-flush">
        <NuxtLink
          v-for="watchlist in watchlists"
          :key="watchlist.id"
          :to="`/watchlists/${watchlist.id}`"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div>
            <h6 class="mb-1">{{ watchlist.name }}</h6>
            <small class="text-muted">{{ watchlist.stocks.length }} stocks</small>
          </div>
          <i class="bi bi-chevron-right text-muted"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Watchlist } from '~/types/watchlist';

const api = useApi();
const watchlists = ref<Watchlist[]>([]);
const loading = ref(true);

const loadData = async () => {
  try {
    loading.value = true;
    watchlists.value = await api.getWatchlists();
  } catch (error) {
    console.error('Error loading watchlists:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
