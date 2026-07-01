<script setup>
const searchTerm = defineModel({
  type: String,
  default: ''
})
defineProps({
  isLoading: {
    type: Boolean,
    required: true
  },
  hasSearched: {
    type: Boolean,
    required: true
  },
  inputPlaceholder: {
    type: String
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
        :placeholder="inputPlaceholder"
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
  <!-- search indicator -->
  <small class="text-muted" v-if="hasSearched && searchTerm">
    🔍 Mostrando resultados para: "{{ searchTerm }}"
  </small>
</template>
