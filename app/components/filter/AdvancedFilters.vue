<template>
  <div class="advanced-filters">
    <h6 class="mb-3">Financial Metrics</h6>

    <div class="row g-3">
      <!-- ROE -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Return on Equity (ROE %)</label>
        <div class="input-group input-group-sm">
          <input
            type="number"
            class="form-control"
            v-model.number="filters.minROE"
            placeholder="Min"
            step="0.1"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.maxROE"
            placeholder="Max"
            step="0.1"
          />
        </div>
      </div>

      <!-- ROA -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Return on Assets (ROA %)</label>
        <div class="input-group input-group-sm">
          <input
            type="number"
            class="form-control"
            v-model.number="filters.minROA"
            placeholder="Min"
            step="0.1"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.maxROA"
            placeholder="Max"
            step="0.1"
          />
        </div>
      </div>

      <!-- Current Ratio -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Current Ratio</label>
        <div class="input-group input-group-sm">
          <input
            type="number"
            class="form-control"
            v-model.number="filters.minCurrentRatio"
            placeholder="Min"
            step="0.1"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.maxCurrentRatio"
            placeholder="Max"
            step="0.1"
          />
        </div>
      </div>

      <!-- Debt to Equity -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Debt to Equity</label>
        <div class="input-group input-group-sm">
          <input
            type="number"
            class="form-control"
            v-model.number="filters.minDebtToEquity"
            placeholder="Min"
            step="0.1"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.maxDebtToEquity"
            placeholder="Max"
            step="0.1"
          />
        </div>
      </div>
    </div>

    <h6 class="mt-4 mb-3">Performance Metrics</h6>

    <div class="row g-3">
      <!-- 52 Week Performance -->
      <div class="col-md-6">
        <label class="form-label">52-Week Price Position</label>
        <div class="btn-group w-100" role="group">
          <input
            type="radio"
            class="btn-check"
            id="price-any"
            v-model="filters.pricePosition"
            value=""
          />
          <label class="btn btn-outline-secondary" for="price-any">Any</label>

          <input
            type="radio"
            class="btn-check"
            id="price-high"
            v-model="filters.pricePosition"
            value="near_high"
          />
          <label class="btn btn-outline-secondary" for="price-high">Near High</label>

          <input
            type="radio"
            class="btn-check"
            id="price-low"
            v-model="filters.pricePosition"
            value="near_low"
          />
          <label class="btn btn-outline-secondary" for="price-low">Near Low</label>
        </div>
      </div>

      <!-- Earnings Date -->
      <div class="col-md-6">
        <label class="form-label">Next Earnings</label>
        <select class="form-select form-select-sm" v-model="filters.earningsDate">
          <option value="">Any Time</option>
          <option value="this_week">This Week</option>
          <option value="next_week">Next Week</option>
          <option value="this_month">This Month</option>
        </select>
      </div>
    </div>

    <div class="row g-3 mt-2">
      <div class="col-12 d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" @click="resetFilters">
          <i class="bi bi-arrow-counterclockwise me-1"></i>
          Reset Advanced
        </button>
        <button class="btn btn-primary" @click="applyFilters">
          <i class="bi bi-funnel-fill me-1"></i>
          Apply Advanced
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdvancedFilter } from '~/types/filter';

const emit = defineEmits<{
  apply: [filters: Partial<AdvancedFilter>]
}>();

const filters = ref({
  minROE: undefined as number | undefined,
  maxROE: undefined as number | undefined,
  minROA: undefined as number | undefined,
  maxROA: undefined as number | undefined,
  minCurrentRatio: undefined as number | undefined,
  maxCurrentRatio: undefined as number | undefined,
  minDebtToEquity: undefined as number | undefined,
  maxDebtToEquity: undefined as number | undefined,
  pricePosition: '' as string,
  earningsDate: '' as string,
});

const applyFilters = () => {
  emit('apply', { ...filters.value });
};

const resetFilters = () => {
  filters.value = {
    minROE: undefined,
    maxROE: undefined,
    minROA: undefined,
    maxROA: undefined,
    minCurrentRatio: undefined,
    maxCurrentRatio: undefined,
    minDebtToEquity: undefined,
    maxDebtToEquity: undefined,
    pricePosition: '',
    earningsDate: '',
  };
};
</script>

<style scoped>
.advanced-filters {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--tf-gray-200);
}

.form-label {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

h6 {
  color: var(--tf-primary);
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--tf-action);
}
</style>
