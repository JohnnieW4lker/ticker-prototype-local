<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Upcoming Events</h5>
      <NuxtLink to="/events" class="btn btn-sm btn-outline-primary">
        Full Calendar
      </NuxtLink>
    </div>
    <div class="card-body">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="todayEvents.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
        <p>No events scheduled for today</p>
      </div>

      <div v-else>
        <!-- Event Summary -->
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <span class="event-badge event-earnings">
            {{ eventCounts.earnings }} Earnings
          </span>
          <span class="event-badge event-dividend">
            {{ eventCounts.dividend }} Dividends
          </span>
          <span class="event-badge event-economics">
            {{ eventCounts.economics }} Economics
          </span>
          <span class="event-badge event-ipo">
            {{ eventCounts.ipo }} IPOs
          </span>
          <span class="event-badge event-split">
            {{ eventCounts.split }} Splits
          </span>
        </div>

        <!-- Event List -->
        <div class="list-group list-group-flush">
          <div
            v-for="event in todayEvents.slice(0, 5)"
            :key="event.id"
            class="list-group-item d-flex justify-content-between align-items-start"
          >
            <div class="flex-grow-1">
              <div class="d-flex align-items-center mb-1">
                <span class="badge me-2" :class="`bg-${getEventColor(event.type)}`">
                  {{ event.type.toUpperCase() }}
                </span>
                <strong v-if="event.symbol">{{ event.symbol }}</strong>
              </div>
              <div class="text-muted small">{{ event.name }}</div>
            </div>
            <small class="text-muted">{{ event.time }}</small>
          </div>
        </div>

        <div v-if="todayEvents.length > 5" class="text-center mt-3">
          <NuxtLink to="/events" class="btn btn-sm btn-outline-secondary">
            View {{ todayEvents.length - 5 }} more events
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event';

const api = useApi();
const todayEvents = ref<Event[]>([]);
const loading = ref(true);

const eventCounts = computed(() => {
  const counts = {
    earnings: 0,
    dividend: 0,
    economics: 0,
    ipo: 0,
    split: 0,
  };

  todayEvents.value.forEach(event => {
    counts[event.type]++;
  });

  return counts;
});

const loadData = async () => {
  try {
    loading.value = true;
    const today = new Date().toISOString().split('T')[0];
    const allEvents = await api.getEvents(today, today);
    todayEvents.value = allEvents.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  } catch (error) {
    console.error('Error loading events:', error);
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

onMounted(() => {
  loadData();
});
</script>
