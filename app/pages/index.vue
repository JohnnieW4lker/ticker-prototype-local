<template>
  <div class="dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="mb-1">Dashboard</h1>
        <p class="text-muted mb-0">Welcome back! Here's what's happening in the markets today.</p>
      </div>
      <div>
        <span class="text-muted me-2">{{ currentDate }}</span>
      </div>
    </div>

    <!-- Event Bar -->
    <DashboardEventBar />

    <!-- Market Overview -->
    <div class="mb-4">
      <DashboardMarketOverview />
    </div>

    <!-- Quick Stats -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="metric-card">
          <div class="metric-label">Active Watchlists</div>
          <div class="metric-value">{{ stats.watchlists }}</div>
          <div class="metric-change price-positive">
            <i class="bi bi-plus-circle me-1"></i>
            <NuxtLink to="/watchlists" class="text-decoration-none">Manage</NuxtLink>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="metric-card">
          <div class="metric-label">Stocks Tracked</div>
          <div class="metric-value">{{ stats.trackedStocks }}</div>
          <div class="metric-change price-neutral">
            Across all watchlists
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="metric-card">
          <div class="metric-label">Saved Filters</div>
          <div class="metric-value">{{ stats.savedFilters }}</div>
          <div class="metric-change price-positive">
            <i class="bi bi-plus-circle me-1"></i>
            <NuxtLink to="/screener" class="text-decoration-none">Create New</NuxtLink>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="metric-card">
          <div class="metric-label">Today's Events</div>
          <div class="metric-value">{{ stats.todayEvents }}</div>
          <div class="metric-change price-neutral">
            <NuxtLink to="/events" class="text-decoration-none">View Calendar</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row g-4">
      <!-- Watchlists -->
      <div class="col-lg-6">
        <DashboardWatchlistPreview />
      </div>

      <!-- Events Calendar -->
      <div class="col-lg-6">
        <DashboardEventCalendar />
      </div>
    </div>

    <!-- Top Movers Section -->
    <div class="row g-4 mt-2">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Top Movers Today</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Gainers -->
              <div class="col-md-6">
                <h6 class="text-success mb-3">
                  <i class="bi bi-arrow-up-circle-fill me-2"></i>
                  Top Gainers
                </h6>
                <div class="list-group list-group-flush">
                  <div
                    v-for="stock in topGainers"
                    :key="stock.symbol"
                    class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                    @click="navigateTo(`/stock/${stock.symbol}`)"
                  >
                    <div>
                      <div class="fw-bold">{{ stock.symbol }}</div>
                      <small class="text-muted">{{ stock.name }}</small>
                    </div>
                    <div class="text-end">
                      <div class="fw-bold">${{ stock.price.toFixed(2) }}</div>
                      <small class="price-positive">
                        <i class="bi bi-arrow-up"></i>
                        {{ stock.changePercent.toFixed(2) }}%
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Losers -->
              <div class="col-md-6">
                <h6 class="text-danger mb-3">
                  <i class="bi bi-arrow-down-circle-fill me-2"></i>
                  Top Losers
                </h6>
                <div class="list-group list-group-flush">
                  <div
                    v-for="stock in topLosers"
                    :key="stock.symbol"
                    class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                    @click="navigateTo(`/stock/${stock.symbol}`)"
                  >
                    <div>
                      <div class="fw-bold">{{ stock.symbol }}</div>
                      <small class="text-muted">{{ stock.name }}</small>
                    </div>
                    <div class="text-end">
                      <div class="fw-bold">${{ stock.price.toFixed(2) }}</div>
                      <small class="price-negative">
                        <i class="bi bi-arrow-down"></i>
                        {{ stock.changePercent.toFixed(2) }}%
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '~/types/stock';

const api = useApi();
const mockData = useMockData();

const currentDate = ref('');
const stats = ref({
  watchlists: 3,
  trackedStocks: 0,
  savedFilters: 5,
  todayEvents: 0,
});

const topGainers = ref<Stock[]>([]);
const topLosers = ref<Stock[]>([]);

const loadData = async () => {
  try {
    // Load watchlist data to get tracked stocks count
    const watchlists = await api.getWatchlists();
    stats.value.watchlists = watchlists.length;

    const uniqueStocks = new Set<string>();
    watchlists.forEach(w => w.stocks.forEach(s => uniqueStocks.add(s)));
    stats.value.trackedStocks = uniqueStocks.size;

    // Load today's events count
    const today = new Date().toISOString().split('T')[0];
    const events = await api.getEvents(today, today);
    stats.value.todayEvents = events.length;

    // Generate top movers
    const allStocks = Array.from({ length: 10 }, () => mockData.generateStock());
    allStocks.sort((a, b) => b.changePercent - a.changePercent);
    topGainers.value = allStocks.slice(0, 5);
    topLosers.value = allStocks.slice(-5).reverse();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

onMounted(() => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  loadData();
});
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-group-item:hover {
  background-color: var(--tf-gray-100);
}
</style>
