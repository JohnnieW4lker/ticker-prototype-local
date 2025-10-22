<template>
  <div class="market-breadth">
    <!-- Advance/Decline -->
    <div class="breadth-item mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="breadth-label">Advance/Decline</span>
        <span class="breadth-ratio" :class="getAdvanceDeclineClass">
          {{ breadth.advanceDeclineRatio.toFixed(2) }}
        </span>
      </div>
      <div class="progress" style="height: 24px;">
        <div
          class="progress-bar bg-success"
          :style="{ width: `${advancePercent}%` }"
        >
          <small class="fw-semibold">{{ breadth.advancing }}</small>
        </div>
        <div
          class="progress-bar bg-danger"
          :style="{ width: `${declinePercent}%` }"
        >
          <small class="fw-semibold">{{ breadth.declining }}</small>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <small class="text-success">Advancing</small>
        <small class="text-muted">{{ breadth.unchanged }} Unchanged</small>
        <small class="text-danger">Declining</small>
      </div>
    </div>

    <!-- New Highs/Lows -->
    <div class="breadth-item mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="breadth-label">New 52-Week Highs/Lows</span>
      </div>
      <div class="progress" style="height: 24px;">
        <div
          class="progress-bar bg-success"
          :style="{ width: `${newHighsPercent}%` }"
        >
          <small class="fw-semibold">{{ breadth.newHighs }}</small>
        </div>
        <div
          class="progress-bar bg-danger"
          :style="{ width: `${newLowsPercent}%` }"
        >
          <small class="fw-semibold">{{ breadth.newLows }}</small>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <small class="text-success">New Highs</small>
        <small class="text-danger">New Lows</small>
      </div>
    </div>

    <!-- Volume -->
    <div class="breadth-item mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="breadth-label">Up/Down Volume</span>
      </div>
      <div class="progress" style="height: 24px;">
        <div
          class="progress-bar bg-success"
          :style="{ width: `${upVolumePercent}%` }"
        >
          <small class="fw-semibold">{{ formatVolume(breadth.upVolume) }}</small>
        </div>
        <div
          class="progress-bar bg-danger"
          :style="{ width: `${downVolumePercent}%` }"
        >
          <small class="fw-semibold">{{ formatVolume(breadth.downVolume) }}</small>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <small class="text-success">Up Volume</small>
        <small class="text-danger">Down Volume</small>
      </div>
    </div>

    <!-- Market Sentiment -->
    <div class="breadth-item">
      <div class="breadth-label mb-3">Market Sentiment</div>
      <div class="sentiment-indicator">
        <div
          class="sentiment-meter"
          :style="{ left: `${sentimentPosition}%` }"
        >
          <div class="sentiment-arrow"></div>
        </div>
        <div class="sentiment-scale">
          <span class="text-danger">Bearish</span>
          <span class="text-muted">Neutral</span>
          <span class="text-success">Bullish</span>
        </div>
      </div>
      <div class="text-center mt-2">
        <span class="badge" :class="getSentimentBadgeClass">
          {{ breadth.sentiment }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MarketBreadth {
  advancing: number;
  declining: number;
  unchanged: number;
  advanceDeclineRatio: number;
  newHighs: number;
  newLows: number;
  upVolume: number;
  downVolume: number;
  sentiment: string;
}

interface Props {
  breadth: MarketBreadth;
}

const props = defineProps<Props>();

// Computed values
const advancePercent = computed(() => {
  const total = props.breadth.advancing + props.breadth.declining;
  return total > 0 ? (props.breadth.advancing / total) * 100 : 50;
});

const declinePercent = computed(() => {
  const total = props.breadth.advancing + props.breadth.declining;
  return total > 0 ? (props.breadth.declining / total) * 100 : 50;
});

const newHighsPercent = computed(() => {
  const total = props.breadth.newHighs + props.breadth.newLows;
  return total > 0 ? (props.breadth.newHighs / total) * 100 : 50;
});

const newLowsPercent = computed(() => {
  const total = props.breadth.newHighs + props.breadth.newLows;
  return total > 0 ? (props.breadth.newLows / total) * 100 : 50;
});

const upVolumePercent = computed(() => {
  const total = props.breadth.upVolume + props.breadth.downVolume;
  return total > 0 ? (props.breadth.upVolume / total) * 100 : 50;
});

const downVolumePercent = computed(() => {
  const total = props.breadth.upVolume + props.breadth.downVolume;
  return total > 0 ? (props.breadth.downVolume / total) * 100 : 50;
});

const sentimentPosition = computed(() => {
  // Map sentiment to position (0-100)
  const sentimentMap: Record<string, number> = {
    'Extremely Bearish': 10,
    'Bearish': 30,
    'Neutral': 50,
    'Bullish': 70,
    'Extremely Bullish': 90
  };
  return sentimentMap[props.breadth.sentiment] || 50;
});

const getAdvanceDeclineClass = computed(() => {
  return props.breadth.advanceDeclineRatio > 1 ? 'text-success' : 'text-danger';
});

const getSentimentBadgeClass = computed(() => {
  const sentiment = props.breadth.sentiment.toLowerCase();
  if (sentiment.includes('bullish')) return 'bg-success';
  if (sentiment.includes('bearish')) return 'bg-danger';
  return 'bg-secondary';
});

const formatVolume = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return value.toLocaleString();
};
</script>

<style scoped>
.market-breadth {
  padding: 0.5rem 0;
}

.breadth-item {
  padding-bottom: 1rem;
}

.breadth-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--tf-gray-500);
}

.breadth-ratio {
  font-size: 1.1rem;
  font-weight: 700;
}

.progress {
  border-radius: 6px;
  overflow: hidden;
  background-color: #e9ecef;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.6s ease;
}

.progress-bar small {
  color: white;
  font-size: 0.75rem;
}

.sentiment-indicator {
  position: relative;
  height: 40px;
  background: linear-gradient(to right, #dc3545 0%, #ffc107 50%, #28a745 100%);
  border-radius: 20px;
  margin-bottom: 0.5rem;
}

.sentiment-meter {
  position: absolute;
  top: -8px;
  transform: translateX(-50%);
  transition: left 0.6s ease;
}

.sentiment-arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid var(--tf-gray-500);
}

.sentiment-scale {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.5rem 0;
  font-size: 0.75rem;
  font-weight: 600;
}

.text-success {
  color: var(--tf-success) !important;
}

.text-danger {
  color: var(--tf-danger) !important;
}
</style>
