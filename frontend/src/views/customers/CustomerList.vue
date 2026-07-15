<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import CustomerListMenu from '../../components/customers/menus/CustomerListMenu.vue'
import CustomerListPagination from '../../components/customers/CustomerListPagination.vue'
import CustomerListTable from '../../components/customers/CustomerListTable.vue'
import { customerService } from '../../services/customerService'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import { useErrorHandler } from '../../composables/useErrorHandler.js'

// reactive objects
const customers = ref([])
const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)
const isLoading = ref(false)

// search variables
const hasSearched = ref(false)
const searchTerm = ref('')

// errors objects
const { errorMessage, handleError, clearErrors } = useErrorHandler({
  objectName: 'Clientes',
  gender: 'm'
})

// methods
const loadCustomers = async (page = 1, search = '') => {
  isLoading.value = true
  clearErrors()

  try {
    const resp = search
      ? await customerService.searchCustomers(search, page)
      : await customerService.listCustomer(page)

    const data = resp.data
    customers.value = data.results

    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const getCustomers = (page) => loadCustomers(page, '')

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    await loadCustomers(1, '')
    hasSearched.value = false
    return
  }
  hasSearched.value = true
  currentPage.value = 1
  await loadCustomers(1, searchTerm.value)
}

const loadNextItems = async () => {
  currentPage.value += 1
  const search = hasSearched.value ? searchTerm.value : ''
  await loadCustomers(currentPage.value, search)
}

const loadPrevItems = async () => {
  currentPage.value -= 1
  const search = hasSearched.value ? searchTerm.value : ''
  await loadCustomers(currentPage.value, search)
}

const clearSearch = async () => {
  searchTerm.value = ''
  hasSearched.value = false
  currentPage.value = 1
  customers.value = loadCustomers(1, '')
}

// lifecycle
onMounted(async () => await loadCustomers(1, ''))
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <CustomerListMenu />
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
          <div v-else-if="errorMessage" class="alert alert-danger mt-2">
            {{ errorMessage }}
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
