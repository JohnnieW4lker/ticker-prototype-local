<template>
  <div class="card stock-chart">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Price Chart</h5>
      <div class="d-flex gap-2">
        <!-- Chart Type Selector -->
        <div class="btn-group btn-group-sm" role="group">
          <button
            type="button"
            class="btn"
            :class="chartType === 'line' ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="chartType = 'line'"
          >
            Line
          </button>
          <button
            type="button"
            class="btn"
            :class="chartType === 'candle' ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="chartType = 'candle'"
          >
            Candle
          </button>
        </div>

        <!-- Time Period Selector -->
        <div class="btn-group btn-group-sm" role="group">
          <button
            v-for="period in timePeriods"
            :key="period.value"
            type="button"
            class="btn"
            :class="selectedPeriod === period.value ? 'btn-primary' : 'btn-outline-primary'"
            @click="selectedPeriod = period.value"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div v-if="chartData.length > 0" class="chart-container">
        <ClientOnly>
          <apexchart
            :type="chartType === 'line' ? 'area' : 'candlestick'"
            :options="chartOptions"
            :series="chartSeries"
            height="400"
          />
        </ClientOnly>
      </div>

      <div v-else class="text-center text-muted py-5">
        No chart data available
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import type { PricePoint } from '~/types/stock';

interface Props {
  symbol: string;
  priceHistory: PricePoint[];
}

const props = defineProps<Props>();

// State
const selectedPeriod = ref('1M');
const chartType = ref<'line' | 'candle'>('line');

const timePeriods = [
  { label: '5D', value: '5D', days: 5 },
  { label: '1M', value: '1M', days: 30 },
  { label: '3M', value: '3M', days: 90 },
  { label: '1Y', value: '1Y', days: 365 },
  { label: '5Y', value: '5Y', days: 1825 },
];

// Computed
const chartData = computed(() => {
  const period = timePeriods.find(p => p.value === selectedPeriod.value);
  if (!period) return props.priceHistory;

  // Filter data based on selected period
  return props.priceHistory.slice(-Math.min(period.days, props.priceHistory.length));
});

// Chart series for ApexCharts
const chartSeries = computed(() => {
  if (chartType.value === 'line') {
    // Line chart format: [{ name: string, data: number[] }]
    return [{
      name: props.symbol,
      data: chartData.value.map(point => ({
        x: new Date(point.date).getTime(),
        y: point.close
      }))
    }];
  } else {
    // Candlestick format: [{ data: [{ x, y: [open, high, low, close] }] }]
    return [{
      data: chartData.value.map(point => ({
        x: new Date(point.date).getTime(),
        y: [point.open, point.high, point.low, point.close]
      }))
    }];
  }
});

// Chart options for ApexCharts
const chartOptions = computed(() => {
  const baseOptions = {
    chart: {
      type: chartType.value === 'line' ? 'area' : 'candlestick',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: getDateFormat()
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: (value: number) => `$${value.toFixed(2)}`
      }
    },
    tooltip: {
      x: {
        format: 'MMM dd, yyyy'
      }
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 4
    }
  };

  if (chartType.value === 'line') {
    return {
      ...baseOptions,
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      colors: ['#0d6efd'],
      tooltip: {
        ...baseOptions.tooltip,
        y: {
          formatter: (value: number) => `$${value.toFixed(2)}`
        }
      }
    };
  } else {
    return {
      ...baseOptions,
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#10b981',
            downward: '#ef4444'
          },
          wick: {
            useFillColor: true
          }
        }
      },
      tooltip: {
        ...baseOptions.tooltip,
        custom: ({ seriesIndex, dataPointIndex, w }: any) => {
          const data = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
          const open = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
          const high = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
          const low = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
          const close = w.globals.seriesCandleC[seriesIndex][dataPointIndex];

          return `
            <div style="padding: 10px; background: white; border: 1px solid #e0e0e0; border-radius: 4px;">
              <div style="margin-bottom: 5px;"><strong>Open:</strong> $${open?.toFixed(2)}</div>
              <div style="margin-bottom: 5px;"><strong>High:</strong> $${high?.toFixed(2)}</div>
              <div style="margin-bottom: 5px;"><strong>Low:</strong> $${low?.toFixed(2)}</div>
              <div><strong>Close:</strong> $${close?.toFixed(2)}</div>
            </div>
          `;
        }
      }
    };
  }
});

// Helper function to determine date format based on period
const getDateFormat = () => {
  const period = timePeriods.find(p => p.value === selectedPeriod.value);
  if (!period) return 'MMM dd';

  if (period.days <= 5) return 'MMM dd HH:mm';
  if (period.days <= 90) return 'MMM dd';
  if (period.days <= 365) return 'MMM yy';
  return 'yyyy';
};
</script>

<style scoped>
.stock-chart {
  position: relative;
}

.chart-container {
  position: relative;
  margin-top: 1rem;
}
</style>
