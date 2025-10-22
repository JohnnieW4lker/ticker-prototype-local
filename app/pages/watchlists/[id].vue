<template>
  <div class="watchlist-detail-page">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <NuxtLink to="/watchlists">
            <i class="bi bi-eye me-1"></i>
            Watchlists
          </NuxtLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ watchlist?.name }}
        </li>
      </ol>
    </nav>

    <!-- Not Found State -->
    <div v-if="!watchlist" class="not-found-state text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
      <h2 class="mt-4">Watchlist Not Found</h2>
      <p class="text-muted">The watchlist you're looking for doesn't exist or has been deleted.</p>
      <NuxtLink to="/watchlists" class="btn btn-primary mt-3">
        <i class="bi bi-arrow-left me-2"></i>
        Back to Watchlists
      </NuxtLink>
    </div>

    <!-- Watchlist Content -->
    <div v-else>
      <!-- Page Header -->
      <div class="page-header mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h1 class="h2 mb-2">
              <i class="bi bi-eye text-primary me-2"></i>
              {{ watchlist.name }}
            </h1>
            <div class="d-flex align-items-center gap-3 text-muted">
              <span>
                <i class="bi bi-graph-up me-1"></i>
                {{ watchlist.stocks.length }} {{ watchlist.stocks.length === 1 ? 'stock' : 'stocks' }}
              </span>
              <span>
                <i class="bi bi-calendar me-1"></i>
                Created {{ formatDate(watchlist.createdAt) }}
              </span>
              <span>
                <i class="bi bi-clock me-1"></i>
                Updated {{ formatDate(watchlist.updatedAt) }}
              </span>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" @click="handleShare">
              <i class="bi bi-share"></i> Share
            </button>
            <button class="btn btn-outline-secondary" @click="handleExport">
              <i class="bi bi-download"></i> Export
            </button>
            <button class="btn btn-outline-primary" @click="handleAddStock">
              <i class="bi bi-plus-circle me-1"></i> Add Stock
            </button>
            <button class="btn btn-outline-danger" @click="handleDeleteWatchlist">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Performance Summary Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted mb-1 small">Total Stocks</p>
                  <h3 class="mb-0">{{ watchlist.stocks.length }}</h3>
                </div>
                <div class="icon-wrapper bg-primary-subtle">
                  <i class="bi bi-graph-up text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted mb-1 small">Avg Price Change</p>
                  <h3 class="mb-0" :class="averageChangeClass">
                    {{ formatPercent(averageChange) }}
                  </h3>
                </div>
                <div class="icon-wrapper bg-success-subtle">
                  <i class="bi bi-bar-chart text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted mb-1 small">Best Performer</p>
                  <h3 class="mb-0 text-success">
                    {{ bestPerformer?.ticker || 'N/A' }}
                  </h3>
                  <small v-if="bestPerformer" class="text-success">
                    {{ formatPercent(bestPerformer.change) }}
                  </small>
                </div>
                <div class="icon-wrapper bg-success-subtle">
                  <i class="bi bi-arrow-up-circle text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted mb-1 small">Worst Performer</p>
                  <h3 class="mb-0 text-danger">
                    {{ worstPerformer?.ticker || 'N/A' }}
                  </h3>
                  <small v-if="worstPerformer" class="text-danger">
                    {{ formatPercent(worstPerformer.change) }}
                  </small>
                </div>
                <div class="icon-wrapper bg-danger-subtle">
                  <i class="bi bi-arrow-down-circle text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="watchlist-toolbar mb-3 p-3 bg-light rounded">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <label class="form-label small mb-1">Time Period</label>
            <select v-model="selectedPeriod" class="form-select form-select-sm">
              <option value="1d">1 Day</option>
              <option value="5d">5 Days</option>
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small mb-1">Sort By</label>
            <select v-model="sortBy" class="form-select form-select-sm">
              <option value="ticker">Ticker</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="marketCap">Market Cap</option>
              <option value="performance">Performance</option>
              <option value="volume">Volume</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small mb-1">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-sm"
              placeholder="Search stocks..."
            />
          </div>
          <div class="col-md-3 text-end">
            <label class="form-label small mb-1">&nbsp;</label>
            <div class="small text-muted">
              Last updated: {{ lastUpdated }}
            </div>
          </div>
        </div>
      </div>

      <!-- Watchlist Table -->
      <WatchlistTable
        :stocks="filteredAndSortedStocks"
        :period="selectedPeriod"
        @remove-stock="handleRemoveStock"
      />

      <!-- Empty State -->
      <div v-if="watchlist.stocks.length === 0" class="empty-state text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <h3 class="mt-3">No stocks in this watchlist</h3>
        <p class="text-muted">Start by adding some stocks to track their performance</p>
        <button class="btn btn-primary" @click="handleAddStock">
          <i class="bi bi-plus-circle me-2"></i>
          Add Stocks
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

