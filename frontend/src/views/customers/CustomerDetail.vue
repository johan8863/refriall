<script setup>
// vue
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// app
import { customerService } from '../../services/customerService'
import CustomerDetailMenu from '../../components/customers/menus/CustomerDetailMenu.vue'
import DeleteModal from '../../components/common/DeleteModal.vue'
import { useResourceLoader } from '../../composables/useResourceLoader.js'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// Routing
const route = useRoute()
const router = useRouter()

// State
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const searchDependencyTerm = ref('')

// Error handler for deletion
const {
  errorMessage: deletingError,
  handleError,
  clearErrors
} = useErrorHandler({
  objectName: 'Cliente'
})

// Resource loader with integrated error handling
const {
  data: customer,
  isLoading,
  errorMessage,
  load: loadCustomer
} = useResourceLoader(customerService.detailCustomer, {
  initialData: {
    id: null,
    customer_type: '',
    name: '',
    address: '',
    province: '',
    township: '',
    code: '',
    client_nit: '',
    bank_account_header: '',
    bank_account: '',
    get_dependencies: []
  },
  objectName: 'Cliente',
  gender: 'm',
  onError: (err) => {
    console.error('Error loading customer:', err)
  }
})

// Computed
const filteredDependencies = computed(() => {
  if (!searchDependencyTerm.value.trim() || !customer.value?.get_dependencies) {
    return customer.value?.get_dependencies || []
  }

  const term = searchDependencyTerm.value.toLowerCase()
  return customer.value.get_dependencies.filter((dependency) =>
    dependency.name.toLowerCase().includes(term)
  )
})

const hasDependencies = computed(() => {
  return customer.value?.get_dependencies?.length > 0
})

const deleteModalFields = computed(() => {
  return [
    { key: 'name', label: 'Nombre', value: customer.value?.name },
    { key: 'code', label: 'Código', value: customer.value?.code },
    {
      key: 'customer_type',
      label: 'Tipo',
      value: customer.value?.customer_type === 'es' ? 'ESTATAL' : 'PARTICULAR'
    }
  ]
})

// Methods
const clearDependencySearch = () => {
  searchDependencyTerm.value = ''
}

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
    await customerService.deleteCustomer(customer.value.id)
    closeDeleteModal()
    router.push({ name: 'customers' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    handleError(error)
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadCustomer(route.params.id)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerDetailMenu
        :is-loading="isLoading"
        :customer="customer"
        @on-delete="openDeleteModal"
      />
    </div>

    <!-- main content -->

    <!-- loading customer data -->
    <div v-if="isLoading" class="col-md-4">
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px">
        <span role="status" class="text-primary">Cargando datos... </span>
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
      </div>
    </div>

    <!-- error message -->
    <div v-else-if="errorMessage" class="col-md-4">
      <p class="form-text text-danger">{{ errorMessage }}</p>
    </div>

    <!-- displaying customer data -->
    <div v-else class="col-md-4">
      <h3>{{ customer.name }}</h3>
      <hr />
      <p><strong>Dirección:</strong> {{ customer.address || 'No especificada' }}</p>
      <p><strong>Provincia:</strong> {{ customer.province || 'No especificada' }}</p>
      <p><strong>Municipio:</strong> {{ customer.township || 'No especificado' }}</p>
      <p><strong>Tipo:</strong> {{ customer.customer_type === 'es' ? 'ESTATAL' : 'PARTICULAR' }}</p>
      <p><strong>Código:</strong> {{ customer.code || 'No especificado' }}</p>
      <p><strong>NIT:</strong> {{ customer.client_nit || 'No especificado' }}</p>
      <p>
        <strong>Titular de la cuenta:</strong>
        {{ customer.bank_account_header || 'No especificado' }}
      </p>
      <p><strong>Cuenta bancaria:</strong> {{ customer.bank_account || 'No especificada' }}</p>
    </div>

    <div class="col-md-6">
      <h3>Dependencias</h3>
      <hr />

      <!-- Has dependencies -->
      <div v-if="hasDependencies">
        <!-- Search for dependencies -->
        <div class="row g-2 align-items-center mb-2">
          <div class="col-auto">
            <label class="col-form-label">Buscar dependencia:</label>
          </div>
          <div class="col-auto">
            <input
              type="search"
              class="form-control form-control-sm"
              v-model="searchDependencyTerm"
              placeholder="Nombre de dependencia..."
            />
          </div>
          <div class="col-auto">
            <button
              type="button"
              @click="clearDependencySearch"
              class="btn btn-secondary btn-sm"
              v-if="searchDependencyTerm"
            >
              Limpiar
            </button>
          </div>
        </div>

        <!-- Dependencies list -->
        <div v-if="filteredDependencies.length > 0">
          <div class="list-group">
            <RouterLink
              v-for="dependency in filteredDependencies"
              :key="dependency.id"
              :to="{ name: 'customer_dependecy_detail', params: { id: dependency.id } }"
              class="list-group-item list-group-item-action"
            >
              <strong>{{ dependency.name }}</strong>
              <br />
              <small class="text-muted">
                {{ dependency.address }}, {{ dependency.township }}, {{ dependency.province }}
              </small>
            </RouterLink>
          </div>
        </div>

        <!-- No search results -->
        <div v-else-if="searchDependencyTerm" class="text-center mt-3">
          <p class="text-muted">No se encontraron dependencias</p>
        </div>
      </div>

      <!-- No dependencies -->
      <div v-else>
        <p>Este Cliente no posee dependencias.</p>
        <p>
          Para insertar una haga click
          <RouterLink :to="{ name: 'customer_dependecy_create', params: { id: customer.id } }">
            aquí.
          </RouterLink>
        </p>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <DeleteModal
    v-model:show="showDeleteModal"
    title="Confirmar Eliminación"
    item-name="el cliente"
    :item-id="customer?.id"
    :item-identifier="customer?.name"
    :item-fields="deleteModalFields"
    :is-deleting="isDeleting"
    :error-message="deletingError"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>

<style scoped>
.list-group-item {
  border-left: none;
  border-right: none;
}
.list-group-item:first-child {
  border-top: none;
}
.list-group-item:last-child {
  border-bottom: none;
}
</style>
