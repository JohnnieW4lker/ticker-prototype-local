<template>
  <div class="history-page">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{{ symbol}} Historical Prices</h2>
          <p class="text-muted mb-0">Daily price and volume data</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="exportData">
            <i class="bi bi-download me-2"></i>Export
          </button>
          <NuxtLink :to="`/stock/${symbol}`" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back
          </NuxtLink>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th class="text-end">Open</th>
                  <th class="text-end">High</th>
                  <th class="text-end">Low</th>
                  <th class="text-end">Close</th>
                  <th class="text-end">Change</th>
                  <th class="text-end">Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="point in paginatedHistory" :key="point.date">
                  <td>{{ formatDate(point.date) }}</td>
                  <td class="text-end">${{ point.open.toFixed(2) }}</td>
                  <td class="text-end">${{ point.high.toFixed(2) }}</td>
                  <td class="text-end">${{ point.low.toFixed(2) }}</td>
                  <td class="text-end fw-bold">${{ point.close.toFixed(2) }}</td>
                  <td class="text-end" :class="getChangeClass(point)">
                    {{ formatChange(point) }}
                  </td>
                  <td class="text-end">{{ formatVolume(point.volume) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="currentPage--">Previous</button>
                </li>
                <li v-for="page in displayPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                  <button class="page-link" @click="currentPage = page">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="currentPage++">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PricePoint } from '~/types/stock';

const route = useRoute();
const api = useApi();

const loading = ref(true);
const priceHistory = ref<PricePoint[]>([]);
const currentPage = ref(1);
const pageSize = 30;

const symbol = computed(() => (route.params.symbol as string).toUpperCase());

const totalPages = computed(() => Math.ceil(priceHistory.value.length / pageSize));

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return priceHistory.value.slice(start, start + pageSize);
});

const displayPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const loadHistory = async () => {
  try {
    loading.value = true;
    priceHistory.value = await api.getStockHistory(symbol.value, 365);
    priceHistory.value.reverse(); // Show newest first
  } catch (error) {
    console.error('Error loading history:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatChange = (point: PricePoint) => {
  const change = point.close - point.open;
  const changePercent = (change / point.open) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
};

const getChangeClass = (point: PricePoint) => {
  const change = point.close - point.open;
  return change >= 0 ? 'price-positive' : 'price-negative';
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`;
  return volume.toString();
};

const exportData = () => {
  alert('Export functionality coming soon!');
};

onMounted(() => loadHistory());
watch(() => route.params.symbol, () => loadHistory());
</script>

<style scoped>
.history-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
