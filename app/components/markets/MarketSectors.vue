<template>
  <div class="market-sectors">
    <div class="sectors-grid">
      <div
        v-for="sector in sectors"
        :key="sector.name"
        class="sector-item"
        :style="getSectorStyle(sector.changePercent)"
      >
        <div class="sector-content">
          <div class="sector-name">{{ sector.name }}</div>
          <div class="sector-change">
            <i :class="getChangeIcon(sector.changePercent)"></i>
            {{ formatPercent(sector.changePercent) }}
          </div>
        </div>
      </div>
    </div>
    <div class="sectors-legend mt-3">
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">Performance Today</small>
        <div class="d-flex align-items-center gap-2">
          <div class="legend-item">
            <span class="legend-color" style="background: #dc3545;"></span>
            <small>Losers</small>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #ffc107;"></span>
            <small>Neutral</small>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #28a745;"></span>
            <small>Gainers</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Sector {
  name: string;
  changePercent: number;
}

interface Props {
  sectors: Sector[];
}

defineProps<Props>();

const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const getChangeIcon = (value: number): string => {
  if (value > 0) return 'bi bi-caret-up-fill';
  if (value < 0) return 'bi bi-caret-down-fill';
  return 'bi bi-dash';
};

const getSectorStyle = (changePercent: number) => {
  // Calculate color intensity based on change percentage
  const intensity = Math.min(Math.abs(changePercent) / 3, 1); // Max at 3%

  let bgColor: string;
  let textColor: string;

  if (changePercent > 0.5) {
    // Green for gainers
    const greenIntensity = Math.floor(255 - (intensity * 100));
    bgColor = `rgb(40, 167, 69, ${0.2 + intensity * 0.6})`;
    textColor = intensity > 0.5 ? '#fff' : '#155724';
  } else if (changePercent < -0.5) {
    // Red for losers
    const redIntensity = Math.floor(255 - (intensity * 100));
    bgColor = `rgb(220, 53, 69, ${0.2 + intensity * 0.6})`;
    textColor = intensity > 0.5 ? '#fff' : '#721c24';
  } else {
    // Yellow/neutral
    bgColor = 'rgba(255, 193, 7, 0.3)';
    textColor = '#856404';
  }

  return {
    backgroundColor: bgColor,
    color: textColor,
    borderColor: textColor
  };
};
</script>

<style scoped>
.market-sectors {
  width: 100%;
}

.sectors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.sector-item {
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sector-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sector-content {
  text-align: center;
  width: 100%;
}

.sector-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.sector-change {
  font-size: 1.1rem;
  font-weight: 700;
}

.sectors-legend {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .sectors-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .sector-item {
    min-height: 80px;
    padding: 0.75rem;
  }

  .sector-name {
    font-size: 0.8rem;
  }

  .sector-change {
    font-size: 1rem;
  }
}
</style>
