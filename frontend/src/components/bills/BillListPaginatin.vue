<script setup lang="ts">
defineProps<{
  showPrevButton: boolean
  showNextButton: boolean
  currentPage: number
  isLoading: boolean
}>()

defineEmits<{
  (e: 'onLoadPrevItems'): void
  (e: 'onLoadNextItems'): void
}>()
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
