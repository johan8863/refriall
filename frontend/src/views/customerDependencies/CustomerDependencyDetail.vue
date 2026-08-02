<script setup>
// vue
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { customerDependecyService } from '../../services/customerDependencyService'
import CustomerDependencyDetailMenu from '../../components/customerDependencies/menus/CustomerDependencyDetailMenu.vue'
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
  objectName: 'Dependencia'
})

// Resource loader with integrated error handling
const {
  data: dependency,
  isLoading,
  errorMessage: customerDependencyBackendErrors,
  load: loadDependency
} = useResourceLoader(customerDependecyService.detailCustomerDependecy, {
  initialData: {
    id: null,
    customer: null,
    name: '',
    address: '',
    province: '',
    township: ''
  },
  objectName: 'Dependencia',
  gender: 'f',
  onError: (err) => {
    console.error('Error loading dependency:', err)
  }
})

// Computed for modal fields
const deleteModalFields = computed(() => {
  return [
    { key: 'name', label: 'Nombre', value: dependency.value?.name },
    { key: 'address', label: 'Dirección', value: dependency.value?.address },
    { key: 'customer', label: 'Cliente', value: dependency.value?.customer?.name }
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
    await customerDependecyService.deleteCustomerDependency(dependency.value.id)
    closeDeleteModal()
    // Redirect to customer detail
    router.push({
      name: 'customers_detail',
      params: {
        id: dependency.value.customer?.id || dependency.value.customer
      }
    })
  } catch (error) {
    console.error('Error deleting dependency:', error)
    handleError(error)
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadDependency(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerDependencyDetailMenu
        :is-loading="isLoading"
        :dependency="dependency"
        @on-delete="openDeleteModal"
      />
    </div>

    <!-- main content -->

    <!-- loading dependency data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- errors -->
    <div v-else-if="customerDependencyBackendErrors" class="col-md-4">
      <p class="form-text text-danger">
        {{ customerDependencyBackendErrors }}
      </p>
    </div>

    <!-- displaying dependency data -->
    <div v-else class="col-md-4">
      <h3>{{ dependency.name }}</h3>
      <hr />
      <p><strong>Nombre:</strong> {{ dependency.name }}</p>
      <p><strong>Dirección:</strong> {{ dependency.address || 'No especificada' }}</p>
      <p><strong>Provincia:</strong> {{ dependency.province || 'No especificada' }}</p>
      <p><strong>Municipio:</strong> {{ dependency.township || 'No especificado' }}</p>
      <p v-if="dependency.customer">
        <strong>Cliente:</strong> {{ dependency.customer.name || 'No especificado' }}
      </p>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:show="showDeleteModal"
    title="Confirmar Eliminación"
    item-name="la dependencia"
    :item-id="dependency?.id"
    :item-identifier="dependency?.name"
    :item-fields="deleteModalFields"
    :is-deleting="isDeleting"
    :error-message="deletingError"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>
