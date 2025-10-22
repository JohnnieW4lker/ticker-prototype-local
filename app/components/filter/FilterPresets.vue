<template>
  <div class="filter-presets">
    <h6 class="mb-3">Quick Presets</h6>

    <div class="row g-3">
      <div
        v-for="preset in presets"
        :key="preset.id"
        class="col-md-6 col-lg-4"
      >
        <div class="preset-card" @click="applyPreset(preset)">
          <div class="preset-icon">
            <i :class="preset.icon"></i>
          </div>
          <div class="preset-info">
            <h6 class="preset-title">{{ preset.name }}</h6>
            <p class="preset-description">{{ preset.description }}</p>
          </div>
          <div class="preset-action">
            <i class="bi bi-arrow-right-circle"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdvancedFilter } from '~/types/filter';

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  filters: Partial<AdvancedFilter>;
}

const emit = defineEmits<{
  apply: [filters: Partial<AdvancedFilter>]
}>();

const presets: Preset[] = [
  {
    id: 'high_dividend',
    name: 'High Dividend Stocks',
    description: 'Stocks with dividend yield > 3%',
    icon: 'bi bi-cash-coin',
    filters: {
      minDividendYield: 3,
      minMarketCap: 2000000000,
    },
  },
  {
    id: 'high_eps',
    name: 'High EPS Stocks',
    description: 'Strong earnings per share',
    icon: 'bi bi-graph-up-arrow',
    filters: {
      minEPS: 5,
      minMarketCap: 1000000000,
    },
  },
  {
    id: 'undervalued',
    name: 'Undervalued Stocks',
    description: 'Low P/E ratio stocks',
    icon: 'bi bi-tag',
    filters: {
      maxPE: 15,
      minMarketCap: 300000000,
    },
  },
  {
    id: 'growth',
    name: 'Growth Stocks',
    description: 'High growth potential',
    icon: 'bi bi-rocket-takeoff',
    filters: {
      minEPS: 3,
      minROE: 15,
      sectors: ['technology'],
    },
  },
  {
    id: 'large_cap',
    name: 'Large Cap Leaders',
    description: 'Market cap > $10B',
    icon: 'bi bi-building',
    filters: {
      minMarketCap: 10000000000,
    },
  },
  {
    id: 'small_cap',
    name: 'Small Cap Opportunities',
    description: 'Market cap $300M - $2B',
    icon: 'bi bi-gem',
    filters: {
      minMarketCap: 300000000,
      maxMarketCap: 2000000000,
    },
  },
];

const applyPreset = (preset: Preset) => {
  emit('apply', preset.filters);
};
</script>

<style scoped>
.filter-presets {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--tf-gray-200);
}

h6 {
  color: var(--tf-primary);
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--tf-action);
}

.preset-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--tf-gray-100);
  border: 2px solid var(--tf-gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
}

.preset-card:hover {
  border-color: var(--tf-action);
  background: white;
  box-shadow: 0 4px 8px rgba(60, 183, 145, 0.1);
  transform: translateY(-2px);
}

.preset-icon {
  font-size: 2rem;
  color: var(--tf-action);
  margin-right: 1rem;
  flex-shrink: 0;
}

.preset-info {
  flex: 1;
}

.preset-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--tf-primary);
  margin-bottom: 0.25rem;
}

.preset-description {
  font-size: 0.8rem;
  color: var(--tf-gray-400);
  margin: 0;
}

.preset-action {
  font-size: 1.5rem;
  color: var(--tf-gray-300);
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.preset-card:hover .preset-action {
  color: var(--tf-action);
}
</style>
