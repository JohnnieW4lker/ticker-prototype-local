<template>
  <div class="performance-metric">
    <div class="metric-label">{{ label }}</div>
    <div
      class="metric-value"
      :class="{
        'price-positive': value > 0,
        'price-negative': value < 0,
        'price-neutral': value === 0,
      }"
    >
      <i
        v-if="value !== 0"
        class="bi me-1"
        :class="value > 0 ? 'bi-arrow-up' : 'bi-arrow-down'"
      ></i>
      {{ value > 0 ? '+' : '' }}{{ value.toFixed(2) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: number;
}

defineProps<Props>();
</script>

<style scoped>
.performance-metric {
  text-align: center;
  padding: 1rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 700;
}
</style>
