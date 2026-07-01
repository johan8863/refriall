<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { customerService } from '../../services/customerService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import CustomerListTable from '../../components/customers/CustomerListTable.vue'
import CustomerListPagination from '../../components/customers/CustomerListPagination.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'

// reactive objects
const customers = ref([])
const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)
const customerBackendErrors = ref(null)
const isLoading = ref(false)

// search variables
const hasSearched = ref(false)
const searchTerm = ref('')

// methods
const getCustomers = async (page = 1) => {
  isLoading.value = true
  try {
    const resp = await customerService.listCustomer(page)
    const data = resp.data

    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    customers.value = data.results
    customerBackendErrors.value = null
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const restartSearchFlags = () => {
  currentPage.value = 1
  showNextButton.value = false
  showPrevButton.value = false
}

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    await getCustomers(1)
    hasSearched.value = false
    return
  }

  restartSearchFlags()

  isLoading.value = true
  hasSearched.value = true

  try {
    const resp = await customerService.searchCustomers(searchTerm.value)
    const data = resp.data

    customers.value = data.results
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    customerBackendErrors.value = null
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = async () => {
  searchTerm.value = ''
  hasSearched.value = false

  restartSearchFlags()
  await getCustomers(1)
}

const loadNextItems = async () => {
  currentPage.value += 1
  if (hasSearched.value && searchTerm.value.trim()) {
    isLoading.value = true
    try {
      const resp = await customerService.searchCustomers(searchTerm.value, currentPage.value)
      const data = resp.data
      customers.value = data.results
      showNextButton.value = !!data.next
      showPrevButton.value = !!data.previous
    } catch (error) {
      handleError(error)
    } finally {
      isLoading.value = false
    }
  } else {
    await getCustomers(currentPage.value)
  }
}

const loadPrevItems = async () => {
  currentPage.value -= 1
  if (hasSearched.value && searchTerm.value.trim()) {
    isLoading.value = true
    try {
      const resp = await customerService.searchCustomers(searchTerm.value, currentPage.value)
      const data = resp.data
      customers.value = data.results
      showNextButton.value = !!data.next
      showPrevButton.value = !!data.previous
    } catch (error) {
      handleError(error)
    } finally {
      isLoading.value = false
    }
  } else {
    await getCustomers(currentPage.value)
  }
}

const handleError = (error) => {
  console.error('Error', error)
  if (error.response) {
    customerBackendErrors.value = `${error.response.data.detail || error.response.data} - ${error.response.status}`
  } else {
    customerBackendErrors.value = 'Error inesperado, consulte al desarrollador'
  }
}

// lifecycle
onMounted(async () => {
  await getCustomers(1)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ul :class="listGroup.listGroup">
        <li :class="listGroup.listGroupItem">
          <strong>Clientes</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'customers_create' }">Nuevo</RouterLink>
        </li>
      </ul>
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main row content -->
      <div class="row">
        <div class="col-md-12 mt-1">
          <!-- row search form -->
          <SearchFormListTable
            v-model="searchTerm"
            :is-loading="isLoading"
            :has-searched="hasSearched"
            input-placeholder="Nombre del cliente..."
            @on-handle-search="handleSearch"
            @on-clear-search="clearSearch"
          />
        </div>

        <div class="col-md-12">
          <!-- loading state -->
          <div v-if="isLoading" class="text-center my-2">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-1">Buscando clientes...</p>
          </div>

          <!-- backend errors -->
          <div v-else-if="customerBackendErrors" class="alert alert-danger mt-2">
            {{ customerBackendErrors }}
          </div>

          <!-- results -->
          <div v-else-if="customers.length > 0" class="mt-2">
            <!-- customers list table -->
            <CustomerListTable :customers="customers" />

            <!-- pagination -->
            <CustomerListPagination
              :show-prev-button="showPrevButton"
              :is-loading="isLoading"
              :current-page="currentPage"
              :show-next-button="showNextButton"
              @on-load-prev-items="loadPrevItems"
              @on-load-next-items="loadNextItems"
            />
          </div>

          <!-- in case no customers -->
          <div v-else class="text-center my-3">
            <p class="lead text-muted mb-1">
              {{ hasSearched ? 'No se encontraron clientes' : 'No hay clientes registrados' }}
            </p>
            <button v-if="hasSearched" class="btn btn-outline-primary btn-sm" @click="clearSearch">
              Volver a lista completa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
