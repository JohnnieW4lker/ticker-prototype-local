<template>
  <div class="chart-page">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{{ symbol }} Chart</h2>
          <p class="text-muted mb-0">Interactive price chart with technical analysis</p>
        </div>
        <NuxtLink :to="`/stock/${symbol}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back
        </NuxtLink>
      </div>

      <!-- Full-size Chart -->
      <StockChart :symbol="symbol" :price-history="priceHistory" class="mb-4" />

      <!-- Chart Statistics -->
      <div class="row g-4">
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <div class="stat-label">Highest Price</div>
              <div class="stat-value price-positive">${{ maxPrice.toFixed(2) }}</div>
              <small class="text-muted">{{ maxPriceDate }}</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <div class="stat-label">Lowest Price</div>
              <div class="stat-value price-negative">${{ minPrice.toFixed(2) }}</div>
              <small class="text-muted">{{ minPriceDate }}</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <div class="stat-label">Average Price</div>
              <div class="stat-value">${{ avgPrice.toFixed(2) }}</div>
              <small class="text-muted">Period average</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body text-center">
              <div class="stat-label">Total Volume</div>
              <div class="stat-value">{{ formatVolume(totalVolume) }}</div>
              <small class="text-muted">Cumulative</small>
            </div>
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
const symbol = computed(() => (route.params.symbol as string).toUpperCase());

const maxPrice = computed(() => {
  if (priceHistory.value.length === 0) return 0;
  return Math.max(...priceHistory.value.map(p => p.high));
});

const minPrice = computed(() => {
  if (priceHistory.value.length === 0) return 0;
  return Math.min(...priceHistory.value.map(p => p.low));
});

const avgPrice = computed(() => {
  if (priceHistory.value.length === 0) return 0;
  const sum = priceHistory.value.reduce((acc, p) => acc + p.close, 0);
  return sum / priceHistory.value.length;
});

const totalVolume = computed(() => {
  return priceHistory.value.reduce((acc, p) => acc + p.volume, 0);
});

const maxPriceDate = computed(() => {
  const point = priceHistory.value.find(p => p.high === maxPrice.value);
  return point ? formatDate(point.date) : '';
});

const minPriceDate = computed(() => {
  const point = priceHistory.value.find(p => p.low === minPrice.value);
  return point ? formatDate(point.date) : '';
});

const loadPriceHistory = async () => {
  try {
    loading.value = true;
    priceHistory.value = await api.getStockHistory(symbol.value, 365);
  } catch (error) {
    console.error('Error loading price history:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(2)}B`;
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`;
  return volume.toString();
};

onMounted(() => loadPriceHistory());
watch(() => route.params.symbol, () => loadPriceHistory());
</script>

<style scoped>
.chart-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
</style>
