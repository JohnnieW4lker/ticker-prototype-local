<template>
  <div class="fundamentals-page">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="fundamentals">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{{ symbol }} Fundamental Analysis</h2>
          <p class="text-muted mb-0">Key financial ratios and performance metrics</p>
        </div>
        <NuxtLink :to="`/stock/${symbol}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back
        </NuxtLink>
      </div>

      <!-- Overall Score -->
      <div class="card mb-4">
        <div class="card-body text-center py-5">
          <h3 class="mb-3">Overall Score</h3>
          <div class="score-circle" :class="getScoreClass(fundamentals.overallScore)">
            {{ fundamentals.overallScore }}%
          </div>
          <p class="text-muted mt-3">Based on profitability, debt, liquidity, and performance</p>
        </div>
      </div>

      <!-- Category Scores -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-graph-up-arrow fs-1 text-primary mb-3"></i>
              <h6>Profitability</h6>
              <div class="score-badge" :class="getScoreClass(fundamentals.profitabilityScore)">
                {{ fundamentals.profitabilityScore }}%
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-credit-card fs-1 text-warning mb-3"></i>
              <h6>Debt Management</h6>
              <div class="score-badge" :class="getScoreClass(fundamentals.debtScore)">
                {{ fundamentals.debtScore }}%
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-droplet fs-1 text-info mb-3"></i>
              <h6>Liquidity</h6>
              <div class="score-badge" :class="getScoreClass(fundamentals.liquidityScore)">
                {{ fundamentals.liquidityScore }}%
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-rocket-takeoff fs-1 text-success mb-3"></i>
              <h6>Performance</h6>
              <div class="score-badge" :class="getScoreClass(fundamentals.performanceScore)">
                {{ fundamentals.performanceScore }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Ratios -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Key Financial Ratios</h5>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <!-- Profitability Ratios -->
            <div class="col-md-6">
              <h6 class="mb-3">Profitability</h6>
              <div class="ratio-list">
                <div class="ratio-item">
                  <div class="ratio-label">Return on Equity (ROE)</div>
                  <div class="ratio-value">{{ fundamentals.roe?.toFixed(2) }}%</div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">Return on Assets (ROA)</div>
                  <div class="ratio-value">{{ fundamentals.roa?.toFixed(2) }}%</div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">Return on Sales (ROS)</div>
                  <div class="ratio-value">{{ fundamentals.ros?.toFixed(2) }}%</div>
                </div>
              </div>
            </div>

            <!-- Leverage Ratios -->
            <div class="col-md-6">
              <h6 class="mb-3">Leverage & Liquidity</h6>
              <div class="ratio-list">
                <div class="ratio-item">
                  <div class="ratio-label">Debt to Equity</div>
                  <div class="ratio-value">{{ fundamentals.debtToEquity?.toFixed(2) }}</div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">Current Ratio</div>
                  <div class="ratio-value">{{ fundamentals.currentRatio?.toFixed(2) }}</div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">Quick Ratio</div>
                  <div class="ratio-value">{{ fundamentals.quickRatio?.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FundamentalAnalysis } from '~/types/stock';

const route = useRoute();
const api = useApi();

const loading = ref(true);
const fundamentals = ref<FundamentalAnalysis | null>(null);
const symbol = computed(() => (route.params.symbol as string).toUpperCase());

const loadFundamentals = async () => {
  try {
    loading.value = true;
    fundamentals.value = await api.getStockFundamentals(symbol.value);
  } catch (error) {
    console.error('Error loading fundamentals:', error);
  } finally {
    loading.value = false;
  }
};

const getScoreClass = (score: number) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-average';
  return 'score-poor';
};

onMounted(() => loadFundamentals());
watch(() => route.params.symbol, () => loadFundamentals());
</script>

<style scoped>
.fundamentals-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  border: 8px solid;
}

.score-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: 700;
}

.score-excellent {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
  border-color: #198754;
}

.score-good {
  background-color: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
  border-color: #0dcaf0;
}

.score-average {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  border-color: #ffc107;
}

.score-poor {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-color: #dc3545;
}

.ratio-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ratio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
}

.ratio-label {
  font-weight: 500;
  color: var(--tf-text-muted);
}

.ratio-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--tf-primary);
}
</style>
