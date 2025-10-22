<template>
  <div class="news-item">
    <div class="news-content">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="news-title mb-0">
          <a :href="article.url" target="_blank" rel="noopener noreferrer">
            {{ article.title }}
          </a>
        </h6>
        <span
          class="badge ms-2"
          :class="{
            'bg-success': article.sentiment === 'positive',
            'bg-danger': article.sentiment === 'negative',
            'bg-secondary': article.sentiment === 'neutral',
          }"
        >
          {{ article.sentiment }}
        </span>
      </div>
      <p class="news-summary mb-2">{{ article.summary }}</p>
      <div class="news-meta">
        <span class="news-source">
          <i class="bi bi-newspaper me-1"></i>
          {{ article.source }}
        </span>
        <span class="news-date">
          <i class="bi bi-clock me-1"></i>
          {{ formatDate(article.publishedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsArticle } from '~/types/stock';

interface Props {
  article: NewsArticle;
}

defineProps<Props>();

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};
</script>

<style scoped>
.news-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--tf-border-color);
}

.news-item:last-child {
  border-bottom: none;
}

.news-title a {
  color: var(--tf-text-primary);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: color 0.2s;
}

.news-title a:hover {
  color: var(--tf-primary);
}

.news-summary {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.news-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--tf-text-muted);
}

.news-source,
.news-date {
  display: flex;
  align-items: center;
}
</style>
