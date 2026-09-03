<script setup lang="ts">
// vue
import { ref } from 'vue'
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { currencyService } from '@/services/currencyService'
import CurrencyDetailMenu from '@/components/currencies/menus/CurrencyDetailMenu.vue'
import DeleteModal from '@/components/common/DeleteModal.vue'
import { useResourceLoader } from '@/composables/useResourceLoader'
import { useErrorHandler } from '@/composables/useErrorHandler'
import type { Currency } from './types'

// Routing
const route = useRoute()
const router = useRouter()

// State
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Error handler for deletion
const {
  errorMessage: deletingError,
  handleError,
  clearErrors
} = useErrorHandler({
  objectName: 'Moneda'
})

// Resource loader with integrated error handling
const {
  data: currency,
  isLoading,
  errorMessage,
  load: loadCurrency
} = useResourceLoader<Currency>(currencyService.detailCurrency, {
  initialData: {
    id: 0,
    name: '',
    description: null
  },
  objectName: 'Moneda',
  gender: 'f',
  onError: (err) => {
    console.error('Error loading currency:', err)
  }
})

// Computed for modal fields
const deleteModalFields = computed(() => {
  return [
    { key: 'name', label: 'Nombre', value: currency.value?.name },
    { key: 'description', label: 'Descripción', value: currency.value?.description }
  ]
})

// Delete methods
const openDeleteModal = () => {
  clearErrors()
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await currencyService.deleteCurrency(currency.value.id)
    closeDeleteModal()
    router.push({ name: 'currencies' })
  } catch (error) {
    console.error('Error deleting currency:', error)
    handleError(error)
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadCurrency(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CurrencyDetailMenu
        :is-loading="isLoading"
        :currency="currency"
        @on-delete="openDeleteModal"
      />
    </div>

    <!-- main content -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <div v-else-if="errorMessage" class="col-md-4">
      <p class="form-text text-danger">
        {{ errorMessage }}
      </p>
    </div>

    <div v-else class="col-md-4">
      <h3>{{ currency.name }}</h3>
      <hr />
      <p><strong>Nombre:</strong> {{ currency.name }}</p>
      <p><strong>Descripción:</strong> {{ currency.description || 'Sin descripción' }}</p>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:show="showDeleteModal"
    title="Confirmar Eliminación"
    item-name="la moneda"
    :item-id="currency?.id"
    :item-identifier="currency?.name"
    :item-fields="deleteModalFields"
    :is-deleting="isDeleting"
    :error-message="deletingError"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>
