<script setup>
import { nextTick } from 'vue'

/**
 * SearchFormListTable - Reusable search component with form and clear functionality
 *
 * This component provides a search input with submit button and clear functionality.
 * It supports two-way binding via v-model and emits events for search and clear actions.
 */
const searchTerm = defineModel({
  type: String,
  default: ''
})

defineProps({
  /**
   * Controls the loading state - disables input and buttons when true
   */
  isLoading: {
    type: Boolean,
    required: true
  },
  /**
   * Indicates if a search has been performed - shows clear button when true
   */
  hasSearched: {
    type: Boolean,
    required: true
  },
  /**
   * Placeholder text for the search input field
   */
  inputPlaceholder: {
    type: String
  }
})

const emit = defineEmits(['onHandleSearch', 'onClearSearch'])

/**
 * Handles the search event from the input's native search button (the "x" icon)
 *
 * When the user clicks the native clear button in the search input:
 * 1. The browser triggers the 'search' event
 * 2. The v-model updates searchTerm to an empty string
 * 3. We use nextTick to wait for Vue to finish updating the DOM
 * 4. We check if searchTerm is actually empty
 * 5. If so, we emit the clear event to the parent component
 *
 * Without nextTick, we would read the previous value of searchTerm
 * because Vue hasn't updated it yet.
 */
const handleSearchEvent = async () => {
  // Wait for Vue to finish updating the DOM and reactive state
  await nextTick()

  // Only emit clear if the input was actually cleared
  if (!searchTerm.value) {
    emit('onClearSearch')
  }
}

/**
 * Handles form submission or Enter key press
 *
 * This function is called when:
 * - The user clicks the submit button
 * - The user presses Enter key in the input field
 *
 * It simply forwards the event to the parent component.
 */
const handleSubmit = () => {
  emit('onHandleSearch')
}
</script>

<template>
  <form class="row g-2 align-items-center" @submit.prevent="handleSubmit">
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
        @keyup.enter="handleSubmit"
        @search="handleSearchEvent"
      />
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-primary" :disabled="isLoading || !searchTerm.trim()">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
        Buscar
      </button>
      <button
        type="button"
        @click="emit('onClearSearch')"
        class="btn btn-secondary ms-1"
        :disabled="isLoading"
        v-if="hasSearched"
      >
        Limpiar
      </button>
    </div>
  </form>

  <!-- Search indicator -->
  <small class="text-muted" v-if="hasSearched && searchTerm">
    🔍 Mostrando resultados para: "{{ searchTerm }}"
  </small>
</template>
