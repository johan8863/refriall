<script setup lang="ts">
defineProps<{
  showPrevButton: boolean
  isLoading: boolean
  currentPage: number
  showNextButton: boolean
}>()

defineEmits<{
  (e: 'onLoadPrevItems'): void
  (e: 'onLoadNextItems'): void
}>()
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mt-3">
    <button
      v-if="showPrevButton"
      class="btn btn-outline-primary"
      @click="$emit('onLoadPrevItems')"
      :disabled="isLoading"
    >
      ← Anterior
    </button>
    <span class="text-muted">Página {{ currentPage }}</span>
    <button
      v-if="showNextButton"
      class="btn btn-outline-primary"
      @click="$emit('onLoadNextItems')"
      :disabled="isLoading"
    >
      Siguiente →
    </button>
  </div>
</template>
