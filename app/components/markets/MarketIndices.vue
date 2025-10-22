<template>
  <div class="market-indices">
    <div class="row g-0">
      <div
        v-for="index in indices"
        :key="index.symbol"
        class="col-12 col-md-6 col-lg-4 col-xl-3"
      >
        <div class="index-card">
          <div class="index-header">
            <div class="index-symbol">{{ index.symbol }}</div>
            <div class="index-name text-muted small">{{ index.name }}</div>
          </div>
          <div class="index-body">
            <div class="index-price">{{ formatPrice(index.price) }}</div>
            <div class="index-change" :class="getChangeClass(index.change)">
              <i :class="getChangeIcon(index.change)"></i>
              {{ formatChange(index.change) }} ({{ formatPercent(index.changePercent) }})
            </div>
          </div>
          <div class="index-footer">
            <div class="d-flex justify-content-between text-muted small">
              <span>High: {{ formatPrice(index.high) }}</span>
              <span>Low: {{ formatPrice(index.low) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

interface Props {
  indices: MarketIndex[];
}

defineProps<Props>();

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
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
.market-indices {
  background: white;
}

.index-card {
  padding: 1.25rem;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.index-card:hover {
  background-color: #f8f9fa;
}

.index-header {
  margin-bottom: 0.75rem;
}

.index-symbol {
  font-size: 1rem;
  font-weight: 700;
  color: var(--tf-primary);
  margin-bottom: 0.25rem;
}

.index-name {
  font-size: 0.8rem;
  color: #6c757d;
}

.index-body {
  margin-bottom: 0.75rem;
}

.index-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--tf-gray-500);
  margin-bottom: 0.5rem;
}

.index-change {
  font-size: 0.95rem;
  font-weight: 600;
}

.index-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #e9ecef;
}

.text-success {
  color: var(--tf-success) !important;
}

.text-danger {
  color: var(--tf-danger) !important;
}

@media (max-width: 767px) {
  .index-card {
    border-right: none;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .col-md-6:nth-child(2n) .index-card {
    border-right: none;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .col-lg-4:nth-child(3n) .index-card {
    border-right: none;
  }
}

@media (min-width: 1200px) {
  .col-xl-3:nth-child(4n) .index-card {
    border-right: none;
  }
}
</style>
