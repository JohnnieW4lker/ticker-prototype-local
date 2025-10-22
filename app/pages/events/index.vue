<template>
  <div class="events-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="mb-1">Event Calendar</h1>
        <p class="text-muted mb-0">Track earnings, dividends, economic indicators, IPOs, and stock splits</p>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="row g-3 mb-4">
      <div class="col-md-2">
        <div class="event-stat-card event-earnings">
          <div class="event-stat-icon">
            <i class="bi bi-graph-up"></i>
          </div>
          <div class="event-stat-content">
            <div class="event-stat-label">Earnings</div>
            <div class="event-stat-value">{{ totalCounts.earnings }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="event-stat-card event-dividend">
          <div class="event-stat-icon">
            <i class="bi bi-cash-coin"></i>
          </div>
          <div class="event-stat-content">
            <div class="event-stat-label">Dividends</div>
            <div class="event-stat-value">{{ totalCounts.dividend }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="event-stat-card event-economics">
          <div class="event-stat-icon">
            <i class="bi bi-globe"></i>
          </div>
          <div class="event-stat-content">
            <div class="event-stat-label">Economics</div>
            <div class="event-stat-value">{{ totalCounts.economics }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="event-stat-card event-ipo">
          <div class="event-stat-icon">
            <i class="bi bi-rocket-takeoff"></i>
          </div>
          <div class="event-stat-content">
            <div class="event-stat-label">IPOs</div>
            <div class="event-stat-value">{{ totalCounts.ipo }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="event-stat-card event-split">
          <div class="event-stat-icon">
            <i class="bi bi-scissors"></i>
          </div>
          <div class="event-stat-content">
            <div class="event-stat-label">Splits</div>
            <div class="event-stat-value">{{ totalCounts.split }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="event-stat-card event-total">
          <div class="event-stat-icon">
            <i class="bi bi-calendar-event"></i>
          </div>
          <div class="event-stat-content">
            <div class="event-stat-label">Total</div>
            <div class="event-stat-value">{{ totalEvents }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <EventsEventFilter
      v-model:selected-types="selectedTypes"
      v-model:start-date="startDate"
      v-model:end-date="endDate"
      v-model:view-mode="viewMode"
      @apply="loadEvents"
    />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading events...</span>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-else-if="viewMode === 'calendar'">
      <EventsCalendarView
        :events="filteredEvents"
        :start-date="startDate"
        :end-date="endDate"
        @date-click="handleDateClick"
      />
    </div>

    <!-- List View -->
    <div v-else class="card">
      <div class="card-body">
        <div v-if="filteredEvents.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
          <p>No events found for the selected criteria</p>
        </div>
        <div v-else class="event-list">
          <EventsEventCard
            v-for="event in paginatedEvents"
            :key="event.id"
            :event="event"
            @click="navigateToEvent(event.id)"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
          <div class="text-muted">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to
            {{ Math.min(currentPage * pageSize, filteredEvents.length) }} of
            {{ filteredEvents.length }} events
          </div>
          <nav>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                  Previous
                </button>
              </li>
              <li
                v-for="page in displayPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="currentPage = page">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event, EventType } from '~/types/event';

const api = useApi();
const router = useRouter();

// State
const loading = ref(true);
const allEvents = ref<Event[]>([]);
const selectedTypes = ref<EventType[]>([]);
const viewMode = ref<'calendar' | 'list'>('list');

// Date range - default to next 30 days
const today = new Date();
const startDate = ref(today.toISOString().split('T')[0]);
const endDate = ref(new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0]);

// Pagination
const currentPage = ref(1);
const pageSize = 30;

// Computed
const filteredEvents = computed(() => {
  return allEvents.value.filter(event => {
    const matchesType = selectedTypes.value.length === 0 || selectedTypes.value.includes(event.type);
    return matchesType;
  }).sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return (a.time || '').localeCompare(b.time || '');
  });
});

const totalEvents = computed(() => filteredEvents.value.length);

const totalCounts = computed(() => {
  const counts: Record<EventType, number> = {
    earnings: 0,
    dividend: 0,
    economics: 0,
    ipo: 0,
    split: 0,
  };

  filteredEvents.value.forEach(event => {
    counts[event.type]++;
  });

  return counts;
});

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / pageSize));

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredEvents.value.slice(start, end);
});

const displayPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const loadEvents = async () => {
  try {
    loading.value = true;
    const types = selectedTypes.value.length > 0 ? selectedTypes.value : undefined;
    allEvents.value = await api.getEvents(startDate.value, endDate.value, types);
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToEvent = (id: string) => {
  router.push(`/events/${id}`);
};

const handleDateClick = (date: string) => {
  // Filter to show events for clicked date in list view
  startDate.value = date;
  endDate.value = date;
  viewMode.value = 'list';
  loadEvents();
};

// Watch for filter changes
watch([selectedTypes, startDate, endDate], () => {
  currentPage.value = 1; // Reset to first page when filters change
});

// Load initial data
onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.events-page {
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

.event-stat-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.event-stat-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.event-stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.event-stat-content {
  flex: 1;
}

.event-stat-label {
  font-size: 0.75rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.25rem;
}

.event-stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  color: var(--tf-text-muted);
}

/* Event type colors */
.event-earnings .event-stat-icon {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.event-dividend .event-stat-icon {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.event-economics .event-stat-icon {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.event-ipo .event-stat-icon {
  background-color: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
}

.event-split .event-stat-icon {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.event-total .event-stat-icon {
  background-color: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .event-stat-card {
    padding: 0.75rem;
  }

  .event-stat-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .event-stat-value {
    font-size: 1.25rem;
  }
}
</style>
