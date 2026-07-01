<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { billService } from '../../services/billService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import BillListTable from '../../components/bills/BillListTable.vue'
import BillListPaginatin from '../../components/bills/BillListPaginatin.vue'

const bills = ref([])
const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)
const billBackendErrors = ref(null)
const isLoading = ref(false)

// search variables
const hasSearched = ref(false)
const searchTerm = ref('')

const getBills = async (page = 1) => {
  isLoading.value = true
  try {
    const resp = await billService.listBillsPagination(page)
    const data = resp.data

    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    bills.value = data.results
    billBackendErrors.value = null
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
    await getBills(1)
    hasSearched.value = false
    return
  }

  restartSearchFlags()

  isLoading.value = true
  hasSearched.value = true

  try {
    const resp = await billService.searchBills(searchTerm.value)
    const data = resp.data

    bills.value = data.results
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    billBackendErrors.value = null
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
  await getBills(1)
}

const loadNextItems = async () => {
  currentPage.value += 1
  if (hasSearched.value && searchTerm.value.trim()) {
    // Search purpose
    const resp = await billService.searchBills(searchTerm.value, currentPage.value)
    const data = resp.data
    bills.value = data.results // o bills.value
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
  } else {
    // whole pagination list
    await getBills(currentPage.value)
  }
}

const loadPrevItems = async () => {
  currentPage.value -= 1
  if (hasSearched.value && searchTerm.value.trim()) {
    // search purpose
    const resp = await billService.searchBills(searchTerm.value, currentPage.value)
    const data = resp.data
    bills.value = data.results // o bills.value
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
  } else {
    // whole pagination list
    await getBills(currentPage.value)
  }
}

const handleError = (error) => {
  console.error('Error', error)
  if (error.response) {
    billBackendErrors.value = `${error.response.data.detail || error.response.data} - ${error.response.status}`
  } else {
    billBackendErrors.value = 'Error inesperado, consulte al desarrollador'
  }
}

onMounted(async () => {
  await getBills(1)
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ul :class="listGroup.listGroup">
        <li :class="listGroup.listGroupItem">
          <strong>Facturas</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'bills_create' }">Nueva</RouterLink>
        </li>
      </ul>
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main row content -->
      <div class="row">
        <div class="col-md-12 mt-1">
          <!-- search form row -->
          <form class="row g-2 align-items-center" @submit.prevent="handleSearch">
            <div class="col-auto">
              <label for="searchBillText" class="col-form-label">Búsqueda:</label>
            </div>
            <div class="col-auto">
              <input
                type="search"
                class="form-control"
                id="searchBillText"
                v-model="searchTerm"
                placeholder="Folio o cliente..."
                :disabled="isLoading"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="col-auto">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading || !searchTerm.trim()"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                Buscar
              </button>
              <button
                type="button"
                @click="clearSearch"
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
        </div>

        <div class="col-md-12">
          <div class="row justify-content-center">
            <div class="col-md-11">
              <!-- loading state -->
              <div v-if="isLoading" class="text-center my-2">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-1">Buscando facturas...</p>
              </div>

              <!-- backend errors -->
              <div v-else-if="billBackendErrors" class="alert alert-danger mt-2">
                {{ billBackendErrors }}
              </div>

              <!-- results -->
              <div v-else-if="bills.length > 0" class="mt-2">
                <!-- bill list table -->
                <BillListTable :bills="bills" />

                <!-- pagination -->
                <BillListPaginatin
                  :show-prev-button="showPrevButton"
                  :show-next-button="showNextButton"
                  :current-page="currentPage"
                  :is-loading="isLoading"
                  @on-load-prev-items="loadPrevItems"
                  @on-load-next-items="loadNextItems"
                />
              </div>

              <!-- in case no bills -->
              <div v-else class="text-center my-3">
                <p class="lead text-muted mb-1">
                  {{ hasSearched ? 'No se encontraron facturas' : 'No hay facturas registradas' }}
                </p>
                <button
                  v-if="hasSearched"
                  class="btn btn-outline-primary btn-sm"
                  @click="clearSearch"
                >
                  Volver a lista completa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.table th {
  font-weight: 600;
  text-align: center;
  padding: 0.5rem;
}
.table td {
  text-align: center;
  padding: 0.5rem;
}
</style>
