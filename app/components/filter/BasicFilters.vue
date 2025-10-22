<template>
  <div class="basic-filters">
    <div class="row g-3">
      <!-- Asset Type -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Asset Type</label>
        <select class="form-select" v-model="filters.assetTypes" multiple size="4">
          <option value="stock">Stocks</option>
          <option value="etf">ETFs</option>
          <option value="adr">ADRs</option>
          <option value="warrant">Warrants</option>
        </select>
      </div>

      <!-- Exchange -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Exchange</label>
        <select class="form-select" v-model="filters.exchanges" multiple size="4">
          <option value="nasdaq">NASDAQ</option>
          <option value="nyse">NYSE</option>
          <option value="nyse_american">NYSE American</option>
          <option value="nyse_arca">NYSE Arca</option>
          <option value="bats">BATS BZX</option>
        </select>
      </div>

      <!-- Sector -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Sector</label>
        <select class="form-select" v-model="filters.sectors">
          <option value="">All Sectors</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="financial">Financial</option>
          <option value="consumer_cyclical">Consumer Cyclical</option>
          <option value="consumer_defensive">Consumer Defensive</option>
          <option value="energy">Energy</option>
          <option value="communication">Communication Services</option>
          <option value="industrials">Industrials</option>
          <option value="utilities">Utilities</option>
          <option value="real_estate">Real Estate</option>
          <option value="materials">Materials</option>
        </select>
      </div>

      <!-- Industry -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Industry</label>
        <input
          type="text"
          class="form-control"
          v-model="filters.industries"
          placeholder="Search industry..."
        />
      </div>
    </div>

    <div class="row g-3 mt-2">
      <!-- Market Cap Range -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Market Cap (Min)</label>
        <select class="form-select" v-model="filters.minMarketCap">
          <option value="">Any</option>
          <option value="1000000">Micro ($1M+)</option>
          <option value="300000000">Small ($300M+)</option>
          <option value="2000000000">Mid ($2B+)</option>
          <option value="10000000000">Large ($10B+)</option>
          <option value="200000000000">Mega ($200B+)</option>
        </select>
      </div>

      <div class="col-md-6 col-lg-3">
        <label class="form-label">Market Cap (Max)</label>
        <select class="form-select" v-model="filters.maxMarketCap">
          <option value="">Any</option>
          <option value="300000000">Micro (Under $300M)</option>
          <option value="2000000000">Small (Under $2B)</option>
          <option value="10000000000">Mid (Under $10B)</option>
          <option value="200000000000">Large (Under $200B)</option>
        </select>
      </div>

      <!-- Price Range -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Price Range</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.minPrice"
            placeholder="Min"
            min="0"
            step="0.01"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.maxPrice"
            placeholder="Max"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <!-- Volume -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Min Volume</label>
        <select class="form-select" v-model="filters.minVolume">
          <option value="">Any</option>
          <option value="50000">50K+</option>
          <option value="100000">100K+</option>
          <option value="500000">500K+</option>
          <option value="1000000">1M+</option>
          <option value="5000000">5M+</option>
          <option value="10000000">10M+</option>
        </select>
      </div>
    </div>

    <div class="row g-3 mt-2">
      <!-- Dividend Yield -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Min Dividend Yield (%)</label>
        <input
          type="number"
          class="form-control"
          v-model.number="filters.minDividendYield"
          placeholder="0"
          min="0"
          step="0.1"
        />
      </div>

      <!-- P/E Ratio -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">P/E Ratio Range</label>
        <div class="input-group">
          <input
            type="number"
            class="form-control"
            v-model.number="filters.minPE"
            placeholder="Min"
            min="0"
            step="0.1"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="filters.maxPE"
            placeholder="Max"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <!-- EPS -->
      <div class="col-md-6 col-lg-3">
        <label class="form-label">Min EPS</label>
        <input
          type="number"
          class="form-control"
          v-model.number="filters.minEPS"
          placeholder="0"
          step="0.01"
        />
      </div>

      <!-- Action Buttons -->
      <div class="col-md-6 col-lg-3 d-flex align-items-end">
        <button class="btn btn-outline-secondary me-2" @click="resetFilters">
          <i class="bi bi-arrow-counterclockwise me-1"></i>
          Reset
        </button>
        <button class="btn btn-primary" @click="applyFilters">
          <i class="bi bi-funnel-fill me-1"></i>
          Filter Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdvancedFilter } from '~/types/filter';

const emit = defineEmits<{
  apply: [filters: AdvancedFilter]
}>();

const filters = ref<AdvancedFilter>({
  assetTypes: [],
  exchanges: [],
  sectors: undefined,
  industries: [],
  minMarketCap: undefined,
  maxMarketCap: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minVolume: undefined,
  minDividendYield: undefined,
  minPE: undefined,
  maxPE: undefined,
  minEPS: undefined,
});

const applyFilters = () => {
  emit('apply', { ...filters.value });
};

const resetFilters = () => {
  filters.value = {
    assetTypes: [],
    exchanges: [],
    sectors: undefined,
    industries: [],
    minMarketCap: undefined,
    maxMarketCap: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minVolume: undefined,
    minDividendYield: undefined,
    minPE: undefined,
    maxPE: undefined,
    minEPS: undefined,
  };
};
</script>

<style scoped>
.basic-filters {
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

.form-select[multiple] {
  height: auto;
}
</style>
