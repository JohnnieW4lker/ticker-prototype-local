<template>
  <div
    class="event-card"
    :class="`event-card-${event.type}`"
    @click="$emit('click')"
  >
    <div class="event-card-header">
      <div class="event-card-type">
        <span class="badge" :class="`bg-${getEventColor(event.type)}`">
          <i :class="`bi ${getEventIcon(event.type)} me-1`"></i>
          {{ event.type.toUpperCase() }}
        </span>
      </div>
      <div class="event-card-time">
        <i class="bi bi-clock me-1"></i>
        {{ event.time || 'All Day' }}
      </div>
    </div>

    <div class="event-card-body">
      <div class="event-card-title">
        {{ event.name }}
      </div>

      <div v-if="event.symbol" class="event-card-symbol">
        <i class="bi bi-building me-1"></i>
        <strong>{{ event.symbol }}</strong>
      </div>

      <div v-if="event.description" class="event-card-description">
        {{ truncateText(event.description, 100) }}
      </div>

      <!-- Type-specific quick info -->
      <div class="event-card-meta">
        <div v-if="event.type === 'earnings'" class="meta-item">
          <i class="bi bi-graph-up-arrow me-1"></i>
          <span class="text-muted small">Earnings Report</span>
        </div>

        <div v-else-if="event.type === 'dividend'" class="meta-item">
          <i class="bi bi-currency-dollar me-1"></i>
          <span class="text-muted small">Ex-Dividend Date</span>
        </div>

        <div v-else-if="event.type === 'economics'" class="meta-item">
          <i class="bi bi-globe-americas me-1"></i>
          <span class="text-muted small">Economic Indicator</span>
        </div>

        <div v-else-if="event.type === 'ipo'" class="meta-item">
          <i class="bi bi-rocket-takeoff me-1"></i>
          <span class="text-muted small">Initial Public Offering</span>
        </div>

        <div v-else-if="event.type === 'split'" class="meta-item">
          <i class="bi bi-scissors me-1"></i>
          <span class="text-muted small">Stock Split</span>
        </div>
      </div>
    </div>

    <div class="event-card-footer">
      <div class="event-card-date">
        <i class="bi bi-calendar3 me-1"></i>
        {{ formatDate(event.date) }}
      </div>
      <div class="event-card-actions">
        <button
          class="btn btn-sm btn-outline-secondary"
          @click.stop="addToCalendar"
        >
          <i class="bi bi-calendar-plus"></i>
        </button>
        <button
          v-if="event.symbol"
          class="btn btn-sm btn-outline-secondary"
          @click.stop="viewStock"
        >
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event';

interface Props {
  event: Event;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  click: [];
}>();

const router = useRouter();

// Methods
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (eventDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const addToCalendar = () => {
  alert('Add to Calendar - Coming soon!');
};

const viewStock = () => {
  if (props.event.symbol) {
    router.push(`/stock/${props.event.symbol}`);
  }
};
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.event-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.event-card-earnings {
  border-left-color: #0d6efd;
}

.event-card-dividend {
  border-left-color: #198754;
}

.event-card-economics {
  border-left-color: #ffc107;
}

.event-card-ipo {
  border-left-color: #0dcaf0;
}

.event-card-split {
  border-left-color: #6c757d;
}

.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.event-card-time {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
}

.event-card-body {
  margin-bottom: 0.75rem;
}

.event-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--tf-text-primary);
}

.event-card-symbol {
  margin-bottom: 0.5rem;
  color: var(--tf-primary);
  font-size: 0.875rem;
}

.event-card-description {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.event-card-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.event-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--tf-border-color);
}

.event-card-date {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  font-weight: 500;
}

.event-card-actions {
  display: flex;
  gap: 0.5rem;
}

.event-card-actions .btn {
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .event-card {
    padding: 0.75rem;
  }

  .event-card-title {
    font-size: 1rem;
  }

  .event-card-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
