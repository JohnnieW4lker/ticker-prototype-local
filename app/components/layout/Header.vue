<template>
  <header class="app-header">
    <div class="container-fluid h-100">
      <div class="d-flex align-items-center h-100">
        <!-- Logo -->
        <div class="header-logo">
          <NuxtLink to="/" class="d-flex align-items-center text-decoration-none">
            <img
              src="https://www.tickerfilter.com/public/img/logo.png"
              alt="TickerFilter"
              class="logo-image"
            />
          </NuxtLink>
        </div>

        <!-- Main Navigation -->
        <nav class="header-nav d-none d-lg-flex ms-4">
          <NuxtLink to="/" class="nav-link" :class="{ active: isActive('/') }">
            <i class="bi bi-house-door me-1"></i>
            Dashboard
          </NuxtLink>
          <NuxtLink to="/screener" class="nav-link" :class="{ active: isActive('/screener') }">
            <i class="bi bi-funnel me-1"></i>
            Screener
          </NuxtLink>
          <NuxtLink to="/watchlists" class="nav-link" :class="{ active: isActive('/watchlists') }">
            <i class="bi bi-eye me-1"></i>
            Watchlists
          </NuxtLink>
          <NuxtLink to="/events" class="nav-link" :class="{ active: isActive('/events') }">
            <i class="bi bi-calendar3 me-1"></i>
            Events
          </NuxtLink>
          <NuxtLink to="/markets" class="nav-link" :class="{ active: isActive('/markets') }">
            <i class="bi bi-graph-up me-1"></i>
            Markets
          </NuxtLink>
        </nav>

        <!-- Search Bar -->
        <div class="header-search ms-auto me-3">
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search stocks..."
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
            <button class="btn btn-outline-light" type="button" @click="handleSearch">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Market Status -->
        <div class="header-status d-none d-xl-block me-3">
          <div class="d-flex align-items-center">
            <span class="status-badge me-2" :class="isMarketOpen ? 'status-open' : 'status-closed'">
              {{ isMarketOpen ? 'Market Open' : 'Market Closed' }}
            </span>
            <small class="text-white-50">{{ currentTime }}</small>
          </div>
        </div>

        <!-- User Actions -->
        <div class="header-actions">
          <button class="btn btn-sm btn-outline-light me-2" @click="togglePremium">
            <i class="bi bi-star-fill me-1"></i>
            {{ isPremium ? 'Premium' : 'Upgrade' }}
          </button>
          <button class="btn btn-sm btn-primary">
            <i class="bi bi-person-circle me-1"></i>
            Account
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="btn btn-sm btn-outline-light d-lg-none ms-2" @click="toggleMobileMenu">
          <i class="bi bi-list fs-5"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="mobileMenuOpen" class="mobile-menu d-lg-none">
      <nav class="mobile-nav">
        <NuxtLink to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="bi bi-house-door me-2"></i>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/screener" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="bi bi-funnel me-2"></i>
          Filters
        </NuxtLink>
        <NuxtLink to="/watchlists" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="bi bi-eye me-2"></i>
          Watchlists
        </NuxtLink>
        <NuxtLink to="/events" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="bi bi-calendar3 me-2"></i>
          Events
        </NuxtLink>
        <NuxtLink to="/markets" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="bi bi-graph-up me-2"></i>
          Markets
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const searchQuery = ref('');
const currentTime = ref('');
const isMarketOpen = ref(true);
const isPremium = ref(false);
const mobileMenuOpen = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/stock/${searchQuery.value.toUpperCase()}`);
    searchQuery.value = '';
    mobileMenuOpen.value = false;
  }
};

const togglePremium = () => {
  isPremium.value = !isPremium.value;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const hour = now.getHours();
  isMarketOpen.value = hour >= 9 && hour < 16;
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 60000); // Update every minute
});
</script>

<style scoped>
.logo-image {
  height: 40px;
  width: auto;
}

.header-nav {
  display: flex;
  gap: 0.25rem;
}

.header-search {
  width: 300px;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--tf-action);
  color: white;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.status-open {
  background-color: var(--tf-success);
  color: white;
}

.status-closed {
  background-color: var(--tf-danger);
  color: white;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--tf-primary);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
}

.mobile-nav-link {
  color: rgba(255, 255, 255, 0.85);
  padding: 1rem 1.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 991px) {
  .header-search {
    width: 200px;
  }
}

@media (max-width: 575px) {
  .header-search {
    display: none;
  }
}
</style>
