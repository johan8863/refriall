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
  <div class="d-flex justify-content-between align-items-center mt-2">
    <button
      v-if="showPrevButton"
      class="btn btn-outline-primary btn-sm"
      @click="$emit('onLoadPrevItems')"
      :disabled="isLoading"
    >
      ← Anterior
    </button>
    <span class="text-muted">Página {{ currentPage }}</span>
    <button
      v-if="showNextButton"
      class="btn btn-outline-primary btn-sm"
      @click="$emit('onLoadNextItems')"
      :disabled="isLoading"
    >
      Siguiente →
    </button>
  </div>
</template>
