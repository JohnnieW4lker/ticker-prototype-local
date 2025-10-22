<template>
  <div class="notes-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>{{ symbol }} Notes</h2>
        <p class="text-muted mb-0">Your research notes and observations</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="showAddNote = true">
          <i class="bi bi-plus-circle me-2"></i>Add Note
        </button>
        <NuxtLink :to="`/stock/${symbol}`" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back
        </NuxtLink>
      </div>
    </div>

    <!-- Notes List -->
    <div v-if="notes.length === 0" class="card">
      <div class="card-body text-center py-5 text-muted">
        <i class="bi bi-journal-x fs-1 d-block mb-3"></i>
        <p>No notes yet. Add your first note to track your research.</p>
        <button class="btn btn-primary" @click="showAddNote = true">
          <i class="bi bi-plus-circle me-2"></i>Create First Note
        </button>
      </div>
    </div>

    <div v-else class="notes-list">
      <div v-for="note in notes" :key="note.id" class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="badge bg-secondary me-2">{{ note.type }}</span>
              <small class="text-muted">{{ formatDate(note.date) }}</small>
            </div>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary" @click="editNote(note)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" @click="deleteNote(note.id)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <h5 class="card-title">{{ note.title }}</h5>
          <p class="card-text">{{ note.content }}</p>
          <div v-if="note.tags && note.tags.length > 0" class="mt-2">
            <span v-for="tag in note.tags" :key="tag" class="badge bg-light text-dark me-1">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Note Modal -->
    <div v-if="showAddNote" class="modal fade show d-block" tabindex="-1" @click.self="showAddNote = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingNote ? 'Edit Note' : 'Add Note' }}</h5>
            <button type="button" class="btn-close" @click="showAddNote = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Type</label>
              <select v-model="noteForm.type" class="form-select">
                <option value="analysis">Analysis</option>
                <option value="observation">Observation</option>
                <option value="reminder">Reminder</option>
                <option value="research">Research</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input v-model="noteForm.title" type="text" class="form-control" placeholder="Note title">
            </div>
            <div class="mb-3">
              <label class="form-label">Content</label>
              <textarea v-model="noteForm.content" class="form-control" rows="6" placeholder="Your notes..."></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Tags (comma-separated)</label>
              <input v-model="noteForm.tagsInput" type="text" class="form-control" placeholder="bullish, earnings, revenue">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddNote = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveNote">Save Note</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddNote" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
interface Note {
  id: string;
  symbol: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

const route = useRoute();
const symbol = computed(() => (route.params.symbol as string).toUpperCase());

const notes = ref<Note[]>([]);
const showAddNote = ref(false);
const editingNote = ref<Note | null>(null);
const noteForm = ref({
  type: 'analysis',
  title: '',
  content: '',
  tagsInput: '',
});

const loadNotes = () => {
  // Load from localStorage
  const stored = localStorage.getItem(`notes_${symbol.value}`);
  if (stored) {
    notes.value = JSON.parse(stored);
  }
};

const saveNote = () => {
  const tags = noteForm.value.tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t);

  if (editingNote.value) {
    const index = notes.value.findIndex(n => n.id === editingNote.value!.id);
    notes.value[index] = {
      ...editingNote.value,
      ...noteForm.value,
      tags,
    };
  } else {
    notes.value.unshift({
      id: `note-${Date.now()}`,
      symbol: symbol.value,
      ...noteForm.value,
      tags,
      date: new Date().toISOString(),
    });
  }

  localStorage.setItem(`notes_${symbol.value}`, JSON.stringify(notes.value));

  showAddNote.value = false;
  editingNote.value = null;
  noteForm.value = { type: 'analysis', title: '', content: '', tagsInput: '' };
};

const editNote = (note: Note) => {
  editingNote.value = note;
  noteForm.value = {
    type: note.type,
    title: note.title,
    content: note.content,
    tagsInput: note.tags.join(', '),
  };
  showAddNote.value = true;
};

const deleteNote = (id: string) => {
  if (confirm('Are you sure you want to delete this note?')) {
    notes.value = notes.value.filter(n => n.id !== id);
    localStorage.setItem(`notes_${symbol.value}`, JSON.stringify(notes.value));
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

onMounted(() => loadNotes());
watch(() => route.params.symbol, () => loadNotes());
</script>

<style scoped>
.notes-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.notes-list {
  margin-top: 1rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.card-text {
  color: var(--tf-text-muted);
  white-space: pre-wrap;
}
</style>
