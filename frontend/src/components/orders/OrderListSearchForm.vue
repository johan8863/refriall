<script setup>
const searchTerm = defineModel()
defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
})
defineEmits(['onHandleSearch', 'onClearSearch'])
</script>
<template>
  <form class="row g-2 align-items-center" @submit.prevent="$emit('onHandleSearch')">
    <div class="col-auto">
      <label for="searchOrderText" class="col-form-label">Búsqueda:</label>
    </div>
    <div class="col-auto">
      <input
        type="search"
        class="form-control"
        id="searchOrderText"
        v-model="searchTerm"
        placeholder="Folio, cliente o dependencia..."
        :disabled="isLoading"
        @keyup.enter="$emit('onHandleSearch')"
      />
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-primary" :disabled="isLoading || !searchTerm.trim()">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
        Buscar
      </button>
      <button
        type="button"
        @click="$emit('onClearSearch')"
        class="btn btn-secondary ms-1"
        :disabled="isLoading"
        v-if="hasSearched"
      >
        Limpiar
      </button>
    </div>
  </form>
</template>
