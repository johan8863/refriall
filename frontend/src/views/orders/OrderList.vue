<script setup>
// vue
import { onMounted } from 'vue'

// app
import { orderService } from '../../services/orderService'
import OrdersListTable from '../../components/orders/OrdersListTable.vue'
import OrdersListPagination from '../../components/orders/OrdersListPagination.vue'
import SearchFormListTable from '../../components/SearchFormListTable.vue'
import OrderListMenu from '../../components/orders/menus/OrderListMenu.vue'
import { usePaginationSearch } from '../../composables/usePaginationSearch.js'

const {
  items: orders,
  totalItems: ordersCount,
  currentPage,
  isLoading,
  hasSearched,
  searchTerm,
  errorMessage: orderBackendErrors,
  showPrevButton,
  showNextButton,
  loadItems,
  handleSearch,
  loadNextItems,
  loadPrevItems,
  clearSearch
} = usePaginationSearch({
  fetchFunction: orderService.listOrder,
  searchFunction: orderService.searchOrders,
  itemName: 'Orden',
  gender: 'f',
  pageSize: 10
})

// lifecycle
onMounted(async () => {
  await loadItems(1, '')
})
</script>

<template>
  <div class="row">
    <!-- side menu -->
    <div class="col-md-2">
      <OrderListMenu />
    </div>

    <!-- main content -->
    <div class="col-md-10">
      <!-- main content row -->
      <div class="row">
        <!-- search form col -->
        <div class="col-md-12 mt-1">
          <!-- search form row -->
          <SearchFormListTable
            v-model="searchTerm"
            :is-loading="isLoading"
            :has-searched="hasSearched"
            input-placeholder="Folio, cliente o dependencia..."
            @on-handle-search="handleSearch"
            @on-clear-search="clearSearch"
          />
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
                <OrdersListPagination
                  :show-prev-button="showPrevButton"
                  :show-next-button="showNextButton"
                  :is-loading="isLoading"
                  :current-page="currentPage"
                  @on-load-prev-items="loadPrevItems"
                  @on-load-next-items="loadNextItems"
                />
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
