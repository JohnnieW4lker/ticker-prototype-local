<template>
  <div class="market-movers">
    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th class="text-start">Symbol</th>
            <th class="text-start">Company</th>
            <th class="text-end">Price</th>
            <th class="text-end">Change</th>
            <th class="text-end" v-if="type === 'active'">Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stock, index) in stocks" :key="stock.ticker" class="stock-row">
            <td class="text-start">
              <div class="d-flex align-items-center">
                <span class="rank-badge me-2">{{ index + 1 }}</span>
                <NuxtLink :to="`/stock/${stock.ticker}`" class="ticker-link fw-bold">
                  {{ stock.ticker }}
                </NuxtLink>
              </div>
            </td>
            <td class="text-start company-name">{{ stock.name }}</td>
            <td class="text-end fw-semibold">{{ formatPrice(stock.price) }}</td>
            <td class="text-end">
              <span :class="getChangeClass(stock.changePercent)">
                <i :class="getChangeIcon(stock.changePercent)"></i>
                {{ formatChange(stock.change) }}
                <span class="d-none d-md-inline">({{ formatPercent(stock.changePercent) }})</span>
              </span>
            </td>
            <td class="text-end" v-if="type === 'active'">
              <span class="badge bg-secondary">{{ formatVolume(stock.volume) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketStock } from '~/composables/useMarkets';

interface Props {
  stocks: MarketStock[];
  type: 'gainers' | 'losers' | 'active';
}

defineProps<Props>();

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatChange = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
};

const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const formatVolume = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  } else {
    return value.toLocaleString();
  }
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
</script>

<style scoped>
.market-movers {
  background: white;
}

.table {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.table thead th {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #6c757d;
  padding: 0.875rem 0.75rem;
  border-bottom: 2px solid #dee2e6;
}

.table tbody td {
  padding: 0.875rem 0.75rem;
  vertical-align: middle;
}

.stock-row {
  transition: background-color 0.15s ease;
}

.stock-row:hover {
  background-color: #f8f9fa;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--tf-gray-300);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
}

.ticker-link {
  color: var(--tf-primary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.ticker-link:hover {
  color: var(--tf-action);
  text-decoration: underline;
}

.company-name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-success {
  color: var(--tf-success) !important;
  font-weight: 600;
}

.text-danger {
  color: var(--tf-danger) !important;
  font-weight: 600;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.85rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.75rem 0.5rem;
  }

  .company-name {
    max-width: 120px;
  }
}
</style>
