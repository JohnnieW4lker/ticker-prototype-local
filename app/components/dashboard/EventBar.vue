<template>
  <div class="card event-bar-card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-calendar-event me-2"></i>
        Upcoming Events Calendar
      </h5>
      <div class="d-flex align-items-center gap-2">
        <span v-if="alertedDaysCount > 0" class="badge bg-danger">
          <i class="bi bi-bell-fill me-1"></i>
          {{ alertedDaysCount }} Alerted
        </span>
        <NuxtLink to="/events" class="btn btn-sm btn-outline-primary">
          Full Calendar
        </NuxtLink>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="event-bar-container">
        <!-- Left Navigation Arrow -->
        <button
          class="event-bar-nav event-bar-nav-left"
          @click="scrollLeft"
          :disabled="!canScrollLeft"
          :class="{ 'nav-disabled': !canScrollLeft }"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Event Days Container -->
        <div class="event-bar-scroll" ref="scrollContainer" @scroll="handleScroll">
          <div class="event-days">
            <div
              v-for="day in eventDays"
              :key="day.date"
              class="event-day"
              :class="{
                'event-day-today': day.isToday,
                'event-day-alerted': day.hasAlerted,
                'event-day-empty': day.totalEvents === 0
              }"
            >
              <div class="event-day-header">
                <div class="event-date-wrapper">
                  <div class="event-weekday">{{ day.weekday }}</div>
                  <div class="event-date">{{ day.monthDay }}</div>
                </div>
                <div class="event-count-badge" :class="day.totalEvents > 0 ? 'has-events' : 'no-events'">
                  {{ day.totalEvents }}
                </div>
              </div>

              <div v-if="day.totalEvents > 0" class="event-counts">
                <div v-if="day.earnings > 0" class="event-type-item event-type-earnings">
                  <i class="bi bi-graph-up-arrow me-1"></i>
                  <span class="event-count">{{ day.earnings }}</span>
                  <span class="event-label">Earnings</span>
                </div>
                <div v-if="day.dividends > 0" class="event-type-item event-type-dividend">
                  <i class="bi bi-cash-coin me-1"></i>
                  <span class="event-count">{{ day.dividends }}</span>
                  <span class="event-label">Dividends</span>
                </div>
                <div v-if="day.economics > 0" class="event-type-item event-type-economics">
                  <i class="bi bi-bank me-1"></i>
                  <span class="event-count">{{ day.economics }}</span>
                  <span class="event-label">Economics</span>
                </div>
                <div v-if="day.ipos > 0" class="event-type-item event-type-ipo">
                  <i class="bi bi-rocket-takeoff me-1"></i>
                  <span class="event-count">{{ day.ipos }}</span>
                  <span class="event-label">IPOs</span>
                </div>
                <div v-if="day.splits > 0" class="event-type-item event-type-split">
                  <i class="bi bi-scissors me-1"></i>
                  <span class="event-count">{{ day.splits }}</span>
                  <span class="event-label">Splits</span>
                </div>
              </div>

              <div v-else class="no-events-label">
                <i class="bi bi-calendar-x"></i>
                <span>No Events</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Navigation Arrow -->
        <button
          class="event-bar-nav event-bar-nav-right"
          @click="scrollRight"
          :disabled="!canScrollRight"
          :class="{ 'nav-disabled': !canScrollRight }"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event';

interface EventDay {
  date: string;
  weekday: string;
  monthDay: string;
  isToday: boolean;
  hasAlerted: boolean;
  earnings: number;
  dividends: number;
  economics: number;
  ipos: number;
  splits: number;
  totalEvents: number;
}

const api = useApi();
const scrollContainer = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);
const eventDays = ref<EventDay[]>([]);

// Calculate number of days ahead to show
const daysToShow = 14;

const alertedDaysCount = computed(() => {
  return eventDays.value.filter(day => day.hasAlerted).length;
});

const loadEventData = async () => {
  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysToShow);

    const startDateStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const events = await api.getEvents(startDateStr, endDateStr);

    // Group events by date
    const eventsByDate: Record<string, Event[]> = {};
    events.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });

    // Create event day objects for the next 14 days
    const days: EventDay[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = eventsByDate[dateStr] || [];

      const eventCounts = {
        earnings: 0,
        dividends: 0,
        economics: 0,
        ipos: 0,
        splits: 0,
      };

      dayEvents.forEach(event => {
        if (event.type === 'earnings') eventCounts.earnings++;
        else if (event.type === 'dividend') eventCounts.dividends++;
        else if (event.type === 'economics') eventCounts.economics++;
        else if (event.type === 'ipo') eventCounts.ipos++;
        else if (event.type === 'split') eventCounts.splits++;
      });

      const totalEvents = dayEvents.length;

      days.push({
        date: dateStr,
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        monthDay: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        isToday: i === 0,
        hasAlerted: totalEvents > 0 && Math.random() > 0.7, // Simulated alerted events
        earnings: eventCounts.earnings,
        dividends: eventCounts.dividends,
        economics: eventCounts.economics,
        ipos: eventCounts.ipos,
        splits: eventCounts.splits,
        totalEvents,
      });
    }

    eventDays.value = days;
  } catch (error) {
    console.error('Error loading event bar data:', error);
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 5;
};

