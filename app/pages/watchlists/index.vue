<template>
  <div class="watchlists-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h1 class="h2 mb-2">
            <i class="bi bi-eye text-primary me-2"></i>
            My Watchlists
          </h1>
          <p class="text-muted mb-0">
            Track and monitor your favorite stocks with comprehensive metrics and performance data
          </p>
        </div>
        <button class="btn btn-primary" @click="showAddWatchlistModal">
          <i class="bi bi-plus-circle me-2"></i>
          Add Watchlist
        </button>
      </div>
    </div>

    <!-- Watchlist Tabs -->
    <div class="watchlist-tabs mb-4">
      <ul class="nav nav-tabs">
        <li
          v-for="watchlist in watchlists"
          :key="watchlist.id"
          class="nav-item"
        >
          <a
            class="nav-link"
            :class="{ active: activeWatchlistId === watchlist.id }"
            href="#"
            @click.prevent="setActiveWatchlist(watchlist.id)"
          >
            {{ watchlist.name }}
            <span class="badge bg-secondary ms-2">{{ watchlist.stocks.length }}</span>
          </a>
          <NuxtLink
            :to="`/watchlists/${watchlist.id}`"
            class="watchlist-detail-link"
            title="View full watchlist page"
          >
            <i class="bi bi-box-arrow-up-right"></i>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Active Watchlist Content -->
    <div v-if="activeWatchlist" class="watchlist-content">
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
            <label class="form-label small mb-1">&nbsp;</label>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2" @click="handleShare">
                <i class="bi bi-share"></i> Share
              </button>
              <button class="btn btn-sm btn-outline-secondary" @click="handleExport">
                <i class="bi bi-download"></i> Export
              </button>
            </div>
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
        :stocks="sortedStocks"
        :period="selectedPeriod"
        @remove-stock="handleRemoveStock"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <h3 class="mt-3">No watchlists yet</h3>
      <p class="text-muted">Create your first watchlist to start tracking stocks</p>
      <button class="btn btn-primary" @click="showAddWatchlistModal">
        <i class="bi bi-plus-circle me-2"></i>
        Create Watchlist
      </button>
    </div>

    <!-- Add Watchlist Modal -->
    <div
      class="modal fade"
      id="addWatchlistModal"
      ref="addWatchlistModalRef"
      tabindex="-1"
      aria-labelledby="addWatchlistModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addWatchlistModalLabel">
              <i class="bi bi-plus-circle me-2"></i>
              Create New Watchlist
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleAddWatchlist">
              <div class="mb-3">
                <label for="watchlistName" class="form-label">
                  Watchlist Name <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="watchlistName"
                  v-model="newWatchlistName"
                  placeholder="e.g., Tech Stocks, Dividend Growth, etc."
                  maxlength="50"
                  required
                  ref="watchlistNameInput"
                />
                <div class="form-text">
                  {{ newWatchlistName.length }}/50 characters
                </div>
              </div>
              <div class="alert alert-info d-flex align-items-start" role="alert">
                <i class="bi bi-info-circle me-2 mt-1"></i>
                <div>
                  <strong>Tip:</strong> You can add stocks to this watchlist after creating it.
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleAddWatchlist"
              :disabled="!newWatchlistName.trim()"
            >
              <i class="bi bi-check-circle me-1"></i>
              Create Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

// Composables
const { watchlists, activeWatchlistId, setActiveWatchlist, addWatchlist, removeStockFromWatchlist } = useWatchlists();

// State
const selectedPeriod = ref('1d');
const sortBy = ref('ticker');
const lastUpdated = ref('');
const newWatchlistName = ref('');
const addWatchlistModalRef = ref<HTMLElement | null>(null);
const watchlistNameInput = ref<HTMLInputElement | null>(null);

// Bootstrap Modal instance
let modalInstance: any = null;

// Computed
const activeWatchlist = computed(() => {
  return watchlists.value.find(w => w.id === activeWatchlistId.value);
});

const sortedStocks = computed(() => {
  if (!activeWatchlist.value) return [];

  const stocks = [...activeWatchlist.value.stocks];

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
const showAddWatchlistModal = () => {
  if (modalInstance) {
    newWatchlistName.value = '';
    modalInstance.show();
    // Focus on input after modal is shown
    setTimeout(() => {
      watchlistNameInput.value?.focus();
    }, 300);
  }
};

const handleAddWatchlist = () => {
  const name = newWatchlistName.value.trim();
  if (name) {
    addWatchlist(name);
    newWatchlistName.value = '';
    if (modalInstance) {
      modalInstance.hide();
    }
  }
};

const handleRemoveStock = (ticker: string) => {
  if (confirm(`Remove ${ticker} from watchlist?`)) {
    removeStockFromWatchlist(activeWatchlistId.value, ticker);
  }
};

const handleShare = () => {
  // TODO: Implement share functionality
  alert('Share functionality coming soon!');
};

const handleExport = () => {
  // TODO: Implement export functionality
  alert('Export functionality coming soon!');
};

const updateLastUpdated = () => {
  const now = new Date();
  lastUpdated.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lifecycle
onMounted(async () => {
  updateLastUpdated();
  setInterval(updateLastUpdated, 60000); // Update every minute

  // Initialize Bootstrap modal
  if (process.client && addWatchlistModalRef.value) {
    const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    modalInstance = new bootstrap.Modal(addWatchlistModalRef.value);
  }
});
</script>

<style scoped>
.watchlists-page {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header h1 {
  font-weight: 600;
  color: var(--tf-primary);
}

.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #dee2e6;
  color: var(--tf-primary);
}

.nav-tabs .nav-link.active {
  color: var(--tf-primary);
  border-bottom-color: var(--tf-primary);
  background: none;
}

.nav-item {
  position: relative;
}

.watchlist-detail-link {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.2s;
  text-decoration: none;
}

.nav-item:hover .watchlist-detail-link {
  opacity: 1;
}

.watchlist-detail-link:hover {
  color: var(--tf-primary);
}

.watchlist-toolbar {
  border: 1px solid #dee2e6;
}

.empty-state {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4rem 2rem !important;
}

@media (max-width: 768px) {
  .watchlist-toolbar .row {
    flex-direction: column;
  }

  .watchlist-toolbar .col-md-3 {
    width: 100%;
  }
}
</style>
