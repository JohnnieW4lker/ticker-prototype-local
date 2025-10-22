<template>
  <div class="card mb-4">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
          <i class="bi bi-funnel me-2"></i>
          Filters
        </h6>
        <button
          v-if="hasActiveFilters"
          class="btn btn-sm btn-link text-decoration-none"
          @click="clearFilters"
        >
          Clear All
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <!-- Event Type Filter -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Event Types</label>
          <div class="event-type-filters">
            <div
              v-for="type in eventTypes"
              :key="type.value"
              class="form-check"
            >
              <input
                :id="`type-${type.value}`"
                v-model="localSelectedTypes"
                class="form-check-input"
                type="checkbox"
                :value="type.value"
              >
              <label :for="`type-${type.value}`" class="form-check-label">
                <i :class="`bi ${type.icon} me-2`"></i>
                {{ type.label }}
                <span v-if="type.count !== undefined" class="badge bg-secondary ms-2">
                  {{ type.count }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Date Range</label>
          <div class="mb-3">
            <label for="start-date" class="form-label small">Start Date</label>
            <input
              id="start-date"
              v-model="localStartDate"
              type="date"
              class="form-control"
            >
          </div>
          <div class="mb-3">
            <label for="end-date" class="form-label small">End Date</label>
            <input
              id="end-date"
              v-model="localEndDate"
              type="date"
              class="form-control"
            >
          </div>

          <!-- Quick Date Ranges -->
          <div class="quick-ranges">
            <label class="form-label small">Quick Select:</label>
            <div class="d-flex gap-2 flex-wrap">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="setQuickRange('today')"
              >
                Today
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="setQuickRange('week')"
              >
                This Week
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="setQuickRange('month')"
              >
                This Month
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="setQuickRange('next30')"
              >
                Next 30 Days
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div class="row mt-3">
        <div class="col-12">
          <label class="form-label fw-semibold">View Mode</label>
          <div class="btn-group w-100" role="group">
            <button
              type="button"
              class="btn"
              :class="localViewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'"
              @click="localViewMode = 'list'"
            >
              <i class="bi bi-list-ul me-2"></i>
              List View
            </button>
            <button
              type="button"
              class="btn"
              :class="localViewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'"
              @click="localViewMode = 'calendar'"
            >
              <i class="bi bi-calendar3 me-2"></i>
              Calendar View
            </button>
          </div>
        </div>
      </div>

      <!-- Apply Button -->
      <div class="row mt-3">
        <div class="col-12">
          <button class="btn btn-primary w-100" @click="applyFilters">
            <i class="bi bi-check-circle me-2"></i>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventType } from '~/types/event';

interface Props {
  selectedTypes?: EventType[];
  startDate?: string;
  endDate?: string;
  viewMode?: 'list' | 'calendar';
}

interface Emits {
  (e: 'update:selectedTypes', value: EventType[]): void;
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
  (e: 'update:viewMode', value: 'list' | 'calendar'): void;
  (e: 'apply'): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedTypes: () => [],
  startDate: () => new Date().toISOString().split('T')[0],
  endDate: () => new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  viewMode: 'list',
});

const emit = defineEmits<Emits>();

// Local state
const localSelectedTypes = ref<EventType[]>([...props.selectedTypes]);
const localStartDate = ref(props.startDate);
const localEndDate = ref(props.endDate);
const localViewMode = ref(props.viewMode);

// Event type definitions
const eventTypes = [
  { value: 'earnings' as EventType, label: 'Earnings', icon: 'bi-graph-up' },
  { value: 'dividend' as EventType, label: 'Dividends', icon: 'bi-cash-coin' },
  { value: 'economics' as EventType, label: 'Economics', icon: 'bi-globe' },
  { value: 'ipo' as EventType, label: 'IPOs', icon: 'bi-rocket-takeoff' },
  { value: 'split' as EventType, label: 'Splits', icon: 'bi-scissors' },
];

// Computed
const hasActiveFilters = computed(() => {
  return localSelectedTypes.value.length > 0;
});

// Methods
const applyFilters = () => {
  emit('update:selectedTypes', localSelectedTypes.value);
  emit('update:startDate', localStartDate.value);
  emit('update:endDate', localEndDate.value);
  emit('update:viewMode', localViewMode.value);
  emit('apply');
};

const clearFilters = () => {
  localSelectedTypes.value = [];
  applyFilters();
};

const setQuickRange = (range: 'today' | 'week' | 'month' | 'next30') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (range) {
    case 'today':
      localStartDate.value = today.toISOString().split('T')[0];
      localEndDate.value = today.toISOString().split('T')[0];
      break;

    case 'week': {
      // Start of week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      // End of week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      localStartDate.value = startOfWeek.toISOString().split('T')[0];
      localEndDate.value = endOfWeek.toISOString().split('T')[0];
      break;
    }

    case 'month': {
      // Start of month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      // End of month
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      localStartDate.value = startOfMonth.toISOString().split('T')[0];
      localEndDate.value = endOfMonth.toISOString().split('T')[0];
      break;
    }

    case 'next30': {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);

      localStartDate.value = today.toISOString().split('T')[0];
      localEndDate.value = endDate.toISOString().split('T')[0];
      break;
    }
  }
};

// Watch for prop changes
watch(() => props.selectedTypes, (newVal) => {
  localSelectedTypes.value = [...newVal];
});

watch(() => props.startDate, (newVal) => {
  localStartDate.value = newVal;
});

watch(() => props.endDate, (newVal) => {
  localEndDate.value = newVal;
});

watch(() => props.viewMode, (newVal) => {
  localViewMode.value = newVal;
});
</script>

<style scoped>
.event-type-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-check-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.quick-ranges {
  margin-top: 0.75rem;
}
</style>