// Get route params
const route = useRoute();
const router = useRouter();
const watchlistId = route.params.id as string;

// Composables
const { watchlists, removeWatchlist, removeStockFromWatchlist } = useWatchlists();

// State
const selectedPeriod = ref('1d');
const sortBy = ref('ticker');
const searchQuery = ref('');
const lastUpdated = ref('');

// Computed
const watchlist = computed(() => {
  return watchlists.value.find(w => w.id === watchlistId);
});

const averageChange = computed(() => {
  if (!watchlist.value || watchlist.value.stocks.length === 0) return 0;
  const sum = watchlist.value.stocks.reduce((acc, stock) => acc + stock.change, 0);
  return sum / watchlist.value.stocks.length;
});

const averageChangeClass = computed(() => {
  if (averageChange.value > 0) return 'text-success';
  if (averageChange.value < 0) return 'text-danger';
  return 'text-muted';
});

const bestPerformer = computed(() => {
  if (!watchlist.value || watchlist.value.stocks.length === 0) return null;
  return watchlist.value.stocks.reduce((best, stock) => {
    return stock.change > best.change ? stock : best;
  });
});

const worstPerformer = computed(() => {
  if (!watchlist.value || watchlist.value.stocks.length === 0) return null;
  return watchlist.value.stocks.reduce((worst, stock) => {
    return stock.change < worst.change ? stock : worst;
  });
});

const filteredStocks = computed(() => {
  if (!watchlist.value) return [];

  if (!searchQuery.value.trim()) {
    return watchlist.value.stocks;
  }

  const query = searchQuery.value.toLowerCase();
  return watchlist.value.stocks.filter(stock =>
    stock.ticker.toLowerCase().includes(query) ||
    stock.name.toLowerCase().includes(query)
  );
});

const filteredAndSortedStocks = computed(() => {
  const stocks = [...filteredStocks.value];

  switch (sortBy.value) {
    case 'ticker':
      return stocks.sort((a, b) => a.ticker.localeCompare(b.ticker));
    case 'name':
      return stocks.sort((a, b) => a.name.localeCompare(b.name));
    case 'price':
      return stocks.sort((a, b) => b.price - a.price);
    case 'marketCap':
      return stocks.sort((a, b) => b.marketCap - a.marketCap);
    case 'performance':
      return stocks.sort((a, b) => (b.performance[selectedPeriod.value] || 0) - (a.performance[selectedPeriod.value] || 0));
    case 'volume':
      return stocks.sort((a, b) => b.volume - a.volume);
    default:
      return stocks;
  }
});

// Methods
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const updateLastUpdated = () => {
  const now = new Date();
  lastUpdated.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleRemoveStock = (ticker: string) => {
  if (confirm(`Remove ${ticker} from ${watchlist.value?.name}?`)) {
    removeStockFromWatchlist(watchlistId, ticker);
  }
};

const handleAddStock = () => {
  // TODO: Implement add stock modal/functionality
  alert('Add stock functionality coming soon!');
};

const handleShare = () => {
  // TODO: Implement share functionality
  alert('Share functionality coming soon!');
};

const handleExport = () => {
  // TODO: Implement export functionality
  alert('Export functionality coming soon!');
};

const handleDeleteWatchlist = () => {
  if (confirm(`Are you sure you want to delete "${watchlist.value?.name}"? This action cannot be undone.`)) {
    removeWatchlist(watchlistId);
    router.push('/watchlists');
  }
};

// Lifecycle
onMounted(() => {
  updateLastUpdated();
  setInterval(updateLastUpdated, 60000); // Update every minute
});

// Head metadata
useHead({
  title: computed(() => watchlist.value ? `${watchlist.value.name} - Watchlist` : 'Watchlist Not Found')
});
</script>

<style scoped>
.watchlist-detail-page {
  max-width: 1600px;
  margin: 0 auto;
}

.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item a {
  color: var(--tf-primary);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-weight: 600;
  color: var(--tf-primary);
}

.summary-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  font-size: 1.75rem;
  font-weight: 700;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 1.5rem;
}

.watchlist-toolbar {
  border: 1px solid #dee2e6;
}

.empty-state,
.not-found-state {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4rem 2rem;
}

.text-success {
  color: var(--tf-success) !important;
}

.text-danger {
  color: var(--tf-danger) !important;
}

@media (max-width: 768px) {
  .page-header .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .page-header .d-flex > div:last-child {
    width: 100%;
  }

  .page-header .btn {
    width: 100%;
  }

  .watchlist-toolbar .row {
    flex-direction: column;
  }

  .watchlist-toolbar .col-md-3 {
    width: 100%;
  }
}
</style>
