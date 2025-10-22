<template>
  <div class="data-table">
    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="{ 'sortable-header': column.sortable }"
              @click="column.sortable && handleSort(column.key)"
            >
              {{ column.label }}
              <span v-if="column.sortable && sortBy === column.key" class="sort-icon">
                <i :class="sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in sortedData" :key="row[rowKey]" @click="handleRowClick(row)">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                <span v-if="column.format">
                  {{ column.format(row[column.key], row) }}
                </span>
                <span v-else>{{ row[column.key] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination" class="d-flex justify-content-between align-items-center mt-3">
      <div class="text-muted small">
        Showing {{ ((pagination.page - 1) * pagination.pageSize) + 1 }} to
        {{ Math.min(pagination.page * pagination.pageSize, pagination.totalItems || 0) }} of
        {{ pagination.totalItems || 0 }} results
      </div>
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: pagination.page === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(pagination.page - 1)">Previous</a>
          </li>
          <li
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ active: page === pagination.page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: pagination.page >= (pagination.totalPages || 1) }">
            <a class="page-link" href="#" @click.prevent="changePage(pagination.page + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginationConfig } from '~/types/filter';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  format?: (value: any, row: any) => string;
}

interface Props {
  data: any[];
  columns: Column[];
  rowKey: string;
  pagination?: PaginationConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  rowClick: [row: any]
  sort: [key: string, direction: 'asc' | 'desc']
  pageChange: [page: number]
}>();

const sortBy = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

const sortedData = computed(() => {
  if (!sortBy.value) return props.data;

  return [...props.data].sort((a, b) => {
    const aVal = a[sortBy.value!];
    const bVal = b[sortBy.value!];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

const visiblePages = computed(() => {
  if (!props.pagination) return [];

  const { page, totalPages = 1 } = props.pagination;
  const maxVisible = 5;
  const pages: number[] = [];

  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const handleSort = (key: string) => {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDirection.value = 'asc';
  }

  emit('sort', key, sortDirection.value);
};

const handleRowClick = (row: any) => {
  emit('rowClick', row);
};

const changePage = (page: number) => {
  if (!props.pagination) return;

  const { totalPages = 1 } = props.pagination;
  if (page < 1 || page > totalPages) return;

  emit('pageChange', page);
};
</script>

<style scoped>
.data-table {
  width: 100%;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
}

tbody tr {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sortable-header {
  user-select: none;
}

.sortable-header:hover {
  background-color: var(--tf-gray-200);
}

.sort-icon {
  font-size: 0.75rem;
  margin-left: 0.25rem;
}
</style>
