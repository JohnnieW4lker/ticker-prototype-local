<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Market Overview</h5>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div v-for="index in indices" :key="index.symbol" class="col-md-4">
          <div class="metric-card">
            <div class="metric-label">{{ index.name }}</div>
            <div class="metric-value">{{ formatNumber(index.value) }}</div>
            <div class="metric-change" :class="getChangeClass(index.change)">
              <i :class="getChangeIcon(index.change)" class="me-1"></i>
              {{ formatNumber(index.change) }} ({{ formatPercent(index.changePercent) }}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketIndex } from '~/types/stock';

const api = useApi();
const indices = ref<MarketIndex[]>([]);
const loading = ref(true);

const loadData = async () => {
  try {
    loading.value = true;
    indices.value = await api.getMarketIndices();
  } catch (error) {
    console.error('Error loading market indices:', error);
  } finally {
    loading.value = false;
  }
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
};

const getChangeClass = (change: number) => {
  if (change > 0) return 'price-positive';
  if (change < 0) return 'price-negative';
  return 'price-neutral';
};

const getChangeIcon = (change: number) => {
  if (change > 0) return 'bi bi-arrow-up';
  if (change < 0) return 'bi bi-arrow-down';
  return 'bi bi-dash';
};

onMounted(() => {
  loadData();
});
</script>
