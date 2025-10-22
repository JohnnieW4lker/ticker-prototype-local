<template>
  <div class="event-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading event details...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Event Details -->
    <div v-else-if="event">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/">Dashboard</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink to="/events">Events</NuxtLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ event.name }}
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div>
          <div class="d-flex align-items-center mb-2">
            <span class="badge me-2" :class="`bg-${getEventColor(event.type)}`">
              {{ event.type.toUpperCase() }}
            </span>
            <h1 class="mb-0 h3">{{ event.name }}</h1>
          </div>
          <div class="text-muted">
            <i class="bi bi-calendar3 me-2"></i>
            {{ formatDate(event.date) }}
            <span v-if="event.time" class="ms-3">
              <i class="bi bi-clock me-2"></i>
              {{ event.time }}
            </span>
          </div>
        </div>
        <button class="btn btn-outline-secondary" @click="router.back()">
          <i class="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <!-- Main Content -->
      <div class="row g-4">
        <!-- Event Information -->
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Event Information</h5>
            </div>
            <div class="card-body">
              <div v-if="event.description" class="mb-4">
                <p>{{ event.description }}</p>
              </div>

              <!-- Type-specific content -->
              <div v-if="event.type === 'earnings'" class="earnings-details">
                <h6 class="mb-3">Earnings Details</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Fiscal Quarter</div>
                      <div class="info-value">Q4 2025</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Fiscal Year</div>
                      <div class="info-value">2025</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Estimated EPS</div>
                      <div class="info-value">$5.23</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Estimated Revenue</div>
                      <div class="info-value">$125.4B</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="event.type === 'dividend'" class="dividend-details">
                <h6 class="mb-3">Dividend Details</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Dividend Amount</div>
                      <div class="info-value">$0.25 per share</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Frequency</div>
                      <div class="info-value">Quarterly</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Ex-Dividend Date</div>
                      <div class="info-value">{{ formatDate(event.date) }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Payment Date</div>
                      <div class="info-value">{{ formatDate(addDays(event.date, 14)) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="event.type === 'economics'" class="economics-details">
                <h6 class="mb-3">Economic Indicator Details</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Indicator</div>
                      <div class="info-value">GDP Growth Rate</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Country</div>
                      <div class="info-value">United States</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Impact</div>
                      <div class="info-value">
                        <span class="badge bg-danger">High</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Forecast</div>
                      <div class="info-value">2.8%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="event.type === 'ipo'" class="ipo-details">
                <h6 class="mb-3">IPO Details</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Company</div>
                      <div class="info-value">{{ event.name }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Exchange</div>
                      <div class="info-value">NASDAQ</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Price Range</div>
                      <div class="info-value">$18 - $22</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Shares Offered</div>
                      <div class="info-value">10,000,000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="event.type === 'split'" class="split-details">
                <h6 class="mb-3">Stock Split Details</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Split Ratio</div>
                      <div class="info-value">3:1</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <div class="info-label">Effective Date</div>
                      <div class="info-value">{{ formatDate(event.date) }}</div>
                    </div>
                  </div>
                </div>
                <div class="alert alert-info mt-3">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>What this means:</strong> Each share will be split into 3 shares,
                  and the price will be adjusted proportionally.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Related Stock Card -->
          <div v-if="event.symbol" class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">Related Stock</h6>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div class="fw-bold">{{ event.symbol }}</div>
                  <small class="text-muted">{{ stockInfo?.name }}</small>
                </div>
                <NuxtLink
                  :to="`/stock/${event.symbol}`"
                  class="btn btn-sm btn-outline-primary"
                >
                  View Details
                </NuxtLink>
              </div>
              <div v-if="stockInfo" class="stock-quick-info">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Price</span>
                  <span class="fw-bold">${{ stockInfo.price.toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Change</span>
                  <span :class="stockInfo.changePercent >= 0 ? 'price-positive' : 'price-negative'">
                    {{ stockInfo.changePercent >= 0 ? '+' : '' }}{{ stockInfo.changePercent.toFixed(2) }}%
                  </span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Volume</span>
                  <span>{{ formatVolume(stockInfo.volume) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Actions</h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" @click="addToCalendar">
                  <i class="bi bi-calendar-plus me-2"></i>
                  Add to Calendar
                </button>
                <button v-if="event.symbol" class="btn btn-outline-secondary" @click="addToWatchlist">
                  <i class="bi bi-star me-2"></i>
                  Add to Watchlist
                </button>
                <button class="btn btn-outline-secondary" @click="setReminder">
                  <i class="bi bi-bell me-2"></i>
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event';
import type { Stock } from '~/types/stock';

const route = useRoute();
const router = useRouter();
const api = useApi();

const loading = ref(true);
const error = ref('');
const event = ref<Event | null>(null);
const stockInfo = ref<Stock | null>(null);

const eventId = computed(() => route.params.id as string);

// Methods
const loadEvent = async () => {
  try {
    loading.value = true;
    error.value = '';
    event.value = await api.getEvent(eventId.value);

    // Load stock info if event has a symbol
    if (event.value.symbol) {
      try {
        stockInfo.value = await api.getStock(event.value.symbol);
      } catch (err) {
        console.error('Error loading stock info:', err);
      }
    }
  } catch (err) {
    console.error('Error loading event:', err);
    error.value = 'Failed to load event details';
  } finally {
    loading.value = false;
  }
};

const getEventColor = (type: string) => {
  const colors: Record<string, string> = {
    earnings: 'primary',
    dividend: 'success',
    economics: 'warning',
    ipo: 'info',
    split: 'secondary',
  };
  return colors[type] || 'secondary';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const addDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
};

const addToCalendar = () => {
  alert('Add to Calendar functionality - Coming soon!');
};

const addToWatchlist = () => {
  alert('Add to Watchlist functionality - Coming soon!');
};

const setReminder = () => {
  alert('Set Reminder functionality - Coming soon!');
};

// Load data on mount
onMounted(() => {
  loadEvent();
});

// Reload when route changes
watch(eventId, () => {
  loadEvent();
});
</script>

<style scoped>
.event-detail-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-item {
  padding: 0.75rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
}

.info-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 600;
  font-size: 1rem;
}

.stock-quick-info {
  padding-top: 1rem;
  border-top: 1px solid var(--tf-border-color);
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 0;
}
</style>
