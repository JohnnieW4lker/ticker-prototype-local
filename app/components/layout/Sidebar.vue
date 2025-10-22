<template>
  <aside class="app-sidebar" :class="{ 'show': isOpen }">
    <nav class="nav flex-column py-3">
      <!-- Main Navigation -->
      <div class="nav-section mb-3">
        <h6 class="nav-section-title px-3 text-uppercase text-muted small fw-bold mb-2">
          Main
        </h6>
        <NuxtLink
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="nav-link d-flex align-items-center"
          :class="{ 'active': isActive(item.path) }"
        >
          <i :class="item.icon" class="me-2"></i>
          {{ item.label }}
        </NuxtLink>
      </div>

      <!-- Screening -->
      <div class="nav-section mb-3">
        <h6 class="nav-section-title px-3 text-uppercase text-muted small fw-bold mb-2">
          Screening
        </h6>
        <NuxtLink
          v-for="item in screeningNav"
          :key="item.path"
          :to="item.path"
          class="nav-link d-flex align-items-center"
          :class="{ 'active': isActive(item.path) }"
        >
          <i :class="item.icon" class="me-2"></i>
          {{ item.label }}
        </NuxtLink>
      </div>

      <!-- Portfolio -->
      <div class="nav-section mb-3">
        <h6 class="nav-section-title px-3 text-uppercase text-muted small fw-bold mb-2">
          Portfolio
        </h6>
        <NuxtLink
          v-for="item in portfolioNav"
          :key="item.path"
          :to="item.path"
          class="nav-link d-flex align-items-center"
          :class="{ 'active': isActive(item.path) }"
        >
          <i :class="item.icon" class="me-2"></i>
          {{ item.label }}
          <span v-if="item.badge" class="badge bg-blue ms-auto">{{ item.badge }}</span>
        </NuxtLink>
      </div>

      <!-- Resources -->
      <div class="nav-section">
        <h6 class="nav-section-title px-3 text-uppercase text-muted small fw-bold mb-2">
          Resources
        </h6>
        <NuxtLink
          v-for="item in resourcesNav"
          :key="item.path"
          :to="item.path"
          class="nav-link d-flex align-items-center"
          :class="{ 'active': isActive(item.path) }"
        >
          <i :class="item.icon" class="me-2"></i>
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();

interface Props {
  isOpen?: boolean;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
});

const mainNav = [
  { label: 'Dashboard', path: '/', icon: 'bi bi-house-door-fill' },
  { label: 'Markets', path: '/markets', icon: 'bi bi-graph-up' },
  { label: 'Events Calendar', path: '/events', icon: 'bi bi-calendar3' },
];

const screeningNav = [
  { label: 'Stock Screener', path: '/screener', icon: 'bi bi-funnel-fill' },
  { label: 'Saved Filters', path: '/filters', icon: 'bi bi-bookmark-fill' },
  { label: 'Presets', path: '/presets', icon: 'bi bi-star-fill' },
];

const portfolioNav = [
  { label: 'Watchlists', path: '/watchlists', icon: 'bi bi-eye-fill', badge: '3' },
  { label: 'Notes', path: '/notes', icon: 'bi bi-journal-text' },
  { label: 'Documents', path: '/documents', icon: 'bi bi-file-earmark-text' },
];

const resourcesNav = [
  { label: 'Learn', path: '/learn', icon: 'bi bi-book-fill' },
  { label: 'Help', path: '/help', icon: 'bi bi-question-circle-fill' },
  { label: 'Settings', path: '/settings', icon: 'bi bi-gear-fill' },
];

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>

<style scoped>
.nav-section-title {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.nav-link {
  border-radius: 0;
  border-left: 3px solid transparent;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.nav-link i {
  width: 20px;
  font-size: 1.1rem;
}

.nav-link:hover {
  border-left-color: var(--tf-blue-300);
}

.nav-link.active {
  border-left-color: var(--tf-blue-400);
  background-color: var(--tf-blue-100);
  color: var(--tf-blue-500);
  font-weight: 600;
}

/* Mobile styles */
@media (max-width: 768px) {
  .app-sidebar {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
