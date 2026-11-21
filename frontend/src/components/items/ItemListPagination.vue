<script setup>
defineProps({
  showPrevButton: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  showNextButton: {
    type: Boolean,
    required: true
  }
})

defineEmits(['onLoadPrevItems', 'onLoadNextItems'])
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mt-3">
    <button
      v-if="showPrevButton"
      class="btn btn-outline-primary"
      @click="$emit('onLoadPrevItems')"
      :disabled="isLoading"
      data-cy="pagination-prev"
    >
      ← Anterior
    </button>
    <span class="text-muted" data-cy="pagination-current-page">Página {{ currentPage }}</span>
    <button
      v-if="showNextButton"
      class="btn btn-outline-primary"
      @click="$emit('onLoadNextItems')"
      :disabled="isLoading"
      data-cy="pagination-next"
    >
      Siguiente →
    </button>
  </div>
</template>
