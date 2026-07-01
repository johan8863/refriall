<script setup>
// vue
import { ref, onMounted } from 'vue'

// app
import { orderService } from '../../services/orderService'
import listGroup from '../../assets/js/bootstrap_classes/listGroup'
import { errorHandler } from '../../utils/errors/errorHandler'
import OrdersListTable from '../../components/OrdersListTable.vue'

const orders = ref([])
const ordersCount = ref(0)
const currentPage = ref(1)
const showNextButton = ref(false)
const showPrevButton = ref(false)
const orderBackendErrors = ref(null)
const isLoading = ref(false)

// search variables
const hasSearched = ref(false)
const searchTerm = ref('')

const getOrders = async (page = 1) => {
  isLoading.value = true
  try {
    const resp = await orderService.listOrder(page)
    const data = resp.data

    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    ordersCount.value = data.count
    orders.value = data.results
    orderBackendErrors.value = null
  } catch (error) {
    errorHandler(error, orderBackendErrors, 'Orden')
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
    await getOrders(1)
    hasSearched.value = false
    return
  }

  restartSearchFlags()

  isLoading.value = true
  hasSearched.value = true

  try {
    const resp = await orderService.searchOrders(searchTerm.value)
    const data = resp.data

    orders.value = data.results
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
    orderBackendErrors.value = null
  } catch (error) {
    errorHandler(error, orderBackendErrors, 'Orden')
  } finally {
    isLoading.value = false
  }
}

const clearSearch = async () => {
  showNextButton.value = false
  showPrevButton.value = false

  restartSearchFlags()
  await getOrders(1)
}

const loadNextItems = async () => {
  currentPage.value += 1
  if (hasSearched.value && searchTerm.value.trim()) {
    // search purpose
    const resp = await orderService.searchOrders(searchTerm.value, currentPage.value)
    const data = resp.data
    orders.value = data.results // o bills.value
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
  } else {
    // whole pagination list
    await getOrders(currentPage.value)
  }
}

const loadPrevItems = async () => {
  currentPage.value -= 1
  if (hasSearched.value && searchTerm.value.trim()) {
    // search purpose
    const resp = await orderService.searchOrders(searchTerm.value, currentPage.value) // o searchBills
    const data = resp.data
    orders.value = data.results // o bills.value
    showNextButton.value = !!data.next
    showPrevButton.value = !!data.previous
  } else {
    // whole pagination list
    await getOrders(currentPage.value) // o getBills
  }
}

onMounted(async () => {
  await getOrders()
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <ul :class="listGroup.listGroup">
        <li :class="listGroup.listGroupItem">
          <strong>Órdenes</strong>
        </li>
        <li :class="listGroup.listGroupItem">
          <RouterLink :to="{ name: 'orders_create' }">Nueva</RouterLink>
        </li>
      </ul>
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main content row -->
      <div class="row">
        <!-- search form col -->
        <div class="col-md-12 mt-1">
          <!-- search form row -->
          <form class="row g-2 align-items-center" @submit.prevent="handleSearch">
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

        <!-- loading state -->
        <div class="col-md-12">
          <div class="row justify-content-center">
            <div class="col-md-11">
              <!-- Loading state -->
              <div v-if="isLoading" class="text-center my-2">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-1">Buscando órdenes...</p>
              </div>

              <!-- backend errors -->
              <div v-else-if="orderBackendErrors" class="alert alert-danger mt-2">
                {{ orderBackendErrors }}
              </div>

              <!-- results -->
              <div v-else-if="ordersCount > 0" class="mt-2">
                <!-- orders table -->
                <OrdersListTable :orders="orders" />
                <!-- pagination -->
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <button
                    v-if="showPrevButton"
                    class="btn btn-outline-primary btn-sm"
                    @click="loadPrevItems"
                    :disabled="isLoading"
                  >
                    ← Anterior
                  </button>
                  <span class="text-muted">Página {{ currentPage }}</span>
                  <button
                    v-if="showNextButton"
                    class="btn btn-outline-primary btn-sm"
                    @click="loadNextItems"
                    :disabled="isLoading"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>

              <!-- in case no orders -->
              <div v-else class="text-center my-3">
                <p class="lead text-muted mb-1">
                  {{ hasSearched ? 'No se encontraron órdenes' : 'No hay órdenes registradas' }}
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
