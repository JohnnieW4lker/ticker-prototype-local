<template>
  <div class="calendar-view">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-sm btn-outline-secondary" @click="previousMonth">
            <i class="bi bi-chevron-left"></i>
          </button>
          <h5 class="mb-0">{{ monthYearDisplay }}</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <!-- Day Headers -->
          <div class="calendar-header">
            <div
              v-for="day in weekDays"
              :key="day"
              class="calendar-header-cell"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="calendar-body">
            <div
              v-for="(day, index) in calendarDays"
              :key="`day-${index}`"
              class="calendar-day"
              :class="{
                'calendar-day-other-month': day.isOtherMonth,
                'calendar-day-today': day.isToday,
                'calendar-day-has-events': day.events.length > 0,
              }"
              @click="handleDayClick(day)"
            >
              <div class="calendar-day-number">{{ day.dayNumber }}</div>

              <!-- Event Count Badges -->
              <div v-if="day.events.length > 0" class="calendar-day-events">
                <div
                  v-for="(count, type) in day.eventCounts"
                  :key="type"
                  class="event-count-badge"
                  :class="`event-badge-${type}`"
                  :title="`${count} ${type} event${count !== 1 ? 's' : ''}`"
                >
                  <i :class="`bi ${getEventIcon(type)}`"></i>
                  <span>{{ count }}</span>
                </div>
              </div>

              <!-- Total event count -->
              <div v-if="day.events.length > 0" class="calendar-day-total">
                {{ day.events.length }} event{{ day.events.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Day Details Modal -->
    <div
      v-if="selectedDay"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="selectedDay = null"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Events for {{ formatDate(selectedDay.date) }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="selectedDay = null"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedDay.events.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
              <p>No events scheduled for this day</p>
            </div>
            <div v-else class="event-list">
              <EventsEventCard
                v-for="event in selectedDay.events"
                :key="event.id"
                :event="event"
                @click="handleEventClick(event.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedDay" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import type { Event, EventType } from '~/types/event';

interface CalendarDay {
  date: string;
  dayNumber: number;
  isOtherMonth: boolean;
  isToday: boolean;
  events: Event[];
  eventCounts: Record<string, number>;
}

interface Props {
  events: Event[];
  startDate: string;
  endDate: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  dateClick: [date: string];
}>();

const router = useRouter();

// State
const currentMonth = ref(new Date());
const selectedDay = ref<CalendarDay | null>(null);

// Computed
const monthYearDisplay = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
});

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Start from Sunday before first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // End on Saturday after last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEvents = props.events.filter(e => e.date === dateStr);

    // Count events by type
    const eventCounts: Record<string, number> = {};
    dayEvents.forEach(event => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });

    const checkDate = new Date(currentDate);
    checkDate.setHours(0, 0, 0, 0);

    days.push({
      date: dateStr,
      dayNumber: currentDate.getDate(),
      isOtherMonth: currentDate.getMonth() !== month,
      isToday: checkDate.getTime() === today.getTime(),
      events: dayEvents,
      eventCounts,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
});

// Methods
const previousMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  );
};

const handleDayClick = (day: CalendarDay) => {
  if (day.events.length > 0) {
    selectedDay.value = day;
  } else {
    emit('dateClick', day.date);
  }
};

const handleEventClick = (eventId: string) => {
  selectedDay.value = null;
  router.push(`/events/${eventId}`);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    earnings: 'bi-graph-up',
    dividend: 'bi-cash-coin',
    economics: 'bi-globe',
    ipo: 'bi-rocket-takeoff',
    split: 'bi-scissors',
  };
  return icons[type] || 'bi-calendar-event';
};

// Initialize with current month from date range
onMounted(() => {
  if (props.startDate) {
    currentMonth.value = new Date(props.startDate);
  }
});
</script>

<style scoped>
.calendar-view {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.calendar-grid {
  width: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: var(--tf-gray-100);
  border-bottom: 2px solid var(--tf-border-color);
}

.calendar-header-cell {
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  color: var(--tf-text-muted);
  font-size: 0.875rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--tf-border-color);
}

.calendar-day {
  background: white;
  min-height: 100px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover {
  background-color: var(--tf-gray-100);
  z-index: 1;
}

.calendar-day-other-month {
  background-color: var(--tf-gray-50);
  opacity: 0.6;
}

.calendar-day-today {
  background-color: rgba(13, 110, 253, 0.05);
}

.calendar-day-today .calendar-day-number {
  background-color: var(--tf-primary);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.calendar-day-has-events {
  cursor: pointer;
}

.calendar-day-has-events:hover {
  box-shadow: inset 0 0 0 2px var(--tf-primary);
}

.calendar-day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.calendar-day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.event-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.event-badge-earnings {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.event-badge-dividend {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.event-badge-economics {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.event-badge-ipo {
  background-color: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
}

.event-badge-split {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.calendar-day-total {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: var(--tf-text-muted);
  font-weight: 500;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 0.25rem;
  }

  .calendar-header-cell {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }

  .calendar-day-number {
    font-size: 0.75rem;
  }

  .event-count-badge {
    font-size: 0.625rem;
    padding: 0.125rem 0.25rem;
  }

  .calendar-day-total {
    font-size: 0.625rem;
  }
}
</style>
