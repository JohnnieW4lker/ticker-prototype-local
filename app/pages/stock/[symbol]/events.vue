<template>
  <div class="stock-events-page">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{{ symbol }} Events</h2>
          <p class="text-muted mb-0">Upcoming earnings, dividends, and corporate actions</p>
        </div>
        <NuxtLink :to="`/stock/${symbol}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back
        </NuxtLink>
      </div>

      <div v-if="events.length === 0" class="card">
        <div class="card-body text-center py-5 text-muted">
          <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
          <p>No upcoming events for {{ symbol }}</p>
        </div>
      </div>

      <div v-else class="event-list">
        <EventsEventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          @click="navigateTo(`/events/${event.id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event';

const route = useRoute();
const router = useRouter();
const api = useApi();

const loading = ref(true);
const events = ref<Event[]>([]);
const symbol = computed(() => (route.params.symbol as string).toUpperCase());

const loadEvents = async () => {
  try {
    loading.value = true;
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
    const allEvents = await api.getEvents(today, futureDate);
    events.value = allEvents.filter(e => e.symbol === symbol.value);
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadEvents());
watch(() => route.params.symbol, () => loadEvents());
</script>

<style scoped>
.stock-events-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
