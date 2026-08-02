<script setup>
// vue
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { providerService } from '../../services/providerService'
import ProviderDetailMenu from '../../components/providers/menus/ProviderDetailMenu.vue'
import DeleteModal from '../../components/common/DeleteModal.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

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
  objectName: 'Proveedor'
})

// Resource loader with integrated error handling
const {
  data: provider,
  isLoading,
  errorMessage,
  load: loadProvider
} = useResourceLoader(providerService.detailProvider, {
  initialData: {
    id: null,
    username: '',
    first_name: '',
    last_name: '',
    license_number: '',
    tcp_code: '',
    personal_id: '',
    bank_account_header: '',
    bank_account: ''
  },
  objectName: 'Proveedor',
  gender: 'm',
  onError: (err) => {
    console.error('Error loading provider:', err)
  }
})

// Computed
const fullName = computed(() => {
  if (!provider.value) return ''
  return (
    `${provider.value.first_name || ''} ${provider.value.last_name || ''}`.trim() || 'Sin nombre'
  )
})

const deleteModalFields = computed(() => {
  return [
    { key: 'first_name', label: 'Nombre', value: provider.value?.first_name },
    { key: 'last_name', label: 'Apellidos', value: provider.value?.last_name },
    { key: 'personal_id', label: 'CI', value: provider.value?.personal_id },
    { key: 'license_number', label: 'Licencia', value: provider.value?.license_number }
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
    await providerService.deleteProvider(provider.value.id)
    closeDeleteModal()
    router.push({ name: 'providers' })
  } catch (error) {
    console.error('Error deleting provider:', error)

    // Handle error manually to ensure it displays correctly in modal
    if (error.response) {
      if (error.response.status === 400) {
        // Provider has associated orders
        const errorData = error.response.data
        // Try to extract the error message from different possible structures
        let errorMessageText = 'El prestador no se puede eliminar porque tiene órdenes asociadas.'

        if (errorData && typeof errorData === 'object') {
          if (errorData.detail) {
            errorMessageText = errorData.detail
          } else if (errorData.message) {
            errorMessageText = errorData.message
          } else if (errorData.non_field_errors) {
            errorMessageText = errorData.non_field_errors.join(' ')
          } else if (errorData.error) {
            errorMessageText = errorData.error
          }
        }

        // Set the error message directly
        deletingError.value = errorMessageText
      } else if (error.response.status === 404) {
        deletingError.value = 'El prestador que intenta eliminar no existe.'
      } else {
        // Let useErrorHandler handle other errors
        handleError(error)
      }
    } else {
      // Network or other errors
      deletingError.value = error.message || 'Error inesperado, consulte al desarrollador'
    }

    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadProvider(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ProviderDetailMenu
        :provider="provider"
        :is-loading="isLoading"
        @on-delete="openDeleteModal"
      />
    </div>

    <!-- loading provider data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="errorMessage" class="col-md-4">
      <span class="form-text text-danger">
        {{ errorMessage }}
      </span>
    </div>

    <!-- main content -->
    <div v-else class="col-md-4">
      <h3>{{ fullName }}</h3>
      <hr />
      <p><strong>Nombre de usuario:</strong> {{ provider.username || 'No especificado' }}</p>
      <p><strong>CI:</strong> {{ provider.personal_id || 'No especificado' }}</p>
      <p><strong>Licencia:</strong> {{ provider.license_number || 'No especificada' }}</p>
      <p><strong>Código TCP:</strong> {{ provider.tcp_code || 'No especificado' }}</p>
      <p>
        <strong>Titular de Cuenta:</strong> {{ provider.bank_account_header || 'No especificado' }}
      </p>
      <p><strong>Nro de Cuenta:</strong> {{ provider.bank_account || 'No especificado' }}</p>
    </div>
  </div>
  <!-- end row -->

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:show="showDeleteModal"
    title="Confirmar Eliminación"
    item-name="el prestador"
    :item-id="provider?.id"
    :item-identifier="fullName"
    :item-fields="deleteModalFields"
    :is-deleting="isDeleting"
    :error-message="deletingError"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>
