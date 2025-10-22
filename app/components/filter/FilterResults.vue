<template>
  <div class="filter-results">
    <!-- Results Header -->
    <div class="results-header mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">
            <i class="bi bi-check-circle-fill text-action me-2"></i>
            Filter Results
          </h5>
          <p class="text-muted mb-0">
            Found {{ pagination.totalItems || 0 }} stocks matching your criteria
          </p>
        </div>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" v-model="pageSize" @change="changePageSize" style="width: auto;">
            <option value="30">30 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
            <option value="200">200 per page</option>
          </select>
          <button class="btn btn-sm btn-outline-secondary" @click="exportResults">
            <i class="bi bi-download me-1"></i>
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-action" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-3">Filtering stocks...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="stocks.length === 0" class="empty-state text-center py-5">
      <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
      <h5 class="text-muted">No stocks found</h5>
      <p class="text-muted">Try adjusting your filter criteria</p>
    </div>

    <!-- Results Table -->
    <div v-else class="results-table">
      <CommonDataTable
        :data="stocks"
        :columns="columns"
        row-key="symbol"
        :pagination="pagination"
        @row-click="handleRowClick"
        @page-change="handlePageChange"
      >
        <template #cell-symbol="{ row }">
          <div>
            <strong class="text-primary">{{ row.symbol }}</strong>
            <div class="small text-muted">{{ row.name }}</div>
          </div>
        </template>

        <template #cell-price="{ value }">
          <strong>${{ value.toFixed(2) }}</strong>
        </template>

        <template #cell-change="{ row }">
          <div :class="getChangeClass(row.change)">
            <i :class="getChangeIcon(row.change)" class="me-1"></i>
            {{ row.change >= 0 ? '+' : '' }}{{ row.change.toFixed(2) }}
            ({{ row.changePercent >= 0 ? '+' : '' }}{{ row.changePercent.toFixed(2) }}%)
          </div>
        </template>

        <template #cell-marketCap="{ value }">
          {{ formatMarketCap(value) }}
        </template>

        <template #cell-volume="{ value }">
          {{ formatVolume(value) }}
        </template>

        <template #cell-pe="{ value }">
          <span v-if="value">{{ value.toFixed(2) }}</span>
          <span v-else class="text-muted">-</span>
        </template>

        <template #cell-eps="{ value }">
          <span v-if="value">{{ value.toFixed(2) }}</span>
          <span v-else class="text-muted">-</span>
        </template>

        <template #cell-dividendYield="{ value }">
          <span v-if="value" class="badge bg-success">{{ value.toFixed(2) }}%</span>
          <span v-else class="text-muted">-</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" @click.stop="addToWatchlist(row)" title="Add to Watchlist">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-outline-secondary" @click.stop="viewChart(row)" title="View Chart">
              <i class="bi bi-graph-up"></i>
            </button>
          </div>
        </template>
      </CommonDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '~/types/stock';
import type { PaginationConfig } from '~/types/filter';

interface Props {
  stocks: Stock[];
  loading: boolean;
  pagination: PaginationConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  pageChange: [page: number]
  pageSizeChange: [size: number]
  addToWatchlist: [stock: Stock]
}>();

const pageSize = ref(50);

const columns = [
  { key: 'symbol', label: 'Symbol', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'change', label: 'Change', sortable: true },
  { key: 'marketCap', label: 'Market Cap', sortable: true },
  { key: 'volume', label: 'Volume', sortable: true },
  { key: 'pe', label: 'P/E', sortable: true },
  { key: 'eps', label: 'EPS', sortable: true },
  { key: 'dividendYield', label: 'Div Yield', sortable: true },
  { key: 'sector', label: 'Sector', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

const formatMarketCap = (value: number) => {
  if (value >= 1000000000000) {
    return `$${(value / 1000000000000).toFixed(2)}T`;
  } else if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toFixed(0)}`;
};

const formatVolume = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toString();
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

const handleRowClick = (row: Stock) => {
  navigateTo(`/stock/${row.symbol}`);
};

const handlePageChange = (page: number) => {
  emit('pageChange', page);
};

const changePageSize = () => {
  emit('pageSizeChange', Number(pageSize.value));
};

const addToWatchlist = (stock: Stock) => {
  emit('addToWatchlist', stock);
};

const viewChart = (stock: Stock) => {
  navigateTo(`/stock/${stock.symbol}`);
};

const exportResults = () => {
  // TODO: Implement CSV export
  alert('Export functionality coming soon!');
};
</script>

<style scoped>
.filter-results {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--tf-gray-200);
  padding: 1.5rem;
}

.results-header h5 {
  color: var(--tf-primary);
  font-weight: 700;
}

.empty-state {
  background: var(--tf-gray-100);
  border-radius: 8px;
  padding: 3rem;
}

.results-table {
  margin-top: 1rem;
}
</style>