const scrollLeft = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
};

const scrollRight = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
};

onMounted(() => {
  loadEventData();
  if (scrollContainer.value) {
    handleScroll();
  }
});
</script>

<style scoped>
.event-bar-card {
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.event-bar-container {
  display: flex;
  align-items: center;
  padding: 1.5rem 1rem;
  position: relative;
  min-height: 200px;
}

.event-bar-nav {
  background: var(--tf-gray-100);
  border: 2px solid var(--tf-gray-200);
  color: var(--tf-gray-500);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  z-index: 2;
  font-size: 1.2rem;
}

.event-bar-nav:hover:not(.nav-disabled) {
  background: var(--tf-action);
  border-color: var(--tf-action);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(60, 183, 145, 0.3);
}

.event-bar-nav.nav-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.event-bar-nav-left {
  margin-right: 1rem;
}

.event-bar-nav-right {
  margin-left: 1rem;
}

.event-bar-scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--tf-gray-300) var(--tf-gray-100);
  padding: 0.5rem 0;
}

.event-bar-scroll::-webkit-scrollbar {
  height: 8px;
}

.event-bar-scroll::-webkit-scrollbar-track {
  background: var(--tf-gray-100);
  border-radius: 4px;
}

.event-bar-scroll::-webkit-scrollbar-thumb {
  background: var(--tf-gray-300);
  border-radius: 4px;
}

.event-bar-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--tf-action);
}

.event-days {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
}

.event-day {
  background: white;
  border: 2px solid var(--tf-gray-200);
  border-radius: 12px;
  padding: 1.25rem;
  min-width: 200px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.event-day:hover {
  border-color: var(--tf-action);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.event-day-today {
  background: linear-gradient(135deg, rgba(60, 183, 145, 0.05) 0%, rgba(60, 183, 145, 0.1) 100%);
  border: 2px solid var(--tf-action);
  box-shadow: 0 4px 12px rgba(60, 183, 145, 0.2);
}

.event-day-today .event-date-wrapper .event-weekday {
  color: var(--tf-action);
  font-weight: 700;
}

.event-day-alerted {
  position: relative;
  border-color: var(--tf-danger);
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.03) 0%, rgba(220, 53, 69, 0.08) 100%);
}

.event-day-alerted::before {
  content: '';
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  background: var(--tf-danger);
  border-radius: 50%;
  border: 3px solid white;
  animation: pulse 2s ease-in-out infinite;
  z-index: 10;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.15);
  }
}

.event-day-empty {
  opacity: 0.6;
}

.event-day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--tf-gray-100);
}

.event-date-wrapper {
  display: flex;
  flex-direction: column;
}

.event-weekday {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--tf-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.event-date {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--tf-gray-500);
  letter-spacing: 0.5px;
}

.event-count-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
}

.event-count-badge.has-events {
  background: var(--tf-action);
  color: white;
}

.event-count-badge.no-events {
  background: var(--tf-gray-100);
  color: var(--tf-gray-400);
}

.event-counts {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.event-type-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  border-left: 4px solid;
}

.event-type-item:hover {
  transform: translateX(4px);
}

.event-type-item i {
  font-size: 1rem;
}

.event-count {
  margin-right: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.event-label {
  font-weight: 500;
  margin-left: auto;
}

.event-type-earnings {
  background: rgba(60, 183, 145, 0.1);
  color: var(--tf-action-dark);
  border-left-color: var(--tf-action);
}

.event-type-dividend {
  background: rgba(40, 167, 69, 0.1);
  color: #1e7e34;
  border-left-color: var(--tf-success);
}

.event-type-economics {
  background: rgba(255, 193, 7, 0.1);
  color: #d39e00;
  border-left-color: var(--tf-warning);
}

.event-type-ipo {
  background: rgba(23, 162, 184, 0.1);
  color: #117a8b;
  border-left-color: var(--tf-info);
}

.event-type-split {
  background: rgba(108, 117, 125, 0.1);
  color: #495057;
  border-left-color: #6c757d;
}

.no-events-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  color: var(--tf-gray-400);
  font-size: 0.85rem;
  gap: 0.5rem;
}

.no-events-label i {
  font-size: 1.5rem;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 992px) {
  .event-bar-container {
    min-height: 180px;
  }

  .event-day {
    min-width: 180px;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .event-bar-container {
    padding: 1rem 0.75rem;
    min-height: 160px;
  }

  .event-day {
    min-width: 160px;
    padding: 0.875rem;
  }

  .event-label {
    display: none;
  }

  .event-bar-nav {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 576px) {
  .event-bar-container {
    min-height: 150px;
  }

  .event-count-badge {
    width: 30px;
    height: 30px;
    font-size: 0.95rem;
  }
}
</style>
