<template>
  <div class="watchlist-table-container">
    <div class="table-responsive">
      <table class="table table-hover watchlist-table">
        <thead class="table-light sticky-top">
          <tr>
            <th class="text-start">Ticker</th>
            <th class="text-start">Company Name</th>
            <th class="text-end">Price</th>
            <th class="text-end">Change</th>
            <th class="text-end">Market Cap</th>
            <th class="text-end">P/E Ratio</th>
            <th class="text-end">EPS</th>
            <th class="text-end">Div Yield</th>
            <th class="text-end">Performance</th>
            <th class="text-end">Volume</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in stocks" :key="stock.ticker" class="stock-row">
            <!-- Ticker -->
            <td class="text-start">
              <NuxtLink :to="`/stock/${stock.ticker}`" class="ticker-link fw-bold">
                {{ stock.ticker }}
              </NuxtLink>
            </td>

            <!-- Company Name -->
            <td class="text-start company-name">
              <div class="d-flex align-items-center">
                <span>{{ stock.name }}</span>
                <span v-if="stock.hasNote" class="ms-2 text-warning" title="Has notes">
                  <i class="bi bi-sticky-fill"></i>
                </span>
              </div>
            </td>

            <!-- Price -->
            <td class="text-end fw-semibold">
              {{ formatCurrency(stock.price) }}
            </td>

            <!-- Change -->
            <td class="text-end">
              <span :class="getChangeClass(stock.change)">
                <i :class="getChangeIcon(stock.change)"></i>
                {{ formatPercent(stock.change) }}
              </span>
            </td>

            <!-- Market Cap -->
            <td class="text-end">
              {{ formatMarketCap(stock.marketCap) }}
            </td>

            <!-- P/E Ratio -->
            <td class="text-end">
              {{ stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A' }}
            </td>

            <!-- EPS -->
            <td class="text-end">
              {{ stock.eps ? formatCurrency(stock.eps) : 'N/A' }}
            </td>

            <!-- Dividend Yield -->
            <td class="text-end">
              <div class="d-flex flex-column align-items-end">
                <span>{{ stock.dividendYield ? formatPercent(stock.dividendYield) : 'N/A' }}</span>
                <small v-if="stock.exDividendDate" class="text-muted">
                  Ex: {{ formatDate(stock.exDividendDate) }}
                </small>
              </div>
            </td>

            <!-- Performance -->
            <td class="text-end">
              <span :class="getChangeClass(stock.performance[period])">
                {{ formatPercent(stock.performance[period]) }}
              </span>
            </td>

            <!-- Volume -->
            <td class="text-end">
              {{ formatVolume(stock.volume) }}
            </td>

            <!-- Actions -->
            <td class="text-center">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  title="Add note"
                  @click="handleAddNote(stock.ticker)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger"
                  title="Remove"
                  @click="handleRemove(stock.ticker)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="stocks.length === 0" class="empty-watchlist text-center py-5">
      <i class="bi bi-inbox display-4 text-muted"></i>
      <p class="text-muted mt-3">No stocks in this watchlist</p>
      <button class="btn btn-primary btn-sm">
        <i class="bi bi-plus-circle me-1"></i>
        Add Stocks
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  peRatio: number | null;
  eps: number | null;
  dividendYield: number | null;
  exDividendDate: string | null;
  performance: Record<string, number>;
  volume: number;
  hasNote: boolean;
}

interface Props {
  stocks: Stock[];
  period: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'remove-stock', ticker: string): void;
}>();

// Formatting helpers
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const formatMarketCap = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else {
    return `$${value.toLocaleString()}`;
  }
};

const formatVolume = (value: number): string => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toLocaleString();
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const getChangeClass = (value: number): string => {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-danger';
  return 'text-muted';
};

const getChangeIcon = (value: number): string => {
  if (value > 0) return 'bi bi-caret-up-fill';
  if (value < 0) return 'bi bi-caret-down-fill';
  return 'bi bi-dash';
};

// Event handlers
const handleRemove = (ticker: string) => {
  emit('remove-stock', ticker);
};

const handleAddNote = (ticker: string) => {
  // TODO: Implement add note functionality
  alert(`Add note for ${ticker} - Coming soon!`);
};
</script>

<style scoped>
.watchlist-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.watchlist-table {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.watchlist-table thead {
  background-color: #f8f9fa;
}

.watchlist-table th {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #6c757d;
  padding: 1rem 0.75rem;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.watchlist-table td {
  padding: 0.875rem 0.75rem;
  vertical-align: middle;
}

.stock-row {
  transition: background-color 0.15s ease;
}

.stock-row:hover {
  background-color: #f8f9fa;
}

.ticker-link {
  color: var(--tf-primary);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.15s ease;
}

.ticker-link:hover {
  color: var(--tf-action);
  text-decoration: underline;
}

.company-name {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-success {
  color: var(--tf-success) !important;
}

.text-danger {
  color: var(--tf-danger) !important;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}

.empty-watchlist {
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem;
}

@media (max-width: 1200px) {
  .watchlist-table {
    font-size: 0.85rem;
  }

  .watchlist-table th,
  .watchlist-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 768px) {
  .company-name {
    max-width: 150px;
  }

  .watchlist-table th,
  .watchlist-table td {
    font-size: 0.75rem;
    padding: 0.5rem 0.25rem;
  }
}
</style>
