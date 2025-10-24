<template>
  <div class="screener-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h1 class="mb-1">
            <i class="bi bi-funnel-fill text-action me-2"></i>
            Filters
          </h1>
          <p class="text-muted mb-0">
            Filter stocks by financial metrics, performance, and fundamental analysis
          </p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="saveFilter">
            <i class="bi bi-bookmark me-1"></i>
            Save Filter
          </button>
          <button class="btn btn-outline-secondary" @click="loadFilter">
            <i class="bi bi-folder-open me-1"></i>
            Load Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'presets' }"
          @click="activeTab = 'presets'"
        >
          <i class="bi bi-star me-1"></i>
          Presets
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'basic' }"
          @click="activeTab = 'basic'"
        >
          <i class="bi bi-filter me-1"></i>
          Basic Filters
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'advanced' }"
          @click="activeTab = 'advanced'"
        >
          <i class="bi bi-sliders me-1"></i>
          Advanced Filters
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content mb-4">
      <!-- Presets Tab -->
      <div v-show="activeTab === 'presets'">
        <FilterPresets @apply="handlePresetApply" />
      </div>

      <!-- Basic Filters Tab -->
      <div v-show="activeTab === 'basic'">
        <FilterBasicFilters @apply="handleBasicFiltersApply" />
      </div>

      <!-- Advanced Filters Tab -->
      <div v-show="activeTab === 'advanced'">
        <FilterAdvancedFilters @apply="handleAdvancedFiltersApply" />
      </div>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters" class="active-filters mb-4">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2">
                <i class="bi bi-funnel-fill text-action me-2"></i>
                Active Filters
              </h6>
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="(filter, key) in activeFiltersList"
                  :key="key"
                  class="badge bg-action"
                >
                  {{ filter.label }}: {{ filter.value }}
                  <button
                    type="button"
                    class="btn-close btn-close-white ms-2"
                    style="font-size: 0.6rem;"
                    @click="removeFilter(key)"
                  ></button>
                </span>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" @click="clearAllFilters">
              <i class="bi bi-x-circle me-1"></i>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <FilterResults
      :stocks="filteredStocks"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @add-to-watchlist="handleAddToWatchlist"
    />
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '~/types/stock';
import type { AdvancedFilter, PaginationConfig } from '~/types/filter';

const api = useApi();

const activeTab = ref('presets');
const loading = ref(false);
const currentFilters = ref<Partial<AdvancedFilter>>({});
const allStocks = ref<Stock[]>([]);
const filteredStocks = ref<Stock[]>([]);

const pagination = ref<PaginationConfig>({
  page: 1,
  pageSize: 50,
  totalItems: 0,
  totalPages: 0,
});

const hasActiveFilters = computed(() => {
  return Object.keys(currentFilters.value).length > 0;
});

const activeFiltersList = computed(() => {
  const filters: Record<string, { label: string; value: string }> = {};

  Object.entries(currentFilters.value).forEach(([key, value]) => {
    if (value === undefined || value === 0 || value === null) return;

    let label = key.replace(/([A-Z])/g, ' $1').trim();
    label = label.charAt(0).toUpperCase() + label.slice(1);

    let displayValue = String(value);
    if (key.includes('MarketCap')) {
      const num = Number(value);
      if (num >= 1000000000) {
        displayValue = `$${(num / 1000000000).toFixed(1)}B`;
      } else if (num >= 1000000) {
        displayValue = `$${(num / 1000000).toFixed(1)}M`;
      }
    }

    filters[key] = { label, value: displayValue };
  });

  return filters;
});

const handlePresetApply = async (filters: Partial<AdvancedFilter>) => {
  currentFilters.value = { ...filters };
  await applyFilters();
};

const handleBasicFiltersApply = async (filters: AdvancedFilter) => {
  currentFilters.value = { ...currentFilters.value, ...filters };
  await applyFilters();
};

const handleAdvancedFiltersApply = async (filters: Partial<AdvancedFilter>) => {
  currentFilters.value = { ...currentFilters.value, ...filters };
  await applyFilters();
};

const applyFilters = async () => {
  try {
    loading.value = true;

    // Get stocks with filters
    const result = await api.getStocks(
      currentFilters.value as AdvancedFilter,
      pagination.value.page,
      pagination.value.pageSize
    );

    filteredStocks.value = result.stocks;
    pagination.value = result.pagination;
  } catch (error) {
    console.error('Error applying filters:', error);
  } finally {
    loading.value = false;
  }
};

const removeFilter = (key: string) => {
  delete currentFilters.value[key as keyof AdvancedFilter];
  applyFilters();
};

const clearAllFilters = () => {
  currentFilters.value = {};
  filteredStocks.value = [];
  pagination.value.totalItems = 0;
  pagination.value.totalPages = 0;
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  applyFilters();
};

const handlePageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.page = 1;
  applyFilters();
};

const handleAddToWatchlist = (stock: Stock) => {
  // TODO: Implement add to watchlist
  alert(`Add ${stock.symbol} to watchlist - Coming soon!`);
};

const saveFilter = () => {
  // TODO: Implement save filter
  alert('Save filter functionality coming soon!');
};

const loadFilter = () => {
  // TODO: Implement load filter
  alert('Load filter functionality coming soon!');
};

// Initial load - show some default stocks
onMounted(async () => {
  await applyFilters();
});
</script>

<style scoped>
.screener-page {
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

.page-header h1 {
  color: var(--tf-primary);
  font-weight: 700;
}

.nav-tabs .nav-link {
  color: var(--tf-gray-500);
  font-weight: 500;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 0.75rem 1.5rem;
}

.nav-tabs .nav-link:hover {
  border-color: var(--tf-gray-300);
  color: var(--tf-primary);
}

.nav-tabs .nav-link.active {
  border-color: var(--tf-action);
  color: var(--tf-action);
  font-weight: 700;
}

.tab-content {
  min-height: 300px;
}

.active-filters .card {
  border-color: var(--tf-action);
  background: rgba(60, 183, 145, 0.05);
}

.active-filters h6 {
  color: var(--tf-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.badge.bg-action {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}
</style>
