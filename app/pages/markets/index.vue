<template>
  <div class="markets-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h1 class="h2 mb-2">
            <i class="bi bi-graph-up text-primary me-2"></i>
            Markets Overview
          </h1>
          <p class="text-muted mb-0">
            Real-time market data, indices, sectors performance, and market breadth indicators
          </p>
        </div>
        <div class="d-flex align-items-center">
          <span class="badge me-2" :class="marketStatus.isOpen ? 'bg-success' : 'bg-danger'">
            <i class="bi bi-circle-fill me-1"></i>
            {{ marketStatus.isOpen ? 'Market Open' : 'Market Closed' }}
          </span>
          <small class="text-muted">{{ currentTime }}</small>
        </div>
      </div>
    </div>

    <!-- Market Indices -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-bar-chart-line me-2"></i>
              Major Indices
            </h5>
            <button class="btn btn-sm btn-outline-secondary" @click="refreshData">
              <i class="bi bi-arrow-clockwise"></i>
              Refresh
            </button>
          </div>
          <div class="card-body p-0">
            <MarketIndices :indices="marketData.indices" />
          </div>
        </div>
      </div>
    </div>

    <!-- Market Sectors & Breadth -->
    <div class="row mb-4">
      <!-- Sectors Performance -->
      <div class="col-lg-8 mb-4 mb-lg-0">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-pie-chart me-2"></i>
              Sector Performance
            </h5>
          </div>
          <div class="card-body">
            <MarketSectors :sectors="marketData.sectors" />
          </div>
        </div>
      </div>

      <!-- Market Breadth -->
      <div class="col-lg-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-speedometer2 me-2"></i>
              Market Breadth
            </h5>
          </div>
          <div class="card-body">
            <MarketBreadth :breadth="marketData.breadth" />
          </div>
        </div>
      </div>
    </div>

    <!-- Market Movers -->
    <div class="row">
      <!-- Top Gainers -->
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header bg-success-subtle">
            <h5 class="mb-0 text-success">
              <i class="bi bi-arrow-up-circle me-2"></i>
              Top Gainers
            </h5>
          </div>
          <div class="card-body p-0">
            <MarketMovers :stocks="marketData.gainers" type="gainers" />
          </div>
        </div>
      </div>

      <!-- Top Losers -->
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header bg-danger-subtle">
            <h5 class="mb-0 text-danger">
              <i class="bi bi-arrow-down-circle me-2"></i>
              Top Losers
            </h5>
          </div>
          <div class="card-body p-0">
            <MarketMovers :stocks="marketData.losers" type="losers" />
          </div>
        </div>
      </div>
    </div>

    <!-- Most Active -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-activity me-2"></i>
              Most Active by Volume
            </h5>
          </div>
          <div class="card-body p-0">
            <MarketMovers :stocks="marketData.mostActive" type="active" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarketMovers from "~/components/markets/MarketMovers.vue";
import MarketBreadth from "~/components/markets/MarketBreadth.vue";
import MarketSectors from "~/components/markets/MarketSectors.vue";
import MarketIndices from "~/components/markets/MarketIndices.vue";

definePageMeta({
  layout: 'default'
});

// Composables
const { marketData, marketStatus, refreshMarketData } = useMarkets();

// State
const currentTime = ref('');

// Methods
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const refreshData = async () => {
  await refreshMarketData();
};

// Lifecycle
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000); // Update every second

  // Auto-refresh market data every 30 seconds
  setInterval(refreshMarketData, 30000);
});
</script>

<style scoped>
.markets-page {
  max-width: 1800px;
  margin: 0 auto;
}

.page-header h1 {
  font-weight: 600;
  color: var(--tf-primary);
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  padding: 1rem 1.25rem;
}

.card-header h5 {
  color: var(--tf-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.bg-success-subtle {
  background-color: rgba(40, 167, 69, 0.1);
}

.bg-danger-subtle {
  background-color: rgba(220, 53, 69, 0.1);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .page-header .d-flex:last-child {
    margin-top: 1rem;
  }
}
</style>
